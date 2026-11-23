        // Input and DOM event bindings
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            bindClick(id, handler, soundType = 'click') {
                const el = document.getElementById(id);
                if (!el) return;
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.sound.init();
                    // Музыка главного меню: стартует после первого клика в меню, пока ничего не играет
                    // Не запускаем, если уже играет другая музыка (магазин, игра и т.д.)
                    if (this.state === 'MENU' && this.sound.bgmMode === 'NONE') {
                        this.sound.startBgm('MENU');
                    }
                    if (soundType === 'back') this.sound.playUiBack();
                    else if (soundType === 'start') this.sound.playStartGameJingle();
                    else if (soundType === 'click') this.sound.playUiClick();
                    handler(e);
                });
            },

            bindEvents() {
                this.bindClick('btnStartExpedition', () => {
                    this.gameMode = 'EXPEDITION';
                    this.saveSettings({ lastMode: this.gameMode });
                    this.startGame();
                }, 'start');
                for (const upgrade of ['Power', 'Cooling', 'Shield', 'Magnet', 'Chrono', 'Reactor', 'Double']) {
                    this.bindClick('expedition' + upgrade, () => this.resumeExpedition(upgrade));
                }
                this.bindClick('expeditionExit', () => {
                    if (this.state === 'REFIT') this.gameOver();
                }, 'back');
                window.addEventListener('resize', () => this.resize());
                document.addEventListener('fullscreenchange', () => {
                    this.resize();
                    this.updateFullscreenUI();
                });

                const releaseInput=()=>{this.keys={};this.pointerActive=false;this.activePointerId=null;};
                window.addEventListener('blur',()=>{releaseInput();if(this.state==='PLAYING')this.pauseGame();});
                document.addEventListener('visibilitychange', () => {
                    if(document.hidden){releaseInput();if(this.state==='PLAYING')this.pauseGame();}
                });

                this.canvas.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    if (this.state !== 'PLAYING') return;
                    if (this.pointerActive) return;
                    this.pointerActive = true;
                    this.activePointerId = e.pointerId;
                    this.lastPointerX = e.clientX;
                    this.lastPointerY = e.clientY;
                });

                window.addEventListener('pointermove', (e) => {
                    if (!this.pointerActive || e.pointerId !== this.activePointerId || this.state !== 'PLAYING') return;
                    const dx = e.clientX - this.lastPointerX;
                    const dy = e.clientY - this.lastPointerY;
                    this.lastPointerX = e.clientX;
                    this.lastPointerY = e.clientY;

                    const moveMult = (this.debuffTimer > 0 && this.debuffType === 'slow_ship') ? 0.58 : 1.18;
                    this.player.x = Math.max(22, Math.min(this.width - 22, this.player.x + dx * moveMult));
                    this.player.y = Math.max(82, Math.min(this.height - 30, this.player.y + dy * moveMult));
                    this.player.tilt = Math.max(-0.42, Math.min(0.42, dx * 0.035));
                });

                const endPointer = (e) => {
                    if (this.pointerActive && (e.pointerId === undefined || e.pointerId === this.activePointerId)) {
                        this.pointerActive = false;
                        this.activePointerId = null;
                    }
                };

                window.addEventListener('pointerup', endPointer);
                window.addEventListener('pointercancel', endPointer);

                window.addEventListener('keydown', (e) => {
                    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
                    this.keys[e.code] = true;
                    if (this.state === 'PLAYING' && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) e.preventDefault();
                    if (e.repeat) return;
                    if (e.code === 'Escape' || e.code === 'KeyP') {
                        if (this.state === 'PLAYING') this.pauseGame();
                        else if (this.state === 'PAUSED') this.resumeGame();
                    }
                    if (e.code === 'KeyM') {
                        this.toggleSound();
                    }
                    if ((e.code === 'Enter' || e.code === 'Space') && this.state === 'MENU') {
                        const modeOverlay = document.getElementById('modeSelectOverlay');
                        const anyOverlayOpen = document.querySelector('.overlay:not(.hidden):not(#startOverlay)');
                        if (modeOverlay && modeOverlay.classList.contains('hidden') && !anyOverlayOpen) {
                            e.preventDefault();
                            modeOverlay.classList.remove('hidden');
                        }
                    }
                    if (e.code === 'KeyR' && (this.state === 'GAMEOVER' || this.state === 'PAUSED')) {
                        this.startGame();
                    }
                });

                window.addEventListener('keyup', (e) => {
                    this.keys[e.code] = false;
                });

                // Профиль, титулы (по клику на титул), оформление (по клику на карандаш) и контракты
                this.bindClick('btnOpenProfileCard', () => this.openProfileModal(), 'click');
                this.bindClick('btnOpenProfile', () => this.openProfileModal(), 'click');
                this.bindClick('profileCardTitle', () => this.openTitlesModal(), 'click');
                this.bindClick('btnCloseTitles', () => {
                    document.getElementById('titlesOverlay').classList.add('hidden');
                    this.renderProfileModal();
                    this.updateAllUI();
                }, 'back');

                this.bindClick('btnEditProfileTheme', () => this.openThemesModal(), 'click');
                this.bindClick('btnCloseThemes', () => {
                    document.getElementById('themesOverlay').classList.add('hidden');
                    this.renderProfileModal();
                    this.updateAllUI();
                }, 'back');

                this.bindClick('btnOpenContractsMenu', () => this.openContractsModal(), 'click');
                this.bindClick('btnCloseContracts', () => {
                    document.getElementById('contractsOverlay').classList.add('hidden');
                    this.updateAllUI();
                }, 'back');

                /* Контракты 2.0: делегирование фильтров, снятия со слота и «ЗАБРАТЬ ВСЁ» */
                const contractsOverlayEl = document.getElementById('contractsOverlay');
                if (contractsOverlayEl) {
                    contractsOverlayEl.addEventListener('click', (event) => {
                        const target = event.target instanceof Element ? event.target : null;
                        if (!target) return;

                        const filterBtn = target.closest('.contract-filter-btn');
                        if (filterBtn) {
                            this.contractFilter = filterBtn.dataset.filter || 'ALL';
                            this.sound.playUiClick();
                            this.renderContractsModal();
                            return;
                        }

                        const unselectBtn = target.closest('[data-unselect]');
                        if (unselectBtn) {
                            const contractId = unselectBtn.getAttribute('data-unselect');
                            this.pass.unselectContract(contractId);
                            this.sound.playUiClick();
                            this.renderContractsModal();
                            this.updateAllUI();
                            this.showToast('Контракт снят со слота');
                            return;
                        }

                        const claimAllBtn = target.closest('#btnClaimAllContracts');
                        if (claimAllBtn) {
                            const results = this.pass.claimAllReadyContracts();
                            if (!results.length) {
                                this.sound.playUiClick();
                                this.showToast('Нет готовых наград — сначала выполните контракты');
                                return;
                            }
                            const total = results.reduce((sum, res) => sum + res.sparks, 0);
                            const rewards = results.filter(res => res.rewardLabel).map(res => res.rewardLabel);
                            this.showToast(rewards.length
                                ? `[[xp:gift]] Получено ${results.length} контракт(ов): +${total} [[xp:spark]] и ${rewards.join(', ')}!`
                                : `[[xp:gift]] Получено ${results.length} контракт(ов): +${total} [[xp:spark]]!`);
                            this.renderContractsModal();
                            this.updateAllUI();
                        }
                    });
                }

                this.bindClick('btnProfileToSettings', () => {
                    document.getElementById('profileOverlay').classList.add('hidden');
                    this.openSettingsModal();
                }, 'click');
                this.bindClick('btnCloseProfile', () => {
                    document.getElementById('profileOverlay').classList.add('hidden');
                    this.updateAllUI();
                }, 'back');

                // Отдельное окно Настроек
                this.bindClick('btnOpenSettingsMenu', () => this.openSettingsModal(), 'click');
                this.bindClick('btnOpenSettingsPause', () => this.openSettingsModal(), 'click');
                this.bindClick('btnCloseSettings', () => {
                    document.getElementById('settingsOverlay').classList.add('hidden');
                    this.updateAllUI();
                }, 'back');
                this.bindClick('btnSettingsSound', () => this.toggleSound(), 'none');
                this.bindClick('btnSettingsShake', () => {
                    const nextVal = this.settings.shakeEnabled === false;
                    this.saveSettings({ shakeEnabled: nextVal });
                    this.renderSettingsModal();
                    this.showToast(nextVal ? 'Тряска экрана включена' : 'Тряска экрана выключена');
                }, 'click');
                this.bindClick('btnSettingsFullscreen', () => this.toggleFullscreen(), 'click');
                this.bindClick('btnPerfNormal', () => {
                    this.saveSettings({ perfMode: 'normal' });
                    this.renderSettingsModal();
                    this.showToast('Обычный режим: авто в Драйве, 60 FPS в Зачистке');
                }, 'click');
                this.bindClick('btnPerfHigh', () => {
                    this.saveSettings({ perfMode: 'high' });
                    this.renderSettingsModal();
                    this.showToast('Режим производительности: Мощный (120 FPS)');
                }, 'click');
                this.bindClick('btnPerfCustom', () => {
                    const currentCustom = Math.max(15, Math.min(240, Math.round(Number(this.settings.customFps) || 90)));
                    this.saveSettings({ perfMode: 'custom', customFps: currentCustom });
                    this.renderSettingsModal();
                    this.showToast(`Режим производительности: Кастомный (${currentCustom} FPS)`);
                }, 'click');

                const fpsRangeEl = document.getElementById('customFpsRange');
                const fpsNumEl = document.getElementById('customFpsNumber');
                if (fpsRangeEl) {
                    fpsRangeEl.addEventListener('input', () => {
                        const val = Math.max(15, Math.min(240, Math.round(Number(fpsRangeEl.value) || 60)));
                        if (fpsNumEl) fpsNumEl.value = String(val);
                        this.saveSettings({ perfMode: 'custom', customFps: val });
                        const fpsBadge = document.getElementById('settingsActiveFpsBadge');
                        if (fpsBadge) fpsBadge.textContent = `${val} FPS`;
                    });
                }
                if (fpsNumEl) {
                    fpsNumEl.addEventListener('change', () => {
                        const val = Math.max(15, Math.min(240, Math.round(Number(fpsNumEl.value) || 60)));
                        fpsNumEl.value = String(val);
                        if (fpsRangeEl) fpsRangeEl.value = String(val);
                        this.saveSettings({ perfMode: 'custom', customFps: val });
                        this.renderSettingsModal();
                        this.showToast(`Установлено: ${val} кадров в секунду`);
                    });
                }
                this.bindClick('btnSettingsOpenOnline', () => {
                    document.getElementById('settingsOverlay').classList.add('hidden');
                    this.openOnlineModal();
                }, 'click');

                // Иконка огня серии входов рядом с ежедневным подарком
                this.bindClick('menuFireStreakBadge', () => {
                    const info = this.getDailyStreakRewardInfo();
                    this.openDailyBonusModal();
                    this.showToast(`[[xp:fire]] Серия входов: ${info.activeFireStreak} дн. подряд!`);
                }, 'click');

                this.bindClick('btnCloudRegister', () => {
                    const loginVal = document.getElementById('authLoginInput').value;
                    const passVal = document.getElementById('authPasswordInput').value;
                    this.cloud.registerWithLogin(
                        loginVal,
                        passVal,
                        this.pass.state,
                        this.pass.getLevelInfo().level,
                        (msg) => this.showToast(msg)
                    );
                }, 'click');

                this.bindClick('btnCloudLogin', () => {
                    const loginVal = document.getElementById('authLoginInput').value;
                    const passVal = document.getElementById('authPasswordInput').value;
                    this.cloud.loginWithLogin(
                        loginVal,
                        passVal,
                        (msg) => {
                            this.showToast(msg);
                            this.renderProfileModal();
                            this.updateAllUI();
                        }
                    );
                }, 'click');

                this.bindClick('btnCloudSyncNow', () => {
                    this.sound.playUiClick();
                    this.cloud.syncAccountNow((msg) => this.showToast(msg));
                });

                this.bindClick('btnCloudLogout', () => {
                    this.cloud.logoutAccount((msg) => {
                        this.showToast(msg);
                        this.renderProfileModal();
                    });
                }, 'back');

                this.bindClick('btnExportSaveCode', () => {
                    const codeStr = this.generateTransferCode();
                    const area = document.getElementById('transferCodeArea');
                    if (area) {
                        area.value = codeStr;
                        area.select();
                    }
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(codeStr).then(() => {
                            this.showToast('Код переноса создан и скопирован в буфер!');
                        }).catch(() => {
                            this.showToast('Код переноса создан — скопируйте его из поля!');
                        });
                    } else {
                        this.showToast('Код переноса создан — скопируйте его из поля!');
                    }
                }, 'click');

                this.bindClick('btnImportSaveCode', () => {
                    const area = document.getElementById('transferCodeArea');
                    const rawCode = area ? area.value.trim() : '';
                    if (!rawCode) {
                        this.showToast('Вставьте код переноса в поле выше!');
                        return;
                    }
                    const ok = this.applyTransferCode(rawCode);
                    if (ok) {
                        this.sound.playLevelUp();
                        this.syncNicknameInput();
                        this.renderProfileModal();
                        this.updateAllUI();
                        this.showToast('Сохранение успешно восстановлено из кода!');
                    } else {
                        this.sound.playUiBack();
                        this.showToast('Неверный или повреждённый код переноса!');
                    }
                }, 'click');

                this.bindClick('btnTogglePassVis', () => {
                    const pIn = document.getElementById('authPasswordInput');
                    const btn = document.getElementById('btnTogglePassVis');
                    if (!pIn) return;
                    const isHidden = pIn.type === 'password';
                    pIn.type = isHidden ? 'text' : 'password';
                    if (btn) btn.textContent = isHidden ? '[[xp:eye-off]]' : '[[xp:eye]]';
                }, 'click');

                this.bindClick('btnSaveNick', () => this.saveNicknameFromInput(), 'click');

                const nickInput = document.getElementById('nicknameInput');
                if (nickInput) {
                    nickInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.target.blur();
                            this.sound.playUiClick();
                            this.saveNicknameFromInput();
                        }
                    });
                }

                // Магазин Майами (Корабли, Маски Зверей, Неоновые Следы)
                this.bindClick('btnOpenHangar', () => this.openHangarModal(), 'click');
                this.bindClick('btnCloseHangar', () => {
                    document.getElementById('hangarOverlay').classList.add('hidden');
                    this.sound.stopBgm();
                    // Возвращаем музыку главного меню после выхода из магазина
                    if (this.state === 'MENU') this.sound.startBgm('MENU');
                    this.updateAllUI();
                }, 'back');
                this.bindClick('shopTabShips', () => {
                    this.activeShopTab = 'SHIPS';
                    this.trailPage = 0;
                    this.renderHangarModal();
                }, 'click');
                this.bindClick('shopTabMasks', () => {
                    this.activeShopTab = 'MASKS';
                    this.trailPage = 0;
                    this.renderHangarModal();
                }, 'click');
                this.bindClick('shopTabTrails', () => {
                    this.activeShopTab = 'TRAILS';
                    this.renderHangarModal();
                }, 'click');
                this.bindClick('shopTabThemes', () => {
                    this.activeShopTab = 'THEMES';
                    this.trailPage = 0;
                    this.renderHangarModal();
                }, 'click');
                this.bindClick('shopTabBundles', () => {
                    this.activeShopTab = 'BUNDLES';
                    this.trailPage = 0;
                    this.renderHangarModal();
                }, 'click');

                // Ежедневный подарок (открывает окно 10-дневной серии наград)
                this.bindClick('btnDailyBonus', () => this.openDailyBonusModal(), 'click');
                this.bindClick('btnCloseDailyBonus', () => {
                    document.getElementById('dailyBonusOverlay').classList.add('hidden');
                    this.updateAllUI();
                }, 'back');
                this.bindClick('btnClaimDailyModal', () => this.claimDailyBonus(), 'click');

                // Неожиданная анимация выпадения секретного титула «42 БРАТУХА» + переход к досье титула
                this.bindClick('btnEquip42TitleAndResume', () => {
                    this.pass.state.equippedTitle = 'bratukha_42';
                    this.pass.triggerSave(true);
                    this.updateAllUI();
                    this.openTitleInfoAfterDrop('Титул «[[xp:fire]] 42 БРАТУХА» надет!');
                }, 'click');
                this.bindClick('btnResumeAfterDrop', () => {
                    this.openTitleInfoAfterDrop();
                }, 'click');
                this.bindClick('btnCloseTitleInfoAndResume', () => {
                    document.getElementById('titleInfoOverlay').classList.add('hidden');
                    this.resumeAfterTitleDrop();
                }, 'start');

                this.bindClick('hudSparksPill', () => {
                    this.showToast(`Баланс: ${this.pass.state.sparks} Жёлтых Искр`);
                }, 'click');

                // Таблица лидеров и карточка пилота
                this.bindClick('btnOpenLeaderboard', () => this.openLeaderboardModal(false), 'click');
                this.bindClick('btnOpenLeaderboardEnd', () => {
                    this.activeLeaderboardMode = this.gameMode;
                    this.openLeaderboardModal(false);
                }, 'click');
                for (const [mode, { tab }] of Object.entries(LEADERBOARD_MODES)) {
                    this.bindClick(tab, () => {
                        this.activeLeaderboardMode = mode;
                        this.openLeaderboardModal(false);
                    }, 'click');
                }
                this.bindClick('btnCloseLeaderboard', () => {
                    document.getElementById('leaderboardOverlay').classList.add('hidden');
                }, 'back');
                this.bindClick('btnClosePilotInspect', () => {
                    document.getElementById('pilotInspectOverlay').classList.add('hidden');
                }, 'back');
                this.bindClick('btnRefreshLeaderboard', () => this.openLeaderboardModal(true), 'click');

                // Полный экран
                this.bindClick('btnFullscreenHud', () => this.toggleFullscreen(), 'click');
                this.bindClick('btnFullscreenStart', () => this.toggleFullscreen(), 'click');

                // Выбор режима и запуск игры
                this.bindClick('btnPlay', () => {
                    document.getElementById('modeSelectOverlay').classList.remove('hidden');
                }, 'click');
                this.bindClick('btnCloseModeSelect', () => {
                    document.getElementById('modeSelectOverlay').classList.add('hidden');
                }, 'back');
                this.bindClick('btnStartDriveMode', () => {
                    this.gameMode = 'DRIVE';
                    this.saveSettings({ lastMode: 'DRIVE' });
                    document.getElementById('modeSelectOverlay').classList.add('hidden');
                    this.startGame();
                }, 'start');
                this.bindClick('btnStartClearanceMode', () => {
                    this.gameMode = 'CLEARANCE';
                    this.saveSettings({ lastMode: 'CLEARANCE' });
                    document.getElementById('modeSelectOverlay').classList.add('hidden');
                    this.startGame();
                }, 'start');
                this.bindClick('btnRestart', () => this.startGame(), 'start');
                this.bindClick('btnRestartPause', () => this.startGame(), 'start');

                this.bindClick('btnPause', () => {
                    if (this.state === 'PLAYING') this.pauseGame();
                }, 'back');

                this.bindClick('btnResume', () => {
                    if (this.state === 'PAUSED') this.resumeGame();
                }, 'start');

                this.bindClick('btnMenuPause', () => this.returnToMenu(), 'back');
                this.bindClick('btnHomeEnd', () => this.returnToMenu(), 'back');

                // Звук и музыка
                this.bindClick('btnSound', () => this.toggleSound(), 'none');

                // Онлайн-диагностика (v15)
                this.bindClick('onlineStatusChip', () => this.openOnlineModal(), 'click');
                this.bindClick('btnCloseOnline', () => {
                    document.getElementById('onlineOverlay').classList.add('hidden');
                const settingsOv = document.getElementById('settingsOverlay');
                if (settingsOv) settingsOv.classList.add('hidden');
                ['dailyBonusOverlay', 'titlesOverlay', 'themesOverlay', 'contractsOverlay', 'pilotInspectOverlay'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.add('hidden');
                });
                }, 'back');
                this.bindClick('btnOnlineProbe', () => this.runOnlineProbe(false), 'click');
                this.bindClick('btnOnlinePush', () => this.pushMyRecordToOnline(), 'click');
                this.bindClick('btnOnlineRefreshTop', () => {
                    document.getElementById('onlineOverlay').classList.add('hidden');
                    this.openLeaderboardModal(true);
                }, 'click');

                // Двойной клик (2 нажатия) на название игры Xpace:
                // - из обычного аккаунта -> открывает дебаг-меню и переключает в Админ-аккаунт
                // - из Админ-аккаунта -> возвращает в ваш обычный аккаунт
                const logoTrigger = document.getElementById('hmLogoTrigger');
                if (logoTrigger) {
                    logoTrigger.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.devLogoTaps = (this.devLogoTaps || 0) + 1;
                        clearTimeout(this.devLogoTapTimer);
                        this.devLogoTapTimer = setTimeout(() => { this.devLogoTaps = 0; }, 550);
                        if (this.devLogoTaps >= 2) {
                            this.devLogoTaps = 0;
                            if (this.isAdminSession) {
                                this.exitAdminAccount();
                            } else {
                                this.sound.playLevelUp();
                                this.openDevModal();
                            }
                        }
                    });
                }

                // Также двойной клик по заголовку DEV КОНСОЛЬ возвращает в обычный аккаунт
                const devCardTitle = document.querySelector('#devOverlay .game-title');
                if (devCardTitle) {
                    devCardTitle.style.cursor = 'pointer';
                    devCardTitle.addEventListener('dblclick', (e) => {
                        e.stopPropagation();
                        if (this.isAdminSession) this.exitAdminAccount();
                    });
                }

                window.addEventListener('keydown', (e) => {
                    if (e.code === 'F9' || e.code === 'Backquote') {
                        e.preventDefault();
                        this.openDevModal();
                    }
                });

                this.bindClick('btnDevMenuChip', () => this.openDevModal(), 'click');
                this.bindClick('btnDevPause', () => this.openDevModal(), 'click');
                this.bindClick('btnCloseDev', () => {
                    document.getElementById('devOverlay').classList.add('hidden');
                    this.updateAllUI();
                }, 'back');

                this.bindClick('btnUnlockDev', () => this.tryUnlockDevConsole(), 'click');
                const devPinInput = document.getElementById('devPinInput');
                if (devPinInput) {
                    devPinInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.target.blur();
                            this.tryUnlockDevConsole();
                        }
                    });
                }

                this.bindClick('btnDevSwitchTestAcc', () => this.activateDevTestAccount(), 'click');
                this.bindClick('btnDevToggleHideTop', () => {
                    if (this.isAdminSession) {
                        this.exitAdminAccount();
                    } else {
                        this.enterAdminAccount();
                        this.renderDevModal();
                    }
                }, 'click');

                this.bindClick('btnDevAdd1k', () => {
                    const granted = this.pass.awardSparks(0, 950);
                    this.pass.triggerSave();
                    this.updateAllUI();
                    this.showToast(`[[xp:tools]] +${granted.toLocaleString('ru-RU')} Жёлтых Искр начислено!`);
                }, 'click');

                this.bindClick('btnDevAdd10k', () => {
                    const granted = this.pass.awardSparks(0, 9500);
                    this.pass.triggerSave();
                    this.updateAllUI();
                    this.showToast(`[[xp:tools]] +${granted.toLocaleString('ru-RU')} Жёлтых Искр начислено!`);
                }, 'click');

                this.bindClick('btnDevZeroSparks', () => {
                    this.pass.state.sparks = 0;
                    this.pass.state.sparkRewardRemainder = INITIAL_SPARK_REWARD_REMAINDER;
                    this.pass.triggerSave();
                    this.updateAllUI();
                    this.showToast('[[xp:tools]] Баланс Искр обнулён (0 [[xp:spark]])');
                }, 'back');

                this.bindClick('btnDevAddLvl', () => {
                    const req = this.pass.getLevelInfo().requiredXp;
                    this.pass.addXp(req);
                    this.updateAllUI();
                    this.showToast(`[[xp:tools]] Уровень пасса повышен: УР. ${this.pass.getLevelInfo().level}!`);
                }, 'click');

                this.bindClick('btnDevAdd500Xp', () => {
                    this.pass.addXp(500);
                    this.updateAllUI();
                    this.showToast('[[xp:tools]] +500 XP добавлено в XPACE Пасс!');
                }, 'click');

                this.bindClick('btnDevMaxPass', () => {
                    let totalNeeded = 0;
                    for (let l = 1; l < this.pass.maxLevel; l++) {
                        totalNeeded += this.pass.getXpRequiredForLevel(l);
                    }
                    this.pass.state.xp = Math.max(this.pass.state.xp, totalNeeded + 1500);
                    this.pass.triggerSave();
                    this.updateAllUI();
                    this.showToast('[[xp:tools]] Открыт 30 Уровень Пасса + 1500 бонусных XP!');
                }, 'click');

                this.bindClick('btnDevResetTimers', () => {
                    this.pass.state.lastDailyClaim = 0;
                    this.pass.state.dailyScoreXpEarned = 0;
                    this.pass.state.quests.forEach(q => { q.cooldownUntil = 0; });
                    this.pass.checkCooldowns();
                    this.pass.triggerSave();
                    this.updateAllUI();
                    this.showToast('[[xp:tools]] Все таймеры квестов и бонуса дня сброшены!');
                }, 'click');

                this.bindClick('btnDevUnlockShips', () => {
                    const devShips = SHIP_CATALOG.filter(s => !s.adminOnly && !s.bundleOnly).map(s => s.id);
                    this.pass.state.unlockedShips = Array.from(new Set([...(this.pass.state.unlockedShips || []), ...devShips]));
                    this.pass.triggerSave();
                    this.updateAllUI();
                    this.showToast('[[xp:tools]] Разблокированы ВСЕ корабли (кроме эксклюзивов акций и наград)!')
                }, 'click');

                this.bindClick('btnDevUnlockAllCosmetics', () => {
                    const st = this.pass.state;
                    st.unlockedShips = Array.from(new Set([...(st.unlockedShips || []), ...SHIP_CATALOG.filter(s => !s.adminOnly && !s.bundleOnly).map(s => s.id)]));
                    st.unlockedMasks = Array.from(new Set([...(st.unlockedMasks || []), ...MASK_CATALOG.map(m => m.id)]));
                    st.unlockedTrails = Array.from(new Set([...(st.unlockedTrails || []), ...TRAIL_CATALOG.map(t => t.id)]));
                    st.unlockedThemes = Array.from(new Set([...(st.unlockedThemes || []), ...PROFILE_THEMES.filter(th => !th.bundleOnly).map(th => th.id)]));
                    st.unlockedTitles = Array.from(new Set([...(st.unlockedTitles || []), ...PLAYER_TITLES.filter(ti => !ti.bundleOnly).map(ti => ti.id)]));
                    this.pass.triggerSave();
                    this.updateAllUI();
                    this.showToast('[[xp:tools]] Открыты ВСЕ корабли, модули, следы, стили и титулы!');
                }, 'click');

                this.bindClick('btnDevWipeProfile', () => {
                    if (!this._confirmWipe) {
                        this._confirmWipe = true;
                        this.showToast('Нажмите ещё раз для полного сброса прогресса!');
                        setTimeout(() => { this._confirmWipe = false; }, 3500);
                        return;
                    }
                    this._confirmWipe = false;
                    const keepTester = Boolean(this.pass.state.isDevTester);
                    this.pass.replaceStateFromAccount({
                        nickname: keepTester ? 'DEV_Tester' : '',
                        isDevTester: keepTester
                    });
                    this.pass.triggerSave();
                    this.syncNicknameInput();
                    this.updateAllUI();
                    this.showToast('[[xp:tools]] Прогресс сброшен до состояния нового игрока!');
                }, 'back');

                this.bindClick('btnDevGodMode', () => {
                    this.devGodMode = !this.devGodMode;
                    this.renderDevModal();
                    this.showToast(this.devGodMode ? '[[xp:bolt]] Бессмертие ВКЛЮЧЕНО!' : 'Бессмертие выключено');
                }, 'click');

                this.bindClick('btnDevOverdrive', () => {
                    if (this.state !== 'PLAYING' && this.state !== 'PAUSED') {
                        this.showToast('Сначала начните забег!');
                        return;
                    }
                    this.overdriveCharge = 100;
                    this.addOverdriveCharge(1);
                    document.getElementById('devOverlay').classList.add('hidden');
                    if (this.state === 'PAUSED') this.resumeGame();
                }, 'click');

                this.bindClick('btnDevShield', () => {
                    if (this.state !== 'PLAYING' && this.state !== 'PAUSED') {
                        this.showToast('Сначала начните забег!');
                        return;
                    }
                    this.player.shield = true;
                    document.getElementById('shieldIndicator').classList.add('active');
                    this.sound.playShield();
                    this.showToast('[[xp:shield]] Энерго-щит выдан!');
                }, 'click');

                this.bindClick('btnDevSuperWeapons', () => {
                    if (this.state !== 'PLAYING' && this.state !== 'PAUSED') {
                        this.showToast('Сначала начните забег!');
                        return;
                    }
                    this.weaponBuffType = 'spread';
                    this.weaponBuffTimer = 15.0;
                    this.doubleScoreTimer = 15.0;
                    this.updateHud();
                    this.showToast('[[xp:blaster]] Тройной луч + Очки x2 на 15 сек!');
                }, 'click');

                this.bindClick('btnDevTest42Drop', () => {
                    document.getElementById('devOverlay').classList.add('hidden');
                    this.triggerTitle42Drop(true);
                }, 'click');

                this.bindClick('btnDevHideLbPlayer', () => {
                    const inp = document.getElementById('devLbCleanInput');
                    const raw = inp ? String(inp.value || '').trim() : '';
                    if (!raw) {
                        this.showToast('Введите никнейм или UID аккаунта!');
                        return;
                    }
                    const rules = this.online.getHiddenLeaderboardRules();
                    if (raw.startsWith('pilot-') || raw.startsWith('acc:') || raw.length > 18) {
                        if (!rules.uids.includes(raw)) rules.uids.push(raw);
                    } else {
                        if (!rules.nicks.includes(raw)) rules.nicks.push(raw);
                    }
                    this.online.saveHiddenLeaderboardRules(rules);
                    if (inp) inp.value = '';
                    this.showToast(`[[xp:trash]] Аккаунт «${raw}» убран из Топ-20!`);
                }, 'click');

                this.bindClick('btnDevHideGuests', () => {
                    const rules = this.online.getHiddenLeaderboardRules();
                    rules.hideGuests = true;
                    this.online.saveHiddenLeaderboardRules(rules);
                    this.showToast('[[xp:broom]] Все старые гостевые профили скрыты из Топ-20!');
                }, 'click');

                this.bindClick('btnDevRestoreLb', () => {
                    this.online.saveHiddenLeaderboardRules({ nicks: [], uids: [], hideGuests: false });
                    this.showToast('↺ Список скрытых игроков очищен!');
                }, 'click');

                this.bindClick('btnDevNextDailyDay', () => {
                    const yest = this.getLocalDayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
                    this.pass.state.lastDailyClaimDate = yest;
                    this.pass.state.lastDailyClaim = Date.now() - 25 * 60 * 60 * 1000;
                    this.pass.triggerSave();
                    this.updateAllUI();
                    this.showToast('[[xp:calendar]] Сдвинуто на следующий день! Откройте «БОНУС ДНЯ».');
                }, 'click');

                // НЕОН ПАСС
                this.bindClick('btnOpenPassStart', () => this.openPassModal(), 'click');
                this.bindClick('btnOpenPassEnd', () => this.openPassModal(), 'click');
                this.bindClick('btnClosePass', () => {
                    document.getElementById('passOverlay').classList.add('hidden');
                    this.updateAllUI();
                }, 'back');

                this.bindClick('tabBtnTrack', () => {
                    this.activePassTab = 'TRACK';
                    this.renderPassModal(true);
                }, 'click');

                this.bindClick('tabBtnQuests', () => {
                    this.activePassTab = 'QUESTS';
                    this.renderPassModal(false);
                }, 'click');
            }
        });
