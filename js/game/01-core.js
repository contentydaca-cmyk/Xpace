        // Construction, settings and online status
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        const RUN_DIFFICULTY_HALF_SCORE = { DRIVE: 10000, CLEARANCE: 15000, EXPEDITION: 12000 };
        const CLEARANCE_BOSS_FIRST_SCORE = 6000;
        const CLEARANCE_BOSS_SCORE_STEP = 10000;

        /**
         * Основной игровой движок NEON DRIFT
         */
        class NeonDriftGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });
                /* v28: shadowBlur — самая дорогая операция canvas; ограничиваем радиус */
                (() => {
                    const desc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'shadowBlur');
                    if (!desc || !desc.set) return;
                    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
                    const cap = coarse ? 4 : 9;
                    const k = coarse ? 0.35 : 0.6;
                    Object.defineProperty(this.ctx, 'shadowBlur', {
                        configurable: true,
                        get() { return desc.get.call(this); },
                        set(v) { desc.set.call(this, Math.min(cap, (Number(v) || 0) * k)); }
                    });
                })();
                this.sound = new SoundEngine();
                this.settings = this.loadSettings();
                this.sound.muted = Boolean(this.settings.muted);
                this.gameMode = ['CLEARANCE', 'EXPEDITION'].includes(this.settings.lastMode) ? this.settings.lastMode : 'DRIVE';
                this.online = new XpaceOnline();
                // Отладочная ссылка на экземпляр игры (удобно для диагностики в консоли)
                window.__xpace = this;

                this.cloud = new CloudSaveManager((loadedData, isAccountSwitch = false) => {
                    if(this.isAdminSession)return; // Never merge delayed ordinary cloud snapshots into the sandbox.
                    if (isAccountSwitch) {
                        this.pass.replaceStateFromAccount(loadedData);
                    } else {
                        this.pass.applyLoadedData(loadedData);
                    }
                    this.syncNicknameInput();
                    this.updateAllUI();
                    const hangarOverlay = document.getElementById('hangarOverlay');
                    if (hangarOverlay && !hangarOverlay.classList.contains('hidden')) this.renderHangarModal();
                    const themesOverlay = document.getElementById('themesOverlay');
                    if (themesOverlay && !themesOverlay.classList.contains('hidden')) this.renderThemesModal();
                    const profileOverlay = document.getElementById('profileOverlay');
                    if (profileOverlay && !profileOverlay.classList.contains('hidden')) {
                        this.renderProfileModal();
                    }
                    const settingsOverlay = document.getElementById('settingsOverlay');
                    if (settingsOverlay && !settingsOverlay.classList.contains('hidden')) {
                        this.renderSettingsModal();
                    }
                    const passOverlay = document.getElementById('passOverlay');
                    if (passOverlay && !passOverlay.classList.contains('hidden')) {
                        this.renderPassModal(false);
                    }
                }, this.online);

                this.pass = new NeonPassSystem(this.sound, (stateToSave, passLevel, immediate = false) => {
                    this.cloud.saveProfile(stateToSave, passLevel, immediate);
                });
                this.pass.onContractCompleted = (contract) => {
                    if (!contract) return;
                    this.showToast(`[[xp:flag]] Контракт готов: «${contract.name}» · заберите +${contract.sparks} [[xp:spark]] в меню контрактов`);
                };

                try {
                    const pendingBackup = localStorage.getItem('xpace_admin_backup_v1');
                    if (pendingBackup) {
                        const parsedBackup = JSON.parse(pendingBackup);
                        if (parsedBackup && parsedBackup.state) {
                            this.cloud.setStoredActiveLogin(parsedBackup.activeLogin || null);
                            this.cloud.saveLocal(parsedBackup.state);
                            this.cloud.updateAuthUI(parsedBackup.activeLogin || null);
                        }
                        localStorage.removeItem('xpace_admin_backup_v1');
                    }
                } catch (e) {}

                const initialLocal = this.cloud.loadLocal();
                this.pass.applyLoadedData(initialLocal);
                this.syncNicknameInput();

                this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
                this.activePassTab = 'TRACK'; // TRACK | QUESTS
                this.activeShopTab = 'SHIPS'; // SHIPS | MASKS | TRAILS | THEMES
                this.trailPage = 0; // 0 = следы магазина, 1 = следы со скинов
                this.contractFilter = 'ALL'; // ALL | ACTIVE | READY | HARD | CLAIMED
                this.activeLeaderboardMode = 'DRIVE';
                this.width = 0;
                this.height = 0;
                this.isCoarseDevice = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);
                this.isMobileDevice = () => this.isCoarseDevice || this.width <= 768;
                this.dpr = this.isCoarseDevice ? 1 : Math.min(window.devicePixelRatio || 1, 2);
                try {
                    const ctxProto = Object.getPrototypeOf(this.ctx);
                    const sbDesc = ctxProto && Object.getOwnPropertyDescriptor(ctxProto, 'shadowBlur');
                    if (sbDesc && sbDesc.set) {
                        const self = this;
                        Object.defineProperty(this.ctx, 'shadowBlur', {
                            get() { return sbDesc.get.call(this); },
                            set(v) { sbDesc.set.call(this, self.isMobileDevice() ? 0 : v); },
                            configurable: true
                        });
                    }
                } catch (e) {}

                this.player = {
                    x: 0,
                    y: 0,
                    radius: 15,
                    tilt: 0,
                    shield: false,
                    trail: []
                };

                this.score = 0;
                this.combo = 1;
                this.comboTimer = 0;
                this.maxComboDuration = 2.8;
                this.comboDuration = this.maxComboDuration;
                this.comboMilestones = new Set();
                this.doubleScoreTimer = 0;
                this.shakeMag = 0;
                this.shakeTime = 0;
                this.runShieldUsed = false;
                this.devUnlocked = this.isDevModeUnlocked();
                this.isAdminSession = false;
                this._savedUserSession = null;
                this.devGodMode = false;
                this.devLogoTaps = 0;
                this.devLogoTapTimer = null;
                this.trailSeq = 0;

                // Босс классического режима «ДРАЙВ» (появляется на 30 000 очков, урон от фиолетовых искр)
                this.driveBoss = null;
                this.bossProjectiles = [];
                this.purpleSparks = [];
                this.purpleSparkTimer = 0;
                this.homingBossShots = [];
                this.nextDriveBossScore = 30000;

                // Секретный шанс 0.42% каждые 4242 очков на выпадение титула «42 БРАТУХА»
                this.next4242Milestone = 4242;

                this.overdriveCharge = 0;
                this.overdriveActive = false;
                this.overdriveTimer = 0;
                this.overdriveDuration = 6.0;

                // Новые таймеры вспомогательных предметов
                this.gameMode = ['CLEARANCE', 'EXPEDITION'].includes(this.settings.lastMode) ? this.settings.lastMode : 'DRIVE';
                this.magnetTimer = 0;
                this.slowmoTimer = 0;
                this.empWaves = [];

                // Боевая система для режима «ЗАЧИСТКА» (включая стреляющую летающую тарелку)
                this.bullets = [];
                this.rocks = [];
                this.dropCapsules = [];
                this.enemyUfos = [];
                this.enemyBullets = [];
                this.ufoSpawnTimer = 11.0;
                this.shootCooldown = 0;
                this.rockSpawnTimer = 0;
                this.nextClearanceBossScore = CLEARANCE_BOSS_FIRST_SCORE;
                this.clearanceBossTier = 0;
                this.clearanceBoss = null;
                this.clearanceBossBullets = [];
                this.weaponBuffType = null; // 'rapid' | 'spread' | 'plasma'
                this.weaponBuffTimer = 0;
                this.debuffType = null; // 'slow_ship' | 'jam_guns' | 'scatter'
                this.debuffTimer = 0;
                this.runRocksDestroyed = 0;

                this.runBlueSparks = 0;
                this.runRareCoins = 0;
                this.runSparks = 0;
                this.runNearMisses = 0;
                this.runXp = 0;
                this.runTime = 0;
                this.difficulty = 1;

                this.obstacles = [];
                this.blueSparks = [];
                this.rareCoins = [];
                this.powerups = []; // shield, magnet, slowmo, emp_bomb
                this.particles = [];
                this.floatingTexts = [];
                this.stars = [];

                this.spawnTimer = 0;
                this.collectibleTimer = 0;
                this.powerupTimer = 5.5;
                this.lastWideBarrierSide = 0;

                this.pointerActive = false;
                this.activePointerId = null;
                this.lastPointerX = 0;
                this.lastPointerY = 0;
                this.keys = {};

                this.lastFrameTime = performance.now();
                this.toastTimeout = null;
                this.questTickerInterval = null;

                this.coinMatrix = [
                    [0, 0, 1, 1, 1, 1, 0, 0],
                    [0, 1, 3, 2, 2, 2, 1, 0],
                    [1, 3, 2, 1, 1, 2, 2, 1],
                    [1, 2, 2, 3, 1, 2, 2, 1],
                    [1, 2, 2, 3, 1, 2, 2, 1],
                    [1, 2, 2, 1, 1, 2, 2, 1],
                    [0, 1, 2, 2, 2, 2, 1, 0],
                    [0, 0, 1, 1, 1, 1, 0, 0]
                ];

                this.resize();
                this.initStars();

                this.bindEvents();
                this.updateAllUI();
                this.updateFullscreenUI();
                this.startQuestTimerTicker();

                this.cloud.init().catch(() => {});
                this.initOnlineUI();
            }

            loadSettings() {
                const defaults = { muted: false, shakeEnabled: true, lastMode: 'DRIVE', onlineVisible: true, perfMode: 'normal', customFps: 90 };
                try {
                    const raw = localStorage.getItem('xpace_settings_v1');
                    if (!raw) return defaults;
                    return { ...defaults, ...JSON.parse(raw) };
                } catch (e) {
                    return defaults;
                }
            }

            saveSettings(patch = {}) {
                this.settings = { ...this.settings, ...patch };
                try {
                    localStorage.setItem('xpace_settings_v1', JSON.stringify(this.settings));
                } catch (e) {}
            }

            initOnlineUI() {
                this.online.setIdentity({
                    uid: this.cloud.getLeaderboardUid(),
                    nickname: this.pass.state.nickname || 'Пилот',
                    title: this.pass.state.equippedTitle || 'novice',
                    theme: this.pass.state.equippedTheme || 'default',
                    level: this.pass.getLevelInfo().level,
                    score: Number(this.pass.state.bestScore) || 0
                });
                this.online.onStatus(() => this.refreshOnlineChip());
                this.refreshOnlineChip();
                this.online.probe().then(ok => {
                    if (ok) this.online.startPresence();
                    this.refreshOnlineChip();
                }).catch(() => {});
                setInterval(() => this.refreshOnlineChip(), 15000);
            }

            refreshOnlineChip() {
                const chip = document.getElementById('onlineStatusChip');
                const label = document.getElementById('onlineChipLabel');
                if (!chip || !label) return;
                const st = this.online.status;
                chip.classList.remove('online', 'offline', 'checking');
                chip.classList.add(st === 'ONLINE' ? 'online' : (st === 'CHECKING' ? 'checking' : 'offline'));
                label.textContent = this.online.describe();
            }

            openOnlineModal() {
                this.renderOnlineModal();
                document.getElementById('onlineOverlay').classList.remove('hidden');
                this.runOnlineProbe(true);
            }

            renderOnlineModal() {
                const list = document.getElementById('onlineDiagList');
                if (!list) return;
                const hub = this.online;
                const onlineCls = hub.status === 'ONLINE' ? 'ok' : 'bad';
                const onlineText = hub.status === 'ONLINE' ? 'РАБОТАЕТ' : (hub.status === 'CHECKING' ? 'ПРОВЕРКА' : 'НЕДОСТУПЕН');
                const fbCls = hub.firebaseStatus === 'работает' ? 'ok' : 'bad';
                const lastSync = hub.lastSyncAt ? new Date(hub.lastSyncAt).toLocaleTimeString('ru-RU') : '—';
                const best = Number(this.pass.state.bestScore) || 0;
                const pushed = hub.lastPushAt ? new Date(hub.lastPushAt).toLocaleTimeString('ru-RU') : 'ещё не отправлялся';

                list.innerHTML = `
                    <div class="online-diag-row"><span>Публичный релей (рекорды)</span><strong class="${onlineCls}">${onlineText}</strong></div>
                    <div class="online-diag-row"><span>Пилотов в сети сейчас</span><strong>${hub.pilotsOnline || 0}</strong></div>
                    <div class="online-diag-row"><span>Облако Firebase</span><strong class="${fbCls}">${this.escapeHtml(hub.firebaseStatus)}</strong></div>
                    <div class="online-diag-row"><span>Мой рекорд</span><strong>${best}</strong></div>
                    <div class="online-diag-row"><span>Отправка рекорда</span><strong>${pushed}</strong></div>
                    <div class="online-diag-row"><span>Последняя синхронизация</span><strong>${lastSync}</strong></div>
                    <div class="online-diag-row"><span>Ошибка канала</span><strong class="${hub.lastError ? 'bad' : 'ok'}">${this.escapeHtml(hub.lastError || 'нет')}</strong></div>
                `;
            }

            async runOnlineProbe(silent = false) {
                if (!silent) this.showToast('Проверяю онлайн-канал...');
                this.online.status = 'CHECKING';
                this.refreshOnlineChip();
                const ok = await this.online.probe(true);
                this.renderOnlineModal();
                this.refreshOnlineChip();
                if (ok) this.online.startPresence();
                if (!silent) {
                    this.showToast(ok
                        ? `Онлайн работает! Пилот(ов) в сети: ${this.online.pilotsOnline}`
                        : `Онлайн недоступен: ${this.online.lastError || 'нет связи'}. Играем локально.`);
                }
            }

            async pushMyRecordToOnline() {
                const profile = this.pass.state;
                if (this.cloud.isTesterProfile(profile)) {
                    this.showToast('Тестовые рекорды остаются в профиле разработчика.');
                    return;
                }
                const scores = leaderboardBestScores(profile);
                if (!scores.bestScore && !scores.bestExpeditionSectors) {
                    this.showToast('Сначала установите рекорд в забеге!');
                    return;
                }
                const ok = await this.cloud.publishLeaderboardRecord(profile, this.pass.getLevelInfo().level, true);
                this.renderOnlineModal();
                this.refreshOnlineChip();
                this.showToast(ok
                    ? 'Рекорды отправлены в таблицу лидеров!'
                    : `Не удалось отправить: ${this.online.lastError || 'нет связи'}`);
            }

            toggleSound() {
                const isMuted = this.sound.toggleMute();
                const onIcon = document.getElementById('iconSoundOn');
                const offIcon = document.getElementById('iconSoundOff');
                if (onIcon) onIcon.style.display = isMuted ? 'none' : 'block';
                if (offIcon) offIcon.style.display = isMuted ? 'block' : 'none';
                if (!isMuted && this.state === 'PLAYING') {
                    this.sound.startBgm(this.flightMode(), this.overdriveActive);
                } else if (!isMuted) {
                    const hangarOpen = document.getElementById('hangarOverlay');
                    if (hangarOpen && !hangarOpen.classList.contains('hidden')) {
                        this.sound.startBgm('SHOP');
                    } else if (this.state === 'MENU') {
                        this.sound.startBgm('MENU');
                    }
                }
                this.saveSettings({ muted: isMuted });
                this.renderSettingsModal();
                this.showToast(isMuted ? 'Звук и музыка выключены' : 'Звук и музыка включены');
            }

            triggerShake(mag = 6, time = 0.28) {
                if (this.settings && this.settings.shakeEnabled === false) return;
                this.shakeMag = Math.max(this.shakeMag, mag);
                this.shakeTime = Math.max(this.shakeTime, time);
            }

            onComboIncreased() {
                const marks = [5, 8, 10];
                marks.forEach(mark => {
                    if (this.combo >= mark && !this.comboMilestones.has(mark)) {
                        this.comboMilestones.add(mark);
                        this.addFloatingText(this.player.x, this.player.y - 34, `КОМБО x${mark}!`, mark >= 10 ? '#ffd60a' : '#7dd3fc');
                        this.addOverdriveCharge(mark >= 10 ? 14 : 7);
                        this.triggerShake(3, 0.16);
                        this.sound.playRareCoin(mark);
                    }
                });
            }

            updatePauseStats() {
                const scoreEl = document.getElementById('pauseStatScore');
                const timeEl = document.getElementById('pauseStatTime');
                const sparksEl = document.getElementById('pauseStatSparks');
                if (scoreEl) scoreEl.textContent = Math.floor(this.score);
                if (timeEl) timeEl.textContent = `${Math.floor(this.runTime)}с`;
                if (sparksEl) sparksEl.textContent = this.runBlueSparks + this.runRareCoins;
            }
        }

        // Adds prototype methods while retaining normal class-method descriptors.
        function defineNeonDriftGameMethods(methods) {
            const descriptors = Object.getOwnPropertyDescriptors(methods);
            Object.keys(descriptors).forEach(name => {
                descriptors[name].enumerable = false;
            });
            Object.defineProperties(NeonDriftGame.prototype, descriptors);
        }
