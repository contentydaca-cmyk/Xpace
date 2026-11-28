        // Profile, titles, themes and contracts UI
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        const animatedShipPreviewIds = new Set(['aurum', 'valkyrie_x', 'ronin', 'dragon', 'bathyscaphe_liman', 'selene_9', 'kitsune', 'cryoray', 'black_sun']);

        const frameSignalTrace = 'M0 16H16L22 13 28 16H38L45 10 50 18 56 13H64L70 4 76 20 82 8 88 15H96L102 11 108 16H121L128 13 134 16H156';
        const frameHoneycombCluster = `<svg class="frame-honeycomb-cluster" viewBox="0 0 92 58" focusable="false">
            <path class="frame-honeycomb-housing" d="M12 2H69L90 19V51L80 56V33L63 15H22L13 19H3Z"/>
            <path class="frame-honeycomb-panels" d="M43 4H57L64 15 57 26H43L36 15Z M65 15H79L86 26 79 37H65L58 26Z M65 38H79L86 49 79 56H65L58 49Z M21 4H34L41 15 34 24H21L14 15Z"/>
            <path class="frame-honeycomb-facets" d="M43 4 50 15 36 15Z M50 15 57 26H43Z M65 15 72 26H58Z M72 26 79 37H65Z M65 38 72 49H58Z M72 49 79 56H65Z M21 4 28 15H14Z"/>
            <path class="frame-honeycomb-seams" d="M41 23 49 15 57 8 M63 34 72 26 80 19 M63 54 72 49 80 42 M19 17H34 M8 14H12 M83 48H88"/>
        </svg>`;
        const profileFrameArt = {
            signal: `<svg class="frame-signal-transmitter" viewBox="0 0 76 28" focusable="false">
                <path class="frame-signal-housing" d="M1 26V10L10 1H49L56 7H73L65 12H27L21 18H11L7 26Z"/>
                <path class="frame-signal-antenna" d="M4 25V12L12 4H48L54 9H68 M12 15H21L27 9H37 M14 7V11 M18 7V11 M22 7V11 M45 7H49"/>
                <circle class="frame-signal-led" cx="8.5" cy="18" r="1.8"/>
            </svg>
            <svg class="frame-signal-wave" viewBox="0 0 156 22" preserveAspectRatio="none" focusable="false">
                <path class="frame-signal-grid" d="M20 5V19 M40 5V19 M60 5V19 M80 5V19 M100 5V19 M120 5V19 M140 5V19 M0 16H156"/>
                <path class="frame-signal-trace" d="${frameSignalTrace}"/>
                <path class="frame-signal-runner" d="${frameSignalTrace}" pathLength="100"/>
            </svg>
            <svg class="frame-signal-receiver" viewBox="0 0 24 24" focusable="false">
                <path class="frame-signal-antenna" d="M2 22H14L22 14V2 M8 17H13L17 13V8 M13 21V16 M21 13H16"/>
            </svg>`,
            honeycomb: frameHoneycombCluster.repeat(2)
        };

        defineNeonDriftGameMethods({

            syncNicknameInput() {
                const input = document.getElementById('nicknameInput');
                if (input && this.pass.state.nickname) {
                    input.value = this.pass.state.nickname;
                }
            },

            displayPilotName(element, nickname) {
                element.setAttribute('translate', nickname ? 'no' : 'yes');
                element.textContent = nickname || 'Пилот';
            },

            generateTransferCode() {
                const payload = {
                    v: 1,
                    s: this.pass.state
                };
                const json = JSON.stringify(payload);
                const bytes = new TextEncoder().encode(json);
                let bin = '';
                for (let i = 0; i < bytes.length; i++) {
                    bin += String.fromCharCode(bytes[i]);
                }
                return 'XPACE-' + btoa(bin);
            },

            applyTransferCode(rawCode) {
                try {
                    const clean = rawCode.replace(/\s+/g, '');
                    if (!clean.startsWith('XPACE-')) return false;
                    const b64 = clean.slice(6);
                    const bin = atob(b64);
                    const bytes = new Uint8Array(bin.length);
                    for (let i = 0; i < bin.length; i++) {
                        bytes[i] = bin.charCodeAt(i);
                    }
                    const json = new TextDecoder().decode(bytes);
                    const parsed = JSON.parse(json);
                    if (!parsed || !parsed.s || typeof parsed.s !== 'object') return false;

                    // Заменяем текущее состояние на загруженное из резервного кода
                    const state = {
                        ...this.pass.state,
                        ...parsed.s
                    };
                    this.pass.state = Object.assign(state, mergeProfileFrames(state));
                    this.pass.ensureQuests();
                    this.pass.evaluateAutoTitles();
                    this.pass.triggerSave();
                    return true;
                } catch (e) {
                    return false;
                }
            },

            saveNicknameFromInput() {
                const input = document.getElementById('nicknameInput');
                if (!input) return;
                const clean = input.value.trim().slice(0, 16);
                if (!clean) {
                    this.showToast('Введите никнейм от 1 до 16 символов');
                    return;
                }
                this.pass.state.nickname = clean;
                this.pass.triggerSave();
                this.updateAllUI();
                this.renderProfileModal();
                this.showToast(`Никнейм «${clean}» сохранён!`);
            },

            drawShipPreview(canvasEl, shipCfg) {
                if (!canvasEl) return;
                this.paintShipPreview(canvasEl, shipCfg, 0.7);
                if (animatedShipPreviewIds.has(shipCfg.id)) {
                    (this.animatedShipPreviews ||= new Map()).set(canvasEl, shipCfg);
                } else {
                    this.animatedShipPreviews?.delete(canvasEl);
                }
            },

            updateShipPreviews(now) {
                if (!this.animatedShipPreviews?.size || this.state === 'PLAYING') return;
                const reduced = detailedShipMotion.matches;
                const resetPose = reduced && !this.shipPreviewMotionReduced;
                this.shipPreviewMotionReduced = reduced;
                for (const [canvasEl, shipCfg] of this.animatedShipPreviews) {
                    if (!canvasEl.isConnected) {
                        this.animatedShipPreviews.delete(canvasEl);
                        continue;
                    }
                    if (reduced && !resetPose) continue;
                    const { top, bottom, left, right, width } = canvasEl.getBoundingClientRect();
                    if (width && bottom > 0 && top < window.innerHeight && right > 0 && left < window.innerWidth) {
                        this.paintShipPreview(canvasEl, shipCfg, reduced ? 0.7 : now / 1000);
                    }
                }
            },

            paintShipPreview(canvasEl, shipCfg, time) {
                const cssSize = Number(canvasEl.getAttribute('data-css-size')) || canvasEl.width || 48;
                const scaleFactor = 2;
                if (canvasEl.width !== cssSize * scaleFactor) {
                    canvasEl.setAttribute('data-css-size', cssSize);
                    canvasEl.width = cssSize * scaleFactor;
                    canvasEl.height = cssSize * scaleFactor;
                    canvasEl.style.width = cssSize + 'px';
                    canvasEl.style.height = cssSize + 'px';
                }
                const c = canvasEl.getContext('2d');
                c.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
                c.clearRect(0, 0, cssSize, cssSize);

                c.save();
                const tallModel = shipCfg.id === 'volcanic' || shipCfg.id === 'dragon';
                const offsetY = shipCfg.id === 'kitsune' ? -2 : shipCfg.id === 'aurum' ? 0 : tallModel ? -3 : 1;
                c.translate(cssSize / 2, cssSize / 2 + offsetY);
                let modelScale = shipCfg.shape === 'requiem' ? Math.min(0.85, cssSize / 76) : shipCfg.shape === 'skin42'
                    ? Math.min(1.05, cssSize / 46)
                    : Math.min(1.02, cssSize / 44);
                if (shipCfg.id === 'kitsune') modelScale = Math.min(.97, (cssSize - 4) / 62);
                if (detailedShipModels.has(shipCfg.id)) {
                    const modelSize = shipCfg.previewSize ?? (shipCfg.id === 'aurum' ? 70 : shipCfg.id === 'dragon' ? 65 : shipCfg.id === 'valkyrie_x' ? 68
                        : tallModel ? 62 : shipCfg.id === 'ion_manta' ? 61 : 57);
                    modelScale = Math.min(1.02, (cssSize - 2) / modelSize);
                }
                const previewScale = Number(canvasEl.getAttribute('data-model-scale')) || 1;
                this.drawShipShape(c, shipCfg, time, modelScale * previewScale);
                c.restore();
            },

            openSettingsModal() {
                this.syncNicknameInput();
                this.renderSettingsModal();
                document.getElementById('settingsOverlay').classList.remove('hidden');
            },

            renderSettingsModal() {
                const sndBtn = document.getElementById('btnSettingsSound');
                if (sndBtn) {
                    const isMuted = Boolean(this.sound.muted);
                    sndBtn.textContent = isMuted ? 'ВЫКЛ [[xp:mute]]' : 'ВКЛ [[xp:volume]]';
                    sndBtn.classList.toggle('off', isMuted);
                }

                const shkBtn = document.getElementById('btnSettingsShake');
                if (shkBtn) {
                    const shakeOn = this.settings.shakeEnabled !== false;
                    shkBtn.textContent = shakeOn ? 'ВКЛ [[xp:vibration]]' : 'ВЫКЛ';
                    shkBtn.classList.toggle('off', !shakeOn);
                }

                const fsBtn = document.getElementById('btnSettingsFullscreen');
                if (fsBtn) {
                    const active = this.isFullscreenActive();
                    fsBtn.textContent = active ? 'ВЫЙТИ' : 'ОТКРЫТЬ';
                    fsBtn.classList.toggle('off', !active);
                }

                const perfMode = this.settings.perfMode || 'normal';
                const customFps = Math.max(15, Math.min(240, Math.round(Number(this.settings.customFps) || 90)));
                const activeFps = this.getGameplayFps();

                const fpsBadge = document.getElementById('settingsActiveFpsBadge');
                if (fpsBadge) fpsBadge.textContent = activeFps ? `${activeFps} FPS` : 'АВТО';

                const btnNormal = document.getElementById('btnPerfNormal');
                const btnHigh = document.getElementById('btnPerfHigh');
                const btnCustom = document.getElementById('btnPerfCustom');
                if (btnNormal) btnNormal.classList.toggle('active', perfMode === 'normal');
                if (btnHigh) btnHigh.classList.toggle('active', perfMode === 'high');
                if (btnCustom) btnCustom.classList.toggle('active', perfMode === 'custom');

                const customRow = document.getElementById('customFpsControls');
                if (customRow) customRow.classList.toggle('hidden', perfMode !== 'custom');

                const fpsRange = document.getElementById('customFpsRange');
                const fpsNum = document.getElementById('customFpsNumber');
                if (fpsRange && document.activeElement !== fpsRange) fpsRange.value = String(customFps);
                if (fpsNum && document.activeElement !== fpsNum) fpsNum.value = String(customFps);
            },

            openProfileModal() {
                this.pass.evaluateAutoTitles();
                this.syncNicknameInput();
                this.renderProfileModal();
                const overlay = document.getElementById('profileOverlay');
                overlay.classList.remove('hidden');
                /* Принудительный перерендер GPU-слоя: страховка от «белого экрана» в WebView */
                const profileCard = overlay.querySelector('.profile-card');
                if (profileCard) {
                    profileCard.style.transform = 'translateZ(0)';
                    void profileCard.offsetHeight;
                }
                const scrollArea = overlay.querySelector('.profile-scroll-area');
                if (scrollArea) scrollArea.scrollTop = 0;
            },

            applyThemeFireStyle(themeObj, outerEl, innerEl, badgeEl, textEl) {
                const f = (themeObj && themeObj.fire) ? themeObj.fire : PROFILE_THEMES[0].fire;
                if (outerEl) outerEl.setAttribute('fill', f.outer1);
                if (innerEl) innerEl.setAttribute('fill', f.inner2);
                if (badgeEl) {
                    badgeEl.style.borderColor = f.border;
                    badgeEl.style.background = f.bg;
                    badgeEl.style.boxShadow = `-2px 2px 0 ${f.shadow}, 0 0 12px ${f.bg}`;
                    badgeEl.style.color = f.text;
                }
                if (textEl) textEl.style.color = f.text;
            },

            applyProfileFrame(surface, frameId) {
                if (!surface) return;
                const frame = getProfileFrame(frameId);
                if ((surface.dataset.profileFrame || 'default') === frame.id) return;
                surface.querySelector(':scope > .profile-frame-trim')?.remove();
                const art = profileFrameArt[frame.art];
                if (!frame.plate && !art) {
                    delete surface.dataset.profileFrame;
                    return;
                }

                surface.dataset.profileFrame = frame.id;
                const trim = document.createElement('span');
                trim.className = art ? 'profile-frame-trim profile-frame-trim--custom' : 'profile-frame-trim';
                trim.setAttribute('aria-hidden', 'true');
                trim.style.setProperty('--frame-light', frame.accent);
                trim.style.setProperty('--frame-metal', frame.metal);
                trim.style.setProperty('--frame-shade', frame.shade);
                trim.innerHTML = art || `<svg viewBox="0 0 25 25" focusable="false">
                        <path class="frame-corner-plate" d="${frame.plate}"/>
                        <path class="frame-corner-rim" d="${frame.rim}"/>
                        <path class="frame-corner-etching" d="${frame.detail}"/>
                    </svg>`.repeat(4);
                surface.appendChild(trim);
            },

            applyProfileCardTheme(card, hero, theme, frameId) {
                this.applyThemeClassToElement(hero, 'profile-hero-box', theme);
                this.applyProfileThemeMotion(hero, theme);
                if (!card) return;
                const themed = Boolean(theme.cssClass);
                card.style.setProperty('--profile-theme-accent', themed ? theme.accent : '');
                card.style.setProperty('--profile-theme-text', themed ? (theme.fire?.text || theme.accent) : '');
                card.style.setProperty('--profile-theme-wash', themed ? (theme.fire || PROFILE_THEMES[0].fire).bg : '');
                this.applyThemeClassToElement(card, themed ? 'card profile-card profile-themed' : 'card profile-card', theme);
                this.applyProfileFrame(card, frameId);
            },

            applyProfileThemeMotion(surface, theme) {
                if (!surface) return;
                const motion = theme.motion || '';
                const previousLayer = surface.querySelector('.profile-theme-motion');
                if (motion === (surface.dataset.profileMotion || '') && Boolean(previousLayer) === Boolean(motion)) return;

                this.profileThemeMotionObserver?.unobserve(surface);
                previousLayer?.remove();
                if (!motion) {
                    delete surface.dataset.profileMotion;
                    return;
                }

                surface.dataset.profileMotion = motion;
                const layer = document.createElement('span');
                layer.className = 'profile-theme-motion';
                layer.setAttribute('aria-hidden', 'true');
                layer.style.setProperty('--profile-motion-accent', theme.accent);
                layer.style.setProperty('--profile-motion-secondary', theme.fire.outer2);
                if (motion === 'sakura') {
                    for (let i = 0; i < 5; i++) layer.appendChild(document.createElement('span'));
                }
                surface.appendChild(layer);
                if (typeof IntersectionObserver === 'function') {
                    this.profileThemeMotionObserver ??= new IntersectionObserver(entries => {
                        for (const entry of entries) {
                            entry.target.querySelector('.profile-theme-motion')
                                ?.classList.toggle('profile-theme-motion-paused', !entry.isIntersecting);
                        }
                    });
                    layer.classList.add('profile-theme-motion-observed');
                    this.profileThemeMotionObserver.observe(surface);
                }
            },

            unobserveProfileThemePreviews(list) {
                if (!this.profileThemeMotionObserver) return;
                for (const surface of list.querySelectorAll('[data-profile-motion]')) {
                    this.profileThemeMotionObserver.unobserve(surface);
                }
            },

            renderProfileModal() {
                const equippedId = this.pass.state.equippedTitle || 'novice';
                const titleObj = this.getTitleObj(equippedId);
                const themeCfg = this.getActiveThemeConfig();

                this.displayPilotName(document.getElementById('profileCardNick'), this.pass.state.nickname);
                const badgeEl = document.getElementById('profileCardTitle');
                badgeEl.className = `player-title-badge profile-title-clickable ${titleObj.cssClass}`;
                badgeEl.textContent = `${titleObj.icon ? titleObj.icon + ' ' : ''}${titleObj.name} ▾`;

                // Рекорды по режимам
                const driveBest = Number(this.pass.state.bestScoreDrive) || 0;
                const clearBest = Number(this.pass.state.bestScoreClearance) || 0;
                const elDrive = document.getElementById('statBestDrive');
                const elClear = document.getElementById('statBestClearance');
                if (elDrive) elDrive.textContent = driveBest.toLocaleString('ru-RU');
                if (elClear) elClear.textContent = clearBest.toLocaleString('ru-RU');

                // Основная статистика + Баланс искр
                document.getElementById('statTotalRuns').textContent = this.pass.state.totalRuns;
                document.getElementById('statNearMisses').textContent = this.pass.state.totalNearMisses;
                document.getElementById('statTotalCoins').textContent = this.pass.state.totalCoins;
                const sparksStatEl = document.getElementById('statProfileSparks');
                if (sparksStatEl) sparksStatEl.textContent = `${this.pass.state.sparks} [[xp:spark]]`;

                // Огонь в профиле (отображается у каждого и меняет цвет в зависимости от цвета профиля)
                const fireInfo = this.getDailyStreakRewardInfo();
                const streakDays = fireInfo.activeFireStreak;
                const profHeroFire = document.getElementById('profileHeroFireText');
                if (profHeroFire) profHeroFire.textContent = `${streakDays} дн.`;
                const profStatFire = document.getElementById('statFireStreakNum');
                if (profStatFire) profStatFire.textContent = `${streakDays} дн.`;

                this.applyThemeFireStyle(
                    themeCfg,
                    document.getElementById('profFireOuter1'),
                    document.getElementById('profFireInner1'),
                    document.getElementById('profileHeroFireBadge'),
                    profHeroFire
                );
                this.applyThemeFireStyle(
                    themeCfg,
                    document.getElementById('profFireOuter2'),
                    document.getElementById('profFireInner2'),
                    document.getElementById('statFireBox'),
                    document.getElementById('statFireStreak')
                );
                const fireLbl = document.getElementById('statFireLabel');
                if (fireLbl && themeCfg.fire) fireLbl.style.color = themeCfg.fire.border;

                // Статистика коллекции и покупок
                const counts = collectionCounts(this.pass.state);
                for (const [category, catalog] of Object.entries(COLLECTION_CATALOG)) {
                    const el = document.getElementById('statOwned' + category);
                    if (el) el.textContent = `${counts['owned' + category] ?? 0}/${catalog.size}`;
                }

                this.drawShipPreview(document.getElementById('profileShipCanvas'), this.getActiveShipConfig());
                this.applyProfileCardTheme(
                    document.querySelector('#profileOverlay .profile-card'),
                    document.getElementById('profileHeroBox'),
                    themeCfg,
                    this.pass.state.equippedProfileFrame
                );
            },

            openTitlesModal() {
                this.pass.evaluateAutoTitles();
                this.renderTitlesModal();
                document.getElementById('titlesOverlay').classList.remove('hidden');
            },

            renderTitlesModal() {
                const listEl = document.getElementById('profileTitlesList');
                if (!listEl) return;
                const equippedId = this.pass.state.equippedTitle || 'novice';
                listEl.innerHTML = '';

                PLAYER_TITLES.forEach(t => {
                    const unlocked = this.pass.state.unlockedTitles.includes(t.id);
                    const isEquipped = equippedId === t.id;
                    const is18th = t.id === 'century_18';
                    const displayDesc = t.id === 'bratukha_42' ? '???' : t.desc;

                    const card = document.createElement('div');
                    card.className = `title-item-card ${isEquipped ? 'equipped' : ''} ${is18th ? 'legendary-18' : ''} ${!unlocked ? 'locked' : ''}`;

                    const left = document.createElement('div');
                    left.style.flex = '1';
                    left.style.minWidth = '0';
                    left.innerHTML = `
                        <div><span class="player-title-badge ${t.cssClass}">${t.icon ? t.icon + ' ' : ''}${this.escapeHtml(t.name)}</span></div>
                        <div class="title-item-desc">${this.escapeHtml(displayDesc)}</div>
                    `;

                    const btn = document.createElement('button');
                    btn.type = 'button';
                    if (!unlocked) {
                        btn.className = 'btn-equip-title lock';
                        btn.textContent = 'ЗАКРЫТО [[xp:lock]]';
                        btn.addEventListener('click', () => {
                            this.sound.playUiBack();
                            this.showToast(t.id === 'bratukha_42' ? '???' : `Условие: ${t.desc}`);
                        });
                    } else if (isEquipped) {
                        btn.className = 'btn-equip-title active';
                        btn.textContent = 'НАДЕТО [[xp:check]]';
                        btn.addEventListener('click', () => this.sound.playUiClick());
                    } else {
                        btn.className = 'btn-equip-title equip';
                        btn.textContent = 'НАДЕТЬ';
                        btn.addEventListener('click', () => {
                            this.pass.state.equippedTitle = t.id;
                            this.pass.triggerSave(true);
                            this.sound.playQuestComplete();
                            this.renderTitlesModal();
                            this.renderProfileModal();
                            this.updateAllUI();
                            this.showToast(`Титул «${t.name}» установлен в профиль!`);
                        });
                    }

                    card.appendChild(left);
                    card.appendChild(btn);
                    listEl.appendChild(card);
                });
            },

            openThemesModal() {
                this.renderThemesModal();
                document.getElementById('themesOverlay').classList.remove('hidden');
            },

            createProfileSkinPreview(theme) {
                const preview = document.createElement('div');
                preview.className = `profile-skin-banner ${theme.cssClass}`;
                preview.setAttribute('aria-hidden', 'true');

                const emblem = document.createElement('span');
                emblem.className = 'profile-skin-emblem';
                const nickname = document.createElement('span');
                nickname.className = 'profile-skin-nickname';
                this.displayPilotName(nickname, this.pass.state.nickname);
                preview.append(emblem, nickname);
                return preview;
            },

            renderThemesModal() {
                const themesListEl = document.getElementById('profileThemesList');
                if (!themesListEl) return;
                const sparksEl = document.getElementById('themesSparksCounter');
                if (sparksEl) sparksEl.textContent = `${this.pass.state.sparks} [[xp:spark]]`;

                this.unobserveProfileThemePreviews(themesListEl);
                themesListEl.innerHTML = '';
                const shopNow = Date.now();
                PROFILE_THEMES.filter(th => this.pass.state.unlockedThemes.includes(th.id) || this.isShopOfferActive(th, shopNow)).forEach(th => {
                    const owned = this.pass.state.unlockedThemes.includes(th.id);
                    const selected = this.pass.state.equippedTheme === th.id;

                    const card = document.createElement('div');
                    card.className = `title-item-card ${selected ? 'equipped' : ''}`;

                    const info = document.createElement('div');
                    info.style.flex = '1';
                    info.style.minWidth = '0';
                    info.innerHTML = `
                        <div style="font-family:var(--game-font); font-size:0.74rem; font-weight:900; color:${th.accent};">${this.escapeHtml(th.name)}${th.bundleOnly ? '<span class="bundle-exclusive-pill">АКЦИЯ · ЭКСКЛЮЗИВ</span>' : ''}</div>
                        <div class="title-item-desc">${this.escapeHtml(th.desc)}</div>
                        ${this.shopOfferTimerHtml(th, shopNow)}
                    `;

                    const btn = document.createElement('button');
                    btn.type = 'button';
                    if (selected) {
                        btn.className = 'btn-ship-action equipped';
                        btn.textContent = 'АКТИВНО [[xp:check]]';
                        btn.addEventListener('click', () => this.sound.playUiClick());
                    } else if (owned) {
                        btn.className = 'btn-ship-action select';
                        btn.textContent = 'НАДЕТЬ';
                        btn.addEventListener('click', () => {
                            this.pass.state.equippedTheme = th.id;
                            this.pass.triggerSave(true);
                            this.sound.playUiClick();
                            this.renderThemesModal();
                            this.renderProfileModal();
                            this.updateAllUI();
                            this.showToast(`Оформление «${th.name}» установлено!`);
                        });
                    } else if (th.bundleOnly) {
                        btn.className = 'btn-equip-title lock';
                        btn.textContent = 'БАНДЛ [[xp:lock]]';
                        btn.addEventListener('click', () => {
                            this.sound.playUiBack();
                            this.showToast(this.getBundleOfferMessage('themeId', th.id));
                        });
                    } else {
                        btn.className = 'btn-ship-action buy';
                        btn.innerHTML = xpPriceHTML(th.cost);
                        btn.title = `Цена: ${th.cost} искр`;
                        if (this.pass.state.sparks < th.cost) btn.classList.add('cant-afford');
                        this.bindShopPurchase(card, btn, th.cost, state => {
                            state.unlockedThemes.push(th.id);
                            state.equippedTheme = th.id;
                        }, `Куплено оформление «${th.name}»!`, {
                            offer: th,
                            refresh: () => {
                                this.renderThemesModal();
                                this.renderProfileModal();
                            }
                        });
                    }

                    if (th.illustrated) {
                        card.classList.add('profile-skin-list-item');
                        card.append(this.createProfileSkinPreview(th), info, btn);
                    } else {
                        const swatch = document.createElement('div');
                        swatch.className = `theme-swatch-pill ${th.cssClass || ''}`;
                        if (!th.cssClass) {
                            swatch.style.background = 'rgba(0, 243, 255, 0.14)';
                            swatch.style.border = '1.5px solid rgba(0, 243, 255, 0.5)';
                        }
                        swatch.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${th.accent}" stroke-width="2.2"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M5 17c1.5-2.5 6.5-2.5 8 0"/></svg>`;
                        this.applyProfileThemeMotion(swatch, th);
                        card.append(swatch, info, btn);
                    }
                    themesListEl.appendChild(card);
                });
            },

            openContractsModal() {
                this.renderContractsModal();
                document.getElementById('contractsOverlay').classList.remove('hidden');
            },

            renderContractsModal() {
                const sparksCounterEl = document.getElementById('profileSparksCounter');
                if (sparksCounterEl) sparksCounterEl.textContent = `${this.pass.state.sparks} [[xp:spark]]`;

                const activeIds = this.pass.getActiveContractIds();
                const claimedContracts = this.pass.state.claimedContracts || [];
                const filter = this.contractFilter || 'ALL';

                const entries = SPARK_CONTRACTS.map(ct => {
                    const isClaimed = claimedContracts.includes(ct.id);
                    const curVal = this.pass.getContractCurrentValue(ct);
                    return {
                        ct,
                        isClaimed,
                        curVal,
                        isReady: !isClaimed && curVal >= ct.target,
                        isActive: !isClaimed && activeIds.includes(ct.id),
                        pct: Math.min(100, Math.round((curVal / ct.target) * 100))
                    };
                });

                const readyEntries = entries.filter(e => e.isReady);

                /* Кнопка «ЗАБРАТЬ ВСЁ» */
                const claimAllBtn = document.getElementById('btnClaimAllContracts');
                if (claimAllBtn) {
                    const totalReady = this.pass.previewSparkReward(readyEntries.reduce((sum, e) => sum + e.ct.sparks, 0));
                    claimAllBtn.classList.toggle('hidden', readyEntries.length === 0);
                    claimAllBtn.textContent = readyEntries.length
                        ? `ЗАБРАТЬ ВСЁ · ${totalReady} [[xp:spark]]`
                        : 'ЗАБРАТЬ ВСЁ';
                }

                /* Бар трёх слотов */
                const slotsBar = document.getElementById('contractSlotsBar');
                if (slotsBar) {
                    slotsBar.innerHTML = '';
                    for (let i = 0; i < this.pass.maxActiveContracts; i++) {
                        const slot = document.createElement('div');
                        const id = activeIds[i];
                        const entry = id ? entries.find(e => e.ct.id === id) : null;

                        if (entry) {
                            slot.className = `contract-slot filled ${entry.ct.hard ? 'hard' : ''} ${entry.isReady ? 'ready' : ''}`;
                            slot.innerHTML = `
                                <div class="contract-slot-top">
                                    <span class="contract-slot-index">АКТИВНЫЙ КОНТРАКТ</span>
                                    <button class="contract-slot-remove" type="button" data-unselect="${entry.ct.id}" title="Снять контракт">[[xp:close]]</button>
                                </div>
                                <div class="contract-slot-name">${this.escapeHtml(entry.ct.name)}</div>
                                <div class="contract-slot-prog">${entry.curVal}/${entry.ct.target}${entry.isReady ? ' · ГОТОВ' : ''}</div>
                                <div class="contract-prog-bar"><div class="contract-prog-fill" style="width:${entry.pct}%"></div></div>
                            `;
                        } else {
                            slot.className = 'contract-slot empty';
                            slot.innerHTML = `
                                <div class="contract-slot-top"><span class="contract-slot-index">АКТИВНЫЙ КОНТРАКТ</span></div>
                                <div class="contract-slot-empty-text">СВОБОДЕН</div>
                            `;
                        }
                        slotsBar.appendChild(slot);
                    }
                }

                /* Подсветка активного фильтра */
                document.querySelectorAll('#contractFilterRow .contract-filter-btn').forEach(btn => {
                    const active = (btn.dataset.filter || 'ALL') === filter;
                    btn.classList.toggle('active', active);
                    btn.setAttribute('aria-pressed', String(active));
                });

                /* Список контрактов */
                const contractsListEl = document.getElementById('profileContractsList');
                if (!contractsListEl) return;
                contractsListEl.innerHTML = '';

                const freeSlots = this.pass.getFreeContractSlots();
                const hintBanner = document.createElement('div');
                hintBanner.className = 'trail-lock-banner contracts-hint';
                hintBanner.style.borderColor = activeIds.length ? '#00f5d4' : '#ffd60a';
                hintBanner.style.color = activeIds.length ? '#a5f3fc' : '#fef08a';
                hintBanner.innerHTML = activeIds.length
                    ? `[[xp:target]] В РАБОТЕ: <strong style="color:#ffd60a;">1 контракт</strong>. Чтобы выбрать другой, сначала снимите текущий.`
                    : `[[xp:warning]] Слот пуст. Возьмите в работу один контракт — прогресс пойдёт только по нему.`;
                contractsListEl.appendChild(hintBanner);

                const passesFilter = (e) => {
                    if (filter === 'CLAIMED') return e.isClaimed;
                    if (e.isClaimed) return false;
                    if (filter === 'ACTIVE') return e.isActive;
                    if (filter === 'READY') return e.isReady;
                    if (filter === 'HARD') return Boolean(e.ct.hard);
                    if (filter === 'EXPEDITION') return e.ct.mode === 'EXPEDITION';
                    return true;
                };
                const rank = (e) => {
                    if (e.isReady) return 0;
                    if (e.isActive) return 1;
                    if (e.isClaimed) return 3;
                    return 2;
                };

                const visibleEntries = entries
                    .filter(passesFilter)
                    .sort((a, b) => rank(a) - rank(b) || b.ct.sparks - a.ct.sparks);

                if (!visibleEntries.length) {
                    const empty = document.createElement('div');
                    empty.className = 'contracts-empty';
                    empty.textContent = filter === 'CLAIMED'
                        ? 'Пока нет полученных контрактов.'
                        : 'В этой категории пусто. Попробуйте другой фильтр.';
                    contractsListEl.appendChild(empty);
                }

                visibleEntries.forEach(({ ct, isClaimed, isReady, isActive, curVal, pct }) => {
                    const isHard = Boolean(ct.hard);
                    const slotIndex = activeIds.indexOf(ct.id);
                    const rewardSparks = this.pass.previewSparkReward(ct.sparks);

                    const card = document.createElement('div');
                    card.className = [
                        'title-item-card',
                        'contract-card',
                        isHard ? 'hard-contract-card' : '',
                        isReady ? 'is-ready' : '',
                        isActive ? 'contract-active-glow' : '',
                        isClaimed ? 'is-claimed' : ''
                    ].filter(Boolean).join(' ');

                    const info = document.createElement('div');
                    info.style.flex = '1';
                    info.style.minWidth = '0';

                    const chips = [];
                    if (isClaimed) chips.push('<span class="contract-chip claimed">[[xp:check]] ПОЛУЧЕНО</span>');
                    if (isReady) chips.push('<span class="contract-chip ready">[[xp:bolt]] ГОТОВ К ЗАБОРУ</span>');
                    if (isActive) chips.push(`<span class="contract-chip active">● В РАБОТЕ · СЛОТ ${slotIndex + 1}</span>`);
                    if (isHard) chips.push('<span class="contract-chip hard">[[xp:bolt]] СЛОЖНЫЙ</span>');
                    if (ct.mode === 'EXPEDITION') chips.push('<span class="contract-chip expedition">[[xp:target]] ЭКСПЕДИЦИЯ</span>');

                    const rewardShip = ct.rewardType === 'ship'
                        ? SHIP_CATALOG.find(ship => ship.id === ct.rewardId)
                        : null;
                    const preview = rewardShip ? '<canvas data-css-size="42" width="42" height="42" aria-hidden="true"></canvas>' : '';
                    const rewardLabel = ct.rewardLabel
                        ? `<span class="contract-reward-pill${rewardShip ? ' contract-ship-reward' : ''}">${preview}${this.escapeHtml(ct.rewardLabel)}</span>`
                        : '';

                    info.innerHTML = `
                        <div>${chips.join('')}</div>
                        <div style="font-family:var(--game-font); font-size:0.76rem; font-weight:900; color:${isHard ? '#ff70d9' : '#ffd60a'};">${this.escapeHtml(ct.name)} <span style="color:#a5f3fc; font-size:0.66rem;">(${curVal}/${ct.target})</span></div>
                        <div class="title-item-desc">${this.escapeHtml(ct.desc)}</div>
                        <div class="contract-prog-bar"><div class="contract-prog-fill" style="width:${pct}%"></div></div>
                        <div class="contract-reward-row">${rewardLabel}<span class="contract-reward-pill">+${rewardSparks} [[xp:spark]]</span></div>
                    `;
                    if (rewardShip) this.drawShipPreview(info.querySelector('canvas'), rewardShip);

                    const btn = document.createElement('button');
                    btn.type = 'button';

                    if (isClaimed) {
                        btn.className = 'btn-ship-action equipped';
                        btn.textContent = 'ПОЛУЧЕНО [[xp:check]]';
                        btn.disabled = true;
                        btn.addEventListener('click', () => this.sound.playUiClick());
                    } else if (isReady) {
                        btn.className = 'btn-ship-action buy';
                        btn.textContent = `ЗАБРАТЬ +${rewardSparks} [[xp:spark]]`;
                        btn.addEventListener('click', () => {
                            const res = this.pass.claimSparkContract(ct.id);
                            if (res) {
                                this.renderContractsModal();
                                this.updateAllUI();
                                this.showToast(res.rewardLabel
                                    ? `[[xp:party]] Контракт выполнен! Награда: ${res.rewardLabel} и +${res.sparks} [[xp:spark]]!`
                                    : `Контракт выполнен: +${res.sparks} Жёлтых Искр!`);
                            }
                        });
                    } else if (isActive) {
                        btn.className = 'contract-btn-remove';
                        btn.textContent = 'СНЯТЬ ×';
                        btn.addEventListener('click', () => {
                            this.pass.unselectContract(ct.id);
                            this.sound.playUiClick();
                            this.renderContractsModal();
                            this.updateAllUI();
                            this.showToast(`Контракт «${ct.name}» снят со слота`);
                        });
                    } else {
                        const noSlots = freeSlots <= 0;
                        btn.className = `btn-equip-title equip${noSlots ? ' slots-full' : ''}`;
                        btn.textContent = noSlots ? 'СЛОТ ЗАНЯТ' : 'ВЗЯТЬ В РАБОТУ';
                        if (noSlots) btn.disabled = true;
                        btn.addEventListener('click', () => {
                            const result = this.pass.selectActiveContract(ct.id);
                            if (result === 'full') {
                                this.showToast('Можно взять только один контракт — сначала снимите текущий');
                                return;
                            }
                            if (result !== 'ok') return;
                            this.sound.playUiClick();
                            this.renderContractsModal();
                            this.updateAllUI();
                            this.showToast(`Контракт «${ct.name}» взят в работу`);
                        });
                    }

                    card.appendChild(info);
                    card.appendChild(btn);
                    contractsListEl.appendChild(card);
                });
            }
        });
