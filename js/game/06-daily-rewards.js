        // Timers, daily rewards and rare title drop
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            formatRemainingTime(ms) {
                const totalSec = Math.max(0, Math.ceil(ms / 1000));
                const mins = Math.floor(totalSec / 60);
                const secs = totalSec % 60;
                return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            },

            startQuestTimerTicker() {
                if (this.questTickerInterval) clearInterval(this.questTickerInterval);
                this.questTickerInterval = setInterval(() => {
                    const now = Date.now();
                    const refreshed = this.pass.checkCooldowns();
                    const passOverlay = document.getElementById('passOverlay');
                    const isPassOpen = passOverlay && !passOverlay.classList.contains('hidden');

                    this.updateDailyBonusButton();
                    this.updateShopOfferTimers(now);

                    if (refreshed) {
                        this.updateAllUI();
                        if (isPassOpen) {
                            this.renderPassModal(false);
                            this.showToast('Новый квест доступен в НЕОН ПАССЕ!');
                        }
                        return;
                    }

                    if (isPassOpen && this.activePassTab === 'QUESTS') {
                        const timerEls = document.querySelectorAll('[data-cooldown-until]');
                        timerEls.forEach(el => {
                            const targetTs = Number(el.getAttribute('data-cooldown-until')) || 0;
                            el.textContent = this.formatRemainingTime(targetTs - now);
                        });
                    }
                }, 1000);
            },

            getLocalDayKey(dateObj = new Date()) {
                const y = dateObj.getFullYear();
                const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                const d = String(dateObj.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            },

            getTimeUntilNextDayStr() {
                const now = new Date();
                const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
                const ms = Math.max(0, tomorrow.getTime() - now.getTime());
                const totalSec = Math.floor(ms / 1000);
                const hrs = Math.floor(totalSec / 3600);
                const mins = Math.floor((totalSec % 3600) / 60);
                const secs = totalSec % 60;
                return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            },

            getDailyStreakRewardInfo(now = new Date()) {
                const todayKey = this.getLocalDayKey(now);
                const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                const yesterdayKey = this.getLocalDayKey(yesterday);
                const { lastDailyClaimDate: lastDate, dailyStreak: prevStreak } = dailyClaimSnapshot(this.pass.state);
                const cycleLength = DAILY_REWARDS.length;

                if (lastDate === todayKey) {
                    const totalStreak = Math.max(1, prevStreak);
                    const cycleClaimed = ((totalStreak - 1) % cycleLength) + 1;
                    const nextDay = (totalStreak % cycleLength) + 1;
                    return {
                        day: nextDay,
                        nextTotalStreak: totalStreak,
                        activeFireStreak: totalStreak,
                        claimedCount: cycleClaimed,
                        claimedToday: true,
                        missedReset: false,
                        ready: false,
                        reward: DAILY_REWARDS[nextDay - 1],
                        countdownStr: this.getTimeUntilNextDayStr()
                    };
                }

                if (lastDate === yesterdayKey && prevStreak > 0) {
                    const nextTotal = prevStreak + 1;
                    const nextDay = (prevStreak % cycleLength) + 1;
                    return {
                        day: nextDay,
                        nextTotalStreak: nextTotal,
                        activeFireStreak: prevStreak,
                        claimedCount: prevStreak % cycleLength,
                        claimedToday: false,
                        missedReset: false,
                        ready: true,
                        reward: DAILY_REWARDS[nextDay - 1],
                        countdownStr: '00:00:00'
                    };
                }

                // Если пропущен хотя бы 1 календарный день — серия сбрасывается на День 1!
                const missedReset = Boolean(lastDate && prevStreak > 0);
                return {
                    day: 1,
                    nextTotalStreak: 1,
                    activeFireStreak: 0,
                    claimedCount: 0,
                    claimedToday: false,
                    missedReset: missedReset,
                    ready: true,
                    reward: DAILY_REWARDS[0],
                    countdownStr: '00:00:00'
                };
            },

            updateDailyBonusButton() {
                const btn = document.getElementById('btnDailyBonus');
                const txt = document.getElementById('btnDailyBonusText');
                const info = this.getDailyStreakRewardInfo();

                if (btn && txt) {
                    if (info.ready) {
                        btn.classList.remove('claimed');
                        txt.textContent = `ДАР · ДЕНЬ ${info.day}`;
                    } else {
                        btn.classList.add('claimed');
                        txt.textContent = `ДАР (${info.claimedCount}/${DAILY_REWARDS.length})`;
                    }
                }

                // Обновляем стилизованную иконку огня рядом с ежедневным подарком и в профиле
                const fireCount = info.activeFireStreak;
                const menuFireNum = document.getElementById('menuFireStreakNum');
                const menuFirePill = document.getElementById('menuFireStreakBadge');
                if (menuFireNum) menuFireNum.textContent = String(fireCount);
                if (menuFirePill) menuFirePill.classList.toggle('hot-streak', fireCount >= 3);

                const profHeroFire = document.getElementById('profileHeroFireText');
                if (profHeroFire) profHeroFire.textContent = `${fireCount} дн.`;
                const profStatFire = document.getElementById('statFireStreakNum');
                if (profStatFire) profStatFire.textContent = String(fireCount);

                const dailyOverlay = document.getElementById('dailyBonusOverlay');
                if (dailyOverlay && !dailyOverlay.classList.contains('hidden')) {
                    const claimBtn = document.getElementById('btnClaimDailyModal');
                    if (claimBtn?.disabled && info.ready) {
                        this.renderDailyBonusModal();
                    } else if (claimBtn && !info.ready) {
                        claimBtn.textContent = `⏳ ПОЛУЧЕНО · СЛЕД. ЧЕРЕЗ ${info.countdownStr}`;
                    }
                }
            },

            openDailyBonusModal() {
                document.getElementById('dailyBonusOverlay').classList.remove('hidden');
                this.renderDailyBonusModal();
            },

            renderDailyBonusModal() {
                const info = this.getDailyStreakRewardInfo();
                const banner = document.getElementById('dailyStreakBanner');
                const grid = document.getElementById('dailyRewardsGrid');
                const claimBtn = document.getElementById('btnClaimDailyModal');
                if (!grid || !banner || !claimBtn) return;

                if (info.missedReset) {
                    banner.style.color = '#fecaca';
                    banner.style.background = 'rgba(239, 68, 68, 0.2)';
                    banner.style.borderColor = '#ef4444';
                    banner.textContent = '[[xp:warning]] Вы пропустили день — серия сброшена! Начните заново с Дня 1.';
                } else if (info.claimedToday) {
                    banner.style.color = '#bae6fd';
                    banner.style.background = 'rgba(0, 245, 212, 0.14)';
                    banner.style.borderColor = '#00f5d4';
                    banner.textContent = `[[xp:check]] Награда за День ${info.claimedCount} получена! Заходите завтра, чтобы не потерять прогресс.`;
                } else {
                    banner.style.color = '#86efac';
                    banner.style.background = 'rgba(74, 222, 128, 0.14)';
                    banner.style.borderColor = 'rgba(74, 222, 128, 0.45)';
                    banner.textContent = `День ${info.day} из ${DAILY_REWARDS.length} · Пропуск дня сбрасывает серию.`;
                }

                const titleProgress = document.getElementById('dailyTitleProgress');
                const titleUnlocked = this.pass.state.unlockedTitles.includes('eternal_pilot');
                if (titleProgress) {
                    titleProgress.textContent = titleUnlocked
                        ? '[[xp:star4]] Вечный Пилот · ПОЛУЧЕНО'
                        : `[[xp:star4]] Вечный Пилот · ${info.activeFireStreak}/${ETERNAL_PILOT_STREAK} дн. подряд`;
                }

                grid.innerHTML = '';
                let currentTile;
                DAILY_REWARDS.forEach(item => {
                    const isClaimed = item.day <= info.claimedCount;
                    const isTodayReady = info.ready && item.day === info.day;
                    const sparks = this.pass.previewSparkReward(item.sparks);
                    const fallbackSparks = this.pass.previewSparkReward(item.sparks + (item.fallbackSparks ?? 0)) - sparks;
                    const title = item.title.replace('{sparks}', sparks);
                    const sub = item.sub.replace('{fallbackSparks}', fallbackSparks);
                    const tile = document.createElement('div');
                    const milestone = item.day === DAILY_REWARDS.length;
                    tile.className = `daily-day-tile ${milestone ? 'daily-finale' : ''} ${isClaimed ? 'claimed' : ''} ${isTodayReady ? 'today-ready' : ''}`;
                    const tagText = isClaimed ? 'ПОЛУЧЕНО [[xp:check]]' : isTodayReady ? 'ДОСТУПНО!' : '';

                    tile.innerHTML = `
                        <div class="daily-tile-head">
                            <span class="daily-day-num">ДЕНЬ ${item.day}</span>
                            ${tagText ? `<span class="daily-status-tag">${tagText}</span>` : ''}
                        </div>
                        <div class="daily-reward-title">${this.escapeHtml(title)}</div>
                        <div class="daily-reward-sub">${this.escapeHtml(sub)}</div>
                    `;
                    grid.appendChild(tile);
                    if (item.day === (info.ready ? info.day : info.claimedCount)) currentTile = tile;
                });
                grid.scrollTop = currentTile?.offsetTop ?? 0;

                if (info.ready) {
                    claimBtn.disabled = false;
                    claimBtn.style.opacity = '1';
                    claimBtn.textContent = `[[xp:gift]] ЗАБРАТЬ НАГРАДУ · ДЕНЬ ${info.day}`;
                } else {
                    claimBtn.disabled = true;
                    claimBtn.style.opacity = '0.72';
                    claimBtn.textContent = `⏳ ПОЛУЧЕНО · СЛЕД. ЧЕРЕЗ ${info.countdownStr}`;
                }
            },

            claimDailyBonus() {
                const now = new Date();
                const info = this.getDailyStreakRewardInfo(now);
                if (!info.ready) {
                    this.showToast(`Сегодняшний подарок уже получен! Следующий через ${info.countdownStr}`);
                    return;
                }

                const reward = info.reward;
                const state = this.pass.state;
                const hadTitle = state.unlockedTitles.includes('eternal_pilot');
                state.lastDailyClaim = now.getTime();
                state.lastDailyClaimDate = this.getLocalDayKey(now);
                state.dailyStreak = info.nextTotalStreak;

                const cosmeticId = reward.themeId || reward.trailId;
                const cosmetics = reward.themeId ? state.unlockedThemes : state.unlockedTrails;
                const alreadyOwned = cosmeticId && cosmetics.includes(cosmeticId);
                if (cosmeticId && !alreadyOwned) cosmetics.push(cosmeticId);
                const sparks = this.pass.awardSparks(reward.sparks + (alreadyOwned ? reward.fallbackSparks : 0));
                const leveledUp = reward.xp ? this.pass.addXp(reward.xp) : false;
                this.pass.triggerSave(true);
                this.sound.playLevelUp();
                this.updateAllUI();
                this.renderDailyBonusModal();

                if (!hadTitle && state.unlockedTitles.includes('eternal_pilot')) {
                    this.showToast(`[[xp:star4]] ${ETERNAL_PILOT_STREAK} дней подряд! Получен титул «Вечный Пилот».`);
                } else {
                    const title = alreadyOwned ? `${sparks} [[xp:spark]]` : reward.title.replace('{sparks}', sparks);
                    this.showToast(leveledUp
                        ? `[[xp:gift]] День ${info.day}: награда получена и НОВЫЙ УРОВЕНЬ!`
                        : `[[xp:gift]] День ${info.day}: получено (${title})!`);
                }
            },

            triggerTitle42Drop(isDevPreview = false) {
                const prevState = this.state;
                this._stateBeforeTitleDrop = (prevState === 'PLAYING' || prevState === 'PAUSED') ? 'PLAYING' : 'MENU';
                this.state = 'TITLE_DROP';
                this.pointerActive = false;
                this.activePointerId = null;
                this.sound.stopBgm();

                if (!this.pass.state.unlockedTitles.includes('bratukha_42')) {
                    this.pass.state.unlockedTitles.push('bratukha_42');
                }
                this.pass.triggerSave();
                this.updateAllUI();

                // Неожиданный звуковой «глитч-перехват» с резким переходом в фанфары
                this.sound.playEmpBlast();
                setTimeout(() => this.sound.playLaserWarning(), 110);
                setTimeout(() => this.sound.playLevelUp(), 260);
                setTimeout(() => this.sound.playOverdriveStart(), 520);
                this.triggerShake(14, 0.55);

                const scoreLabel = document.getElementById('dropMilestoneScore');
                if (scoreLabel) {
                    scoreLabel.textContent = isDevPreview
                        ? 'ТЕСТ ДЕБАГ-МЕНЮ'
                        : Math.max(4242, Math.floor(this.score)).toLocaleString('ru-RU');
                }

                // Перезапускаем CSS-анимации вспышки и появления карточки
                const flashEl = document.getElementById('dropBreachFlash');
                const stageEl = document.getElementById('dropStageBox');
                if (flashEl) {
                    flashEl.style.animation = 'none';
                    void flashEl.offsetWidth;
                    flashEl.style.animation = '';
                }
                if (stageEl) {
                    stageEl.style.animation = 'none';
                    void stageEl.offsetWidth;
                    stageEl.style.animation = '';
                }

                document.getElementById('titleDropOverlay').classList.remove('hidden');
            },

            openTitleInfoAfterDrop(toastMsg = '') {
                document.getElementById('titleDropOverlay').classList.add('hidden');
                if (toastMsg) this.showToast(toastMsg);
                const infoOverlay = document.getElementById('titleInfoOverlay');
                if (infoOverlay) {
                    infoOverlay.classList.remove('hidden');
                } else {
                    this.resumeAfterTitleDrop();
                }
            },

            resumeAfterTitleDrop(toastMsg = '') {
                document.getElementById('titleDropOverlay').classList.add('hidden');
                const infoOverlay = document.getElementById('titleInfoOverlay');
                if (infoOverlay) infoOverlay.classList.add('hidden');
                if (toastMsg) this.showToast(toastMsg);

                if (this._stateBeforeTitleDrop === 'PLAYING') {
                    this.state = 'PLAYING';
                    this.lastFrameTime = performance.now();
                    this.sound.startBgm(this.flightMode(), this.overdriveActive);
                } else {
                    this.state = 'MENU';
                }
            }
        });
