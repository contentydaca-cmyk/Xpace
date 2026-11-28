        // Main renderer and animation loop
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            draw() {
                const ctx = this.ctx;
                const isDrive = this.flightMode() === 'DRIVE';
                const driveScenery = isDrive && this.state !== 'MENU';
                const shaking = this.shakeTime > 0 && this.state !== 'REFIT';
                // The Outrun base covers the whole canvas when the camera is steady.
                if (!driveScenery || shaking) ctx.clearRect(0, 0, this.width, this.height);

                ctx.save();
                if (shaking) {
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
                    if (b.customStyle) {
                        drawCustomShipShot(ctx, b, this.runTime);
                        return;
                    }
                    if (b.volcanic) {
                        drawVolcanicShot(ctx, b);
                        return;
                    }
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
                    this.drawEquippedPlayerTrail(ctx, this.resolveEffectiveTrailId(shipCfg));

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

                    // Общее пламя для кораблей без отдельного эффекта двигателя.
                    if (shipCfg.shape !== 'skin42' && shipCfg.shape !== 'requiem' && shipCfg.shape !== 'kitsune' && !detailedShipModels.has(shipCfg.id)) {
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

                    const steering = shipCfg.id === 'volcanic' ? this.player.tilt : this.player.rudderSteering;
                    const shotAge = this.runTime - (this.lastPlayerShotAt ?? -100);
                    const shotPulse = Math.max(0, 1 - shotAge / 0.12) * (detailedShipMotion.matches ? 0.45 : 1);
                    const superDeployment = shipCfg.superFormColor ? this.getShipSuperDeployment() : undefined;
                    this.drawShipShape(ctx, shipDrawCfg, this.runTime, 1.0, steering, this.overdriveActive, shotPulse, superDeployment);
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
                    if (p.impact) {
                        ctx.translate(p.x, p.y);
                        p.impact(ctx, 1 - ctx.globalAlpha);
                    } else {
                        ctx.fillStyle = p.color;
                        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
                    }
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
                if (this.activeShopTab === 'MASKS' && !document.getElementById('hangarOverlay').classList.contains('hidden')) this.paintGarage(now);
                else this.updateShipPreviews(now);
                if (this.renderBlockingOverlays.every(overlay => overlay.classList.contains('hidden'))) this.draw();
            },

            startLoop() {
                this.renderBlockingOverlays = ['contractsOverlay', 'hangarOverlay', 'settingsOverlay'].map(id => document.getElementById(id)).filter(Boolean);
                this.lastFrameTime = performance.now();
                requestAnimationFrame((t) => this.loop(t));
            }
        });
