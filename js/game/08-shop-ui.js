        // Hangar, shop and bundles UI
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            isShopOfferActive(offer, now = Date.now()) {
                return (offer.shopStartsAt == null || now >= offer.shopStartsAt)
                    && (offer.shopEndsAt == null || now < offer.shopEndsAt);
            },

            getBundleOfferMessage(itemKey, itemId) {
                const now = Date.now();
                const bundle = PROMO_BUNDLES.find(b => b[itemKey] === itemId && this.isShopOfferActive(b, now));
                return bundle
                    ? `Предмет бандла «${bundle.name}». Бандл доступен во вкладке «Акции».`
                    : 'Эксклюзивный предмет. Сейчас его бандл недоступен.';
            },

            formatShopOfferCountdown(endsAt, now = Date.now()) {
                const seconds = Math.max(0, Math.ceil((endsAt - now) / 1000));
                const days = Math.floor(seconds / 86400);
                const hours = Math.floor(seconds / 3600) % 24;
                const minutes = Math.floor(seconds / 60) % 60;
                const clock = [hours, minutes, seconds % 60].map(value => String(value).padStart(2, '0')).join(':');
                return days ? `${days} д ${clock}` : clock;
            },

            shopOfferTimerHtml(offer, now) {
                if (!offer?.shopEndsAt || !this.isShopOfferActive(offer, now)) return '';
                return `<div class="shop-offer-timer">Осталось <span role="timer" data-shop-offer-end="${offer.shopEndsAt}">${this.formatShopOfferCountdown(offer.shopEndsAt, now)}</span></div>`;
            },

            updateShopOfferTimers(now) {
                for (const [overlayId, listId, render] of [
                    ['hangarOverlay', 'hangarShipsList', this.renderHangarModal],
                    ['themesOverlay', 'profileThemesList', this.renderThemesModal]
                ]) {
                    const overlay = document.getElementById(overlayId);
                    if (!overlay || overlay.classList.contains('hidden')) continue;
                    const list = document.getElementById(listId);
                    if (!list) continue;
                    let refresh = false;
                    const start = list.querySelector('[data-shop-offer-start]');
                    if (start && now >= Number(start.getAttribute('data-shop-offer-start'))) refresh = true;
                    for (const timer of list.querySelectorAll('[data-shop-offer-end]')) {
                        const end = Number(timer.getAttribute('data-shop-offer-end'));
                        if (now >= end) refresh = true;
                        else {
                            const text = this.formatShopOfferCountdown(end, now);
                            if (timer.textContent !== text) timer.textContent = text;
                        }
                    }
                    if (refresh) {
                        const scrollTop = list.scrollTop;
                        render.call(this);
                        list.scrollTop = scrollTop;
                    }
                }
            },

            bindShopPurchase(row, button, price, grant, message, { refresh = () => this.renderHangarModal(), offer, isOwned } = {}) {
                button.addEventListener('click', () => {
                    const list = row.parentElement;
                    if (button.disabled || !list) return;
                    if (offer && !this.isShopOfferActive(offer)) {
                        refresh();
                        this.showToast('Предложение завершилось.');
                        return;
                    }
                    const state = this.pass.state;
                    if (isOwned?.(state)) {
                        refresh();
                        return;
                    }
                    if (state.sparks < price) {
                        this.sound.playUiBack();
                        button.style.animation = 'purchaseShake 0.4s ease';
                        setTimeout(() => { button.style.animation = ''; }, 400);
                        this.showToast(`Недостаточно Искр! Нужно ещё ${price - state.sparks} [[xp:spark]]`);
                        return;
                    }

                    const position = Array.from(list.children).indexOf(row);
                    const scrollTop = list.scrollTop;
                    const restoreFocus = document.activeElement === button;
                    button.disabled = true;
                    state.sparks -= price;
                    grant(state);
                    this.pass.triggerSave(true);
                    this.sound.playLevelUp();
                    refresh();
                    this.updateAllUI();
                    this.showToast(message);

                    // Purchasing preserves catalog order, so the refreshed row occupies the same slot.
                    list.scrollTop = scrollTop;
                    const purchasedRow = list.children[position];
                    if (!purchasedRow) return;
                    if (restoreFocus) {
                        const nextButton = purchasedRow.querySelector('button');
                        if (nextButton && !nextButton.disabled) {
                            nextButton.focus({ preventScroll: true });
                        } else {
                            purchasedRow.tabIndex = -1;
                            purchasedRow.focus({ preventScroll: true });
                        }
                    }
                    const flash = document.createElement('span');
                    flash.className = 'shop-purchase-flash';
                    flash.setAttribute('aria-hidden', 'true');
                    purchasedRow.appendChild(flash);
                    setTimeout(() => flash.remove(), 660);
                });
            },

            openHangarModal() {
                this.renderHangarModal();
                document.getElementById('hangarOverlay').classList.remove('hidden');
                // Синтвейв-эмбиент магазина (не запустится, если звук выключен)
                this.sound.startBgm('SHOP');
            },

            renderHangarModal() {
                const shopNow = Date.now();
                document.getElementById('hangarSparksBalance').textContent = this.pass.state.sparks;
                document.getElementById('shopTabShips').classList.toggle('active', this.activeShopTab === 'SHIPS');
                document.getElementById('shopTabMasks').classList.toggle('active', this.activeShopTab === 'MASKS');
                document.getElementById('shopTabTrails').classList.toggle('active', this.activeShopTab === 'TRAILS');
                document.getElementById('shopTabThemes').classList.toggle('active', this.activeShopTab === 'THEMES');
                document.getElementById('shopTabBundles').classList.toggle('active', this.activeShopTab === 'BUNDLES');

                const listEl = document.getElementById('hangarShipsList');
                this.unobserveProfileThemePreviews(listEl);
                listEl.innerHTML = '';

                if (this.activeShopTab === 'SHIPS') {
                    const avail42 = isSkin42Available();
                    const daysLeft42 = getSkin42DaysLeft();
                    SHIP_CATALOG.filter(ship => !ship.adminOnly || this.pass.state.unlockedShips.includes(ship.id)).forEach(ship => {
                        const owned = this.pass.state.unlockedShips.includes(ship.id);
                        const selected = this.pass.state.equippedShip === ship.id;
                        const is42 = ship.id === 'skin42';
                        const expired42 = is42 && !owned && !avail42;

                        const row = document.createElement('div');
                        row.className = `ship-card ${selected ? 'selected' : ''} ${is42 ? 'limited-42' : ''} ${ship.id === 'aurum' ? 'aurum-ship-card' : ''}`;

                        const previewWrap = document.createElement('div');
                        previewWrap.className = 'ship-preview-dot';
                        const pCanvas = document.createElement('canvas');
                        pCanvas.setAttribute('data-css-size', '50');
                        pCanvas.width = 50;
                        pCanvas.height = 50;
                        this.drawShipPreview(pCanvas, ship);
                        previewWrap.appendChild(pCanvas);

                        const badgeHtml = ship.adminOnly ? '<span class="requiem-badge">НАГРАДА · 1 000 000</span>' : ship.bundleOnly
                            ? '<span class="bundle-exclusive-pill">АКЦИЯ · ЭКСКЛЮЗИВ</span>'
                            : ship.contractOnly
                            ? '<span class="module-contract-pill">КОНТРАКТ</span>'
                            : (is42
                                ? `<span class="limited-time-pill">${avail42 ? `ДО 30 НОЯБРЯ (${daysLeft42} ДН.)` : 'ЛИМИТ'}</span>`
                                : (ship.id === 'aurum'
                                    ? '<span class="skin-legendary-badge">LEGENDARY</span>'
                                    : (['toaster','ufo','neko','ghost','cassette','dragon','aurora','lotus','ronin','prism','astral','volcanic','bathyscaphe_liman','origami_crane'].includes(ship.id) ? '<span class="skin-new-badge">NEW</span>' : '')));

                        const info = document.createElement('div');
                        info.style.flex = '1';
                        info.style.minWidth = '0';
                        info.innerHTML = `
                            <div style="font-family:var(--game-font); font-size:0.78rem; font-weight:900; color:${ship.primary};">${ship.name}${badgeHtml}</div>
                            <div style="font-size:0.64rem; color:var(--text-muted); margin-top:3px; line-height:1.3;">${ship.desc}</div>
                            ${ship.trailLabel ? `<div style="font-size:0.58rem; color:#00f5d4; margin-top:3px; font-weight:700;">[[xp:sparkle]] Кастомный след: ${ship.trailLabel}</div>` : ''}
                        `;

                        const btn = document.createElement('button');
                        btn.type = 'button';
                        if (selected) {
                            btn.className = 'btn-ship-action equipped';
                            btn.textContent = 'ВЫБРАН [[xp:check]]';
                            btn.addEventListener('click', () => this.sound.playUiClick());
                        } else if (owned) {
                            btn.className = 'btn-ship-action select';
                            btn.textContent = 'ВЫБРАТЬ';
                            btn.addEventListener('click', () => {
                                this.pass.state.equippedShip = ship.id;
                                // Сохраняем выбранный след (магазинный или со скина); сбрасываем только если он недоступен
                                const keptTrail = this.pass.state.equippedTrail !== 'default' && this.hasValidEquippedTrail();
                                if (!keptTrail) this.pass.state.equippedTrail = 'default';
                                this.pass.triggerSave(true);
                                this.sound.playUiClick();
                                this.renderHangarModal();
                                this.showToast(keptTrail
                                    ? `Надет ${ship.name} · твой след сохранён!`
                                    : `Надет ${ship.name} · след «${ship.trailLabel}» активирован!`);
                            });
                        } else if (ship.adminOnly) {
                            btn.className = 'btn-equip-title lock';
                            btn.textContent = 'НЕ ВЫДАЁТСЯ [[xp:lock]]';
                        } else if (ship.bundleOnly) {
                            btn.className = 'btn-equip-title lock';
                            btn.textContent = 'БАНДЛ [[xp:lock]]';
                            btn.addEventListener('click', () => {
                                this.sound.playUiBack();
                                this.showToast(this.getBundleOfferMessage('shipId', ship.id));
                            });
                        } else if (ship.contractOnly) {
                            btn.className = 'btn-equip-title lock';
                            btn.textContent = 'КОНТРАКТ [[xp:lock]]';
                            btn.addEventListener('click', () => {
                                this.sound.playUiBack();
                                this.showToast(`Награда за сложный контракт «${ship.contractName}»!`);
                            });
                        } else if (expired42) {
                            btn.className = 'btn-equip-title lock';
                            btn.textContent = 'СНЯТ [[xp:lock]]';
                            btn.addEventListener('click', () => {
                                this.sound.playUiBack();
                                this.showToast('Продажа эксклюзивного скина «42» завершилась 30 ноября.');
                            });
                        } else {
                            btn.className = 'btn-ship-action buy';
                            btn.innerHTML = xpPriceHTML(ship.cost);
                            btn.title = `Цена: ${ship.cost} искр`;
                            if (this.pass.state.sparks < ship.cost) btn.classList.add('cant-afford');
                            this.bindShopPurchase(row, btn, ship.cost, state => {
                                state.unlockedShips.push(ship.id);
                                state.equippedShip = ship.id;
                                // След скина открывается НАВСЕГДА и доступен на любом корабле; текущий выбор сохраняем
                                if (!this.hasValidEquippedTrail()) state.equippedTrail = 'default';
                            }, ship.trailLabel
                                ? `Куплен ${ship.name} · открыт след «${ship.trailLabel}»!`
                                : `Куплен ${ship.name}!`, { isOwned: state => state.unlockedShips.includes(ship.id) });
                        }

                        row.appendChild(previewWrap);
                        row.appendChild(info);
                        row.appendChild(btn);
                        listEl.appendChild(row);
                    });
                } else if (this.activeShopTab === 'MASKS') {
                    MASK_CATALOG.forEach(mask => {
                        const owned = this.pass.state.unlockedMasks.includes(mask.id);
                        const selected = this.pass.state.equippedMask === mask.id;

                        const row = document.createElement('div');
                        row.className = `ship-card ${selected ? 'selected' : ''}`;

                        const previewWrap = document.createElement('div');
                        previewWrap.className = 'ship-preview-dot';
                        previewWrap.innerHTML = mask.svg;

                        const badgeTag = mask.contractOnly
                            ? '<span class="module-contract-pill">КОНТРАКТ</span>'
                            : '';

                        const info = document.createElement('div');
                        info.style.flex = '1';
                        info.style.minWidth = '0';
                        info.innerHTML = `
                            <div style="font-family:var(--game-font); font-size:0.76rem; font-weight:900; color:#ff70d9;">${mask.name}${badgeTag}</div>
                            <div style="font-size:0.65rem; color:var(--text-muted); margin-top:3px; line-height:1.3;">${mask.desc}</div>
                        `;

                        const btn = document.createElement('button');
                        btn.type = 'button';
                        if (selected) {
                            btn.className = 'btn-ship-action equipped';
                            btn.textContent = 'АКТИВНА [[xp:check]]';
                            btn.addEventListener('click', () => this.sound.playUiClick());
                        } else if (owned) {
                            btn.className = 'btn-ship-action select';
                            btn.textContent = 'УСТАНОВИТЬ';
                            btn.addEventListener('click', () => {
                                this.pass.state.equippedMask = mask.id;
                                this.pass.triggerSave(true);
                                this.sound.playUiClick();
                                this.renderHangarModal();
                                this.showToast(`Модификация «${mask.name}» установлена!`);
                            });
                        } else if (mask.contractOnly) {
                            btn.className = 'btn-equip-title lock';
                            btn.textContent = 'КОНТРАКТ [[xp:lock]]';
                            btn.addEventListener('click', () => {
                                this.sound.playUiBack();
                                this.showToast(`Только за сложный контракт «${mask.contractName}»!`);
                            });
                        } else {
                            btn.className = 'btn-ship-action buy';
                            btn.innerHTML = xpPriceHTML(mask.cost);
                            btn.title = `Цена: ${mask.cost} искр`;
                            if (this.pass.state.sparks < mask.cost) btn.classList.add('cant-afford');
                            this.bindShopPurchase(row, btn, mask.cost, state => {
                                state.unlockedMasks.push(mask.id);
                                state.equippedMask = mask.id;
                            }, `Модификация «${mask.name}» куплена и установлена!`);
                        }

                        row.appendChild(previewWrap);
                        row.appendChild(info);
                        row.appendChild(btn);
                        listEl.appendChild(row);
                    });
                } else if (this.activeShopTab === 'TRAILS') {
                    const activeShip = this.getActiveShipConfig();
                    if (this.trailPage === undefined) this.trailPage = 0;
                    const onSkinPage = this.trailPage === 1;
                    const collectionTrails = TRAIL_CATALOG.filter(tr => this.pass.state.unlockedTrails.includes(tr.id)
                        && (tr.eventOnly || !this.isShopOfferActive(tr, shopNow)));
                    const collectionTitle = collectionTrails.length ? 'КОЛЛЕКЦИЯ СЛЕДОВ' : 'СЛЕДЫ СО СКИНОВ';

                    // Шапка страницы: заголовок + стрелка перелистывания
                    const header = document.createElement('div');
                    header.className = 'trail-page-header';
                    const pageTitle = document.createElement('div');
                    pageTitle.className = 'trail-page-title';
                    pageTitle.innerHTML = onSkinPage
                        ? `[[xp:crown]] ${collectionTitle} <span class="trail-page-counter">2/2</span>`
                        : `[[xp:sparkle]] СЛЕДЫ МАГАЗИНА <span class="trail-page-counter">1/2</span>`;
                    const flipArrow = document.createElement('button');
                    flipArrow.type = 'button';
                    flipArrow.className = 'trail-flip-arrow';
                    flipArrow.innerHTML = onSkinPage
                        ? '◀ ◀ СЛЕДЫ МАГАЗИНА'
                        : `${collectionTitle} ▶ ▶`;
                    flipArrow.addEventListener('click', () => {
                        this.sound.playUiClick();
                        this.trailPage = onSkinPage ? 0 : 1;
                        this.renderHangarModal();
                    });
                    header.appendChild(pageTitle);
                    header.appendChild(flipArrow);
                    listEl.appendChild(header);

                    if (onSkinPage) {
                        const banner = document.createElement('div');
                        banner.className = 'trail-lock-banner';
                        banner.innerHTML = `[[xp:sparkle]] Купленный скин навсегда открывает свой фирменный след — ставь его на ЛЮБОЙ корабль!`;
                        listEl.appendChild(banner);
                    }

                    const buildTrailRow = (opts) => {
                        const { selected, owned, titleHtml, descText, cost, onBuy, purchaseMessage, lockLabel, lockToast, activateLabel, equipLabel, afterEquipToast } = opts;
                        const row = document.createElement('div');
                        row.className = `ship-card ${selected ? 'selected' : ''}`;

                        const previewWrap = document.createElement('div');
                        previewWrap.className = 'ship-preview-dot';
                        previewWrap.innerHTML = opts.svg;

                        const info = document.createElement('div');
                        info.style.flex = '1';
                        info.style.minWidth = '0';
                        info.innerHTML = `
                            <div style="font-family:var(--game-font); font-size:0.76rem; font-weight:900; color:${opts.titleColor || '#00f5d4'};">${titleHtml}</div>
                            <div style="font-size:0.65rem; color:var(--text-muted); margin-top:3px; line-height:1.3;">${descText}</div>
                            ${this.shopOfferTimerHtml(opts.offer, shopNow)}
                        `;

                        const btn = document.createElement('button');
                        btn.type = 'button';
                        if (selected) {
                            btn.className = 'btn-ship-action equipped';
                            btn.textContent = activateLabel;
                            btn.addEventListener('click', () => this.sound.playUiClick());
                        } else if (owned) {
                            btn.className = 'btn-ship-action select';
                            btn.textContent = equipLabel;
                            btn.addEventListener('click', () => {
                                this.pass.state.equippedTrail = opts.id;
                                this.pass.triggerSave(true);
                                this.sound.playUiClick();
                                this.renderHangarModal();
                                this.showToast(afterEquipToast);
                            });
                        } else if (onBuy) {
                            btn.className = 'btn-ship-action buy';
                            btn.innerHTML = xpPriceHTML(cost);
                            btn.title = `Цена: ${cost} искр`;
                            if (this.pass.state.sparks < cost) btn.classList.add('cant-afford');
                            this.bindShopPurchase(row, btn, cost, onBuy, purchaseMessage, { offer: opts.offer });
                        } else {
                            btn.className = 'btn-equip-title lock';
                            btn.textContent = lockLabel;
                            btn.addEventListener('click', () => {
                                this.sound.playUiBack();
                                this.showToast(typeof lockToast === 'function' ? lockToast() : lockToast);
                            });
                        }

                        row.appendChild(previewWrap);
                        row.appendChild(info);
                        row.appendChild(btn);
                        listEl.appendChild(row);
                    };

                    const appendCatalogTrail = tr => {
                        const titleText = tr.id === 'default'
                            ? `КАСТОМНЫЙ СЛЕД СКИНА (${activeShip.trailLabel || 'Плазма'})`
                            : tr.name;
                        const descText = tr.id === 'default'
                            ? `Фирменный след надетого скина ${activeShip.name}.`
                            : tr.desc;
                        buildTrailRow({
                            id: tr.id,
                            svg: tr.svg,
                            owned: this.pass.state.unlockedTrails.includes(tr.id),
                            selected: this.pass.state.equippedTrail === tr.id,
                            titleHtml: titleText,
                            descText,
                            cost: tr.cost,
                            offer: tr,
                            activateLabel: 'АКТИВЕН [[xp:check]]',
                            equipLabel: 'ВЫБРАТЬ',
                            afterEquipToast: `След «${titleText}» активирован!`,
                            onBuy: !tr.eventOnly && this.isShopOfferActive(tr, shopNow) ? state => {
                                state.unlockedTrails.push(tr.id);
                                state.equippedTrail = tr.id;
                            } : null,
                            purchaseMessage: `След «${tr.name}» куплен и активирован!`
                        });
                    };

                    if (!onSkinPage) {
                        TRAIL_CATALOG.filter(tr => !tr.eventOnly && this.isShopOfferActive(tr, shopNow)).forEach(appendCatalogTrail);
                    } else {
                        collectionTrails.forEach(appendCatalogTrail);
                        SKIN_TRAILS.filter(st => st.shipId !== 'crimson_requiem' || this.isSkinTrailOwned(st.id)).forEach(st => {
                            const owned = this.isSkinTrailOwned(st.id);
                            const trailShip = SHIP_CATALOG.find(s => s.id === st.shipId);
                            const fromBundle = Boolean(trailShip && trailShip.bundleOnly);
                            buildTrailRow({
                                id: st.id,
                                svg: skinTrailIconSvg(st.id, st.accent),
                                titleColor: st.accent,
                                owned,
                                selected: this.pass.state.equippedTrail === st.id,
                                titleHtml: `${st.name}${owned ? '<span class="trail-skin-owned-pill">ОТКРЫТ</span>' : (fromBundle ? '<span class="bundle-exclusive-pill">АКЦИЯ</span>' : '')}`,
                                descText: st.desc,
                                cost: null,
                                activateLabel: 'АКТИВЕН [[xp:check]]',
                                equipLabel: 'ВЫБРАТЬ',
                                afterEquipToast: `След ${st.name} активен на ${activeShip.name}!`,
                                lockLabel: fromBundle ? 'ИЗ БАНДЛА [[xp:lock]]' : 'НУЖЕН СКИН [[xp:lock]]',
                                lockToast: fromBundle
                                    ? () => this.getBundleOfferMessage('shipId', st.shipId)
                                    : trailShip?.contractOnly
                                    ? `Выполни контракт «${trailShip.contractName}», чтобы открыть скин «${st.shipName}» и его след.`
                                    : `Купи скин «${st.shipName}» в Ангаре — и след ${st.name} откроется навсегда на любой корабль!`
                            });
                        });
                    }
                } else if (this.activeShopTab === 'THEMES') {
                    PROFILE_THEMES.filter(th => this.isShopOfferActive(th, shopNow)).forEach(th => {
                        const owned = this.pass.state.unlockedThemes.includes(th.id);
                        const selected = this.pass.state.equippedTheme === th.id;

                        const row = document.createElement('div');
                        row.className = `ship-card ${selected ? 'selected' : ''}`;

                        const info = document.createElement('div');
                        info.style.flex = '1';
                        info.style.minWidth = '0';
                        info.innerHTML = `
                            <div style="font-family:var(--game-font); font-size:0.76rem; font-weight:900; color:${th.accent};">${th.name}${th.bundleOnly ? '<span class="bundle-exclusive-pill">АКЦИЯ · ЭКСКЛЮЗИВ</span>' : ''}</div>
                            <div style="font-size:0.65rem; color:var(--text-muted); margin-top:3px; line-height:1.3;">${th.desc}</div>
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
                                this.renderHangarModal();
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
                            this.bindShopPurchase(row, btn, th.cost, state => {
                                state.unlockedThemes.push(th.id);
                                state.equippedTheme = th.id;
                            }, `Оформление «${th.name}» куплено и надето!`, { offer: th });
                        }

                        if (th.illustrated) {
                            row.classList.add('profile-skin-list-item');
                            row.append(this.createProfileSkinPreview(th), info, btn);
                        } else {
                            const previewWrap = document.createElement('div');
                            previewWrap.className = `ship-preview-dot ${th.cssClass || ''}`;
                            previewWrap.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${th.accent}" stroke-width="2.2"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M5 17c1.5-2.5 6.5-2.5 8 0"/></svg>`;
                            this.applyProfileThemeMotion(previewWrap, th);
                            row.append(previewWrap, info, btn);
                        }
                        listEl.appendChild(row);
                    });
                } else if (this.activeShopTab === 'BUNDLES') {
                    this.renderBundlesTab(listEl, shopNow);
                }
            },

            // Владение предметами бандла (для галочек и состояния «В КОЛЛЕКЦИИ»)
            getBundleOwnership(b) {
                const st = this.pass.state;
                return {
                    ship: (st.unlockedShips || []).includes(b.shipId),
                    trail: b.trailIsSkin
                        ? (st.unlockedShips || []).includes(b.shipId)
                        : (st.unlockedTrails || []).includes(b.trailId),
                    theme: (st.unlockedThemes || []).includes(b.themeId),
                    title: (st.unlockedTitles || []).includes(b.titleId)
                };
            },

            renderBundlesTab(listEl, now = Date.now()) {
                const bundles = PROMO_BUNDLES.filter(bundle => this.isShopOfferActive(bundle, now));
                const nextStart = Math.min(...PROMO_BUNDLES.map(bundle => bundle.shopStartsAt).filter(start => start > now));
                const banner = document.createElement('div');
                banner.className = 'bundle-banner';
                if (Number.isFinite(nextStart)) banner.setAttribute('data-shop-offer-start', nextStart);
                banner.innerHTML = `
                    <div class="bundle-banner-title">[[xp:fire]] АКЦИИ И БАНДЛЫ</div>
                    <div class="bundle-banner-sub">${bundles.length ? 'Скин корабля + титул + след + цвет профиля одним пакетом.' : 'Сейчас нет активных акций.'}</div>
                `;
                listEl.appendChild(banner);

                bundles.forEach(b => {
                    const ship = SHIP_CATALOG.find(s => s.id === b.shipId);
                    const theme = PROFILE_THEMES.find(t => t.id === b.themeId);
                    const title = PLAYER_TITLES.find(t => t.id === b.titleId);
                    const trailName = b.trailIsSkin
                        ? `СЛЕД «${ship.trailLabel}»`
                        : (TRAIL_CATALOG.find(t => t.id === b.trailId)?.name || b.trailId);
                    const own = this.getBundleOwnership(b);
                    const ownedCount = [own.ship, own.trail, own.theme, own.title].filter(Boolean).length;
                    const allOwned = ownedCount === 4;
                    const savePct = b.oldPrice ? Math.round((1 - b.price / b.oldPrice) * 100) : 0;

                    const itemRow = (ico, label, nameHtml, owned, exclusiveItem) => `
                        <div class="bundle-item ${owned ? 'owned' : ''}">
                            <span class="bundle-item-ico">${ico}</span>
                            <span class="bundle-item-label">${label}</span>
                            <span class="bundle-item-name">${nameHtml}</span>
                            ${owned
                                ? '<span class="bundle-item-state have">[[xp:check]]</span>'
                                : (exclusiveItem ? '<span class="bundle-item-state ex">ЭКСКЛЮЗИВ</span>' : '')}
                        </div>`;

                    const shipIco = `<svg viewBox="0 0 24 24" fill="none" stroke="${ship.primary}" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 20 20 12 16 4 20 12 2"/></svg>`;
                    const trailIco = b.trailIsSkin ? skinTrailIconSvg(b.trailId, b.accent) : (TRAIL_CATALOG.find(t => t.id === b.trailId)?.svg || '');
                    const titleIco = `[[xp:crown]]`;
                    const themeIco = `[[xp:palette]]`;

                    const card = document.createElement('div');
                    card.className = `bundle-card ${b.exclusive ? 'exclusive' : ''}`;
                    card.innerHTML = `
                        <div class="bundle-shine"></div>
                        <div class="bundle-ribbon">${b.exclusive ? 'ЭКСКЛЮЗИВ' : `-${savePct}%`}</div>
                        <div class="bundle-head">
                            <div class="bundle-preview"><canvas width="60" height="60" data-css-size="60"></canvas></div>
                            <div class="bundle-head-info">
                                <div class="bundle-name" style="color:${b.accent}; text-shadow:0 0 14px ${b.accent}66;">${b.name}</div>
                                <div class="bundle-tagline">${b.tagline}</div>
                                ${this.shopOfferTimerHtml(b, now)}
                            </div>
                        </div>
                        <div class="bundle-items">
                            ${itemRow(shipIco, 'СКИН', `<span style="color:${ship.primary}">${ship.name}</span>`, own.ship, b.exclusive)}
                            ${itemRow(trailIco, 'СЛЕД', trailName, own.trail, b.exclusive)}
                            ${itemRow(titleIco, 'ТИТУЛ', `<span class="player-title-badge ${title.cssClass}" style="font-size:0.56rem;">${title.icon ? title.icon + ' ' : ''}${title.name}</span>`, own.title, b.exclusive)}
                            ${itemRow(themeIco, 'ПРОФИЛЬ', `<span style="color:${theme.accent}">${theme.name}</span>`, own.theme, b.exclusive)}
                        </div>
                        <div class="bundle-desc">${b.desc}</div>
                        <div class="bundle-footer">
                            <div class="bundle-price-row">
                                ${b.oldPrice ? `<span class="bundle-old-price">${b.oldPrice.toLocaleString('ru-RU')}</span><span class="bundle-save-pill">-${savePct}%</span>` : ''}
                                <span class="bundle-price">${xpPriceHTML(b.price)}</span>
                            </div>
                            <button type="button" class="bundle-buy-btn"></button>
                        </div>
                        ${ownedCount > 0 && !allOwned ? `<div class="bundle-note">[[xp:warning]] Уже в коллекции: ${ownedCount}/4 — бандл добавит только недостающее.</div>` : ''}
                    `;

                    const cv = card.querySelector('canvas');
                    this.drawShipPreview(cv, ship);

                    const btn = card.querySelector('.bundle-buy-btn');
                    if (allOwned) {
                        btn.classList.add('owned');
                        btn.disabled = true;
                        btn.innerHTML = 'В КОЛЛЕКЦИИ [[xp:check]]';
                        btn.addEventListener('click', () => this.sound.playUiClick());
                    } else {
                        btn.innerHTML = `КУПИТЬ · ${xpPriceHTML(b.price)}`;
                        btn.title = `Цена бандла: ${b.price} искр`;
                        if (this.pass.state.sparks < b.price) btn.classList.add('cant-afford');
                        this.bindShopPurchase(card, btn, b.price, st => {
                            if (!st.unlockedShips.includes(b.shipId)) st.unlockedShips.push(b.shipId);
                            if (!b.trailIsSkin && !st.unlockedTrails.includes(b.trailId)) st.unlockedTrails.push(b.trailId);
                            if (!st.unlockedThemes.includes(b.themeId)) st.unlockedThemes.push(b.themeId);
                            if (!st.unlockedTitles.includes(b.titleId)) st.unlockedTitles.push(b.titleId);
                            // Сразу надеваем весь сет бандла
                            st.equippedShip = b.shipId;
                            st.equippedTrail = b.trailId;
                            st.equippedTheme = b.themeId;
                            st.equippedTitle = b.titleId;
                        }, `[[xp:party]] Бандл «${b.name}» куплен! Скин, след, титул и цвет профиля уже надеты!`, { offer: b });
                    }
                    listEl.appendChild(card);
                });
            }
        });
