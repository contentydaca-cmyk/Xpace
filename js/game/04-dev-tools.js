        // Developer tools and fullscreen
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            isDevModeUnlocked() {
                try {
                    return localStorage.getItem('xpace_dev_unlocked_v1') === '1';
                } catch (e) {
                    return Boolean(this._devUnlockedMem);
                }
            },

            setDevModeUnlocked(val) {
                this._devUnlockedMem = Boolean(val);
                this.devUnlocked = Boolean(val);
                try {
                    if (val) localStorage.setItem('xpace_dev_unlocked_v1', '1');
                    else localStorage.removeItem('xpace_dev_unlocked_v1');
                } catch (e) {}
                this.updateDevButtonsVisibility();
            },

            updateDevButtonsVisibility() {
                const chip = document.getElementById('btnDevMenuChip');
                const pauseBtn = document.getElementById('btnDevPause');
                if (chip) chip.classList.toggle('hidden', !this.devUnlocked);
                if (pauseBtn) pauseBtn.classList.toggle('hidden', !this.devUnlocked);
            },

            openDevModal() {
                if (!this.isAdminSession) {
                    this.enterAdminAccount();
                }
                this.renderDevModal();
                document.getElementById('devOverlay').classList.remove('hidden');
            },

            enterAdminAccount() {
                if (this.isAdminSession) return;
                if (this.state === 'PLAYING') this.pauseGame();
                // Сохраняем полную резервную копию обычного аккаунта игрока
                this._savedUserSession = {
                    activeLogin: this.cloud.activeLocalLogin || null,
                    state: JSON.parse(JSON.stringify(this.pass.state))
                };
                try {
                    localStorage.setItem('xpace_admin_backup_v1', JSON.stringify(this._savedUserSession));
                } catch (e) {}

                this.isAdminSession = true;
                this.setDevModeUnlocked(true);

                const adminState = {
                    nickname: 'ADMIN',
                    bestScore: 0,
                    xp: 0,
                    sparks: 99999,
                    claimedLevels: [],
                    quests: [],
                    questCounter: 1,
                    unlockedTitles: PLAYER_TITLES.map(t => t.id),
                    equippedTitle: 'century_18',
                    unlockedShips: SHIP_CATALOG.map(s => s.id),
                    equippedShip: 'skin42',
                    unlockedMasks: MASK_CATALOG.map(m => m.id),
                    equippedMask: 'none',
                    unlockedTrails: TRAIL_CATALOG.map(tr => tr.id),
                    equippedTrail: 'default',
                    unlockedThemes: PROFILE_THEMES.map(th => th.id),
                    equippedTheme: 'imperial_18',
                    isDevTester: true
                };

                this.pass.replaceStateFromAccount(adminState);
                this.cloud.updateAuthUI('admin');
                this.syncNicknameInput();
                this.updateAllUI();
                this.showToast('[[xp:tools]] АДМИН-АККАУНТ АКТИВЕН (прогресс не сохраняется · 2× клик по Xpace для выхода)');
            },

            exitAdminAccount() {
                if (!this.isAdminSession) return;
                if(this.state !== 'MENU')this.returnToMenu();
                this.isAdminSession = false;
                this.devGodMode = false;

                let backup = this._savedUserSession;
                if (!backup) {
                    try {
                        const raw = localStorage.getItem('xpace_admin_backup_v1');
                        if (raw) backup = JSON.parse(raw);
                    } catch (e) {}
                }
                try {
                    localStorage.removeItem('xpace_admin_backup_v1');
                } catch (e) {}

                if (backup && backup.state) {
                    this.cloud.setStoredActiveLogin(backup.activeLogin || null);
                    this.pass.replaceStateFromAccount(backup.state);
                    this.cloud.updateAuthUI(backup.activeLogin || null);
                } else {
                    const localData = this.cloud.loadLocal();
                    if (localData) this.pass.replaceStateFromAccount(localData);
                    this.cloud.updateAuthUI(this.cloud.activeLocalLogin || null);
                }
                this._savedUserSession = null;
                this.pass.triggerSave(true);

                const devOverlay = document.getElementById('devOverlay');
                if (devOverlay) devOverlay.classList.add('hidden');
                this.syncNicknameInput();
                this.updateAllUI();
                this.sound.playUiBack();
                this.showToast('[[xp:user]] Вы вернулись в свой обычный аккаунт!');
            },

            tryUnlockDevConsole() {
                this.enterAdminAccount();
                this.sound.playLevelUp();
                this.renderDevModal();
            },

            renderDevModal() {
                const lockScreen = document.getElementById('devLockScreen');
                const mainContent = document.getElementById('devMainContent');
                if (!lockScreen || !mainContent) return;

                lockScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');

                const banner = document.getElementById('devTopProtectionBanner');
                const hideBtn = document.getElementById('btnDevToggleHideTop');
                if (banner) {
                    banner.className = 'dev-shield-banner';
                    banner.textContent = '[[xp:shield]] АДМИН-ПЕСОЧНИЦА: Весь прогресс, очки и рекорды НЕ сохраняются и НЕ идут в Топ-20. Двойной клик по «Xpace» вернёт ваш обычный аккаунт.';
                }
                if (hideBtn) {
                    hideBtn.textContent = '↩ В ОБЫЧНЫЙ АККАУНТ';
                    hideBtn.classList.add('active-toggle');
                }

                const godBtn = document.getElementById('btnDevGodMode');
                if (godBtn) {
                    godBtn.textContent = this.devGodMode ? '[[xp:bolt]] БЕССМЕРТИЕ: ВКЛ' : '[[xp:bolt]] БЕССМЕРТИЕ: ВЫКЛ';
                    godBtn.classList.toggle('active-toggle', this.devGodMode);
                }
            },

            activateDevTestAccount() {
                this.enterAdminAccount();
                this.renderDevModal();
            },

            isFullscreenActive() {
                return Boolean(
                    document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement
                );
            },

            updateFullscreenUI() {
                const active = this.isFullscreenActive();
                const hudBtn = document.getElementById('btnFullscreenHud');
                const startBtnText = document.getElementById('btnFullscreenStartText');

                if (hudBtn) {
                    hudBtn.classList.toggle('fs-active', active);
                    hudBtn.title = active ? 'Выйти из полного экрана' : 'Полный экран';
                }
                if (startBtnText) {
                    startBtnText.textContent = active ? 'ВЫЙТИ' : 'ЭКРАН';
                }
                const settingsFsBtn = document.getElementById('btnSettingsFullscreen');
                if (settingsFsBtn) {
                    settingsFsBtn.textContent = active ? 'ВЫЙТИ' : 'ОТКРЫТЬ';
                    settingsFsBtn.classList.toggle('off', !active);
                }
            },

            async toggleFullscreen() {
                const elem = document.documentElement;
                try {
                    if (!this.isFullscreenActive()) {
                        const req =
                            elem.requestFullscreen ||
                            elem.webkitRequestFullscreen ||
                            elem.mozRequestFullScreen ||
                            elem.msRequestFullscreen;

                        if (req) {
                            await req.call(elem);
                            this.showToast('Полноэкранный режим включён');
                        } else {
                            this.showToast('Браузер не поддерживает программный полный экран');
                        }
                    } else {
                        const exit =
                            document.exitFullscreen ||
                            document.webkitExitFullscreen ||
                            document.mozCancelFullScreen ||
                            document.msExitFullscreen;
                        if (exit) await exit.call(document);
                    }
                } catch (err) {
                    this.showToast('Откройте страницу напрямую для полноэкранного режима');
                } finally {
                    setTimeout(() => {
                        this.resize();
                        this.updateFullscreenUI();
                    }, 120);
                }
            }
        });
