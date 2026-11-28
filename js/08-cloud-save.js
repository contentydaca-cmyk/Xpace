        /**
         * Облачное и локальное хранилище прогресса игрока + Таблица лидеров
         */
        class CloudSaveManager {
            constructor(onDataLoadedCallback, onlineHub) {
                this.onDataLoaded = onDataLoadedCallback;
                this.online = onlineHub || null;
                this.fb = null;
                this.localKey = 'neon_drift_player_profile_v6';
                this.backupKey = 'neon_drift_player_profile_backup_v1';
                this.vaultKey = 'xpace_accounts_vault_v1';
                this.activeLoginKey = 'xpace_active_login_v1';
                this._lastSavedPayload = null;
                this._pendingRelaySync = null;
                this.appId = typeof __app_id !== 'undefined' ? __app_id : 'neon-drift-default';
                this.db = null;
                this.auth = null;
                this.user = null;
                this.cloudReady = false;
                this.saveDebounce = null;
                this.accountRelayDebounce = null;
                this.fallbackUid = this.getOrCreateFallbackUid();
                this.activeLocalLogin = this.getStoredActiveLogin();

                if (this.activeLocalLogin) {
                    setTimeout(() => this.updateAuthUI(this.activeLocalLogin), 0);
                }

                // Мгновенная доотправка несохранённых данных аккаунта при сворачивании или закрытии вкладки
                if (typeof window !== 'undefined') {
                    window.addEventListener('online', () => {
                        if (!this.cloudReady) this.init().catch(() => {});
                        if (this.activeLocalLogin) this.syncAccountNow().catch(() => {});
                        else if (this.cloudReady) this.pullFromCloud().catch(() => {});
                    });
                    const flushOnHide = () => {
                        this.flushPendingAccountSync();
                    };
                    window.addEventListener('pagehide', flushOnHide);
                    window.addEventListener('beforeunload', flushOnHide);
                    document.addEventListener('visibilitychange', () => {
                        if (document.visibilityState === 'hidden') flushOnHide();
                    });
                }
            }

            getStoredActiveLogin() {
                try {
                    const ls = localStorage.getItem(this.activeLoginKey);
                    if (ls) return ls;
                } catch (e) {}
                try {
                    const m = document.cookie.match(/(?:^|; )xpace_login=([^;]+)/);
                    if (m && m[1]) return decodeURIComponent(m[1]);
                } catch (e) {}
                try {
                    if (window.name && window.name.startsWith('XPACE_SESSION:')) {
                        const parsed = JSON.parse(window.name.slice('XPACE_SESSION:'.length));
                        if (parsed && parsed.login) return parsed.login;
                    }
                } catch (e) {}
                return null;
            }

            setStoredActiveLogin(loginName) {
                this.activeLocalLogin = loginName || null;
                try {
                    if (loginName) localStorage.setItem(this.activeLoginKey, loginName);
                    else localStorage.removeItem(this.activeLoginKey);
                } catch (e) {}
                try {
                    if (loginName) {
                        document.cookie = `xpace_login=${encodeURIComponent(loginName)}; path=/; max-age=315360000; SameSite=Lax`;
                    } else {
                        document.cookie = 'xpace_login=; path=/; max-age=0';
                    }
                } catch (e) {}
                this.syncWindowNameSession();
                this.idbSet('active_login', this.activeLocalLogin).catch(() => {});
            }

            syncWindowNameSession() {
                try {
                    const snap = {
                        login: this.activeLocalLogin || null,
                        data: this._lastSavedPayload || this.loadLocal() || null
                    };
                    window.name = 'XPACE_SESSION:' + JSON.stringify(snap);
                } catch (e) {}
            }

            openIdb() {
                return new Promise((resolve) => {
                    try {
                        if (!window.indexedDB) return resolve(null);
                        const req = indexedDB.open('xpace_persistent_db_v1', 1);
                        req.onupgradeneeded = (ev) => {
                            const db = ev.target.result;
                            if (!db.objectStoreNames.contains('kv')) {
                                db.createObjectStore('kv');
                            }
                        };
                        req.onsuccess = () => resolve(req.result);
                        req.onerror = () => resolve(null);
                    } catch (e) {
                        resolve(null);
                    }
                });
            }

            async idbSet(key, val) {
                const db = await this.openIdb();
                if (!db) return;
                return new Promise((resolve) => {
                    try {
                        const tx = db.transaction('kv', 'readwrite');
                        tx.objectStore('kv').put(val, key);
                        tx.oncomplete = () => resolve(true);
                        tx.onerror = () => resolve(false);
                    } catch (e) {
                        resolve(false);
                    }
                });
            }

            async idbGet(key) {
                const db = await this.openIdb();
                if (!db) return null;
                return new Promise((resolve) => {
                    try {
                        const tx = db.transaction('kv', 'readonly');
                        const req = tx.objectStore('kv').get(key);
                        req.onsuccess = () => resolve(req.result ?? null);
                        req.onerror = () => resolve(null);
                    } catch (e) {
                        resolve(null);
                    }
                });
            }

            mergeProfileSnapshots(a, b) {
                a = migrateModuleProfile(a);
                b = migrateModuleProfile(b);
                if (!a || !b) return a || b;
                const aDrive = Number(a.bestScoreDrive) || 0;
                const bDrive = Number(b.bestScoreDrive) || 0;
                const aClear = Number(a.bestScoreClearance) || 0;
                const bClear = Number(b.bestScoreClearance) || 0;
                const maxDrive = Math.max(aDrive, bDrive);
                const maxClear = Math.max(aClear, bClear);
                const maxBest = Math.max(Number(a.bestScore) || 0, Number(b.bestScore) || 0, maxDrive, maxClear);

                const newer = (Number(b.updatedAt) || 0) >= (Number(a.updatedAt) || 0) ? b : a;
                const older = newer === b ? a : b;
                const sparkSnapshot = newer.sparks !== undefined ? newer : older;
                const unlockedMasks = [...new Set([...a.unlockedMasks, ...b.unlockedMasks])];
                const retiredModuleRefunds = [...new Set([...a.retiredModuleRefunds, ...b.retiredModuleRefunds])];

                const mergedActiveIds = Array.from(new Set([
                    ...(Array.isArray(newer.activeContractIds) ? newer.activeContractIds : (newer.activeContractId ? [newer.activeContractId] : [])),
                    ...(Array.isArray(older.activeContractIds) ? older.activeContractIds : (older.activeContractId ? [older.activeContractId] : []))
                ])).slice(0, 3);

                const mergedContractProg = { ...(older.contractProgress || {}) };
                if (newer.contractProgress && typeof newer.contractProgress === 'object') {
                    Object.keys(newer.contractProgress).forEach(k => {
                        mergedContractProg[k] = Math.max(Number(mergedContractProg[k]) || 0, Number(newer.contractProgress[k]) || 0);
                    });
                }

                return {
                    ...older,
                    ...newer,
                    nickname: (newer.nickname && newer.nickname !== 'Пилот') ? newer.nickname : (older.nickname || newer.nickname || ''),
                    bestScore: maxBest,
                    bestExpeditionSectors: Math.max(Number(a.bestExpeditionSectors) || 0, Number(b.bestExpeditionSectors) || 0),
                    bestScoreDrive: maxDrive,
                    bestScoreClearance: maxClear,
                    bestSurviveSec: Math.max(Number(a.bestSurviveSec) || 0, Number(b.bestSurviveSec) || 0),
                    xp: Math.max(Number(a.xp) || 0, Number(b.xp) || 0),
                    sparks: sparksWithModuleRefunds(sparkSnapshot, retiredModuleRefunds),
                    sparkRewardRemainder: sparkSnapshot.sparkRewardRemainder ?? INITIAL_SPARK_REWARD_REMAINDER,
                    bonusClaimsCount: Math.max(Number(a.bonusClaimsCount) || 0, Number(b.bonusClaimsCount) || 0),
                    totalRuns: Math.max(Number(a.totalRuns) || 0, Number(b.totalRuns) || 0),
                    totalCoins: Math.max(Number(a.totalCoins) || 0, Number(b.totalCoins) || 0),
                    totalNearMisses: Math.max(Number(a.totalNearMisses) || 0, Number(b.totalNearMisses) || 0),
                    totalRocksDestroyed: Math.max(Number(a.totalRocksDestroyed) || 0, Number(b.totalRocksDestroyed) || 0),
                    ...latestDailyClaim(a, b),
                    claimedLevels: Array.from(new Set([...(a.claimedLevels || []), ...(b.claimedLevels || [])])),
                    claimedContracts: Array.from(new Set([...(a.claimedContracts || []), ...(b.claimedContracts || [])])),
                    unlockedTitles: Array.from(new Set(['novice', ...(a.unlockedTitles || []), ...(b.unlockedTitles || [])])),
                    unlockedShips: Array.from(new Set(['viper', ...(a.unlockedShips || []), ...(b.unlockedShips || [])])),
                    unlockedMasks,
                    retiredModuleRefunds,
                    ...mergeLoadouts(older, newer, unlockedMasks),
                    unlockedTrails: Array.from(new Set(['default', ...(a.unlockedTrails || []), ...(b.unlockedTrails || [])])),
                    // A legacy snapshot must not reintroduce the retired gold entitlement.
                    unlockedThemes: Array.from(new Set(['default', ...(a.unlockedThemes || []), ...(b.unlockedThemes || [])]))
                        .filter(id => id !== 'liquid_gold'),
                    ...mergeProfileFrames(older, newer),
                    activeContractIds: mergedActiveIds,
                    activeContractId: mergedActiveIds[0] || null,
                    contractProgress: mergedContractProg,
                    updatedAt: Math.max(Number(a.updatedAt) || 0, Number(b.updatedAt) || 0)
                };
            }

            loadAccountsVault() {
                try {
                    const raw = localStorage.getItem(this.vaultKey);
                    return raw ? JSON.parse(raw) : {};
                } catch (e) {
                    return {};
                }
            }

            saveAccountsVault(vault) {
                try {
                    localStorage.setItem(this.vaultKey, JSON.stringify(vault));
                } catch (e) {}
                this.idbSet('accounts_vault', vault).catch(() => {});
            }

            encodePass(pwd) {
                const raw = 'xpace#' + String(pwd || '');
                try {
                    return btoa(unescape(encodeURIComponent(raw)));
                } catch (e) {
                    return raw;
                }
            }

            async hashPasswordSecure(loginName, pwd) {
                const text = `${loginName}:${String(pwd || '')}:xpace_salt_2026`;
                try {
                    if (window.crypto && window.crypto.subtle && typeof TextEncoder !== 'undefined') {
                        const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
                        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
                    }
                } catch (e) {}
                return this.encodePass(text);
            }

            getOrCreateFallbackUid(renew = false) {
                try {
                    const existing = localStorage.getItem('neon_drift_fallback_uid');
                    if (existing && !renew) return existing;
                    const generated = 'pilot-' + Math.random().toString(36).slice(2, 10);
                    localStorage.setItem('neon_drift_fallback_uid', generated);
                    return generated;
                } catch (e) {
                    return 'pilot-' + Math.random().toString(36).slice(2, 10);
                }
            }

            getCurrentUid() {
                if (this.user && !this.user.isAnonymous) return this.user.uid;
                if (this.activeLocalLogin) return 'acc:' + this.activeLocalLogin;
                return this.user ? this.user.uid : this.fallbackUid;
            }

            getLeaderboardUid() {
                if (this.user?.email?.endsWith('@xpace.local')) return 'acc:' + this.user.email.split('@')[0].toLowerCase();
                if (this.user && !this.user.isAnonymous) return this.user.uid;
                if (this.activeLocalLogin) return 'acc:' + this.activeLocalLogin;
                return this.fallbackUid;
            }

            loadLocal() {
                const candidates = [];
                try {
                    const raw = localStorage.getItem(this.localKey);
                    if (raw) candidates.push(JSON.parse(raw));
                } catch (e) {}
                try {
                    const backup = localStorage.getItem(this.backupKey);
                    if (backup) candidates.push(JSON.parse(backup));
                } catch (e) {}
                try {
                    const legacy = localStorage.getItem('neon_drift_player_profile_v5');
                    if (legacy) candidates.push(JSON.parse(legacy));
                } catch (e) {}
                try {
                    if (this.activeLocalLogin) {
                        const vault = this.loadAccountsVault();
                        if (vault[this.activeLocalLogin] && vault[this.activeLocalLogin].data) {
                            candidates.push(vault[this.activeLocalLogin].data);
                        }
                    }
                } catch (e) {}
                try {
                    if (window.name && window.name.startsWith('XPACE_SESSION:')) {
                        const parsed = JSON.parse(window.name.slice('XPACE_SESSION:'.length));
                        if (parsed && parsed.data) candidates.push(parsed.data);
                    }
                } catch (e) {}
                if (candidates.length === 0) return null;
                return candidates.reduce((acc, item) => this.mergeProfileSnapshots(acc, item), null);
            }

            saveLocal(data, allowDowngrade = false) {
                if (!data || typeof data !== 'object') return;
                let toWrite = migrateModuleProfile(data);
                if (!allowDowngrade) {
                    const existing = this.loadLocal();
                    if (existing) {
                        toWrite = this.mergeProfileSnapshots(existing, toWrite);
                    }
                }
                this._lastSavedPayload = toWrite;
                const serialized = JSON.stringify(toWrite);
                try {
                    localStorage.setItem(this.localKey, serialized);
                } catch (e) {}
                try {
                    localStorage.setItem(this.backupKey, serialized);
                } catch (e) {}
                this.syncWindowNameSession();
                this.idbSet('profile_data', toWrite).catch(() => {});
            }

            flushPendingAccountSync() {
                if (!this._pendingRelaySync || !this.online) return;
                const pending = this._pendingRelaySync;
                this._pendingRelaySync = null;
                clearTimeout(this.accountRelayDebounce);
                this.sendAccountSnapshot(pending);
            }

            async sendAccountSnapshot(snapshot) {
                const { loginName, passHash, payload } = snapshot;
                const sent = await this.online.publishAccountSync(loginName, passHash, payload).catch(() => false);
                if (this.activeLocalLogin === loginName) {
                    const pending = this._pendingRelaySync;
                    if (sent && pending && pending.loginName === loginName && pending.payload.updatedAt <= payload.updatedAt) {
                        this._pendingRelaySync = null;
                        clearTimeout(this.accountRelayDebounce);
                    } else if (!sent && !pending) {
                        this._pendingRelaySync = { ...snapshot, payload: this.loadLocal() || payload };
                    }
                }
                return sent;
            }

            mergeSyncedSnapshots(local, remote) {
                if ((Number(local?.updatedAt) || 0) >= (Number(remote?.updatedAt) || 0)) {
                    return this.mergeProfileSnapshots(remote, local);
                }
                return this.mergeProfileSnapshots(local, remote);
            }

            applySyncedProfile(remote) {
                const merged = this.mergeSyncedSnapshots(this.loadLocal(), remote);
                if (!merged) return null;
                this.saveLocal(merged, true);
                if (this.activeLocalLogin) {
                    const vault = this.loadAccountsVault();
                    const entry = vault[this.activeLocalLogin];
                    if (entry) {
                        entry.data = merged;
                        this.saveAccountsVault(vault);
                    }
                }
                if (this.onDataLoaded) this.onDataLoaded(merged, false);
                return merged;
            }

            async loadRelayProfile(loginName) {
                if (!this.online) return;
                const remote = await this.online.fetchOnlineAccount(loginName);
                if (!remote?.data || this.activeLocalLogin !== loginName) return;
                const entry = this.loadAccountsVault()[loginName];
                if (entry && remote.passHash && [entry.passwordHash, entry.legacyHash].includes(remote.passHash)) {
                    this.applySyncedProfile(remote.data);
                }
            }

            async restorePersistentSessionOnBoot() {
                try {
                    const idbLogin = await this.idbGet('active_login');
                    const idbVault = await this.idbGet('accounts_vault');
                    const idbProfile = await this.idbGet('profile_data');

                    if (idbVault && typeof idbVault === 'object') {
                        const curVault = this.loadAccountsVault();
                        const mergedVault = { ...idbVault, ...curVault };
                        Object.keys(idbVault).forEach(k => {
                            if (curVault[k] && idbVault[k]) {
                                mergedVault[k] = {
                                    ...idbVault[k],
                                    ...curVault[k],
                                    data: this.mergeProfileSnapshots(idbVault[k].data, curVault[k].data)
                                };
                            }
                        });
                        this.saveAccountsVault(mergedVault);
                    }

                    if (!this.activeLocalLogin && idbLogin) {
                        this.setStoredActiveLogin(idbLogin);
                    }

                    const localMerged = this.mergeProfileSnapshots(this.loadLocal(), idbProfile);
                    if (localMerged) {
                        this.saveLocal(localMerged, false);
                        if (this.onDataLoaded) this.onDataLoaded(localMerged, false);
                    }

                    if (this.activeLocalLogin) {
                        this.updateAuthUI(this.activeLocalLogin);
                        await this.loadRelayProfile(this.activeLocalLogin);
                    }
                } catch (e) {}
            }

            async syncAccountNow(showToastFn) {
                const loginName = this.activeLocalLogin;
                if (!loginName) {
                    if (showToastFn) showToastFn('Сначала войдите в облачный аккаунт XPACE!');
                    return false;
                }
                if (showToastFn) showToastFn(`Синхронизация @${loginName}...`);
                await this.loadRelayProfile(loginName);
                if (this.activeLocalLogin !== loginName) return false;

                const cloudSaved = await this.pullFromCloud();
                if (this.activeLocalLogin !== loginName) return false;
                const entry = this.loadAccountsVault()[loginName];
                const payload = this.loadLocal();
                const relaySaved = Boolean(this.online && entry?.passwordHash && payload &&
                    await this.sendAccountSnapshot({ loginName, passHash: entry.passwordHash, payload }));
                if (this.activeLocalLogin !== loginName) return false;
                const synced = cloudSaved || relaySaved;
                if (showToastFn) {
                    if (cloudSaved) showToastFn(`✓ Аккаунт @${loginName} синхронизирован!`);
                    else if (relaySaved) showToastFn(`✓ Сохранение @${loginName} отправлено.`);
                    else showToastFn('Синхронизация недоступна. Прогресс сохранён на устройстве.');
                }
                return synced;
            }

            async init() {
                if (this.initializing) return;
                this.initializing = true;
                const statusEl = document.getElementById('syncStatusText');
                const uidEl = document.getElementById('playerUidText');
                if (uidEl) uidEl.textContent = `ID: ${this.fallbackUid}`;

                try {
                    await this.restorePersistentSessionOnBoot();
                    if (typeof __firebase_config === 'undefined' || !__firebase_config) {
                        if (this.online) this.online.setFirebaseStatus('не настроен');
                        if (this.activeLocalLogin) {
                            if (statusEl) {
                                statusEl.textContent = `● Аккаунт: @${this.activeLocalLogin}`;
                                statusEl.className = 'sync-status';
                            }
                            this.updateAuthUI(this.activeLocalLogin);
                        } else {
                            if (statusEl) {
                                statusEl.textContent = '● Локальный профиль готов';
                                statusEl.className = 'sync-status local';
                            }
                            this.updateAuthUI(null);
                        }
                        return;
                    }

                    this.fb = await loadFirebaseModulesSafely();
                    const firebaseConfig = JSON.parse(__firebase_config);
                    const app = this.fb.initializeApp(firebaseConfig);
                    this.auth = this.fb.getAuth(app);
                    this.db = this.fb.getFirestore(app);

                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await this.fb.signInWithCustomToken(this.auth, __initial_auth_token);
                    } else {
                        await this.auth.authStateReady();
                        if (!this.auth.currentUser) await this.fb.signInAnonymously(this.auth);
                    }

                    this.fb.onAuthStateChanged(this.auth, async (user) => {
                        if (!user) {
                            this.user = null;
                            this.updateAuthUI(this.activeLocalLogin);
                            return;
                        }
                        this.user = user;
                        this.cloudReady = true;
                        if (this.online) this.online.setFirebaseStatus('работает');

                        const isNamedAccount = Boolean(user.email && user.email.endsWith('@xpace.local'));
                        const accountLogin = isNamedAccount ? user.email.replace('@xpace.local', '') : this.activeLocalLogin;

                        if (statusEl) {
                            statusEl.textContent = accountLogin
                                ? `● Аккаунт: @${accountLogin}`
                                : '● Облако (Гостевой ID)';
                            statusEl.className = 'sync-status';
                        }
                        if (uidEl) {
                            uidEl.textContent = `ID: ${user.uid}`;
                        }

                        this.updateAuthUI(accountLogin);
                        await this.pullFromCloud();
                    });
                } catch (err) {
                    if (this.online) {
                        const code = (err && (err.code || err.message)) ? String(err.code || err.message) : 'ошибка';
                        this.online.setFirebaseStatus(`недоступен (${code})`);
                    }
                    if (this.activeLocalLogin) {
                        if (statusEl) {
                            statusEl.textContent = `● Аккаунт: @${this.activeLocalLogin}`;
                            statusEl.className = 'sync-status';
                        }
                        this.updateAuthUI(this.activeLocalLogin);
                    } else {
                        if (statusEl) {
                            statusEl.textContent = '● Локальный профиль готов';
                            statusEl.className = 'sync-status local';
                        }
                        this.updateAuthUI(null);
                    }
                } finally {
                    this.initializing = false;
                }
            }

            updateAuthUI(accountLogin) {
                const badgeEl = document.getElementById('cloudAccountBadge');
                const guestForm = document.getElementById('authGuestForm');
                const loggedInPanel = document.getElementById('authLoggedInPanel');
                const loggedInLabel = document.getElementById('loggedInUserLabel');
                const statusEl = document.getElementById('syncStatusText');

                if (accountLogin) {
                    if (badgeEl) {
                        badgeEl.textContent = `@${accountLogin}`;
                        badgeEl.style.color = '#4ade80';
                    }
                    if (statusEl) {
                        statusEl.textContent = `● Аккаунт: @${accountLogin}`;
                        statusEl.className = 'sync-status';
                    }
                    if (guestForm) guestForm.classList.add('hidden');
                    if (loggedInPanel) loggedInPanel.classList.remove('hidden');
                    if (loggedInLabel) {
                        loggedInLabel.textContent = `Вы вошли как @${accountLogin}`;
                    }
                } else {
                    if (badgeEl) {
                        badgeEl.textContent = 'Гость';
                        badgeEl.style.color = '#fbbf24';
                    }
                    if (statusEl) {
                        statusEl.textContent = this.cloudReady ? '● Облако (Гостевой ID)' : '● Локальный профиль готов';
                        statusEl.className = this.cloudReady ? 'sync-status' : 'sync-status local';
                    }
                    if (guestForm) guestForm.classList.remove('hidden');
                    if (loggedInPanel) loggedInPanel.classList.add('hidden');
                }
            }

            normalizeLogin(rawLogin) {
                const clean = String(rawLogin || '').trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');
                return clean.length >= 3 ? clean : null;
            }

            async registerWithLogin(rawLogin, password, currentState, passLevel, showToastFn) {
                const loginName = this.normalizeLogin(rawLogin);
                if (!loginName) {
                    showToastFn('Логин должен быть от 3 символов (латиница, цифры, _ . -)');
                    return;
                }
                if (!password || password.length < 6) {
                    showToastFn('Пароль должен содержать минимум 6 символов!');
                    return;
                }

                showToastFn('Создаём аккаунт...');
                const secureHash = await this.hashPasswordSecure(loginName, password);
                const legacyHash = this.encodePass(password);

                // Проверяем, не занят ли логин локально или в онлайн-релее
                const vault = this.loadAccountsVault();
                if (vault[loginName]) {
                    showToastFn(`Логин «${loginName}» уже существует! Нажмите «ВОЙТИ».`);
                    return;
                }
                if (this.online) {
                    const remoteExisting = await this.online.fetchOnlineAccount(loginName);
                    if (remoteExisting) {
                        showToastFn(`Логин «${loginName}» уже занят в сети! Нажмите «ВОЙТИ» или выберите другой.`);
                        return;
                    }
                }

                if (!currentState.nickname || currentState.nickname === 'Пилот') {
                    currentState.nickname = loginName.slice(0, 16);
                }
                const fromGuest = !this.activeLocalLogin && (!this.user || this.user.isAnonymous);
                const payload = { ...currentState, passLevel, updatedAt: Date.now(), previousGuestUid: fromGuest ? this.fallbackUid : null };

                // 1. Пробуем создать аккаунт в Firebase (если домен разрешён)
                let firebaseRegistered = false;
                if (this.auth && this.fb) {
                    const email = `${loginName}@xpace.local`;
                    try {
                        const cred = await this.fb.createUserWithEmailAndPassword(this.auth, email, password);
                        this.user = cred.user;
                        this.cloudReady = true;
                        firebaseRegistered = true;
                    } catch (e) {
                        if (e && e.code === 'auth/email-already-in-use') {
                            showToastFn('Этот логин уже занят! Нажмите «ВОЙТИ».');
                            return;
                        }
                    }
                }

                // 2. Сохраняем в локальный реестр и отправляем в онлайн-релей (работает везде, включая Telegram и APK)
                vault[loginName] = {
                    passwordHash: secureHash,
                    legacyHash: legacyHash,
                    data: payload
                };
                this.saveAccountsVault(vault);
                this.setStoredActiveLogin(loginName);
                if (fromGuest) this.fallbackUid = this.getOrCreateFallbackUid(true);
                this.saveLocal(payload, true);
                this.updateAuthUI(loginName);

                const [savedToFirebase, savedToRelay] = await Promise.all([
                    firebaseRegistered && this.pushToCloudNow(payload),
                    this.online && this.sendAccountSnapshot({ loginName, passHash: secureHash, payload })
                ]);

                if (this.onDataLoaded) this.onDataLoaded(payload, true);

                if (savedToFirebase || savedToRelay) {
                    showToastFn(`Аккаунт @${loginName} зарегистрирован в облаке! Прогресс сохранён.`);
                } else {
                    showToastFn(`Аккаунт @${loginName} создан локально (нет сети для облака).`);
                }
            }

            async loginWithLogin(rawLogin, password, showToastFn) {
                const loginName = this.normalizeLogin(rawLogin);
                if (!loginName || !password) {
                    showToastFn('Введите логин и пароль!');
                    return;
                }

                showToastFn('Проверяем аккаунт...');
                const secureHash = await this.hashPasswordSecure(loginName, password);
                const legacyHash = this.encodePass(password);

                // 1. Пробуем войти через Firebase Auth
                let firebaseUserOk = false;
                if (this.auth && this.fb) {
                    const email = `${loginName}@xpace.local`;
                    try {
                        const cred = await this.fb.signInWithEmailAndPassword(this.auth, email, password);
                        this.user = cred.user;
                        this.cloudReady = true;
                        firebaseUserOk = true;
                    } catch (e) {}
                }

                // 2. Проверяем локальный реестр и онлайн-релей (выбираем самое свежее сохранение)
                const vault = this.loadAccountsVault();
                const localEntry = vault[loginName] || null;
                const remoteEntry = this.online ? await this.online.fetchOnlineAccount(loginName) : null;

                if (!firebaseUserOk && !localEntry && !remoteEntry) {
                    showToastFn(`Аккаунт @${loginName} не найден — нажмите «РЕГИСТРАЦИЯ»!`);
                    return;
                }

                const localValid = localEntry && (
                    localEntry.passwordHash === secureHash ||
                    localEntry.passwordHash === legacyHash ||
                    localEntry.legacyHash === legacyHash
                );
                const remoteValid = remoteEntry && (
                    remoteEntry.passHash === secureHash ||
                    remoteEntry.passHash === legacyHash
                );

                if (!firebaseUserOk && !localValid && !remoteValid) {
                    showToastFn(`Неверный пароль для @${loginName}!`);
                    return;
                }

                let chosenData = null;
                if (localValid && remoteValid) {
                    chosenData = this.mergeProfileSnapshots(localEntry.data, remoteEntry.data);
                } else if (remoteValid) {
                    chosenData = { ...remoteEntry.data };
                } else if (localValid) {
                    chosenData = { ...localEntry.data };
                }

                if (firebaseUserOk && this.db && this.fb && this.user) {
                    try {
                        const profileRef = this.fb.doc(this.db, 'artifacts', this.appId, 'users', this.user.uid, 'saveData', 'profile');
                        const snap = await this.fb.getDoc(profileRef);
                        if (snap.exists()) {
                            chosenData = this.mergeProfileSnapshots(chosenData, snap.data());
                        }
                    } catch (e) {}
                }

                if (!chosenData) {
                    chosenData = this.loadLocal() || { nickname: loginName.slice(0, 16), updatedAt: Date.now() };
                }

                vault[loginName] = {
                    passwordHash: secureHash,
                    legacyHash: legacyHash,
                    data: chosenData
                };
                this.saveAccountsVault(vault);
                this.setStoredActiveLogin(loginName);
                this.saveLocal(chosenData, true);
                this.updateAuthUI(loginName);

                if (this.onDataLoaded) {
                    this.onDataLoaded(chosenData, true);
                }
                if (this.online) {
                    this.online.publishAccountSync(loginName, secureHash, chosenData).catch(() => {});
                }
                if (firebaseUserOk) {
                    await this.pullFromCloud();
                }
                showToastFn(`Вход выполнен: @${loginName}! Весь прогресс восстановлен.`);
            }

            async logoutAccount(showToastFn) {
                this.flushPendingAccountSync();
                this.setStoredActiveLogin(null);
                if (this.auth && this.cloudReady && this.fb) {
                    try {
                        await this.fb.signOut(this.auth);
                        await this.fb.signInAnonymously(this.auth);
                    } catch (e) {}
                }
                const guestFresh = {
                    nickname: '',
                    bestScore: 0,
                    bestScoreDrive: 0,
                    bestScoreClearance: 0,
                    bestSurviveSec: 0,
                    xp: 0,
                    sparks: 0,
                    sparkRewardRemainder: INITIAL_SPARK_REWARD_REMAINDER,
                    claimedLevels: [],
                    quests: [],
                    questCounter: 1,
                    unlockedTitles: ['novice'],
                    equippedTitle: 'novice',
                    unlockedShips: ['viper'],
                    equippedShip: 'viper',
                    unlockedMasks: [],
                    retiredModuleRefunds: [],
                    ...normalizedLoadout(),
                    unlockedTrails: ['default'],
                    equippedTrail: 'default',
                    unlockedThemes: ['default'],
                    equippedTheme: 'default',
                    ...mergeProfileFrames(),
                    bonusClaimsCount: 0,
                    claimedContracts: [],
                    activeContractId: null,
                    activeContractIds: [],
                    contractProgress: {},
                    totalRuns: 0,
                    totalCoins: 0,
                    totalNearMisses: 0,
                    totalRocksDestroyed: 0,
                    dailyStreak: 0,
                    lastDailyClaim: 0,
                    lastDailyClaimDate: '',
                    updatedAt: Date.now()
                };
                this.saveLocal(guestFresh, true);
                if (this.onDataLoaded) {
                    this.onDataLoaded(guestFresh, true);
                }
                this.updateAuthUI(null);
                showToastFn('Вы вышли из аккаунта (активен гостевой профиль).');
            }

            async pullFromCloud() {
                const loginName = this.activeLocalLogin;
                const uid = this.user?.uid;
                const synced = await this.syncFirebaseProfile(null);
                if (!synced || this.activeLocalLogin !== loginName || this.user?.uid !== uid) return false;
                const merged = this.applySyncedProfile(synced);
                this.publishLeaderboardRecord(merged).catch(() => {});
                return true;
            }

            saveProfile(data, passLevel = 1, immediate = false) {
                if (window.__xpace && window.__xpace.isAdminSession) return;
                const nowTs = Date.now();
                const stampedData = migrateModuleProfile({ ...data, updatedAt: nowTs });
                const existing = this.loadLocal();
                const safeData = existing ? this.mergeProfileSnapshots(existing, stampedData) : stampedData;
                const sparkSnapshot = data.sparks !== undefined ? stampedData : safeData;
                const payload = {
                    ...safeData,
                    ...mergeProfileFrames(safeData, data),
                    equippedShip: data.equippedShip || safeData.equippedShip || 'viper',
                    equippedTrail: data.equippedTrail || safeData.equippedTrail || 'default',
                    equippedTheme: data.equippedTheme || safeData.equippedTheme || 'default',
                    equippedTitle: data.equippedTitle || safeData.equippedTitle || 'novice',
                    nickname: data.nickname !== undefined ? data.nickname : safeData.nickname,
                    sparks: sparksWithModuleRefunds(sparkSnapshot, safeData.retiredModuleRefunds),
                    sparkRewardRemainder: sparkSnapshot.sparkRewardRemainder ?? INITIAL_SPARK_REWARD_REMAINDER,
                    activeContractId: data.activeContractId !== undefined ? data.activeContractId : safeData.activeContractId,
                    activeContractIds: Array.isArray(data.activeContractIds) ? [...data.activeContractIds] : (safeData.activeContractIds || []),
                    passLevel: Math.max(Number(passLevel) || 1, Number(safeData.passLevel) || 1),
                    updatedAt: nowTs
                };
                this.saveLocal(payload, true);
                if (this.activeLocalLogin) {
                    const vault = this.loadAccountsVault();
                    const entry = vault[this.activeLocalLogin];
                    if (entry) {
                        entry.data = payload;
                        this.saveAccountsVault(vault);
                        if (this.online && entry.passwordHash) {
                            this._pendingRelaySync = {
                                loginName: this.activeLocalLogin,
                                passHash: entry.passwordHash,
                                payload
                            };
                            clearTimeout(this.accountRelayDebounce);
                            const delayMs = immediate ? 80 : 650;
                            this.accountRelayDebounce = setTimeout(() => {
                                this.flushPendingAccountSync();
                            }, delayMs);
                        }
                    }
                }

                clearTimeout(this.saveDebounce);
                if (immediate) {
                    this.pushToCloudNow(payload);
                } else {
                    const uid = this.getCurrentUid();
                    this.saveDebounce = setTimeout(() => {
                        if (this.getCurrentUid() === uid) this.pushToCloudNow(payload);
                    }, 350);
                }
            }

            isTesterProfile(payload) {
                if (window.__xpace && window.__xpace.isAdminSession) return true;
                if (!payload) return false;
                if (payload.isDevTester) return true;
                const acc = String(this.activeLocalLogin || '').toLowerCase();
                return acc.startsWith('dev_') || acc.startsWith('test_') || acc.endsWith('_dev');
            }

            leaderboardEntry(payload, passLevel = payload.passLevel) {
                return {
                    uid: this.getLeaderboardUid(),
                    previousGuestUid: payload.previousGuestUid || null,
                    nickname: payload.nickname || 'Пилот',
                    equippedTitle: payload.equippedTitle || 'novice',
                    equippedTheme: payload.equippedTheme || 'default',
                    equippedProfileFrame: getProfileFrame(payload.equippedProfileFrame).id,
                    ...leaderboardBestScores(payload),
                    ...collectionCounts(payload),
                    dailyStreak: Number(payload.dailyStreak) || 0,
                    passLevel: Number(passLevel) || 1
                };
            }

            async publishLeaderboardRecord(payload, passLevel, force = false) {
                if (!payload || this.isTesterProfile(payload)) return false;
                const entry = this.leaderboardEntry(payload, passLevel);
                if (!entry.bestScore && !entry.bestExpeditionSectors) return false;
                if (this.online) {
                    this.online.setIdentity({
                        uid: entry.uid,
                        nickname: entry.nickname,
                        title: entry.equippedTitle,
                        theme: entry.equippedTheme,
                        level: entry.passLevel,
                        score: entry.bestScore
                    });
                    this.online.rememberLeaderboard([{ ...entry, updatedAt: Number(payload.updatedAt) || Date.now() }]);
                }

                if (this.cloudReady && this.user && this.db && this.fb) {
                    try {
                        const { uid, isAnonymous } = this.user;
                        const localAccount = isAnonymous && entry.uid.startsWith('acc:');
                        const lbRef = this.fb.doc(this.db, 'artifacts', this.appId, 'public', 'data', 'leaderboard', localAccount ? entry.uid : uid);
                        await this.fb.runTransaction(this.db, async transaction => {
                            const snapshot = await transaction.get(lbRef);
                            const previous = snapshot.exists() ? snapshot.data() : {};
                            const previousOwner = previous.profileUid || previous.uid;
                            const sameOwner = previousOwner === entry.uid || (previousOwner === uid &&
                                (!isAnonymous || entry.uid === this.fallbackUid));
                            const record = { ...entry, uid, profileUid: entry.uid, ...leaderboardBestScores(entry, sameOwner ? previous : {}) };
                            if (Object.keys(record).some(key => record[key] !== previous[key])) {
                                transaction.set(lbRef, { ...record, updatedAt: Date.now() }, { merge: true });
                            }
                        });
                        if (this.online) this.online.lastPushAt = Date.now();
                        return true;
                    } catch (e) {
                        if (this.online) this.online.lastError = e.message || 'Firestore';
                    }
                }
                return this.online ? this.online.maybePublishScore(entry, force) : false;
            }

            async syncFirebaseProfile(payload) {
                if (window.__xpace?.isAdminSession || !this.cloudReady || !this.user || !this.db || !this.fb) return null;
                const { uid, email } = this.user;
                const loginName = this.activeLocalLogin;
                const firebaseLogin = email?.endsWith('@xpace.local') ? email.slice(0, -'@xpace.local'.length) : null;
                if (firebaseLogin !== loginName || this.auth?.currentUser?.uid !== uid) return null;

                try {
                    const profileRef = this.fb.doc(this.db, 'artifacts', this.appId, 'users', uid, 'saveData', 'profile');
                    return await this.fb.runTransaction(this.db, async transaction => {
                        const snapshot = await transaction.get(profileRef);
                        if (this.activeLocalLogin !== loginName || this.auth.currentUser?.uid !== uid) return null;
                        const remote = snapshot.exists() ? snapshot.data() : null;
                        const local = this.mergeSyncedSnapshots(this.loadLocal(), payload);
                        const merged = this.mergeSyncedSnapshots(local, remote);
                        if (local) transaction.set(profileRef, merged, { merge: true });
                        return merged;
                    });
                } catch (e) {
                    return null;
                }
            }

            async pushToCloudNow(payload) {
                if (window.__xpace?.isAdminSession) return false;
                this.publishLeaderboardRecord(payload).catch(() => {});
                return Boolean(await this.syncFirebaseProfile(payload));
            }

            async fetchTopLeaderboard(currentState, currentPassLevel, force = false) {
                const localEntry = this.isTesterProfile(currentState) ? null : {
                    ...this.leaderboardEntry(currentState, currentPassLevel),
                    updatedAt: Date.now()
                };
                if (localEntry && this.user && (!this.user.isAnonymous || !this.activeLocalLogin)) {
                    localEntry.legacyUid = this.user.uid;
                }

                if (this.online && localEntry) {
                    this.online.setIdentity({
                        uid: localEntry.uid,
                        nickname: localEntry.nickname,
                        title: localEntry.equippedTitle,
                        theme: localEntry.equippedTheme,
                        level: localEntry.passLevel,
                        score: localEntry.bestScore
                    });
                }

                const localRecords = localEntry ? [localEntry] : [];
                this.leaderboardSource = 'local';
                if (this.cloudReady && this.user && this.db && this.fb) {
                    try {
                        const lbCol = this.fb.collection(this.db, 'artifacts', this.appId, 'public', 'data', 'leaderboard');
                        const snapshot = await this.fb.getDocs(lbCol);
                        const players = [];
                        snapshot.forEach(docSnap => {
                            const d = docSnap.data();
                            players.push({
                                uid: d.profileUid || d.uid || docSnap.id,
                                legacyUid: docSnap.id,
                                previousGuestUid: d.previousGuestUid || null,
                                nickname: d.nickname || `Пилот_${(d.uid || docSnap.id).slice(0, 5)}`,
                                equippedTitle: d.equippedTitle || 'novice',
                                equippedTheme: d.equippedTheme || 'default',
                                equippedProfileFrame: d.equippedProfileFrame,
                                ...leaderboardBestScores(d),
                                ...collectionCounts(d),
                                updatedAt: Number(d.updatedAt) || 0,
                                dailyStreak: Number(d.dailyStreak) || 0,
                                passLevel: Number(d.passLevel) || 1
                            });
                        });
                        this.leaderboardSource = snapshot.metadata?.fromCache ? 'local' : 'cloud';
                        const records = [...players, ...localRecords];
                        return this.online ? this.online.rememberLeaderboard(records) : mergeLeaderboardRecords(records);
                    } catch (e) {}
                }
                return this.online ? this.online.getLeaderboard(localEntry, force) : localRecords;
            }
        }

