// The garage shares the flight model and exhaust renderers. The walls and window view are cached separately.

function paintGarageArchitecture(c, w, h, bayX, bayY, bayWidth, bayHeight) {
    const port = bayX + bayWidth * .5;
    const floor = bayY + bayHeight * .57;
    const focus = bayY + bayHeight * .39;
    const span = Math.min(bayWidth, bayHeight * 1.35);
    const line = (x1, y1, x2, y2, color, weight = 1) => {
        c.strokeStyle = color;
        c.lineWidth = weight;
        c.beginPath();
        c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    };
    const polygon = (fill, points) => {
        c.fillStyle = fill;
        c.beginPath();
        c.moveTo(...points[0]);
        points.slice(1).forEach(point => c.lineTo(...point));
        c.closePath();
        c.fill();
    };

    const air = c.createLinearGradient(0, 0, 0, h);
    air.addColorStop(0, '#0b0421');
    air.addColorStop(floor / h, '#2a1038');
    air.addColorStop(1, '#09071e');
    c.fillStyle = air;
    c.fillRect(0, 0, w, h);

    // The panoramic opening sits behind the steel ribs and the maintenance deck.
    const winLeft = port - span * .49, winRight = port + span * .49;
    const winTop = Math.max(h * .10, focus - span * .55);
    c.fillStyle = '#050610';
    c.fillRect(winLeft - 8, winTop - 8, winRight - winLeft + 16, floor - winTop + 13);
    c.clearRect(winLeft, winTop, winRight - winLeft, floor - winTop);
    const glass = c.createLinearGradient(0, winTop, 0, floor);
    glass.addColorStop(0, '#09061b36');
    glass.addColorStop(.65, '#09061b0d');
    glass.addColorStop(1, '#09061b59');
    c.fillStyle = glass;
    c.fillRect(winLeft, winTop, winRight - winLeft, floor - winTop);
    line(winLeft, winTop, winRight, winTop, '#42334f', 1.4);
    line(winLeft, floor, winRight, floor, '#93728955', 2);
    for (const ratio of [.22, .78]) {
        const x = winLeft + (winRight - winLeft) * ratio;
        line(x, winTop, x, floor, '#070912', 5);
        line(x + 3, winTop, x + 3, floor, '#43405a66');
    }

    const deck = c.createLinearGradient(0, floor, 0, h);
    deck.addColorStop(0, '#111723');
    deck.addColorStop(.48, '#141525');
    deck.addColorStop(1, '#070810');
    c.fillStyle = deck;
    c.fillRect(0, floor, w, h - floor);
    for (let i = -12; i <= 12; i++) {
        line(port + i * span * .045, floor, port + i * span * .34, h, '#8bb5ca21');
    }
    for (let i = 1; i <= 10; i++) {
        const y = floor + (h - floor) * (i / 10) ** 2;
        line(0, y, w, y, i % 3 ? '#91a2bb1e' : '#b0adc03d');
    }
    for (const side of [-1, 1]) {
        line(port + side * span * .33, floor, port + side * span * 1.20, h, '#0b0d16', 6);
        line(port + side * span * .35, floor, port + side * span * 1.24, h, '#a172a141', 2);
        line(port + side * span * .38, floor, port + side * span * 1.35, h, '#63bfb72b');
    }

    for (const side of [-1, 1]) {
        const cyan = side < 0;
        const tint = cyan ? '0, 245, 212' : '255, 42, 138';
        const lampX = port + side * span * .48;
        const lampY = Math.max(h * .085, bayY - span * .12, focus - span * .57);
        const beam = c.createLinearGradient(lampX, lampY, port, focus + span * .23);
        beam.addColorStop(0, 'rgba(' + tint + ', .38)');
        beam.addColorStop(.46, 'rgba(' + tint + ', .16)');
        beam.addColorStop(1, 'rgba(' + tint + ', 0)');
        polygon(beam, [[lampX - span * .022, lampY], [lampX + span * .022, lampY],
            [port + span * .36, focus + span * .33], [port - span * .36, focus + span * .33]]);
        const beamCore = c.createLinearGradient(lampX, lampY, port, focus + span * .10);
        beamCore.addColorStop(0, 'rgba(' + tint + ', .37)');
        beamCore.addColorStop(1, 'rgba(' + tint + ', 0)');
        polygon(beamCore, [[lampX - span * .011, lampY], [lampX + span * .011, lampY],
            [port + span * .17, focus + span * .20], [port - span * .16, focus + span * .20]]);

        for (const depth of [.52, .76]) {
            const x = port + side * span * depth;
            const face = Math.max(8, span * (depth - .32) * .17);
            const bend = Math.min(h * .28, lampY + face * .8);
            const base = floor + h * (depth - .38) * .28;
            const shoulder = x - side * span * .39;
            const outer = x + side * face;
            const steel = c.createLinearGradient(x - side * face, 0, outer + side * face, 0);
            steel.addColorStop(0, '#0d1220'); steel.addColorStop(.22, '#393847');
            steel.addColorStop(.41, '#202331'); steel.addColorStop(.72, '#141520'); steel.addColorStop(1, '#080912');
            polygon(steel, [[shoulder, 0], [shoulder + side * face * 1.5, 0], [outer, bend - face * .3],
                [outer, base], [x, base + face * .5], [x - side * face * .42, base],
                [x - side * face * .42, bend + face * .38]]);
            line(shoulder + side * face * .26, 0, x, bend + face * .33, '#67627088', 1.5);
            line(x, bend + face * .33, x, base - face * .4, '#69657375', 1.2);
            line(x + side * face * .48, bend + 8, x + side * face * .48, base - 6, '#080b15', 3);
            line(x - face * .75, base, x + face * .75, base, '#43404b', 4);
            const lampColor = depth > .6 ? '#bb80935e' : 'rgba(' + tint + ', .72)';
            line(x + side * face * .24, base - face * 2.4, x + side * face * .24, base - face * .8, lampColor, 2);
        }

        c.save();
        c.translate(lampX, lampY);
        c.rotate(-side * .43);
        c.fillStyle = '#090a14';
        c.fillRect(-span * .042, -6, span * .084, 12);
        c.shadowColor = 'rgb(' + tint + ')';
        c.shadowBlur = 14;
        line(-span * .027, 2, span * .027, 2, 'rgb(' + tint + ')', 3);
        c.restore();
    }

    const vignette = c.createRadialGradient(port, focus, span * .13, port, focus, Math.max(w, h) * .70);
    vignette.addColorStop(0, '#03040a00');
    vignette.addColorStop(.53, '#03040a12');
    vignette.addColorStop(1, '#03040acb');
    c.fillStyle = vignette;
    c.fillRect(0, 0, w, h);
    return { x: winLeft, y: winTop, width: winRight - winLeft, height: floor - winTop };
}

