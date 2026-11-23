        // Main renderer and animation loop
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            draw() {
                const ctx = this.ctx;
                const isDrive = this.flightMode() === 'DRIVE';
                const driveScenery = isDrive && this.state !== 'MENU';
                // The Outrun base covers the whole canvas when the camera is steady.
                if (!driveScenery || this.shakeTime > 0) ctx.clearRect(0, 0, this.width, this.height);

                ctx.save();
                if (this.shakeTime > 0) {
                    ctx.translate((Math.random() - 0.5) * this.shakeMag, (Math.random() - 0.5) * this.shakeMag);
                }

                if (!isDrive) {
                    this.drawClearanceSpaceBackground(ctx);
                } else if (this.state === 'MENU') {
                    this.drawDrive3DBackground(ctx);
                } else {
                    this.drawDriveOutrunBackground(ctx);
                }

                // ЭМИ-ударные волны
                this.empWaves.forEach(w => {
                    ctx.save();
                    ctx.strokeStyle = `rgba(255, 214, 10, ${Math.max(0, w.alpha)})`;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                });

                this.blueSparks.forEach(bs => this.drawBlueSpark(bs, driveScenery));
                this.rareCoins.forEach(c => this.drawPixelCoin(c));
                this.powerups.forEach(p => this.drawPowerup(p, driveScenery));

                // Отрисовка фиолетовых искр для атаки по Боссу
                this.purpleSparks.forEach(ps => {
                    const scale = 1 + Math.sin(ps.pulse) * 0.18;
                    ctx.save();
                    ctx.translate(ps.x, ps.y);
                    ctx.scale(scale, scale);
                    if (driveScenery) this.drawDriveEnergyWake(ctx, '#a855f7', 13.5, 31);

                    ctx.strokeStyle = 'rgba(192, 132, 252, 0.55)';
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.arc(0, 0, 15, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.shadowColor = '#c084fc';
                    ctx.shadowBlur = 16;
                    ctx.fillStyle = '#a855f7';
                    ctx.beginPath();
                    ctx.moveTo(0, -13);
                    ctx.lineTo(9.5, 0);
                    ctx.lineTo(0, 13);
                    ctx.lineTo(-9.5, 0);
                    ctx.closePath();
                    ctx.fill();

                    ctx.fillStyle = '#f3e8ff';
                    ctx.beginPath();
                    ctx.moveTo(0, -6);
                    ctx.lineTo(4.2, 0);
                    ctx.lineTo(0, 6);
                    ctx.lineTo(-4.2, 0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                });

                // Отрисовка самонаводящихся фиолетовых зарядов, летящих в Босса
                this.homingBossShots.forEach(hs => {
                    const boss = this.driveBoss;
                    const direction = boss ? Math.atan2(boss.y - hs.y, boss.x - hs.x) - Math.PI / 2 : Math.PI;
                    this.drawDriveProjectile(hs, 8.5, '#c084fc', '#ffffff', direction);
                });

                // Отрисовка вражеских летающих тарелок (НЛО) и их выстрелов
                this.enemyUfos.forEach(ufo => {
                    ctx.save();
                    ctx.translate(ufo.x, ufo.y);
                    ctx.rotate(ufo.tilt || 0);

                    const hullCol = ufo.flashTimer > 0 ? '#ffffff' : '#ff0a78';
                    const domeCol = '#a3e635';

                    ctx.fillStyle = 'rgba(255, 10, 120, 0.24)';
                    ctx.beginPath();
                    ctx.moveTo(-6, 6);
                    ctx.lineTo(6, 6);
                    ctx.lineTo(2, 16);
                    ctx.lineTo(-2, 16);
                    ctx.closePath();
                    ctx.fill();

                    ctx.shadowColor = domeCol;
                    ctx.shadowBlur = 12;
                    ctx.fillStyle = domeCol;
                    ctx.beginPath();
                    ctx.ellipse(0, -4, 9, 7, 0, Math.PI, 0);
                    ctx.fill();

                    ctx.shadowColor = hullCol;
                    ctx.shadowBlur = 16;
                    ctx.fillStyle = '#1b0624';
                    ctx.strokeStyle = hullCol;
                    ctx.lineWidth = 2.4;
                    ctx.beginPath();
                    ctx.ellipse(0, 1, 20, 7.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    for (let k = 0; k < 5; k++) {
                        const lx = -12 + k * 6;
                        const active = Math.floor(this.runTime * 10 + k) % 2 === 0;
                        ctx.fillStyle = active ? '#ffd60a' : '#ff70d9';
                        ctx.beginPath();
                        ctx.arc(lx, 1, 1.8, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    const barW = 30;
                    const barH = 4;
                    const hpPct = Math.max(0, ufo.hp / ufo.maxHp);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.fillRect(-barW / 2, -16, barW, barH);
                    ctx.fillStyle = '#a3e635';
                    ctx.fillRect(-barW / 2, -16, barW * hpPct, barH);

                    ctx.restore();
                });

                this.enemyBullets.forEach(eb => {
                    ctx.save();
                    ctx.translate(eb.x, eb.y);
                    ctx.shadowColor = '#ff0a78';
                    ctx.shadowBlur = 14;
                    ctx.fillStyle = '#ff0a78';
                    ctx.beginPath();
                    ctx.arc(0, 0, eb.r, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#ffd60a';
                    ctx.beginPath();
                    ctx.arc(0, 0, eb.r * 0.48, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });

                // Отрисовка стилизованных векторных капсул баффов/дебаффов из камней
                this.dropCapsules.forEach(cap => {
                    ctx.save();
                    ctx.translate(cap.x, cap.y);
                    const isBuff = cap.category === 'buff';
                    const col = isBuff ? '#00f5d4' : '#ff0a78';
                    const r = cap.r + Math.sin(cap.pulse) * 2;

                    ctx.strokeStyle = col;
                    ctx.lineWidth = 2.4;
                    ctx.shadowColor = col;
                    ctx.shadowBlur = 14;

                    // Ромбовидная или шестиугольная кибер-капсула
                    ctx.beginPath();
                    for (let k = 0; k < 6; k++) {
                        const a = (k * Math.PI) / 3;
                        const px = Math.cos(a) * r;
                        const py = Math.sin(a) * r;
                        if (k === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.fillStyle = isBuff ? 'rgba(0, 245, 212, 0.22)' : 'rgba(255, 10, 120, 0.26)';
                    ctx.fill();
                    ctx.stroke();

                    // Векторный символ внутри капсулы (двойной шеврон вверх для баффа, вниз/крест для дебаффа)
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    if (isBuff) {
                        ctx.moveTo(-4.5, 1);
                        ctx.lineTo(0, -4);
                        ctx.lineTo(4.5, 1);
                        ctx.moveTo(-4.5, 5.5);
                        ctx.lineTo(0, 0.5);
                        ctx.lineTo(4.5, 5.5);
                    } else {
                        ctx.moveTo(-4.5, -4.5);
                        ctx.lineTo(4.5, 4.5);
                        ctx.moveTo(4.5, -4.5);
                        ctx.lineTo(-4.5, 4.5);
                    }
                    ctx.stroke();
                    ctx.restore();
                });

                // Отрисовка лазерных пуль корабля
                this.bullets.forEach(b => {
                    if (b.requiem) {
                        ctx.save(); ctx.translate(b.x,b.y);
                        ctx.rotate(Math.atan2(b.vy,b.vx) + Math.PI/2);
                        if(b.ascended){
                            ctx.save();ctx.globalAlpha=.25;ctx.translate(Math.sin(this.runTime*14)*1.5,10);this.drawRequiemBone(ctx,b.r/4);ctx.restore();
                        }
                        ctx.rotate(Math.sin((this.runTime-(b.born||0))*12)*.11);
                        this.drawRequiemBone(ctx, b.r / 4); ctx.restore(); return;
                    }
                    ctx.save();
                    ctx.shadowColor = b.color;
                    ctx.shadowBlur = 10;
                    ctx.fillStyle = b.color;
                    drawRoundRect(ctx, b.x - b.r * 0.65, b.y - 9, b.r * 1.3, 18, 3);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(b.x - 1, b.y - 6, 2, 12);
                    ctx.restore();
                });

                // Отрисовка кибер-камней (метеоритов) с индикацией HP
                this.rocks.forEach(rk => {
                    ctx.save();
                    ctx.translate(rk.x, rk.y);

                    ctx.save();
                    ctx.rotate(rk.rot);
                    const strokeCol = rk.isBoss ? '#ffd60a' : (rk.isExplosive ? '#ff9f1c' : '#38bdf8');
                    const fillCol = rk.isBoss ? '#3b0764' : (rk.isExplosive ? '#431407' : '#0f172a');

                    ctx.shadowColor = strokeCol;
                    ctx.shadowBlur = 14;
                    ctx.fillStyle = fillCol;
                    ctx.strokeStyle = strokeCol;
                    ctx.lineWidth = rk.isBoss ? 3.5 : 2.5;

                    ctx.beginPath();
                    rk.vertices.forEach((v, idx) => {
                        if (idx === 0) ctx.moveTo(v.x, v.y);
                        else ctx.lineTo(v.x, v.y);
                    });
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();

                    // Число HP в центре камня
                    ctx.fillStyle = '#ffffff';
                    ctx.font = rk.isBoss ? '900 14px "Exo 2", sans-serif' : '900 11px "Exo 2", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.shadowColor = '#000';
                    ctx.shadowBlur = 4;
                    ctx.fillText(`${rk.hp}`, 0, 1);

                    // Полоска HP над камнем
                    const barW = Math.max(26, rk.r * 1.3);
                    const barH = 5;
                    const pct = Math.max(0, rk.hp / rk.maxHp);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
                    ctx.fillRect(-barW / 2, -rk.r - 10, barW, barH);
                    ctx.fillStyle = rk.isBoss ? '#ffd60a' : (rk.isExplosive ? '#ff9f1c' : '#00f3ff');
                    ctx.fillRect(-barW / 2, -rk.r - 10, barW * pct, barH);

                    ctx.restore();
                });

                // Отрисовка всех препятствий
                this.obstacles.forEach(obs => {
                    ctx.save();
                    if (obs.type === 'drone') {
                        ctx.translate(obs.x, obs.y);
                        ctx.rotate(obs.angle);
                        ctx.shadowColor = '#ff2a85';
                        ctx.shadowBlur = 14;
                        ctx.strokeStyle = '#ff2a85';
                        ctx.lineWidth = 3;

                        ctx.beginPath();
                        for (let k = 0; k < 4; k++) {
                            const a = (k * Math.PI) / 2;
                            ctx.moveTo(Math.cos(a) * (obs.r + 4), Math.sin(a) * (obs.r + 4));
                            ctx.lineTo(Math.cos(a + Math.PI) * (obs.r + 4), Math.sin(a + Math.PI) * (obs.r + 4));
                        }
                        ctx.stroke();

                        ctx.fillStyle = '#1f0818';
                        ctx.beginPath();
                        ctx.arc(0, 0, obs.r * 0.72, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();

                        ctx.fillStyle = '#ff9ebb';
                        ctx.beginPath();
                        ctx.arc(0, 0, obs.r * 0.28, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (obs.type === 'emp_mine') {
                        ctx.translate(obs.x, obs.y);
                        const aura = obs.r + 5 + Math.sin(obs.pulse) * 3;
                        ctx.strokeStyle = 'rgba(255, 159, 28, 0.45)';
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.arc(0, 0, aura, 0, Math.PI * 2);
                        ctx.stroke();

                        ctx.shadowColor = '#ff9f1c';
                        ctx.shadowBlur = 14;
                        ctx.fillStyle = '#2a0d04';
                        ctx.strokeStyle = '#ff9f1c';
                        ctx.lineWidth = 2.5;
                        ctx.beginPath();
                        ctx.arc(0, 0, obs.r * 0.78, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();

                        ctx.fillStyle = '#ffd60a';
                        ctx.beginPath();
                        ctx.arc(0, 0, obs.r * 0.32, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (obs.type === 'laser_gate') {
                        ctx.shadowColor = '#00f3ff';
                        ctx.shadowBlur = 12;
                        ctx.fillStyle = '#ff2a85';
                        // Левый луч
                        drawRoundRect(ctx, 0, obs.y, obs.gapX, obs.h, 5);
                        ctx.fill();
                        // Правый луч
                        const rightStart = obs.gapX + obs.gapW;
                        drawRoundRect(ctx, rightStart, obs.y, Math.max(4, this.width - rightStart), obs.h, 5);
                        ctx.fill();

                        // Светящиеся ограничители безопасного прохода
                        ctx.fillStyle = '#ffd60a';
                        ctx.fillRect(obs.gapX - 5, obs.y - 2, 5, obs.h + 4);
                        ctx.fillRect(rightStart, obs.y - 2, 5, obs.h + 4);
                    } else if (obs.type === 'warning_laser') {
                        if (obs.phase === 'warning') {
                            ctx.strokeStyle = 'rgba(255, 42, 133, 0.65)';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([8, 8]);
                            ctx.beginPath();
                            ctx.moveTo(obs.x, 0);
                            ctx.lineTo(obs.x, this.height);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = '#ffd60a';
                            ctx.font = '900 13px "Exo 2", sans-serif';
                            ctx.textAlign = 'center';
                            drawXpaceText(ctx, '[[xp:warning]]', obs.x, 96);
                        } else {
                            ctx.shadowColor = '#ff2a85';
                            ctx.shadowBlur = 18;
                            ctx.fillStyle = 'rgba(255, 42, 133, 0.85)';
                            ctx.fillRect(obs.x - obs.w / 2, 0, obs.w, this.height);
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(obs.x - 3, 0, 6, this.height);
                        }
                    } else {
                        const isMoving = obs.type === 'moving_beam';
                        const mainColor = isMoving ? '#c084fc' : '#ff2a85';
                        ctx.shadowColor = mainColor;
                        ctx.shadowBlur = 14;
                        ctx.fillStyle = mainColor;
                        drawRoundRect(ctx, obs.x, obs.y, obs.w, obs.h, 7);
                        ctx.fill();

                        ctx.fillStyle = '#ffffff';
                        drawRoundRect(ctx, obs.x + 4, obs.y + 4, Math.max(4, obs.w - 8), Math.max(3, obs.h - 8), 4);
                        ctx.fill();
                    }
                    ctx.restore();
                });

                // Корабль игрока
                if (this.state !== 'GAMEOVER') {
                    const shipCfg = this.getActiveShipConfig();
                    // Выбранный след: магазинный, со скина (на любом корабле) или фирменный след надетого скина
                    const effectiveTrail = this.resolveEffectiveTrailId(shipCfg);
                    const skinTrail = SKIN_TRAILS.find(trail => trail.id === effectiveTrail);

                    this.player.trail.forEach((t, idx) => {
                        const maxL = t.maxLife || 0.60;
                        const lifeRatio = Math.max(0, t.life / maxL);
                        const seq = t.seq !== undefined ? t.seq : idx;

                        if (skinTrail?.effect) {
                            this.drawSkinTrailParticle(ctx, skinTrail.effect, skinTrail.accent, t, lifeRatio, seq);
                            return;
                        }

                        if (effectiveTrail === 'text42') {
                            // Эксклюзивный след «42»: медленный и чёткий шлейф
                            if (seq % 12 !== 0) return;
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.65);
                            const scale = 0.92 + lifeRatio * 0.35;
                            ctx.translate(t.x, t.y + 4);
                            ctx.scale(scale, scale);
                            ctx.font = '900 13px "Exo 2", sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = '#ff0a78';
                            ctx.fillText('42', -2, 2);
                            ctx.shadowColor = '#ffd60a';
                            ctx.shadowBlur = 10;
                            ctx.fillStyle = (seq % 24 === 0) ? '#ffd60a' : '#00f5d4';
                            ctx.fillText('42', 0, 0);
                            ctx.restore();
                            return;
                        }

                        if (effectiveTrail === 'cleopatra_42') {
                            // След «ЛЕОПАРД 42»: плавная леопардовая лента + мягко плывущие числа «42» в леопардовой расцветке
                            const age = 1 - lifeRatio;
                            const fadeIn = Math.min(1, age * 6);
                            const smoothEase = lifeRatio * lifeRatio * (3 - 2 * lifeRatio) * fadeIn;
                            const wavePhase = this.runTime * 2.6 - age * 4.2;
                            const swayX = Math.sin(wavePhase) * 4.5 * age;
                            const px = t.x + swayX;
                            const py = t.y + 4;

                            if (!this._leopardTrailPattern) {
                                const pCan = document.createElement('canvas');
                                pCan.width = 20;
                                pCan.height = 20;
                                const pCtx = pCan.getContext('2d');
                                const grad = pCtx.createLinearGradient(0, 0, 20, 20);
                                grad.addColorStop(0, '#fde047');
                                grad.addColorStop(0.5, '#f59e0b');
                                grad.addColorStop(1, '#b45309');
                                pCtx.fillStyle = grad;
                                pCtx.fillRect(0, 0, 20, 20);
                                const spots = [
                                    { x: 4.5, y: 4.5, r: 2.8 },
                                    { x: 14.5, y: 5.5, r: 2.5 },
                                    { x: 8.5, y: 14.5, r: 3.0 },
                                    { x: 16.5, y: 15.5, r: 2.2 }
                                ];
                                spots.forEach(sp => {
                                    pCtx.fillStyle = '#291506';
                                    pCtx.beginPath();
                                    pCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
                                    pCtx.fill();
                                    pCtx.fillStyle = '#d97706';
                                    pCtx.beginPath();
                                    pCtx.arc(sp.x, sp.y, sp.r * 0.52, 0, Math.PI * 2);
                                    pCtx.fill();
                                });
                                this._leopardTrailPattern = ctx.createPattern(pCan, 'repeat');
                            }

                            // 1) Непрерывный плавный леопардовый шлейф между точками
                            const prevT = idx > 0 ? this.player.trail[idx - 1] : null;
                            if (prevT) {
                                const prevRatio = Math.max(0, prevT.life / prevT.maxLife);
                                const prevAge = 1 - prevRatio;
                                const prevPhase = this.runTime * 2.6 - prevAge * 4.2;
                                const prevX = prevT.x + Math.sin(prevPhase) * 4.5 * prevAge;
                                const prevY = prevT.y + 4;

                                ctx.save();
                                ctx.lineCap = 'round';
                                // Мягкое золотисто-янтарное внешнее свечение
                                ctx.globalAlpha = smoothEase * 0.34;
                                ctx.strokeStyle = '#f59e0b';
                                ctx.lineWidth = 15 * smoothEase + 3;
                                ctx.beginPath();
                                ctx.moveTo(prevX, prevY);
                                ctx.lineTo(px, py);
                                ctx.stroke();

                                // Леопардовая текстурная сердцевина ленты
                                ctx.globalAlpha = smoothEase * 0.85;
                                ctx.strokeStyle = this._leopardTrailPattern || '#f59e0b';
                                ctx.lineWidth = 7 * smoothEase + 1.5;
                                ctx.beginPath();
                                ctx.moveTo(prevX, prevY);
                                ctx.lineTo(px, py);
                                ctx.stroke();
                                ctx.restore();
                            }

                            // 2) Плавные леопардовые числа «42»
                            if (seq % 7 !== 0) return;
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, smoothEase * 1.35);
                            const pulse = 1 + Math.sin(this.runTime * 4 + seq * 0.2) * 0.04;
                            const scale = (0.78 + smoothEase * 0.42) * pulse;
                            ctx.translate(px, py);
                            ctx.scale(scale, scale);

                            // Кэшированный мягкий радиальный ореол свечения
                            if (!this._leopardGlowSprite) {
                                const gCan = document.createElement('canvas');
                                gCan.width = 48;
                                gCan.height = 48;
                                const gCtx = gCan.getContext('2d');
                                const rGrad = gCtx.createRadialGradient(24, 24, 2, 24, 24, 22);
                                rGrad.addColorStop(0, 'rgba(253, 224, 71, 0.78)');
                                rGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.38)');
                                rGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
                                gCtx.fillStyle = rGrad;
                                gCtx.fillRect(0, 0, 48, 48);
                                this._leopardGlowSprite = gCan;
                            }
                            ctx.drawImage(this._leopardGlowSprite, -22, -22, 44, 44);

                            ctx.font = '900 13px "Exo 2", sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            // Тёмно-коричневая леопардовая обводка + леопардовая текстура внутри «42»
                            ctx.lineWidth = 2.8;
                            ctx.strokeStyle = '#291506';
                            ctx.strokeText('42', 0, 0);

                            ctx.fillStyle = this._leopardTrailPattern || '#f59e0b';
                            ctx.fillText('42', 0, 0);

                            // Тонкий золотистый контур по краю цифр
                            ctx.lineWidth = 0.75;
                            ctx.strokeStyle = '#fde047';
                            ctx.strokeText('42', 0, 0);
                            ctx.restore();
                            return;
                        }


                        const alpha = lifeRatio * 0.82;
                        if (effectiveTrail === 'rainbow') {
                            const hue = (idx * 18 + this.runTime * 280) % 360;
                            ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
                            ctx.beginPath();
                            ctx.arc(t.x, t.y, 7.5 * lifeRatio, 0, Math.PI * 2);
                            ctx.fill();
                        } else if (effectiveTrail === 'glitch' || effectiveTrail === 'vhs_tape') {
                            const jitterX = (effectiveTrail === 'glitch' ? (Math.random() - 0.5) * 9 : Math.sin(idx * 0.8) * 5) * lifeRatio;
                            const cols = ['rgba(0, 245, 212, ', 'rgba(255, 10, 120, ', 'rgba(255, 255, 255, '];
                            ctx.fillStyle = `${cols[idx % cols.length]}${alpha})`;
                            ctx.fillRect(t.x - 4 * lifeRatio + jitterX, t.y - 2.5, 8 * lifeRatio, 5 * lifeRatio);
                        } else if (effectiveTrail === 'pixel' || effectiveTrail === 'matrix_code') {
                            const psize = Math.max(3, 8 * lifeRatio);
                            ctx.fillStyle = idx % 2 === 0
                                ? `rgba(74, 222, 128, ${alpha})`
                                : `rgba(0, 245, 212, ${alpha})`;
                            ctx.fillRect(Math.round(t.x - psize / 2), Math.round(t.y - psize / 2), psize, psize);
                        } else if (effectiveTrail === 'heart' || effectiveTrail === 'neko_paws') {
                            // Чёткие неоновые сердечки с умеренной частотой появления
                            if (seq % 6 !== 0) return;
                            const s = Math.max(0.38, lifeRatio * 1.18);
                            const hCol = effectiveTrail === 'neko_paws' ? '#fbbf24' : '#ff2a85';
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.1);
                            ctx.translate(t.x, t.y + 2);
                            ctx.scale(s, s);
                            ctx.shadowColor = hCol;
                            ctx.shadowBlur = 12;
                            ctx.fillStyle = hCol;
                            ctx.strokeStyle = '#ffffff';
                            ctx.lineWidth = 1.2;
                            ctx.beginPath();
                            ctx.moveTo(0, 5.5);
                            ctx.bezierCurveTo(-9.5, -2.5, -5.2, -10.5, 0, -5);
                            ctx.bezierCurveTo(5.2, -10.5, 9.5, -2.5, 0, 5.5);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();
                            ctx.restore();
                        } else if (effectiveTrail === 'void' || effectiveTrail === 'ufo_beam') {
                            // Чёрная дыра / грави-кольца с умеренной частотой появления
                            if (seq % 6 !== 0) return;
                            const ringR = Math.max(2.5, 8.5 * lifeRatio);
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.1);
                            if (effectiveTrail === 'void') {
                                ctx.shadowColor = '#c084fc';
                                ctx.shadowBlur = 12;
                                ctx.fillStyle = '#070112';
                                ctx.beginPath();
                                ctx.arc(t.x, t.y, ringR * 0.72, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = '#c084fc';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(t.x, t.y, ringR, 0, Math.PI * 2);
                                ctx.stroke();
                            } else {
                                ctx.shadowColor = '#4ade80';
                                ctx.shadowBlur = 10;
                                ctx.strokeStyle = '#4ade80';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(t.x, t.y, ringR, 0, Math.PI * 2);
                                ctx.stroke();
                            }
                            ctx.restore();
                        } else if (effectiveTrail === 'requiem_skulls') {
                            if (seq % 5 !== 0) return;
                            ctx.save(); ctx.globalAlpha = Math.min(1, lifeRatio * 1.3);
                            ctx.translate(t.x + Math.sin(seq * 1.7 + this.runTime * 2) * (1-lifeRatio) * 9, t.y);
                            ctx.rotate(Math.sin(seq * 0.7) * 0.32);
                            ctx.scale(0.65 + lifeRatio * 0.4, 0.65 + lifeRatio * 0.4);
                            if(this.overdriveActive){ctx.shadowColor='#ff244e';ctx.shadowBlur=8;}
                            this.drawRequiemSkull(ctx, this.overdriveActive?7:5.5, '#dd2641'); ctx.restore();
                        } else if (effectiveTrail === 'ghost_ectoplasm') {
                            // Призрачная эктоплазма: колышущиеся бирюзовые сгустки со светящимся ядром
                            ctx.save();
                            const wob = Math.sin(seq * 0.9 + this.runTime * 6) * 2.5 * lifeRatio;
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.05);
                            ctx.shadowColor = '#67e8f9';
                            ctx.shadowBlur = 12;
                            ctx.fillStyle = `rgba(103, 232, 249, ${alpha * 0.85})`;
                            ctx.beginPath();
                            ctx.arc(t.x + wob, t.y, 7 * lifeRatio, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = `rgba(236, 254, 255, ${alpha})`;
                            ctx.beginPath();
                            ctx.arc(t.x + wob, t.y - 1.5 * lifeRatio, 2.6 * lifeRatio, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.restore();
                        } else if (effectiveTrail === 'aurora_ribbon') {
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.2);
                            ctx.lineCap = 'round';
                            ctx.lineWidth = 2.2;
                            ctx.strokeStyle = idx % 2 ? '#c084fc' : '#67e8f9';
                            ctx.shadowColor = ctx.strokeStyle;
                            ctx.shadowBlur = 10;
                            const sway = Math.sin(seq * 0.7 + this.runTime * 5) * 4;
                            ctx.beginPath();
                            ctx.moveTo(t.x - 5, t.y - sway * 0.25);
                            ctx.quadraticCurveTo(t.x + sway, t.y + 2, t.x + 5, t.y + 5);
                            ctx.stroke();
                            ctx.restore();
                        } else if (effectiveTrail === 'lotus_petals') {
                            if (seq % 3 !== 0) return;
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.25);
                            ctx.translate(t.x, t.y);
                            ctx.rotate(seq * 0.55 + this.runTime * 2);
                            ctx.fillStyle = idx % 2 ? '#ff70d9' : '#c084fc';
                            ctx.shadowColor = ctx.fillStyle;
                            ctx.shadowBlur = 10;
                            ctx.beginPath();
                            ctx.ellipse(0, 0, 3.2 * lifeRatio, 7 * lifeRatio, 0, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = '#f5d0fe';
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                            ctx.restore();
                        } else if (effectiveTrail === 'ronin_slash') {
                            if (seq % 3 !== 0) return;
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.35);
                            ctx.translate(t.x, t.y);
                            ctx.rotate(-0.65);
                            ctx.strokeStyle = idx % 2 ? '#00f5d4' : '#ef4444';
                            ctx.shadowColor = ctx.strokeStyle;
                            ctx.shadowBlur = 10;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(-7 * lifeRatio, 0);
                            ctx.lineTo(7 * lifeRatio, 0);
                            ctx.stroke();
                            ctx.strokeStyle = '#ffffff';
                            ctx.lineWidth = 0.6;
                            ctx.stroke();
                            ctx.restore();
                        } else if (effectiveTrail === 'prism_shards') {
                            if (seq % 2 !== 0) return;
                            const hue = (seq * 37 + this.runTime * 150) % 360;
                            const shard = 7 * lifeRatio;
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.3);
                            ctx.translate(t.x, t.y);
                            ctx.rotate(seq * 0.42);
                            ctx.fillStyle = `hsl(${hue}, 95%, 72%)`;
                            ctx.shadowColor = ctx.fillStyle;
                            ctx.shadowBlur = 10;
                            ctx.beginPath();
                            ctx.moveTo(0, -shard);
                            ctx.lineTo(shard * 0.65, shard * 0.6);
                            ctx.lineTo(-shard * 0.65, shard * 0.35);
                            ctx.closePath();
                            ctx.fill();
                            ctx.strokeStyle = '#ffffff';
                            ctx.lineWidth = 0.65;
                            ctx.stroke();
                            ctx.restore();
                        } else if (effectiveTrail === 'valkyrie_wings') {
                            // Фирменный шлейф «Крылья Валькирии»: двойные крылатые дуги + золотые перья-искры
                            const spread = (1 - lifeRatio) * 16;
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.15);
                            for (let side = -1; side <= 1; side += 2) {
                                const wx = t.x + side * (5 + spread);
                                const wy = t.y + 4;
                                ctx.fillStyle = side < 0 ? '#00f5d4' : '#ff0a78';
                                ctx.shadowColor = side < 0 ? '#00f5d4' : '#ff0a78';
                                ctx.shadowBlur = 10;
                                ctx.beginPath();
                                ctx.moveTo(wx, wy - 4 * lifeRatio);
                                ctx.lineTo(wx + side * 6 * lifeRatio, wy + 2 * lifeRatio);
                                ctx.lineTo(wx, wy + 5 * lifeRatio);
                                ctx.lineTo(wx - side * 2.5 * lifeRatio, wy);
                                ctx.closePath();
                                ctx.fill();
                            }
                            if (seq % 3 === 0) {
                                const gSize = Math.max(2, 6.5 * lifeRatio);
                                ctx.translate(t.x, t.y + 2);
                                ctx.fillStyle = '#ffd60a';
                                ctx.shadowColor = '#ffd60a';
                                ctx.shadowBlur = 12;
                                ctx.beginPath();
                                ctx.moveTo(0, -gSize);
                                ctx.lineTo(gSize * 0.45, 0);
                                ctx.lineTo(0, gSize);
                                ctx.lineTo(-gSize * 0.45, 0);
                                ctx.closePath();
                                ctx.fill();
                            }
                            ctx.restore();
                        } else if (effectiveTrail === 'aurum_dust') {
                            if (seq % 2 !== 0) return;
                            const starSize = Math.max(1.5, 8 * lifeRatio);
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.45);
                            ctx.translate(t.x + Math.sin(seq) * 2, t.y);
                            ctx.rotate(this.runTime * 1.8 + seq * 0.2);
                            ctx.fillStyle = idx % 3 ? '#ffd60a' : '#fff7cc';
                            ctx.shadowColor = '#ffd60a';
                            ctx.shadowBlur = 14;
                            ctx.beginPath();
                            ctx.moveTo(0, -starSize);
                            ctx.lineTo(starSize * 0.25, -starSize * 0.25);
                            ctx.lineTo(starSize, 0);
                            ctx.lineTo(starSize * 0.25, starSize * 0.25);
                            ctx.lineTo(0, starSize);
                            ctx.lineTo(-starSize * 0.25, starSize * 0.25);
                            ctx.lineTo(-starSize, 0);
                            ctx.lineTo(-starSize * 0.25, -starSize * 0.25);
                            ctx.closePath();
                            ctx.fill();
                            ctx.restore();
                        } else if (effectiveTrail === 'crimson_slash' || effectiveTrail === 'solar_gold' || effectiveTrail === 'imperial_crown') {
                            const col = effectiveTrail === 'crimson_slash'
                                ? `rgba(255, 42, 133, ${alpha})`
                                : (effectiveTrail === 'solar_gold' ? `rgba(255, 214, 10, ${alpha})` : `rgba(192, 132, 252, ${alpha})`);
                            ctx.save();
                            ctx.translate(t.x, t.y);
                            ctx.rotate(Math.PI / 4);
                            ctx.fillStyle = col;
                            const d = 9 * lifeRatio;
                            ctx.fillRect(-d / 2, -d / 2, d, d);
                            ctx.restore();
                        } else if (effectiveTrail === 'toast_crumbs' || effectiveTrail === 'dragon_fire') {
                            ctx.fillStyle = effectiveTrail === 'toast_crumbs'
                                ? `rgba(255, 214, 10, ${alpha})`
                                : `rgba(255, 159, 28, ${alpha})`;
                            ctx.beginPath();
                            ctx.arc(t.x + Math.sin(idx) * 3, t.y, 7.5 * lifeRatio, 0, Math.PI * 2);
                            ctx.fill();
                        } else if (effectiveTrail === 'kitsune_foxfire') {
                            // Лисий огонь кицунэ: парящие розово-бирюзовые огоньки-капли с белым ядром
                            if (seq % 2 !== 0) return;
                            ctx.save();
                            const wob = Math.sin(seq * 1.3 + this.runTime * 5) * 3 * lifeRatio;
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.25);
                            ctx.translate(t.x + wob, t.y);
                            const foxCol = idx % 2 ? '#f472b6' : '#67e8f9';
                            ctx.shadowColor = foxCol;
                            ctx.shadowBlur = 12;
                            ctx.fillStyle = foxCol;
                            const fs = 7.5 * lifeRatio;
                            ctx.beginPath();
                            ctx.moveTo(0, -fs * 1.35);
                            ctx.quadraticCurveTo(fs * 0.95, -fs * 0.25, 0, fs * 0.85);
                            ctx.quadraticCurveTo(-fs * 0.95, -fs * 0.25, 0, -fs * 1.35);
                            ctx.closePath();
                            ctx.fill();
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                            ctx.beginPath();
                            ctx.arc(0, -fs * 0.15, fs * 0.3, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.restore();
                        } else if (effectiveTrail === 'astral_stars') {
                            // Звёздная пыль астрала: мерцающие звёздные искры с голубым ореолом
                            if (seq % 2 !== 0) return;
                            ctx.save();
                            const wob = Math.sin(seq * 1.1 + this.runTime * 4) * 2 * lifeRatio;
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.3);
                            ctx.translate(t.x + wob, t.y);
                            ctx.rotate(seq * 0.6 + this.runTime * 2);
                            const col = idx % 3 === 0 ? '#ffffff' : (idx % 3 === 1 ? '#bae6fd' : '#c4b5fd');
                            ctx.shadowColor = col;
                            ctx.shadowBlur = 10;
                            ctx.fillStyle = col;
                            const s = 6 * lifeRatio;
                            ctx.beginPath();
                            ctx.moveTo(0, -s);
                            ctx.lineTo(s * 0.28, -s * 0.28);
                            ctx.lineTo(s, 0);
                            ctx.lineTo(s * 0.28, s * 0.28);
                            ctx.lineTo(0, s);
                            ctx.lineTo(-s * 0.28, s * 0.28);
                            ctx.lineTo(-s, 0);
                            ctx.lineTo(-s * 0.28, -s * 0.28);
                            ctx.closePath();
                            ctx.fill();
                            ctx.restore();
                        } else if (effectiveTrail === 'magma_drips') {
                            // Капли расплавленной магмы: оранжево-красные капли с тёмным ядром
                            ctx.save();
                            const wob = Math.sin(seq * 0.9 + this.runTime * 3) * 2.2 * lifeRatio;
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.2);
                            ctx.translate(t.x + wob, t.y);
                            const mCol = idx % 2 ? '#fb923c' : '#ef4444';
                            ctx.shadowColor = mCol;
                            ctx.shadowBlur = 12;
                            ctx.fillStyle = mCol;
                            const ms = 7.5 * lifeRatio;
                            ctx.beginPath();
                            ctx.moveTo(0, -ms * 1.1);
                            ctx.quadraticCurveTo(ms * 0.9, -ms * 0.1, ms * 0.4, ms * 0.8);
                            ctx.quadraticCurveTo(0, ms * 1.1, -ms * 0.4, ms * 0.8);
                            ctx.quadraticCurveTo(-ms * 0.9, -ms * 0.1, 0, -ms * 1.1);
                            ctx.closePath();
                            ctx.fill();
                            ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
                            ctx.beginPath();
                            ctx.arc(0, -ms * 0.3, ms * 0.25, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.restore();
                        } else if (effectiveTrail === 'neon_binary') {
                            // Неоновая бинарная матрица: падающие цифры 0 и 1
                            if (seq % 3 !== 0) return;
                            ctx.save();
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.4);
                            ctx.translate(t.x, t.y);
                            const digit = (seq + idx) % 2 === 0 ? '1' : '0';
                            const bCol = idx % 3 === 0 ? '#4ade80' : (idx % 3 === 1 ? '#00f5d4' : '#a3e635');
                            ctx.shadowColor = bCol;
                            ctx.shadowBlur = 10;
                            ctx.fillStyle = bCol;
                            const fontSize = Math.max(8, 14 * lifeRatio);
                            ctx.font = `900 ${fontSize}px "Exo 2", sans-serif`;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(digit, 0, 0);
                            ctx.restore();
                        } else if (effectiveTrail === 'cryo_frost') {
                            // Крио-иней: ледяные кристаллы-снежинки
                            if (seq % 2 !== 0) return;
                            ctx.save();
                            const wob = Math.sin(seq * 1.4 + this.runTime * 3) * 2.5 * lifeRatio;
                            ctx.globalAlpha = Math.min(1, lifeRatio * 1.25);
                            ctx.translate(t.x + wob, t.y);
                            ctx.rotate(seq * 0.5 + this.runTime * 1.5);
                            const cCol = idx % 2 ? '#bae6fd' : '#67e8f9';
                            ctx.strokeStyle = cCol;
                            ctx.shadowColor = cCol;
                            ctx.shadowBlur = 10;
                            ctx.lineWidth = 1.4;
                            const cs = 6.5 * lifeRatio;
                            for (let arm = 0; arm < 6; arm++) {
                                const a = arm * Math.PI / 3;
                                ctx.beginPath();
                                ctx.moveTo(0, 0);
                                ctx.lineTo(Math.cos(a) * cs, Math.sin(a) * cs);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(Math.cos(a) * cs * 0.55, Math.sin(a) * cs * 0.55);
                                ctx.lineTo(Math.cos(a + 0.5) * cs * 0.3, Math.sin(a + 0.5) * cs * 0.3);
                                ctx.moveTo(Math.cos(a) * cs * 0.55, Math.sin(a) * cs * 0.55);
                                ctx.lineTo(Math.cos(a - 0.5) * cs * 0.3, Math.sin(a - 0.5) * cs * 0.3);
                                ctx.stroke();
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.beginPath();
                            ctx.arc(0, 0, cs * 0.22, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.restore();
                        } else {
                            let prefix = shipCfg.trail;
                            if (effectiveTrail === 'vhs_sunset') {
                                prefix = (idx % 2 === 0) ? 'rgba(0, 245, 212, ' : 'rgba(255, 10, 120, ';
                            } else if (effectiveTrail && effectiveTrail.startsWith('rgba')) {
                                prefix = effectiveTrail;
                            }
                            ctx.fillStyle = `${prefix}${alpha})`;
                            ctx.beginPath();
                            ctx.arc(t.x, t.y, 7.5 * lifeRatio, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    });

                    ctx.save();
                    ctx.translate(this.player.x, this.player.y);
                    ctx.rotate(driveScenery ? this.driveOutrunScene.motion.bank : this.player.tilt);

                    if (this.magnetTimer > 0) {
                        ctx.strokeStyle = 'rgba(192, 132, 252, 0.55)';
                        ctx.lineWidth = 2;
                        ctx.setLineDash([5, 5]);
                        ctx.beginPath();
                        ctx.arc(0, 0, this.player.radius + 19, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }

                    if (this.player.shield) {
                        ctx.strokeStyle = '#60a5fa';
                        ctx.lineWidth = 2.5;
                        ctx.shadowColor = '#3b82f6';
                        ctx.shadowBlur = 15;
                        ctx.beginPath();
                        ctx.arc(0, 0, this.player.radius + 9, 0, Math.PI * 2);
                        ctx.stroke();
                    }

                    if (this.combo > 1 && this.comboTimer > 0) {
                        const ratio = Math.max(0, this.comboTimer / this.comboDuration);
                        ctx.strokeStyle = 'rgba(0, 243, 255, 0.45)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(0, 0, this.player.radius + 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio);
                        ctx.stroke();
                    }

                    const shipDrawCfg = shipCfg.id === 'crimson_requiem'
                        ? {...shipCfg, requiemMorph: this._requiemMorph || 0}
                        : (this.overdriveActive ? { ...shipCfg, primary: '#00f5d4', secondary: '#ffffff' } : shipCfg);

                    // Пламя двигателя (не рисуем для шуточного скина парящей головы «42»)
                    if (shipCfg.shape !== 'skin42' && shipCfg.shape !== 'requiem' && !detailedShipModels.has(shipCfg.id)) {
                        ctx.save();
                        ctx.shadowColor = this.overdriveActive ? '#8b5cf6' : shipCfg.primary;
                        ctx.shadowBlur = 18;
                        const flame = 6 + Math.sin(this.runTime * 26) * 2.4 + (this.overdriveActive ? 5 : 0);
                        ctx.fillStyle = this.overdriveActive ? 'rgba(139, 92, 246, 0.85)' : shipCfg.trail + '0.9)';
                        ctx.beginPath();
                        ctx.moveTo(-4, 12);
                        ctx.lineTo(0, 12 + flame);
                        ctx.lineTo(4, 12);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    }

                    this.drawShipShape(ctx, shipDrawCfg, this.runTime, 1.0, this.player.rudderSteering);
                    ctx.restore();
                }

                // Отрисовка Босса и его плазменных зарядов в режимах «ДРАЙВ» и «ЗАЧИСТКА»
                if (this.driveBoss) {
                    this.drawDriveBoss();
                }
                if (this.clearanceBoss) {
                    this.drawClearanceBoss();
                }
                this.clearanceBossBullets.forEach(cb => {
                    ctx.save();
                    ctx.translate(cb.x, cb.y);
                    ctx.shadowColor = '#ffd60a';
                    ctx.shadowBlur = 14;
                    ctx.fillStyle = '#ff0a78';
                    ctx.beginPath();
                    ctx.arc(0, 0, cb.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffd60a';
                    ctx.beginPath();
                    ctx.arc(0, 0, cb.r * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
                this.bossProjectiles.forEach(bp => {
                    const direction = Math.atan2(bp.vy, bp.vx) - Math.PI / 2;
                    this.drawDriveProjectile(bp, bp.r, '#ff387f', '#ffe5a2', direction);
                });

                this.particles.forEach(p => {
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
                    ctx.restore();
                });

                this.floatingTexts.forEach(ft => {
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, ft.life / 0.95);
                    ctx.font = '800 11px "Exo 2", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = ft.color;
                    ctx.shadowColor = '#000';
                    ctx.shadowBlur = 6;
                    drawXpaceText(ctx, ft.text, ft.x, ft.y);
                    ctx.restore();
                });

                ctx.restore();
            },

            getGameplayFps() {
                const { perfMode, customFps } = this.settings;
                if (perfMode === 'high') return 120;
                if (perfMode === 'custom') return Math.max(15, Math.min(240, Math.round(Number(customFps) || 90)));
                return this.flightMode() === 'DRIVE' ? 0 : 60;
            },

            loop(now) {
                requestAnimationFrame((t) => this.loop(t));
                if (document.hidden) {
                    this.lastFrameTime = now;
                    this.nextFrameTime = null;
                    return;
                }
                if (this._lastStateCls !== this.state) {
                    this._lastStateCls = this.state;
                    document.body.classList.toggle('xp-playing', this.state === 'PLAYING');
                    this.nextFrameTime = null;
                }

                const targetFps = this.state === 'PLAYING' ? this.getGameplayFps() : 30;
                if (targetFps > 0) {
                    if (this.frameTargetFps !== targetFps || this.nextFrameTime == null || this.lastFrameTime > this.nextFrameTime) {
                        this.nextFrameTime = now;
                    }
                    const interval = 1000 / targetFps;
                    if (now + 0.5 < this.nextFrameTime) return;
                    // Keep the original cadence when a refresh comes late or a frame is missed.
                    const missed = Math.max(0, Math.floor((now - this.nextFrameTime) / interval));
                    this.nextFrameTime += (missed + 1) * interval;
                }
                this.frameTargetFps = targetFps;

                const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameTime) / 1000));
                this.lastFrameTime = now;

                this.update(dt);
                this.draw();
            },

            startLoop() {
                this.lastFrameTime = performance.now();
                requestAnimationFrame((t) => this.loop(t));
            }
        });
