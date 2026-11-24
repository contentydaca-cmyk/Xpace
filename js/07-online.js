        /**
         * XPACE ONLINE (v15)
         * Публичный онлайн-релей без регистрации и серверов:
         *   - резервный канал и локальный кэш таблицы рекордов;
         *   - счётчик пилотов в сети (presence);
         *   - офлайн-кэш и автоматический фолбэк в локальный режим.
         * Транспорт — ntfy.sh (открытый HTTP pub/sub с CORS).
         */
        const ONLINE_CONFIG = {
            relay: 'https://ntfy.sh',
            topic: 'xpace_arcade_v15_live_8f3a2c',
            accountsTopic: 'xpace_arcade_v16_accounts_9d4e1b',
            presenceWindowMs: 90 * 1000,
            presenceIntervalMs: 55 * 1000,
            requestTimeoutMs: 7500,
            cacheKey: 'xpace_online_board_v1'
        };

        function leaderboardBestScores(record = {}, previous = {}) {
            const points = value => {
                const score = Number(value);
                return Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0;
            };
            const bestScoreDrive = Math.max(points(record.bestScoreDrive ?? record.bestScore), points(previous.bestScoreDrive ?? previous.bestScore));
            const bestScoreClearance = Math.max(points(record.bestScoreClearance), points(previous.bestScoreClearance));
            const bestExpeditionSectors = Math.max(points(record.bestExpeditionSectors), points(previous.bestExpeditionSectors));
            return {
                bestScore: Math.max(points(record.bestScore), points(previous.bestScore), bestScoreDrive, bestScoreClearance),
                bestScoreDrive, bestScoreClearance, bestExpeditionSectors
            };
        }

        function mergeLeaderboardRecords(records) {
            const aliases = new Map();
            const byUid = new Map();
            // Apply newer public snapshots last. Missing fields in older clients are unknown.
            const ordered = records.filter(rec => typeof rec?.uid === 'string' && rec.uid && !rec.isDev)
                .sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
            function link(alias, uid) {
                if (typeof alias !== 'string' || !alias || alias === uid || alias.startsWith('acc:')) return;
                const previous = aliases.get(alias);
                aliases.set(alias, previous === undefined || previous === uid ? uid : null);
            }
            for (const rec of ordered) {
                if (rec.uid.startsWith('acc:') && /^pilot-[a-z0-9]+$/.test(rec.previousGuestUid)) {
                    link(rec.previousGuestUid, rec.uid);
                }
            }
            for (const rec of ordered) {
                const uid = aliases.get(rec.uid) || rec.uid;
                link(rec.legacyUid, uid);
                if (Array.isArray(rec.legacyUids)) {
                    for (const alias of rec.legacyUids) link(alias, uid);
                }
            }
            for (const rec of ordered) {
                const uid = aliases.get(rec.uid) || rec.uid;
                const previous = byUid.get(uid);
                byUid.set(uid, {
                    ...previous, ...rec, uid,
                    previousGuestUid: rec.previousGuestUid || previous?.previousGuestUid || null,
                    ...leaderboardBestScores(rec, previous),
                    ...collectionCounts(previous || {}), ...collectionCounts(rec),
                    passLevel: Math.max(1, Number(rec.passLevel) || 1, previous?.passLevel || 1)
                });
            }
            // Keep every confirmed ID through offline cache round trips, including older devices.
            for (const record of byUid.values()) record.legacyUids = [];
            for (const [alias, uid] of aliases) {
                if (uid) byUid.get(uid)?.legacyUids.push(alias);
            }
            return [...byUid.values()].sort((a, b) => b.bestScore - a.bestScore);
        }

        function visibleLeaderboardProfiles(records, myUid) {
            // Pre-migration snapshots sometimes have no link back to their new profile.
            // Collapse exact legacy copies in the view only, retaining both source records.
            const groups = new Map();
            for (const rec of records) {
                const nick = String(rec.nickname || '').trim().toLowerCase();
                const key = nick && nick !== 'пилот' && (rec.bestScore || rec.bestExpeditionSectors)
                    ? JSON.stringify([nick, rec.bestScore, rec.bestScoreDrive, rec.bestScoreClearance, rec.bestExpeditionSectors,
                        rec.passLevel, rec.equippedTitle, rec.equippedTheme, rec.dailyStreak || 0])
                    : rec.uid;
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(rec);
            }
            return [...groups.values()].flatMap(group => {
                const identified = group.filter(rec => rec.uid.startsWith('acc:') || rec.ownedShips !== undefined);
                if (identified.length > 1) return group;
                return group.find(rec => rec.uid === myUid) || identified[0] || group[0];
            });
        }

        class XpaceOnline {
            constructor() {
                this.status = 'CHECKING'; // CHECKING | ONLINE | OFFLINE
                this.firebaseStatus = 'не проверен';
                this.lastError = '';
                this.lastSyncAt = 0;
                this.lastPushAt = 0;
                this.publishedScores = new Map();
                this.pilotsOnline = 0;
                this.board = [];
                this.identity = { uid: this.getLocalUid(), nickname: 'Пилот', title: 'novice', theme: 'default', level: 1, score: 0 };
                this.probePromise = null;
                this.presenceTimer = null;
                this.autoRetryTimer = null;
                this.statusListeners = [];
                this.loadCache();
            }

            // Постоянный сетевой ID устройства (нужен для presence и рекордов до входа в профиль)
            getLocalUid() {
                try {
                    let uid = localStorage.getItem('xpace_online_uid_v1');
                    if (!uid) {
                        uid = 'xp-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
                        localStorage.setItem('xpace_online_uid_v1', uid);
                    }
                    return uid;
                } catch (e) {
                    if (!this._memUid) this._memUid = 'xp-' + Math.random().toString(36).slice(2, 10);
                    return this._memUid;
                }
            }

            onStatus(cb) {
                this.statusListeners.push(cb);
            }

            emit(status) {
                if (status) this.status = status;
                this.statusListeners.forEach(cb => {
                    try { cb(this.status, this); } catch (e) {}
                });
            }

            setIdentity(identity) {
                this.identity = { ...this.identity, ...(identity || {}) };
            }

            setFirebaseStatus(text) {
                this.firebaseStatus = text || 'не проверен';
            }

            loadCache() {
                try {
                    const raw = localStorage.getItem(ONLINE_CONFIG.cacheKey);
                    if (!raw) return;
                    const parsed = JSON.parse(raw);
                    if (parsed && Array.isArray(parsed.board)) {
                        this.board = parsed.board;
                        this.lastSyncAt = Number(parsed.savedAt) || 0;
                    }
                } catch (e) {}
            }

            saveCache() {
                try {
                    localStorage.setItem(ONLINE_CONFIG.cacheKey, JSON.stringify({
                        board: this.board,
                        savedAt: this.lastSyncAt
                    }));
                } catch (e) {}
            }

            async request(url, options = {}) {
                const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                const timer = controller
                    ? setTimeout(() => controller.abort(), ONLINE_CONFIG.requestTimeoutMs)
                    : null;
                try {
                    const response = await fetch(url, {
                        ...options,
                        signal: controller ? controller.signal : undefined,
                        cache: 'no-store'
                    });
                    return response;
                } finally {
                    if (timer) clearTimeout(timer);
                }
            }

            rememberLeaderboard(records) {
                this.board = this.deduplicateRecords([...this.board, ...records]);
                this.saveCache();
                return this.board;
            }

            // Опрос публичного канала и объединение с уже сохранёнными рекордами.
            async probe(force = false) {
                if (this.probePromise && !force) return this.probePromise;
                this.emit('CHECKING');
                this.probePromise = (async () => {
                    try {
                        const url = `${ONLINE_CONFIG.relay}/${ONLINE_CONFIG.topic}/json?poll=1&since=all`;
                        const res = await this.request(url);
                        if (!res.ok) throw new Error('HTTP ' + res.status);
                        const text = await res.text();
                        const entries = this.parseEntries(text);
                        this.pilotsOnline = this.countOnline(entries);
                        this.lastSyncAt = Date.now();
                        this.lastError = '';
                        this.rememberLeaderboard(this.buildBoard(entries));
                        this.emit('ONLINE');
                        return true;
                    } catch (err) {
                        this.lastError = (err && err.message) ? err.message : 'нет ответа';
                        this.emit('OFFLINE');
                        this.scheduleRetry();
                        return false;
                    } finally {
                        this.probePromise = null;
                    }
                })();
                return this.probePromise;
            }

            scheduleRetry(delayMs = 45000) {
                if (this.autoRetryTimer) return;
                this.autoRetryTimer = setTimeout(() => {
                    this.autoRetryTimer = null;
                    if (this.status !== 'ONLINE') this.probe(true).catch(() => {});
                }, delayMs);
            }

            parseEntries(rawText) {
                const entries = [];
                const lines = String(rawText || '').split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;
                    try {
                        const envelope = JSON.parse(trimmed);
                        if (!envelope || envelope.event !== 'message' || typeof envelope.message !== 'string') continue;
                        const payload = JSON.parse(envelope.message);
                        if (!payload || typeof payload !== 'object') continue;
                        const ts = Number(payload.ts) || Number(envelope.time) * 1000 || 0;
                        entries.push({ ...payload, ts });
                    } catch (e) {}
                }
                return entries;
            }

            getHiddenLeaderboardRules() {
                try {
                    const raw = localStorage.getItem('xpace_hidden_lb_v1');
                    const parsed = raw ? JSON.parse(raw) : null;
                    return {
                        nicks: Array.isArray(parsed && parsed.nicks) ? parsed.nicks : [],
                        uids: Array.isArray(parsed && parsed.uids) ? parsed.uids : [],
                        hideGuests: Boolean(parsed && parsed.hideGuests)
                    };
                } catch (e) {
                    return { nicks: [], uids: [], hideGuests: false };
                }
            }

            saveHiddenLeaderboardRules(rules) {
                try {
                    localStorage.setItem('xpace_hidden_lb_v1', JSON.stringify(rules));
                } catch (e) {}
            }

            isExcludedTesterRecord(rec) {
                if (!rec) return true;
                if (rec.isDev) return true;
                const u = String(rec.uid || '').toLowerCase();
                if (u.startsWith('acc:dev_') || u.startsWith('acc:test_') || u.endsWith('_dev')) return true;
                const rules = this.getHiddenLeaderboardRules();
                if (rules.hideGuests && !u.startsWith('acc:')) return true;
                if (rules.uids.some(x => x.toLowerCase() === u)) return true;
                const nickLower = String(rec.nickname || '').trim().toLowerCase();
                if (nickLower && rules.nicks.some(x => x.toLowerCase() === nickLower)) return true;
                return false;
            }

            deduplicateRecords(records) {
                const eligible = records.filter(record => !this.isExcludedTesterRecord(record));
                return mergeLeaderboardRecords(eligible);
            }

            buildBoard(entries) {
                const rawRecords = [];
                entries.forEach(entry => {
                    if (!entry || entry.kind !== 'score') return;
                    const uid = String(entry.uid || '').slice(0, 64);
                    if (!uid) return;
                    const score = Math.max(0, Math.floor(Number(entry.score) || 0));
                    const sDrive = entry.scoreDrive !== undefined
                        ? Math.max(0, Math.floor(Number(entry.scoreDrive) || 0))
                        : score;
                    const sClear = Math.max(0, Math.floor(Number(entry.scoreClearance) || 0));
                    if (entry.isDev) return;
                    rawRecords.push({
                        uid,
                        previousGuestUid: entry.previousGuestUid || null,
                        nickname: String(entry.nick || 'Пилот').slice(0, 16),
                        equippedTitle: entry.title || 'novice',
                        equippedTheme: entry.theme || 'default',
                        bestScore: Math.max(score, sDrive, sClear),
                        bestScoreDrive: sDrive,
                        bestScoreClearance: sClear,
                        bestExpeditionSectors: entry.expeditionSectors,
                        ...collectionCounts(entry),
                        updatedAt: Number(entry.ts) || 0,
                        dailyStreak: Math.max(0, Math.floor(Number(entry.streak) || 0)),
                        passLevel: Math.max(1, Number(entry.lvl) || 1),
                        isDev: Boolean(entry.isDev)
                    });
                });
                return this.deduplicateRecords(rawRecords);
            }

            countOnline(entries) {
                const now = Date.now();
                const uids = new Set();
                entries.forEach(entry => {
                    if (!entry || entry.ts < now - ONLINE_CONFIG.presenceWindowMs) return;
                    if (entry.kind !== 'presence' && entry.kind !== 'score') return;
                    if (entry.uid) uids.add(String(entry.uid));
                });
                return uids.size;
            }

            async publish(payload) {
                try {
                    const body = JSON.stringify({ v: 1, ...payload, ts: Date.now() });
                    const res = await this.request(`${ONLINE_CONFIG.relay}/${ONLINE_CONFIG.topic}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                            'Title': 'XPACE',
                            'Cache': 'yes'
                        },
                        body
                    });
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return true;
                } catch (err) {
                    this.lastError = (err && err.message) ? err.message : 'нет ответа';
                    return false;
                }
            }

            async publishScore(profile = {}) {
                if (profile.isDevTester || profile.isDev || (window.__xpace && window.__xpace.isAdminSession)) {
                    return false;
                }
                const scores = leaderboardBestScores(profile);
                const entry = {
                    kind: 'score',
                    uid: String(profile.uid || this.identity.uid || this.getLocalUid()).slice(0, 64),
                    nick: String(profile.nickname || this.identity.nickname || 'Пилот').slice(0, 16),
                    previousGuestUid: profile.previousGuestUid || null,
                    score: scores.bestScore,
                    scoreDrive: scores.bestScoreDrive,
                    scoreClearance: scores.bestScoreClearance,
                    expeditionSectors: scores.bestExpeditionSectors,
                    ...collectionCounts(profile),
                    streak: Math.max(0, Math.floor(Number(profile.dailyStreak) || 0)),
                    title: profile.equippedTitle || this.identity.title || 'novice',
                    theme: profile.equippedTheme || this.identity.theme || 'default',
                    lvl: Number(profile.passLevel || this.identity.level) || 1
                };

                const ok = await this.publish(entry);
                if (ok) {
                    this.lastPushAt = Date.now();
                    this.lastSyncAt = Date.now();
                    this.publishedScores.set(entry.uid, { ...leaderboardBestScores(scores, this.publishedScores.get(entry.uid)), ...collectionCounts(entry) });
                    this.emit('ONLINE');
                }
                return ok;
            }

            // Рост в любом режиме отправляется сразу, даже если общий рекорд выше.
            async maybePublishScore(profile = {}, force = false) {
                const scores = leaderboardBestScores(profile);
                if (!scores.bestScore && !scores.bestExpeditionSectors) return false;
                const uid = String(profile.uid || this.identity.uid || this.getLocalUid()).slice(0, 64);
                const published = this.publishedScores.get(uid);
                const grew = !published || Object.keys(scores).some(key => scores[key] > published[key]);
                const collectionChanged = Object.entries(collectionCounts(profile)).some(([key, value]) => value !== published?.[key]);
                const stale = Date.now() - (this.lastPushAt || 0) > 120000;
                if (!force && !grew && !collectionChanged && !stale) return false;
                return this.publishScore(profile);
            }

            async pingPresence() {
                if (window.__xpace && window.__xpace.isAdminSession) return false;
                const ok = await this.publish({
                    kind: 'presence',
                    uid: String(this.identity.uid || this.getLocalUid()).slice(0, 64),
                    nick: String(this.identity.nickname || 'Пилот').slice(0, 16),
                    lvl: Number(this.identity.level) || 1
                });
                if (ok) this.pilotsOnline = Math.max(1, this.pilotsOnline);
                return ok;
            }

            startPresence() {
                if (this.presenceTimer) return;
                const tick = () => {
                    if (document.hidden) return;
                    this.pingPresence().catch(() => {});
                };
                setTimeout(tick, 1200);
                this.presenceTimer = setInterval(tick, ONLINE_CONFIG.presenceIntervalMs);
            }

            async getLeaderboard(localEntry, force = false) {
                await this.probe(force);
                return this.rememberLeaderboard(localEntry ? [localEntry] : []);
            }

            async publishAccountSync(loginName, passHash, profileData) {
                try {
                    const body = JSON.stringify({
                        v: 1,
                        kind: 'account_sync',
                        login: loginName,
                        passHash: passHash,
                        data: profileData,
                        ts: Date.now()
                    });
                    const res = await this.request(`${ONLINE_CONFIG.relay}/${ONLINE_CONFIG.accountsTopic}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                            'Title': 'XPACE_ACC',
                            'Cache': 'yes'
                        },
                        body
                    });
                    return res.ok;
                } catch (e) {
                    return false;
                }
            }

            async fetchOnlineAccount(loginName) {
                try {
                    const url = `${ONLINE_CONFIG.relay}/${ONLINE_CONFIG.accountsTopic}/json?poll=1&since=all`;
                    const res = await this.request(url);
                    if (!res.ok) return null;
                    const text = await res.text();
                    const lines = String(text || '').split('\n');
                    let latest = null;
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed) continue;
                        try {
                            const env = JSON.parse(trimmed);
                            if (!env || env.event !== 'message' || typeof env.message !== 'string') continue;
                            const msg = JSON.parse(env.message);
                            if (msg && msg.kind === 'account_sync' && msg.login === loginName) {
                                const msgTs = Number(msg.ts) || Number(env.time) * 1000 || 0;
                                if (!latest || msgTs >= latest.ts) {
                                    latest = { passHash: msg.passHash, data: msg.data, ts: msgTs };
                                }
                            }
                        } catch (e) {}
                    }
                    return latest;
                } catch (e) {
                    return null;
                }
            }

            describe() {
                if (this.status === 'ONLINE') {
                    return this.pilotsOnline > 0
                        ? `ОНЛАЙН · ${this.pilotsOnline} ${this.pilotsOnline === 1 ? 'ПИЛОТ' : 'ПИЛОТА'} В СЕТИ`
                        : 'ОНЛАЙН · ТАБЛИЦА РЕКОРДОВ';
                }
                if (this.status === 'CHECKING') return 'ПРОВЕРКА СЕТИ...';
                return 'ОФЛАЙН · ЛОКАЛЬНЫЙ ПРОФИЛЬ';
            }
        }

