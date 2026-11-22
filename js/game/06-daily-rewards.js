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

            getDailyStreakRewardInfo() {
                const todayKey = this.getLocalDayKey(new Date());
                const yesterdayKey = this.getLocalDayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
                const lastDate = this.pass.state.lastDailyClaimDate || '';
                const prevStreak = Math.max(0, Number(this.pass.state.dailyStreak) || 0);

                if (lastDate === todayKey) {
                    const totalStreak = Math.max(1, prevStreak);
                    const cycleClaimed = ((totalStreak - 1) % 10) + 1;
                    const nextDay = (totalStreak % 10) + 1;
                    return {
                        day: nextDay,
                        nextTotalStreak: totalStreak,
                        activeFireStreak: totalStreak,
                        claimedCount: cycleClaimed,
                        claimedToday: true,
                        missedReset: false,
                        ready: false,
                        reward: DAILY_10_REWARDS[nextDay - 1],
                        countdownStr: this.getTimeUntilNextDayStr()
                    };
                }

                if (lastDate === yesterdayKey && prevStreak > 0) {
                    const nextTotal = prevStreak + 1;
                    const nextDay = (prevStreak % 10) + 1;
                    return {
                        day: nextDay,
                        nextTotalStreak: nextTotal,
                        activeFireStreak: prevStreak,
                        claimedCount: prevStreak % 10,
                        claimedToday: false,
                        missedReset: false,
                        ready: true,
                        reward: DAILY_10_REWARDS[nextDay - 1],
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
                    reward: DAILY_10_REWARDS[0],
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
                        txt.textContent = `ДАР (${info.claimedCount}/10)`;
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
                if (dailyOverlay && !dailyOverlay.classList.contains('hidden') && !info.ready) {
                    const claimBtn = document.getElementById('btnClaimDailyModal');
                    if (claimBtn) {
                        claimBtn.textContent = `⏳ ПОЛУЧЕНО · СЛЕД. ЧЕРЕЗ ${this.getTimeUntilNextDayStr()}`;
                    }
                }
            },

            openDailyBonusModal() {
                this.renderDailyBonusModal();
                document.getElementById('dailyBonusOverlay').classList.remove('hidden');
            },

            renderDailyBonusModal() {
                const info = this.getDailyStreakRewardInfo();
                const banner = document.getElementById('dailyStreakBanner');
                const grid = document.getElementById('dailyGrid10');
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
                    banner.textContent = `Серия входа: День ${info.day} из 10! Не пропускайте дни, иначе серия сбросится.`;
                }

                grid.innerHTML = '';
                DAILY_10_REWARDS.forEach(item => {
                    const isClaimed = item.day <= info.claimedCount;
                    const isTodayReady = info.ready && item.day === info.day;
                    const sparks = this.pass.previewSparkReward(item.sparks);
                    const fallbackSparks = this.pass.previewSparkReward(item.sparks + (item.fallbackSparks ?? 0)) - sparks;
                    const title = item.title.replace('{sparks}', sparks);
                    const sub = item.sub.replace('{fallbackSparks}', fallbackSparks);
                    const tile = document.createElement('div');
                    tile.className = `daily-day-tile ${item.day === 10 ? 'day-10' : ''} ${isClaimed ? 'claimed' : ''} ${isTodayReady ? 'today-ready' : ''}`;

                    let tagText = `ДЕНЬ ${item.day}`;
                    if (isClaimed) tagText = 'ПОЛУЧЕНО [[xp:check]]';
                    else if (isTodayReady) tagText = 'ДОСТУПНО!';

                    tile.innerHTML = `
                        <div class="daily-tile-head">
                            <span class="daily-day-num">ДЕНЬ ${item.day}</span>
                            <span class="daily-status-tag">${tagText}</span>
                        </div>
                        <div class="daily-reward-title">${this.escapeHtml(title)}</div>
                        <div class="daily-reward-sub">${this.escapeHtml(sub)}</div>
                    `;
                    grid.appendChild(tile);
                });

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
                const info = this.getDailyStreakRewardInfo();
                if (!info.ready) {
                    this.showToast(`Сегодняшний подарок уже получен! Следующий через ${info.countdownStr}`);
                    return;
                }

                const rw = info.reward;
                this.pass.state.lastDailyClaim = Date.now();
                this.pass.state.lastDailyClaimDate = this.getLocalDayKey(new Date());
                this.pass.state.dailyStreak = info.nextTotalStreak || info.day;

                const sparks = this.pass.awardSparks(rw.sparks);
                const title = rw.title.replace('{sparks}', sparks);
                let extraMsg = '';

                if (rw.themeId) {
                    if (!this.pass.state.unlockedThemes.includes(rw.themeId)) {
                        this.pass.state.unlockedThemes.push(rw.themeId);
                        extraMsg = ' + стиль «ЗАКАТ 1989»';
                    } else {
                        const fallbackSparks = this.pass.awardSparks(rw.fallbackSparks);
                        extraMsg = ` + ${fallbackSparks} [[xp:spark]] (компенсация)`;
                    }
                }
                if (rw.trailId) {
                    if (!this.pass.state.unlockedTrails.includes(rw.trailId)) {
                        this.pass.state.unlockedTrails.push(rw.trailId);
                        extraMsg = ' + след «СИНТВЕЙВ ДУО»';
                    } else {
                        const fallbackSparks = this.pass.awardSparks(rw.fallbackSparks);
                        extraMsg = ` + ${fallbackSparks} [[xp:spark]] (компенсация)`;
                    }
                }
                if (rw.titleId) {
                    if (!this.pass.state.unlockedTitles.includes(rw.titleId)) {
                        this.pass.state.unlockedTitles.push(rw.titleId);
                        extraMsg = ' + титул «Вечный Пилот»';
                    } else {
                        const fallbackSparks = this.pass.awardSparks(rw.fallbackSparks);
                        extraMsg = ` + ${fallbackSparks} [[xp:spark]]`;
                    }
                }

                const leveledUp = rw.xp ? this.pass.addXp(rw.xp) : false;
                this.pass.triggerSave();
                this.sound.playLevelUp();
                this.updateAllUI();
                this.renderDailyBonusModal();

                this.showToast(
                    leveledUp
                        ? `[[xp:gift]] День ${info.day}: награда получена${extraMsg} и НОВЫЙ УРОВЕНЬ!`
                        : `[[xp:gift]] День ${info.day}/10: получено (${title}${extraMsg})!`
                );
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
