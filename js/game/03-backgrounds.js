        // Resize, stars, city and 3D backgrounds
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            getTitleObj(titleId) {
                return PLAYER_TITLES.find(t => t.id === titleId) || PLAYER_TITLES[0];
            },

            renderTitleBadgeHtml(titleId) {
                const t = this.getTitleObj(titleId);
                const prefix = t.icon ? `${t.icon} ` : '';
                return `<span class="player-title-badge ${t.cssClass}">${prefix}${this.escapeHtml(t.name)}</span>`;
            },

            resize() {
                const parent = this.canvas.parentElement;
                const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
                this.width = Math.max(280, rect.width || window.innerWidth);
                this.height = Math.max(400, rect.height || window.innerHeight);
                this.canvas.width = Math.floor(this.width * this.dpr);
                this.canvas.height = Math.floor(this.height * this.dpr);
                this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

                if (this.state === 'MENU') {
                    this.player.x = this.width * 0.5;
                    this.player.y = this.height * 0.78;
                } else {
                    this.player.x = Math.max(24, Math.min(this.width - 24, this.player.x));
                    this.player.y = Math.max(82, Math.min(this.height - 32, this.player.y));
                }
            },

            initStars() {
                this.stars = [];
                for (let i = 0; i < 55; i++) {
                    this.stars.push({
                        x: Math.random() * this.width,
                        y: Math.random() * this.height,
                        size: Math.random() * 2 + 1,
                        speed: Math.random() * 90 + 40,
                        alpha: Math.random() * 0.6 + 0.2
                    });
                }
                this.initVhsCity();
            },

            initVhsCity() {
                const w = Math.max(320, this.width || 390);
                const h = Math.max(560, this.height || 844);
                const isMobile = w <= 768;
                const buildLayer = (count, minH, maxH, winChance) => {
                    const buildings = [];
                    const spanW = w * 1.35;
                    const step = spanW / count;
                    for (let i = 0; i < count; i++) {
                        const bw = Math.max(22, step * (0.72 + Math.random() * 0.36));
                        const bh = minH + Math.random() * (maxH - minH);
                        const bx = i * step - spanW * 0.15;
                        const hasSpire = Math.random() < 0.35;
                        const spireH = hasSpire ? (10 + Math.random() * 18) : 0;
                        const neonType = i % 3; // 0: cyan, 1: pink, 2: gold
                        const windows = [];
                        const cols = Math.max(2, Math.floor((bw - 8) / 7));
                        const rows = Math.max(3, Math.floor((bh - 14) / 10));
                        for (let r = 0; r < rows; r++) {
                            for (let c = 0; c < cols; c++) {
                                if (Math.random() < winChance) {
                                    windows.push({
                                        ox: 5 + c * 7,
                                        oy: 8 + r * 10,
                                        colType: (r + c + i) % 3,
                                        blinkOffset: Math.random() * Math.PI * 2
                                    });
                                }
                            }
                        }
                        buildings.push({ x: bx, w: bw, h: bh, spireH, neonType, windows });
                    }
                    return { buildings, spanW };
                };

                const backMin = isMobile ? h * 0.14 : h * 0.16;
                const backMax = isMobile ? h * 0.29 : h * 0.32;
                const frontMin = isMobile ? h * 0.09 : h * 0.11;
                const frontMax = isMobile ? h * 0.21 : h * 0.23;

                this.vhsCityBack = buildLayer(isMobile ? 12 : 18, backMin, backMax, 0.28);
                this.vhsCityFront = buildLayer(isMobile ? 10 : 16, frontMin, frontMax, 0.42);
            },

            getVhsStaticLayers(w, h, isMobile, isClearance, isOverdrive, isSlowmo, horizonY) {
                const key = `${w}x${h}_${isClearance ? 1 : 0}_${isOverdrive ? 1 : 0}_${isSlowmo ? 1 : 0}`;
                if (this._vhsCache && this._vhsCache.key === key) {
                    return this._vhsCache;
                }

                // Слой 1: Небо, синтвейв-солнце и пол (рисуется 1 раз при смене состояния)
                const baseCanvas = document.createElement('canvas');
                baseCanvas.width = w;
                baseCanvas.height = h;
                const bCtx = baseCanvas.getContext('2d');

                const skyGrad = bCtx.createLinearGradient(0, 0, 0, horizonY);
                if (isOverdrive) {
                    skyGrad.addColorStop(0, '#120326');
                    skyGrad.addColorStop(0.55, '#420952');
                    skyGrad.addColorStop(1, '#7a1258');
                } else if (isClearance) {
                    skyGrad.addColorStop(0, '#090114');
                    skyGrad.addColorStop(0.52, '#2b0536');
                    skyGrad.addColorStop(1, '#59083c');
                } else {
                    skyGrad.addColorStop(0, '#070116');
                    skyGrad.addColorStop(0.54, '#1e0542');
                    skyGrad.addColorStop(1, '#4d0959');
                }
                bCtx.fillStyle = skyGrad;
                bCtx.fillRect(0, 0, w, horizonY);

                // Синтвейв-солнце VHS
                const sunR = Math.min(w * (isMobile ? 0.27 : 0.17), 135);
                const sunX = w * 0.5;
                const sunY = horizonY - sunR * 0.42;

                bCtx.save();
                const sunGlow = bCtx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 1.75);
                if (isClearance) {
                    sunGlow.addColorStop(0, 'rgba(255, 10, 120, 0.34)');
                    sunGlow.addColorStop(0.6, 'rgba(181, 23, 158, 0.12)');
                    sunGlow.addColorStop(1, 'rgba(181, 23, 158, 0)');
                } else {
                    sunGlow.addColorStop(0, 'rgba(255, 79, 139, 0.32)');
                    sunGlow.addColorStop(0.6, 'rgba(114, 9, 183, 0.12)');
                    sunGlow.addColorStop(1, 'rgba(114, 9, 183, 0)');
                }
                bCtx.fillStyle = sunGlow;
                bCtx.beginPath();
                bCtx.arc(sunX, sunY, sunR * 1.75, 0, Math.PI * 2);
                bCtx.fill();

                bCtx.beginPath();
                bCtx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
                bCtx.clip();

                const sunGrad = bCtx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
                if (isClearance) {
                    sunGrad.addColorStop(0, '#ffd60a');
                    sunGrad.addColorStop(0.45, '#ff5400');
                    sunGrad.addColorStop(1, '#ff0a78');
                } else {
                    sunGrad.addColorStop(0, '#fff3a0');
                    sunGrad.addColorStop(0.35, '#ffbe0b');
                    sunGrad.addColorStop(0.72, '#ff0a78');
                    sunGrad.addColorStop(1, '#7209b7');
                }
                bCtx.fillStyle = sunGrad;
                bCtx.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);

                bCtx.fillStyle = isClearance ? '#2b0536' : '#1e0542';
                const stripeStart = sunY + sunR * 0.04;
                for (let i = 0; i < 6; i++) {
                    const sy = stripeStart + i * (sunR * 0.155);
                    const sh = 2 + i * 1.35;
                    bCtx.fillRect(sunX - sunR, sy, sunR * 2, sh);
                }
                bCtx.restore();

                // Нижняя часть: градиент пола + перспективные лучи сетки
                const floorGrad = bCtx.createLinearGradient(0, horizonY, 0, h);
                if (isClearance) {
                    floorGrad.addColorStop(0, '#22042e');
                    floorGrad.addColorStop(0.45, '#10021c');
                    floorGrad.addColorStop(1, '#060110');
                } else {
                    floorGrad.addColorStop(0, '#1c0438');
                    floorGrad.addColorStop(0.45, '#0d0221');
                    floorGrad.addColorStop(1, '#050112');
                }
                bCtx.fillStyle = floorGrad;
                bCtx.fillRect(0, horizonY, w, h - horizonY);

                const gridAlpha = isOverdrive ? 0.24 : (isSlowmo ? 0.2 : 0.16);
                bCtx.strokeStyle = isOverdrive
                    ? `rgba(255, 214, 10, ${gridAlpha})`
                    : (isClearance ? `rgba(255, 10, 120, ${gridAlpha})` : `rgba(0, 245, 212, ${gridAlpha})`);
                bCtx.lineWidth = 1.2;

                const vanishX = w * 0.5;
                const rayCount = isMobile ? 8 : 15;
                const spread = w * (isMobile ? 1.55 : 1.35);
                bCtx.beginPath();
                for (let i = -rayCount; i <= rayCount; i++) {
                    const bottomX = vanishX + (i / rayCount) * spread;
                    bCtx.moveTo(vanishX, horizonY);
                    bCtx.lineTo(bottomX, h);
                }
                bCtx.stroke();

                // Слой 2: Передние пальмы по краям экрана и ретро-штамп
                const fgCanvas = document.createElement('canvas');
                fgCanvas.width = w;
                fgCanvas.height = h;
                const fCtx = fgCanvas.getContext('2d');

                const horizonLineCol = isOverdrive ? '#ffd60a' : (isClearance ? '#ff0a78' : '#00f5d4');
                fCtx.fillStyle = horizonLineCol;
                fCtx.fillRect(0, horizonY - 1, w, 2);

                const drawNeonPalm = (px, py, scale, flip) => {
                    fCtx.save();
                    fCtx.translate(px, py);
                    fCtx.scale(flip * scale, scale);
                    fCtx.fillStyle = '#05000e';
                    fCtx.strokeStyle = isClearance ? 'rgba(255, 10, 120, 0.45)' : 'rgba(0, 245, 212, 0.45)';
                    fCtx.lineWidth = 1.3;

                    fCtx.beginPath();
                    fCtx.moveTo(-5, 0);
                    fCtx.quadraticCurveTo(6, -55, -4, -110);
                    fCtx.lineTo(3, -110);
                    fCtx.quadraticCurveTo(14, -55, 5, 0);
                    fCtx.closePath();
                    fCtx.fill();
                    fCtx.stroke();

                    const fronds = [
                        [-2, -108, -36, -124, -52, -98],
                        [-1, -110, -40, -142, -56, -126],
                        [0, -112, -20, -154, -36, -146],
                        [1, -112, 22, -152, 38, -142],
                        [2, -110, 42, -136, 56, -118],
                        [2, -108, 36, -116, 50, -94]
                    ];
                    fronds.forEach(([x0, y0, cx1, cy1, x1, y1]) => {
                        fCtx.beginPath();
                        fCtx.moveTo(x0, y0);
                        fCtx.quadraticCurveTo(cx1, cy1, x1, y1);
                        fCtx.quadraticCurveTo(cx1 * 0.65, cy1 + 10, x0, y0 + 3);
                        fCtx.closePath();
                        fCtx.fill();
                        fCtx.stroke();
                    });
                    fCtx.restore();
                };

                const palmScale = isMobile ? 0.78 : 1.05;
                drawNeonPalm(isMobile ? 8 : 22, horizonY + 8, palmScale, 1);
                drawNeonPalm(w - (isMobile ? 8 : 22), horizonY + 8, palmScale, -1);

                fCtx.font = '700 9px "Exo 2", sans-serif';
                fCtx.fillStyle = isClearance ? 'rgba(255, 112, 217, 0.28)' : 'rgba(0, 245, 212, 0.26)';
                fCtx.textAlign = 'left';
                fCtx.fillText(isClearance ? 'VHS // SECTOR-02 CLEARANCE' : 'VHS // MIAMI-89 DRIVE', 12, h - 12);

                this._vhsCache = { key, baseCanvas, fgCanvas };
                return this._vhsCache;
            },

            initClearanceBackdrop() {
                const w = Math.max(320, this.width || 400);
                const h = Math.max(480, this.height || 700);
                this.clearanceAsteroids = [];
                for (let i = 0; i < 14; i++) {
                    const pts = [];
                    const sides = 7 + (i % 4);
                    for (let k = 0; k < sides; k++) {
                        const a = (Math.PI * 2 * k) / sides;
                        const r = 0.72 + ((i * 17 + k * 29) % 28) / 100;
                        pts.push({ c: Math.cos(a) * r, s: Math.sin(a) * r });
                    }
                    this.clearanceAsteroids.push({
                        x: Math.random() * w,
                        y: Math.random() * h,
                        radius: 10 + (i % 5) * 7,
                        speedY: 16 + (i % 4) * 9,
                        rot: Math.random() * Math.PI * 2,
                        rotSpeed: (i % 2 === 0 ? 1 : -1) * (0.12 + (i % 3) * 0.08),
                        alpha: 0.14 + (i % 4) * 0.045,
                        pts
                    });
                }
            },

            getClearanceStaticLayers(w, h, isMobile, isOverdrive, isSlowmo) {
                const key = `clr_${w}x${h}_${isOverdrive ? 1 : 0}_${isSlowmo ? 1 : 0}`;
                if (this._clearanceBgCache && this._clearanceBgCache.key === key) {
                    return this._clearanceBgCache;
                }

                const baseCanvas = document.createElement('canvas');
                baseCanvas.width = w;
                baseCanvas.height = h;
                const bCtx = baseCanvas.getContext('2d');

                // Глубокий космос — тёмный индиго-графитовый градиент
                const spaceGrad = bCtx.createLinearGradient(0, 0, 0, h);
                if (isOverdrive) {
                    spaceGrad.addColorStop(0, '#090318');
                    spaceGrad.addColorStop(0.5, '#1d0836');
                    spaceGrad.addColorStop(1, '#2d0938');
                } else if (isSlowmo) {
                    spaceGrad.addColorStop(0, '#020b14');
                    spaceGrad.addColorStop(0.55, '#06202e');
                    spaceGrad.addColorStop(1, '#04121c');
                } else {
                    spaceGrad.addColorStop(0, '#030510');
                    spaceGrad.addColorStop(0.48, '#081029');
                    spaceGrad.addColorStop(1, '#0c0720');
                }
                bCtx.fillStyle = spaceGrad;
                bCtx.fillRect(0, 0, w, h);

                // Космические туманности (Nebula clouds)
                const neb1 = bCtx.createRadialGradient(w * 0.22, h * 0.24, 10, w * 0.22, h * 0.24, w * 0.55);
                neb1.addColorStop(0, isOverdrive ? 'rgba(255, 214, 10, 0.16)' : 'rgba(255, 10, 120, 0.16)');
                neb1.addColorStop(0.55, 'rgba(114, 9, 183, 0.08)');
                neb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
                bCtx.fillStyle = neb1;
                bCtx.fillRect(0, 0, w, h);

                const neb2 = bCtx.createRadialGradient(w * 0.82, h * 0.62, 10, w * 0.82, h * 0.62, w * 0.6);
                neb2.addColorStop(0, isSlowmo ? 'rgba(74, 222, 128, 0.16)' : 'rgba(0, 245, 212, 0.14)');
                neb2.addColorStop(0.6, 'rgba(30, 58, 138, 0.08)');
                neb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
                bCtx.fillStyle = neb2;
                bCtx.fillRect(0, 0, w, h);

                // Тонкая тактическая координатная сетка орбитального сектора
                bCtx.strokeStyle = isOverdrive
                    ? 'rgba(255, 214, 10, 0.07)'
                    : (isSlowmo ? 'rgba(74, 222, 128, 0.07)' : 'rgba(0, 245, 212, 0.06)');
                bCtx.lineWidth = 1;
                const cell = isMobile ? 48 : 64;
                bCtx.beginPath();
                for (let gx = cell; gx < w; gx += cell) {
                    bCtx.moveTo(gx, 0);
                    bCtx.lineTo(gx, h);
                }
                for (let gy = cell; gy < h; gy += cell) {
                    bCtx.moveTo(0, gy);
                    bCtx.lineTo(w, gy);
                }
                bCtx.stroke();

                // Огромная окольцованная планета / кибер-станция на дальнем плане
                const planetR = Math.min(w * (isMobile ? 0.34 : 0.24), 175);
                const px = w * 0.76;
                const py = h * 0.23;

                bCtx.save();
                const pHalo = bCtx.createRadialGradient(px, py, planetR * 0.7, px, py, planetR * 1.65);
                pHalo.addColorStop(0, isOverdrive ? 'rgba(255, 214, 10, 0.22)' : 'rgba(0, 245, 212, 0.18)');
                pHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
                bCtx.fillStyle = pHalo;
                bCtx.beginPath();
                bCtx.arc(px, py, planetR * 1.65, 0, Math.PI * 2);
                bCtx.fill();

                // Тело планеты
                bCtx.save();
                bCtx.beginPath();
                bCtx.arc(px, py, planetR, 0, Math.PI * 2);
                bCtx.clip();

                const pGrad = bCtx.createLinearGradient(px - planetR, py - planetR, px + planetR, py + planetR);
                pGrad.addColorStop(0, '#1e1b4b');
                pGrad.addColorStop(0.5, '#111827');
                pGrad.addColorStop(1, '#040714');
                bCtx.fillStyle = pGrad;
                bCtx.fillRect(px - planetR, py - planetR, planetR * 2, planetR * 2);

                // Атмосферные полосы планеты
                bCtx.fillStyle = isOverdrive ? 'rgba(255, 214, 10, 0.12)' : 'rgba(255, 10, 120, 0.12)';
                for (let band = -3; band <= 3; band++) {
                    bCtx.fillRect(px - planetR, py + band * (planetR * 0.24), planetR * 2, planetR * 0.08);
                }
                // Неоновый серп освещения
                bCtx.strokeStyle = isOverdrive ? 'rgba(255, 214, 10, 0.55)' : 'rgba(0, 245, 212, 0.48)';
                bCtx.lineWidth = 2.5;
                bCtx.beginPath();
                bCtx.arc(px, py, planetR - 1.5, Math.PI * 0.72, Math.PI * 1.68);
                bCtx.stroke();
                bCtx.restore();

                // Планетарные кольца под углом
                bCtx.translate(px, py);
                bCtx.rotate(-0.34);
                bCtx.strokeStyle = isOverdrive ? 'rgba(255, 214, 10, 0.34)' : 'rgba(255, 10, 120, 0.34)';
                bCtx.lineWidth = 3;
                bCtx.beginPath();
                bCtx.ellipse(0, 0, planetR * 1.78, planetR * 0.36, 0, 0, Math.PI * 2);
                bCtx.stroke();

                bCtx.strokeStyle = 'rgba(0, 245, 212, 0.28)';
                bCtx.lineWidth = 1.5;
                bCtx.beginPath();
                bCtx.ellipse(0, 0, planetR * 2.02, planetR * 0.43, 0, 0, Math.PI * 2);
                bCtx.stroke();
                bCtx.restore();

                // Маркировка сектора внизу
                bCtx.font = '700 9px "Exo 2", sans-serif';
                bCtx.fillStyle = isOverdrive ? 'rgba(255, 214, 10, 0.32)' : 'rgba(0, 245, 212, 0.28)';
                bCtx.textAlign = 'left';
                bCtx.fillText('ORBITAL SECTOR-02 // CLEARANCE', 12, h - 12);

                this._clearanceBgCache = { key, baseCanvas };
                return this._clearanceBgCache;
            },

            drawClearanceSpaceBackground(ctx) {
                const w = this.width;
                const h = this.height;
                const isMobile = this.isMobileDevice ? this.isMobileDevice() : (w <= 768);
                const isOverdrive = this.overdriveActive;
                const isSlowmo = this.slowmoTimer > 0;

                const cache = this.getClearanceStaticLayers(w, h, isMobile, isOverdrive, isSlowmo);
                ctx.drawImage(cache.baseCanvas, 0, 0);

                // Глубокое звёздное поле по всей высоте экрана
                for (let i = 0; i < this.stars.length; i++) {
                    const s = this.stars[i];
                    ctx.fillStyle = i % 5 === 0
                        ? 'rgba(0, 245, 212, 0.8)'
                        : (i % 7 === 0 ? 'rgba(255, 112, 217, 0.75)' : 'rgba(235, 246, 255, 0.72)');
                    ctx.fillRect(s.x, s.y, s.size, s.size);
                }

                // Орбитальный радарный сканер вокруг планеты
                const px = w * 0.76;
                const py = h * 0.23;
                const planetR = Math.min(w * (isMobile ? 0.34 : 0.24), 175);
                const pulsePhase = (this.runTime * 0.45) % 1;
                ctx.save();
                ctx.strokeStyle = isOverdrive
                    ? `rgba(255, 214, 10, ${(1 - pulsePhase) * 0.26})`
                    : `rgba(0, 245, 212, ${(1 - pulsePhase) * 0.24})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(px, py, planetR * (1.05 + pulsePhase * 0.9), 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();

                // Дальний слой дрейфующих силуэтов астероидов (параллакс)
                if (!this.clearanceAsteroids) this.initClearanceBackdrop();
                const speedMult = isOverdrive ? 2.1 : (isSlowmo ? 0.45 : 1.0);
                for (let i = 0; i < this.clearanceAsteroids.length; i++) {
                    const ast = this.clearanceAsteroids[i];
                    const ay = (ast.y + this.runTime * ast.speedY * speedMult) % (h + 80) - 40;
                    const ax = ast.x % (w + 40);
                    const ang = ast.rot + this.runTime * ast.rotSpeed;

                    ctx.save();
                    ctx.translate(ax, ay);
                    ctx.rotate(ang);
                    ctx.fillStyle = `rgba(15, 23, 52, ${Math.min(0.65, ast.alpha * 2.4)})`;
                    ctx.strokeStyle = isOverdrive
                        ? `rgba(255, 214, 10, ${ast.alpha})`
                        : `rgba(125, 211, 252, ${ast.alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    for (let k = 0; k < ast.pts.length; k++) {
                        const vx = ast.pts[k].c * ast.radius;
                        const vy = ast.pts[k].s * ast.radius;
                        if (k === 0) ctx.moveTo(vx, vy);
                        else ctx.lineTo(vx, vy);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                }

                // Мягкие лучи орбитальных прожекторов снизу
                const beamA = Math.sin(this.runTime * 0.75) * 0.28 - 0.18;
                const beamB = Math.cos(this.runTime * 0.62) * 0.28 + 0.18;
                [
                    { bx: w * 0.24, ang: beamA, col: 'rgba(0, 245, 212, 0.05)' },
                    { bx: w * 0.76, ang: beamB, col: 'rgba(255, 10, 120, 0.05)' }
                ].forEach(b => {
                    ctx.save();
                    ctx.translate(b.bx, h);
                    ctx.rotate(b.ang);
                    ctx.fillStyle = b.col;
                    ctx.beginPath();
                    ctx.moveTo(-8, 0);
                    ctx.lineTo(8, 0);
                    ctx.lineTo(68, -h * 0.95);
                    ctx.lineTo(-68, -h * 0.95);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                });
            },

            drawVhsCityBackground(ctx) {
                const w = this.width;
                const h = this.height;
                const isMobile = this.isMobileDevice ? this.isMobileDevice() : (w <= 768);
                const isClearance = this.gameMode === 'CLEARANCE';
                const isOverdrive = this.overdriveActive;
                const isSlowmo = this.slowmoTimer > 0;
                const horizonY = Math.round(h * (isMobile ? 0.64 : 0.66));

                const cache = this.getVhsStaticLayers(w, h, isMobile, isClearance, isOverdrive, isSlowmo, horizonY);
                ctx.drawImage(cache.baseCanvas, 0, 0);

                // Звёзды в верхней части неба
                ctx.fillStyle = 'rgba(225, 242, 255, 0.65)';
                for (let i = 0; i < this.stars.length; i++) {
                    const s = this.stars[i];
                    if (s.y < horizonY * 0.92) {
                        ctx.fillRect(s.x, s.y, s.size, s.size);
                    }
                }

                // Прожекторы ПВО в режиме Зачистка
                if (isClearance) {
                    const beamAngle1 = Math.sin(this.runTime * 0.85) * 0.35 - 0.25;
                    const beamAngle2 = Math.cos(this.runTime * 0.7) * 0.35 + 0.25;
                    [
                        { bx: w * 0.22, ang: beamAngle1, col: 'rgba(255, 10, 120, 0.07)' },
                        { bx: w * 0.78, ang: beamAngle2, col: 'rgba(0, 245, 212, 0.06)' }
                    ].forEach(b => {
                        ctx.save();
                        ctx.translate(b.bx, horizonY);
                        ctx.rotate(b.ang);
                        ctx.fillStyle = b.col;
                        ctx.beginPath();
                        ctx.moveTo(-6, 0);
                        ctx.lineTo(6, 0);
                        ctx.lineTo(54, -horizonY * 1.1);
                        ctx.lineTo(-54, -horizonY * 1.1);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    });
                }

                // Двухслойный неоновый город VHS (Skyline)
                if (!this.vhsCityBack || !this.vhsCityFront) this.initVhsCity();

                const drawSkylineLayer = (layer, scrollSpeed, bodyColor, alphaMult, isFront) => {
                    const shift = (this.runTime * scrollSpeed) % layer.spanW;
                    const primaryNeon = isOverdrive ? '#ffd60a' : (isClearance ? '#ff0a78' : '#00f5d4');
                    const secondaryNeon = isClearance ? '#ffbe0b' : '#ff0a78';
                    const tertiaryNeon = isSlowmo ? '#4ade80' : '#c084fc';

                    for (let idx = 0; idx < layer.buildings.length; idx++) {
                        const b = layer.buildings[idx];
                        let bx = b.x - shift;
                        if (bx + b.w < -40) bx += layer.spanW;
                        if (bx > w + 40) continue;
                        const by = horizonY - b.h;

                        ctx.fillStyle = bodyColor;
                        ctx.fillRect(bx, by, b.w, b.h + 2);

                        const edgeCol = b.neonType === 0 ? primaryNeon : (b.neonType === 1 ? secondaryNeon : tertiaryNeon);
                        ctx.fillStyle = edgeCol;
                        ctx.globalAlpha = isFront ? 0.78 : 0.42;
                        ctx.fillRect(bx, by, b.w, isFront ? 2 : 1.5);
                        ctx.fillRect(bx, by, 1.5, b.h);

                        if (b.spireH > 0) {
                            const sx = bx + b.w * 0.5;
                            ctx.fillRect(sx - 1, by - b.spireH, 2, b.spireH);
                            ctx.globalAlpha = isFront ? 0.85 : 0.5;
                            ctx.fillStyle = secondaryNeon;
                            ctx.fillRect(sx - 2, by - b.spireH - 3, 4, 4);
                        }

                        ctx.globalAlpha = (isFront ? 0.52 : 0.28) * alphaMult;
                        for (let wi = 0; wi < b.windows.length; wi++) {
                            const win = b.windows[wi];
                            ctx.fillStyle = win.colType === 0 ? primaryNeon : (win.colType === 1 ? secondaryNeon : '#ffd60a');
                            ctx.fillRect(bx + win.ox, by + win.oy, 3.5, 4.5);
                        }
                    }
                    ctx.globalAlpha = 1;
                };

                drawSkylineLayer(this.vhsCityBack, 7, '#0f0324', 0.75, false);
                drawSkylineLayer(this.vhsCityFront, 15, '#080114', 1.0, true);

                // Бегущие горизонтальные линии перспективной VHS-сетки
                const gridAlpha = isOverdrive ? 0.24 : (isSlowmo ? 0.2 : 0.16);
                ctx.strokeStyle = isOverdrive
                    ? `rgba(255, 214, 10, ${gridAlpha})`
                    : (isClearance ? `rgba(255, 10, 120, ${gridAlpha})` : `rgba(0, 245, 212, ${gridAlpha})`);
                ctx.lineWidth = 1.2;

                const floorH = Math.max(1, h - horizonY);
                const speedMult = isOverdrive ? 2.1 : (isSlowmo ? 0.52 : 1.0);
                const scrollPhase = (this.runTime * 0.72 * speedMult) % 1;
                const hLines = isMobile ? 8 : 11;
                ctx.beginPath();
                for (let i = 0; i < hLines; i++) {
                    const t = (i + scrollPhase) / hLines;
                    const y = horizonY + Math.pow(t, 1.75) * floorH;
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                }
                ctx.stroke();

                // Пальмы и линия горизонта из кэша
                ctx.drawImage(cache.fgCanvas, 0, 0);
            },

            /* ================= НОВЫЙ 3D-ФОН РЕЖИМА «ДРАЙВ»: НЕОНОВОЕ ШОССЕ В РЕАЛЬНОЙ ПЕРСПЕКТИВЕ ================= */
            initDrive3DWorld() {
                let seed = 20261120;
                const rand = () => {
                    seed = (seed * 1664525 + 1013904223) % 4294967296;
                    return seed / 4294967296;
                };
                const SEG = 96000, DISTRICT_LEN = SEG / 4;
                const districts = [
                    { name: 'NEON CENTRAL', tint: '#7a156d', accents: ['#00f5d4', '#ff0a78', '#c084fc', '#ffbe0b'] },
                    { name: 'OCEAN DRIVE', tint: '#075a78', accents: ['#4dd7ff', '#ffd166', '#ff70d9', '#7bed9f'] },
                    { name: 'OLD TOWN', tint: '#78351d', accents: ['#ffbe0b', '#ff8c66', '#ffdca8', '#4dd7ff'] },
                    { name: 'IRON DISTRICT', tint: '#273d46', accents: ['#f97316', '#facc15', '#94a3b8', '#ff5d5d'] }
                ];
                const facades = [
                    ['#160a30', '#111c3e', '#251043', '#10182d'],
                    ['#17405a', '#27445c', '#493553', '#15505a'],
                    ['#542a2a', '#493329', '#623a26', '#343345'],
                    ['#293038', '#3b3330', '#23363c', '#383b32']
                ];
                const sides = [
                    ['#0b041f', '#090d24', '#120724', '#080d1c'],
                    ['#0c2839', '#172b3a', '#2a2039', '#0c3035'],
                    ['#321b20', '#2d211d', '#3a241a', '#20202e'],
                    ['#1a2026', '#27221f', '#16262b', '#252720']
                ];
                const signs = ['XPACE', 'TURBO', 'MOTEL', 'CAFE', 'NITRO', '24H', 'ARCADE', 'HOTEL'];
                const buildings = [];
                const count = 128;
                for (let i = 0; i < count; i++) {
                    const side = (i % 2 === 0) ? -1 : 1;
                    const z = ((i / count) * SEG + rand() * 360) % SEG;
                    const district = Math.floor(z / DISTRICT_LEN);
                    const r = rand();
                    const kind = district === 0 ? (r < 0.72 ? 'tower' : 'shop')
                        : district === 1 ? (r < 0.38 ? 'hotel' : 'motel')
                        : district === 2 ? (r < 0.64 ? 'shop' : 'house')
                        : (r < 0.7 ? 'warehouse' : 'factory');
                    const minH = [1400, 650, 850, 700][district];
                    const rangeH = [4400, 1400, 1700, 1300][district];
                    const w = district === 3 ? 1500 + rand() * 2100 : 750 + rand() * 1500;
                    buildings.push({
                        z, district, kind,
                        x: side * ((district === 3 ? 3100 : 2200) + rand() * (district === 2 ? 3600 : 5600)),
                        w,
                        d: kind === 'warehouse' ? 1500 + rand() * 1900 : 900 + rand() * 1500,
                        h: minH + rand() * rangeH * (kind === 'hotel' && rand() < 0.22 ? 1.65 : 1),
                        neon: Math.floor(rand() * 4),
                        facade: facades[district][Math.floor(rand() * facades[district].length)],
                        sideCol: sides[district][Math.floor(rand() * sides[district].length)],
                        roofCol: district === 2 ? '#572d32' : (district === 1 ? '#244657' : '#171426'),
                        winCols: kind === 'warehouse' ? 3 : 2 + Math.floor(rand() * 5),
                        winRows: kind === 'warehouse' ? 2 : Math.max(3, Math.min(12, Math.floor((minH + rangeH) / 500) + Math.floor(rand() * 4))),
                        winSeed: Math.floor(rand() * 997),
                        sign: (kind === 'shop' || kind === 'motel' || kind === 'hotel' || rand() < 0.24) ? signs[Math.floor(rand() * signs.length)] : '',
                        roofH: 300 + rand() * 300,
                        blink: rand() * Math.PI * 2
                    });
                }

                // Придорожные объекты меняются вместе с районом: пальмы, деревья, вывески и цистерны.
                const props = [];
                for (let i = 0; i < 180; i++) {
                    const z = ((i / 180) * SEG + rand() * 420) % SEG;
                    const district = Math.floor(z / DISTRICT_LEN);
                    const side = i % 2 === 0 ? -1 : 1;
                    const r = rand();
                    const kind = district === 0 ? (r < 0.45 ? 'billboard' : 'tree')
                        : district === 1 ? (r < 0.82 ? 'palm' : 'billboard')
                        : district === 2 ? (r < 0.78 ? 'tree' : 'billboard')
                        : (r < 0.48 ? 'tank' : (r < 0.78 ? 'stack' : 'billboard'));
                    props.push({
                        z, district, kind,
                        x: side * ((kind === 'tank' || kind === 'stack' ? 3400 : 2050) + rand() * (kind === 'tank' ? 3600 : 1250)),
                        w: kind === 'tank' ? 900 + rand() * 700 : 500 + rand() * 450,
                        h: kind === 'palm' ? 900 + rand() * 500 : (kind === 'tree' ? 650 + rand() * 550 : (kind === 'stack' ? 1700 + rand() * 1500 : 850 + rand() * 650)),
                        label: signs[Math.floor(rand() * signs.length)],
                        phase: rand() * Math.PI * 2,
                        accent: Math.floor(rand() * 4)
                    });
                }

                // Трафик на шоссе: попутные машины (едут вперёд) и встречки (летят на камеру)
                const cars = [];
                const CAR_SEG = 9000;
                const carBodyCols = ['#ff5d5d', '#4dd7ff', '#ffd166', '#ff70d9', '#7bed9f', '#e8e6f0'];
                const carGlowCols = ['#00f5d4', '#ff0a78', '#c084fc', '#ffd60a'];
                for (let i = 0; i < 16; i++) {
                    const oncoming = i % 3 === 0;
                    cars.push({
                        dir: oncoming ? -1 : 1,
                        x: oncoming ? -(760 + rand() * 480) : (rand() < 0.5 ? (rand() * 340 - 170) : (820 + rand() * 430)),
                        seg: CAR_SEG + i * 701,
                        z: ((i * 0.61803) % 1) * (CAR_SEG + i * 701),
                        v: oncoming ? 2600 + rand() * 1500 : 2400 + rand() * 1700,
                        cw: 240 + rand() * 90,
                        ch: 170 + rand() * 80,
                        cd: 460 + rand() * 240,
                        col: carBodyCols[Math.floor(rand() * carBodyCols.length)],
                        glow: carGlowCols[Math.floor(rand() * carGlowCols.length)]
                    });
                }

                this.drive3D = { SEG, DISTRICT_LEN, districts, buildings, props, cars };
            },

            getDrive3DSkyLayers(w, h, horizonY, isOverdrive, isSlowmo) {
                const key = `d3dsky_${w}x${h}_${isOverdrive ? 1 : 0}_${isSlowmo ? 1 : 0}`;
                if (this._drive3DSkyCache && this._drive3DSkyCache.key === key) return this._drive3DSkyCache.canvas;

                const skyCanvas = document.createElement('canvas');
                skyCanvas.width = w;
                skyCanvas.height = h;
                const c = skyCanvas.getContext('2d');

                const skyGrad = c.createLinearGradient(0, 0, 0, horizonY);
                if (isOverdrive) {
                    skyGrad.addColorStop(0, '#1b0233');
                    skyGrad.addColorStop(0.55, '#570a4e');
                    skyGrad.addColorStop(1, '#c22a6d');
                } else if (isSlowmo) {
                    skyGrad.addColorStop(0, '#020817');
                    skyGrad.addColorStop(0.55, '#0b2138');
                    skyGrad.addColorStop(1, '#12496b');
                } else {
                    skyGrad.addColorStop(0, '#05010f');
                    skyGrad.addColorStop(0.5, '#160b3f');
                    skyGrad.addColorStop(1, '#4a1063');
                }
                c.fillStyle = skyGrad;
                c.fillRect(0, 0, w, horizonY + 2);

                // Звёздное небо
                let sSeed = 7717;
                const sRand = () => { sSeed = (sSeed * 1103515245 + 12345) % 2147483648; return sSeed / 2147483648; };
                const starCount = Math.max(30, Math.floor(w / 9));
                for (let i = 0; i < starCount; i++) {
                    const sx = sRand() * w;
                    const sy = sRand() * horizonY * 0.86;
                    const sr = sRand() * 1.4 + 0.4;
                    c.fillStyle = `rgba(226, 242, 255, ${0.22 + sRand() * 0.5})`;
                    c.fillRect(sx, sy, sr, sr);
                }

                // Синтвейв-солнце точно в точке схода шоссе
                const sunR = Math.min(w * 0.21, 150);
                const sunX = w * 0.5;
                const sunY = horizonY - sunR * 0.3;
                const glowCol = isOverdrive ? '255, 170, 40' : (isSlowmo ? '60, 220, 190' : '255, 60, 140');
                const glow = c.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 2.2);
                glow.addColorStop(0, `rgba(${glowCol}, 0.5)`);
                glow.addColorStop(1, `rgba(${glowCol}, 0)`);
                c.fillStyle = glow;
                c.fillRect(sunX - sunR * 2.2, sunY - sunR * 2.2, sunR * 4.4, sunR * 4.4);

                c.save();
                c.beginPath();
                c.arc(sunX, sunY, sunR, 0, Math.PI * 2);
                c.clip();
                const sunGrad = c.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
                if (isOverdrive) {
                    sunGrad.addColorStop(0, '#fff7c2');
                    sunGrad.addColorStop(0.5, '#ffb703');
                    sunGrad.addColorStop(1, '#ff2a85');
                } else {
                    sunGrad.addColorStop(0, '#fff3a0');
                    sunGrad.addColorStop(0.4, '#ff9f1c');
                    sunGrad.addColorStop(0.75, '#ff0a78');
                    sunGrad.addColorStop(1, '#7209b7');
                }
                c.fillStyle = sunGrad;
                c.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);
                c.fillStyle = isOverdrive ? '#3c0640' : (isSlowmo ? '#04121f' : '#170436');
                for (let i = 0; i < 5; i++) {
                    const stripeY = sunY + sunR * (i * 0.17 - 0.02);
                    c.fillRect(sunX - sunR, stripeY, sunR * 2, 2 + i * 1.6);
                }
                c.restore();

                // Дымка над горизонтом
                const hazeCol = isOverdrive ? '255, 214, 10' : (isSlowmo ? '74, 222, 128' : '0, 245, 212');
                const haze = c.createLinearGradient(0, horizonY - 46, 0, horizonY + 6);
                haze.addColorStop(0, `rgba(${hazeCol}, 0)`);
                haze.addColorStop(1, `rgba(${hazeCol}, 0.28)`);
                c.fillStyle = haze;
                c.fillRect(0, horizonY - 46, w, 52);

                this._drive3DSkyCache = { key, canvas: skyCanvas };
                return skyCanvas;
            },

            drawDrive3DBackground(ctx) {
                const w = this.width, h = this.height;
                const isMobile = this.isMobileDevice ? this.isMobileDevice() : (w <= 768);
                const isClearance = this.gameMode === 'CLEARANCE';
                const isOverdrive = this.overdriveActive;
                const isSlowmo = this.slowmoTimer > 0;
                const horizonY = Math.round(h * (isMobile ? 0.42 : 0.4));
                const cx = w * 0.5;

                if (!this.drive3D) this.initDrive3DWorld();
                ctx.drawImage(this.getDrive3DSkyLayers(w, h, horizonY, isOverdrive, isSlowmo), 0, 0);

                // Перспективная камера: масштаб = f / глубина
                const NEAR = 320, FAR = 23000, ROAD_HALF = 1500, FLOOR_W = 26000;
                const f = Math.max(280, h * 0.8);
                const camY = 640;
                const speedMult = isOverdrive ? 2.2 : (isSlowmo ? 0.55 : 1);
                const camZ = this.runTime * 4800 * speedMult;
                const world = this.drive3D;
                const districtPos = ((camZ + FAR * 0.4) % world.SEG + world.SEG) % world.SEG;
                const districtIndex = Math.floor(districtPos / world.DISTRICT_LEN);
                const district = world.districts[districtIndex];
                const fogAt = z => Math.max(0.08, Math.min(1, 1.18 - z / FAR));

                const pz = z => f / z;
                const px = (x, s) => cx + x * s;
                const py = (y, s) => horizonY + (camY - y) * s;

                const neonMain = isOverdrive ? '#ffd60a' : (isSlowmo ? '#4ade80' : district.accents[0]);
                const neonAlt = isOverdrive ? '#ff2a85' : district.accents[1];

                // Проекция полигона на земле (y=0) или с высотой
                const poly = (pts, fillCol, strokeCol) => {
                    ctx.beginPath();
                    pts.forEach(([x, z, y]) => {
                        const s = pz(z);
                        ctx.lineTo(px(x, s), py(y === undefined ? 0 : y, s));
                    });
                    ctx.closePath();
                    if (fillCol) { ctx.fillStyle = fillCol; ctx.fill(); }
                    if (strokeCol) { ctx.strokeStyle = strokeCol; ctx.stroke(); }
                };

                // Атмосфера и цвет земли постепенно сменяются четырьмя районами трассы.
                const districtSky = ctx.createLinearGradient(0, 0, 0, horizonY);
                districtSky.addColorStop(0, 'rgba(0, 0, 0, 0)');
                districtSky.addColorStop(1, district.tint);
                ctx.globalAlpha = isOverdrive ? 0.08 : 0.22;
                ctx.fillStyle = districtSky;
                ctx.fillRect(0, 0, w, horizonY);
                ctx.globalAlpha = 1;

                const groundCols = [
                    ['#1b0533', '#050013'], ['#073044', '#03121d'],
                    ['#2d191c', '#100b12'], ['#1b292d', '#080f13']
                ][districtIndex];
                const groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
                groundGrad.addColorStop(0, isOverdrive ? '#2a0530' : groundCols[0]);
                groundGrad.addColorStop(1, isOverdrive ? '#070011' : groundCols[1]);
                ctx.fillStyle = groundGrad;
                ctx.fillRect(0, horizonY, w, h - horizonY);

                // 3D-сетка: продольные линии сходятся к точке исчезновения
                ctx.lineWidth = 1;
                for (let k = -8; k <= 8; k++) {
                    if (Math.abs(k) <= 2) continue;
                    const sN = pz(NEAR), sF = pz(FAR);
                    ctx.strokeStyle = `rgba(0, 245, 212, ${k % 4 === 0 ? 0.1 : 0.05})`;
                    ctx.beginPath();
                    ctx.moveTo(px(k * 2400, sN), py(0, sN));
                    ctx.lineTo(px(k * 2400, sF), py(0, sF));
                    ctx.stroke();
                }
                // Поперечные линии, бегущие на камеру (истинная перспектива: z = n*2000 - camZ)
                const latStep = 2000;
                const latStart = Math.ceil((camZ + NEAR) / latStep) * latStep - camZ;
                for (let z = latStart; z < FAR; z += latStep) {
                    const s = pz(z);
                    const fade = fogAt(z) * 0.32;
                    ctx.strokeStyle = `rgba(0, 245, 212, ${Math.max(0.04, fade)})`;
                    ctx.beginPath();
                    ctx.moveTo(px(-FLOOR_W, s), py(0, s));
                    ctx.lineTo(px(FLOOR_W, s), py(0, s));
                    ctx.stroke();
                }

                // Линия горизонта — РИСУЕМ ДО дорог и зданий, чтобы она не пересекала объекты
                ctx.strokeStyle = isClearance ? '#ff0a78' : neonMain;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, horizonY - 1);
                ctx.lineTo(w, horizonY - 1);
                ctx.stroke();

                // Само шоссе, тротуары и неоновые кромки
                const roadCols = ['#100d20', '#111e29', '#21191c', '#1b2226'];
                const roadCol = isOverdrive ? 'rgba(38, 10, 30, 0.95)' : roadCols[districtIndex];
                poly([[-ROAD_HALF - 390, NEAR], [-ROAD_HALF, NEAR], [-ROAD_HALF, FAR], [-ROAD_HALF - 390, FAR]], districtIndex === 2 ? '#463838' : '#283343', null);
                poly([[ROAD_HALF, NEAR], [ROAD_HALF + 390, NEAR], [ROAD_HALF + 390, FAR], [ROAD_HALF, FAR]], districtIndex === 2 ? '#463838' : '#283343', null);
                poly([
                    [-ROAD_HALF, NEAR], [ROAD_HALF, NEAR],
                    [ROAD_HALF, FAR], [-ROAD_HALF, FAR]
                ], roadCol, null);

                // Неоновые отбойники по краям
                poly([[-ROAD_HALF - 70, NEAR], [-ROAD_HALF, NEAR], [-ROAD_HALF, FAR], [-ROAD_HALF - 70, FAR]], neonMain, null);
                poly([[ROAD_HALF, NEAR], [ROAD_HALF + 70, NEAR], [ROAD_HALF + 70, FAR], [ROAD_HALF, FAR]], neonMain, null);
                ctx.globalAlpha = 0.25;
                poly([[-ROAD_HALF - 220, NEAR], [-ROAD_HALF - 70, NEAR], [-ROAD_HALF - 70, FAR], [-ROAD_HALF - 220, FAR]], neonMain, null);
                poly([[ROAD_HALF + 70, NEAR], [ROAD_HALF + 220, NEAR], [ROAD_HALF + 220, FAR], [ROAD_HALF + 70, FAR]], neonMain, null);
                ctx.globalAlpha = 1;

                // Бегущие дорожные разметки (пунктиры двух полос)
                ctx.fillStyle = isOverdrive ? 'rgba(255, 246, 190, 0.85)' : 'rgba(255, 255, 255, 0.6)';
                const dashSpan = 1400, dashLen = 560;
                const dashStart = Math.ceil((camZ + NEAR) / dashSpan) * dashSpan - camZ;
                for (let z = dashStart; z < FAR - dashLen; z += dashSpan) {
                    poly([[-500 - 30, z], [-500 + 30, z], [-500 + 30, z + dashLen], [-500 - 30, z + dashLen]], null, null);
                    ctx.fill();
                    poly([[500 - 30, z], [500 + 30, z], [500 + 30, z + dashLen], [500 - 30, z + dashLen]], null, null);
                    ctx.fill();
                }

                // Боковые улицы, перекрёстки и зебры появляются на протяжении всего маршрута.
                const crossP = 9000;
                for (let zi = Math.ceil((camZ + NEAR) / crossP); ; zi++) {
                    const z = zi * crossP - camZ;
                    if (z >= FAR - 700) break;
                    if (z < NEAR + 850) continue;
                    const crossDistrict = world.districts[Math.floor((((zi * crossP) % world.SEG + world.SEG) % world.SEG) / world.DISTRICT_LEN)];
                    const crossRoad = districtIndex === 2 ? '#292225' : '#18202b';
                    poly([[-9800, z - 650], [9800, z - 650], [9800, z + 650], [-9800, z + 650]], crossRoad, null);
                    poly([[-9800, z - 760], [9800, z - 760], [9800, z - 650], [-9800, z - 650]], crossDistrict.accents[0], null);
                    poly([[-9800, z + 650], [9800, z + 650], [9800, z + 760], [-9800, z + 760]], crossDistrict.accents[0], null);
                    ctx.globalAlpha = 0.24;
                    for (const side of [-1, 1]) {
                        for (let x = 2200; x < 9000; x += 1250) {
                            const x0 = side * x;
                            poly([[x0, z - 32], [x0 + side * 610, z - 32], [x0 + side * 610, z + 32], [x0, z + 32]], '#facc15', null);
                        }
                    }
                    ctx.globalAlpha = 1;
                    if (z < 15000) {
                        for (const crossZ of [z - 540, z + 350]) {
                            for (let x = -1250; x < 1250; x += 390) {
                                poly([[x, crossZ], [x + 185, crossZ], [x + 185, crossZ + 175], [x, crossZ + 175]], 'rgba(238, 242, 255, 0.58)', null);
                            }
                        }
                    }
                }

                // Функции отрисовки объектов трассы
                const drawBuilding = (b, zN) => {
                    const fog = fogAt(zN);
                    const sN = pz(zN);
                    const xL = b.x - b.w / 2, xR = b.x + b.w / 2;
                    const palette = world.districts[b.district].accents;
                    const colEdge = isOverdrive ? (b.neon % 2 ? '#ff2a85' : '#ffd60a') : palette[b.neon];
                    const pitched = b.kind === 'house' || (b.district === 2 && b.kind === 'shop' && b.winSeed % 3 === 0);

                    ctx.globalAlpha = fog;

                    // Плоские крыши небоскрёбов чередуются с двускатными крышами старого города.
                    if (pitched) {
                        const ridgeY = b.h + b.roofH;
                        poly([[xL, zN, b.h], [b.x, zN, ridgeY], [b.x, zN + b.d, ridgeY], [xL, zN + b.d, b.h]], b.roofCol, colEdge);
                        poly([[b.x, zN, ridgeY], [xR, zN, b.h], [xR, zN + b.d, b.h], [b.x, zN + b.d, ridgeY]], '#382330', colEdge);
                        poly([[xL, zN, b.h], [xR, zN, b.h], [b.x, zN, ridgeY]], b.roofCol, colEdge);
                    } else {
                        poly([[xL, zN, b.h], [xR, zN, b.h], [xR, zN + b.d, b.h], [xL, zN + b.d, b.h]], b.roofCol, colEdge);
                        if (b.district === 0 && zN < 13000 && b.winSeed % 3 === 0) {
                            const unitW = b.w * 0.24, unitH = 180;
                            poly([[b.x - unitW, zN + b.d * 0.35, b.h], [b.x + unitW, zN + b.d * 0.35, b.h], [b.x + unitW, zN + b.d * 0.35, b.h + unitH], [b.x - unitW, zN + b.d * 0.35, b.h + unitH]], '#273047', colEdge);
                        }
                    }

                    // Боковая грань, обращённая к камере
                    if (b.x > 0) {
                        poly([[xL, zN, 0], [xL, zN + b.d, 0], [xL, zN + b.d, b.h], [xL, zN, b.h]], b.sideCol, colEdge);
                    } else if (b.x < 0) {
                        poly([[xR, zN, 0], [xR, zN + b.d, 0], [xR, zN + b.d, b.h], [xR, zN, b.h]], b.sideCol, colEdge);
                    }

                    // Лицевой фасад
                    poly([[xL, zN, 0], [xR, zN, 0], [xR, zN, b.h], [xL, zN, b.h]], b.facade, colEdge);

                    // Светящиеся окна: плотные в центре, тёплые в старом городе, редкие на складах.
                    if (!isMobile || zN < 14000) {
                        const wm = b.kind === 'warehouse' ? 0.08 : 0.12;
                        for (let r = 0; r < b.winRows; r++) {
                            for (let cIdx = 0; cIdx < b.winCols; cIdx++) {
                                if (((r * b.winCols + cIdx + b.winSeed) % 5) > (b.district === 2 ? 2 : 1)) continue;
                                const u0 = wm + (cIdx + 0.18) / b.winCols * (1 - wm * 2);
                                const u1 = wm + (cIdx + 0.82) / b.winCols * (1 - wm * 2);
                                const v0 = 0.1 + (r + 0.18) / b.winRows * 0.8;
                                const v1 = 0.1 + (r + 0.82) / b.winRows * 0.8;
                                const winX0 = px(xL + (xR - xL) * u0, sN);
                                const winX1 = px(xL + (xR - xL) * u1, sN);
                                const winY0 = py(b.h * v1, sN);
                                const winY1 = py(b.h * v0, sN);
                                const litCol = b.district === 2 ? ((r + cIdx) % 3 ? '#ffd18a' : '#8ee8ff')
                                    : ((r + cIdx + b.winSeed) % 3 === 0 ? palette[1] : colEdge);
                                ctx.fillStyle = litCol;
                                ctx.fillRect(winX0, winY0, Math.max(1, winX1 - winX0), Math.max(1, winY1 - winY0));
                            }
                        }
                    }

                    // Балконы мотелей и отелей подчёркивают прибрежную архитектуру.
                    if ((b.kind === 'hotel' || b.kind === 'motel') && zN < 15000) {
                        ctx.strokeStyle = palette[0];
                        ctx.lineWidth = Math.max(0.7, 5 * sN);
                        for (let r = 1; r < Math.min(b.winRows, 7); r++) {
                            const by = py(b.h * (0.1 + r / Math.min(b.winRows, 7) * 0.76), sN);
                            ctx.beginPath();
                            ctx.moveTo(px(xL, sN), by);
                            ctx.lineTo(px(xR, sN), by);
                            ctx.stroke();
                        }
                    }

                    // Гаражные ворота и полосы погрузки на промышленных зданиях.
                    if ((b.kind === 'warehouse' || b.kind === 'factory') && zN < 15000) {
                        const doors = Math.max(2, Math.min(4, Math.floor(b.w / 700)));
                        for (let door = 0; door < doors; door++) {
                            const dx0 = xL + b.w * (door + 0.16) / doors;
                            const dx1 = xL + b.w * (door + 0.82) / doors;
                            const sx0 = px(dx0, sN), sx1 = px(dx1, sN);
                            const top = py(b.h * 0.38, sN), bottom = py(0, sN);
                            ctx.fillStyle = '#111a20';
                            ctx.fillRect(sx0, top, Math.max(1, sx1 - sx0), Math.max(1, bottom - top));
                            ctx.strokeStyle = palette[door % palette.length];
                            ctx.lineWidth = Math.max(0.6, 3 * sN);
                            for (let stripe = 1; stripe < 4; stripe++) {
                                const sy = top + (bottom - top) * stripe / 4;
                                ctx.beginPath(); ctx.moveTo(sx0, sy); ctx.lineTo(sx1, sy); ctx.stroke();
                            }
                        }
                    }

                    // Магазины получают навесы и собственные светящиеся вывески.
                    if (b.kind === 'shop' || b.kind === 'motel') {
                        const awningY = b.h * 0.24;
                        poly([[xL, zN - 18, awningY], [xR, zN - 18, awningY], [xR, zN - 18, awningY + 120], [xL, zN - 18, awningY + 120]], palette[(b.neon + 1) % 4], null);
                    }
                    if (b.sign && sN > 0.085) {
                        const signW = b.w * 0.72, signH = Math.min(250, b.h * 0.17);
                        const signY = (b.kind === 'shop' || b.kind === 'motel') ? b.h * 0.43 : b.h * 0.8;
                        ctx.globalAlpha = fog * (0.78 + Math.sin(this.runTime * 2.2 + b.blink) * 0.18);
                        poly([[b.x - signW / 2, zN - 24, signY], [b.x + signW / 2, zN - 24, signY], [b.x + signW / 2, zN - 24, signY + signH], [b.x - signW / 2, zN - 24, signY + signH]], colEdge, '#f4f7ff');
                        ctx.save();
                        ctx.translate(px(b.x, pz(zN - 24)), py(signY + signH * 0.48, pz(zN - 24)));
                        ctx.scale(sN * 2.8, sN * 2.8);
                        ctx.font = '900 11px "Exo 2", sans-serif';
                        ctx.fillStyle = '#080b18';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(b.sign, 0, 0);
                        ctx.restore();
                        ctx.globalAlpha = fog;
                    }

                    // Мигающий авиационный огонь на высоких зданиях
                    const blinkA = 0.4 + Math.sin(this.runTime * 2.6 + b.blink) * 0.4;
                    if (blinkA > 0.3 && b.h > 2200) {
                        ctx.fillStyle = neonAlt;
                        ctx.globalAlpha = Math.min(1, blinkA) * fog;
                        ctx.beginPath();
                        ctx.arc(px(b.x, sN), py(b.h, sN) - 4, 2.2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                };

                const drawScenery = (p, zN) => {
                    const fog = fogAt(zN);
                    if (fog < 0.11) return;
                    const sN = pz(zN);
                    const palette = world.districts[p.district].accents;
                    const col = palette[p.accent];
                    ctx.globalAlpha = fog;

                    if (p.kind === 'billboard') {
                        const pw = p.w * 1.35, baseY = p.h * 0.42;
                        for (const postSide of [-1, 1]) {
                            const postX = p.x + postSide * pw * 0.3;
                            poly([[postX - 35, zN + 50, 0], [postX + 35, zN + 50, 0], [postX + 35, zN + 50, baseY + 100], [postX - 35, zN + 50, baseY + 100]], '#303744', null);
                        }
                        poly([[p.x - pw / 2, zN + 130, baseY], [p.x + pw / 2, zN + 130, baseY], [p.x + pw / 2, zN + 130, p.h], [p.x - pw / 2, zN + 130, p.h]], '#151c29', col);
                        poly([[p.x - pw / 2, zN, baseY], [p.x + pw / 2, zN, baseY], [p.x + pw / 2, zN, p.h], [p.x - pw / 2, zN, p.h]], '#101522', col);
                        if (sN > 0.07) {
                            ctx.save();
                            ctx.translate(px(p.x, sN), py(baseY + (p.h - baseY) * 0.52, sN));
                            ctx.scale(sN * 3.1, sN * 3.1);
                            ctx.font = '900 12px "Exo 2", sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = col;
                            ctx.fillText(p.label, 0, 0);
                            ctx.restore();
                        }
                    } else if (p.kind === 'palm') {
                        const lean = Math.sin(p.phase) * 150;
                        poly([[p.x - 60, zN, 0], [p.x + 60, zN, 0], [p.x + lean + 32, zN, p.h], [p.x + lean - 32, zN, p.h]], '#7a5138', '#c18a54');
                        const crownX = px(p.x + lean, sN), crownY = py(p.h, sN);
                        ctx.strokeStyle = '#43d68a';
                        ctx.lineCap = 'round';
                        ctx.lineWidth = Math.max(1, 55 * sN);
                        for (let leaf = 0; leaf < 8; leaf++) {
                            const a = leaf / 8 * Math.PI * 2 + p.phase;
                            const ex = px(p.x + lean + Math.cos(a) * 650, sN);
                            const ey = py(p.h - 80 + Math.sin(a) * 260, sN);
                            ctx.beginPath();
                            ctx.moveTo(crownX, crownY);
                            ctx.quadraticCurveTo((crownX + ex) * 0.5, Math.min(crownY, ey) - 35 * sN, ex, ey + 45 * sN);
                            ctx.stroke();
                        }
                        ctx.fillStyle = '#d9a84e';
                        ctx.beginPath(); ctx.arc(crownX, crownY, Math.max(1.5, 85 * sN), 0, Math.PI * 2); ctx.fill();
                    } else if (p.kind === 'tree') {
                        poly([[p.x - 65, zN, 0], [p.x + 65, zN, 0], [p.x + 45, zN, p.h * 0.62], [p.x - 45, zN, p.h * 0.62]], '#60402d', null);
                        const tx = px(p.x, sN), ty = py(p.h * 0.72, sN);
                        const r = Math.max(2, p.w * 0.66 * sN);
                        ctx.fillStyle = p.district === 0 ? '#153c46' : '#214d35';
                        ctx.beginPath(); ctx.arc(tx, ty, r, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = p.district === 0 ? '#237482' : '#3b7f4d';
                        ctx.beginPath(); ctx.arc(tx - r * 0.24, ty - r * 0.3, r * 0.68, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = p.district === 2 ? '#6d9b52' : '#55b776';
                        ctx.beginPath(); ctx.arc(tx - r * 0.42, ty - r * 0.48, r * 0.25, 0, Math.PI * 2); ctx.fill();
                    } else if (p.kind === 'tank') {
                        const sx = px(p.x, sN), base = py(0, sN), top = py(p.h, sN);
                        const rx = Math.max(2, p.w * 0.5 * sN), ry = Math.max(1, rx * 0.28);
                        const metal = ctx.createLinearGradient(sx - rx, 0, sx + rx, 0);
                        metal.addColorStop(0, '#26343d'); metal.addColorStop(0.42, '#7b8b91'); metal.addColorStop(0.65, '#4c5b62'); metal.addColorStop(1, '#1d2931');
                        ctx.fillStyle = metal;
                        ctx.fillRect(sx - rx, top, rx * 2, Math.max(1, base - top));
                        ctx.beginPath(); ctx.ellipse(sx, top, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = col;
                        ctx.lineWidth = Math.max(0.7, 7 * sN);
                        for (const level of [0.28, 0.68]) {
                            const bandY = py(p.h * level, sN);
                            ctx.beginPath(); ctx.moveTo(sx - rx, bandY); ctx.lineTo(sx + rx, bandY); ctx.stroke();
                        }
                        ctx.strokeStyle = '#b8c3c7';
                        ctx.beginPath(); ctx.moveTo(sx + rx * 0.58, top); ctx.lineTo(sx + rx * 0.58, base); ctx.stroke();
                    } else if (p.kind === 'stack') {
                        const sw = 170 + p.w * 0.09;
                        poly([[p.x - sw, zN, 0], [p.x + sw, zN, 0], [p.x + sw * 0.72, zN, p.h], [p.x - sw * 0.72, zN, p.h]], '#52565a', '#1c242a');
                        for (let band = 1; band < 5; band++) {
                            const y0 = p.h * (0.55 + band * 0.075), y1 = y0 + p.h * 0.035;
                            poly([[p.x - sw * 0.78, zN - 8, y0], [p.x + sw * 0.78, zN - 8, y0], [p.x + sw * 0.75, zN - 8, y1], [p.x - sw * 0.75, zN - 8, y1]], band % 2 ? '#d9d0ba' : '#b64b3f', null);
                        }
                        for (let puff = 0; puff < 3; puff++) {
                            const drift = Math.sin(this.runTime * 0.8 + p.phase + puff) * 150;
                            const smokeX = px(p.x + drift + puff * 90, sN);
                            const smokeY = py(p.h + 170 + puff * 230, sN);
                            const sr = Math.max(2, (100 + puff * 65) * sN);
                            ctx.globalAlpha = fog * (0.19 - puff * 0.035);
                            ctx.fillStyle = '#a7b0b5';
                            ctx.beginPath(); ctx.arc(smokeX, smokeY, sr, 0, Math.PI * 2); ctx.fill();
                        }
                    }
                };

                const drawCar = (car, zN) => {
                    const fog = fogAt(zN);
                    if (fog < 0.12) return;
                    // Плавное затухание у камеры: машина не должна заслонять игровое поле
                    const nearFade = Math.max(0, Math.min(1, (zN - 520) / 1100));
                    if (nearFade <= 0.02) return;
                    const A = fog * nearFade;
                    const s = pz(zN);
                    const hw = car.cw, hh = car.ch, zF = zN + car.cd;
                    ctx.globalAlpha = A;

                    // Кузов: верхняя грань + ближняя (орма или нос)
                    poly([[car.x - hw * 0.66, zN, hh], [car.x + hw * 0.66, zN, hh], [car.x + hw * 0.66, zF, hh], [car.x - hw * 0.66, zF, hh]], '#120a26', null);
                    poly([[car.x - hw, zN, 0], [car.x + hw, zN, 0], [car.x + hw, zN, hh], [car.x - hw, zN, hh]], car.col, null);
                    ctx.strokeStyle = 'rgba(4, 6, 18, 0.85)';
                    ctx.lineWidth = 1.2;
                    ctx.stroke();

                    // Неоновая подсветка днища
                    poly([[car.x - hw * 1.14, zN, 0], [car.x + hw * 1.14, zN, 0], [car.x + hw * 1.14, zN, hh * 0.2], [car.x - hw * 1.14, zN, hh * 0.2]], car.glow, null);

                    if (car.dir > 0) {
                        // Попутная: красные задние фонари
                        ctx.fillStyle = '#ff3b5c';
                        const ly0 = py(hh * 0.62, s), ly1 = py(hh * 0.4, s);
                        ctx.fillRect(px(car.x - hw * 0.85, s), ly0, px(car.x - hw * 0.4, s) - px(car.x - hw * 0.85, s), Math.max(1, ly1 - ly0));
                        ctx.fillRect(px(car.x + hw * 0.4, s), ly0, px(car.x + hw * 0.85, s) - px(car.x + hw * 0.4, s), Math.max(1, ly1 - ly0));
                    } else {
                        // Встречная: яркие фары + блик света на асфальте
                        ctx.fillStyle = '#fff6cf';
                        const ly0 = py(hh * 0.66, s), ly1 = py(hh * 0.42, s);
                        ctx.fillRect(px(car.x - hw * 0.8, s), ly0, px(car.x - hw * 0.35, s) - px(car.x - hw * 0.8, s), Math.max(1, ly1 - ly0));
                        ctx.fillRect(px(car.x + hw * 0.35, s), ly0, px(car.x + hw * 0.8, s) - px(car.x + hw * 0.35, s), Math.max(1, ly1 - ly0));
                        if (zN > 1100) {
                            const poolZ = Math.max(NEAR, zN - car.cd - 2600);
                            ctx.globalAlpha = A * 0.13;
                            poly([
                                [car.x - hw * 1.4, zN], [car.x + hw * 1.4, zN],
                                [car.x + hw * 3.0, poolZ], [car.x - hw * 3.0, poolZ]
                            ], 'rgba(255, 236, 170, 0.9)', null);
                        }
                    }
                };

                const drawLampPair = (zN, districtId = 0) => {
                    const fog = fogAt(zN);
                    if (fog < 0.1) return;
                    const s = pz(zN);
                    ctx.globalAlpha = fog;
                    const districtBulbs = ['150, 235, 255', '255, 224, 150', '255, 190, 110', '255, 145, 80'];
                    const bulbCol = isOverdrive ? '255, 214, 10' : districtBulbs[districtId];
                    [-1, 1].forEach(side => {
                        const lx = side * (ROAD_HALF + 260);
                        const topY = [720, 540, 620, 850][districtId];
                        ctx.strokeStyle = 'rgba(24, 32, 62, 0.95)';
                        ctx.lineWidth = Math.max(1, Math.min(6, 30 * s));
                        ctx.beginPath();
                        ctx.moveTo(px(lx, s), py(0, s));
                        ctx.lineTo(px(lx, s), py(topY, s));
                        ctx.lineTo(px(lx - side * 170, s), py(topY + 60, s));
                        ctx.stroke();
                        const bx = px(lx - side * 170, s), by = py(topY + 60, s);
                        const r = Math.max(2, Math.min(16, 90 * s));
                        const g = ctx.createRadialGradient(bx, by, 1, bx, by, r * 2.6);
                        g.addColorStop(0, `rgba(${bulbCol}, 0.85)`);
                        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
                        ctx.fillStyle = g;
                        ctx.beginPath();
                        ctx.arc(bx, by, r * 2.6, 0, Math.PI * 2);
                        ctx.fill();
                    });
                };

                const drawArch = (zN, variant, districtId = 0) => {
                    const fog = fogAt(zN);
                    if (fog < 0.1) return;
                    const sA = pz(zN);
                    ctx.globalAlpha = fog;
                    const col = isOverdrive ? (variant % 2 ? '#ff2a85' : '#ffd60a') : world.districts[districtId].accents[variant % 4];
                    const topY = 1400, beamH = 320, postW = 150;
                    // Стойки арки
                    poly([[-ROAD_HALF - 240, zN, 0], [-ROAD_HALF - 240 + postW, zN, 0], [-ROAD_HALF - 240 + postW, zN, topY], [-ROAD_HALF - 240, zN, topY]], '#0d0722', col);
                    poly([[ROAD_HALF + 240 - postW, zN, 0], [ROAD_HALF + 240, zN, 0], [ROAD_HALF + 240, zN, topY], [ROAD_HALF + 240 - postW, zN, topY]], '#0d0722', col);
                    // Перекладина над трассой
                    poly([[-ROAD_HALF - 240, zN, topY], [ROAD_HALF + 240, zN, topY], [ROAD_HALF + 240, zN, topY + beamH], [-ROAD_HALF - 240, zN, topY + beamH]], '#140a2e', col);
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    // Мигающая вывеска по центру
                    const signW = 1100, signH = 200, signY = topY + 60;
                    ctx.fillStyle = col;
                    ctx.globalAlpha = fog * (0.5 + Math.sin(this.runTime * 4 + variant * 2.2) * 0.3);
                    const sx0 = px(-signW / 2, sA), sy0 = py(signY + signH, sA);
                    ctx.fillRect(sx0, sy0, signW * sA, Math.max(1, signH * sA));
                    const archLabels = [
                        ['DRIVE 89', 'NEON WAY', 'XPACE', 'TURBO'],
                        ['OCEAN DR', 'PALM BAY', 'MOTEL', 'SUNSET'],
                        ['OLD TOWN', 'CAFE', 'MARKET', 'CITY HALL'],
                        ['IRON WORKS', 'FACTORY', 'NITRO', 'INDUSTRIAL']
                    ];
                    if (sA > 0.12) {
                        ctx.save();
                        ctx.translate(px(0, sA), py(signY + signH / 2, sA));
                        ctx.scale(sA * 3, sA * 3);
                        ctx.font = '700 11px "Exo 2", sans-serif';
                        ctx.fillStyle = '#0b041c';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(archLabels[districtId][variant % 4], 0, 1);
                        ctx.restore();
                    }
                };

                // Единый список объектов, сортировка по глубине (от дальних к ближним)
                const items = [];
                const seg = world.SEG;
                const districtAt = worldZ => Math.floor(((worldZ % seg + seg) % seg) / world.DISTRICT_LEN);
                for (const b of world.buildings) {
                    let z = ((b.z - camZ) % seg + seg) % seg;
                    if (z < NEAR) z += seg;
                    if (z < FAR) items.push({ z, k: 0, o: b });
                }
                for (const car of world.cars) {
                    const cseg = car.seg;
                    let z = ((car.z + car.dir * car.v * this.runTime - camZ) % cseg + cseg) % cseg;
                    if (z < NEAR) z += cseg;
                    if (z < FAR) items.push({ z, k: 1, o: car });
                }
                const lampP = 1700;
                for (let zi = Math.ceil((camZ + NEAR) / lampP); ; zi++) {
                    const z = zi * lampP - camZ;
                    if (z >= FAR) break;
                    items.push({ z, k: 2, o: districtAt(zi * lampP) });
                }
                const archP = 10500;
                for (let zi = Math.ceil((camZ + NEAR) / archP); ; zi++) {
                    const z = zi * archP - camZ;
                    if (z >= FAR) break;
                    items.push({ z, k: 3, o: { variant: ((zi % 4) + 4) % 4, district: districtAt(zi * archP) } });
                }
                for (const prop of world.props) {
                    let z = ((prop.z - camZ) % seg + seg) % seg;
                    if (z < NEAR) z += seg;
                    if (z < FAR) items.push({ z, k: 4, o: prop });
                }
                items.sort((a, c) => c.z - a.z);

                for (const it of items) {
                    if (it.k === 0) drawBuilding(it.o, it.z);
                    else if (it.k === 1) drawCar(it.o, it.z);
                    else if (it.k === 2) drawLampPair(it.z, it.o);
                    else if (it.k === 3) drawArch(it.z, it.o.variant, it.o.district);
                    else drawScenery(it.o, it.z);
                }
                ctx.globalAlpha = 1;

                // Лучи скорости в Форсаже (только в небе)
                if (isOverdrive) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(0, 0, w, horizonY);
                    ctx.clip();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.lineWidth = 1.5;
                    for (let i = 0; i < 14; i++) {
                        const a = (i / 14) * Math.PI * 2 + this.runTime * 0.6;
                        ctx.beginPath();
                        ctx.moveTo(cx + Math.cos(a) * 60, horizonY + Math.sin(a) * 34);
                        ctx.lineTo(cx + Math.cos(a) * w, horizonY + Math.sin(a) * h);
                        ctx.stroke();
                    }
                    ctx.restore();
                }

                // Ретро-штамп режима
                ctx.font = '700 9px "Exo 2", sans-serif';
                ctx.fillStyle = isOverdrive ? 'rgba(255, 214, 10, 0.3)' : 'rgba(0, 245, 212, 0.26)';
                ctx.textAlign = 'left';
                ctx.fillText(`3D // ${district.name} // DRIVE`, 12, h - 12);
            }
        });
