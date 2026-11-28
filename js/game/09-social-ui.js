        // Leaderboard, pilot inspection, toast and menu return
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        const LEADERBOARD_MODES = {
            DRIVE: { tab: 'lbTabDrive', label: 'ДРАЙВ', scoreKey: 'bestScoreDrive' },
            CLEARANCE: { tab: 'lbTabClearance', label: 'ЗАЧИСТКА', scoreKey: 'bestScoreClearance' },
            EXPEDITION: { tab: 'lbTabExpedition', label: 'ЭКСПЕДИЦИЯ', scoreKey: 'bestExpeditionSectors' }
        };

        defineNeonDriftGameMethods({

            openPilotInspectModal(playerRec, isMe = false) {
                const overlay = document.getElementById('pilotInspectOverlay');
                if (!overlay || !playerRec) return;

                const themeId = isMe ? this.pass.state.equippedTheme : (playerRec.equippedTheme || 'default');
                const themeObj = PROFILE_THEMES.find(th => th.id === themeId) || PROFILE_THEMES[0];
                const frameId = (isMe ? this.pass.state : playerRec).equippedProfileFrame;
                const titleId = isMe ? this.pass.state.equippedTitle : (playerRec.equippedTitle || 'novice');
                const titleObj = this.getTitleObj(titleId);
                const streak = isMe
                    ? this.getDailyStreakRewardInfo().activeFireStreak
                    : Math.max(0, Number(playerRec.dailyStreak) || 0);
                const dScore = isMe
                    ? (Number(this.pass.state.bestScoreDrive) || 0)
                    : (Number(playerRec.bestScoreDrive) || 0);
                const cScore = isMe
                    ? (Number(this.pass.state.bestScoreClearance) || 0)
                    : (Number(playerRec.bestScoreClearance) || 0);

                this.applyProfileCardTheme(overlay.querySelector('.profile-card'), document.getElementById('inspectHeroBox'), themeObj, frameId);
                this.displayPilotName(document.getElementById('inspectNick'), playerRec.nickname);
                document.getElementById('inspectLvlTag').textContent = `УР. ${playerRec.passLevel || 1}`;
                const tBadge = document.getElementById('inspectTitleBadge');
                tBadge.className = `player-title-badge ${titleObj.cssClass}`;
                tBadge.textContent = `${titleObj.icon ? titleObj.icon + ' ' : ''}${titleObj.name}`;

                const fText = document.getElementById('inspectFireText');
                if (fText) fText.textContent = `${streak} дн.`;
                this.applyThemeFireStyle(
                    themeObj,
                    document.getElementById('inspectFireOuter'),
                    document.getElementById('inspectFireInner'),
                    document.getElementById('inspectFireBadge'),
                    fText
                );

                document.getElementById('inspectDriveScore').textContent = dScore.toLocaleString('ru-RU');
                document.getElementById('inspectClearanceScore').textContent = cScore.toLocaleString('ru-RU');
                const expedition = Number((isMe ? this.pass.state : playerRec).bestExpeditionSectors) || 0;
                document.getElementById('inspectExpeditionScore').textContent = `${expedition.toLocaleString('ru-RU')} сект.`;
                
                // Статистика коллекции
                const counts = collectionCounts(isMe ? this.pass.state : playerRec);
                for (const category of Object.keys(COLLECTION_CATALOG)) {
                    const el = document.getElementById('inspect' + category);
                    if (el) el.textContent = counts['owned' + category] ?? '—';
                }
                
                overlay.classList.remove('hidden');
                const scrollArea = overlay.querySelector('.pilot-inspect-scroll');
                if (scrollArea) scrollArea.scrollTop = 0;
            },

            async openLeaderboardModal(showRefreshToast = false) {
                const overlay = document.getElementById('leaderboardOverlay');
                const listEl = document.getElementById('leaderboardList');
                if (!overlay || !listEl) return;

                const mode = LEADERBOARD_MODES[this.activeLeaderboardMode] || LEADERBOARD_MODES.DRIVE;
                const { label: modeTitle, scoreKey } = mode;
                const request = (this.leaderboardRequest || 0) + 1;
                this.leaderboardRequest = request;
                for (const tabMode of Object.values(LEADERBOARD_MODES)) {
                    const button = document.getElementById(tabMode.tab);
                    if (!button) continue;
                    button.classList.toggle('active', tabMode === mode);
                    button.setAttribute('aria-pressed', String(tabMode === mode));
                }

                overlay.classList.remove('hidden');
                listEl.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:26px 0; font-size:0.82rem;">Загрузка глобального рейтинга...</div>';
                const statusEl = document.getElementById('leaderboardStatus');
                if (statusEl) statusEl.textContent = `РЕЖИМ: ${modeTitle}`;

                const currentLvl = this.pass.getLevelInfo().level;
                const rawPlayers = await this.cloud.fetchTopLeaderboard(this.pass.state, currentLvl, showRefreshToast);
                if (this.leaderboardRequest !== request || overlay.classList.contains('hidden')) return;
                const myUid = this.cloud.getLeaderboardUid();

                const topPlayers = visibleLeaderboardProfiles(rawPlayers, myUid)
                    .filter(p => Number(p[scoreKey]) > 0)
                    .sort((a, b) => (Number(b[scoreKey]) || 0) - (Number(a[scoreKey]) || 0))
                    .slice(0, 20);

                if (statusEl) {
                    const savedLocally = this.cloud.leaderboardSource === 'local' && this.online.status !== 'ONLINE';
                    statusEl.textContent = `РЕЖИМ: ${modeTitle}${savedLocally ? ' · ЛОКАЛЬНЫЕ ДАННЫЕ' : ''}`;
                }

                listEl.innerHTML = '';
                if (topPlayers.length === 0) {
                    listEl.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:24px 0;">Пока нет рекордов в режиме «${modeTitle}». Станьте первым!</div>`;
                } else {
                    topPlayers.forEach((p, idx) => {
                        const rank = idx + 1;
                        const isMe = p.uid === myUid;
                        const modeScore = Number(p[scoreKey]) || 0;
                        const row = document.createElement('div');
                        const pThemeObj = PROFILE_THEMES.find(th => th.id === (isMe ? this.pass.state.equippedTheme : p.equippedTheme));
                        const pThemeClass = pThemeObj && pThemeObj.cssClass ? pThemeObj.cssClass : '';
                        row.className = `lb-row ${rank <= 3 ? 'top-' + rank : ''} ${isMe ? 'me' : ''} ${pThemeClass}`;

                        const medal = rank === 1
                            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1000"><polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8"/></svg>`
                            : rank === 2
                            ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="#0f172a"><polygon points="12 3 21 12 12 21 3 12"/></svg>`
                            : rank === 3
                            ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="#ffffff"><polygon points="12 4 21 19 3 19"/></svg>`
                            : rank;
                        const titleHtml = this.renderTitleBadgeHtml((isMe ? this.pass.state.equippedTitle : p.equippedTitle) || 'novice');
                        row.innerHTML = `
                            <div class="lb-rank">${medal}</div>
                            <div class="lb-player-meta">
                                <div class="lb-name-line">
                                    <span class="lb-name"><span translate="no">${this.escapeHtml(p.nickname)}</span>${isMe ? ' (Вы)' : ''}</span>
                                    <span class="lb-lvl-tag">УР. ${p.passLevel}</span>
                                </div>
                                <div>${titleHtml}</div>
                            </div>
                            <div class="lb-score">${modeScore.toLocaleString('ru-RU')}${mode === LEADERBOARD_MODES.EXPEDITION ? ' сект.' : ''}</div>
                        `;
                        row.addEventListener('click', () => {
                            this.sound.playUiClick();
                            this.openPilotInspectModal(p, isMe);
                        });
                        listEl.appendChild(row);
                    });
                }

                if (showRefreshToast) {
                    this.showToast(`Топ-20 (${modeTitle}) обновлён!`);
                }
            },

            escapeHtml(str) {
                return String(str)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
            },

            showToast(msg) {
                const toast = document.getElementById('toast');
                if (!toast) return;
                toast.textContent = msg;
                toast.classList.add('show');
                clearTimeout(this.toastTimeout);
                this.toastTimeout = setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }
        });