function makeGarageMeteor(seed) {
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 80;
    const c = sprite.getContext('2d');
    const contour = Array.from({ length: 9 }, (_, i) => {
        const angle = i * Math.PI * 2 / 9;
        const radius = 21 + (i * 17 + seed * 11 + i * seed * 13) % 14;
        return [Math.cos(angle) * radius, Math.sin(angle) * radius * .78];
    });
    c.translate(40, 40);
    const stone = c.createLinearGradient(-25, -21, 18, 25);
    stone.addColorStop(0, '#ad83ae');
    stone.addColorStop(.35, '#634f78');
    stone.addColorStop(.73, '#302842');
    stone.addColorStop(1, '#170f29');
    const outline = new Path2D();
    outline.moveTo(...contour[0]);
    for (const point of contour.slice(1)) outline.lineTo(...point);
    outline.closePath();
    c.fillStyle = stone;
    c.fill(outline);
    c.save();
    c.clip(outline);

    const facets = ['#efbee735', '#0908184a', '#a285bf2b', '#160a234a'];
    for (let i = 0; i < contour.length; i++) {
        c.beginPath();
        c.moveTo(...contour[i]);
        c.lineTo(...contour[(i + 1) % contour.length]);
        c.lineTo(-5 + seed, -3);
        c.closePath();
        c.fillStyle = facets[(i + seed) % facets.length];
        c.fill();
    }
    for (const [x, y, radius] of [[-12, -5, 7], [8, 9, 5], [12, -11, 3.5], [-6, 15, 3]]) {
        const crater = c.createRadialGradient(x - 1, y - 1, 0, x, y, radius);
        crater.addColorStop(0, '#150f28bb');
        crater.addColorStop(.65, '#2e213c9c');
        crater.addColorStop(.88, '#c697bc70');
        crater.addColorStop(1, '#c697bc00');
        c.fillStyle = crater;
        c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    c.restore();
    const rim = c.createLinearGradient(-25, -19, 10, 18);
    rim.addColorStop(0, '#ffc4dfb8');
    rim.addColorStop(.6, '#9d8bd05c');
    rim.addColorStop(1, '#7799bc19');
    c.strokeStyle = rim;
    c.stroke(outline);
    return sprite;
}

const GARAGE_METEOR_PATHS = [
    { x: .59, y: .20, size: .045, speed: .017, spin: -.17, alpha: .55 },
    { x: .35, y: .37, size: .060, speed: .027, spin: .21, alpha: .63 },
    { x: .89, y: .53, size: .076, speed: .035, spin: -.24, alpha: .76 },
    { x: .81, y: .42, size: .098, speed: .047, spin: .19, alpha: .89 },
    { x: .245, y: .30, size: .128, speed: .062, spin: -.28, alpha: 1 }
];

function paintGarageMeteors(c, width, height, time, sprites) {
    const padding = width * .12;
    const route = width + padding * 2;
    GARAGE_METEOR_PATHS.forEach((meteor, i) => {
        const progress = (meteor.x + time * meteor.speed) % 1;
        const size = meteor.size * Math.min(width, height * 1.8);
        const x = progress * route - padding;
        const y = (meteor.y + (progress - meteor.x) * .24) * height;
        c.save();
        c.translate(x, y);
        c.rotate(i * 1.5 + time * meteor.spin);
        c.globalAlpha = meteor.alpha;
        c.drawImage(sprites[i], -size / 2, -size / 2, size, size);
        c.restore();
    });
}

function paintDockPlatform(c, x, y, radius, t, shipColor, shipOffset) {
    c.save();
    c.translate(x, y);
    c.scale(1, .29);
    const disc = (r, offset, color) => {
        c.beginPath();
        c.arc(0, offset, r, 0, Math.PI * 2);
        c.fillStyle = color;
        c.fill();
    };
    const ring = (r, color, width, from = 0, to = Math.PI * 2) => {
        c.beginPath();
        c.arc(0, 0, r, from, to);
        c.lineWidth = width;
        c.strokeStyle = color;
        c.stroke();
    };
    const halo = c.createRadialGradient(0, 0, radius * .3, 0, 0, radius * 1.34);
    halo.addColorStop(0, '#61f8e900');
    halo.addColorStop(.53, '#2ff5e839');
    halo.addColorStop(1, '#1ebdd300');
    disc(radius * 1.34, 0, halo);

    const steel = c.createLinearGradient(-radius, -radius, radius, radius);
    [[0, '#424452'], [.18, '#141923'], [.40, '#373d49'],
        [.51, '#171e2b'], [.86, '#202837'], [1, '#686374']].forEach(([stop, color]) => steel.addColorStop(stop, color));
    disc(radius, radius * .19, '#0b0c16');
    disc(radius, radius * .12, '#373046');
    disc(radius, 0, steel);
    ring(radius * .985, '#a8a4b169', 2);
    ring(radius * .92, '#101420', 6);
    ring(radius * .70, '#0a1520', 4);
    ring(radius * .55, '#7bacba3e', 1.4);

    c.save();
    c.globalAlpha = .7;
    const reflection = c.createRadialGradient(shipOffset, -radius * .09, 0, shipOffset, -radius * .09, radius * .64);
    reflection.addColorStop(0, shipColor + 'aa');
    reflection.addColorStop(.32, shipColor + '43');
    reflection.addColorStop(1, shipColor + '00');
    disc(radius * .74, 0, reflection);
    c.restore();

    for (let i = 0; i < 16; i++) {
        const angle = i * Math.PI / 8;
        ring(radius * .88, '#191426', 7, angle + .04, angle + .32);
        ring(radius * .88, i % 4 ? '#67ead9' : '#ff95c8', 2.6, angle + .05, angle + .28);
        ring(radius * .63, '#abb2c650', 1.8, angle, angle + .13);
    }
    // Counter-rotating arcs read as holograms above the physical lamp segments.
    for (const { r, speed, color } of [
        { r: .76, speed: .45, color: '#66ffde' }, { r: 1.05, speed: -.28, color: '#d297ff' }
    ]) {
        c.shadowColor = color;
        c.shadowBlur = 10;
        for (let i = 0; i < 3; i++) {
            const phase = i * Math.PI * 2 / 3 + t * speed % (Math.PI * 2);
            ring(radius * r, color + '35', 6, phase, phase + .74);
            ring(radius * r, color + 'cf', 1.7, phase, phase + .74);
        }
    }
    c.restore();
}

function paintGarageDust(c, w, h, t) {
    c.save();
    for (let i = 0; i < 34; i++) {
        const drift = (i * .117 + t * (.013 + i % 3 * .003)) % 1;
        const x = w * (.07 + .86 * drift) + Math.sin(i + t * .61) * 9;
        const y = h * (.08 + .65 * ((i * .618 + t * .016) % 1));
        c.globalAlpha = (.18 + .32 * Math.sin(i * 2 + t * 1.4) ** 2) * Math.sin(Math.PI * drift);
        c.fillStyle = i % 5 ? '#9ce4e9' : '#ffc492';
        const size = i % 5 ? 1.1 : 1.8;
        c.fillRect(x, y, size, size);
    }
    c.restore();
}

function garageSlotRow(state, slot, selected) {
    const isOpen = slotOpen(state, slot);
    const item = isOpen && (slot === 2 ? SUPER_BY_ID.get(state.equippedSuper) : MODULE_BY_ID.get(state.equippedModules[slot]));
    const { name, cost } = LOADOUT_SLOTS[slot];
    const requirement = isOpen ? '' : slotRequirement(state, slot);
    const affordable = !requirement && state.sparks >= cost;
    const status = item ? 'equipped' : isOpen ? 'empty' : 'locked';
    const tag = ['SLOT 01', 'SLOT 02', 'ULTIMATE'][slot];
    const statusLabel = isOpen ? (item?.name || 'Свободно') : 'Слот закрыт';
    const badge = item ? `<small class="garage-slot-draw">[[xp:bolt]] ${item.power} ед.</small>`
        : isOpen ? '' : `<span class="garage-slot-price${affordable ? '' : ' cant-afford'}">${xpPriceHTML(cost)}</span>`;
    const icon = garageEmblem(item?.id || status, 'slot-' + slot);
    return `<button type="button" class="garage-slot${item || slot === selected ? ' selected' : ''}" data-garage-action="slot" data-slot="${slot}" data-status="${status}" aria-pressed="${slot === selected}">
        <span class="garage-slot-copy">
            <span class="garage-slot-heading"><strong>${name}</strong><span class="garage-plate-mark" aria-hidden="true">${tag}</span></span>
            <span class="garage-slot-meta"><small class="garage-slot-status">${statusLabel}</small>${badge}</span>
            ${requirement ? `<small class="garage-slot-gate">${requirement}</small>` : ''}
        </span>
        <span class="garage-socket" aria-hidden="true">${icon}</span></button>`;
}

function garagePowerBlock(state) {
    const level = state.powerLimitLevel;
    const used = installedPower(state), cap = powerCapacity(level), percent = Math.round(100 * used / cap);
    const price = POWER_PRICES[level], need = level + 2, count = collectionCount(state);
    const affordable = count >= need && state.sparks >= price;
    const load = percent >= 90 ? 'high' : percent >= 65 ? 'medium' : 'low';
    const cellCount = 12;
    const cells = Array.from({ length: cellCount }, (_, index) => {
        const fill = Math.min(1, Math.max(0, used * cellCount / cap - index));
        return `<i${fill ? ` style="--charge:${100 * fill}%"` : ''}></i>`;
    }).join('');
    return `<div class="garage-power" id="garagePower" data-load="${load}">
        <div class="garage-power-title"><strong>Лимит мощности</strong><span class="garage-plate-mark" aria-hidden="true">CORE</span></div>
        <div class="garage-meter" role="meter" aria-label="Лимит мощности" aria-valuemin="0" aria-valuemax="${cap}" aria-valuenow="${used}">
            ${cells}</div>
        <div class="garage-power-detail">
            <div class="garage-power-readout">
                <span>${used} / ${cap} <small>ед.</small> <b class="garage-power-percent">${percent}%</b></span>
                ${price ? `<small title="Куплено модулей и суперов">Куплено · ${Math.min(need, count)}/${need}</small>` : '<small>Максимум</small>'}
            </div>
            ${price ? `<button type="button" class="btn-ship-action buy${affordable ? '' : ' cant-afford'}" data-garage-action="power" ${count < need ? 'disabled' : ''}><span class="garage-power-delta">+10</span>${xpPriceHTML(price)}</button>` : ''}
        </div>
    </div>`;
}

function garageCatalog(state, slot) {
    const isSuper = slot === 2;
    const open = slotOpen(state, slot);
    const gate = slotRequirement(state, slot);
    const items = isSuper ? SUPER_CATALOG : [...MODULE_BY_ID.values()];
    const installed = isSuper ? state.equippedSuper : state.equippedModules[slot];
    const owned = isSuper ? state.unlockedSupers : state.unlockedMasks;
    const unlockPrice = LOADOUT_SLOTS[slot].cost;
    const unlock = open ? '' : `<div class="ship-card garage-unlock"><strong>${garageEmblem('locked', 'unlock')} Слот закрыт</strong>
        ${gate ? `<small>${gate}</small>` : ''}
        <button type="button" class="btn-ship-action buy${gate || state.sparks < unlockPrice ? ' cant-afford' : ''}" data-garage-action="unlock" ${gate ? 'disabled' : ''}><span>Открыть</span>${xpPriceHTML(unlockPrice)}</button></div>`;
    const chargeHint = isSuper ? '<p class="garage-charge-hint">Собирайте синие искры. При 100% заряда супер срабатывает автоматически.</p>' : '';
    const modeLabels = { DRIVE: 'Драйв и скоростные секторы Экспедиции', CLEARANCE: 'Зачистка и боевые секторы Экспедиции',
        EXPEDITION: 'Только в режиме «Экспедиция»' };
    return unlock + chargeHint + items.map(item => {
        const other = !isSuper && item.id === state.equippedModules[1 - slot];
        const have = owned.includes(item.id), active = installed === item.id;
        const action = active ? 'remove' : have ? 'equip' : 'buy';
        const locked = !open || other || (!have && item.contractOnly);
        const label = active ? 'Снять' : other ? LOADOUT_SLOTS[1 - slot].name : have ? 'Установить'
            : item.contractOnly ? 'Контракт' : `<span>Купить</span>${xpPriceHTML(item.cost)}`;
        const style = active ? 'btn-ship-action equipped' : have ? 'btn-ship-action select'
            : item.contractOnly ? 'btn-equip-title lock'
            : `btn-ship-action buy${locked || state.sparks < item.cost ? ' cant-afford' : ''}`;
        return `<article class="ship-card garage-item${active ? ' selected' : ''}">
            <span class="garage-item-icon" aria-hidden="true">${garageEmblem(item.id, 'catalog-' + item.id)}</span>
            <div><h4>${item.name}</h4><p>${item.desc}${item.mode ? `<strong class="garage-item-mode">${modeLabels[item.mode]}</strong>` : ''}</p>
                <footer><small>[[xp:bolt]] ${item.power} ед.</small>
                <button type="button" class="${style}" data-garage-action="${action}" data-item="${item.id}" ${locked ? 'disabled' : ''}>${label}</button></footer>
            </div></article>`;
    }).join('');
}

defineNeonDriftGameMethods({
    renderUpgradeGarage() {
        const root = document.getElementById('upgradeGarage');
        const state = this.pass.state, slot = this.garageSlot;
        const selecting = Number.isInteger(slot);
        const inventory = document.getElementById('garageInventory');
        const position = inventory.scrollTop;
        const focused = root.contains(document.activeElement) ? document.activeElement.dataset : null;
        document.getElementById('garageBalance').textContent = state.sparks.toLocaleString('ru-RU');
        document.getElementById('garageControls').innerHTML = garageSlotRow(state, 0, slot) + garageSlotRow(state, 1, slot)
            + garagePowerBlock(state) + garageSlotRow(state, 2, slot);
        document.getElementById('garageDisplay').classList.toggle('hidden', selecting);
        document.getElementById('garageSelector').classList.toggle('hidden', !selecting);
        if (selecting) {
            document.getElementById('garageSelectionName').textContent = LOADOUT_SLOTS[slot].name;
            inventory.innerHTML = garageCatalog(state, slot);
            inventory.scrollTop = this.garagePreviousSlot === slot ? position : 0;
        } else {
            inventory.replaceChildren();
            document.getElementById('garageShipName').textContent = this.getActiveShipConfig().name;
        }
        this.garagePreviousSlot = slot;
        this.garagePose = null;
        if (focused?.item) root.querySelector(`button[data-item="${focused.item}"]`)?.focus({ preventScroll: true });
        else if (focused?.slot) root.querySelector(`button[data-slot="${focused.slot}"]`)?.focus({ preventScroll: true });
        else if (focused?.garageAction === 'power') root.querySelector('[data-garage-action="power"]')?.focus({ preventScroll: true });
    },

    showGarageFeedback(message, warning = false) {
        const status = document.getElementById('garageFeedback');
        const banner = document.createElement('div');
        banner.className = 'garage-feedback-banner';
        banner.dataset.tone = warning ? 'warning' : 'success';
        banner.append(createXpaceIconNode(warning ? 'warning' : 'check'), document.createTextNode(message));
        clearTimeout(this.garageFeedbackTimer);
        status.replaceChildren(banner);
        this.garageFeedbackTimer = setTimeout(() => banner.remove(), warning ? 4600 : 3300);
    },

    onGarageAction(event) {
        const button = event.target.closest('button[data-garage-action]');
        if (!button || button.disabled) return;
        const action = button.dataset.garageAction, slot = this.garageSlot;
        const status = document.getElementById('garageFeedback');
        status.textContent = '';
        if (action === 'shop') {
            this.garageSlot = null;
            this.activeShopTab = 'SHIPS';
            this.sound.playUiBack();
            this.renderHangarModal();
            document.getElementById('shopTabShips').focus();
            return;
        }
        if (action === 'slot' || action === 'back') {
            this.garageSlot = action === 'slot' ? Number(button.dataset.slot) : null;
            this.sound.playUiClick();
            this.renderUpgradeGarage();
            const target = action === 'slot' ? '[data-garage-action="back"]' : `[data-slot="${slot}"]`;
            document.querySelector('#upgradeGarage ' + target)?.focus();
            return;
        }
        const error = changeLoadout(this.pass.state, action, slot, button.dataset.item);
        if (error) {
            this.sound.playUiBack();
            this.showGarageFeedback(error, true);
            if (error.startsWith('Перегрузка')) {
                const block = document.getElementById('garagePower');
                block.classList.remove('overload');
                void block.offsetWidth;
                block.classList.add('overload');
            }
            return;
        }
        this.pass.triggerSave(true);
        this.updateAllUI();
        this.renderUpgradeGarage();
        if (['power', 'unlock', 'buy'].includes(action)) this.sound.playLevelUp();
        else this.sound.playUiClick();
        this.showGarageFeedback({ power: 'Лимит увеличен на 10 ед.', unlock: 'Слот открыт', buy: 'Добавлено в коллекцию', equip: 'Установлено', remove: 'Снято' }[action]);
        if (action === 'unlock') document.querySelector('#garageInventory button:not(:disabled)')?.focus({ preventScroll: true });
    },

    paintGarage(now) {
        const backdrop = document.getElementById('garageArchitecture');
        const root = backdrop.parentElement;
        if (!root.clientWidth || !root.clientHeight) return;
        const bay = root.querySelector('.garage-bay');
        const layout = bay.parentElement;
        const bayX = layout.offsetLeft + bay.offsetLeft;
        const bayY = layout.offsetTop + bay.offsetTop;
        const bayWidth = bay.clientWidth, bayHeight = bay.clientHeight;
        if (!bayWidth || !bayHeight) return;
        const width = root.clientWidth, height = Math.max(root.clientHeight, bayY + bayHeight);
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const geometry = [width, height, dpr, bayX, bayY, bayWidth, bayHeight].join('/');
        if (this.garageGeometry !== geometry) {
            backdrop.style.height = height + 'px';
            backdrop.width = Math.round(width * dpr);
            backdrop.height = Math.round(height * dpr);
            const ctx = backdrop.getContext('2d');
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const opening = paintGarageArchitecture(ctx, width, height, bayX, bayY, bayWidth, bayHeight);
            const windowCanvas = document.getElementById('garageWindow');
            windowCanvas.style.left = opening.x + 'px';
            windowCanvas.style.top = opening.y + 'px';
            windowCanvas.style.width = opening.width + 'px';
            windowCanvas.style.height = opening.height + 'px';
            windowCanvas.width = Math.ceil(opening.width * dpr);
            windowCanvas.height = Math.ceil(opening.height * dpr);

            const city = document.createElement('canvas');
            city.width = windowCanvas.width;
            city.height = windowCanvas.height;
            const cityCtx = city.getContext('2d');
            cityCtx.scale(city.width / opening.width, city.height / opening.height);
            this.paintDriveDistantCity(cityCtx, opening.width, opening.height);
            const windowCtx = windowCanvas.getContext('2d');
            windowCtx.setTransform(city.width / opening.width, 0, 0, city.height / opening.height, 0, 0);
            this.garageWindowView = { ...opening, city, ctx: windowCtx, time: null };
            this.garageGeometry = geometry;
        }

        const selecting = Number.isInteger(this.garageSlot);
        const view = this.garageWindowView;
        if (!selecting || view.time === null) {
            this.garageWindowStartedAt ??= now;
            const elapsed = (now - this.garageWindowStartedAt) / 1000;
            const time = detailedShipMotion.matches ? 0 : Math.floor(elapsed * 30) / 30;
            if (view.time !== time) {
                view.ctx.drawImage(view.city, 0, 0, view.width, view.height);
                this.garageMeteors ||= GARAGE_METEOR_PATHS.map((_, index) => makeGarageMeteor(index));
                paintGarageMeteors(view.ctx, view.width, view.height, time, this.garageMeteors);
                view.time = time;
            }
        }

        if (selecting) return;
        const canvas = document.getElementById('garageShip');
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (!w || !h) return;
        const resized = canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr);
        if (resized) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
        if (detailedShipMotion.matches && !resized && this.garagePose !== null) return;
        const t = detailedShipMotion.matches ? 1 : now / 1000;
        this.garagePose = t;
        const c = canvas.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, w, h);
        const x = w * 0.5, y = h * 0.66, radius = Math.min(w * 0.44, h * 0.46);
        const ship = this.getActiveShipConfig();
        const scale = Math.min(w / 92, h / 150, 3.8);
        const shipOffset = Math.sin(t * 0.52) * scale;
        paintDockPlatform(c, x, y, radius, t, ship.primary || '#84f5e7', shipOffset);
        paintGarageDust(c, w, h, t);
        c.save();
        c.translate(x + shipOffset, h * 0.36 + Math.sin(t * 1.4) * 1.6 * scale);
        c.scale(scale, scale);
        const tick = 120 + Math.floor(t / TRAIL_STEP);
        const points = this.garageTrail ||= Array.from({ length: 100 }, () => ({}));
        points.forEach((p, i) => {
            const age = (points.length - i - 1) * TRAIL_STEP;
            p.x = Math.sin(t * 1.1 - age * 3) * 2.4 * age;
            p.y = 14 + age * 14;
            p.life = TRAIL_LIFE - age;
            p.seq = tick - points.length + i;
        });
        this.drawEquippedPlayerTrail(c, this.resolveEffectiveTrailId(ship), points);
        this.drawShipShape(c, ship, t, 1, Math.sin(t * 0.65) * 0.12);
        c.restore();
    }
});
