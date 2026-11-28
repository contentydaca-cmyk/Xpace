        // Bosses and enemy UFOs
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            // =========================================================================
            // БОСС КЛАССИЧЕСКОГО РЕЖИМА «ДРАЙВ» (УРОН ТОЛЬКО ОТ ФИОЛЕТОВЫХ ИСКР!)
            // =========================================================================
            spawnDriveBoss() {
                const tier = ++this.driveBossTier;
                const maxHp = 100 + (tier - 1) * 40;
                this.driveBoss = {
                    name: tier === 1 ? 'ЮНКЕР-ОВЕРЛОРД' : `ЮНКЕР-ОВЕРЛОРД MK-${tier}`,
                    x: this.width * 0.5,
                    y: -90,
                    targetY: 236,
                    w: 124,
                    h: 54,
                    hp: maxHp,
                    maxHp: maxHp,
                    dir: 1,
                    vx: 0,
                    maxSpeed: 115 + tier * 10,
                    attackTimer: 2.3,
                    attackIndex: 0,
                    laserX: this.width * 0.5,
                    laserPhase: 'none', // none | warning | firing
                    laserTimer: 0,
                    flashTimer: 0,
                    pulse: 0
                };
                this.bossProjectiles = [];
                this.purpleSparks = [];
                this.homingBossShots = [];
                this.purpleSparkTimer = 1.1;

                // Сразу выпускаем 2 фиолетовые искры для атаки по Боссу
                this.spawnPurpleBossSpark();
                this.spawnPurpleBossSpark();

                this.sound.playOverdriveStart();
                this.triggerShake(9, 0.45);
                this.showToast(`[[xp:warning]] БОСС (${this.nextDriveBossScore}): СОБИРАЙ ФИОЛЕТОВЫЕ ИСКРЫ!`);
                this.addFloatingText(this.width * 0.5, 215, `[[xp:skull]] БОСС: ЛОВИ ФИОЛЕТОВЫЕ ИСКРЫ!`, '#c084fc');
            },

            spawnPurpleBossSpark() {
                if (!this.driveBoss) return;
                const margin = 36;
                const x = margin + Math.random() * Math.max(40, this.width - margin * 2);
                const startY = Math.max(185, this.driveBoss.y + 24);
                this.purpleSparks.push({
                    x: x,
                    y: startY,
                    baseX: x,
                    r: 14,
                    vy: 155 + Math.random() * 35,
                    swayPhase: Math.random() * Math.PI * 2,
                    swayAmp: 24 + Math.random() * 22,
                    pulse: 0
                });
            },

            damageDriveBoss(dmg, label = '', x = this.driveBoss?.x, y = this.driveBoss?.y) {
                if (!this.driveBoss) return;
                this.driveBoss.hp = Math.max(0, this.driveBoss.hp - dmg);
                bossModels.hit(this.driveBoss, x, y, 0.09);
                if (label) {
                    this.addFloatingText(this.driveBoss.x, this.driveBoss.y + 30, `${label} -${dmg}`, '#e9d5ff');
                }
                if (this.driveBoss.hp <= 0) {
                    this.onDriveBossDefeated();
                }
            },

            onDriveBossDefeated() {
                const boss = this.driveBoss;
                if (!boss) return;
                this.driveBoss = null;
                this.bossProjectiles = [];
                this.purpleSparks = [];
                this.homingBossShots = [];

                this.sound.playLevelUp();
                this.triggerShake(14, 0.55);
                for (let k = -2; k <= 2; k++) {
                    this.spawnExplosion(boss.x + k * 24, boss.y + (k % 2) * 10, k % 2 === 0 ? '#c084fc' : '#ffd60a', 18);
                }

                const bonusScore = this.awardRunScore(Math.round(5000 * 0.85));
                const bonusSparks = this.pass.awardSparks(128);
                const bonusXp = Math.round(200 * 0.85);

                this.runSparks += bonusSparks;
                this.runXp += bonusXp;
                this.pass.addXp(bonusXp);
                this.pass.recordActiveContractProgress('bossesDefeated', 1, false);
                this.pass.triggerSave();

                const baseScore = this.score >= LATE_GAME_BOSS_SCORE ? Math.floor(this.score) : this.nextDriveBossScore;
                this.nextDriveBossScore = baseScore + DRIVE_BOSS_SCORE_STEP;
                this.nextScoreBossTime = this.runTime + BOSS_RESPAWN_DELAY;
                this.spawnTimer = 1.6;

                this.addFloatingText(boss.x, boss.y, `[[xp:trophy]] БОСС ПОВЕРЖЕН! +${bonusScore} ОЧКОВ!`, '#ffd60a');
                this.showToast(`[[xp:trophy]] БОСС ПОВЕРЖЕН! +${bonusScore} очков, +${bonusSparks} [[xp:spark]] и +${bonusXp} XP!`);
            },

            updateDriveBoss(dt, obsTimeScale) {
                const boss = this.driveBoss;
                if (!boss) return;

                const bDt = dt * obsTimeScale;
                boss.pulse += bDt * 5;
                bossModels.update(boss, dt, bDt);

                // Плавный выход на боевую позицию
                const dy = boss.targetY - boss.y;
                if (Math.abs(dy) > 0.4) {
                    boss.y += dy * (1 - Math.exp(-3.2 * bDt));
                } else {
                    boss.y = boss.targetY + Math.sin(boss.pulse * 0.55) * 6;
                }

                // Плавное патрулирование по горизонтали
                const margin = boss.w * 0.5 + 18;
                if (boss.x <= margin) boss.dir = 1;
                else if (boss.x >= this.width - margin) boss.dir = -1;

                const desiredVx = boss.dir * boss.maxSpeed;
                boss.vx += (desiredVx - boss.vx) * (1 - Math.exp(-4.2 * bDt));
                boss.x += boss.vx * bDt;
                boss.x = Math.max(margin, Math.min(this.width - margin, boss.x));

                // Регулярный спавн фиолетовых искр, которыми игрок атакует Босса
                this.purpleSparkTimer -= dt;
                if (this.purpleSparkTimer <= 0) {
                    if (this.purpleSparks.length < 4) {
                        this.spawnPurpleBossSpark();
                    }
                    this.purpleSparkTimer = 1.35;
                }

                // Логика атак Босса (после выхода на позицию)
                if (Math.abs(dy) < 22) {
                    if (boss.laserPhase === 'warning') {
                        boss.laserTimer -= bDt;
                        if (boss.laserTimer > 0.45) {
                            boss.laserX += (this.player.x - boss.laserX) * (1 - Math.exp(-3.5 * bDt));
                        }
                        if (boss.laserTimer <= 0) {
                            boss.laserPhase = 'firing';
                            boss.laserTimer = 0.42;
                            bossModels.fired(boss, 1);
                            this.sound.playShieldBreak();
                            this.triggerShake(6, 0.25);
                        }
                    } else if (boss.laserPhase === 'firing') {
                        boss.laserTimer -= bDt;
                        const beamHalfW = 14;
                        if (Math.abs(this.player.x - boss.laserX) < beamHalfW + this.player.radius * 0.65 && this.player.y > boss.y) {
                            if (this.devGodMode || this.overdriveActive) {
                                // защита
                            } else if (this.player.shield) {
                                this.player.shield = false;
                                document.getElementById('shieldIndicator').classList.remove('active');
                                this.sound.playShieldBreak();
                                this.spawnExplosion(this.player.x, this.player.y, '#3b82f6', 18);
                                this.addFloatingText(this.player.x, this.player.y - 18, 'ЩИТ ОТБИЛ ЛУЧ!', '#93c5fd');
                                boss.laserPhase = 'none';
                            } else {
                                this.gameOver();
                                return;
                            }
                        }
                        if (boss.laserTimer <= 0) {
                            boss.laserPhase = 'none';
                        }
                    }

                    boss.attackTimer -= bDt;
                    if (boss.attackTimer <= 0) {
                        const mode = boss.attackIndex % 3;
                        boss.attackIndex++;
                        if (mode === 0) {
                            // Атака 1: Веер из 4 плазменных шаров
                            bossModels.fired(boss, mode);
                            const count = 4;
                            for (let k = 0; k < count; k++) {
                                const spread = -0.36 + (k / (count - 1)) * 0.72;
                                const spd = 250;
                                this.bossProjectiles.push({
                                    x: boss.x + (k - 1.5) * 22,
                                    y: boss.y + 24,
                                    vx: Math.sin(spread) * spd,
                                    vy: Math.cos(spread) * spd,
                                    r: 7
                                });
                            }
                            this.sound.playLaserWarning();
                            boss.attackTimer = 2.4;
                        } else if (mode === 1) {
                            // Атака 2: Орбитальный снайперский луч с предупреждением
                            boss.laserX = this.player.x;
                            boss.laserPhase = 'warning';
                            boss.laserTimer = 1.15;
                            this.sound.playLaserWarning();
                            boss.attackTimer = 2.65;
                        } else {
                            // Атака 3: Энерго-волна с широким безопасным окном
                            bossModels.fired(boss, mode);
                            const gapW = Math.max(112, this.width * 0.36);
                            const gapX = 24 + Math.random() * Math.max(10, this.width - gapW - 48);
                            this.obstacles.push({
                                type: 'laser_gate',
                                gapX: gapX,
                                gapW: gapW,
                                y: boss.y + 22,
                                h: 14,
                                vy: 240,
                                grazed: false
                            });
                            this.sound.playLaserWarning();
                            boss.attackTimer = 2.45;
                        }
                    }
                }

                // Столкновение игрока с корпусом Босса
                const hitBoxW = boss.w * 0.48 + this.player.radius * 0.7;
                const hitBoxH = boss.h * 0.48 + this.player.radius * 0.7;
                if (Math.abs(this.player.x - boss.x) < hitBoxW && Math.abs(this.player.y - boss.y) < hitBoxH) {
                    this.player.y = Math.min(this.height - 32, boss.y + hitBoxH + 14);
                    if (this.devGodMode || this.overdriveActive) {
                        this.spawnExplosion(boss.x, boss.y + 18, '#c084fc', 14);
                        this.addFloatingText(this.player.x, this.player.y - 18, 'ЛОВИ ФИОЛЕТОВЫЕ ИСКРЫ!', '#e9d5ff');
                    } else if (this.player.shield) {
                        this.player.shield = false;
                        document.getElementById('shieldIndicator').classList.remove('active');
                        this.sound.playShieldBreak();
                        this.spawnExplosion(this.player.x, this.player.y, '#3b82f6', 20);
                        this.addFloatingText(this.player.x, this.player.y - 18, 'ЩИТ СПАС!', '#93c5fd');
                    } else {
                        this.gameOver();
                        return;
                    }
                }
            },

            drawDriveBoss() {
                const boss = this.driveBoss;
                if (!boss) return;
                const ctx = this.ctx;

                // Вертикальный луч босса (предупреждение или выстрел)
                if (boss.laserPhase === 'warning') {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(255, 10, 120, 0.78)';
                    ctx.lineWidth = 2.2;
                    ctx.setLineDash([9, 7]);
                    ctx.beginPath();
                    ctx.moveTo(boss.laserX, boss.y + 20);
                    ctx.lineTo(boss.laserX, this.height);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = '#ffd60a';
                    ctx.font = '900 13px "Exo 2", sans-serif';
                    ctx.textAlign = 'center';
                    drawXpaceText(ctx, '[[xp:warning]]', boss.laserX, boss.y + 44);
                    ctx.restore();
                } else if (boss.laserPhase === 'firing') {
                    ctx.save();
                    ctx.shadowColor = '#ff0a78';
                    ctx.shadowBlur = 22;
                    ctx.fillStyle = 'rgba(255, 10, 120, 0.86)';
                    ctx.fillRect(boss.laserX - 14, boss.y + 16, 28, this.height - boss.y);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(boss.laserX - 4, boss.y + 16, 8, this.height - boss.y);
                    ctx.restore();
                }

                bossModels.drawOverlord(ctx, boss);

                // Полоска здоровья Босса (опущена ниже, чтобы не перекрывалась счётом и баффами/дебаффами)
                ctx.save();
                const barW = Math.min(265, this.width - 44);
                const barH = 10;
                const bx = (this.width - barW) / 2;
                const by = 172;

                ctx.fillStyle = 'rgba(9, 1, 20, 0.85)';
                drawRoundRect(ctx, bx - 4, by - 16, barW + 8, barH + 21, 7);
                ctx.fill();
                ctx.strokeStyle = '#c084fc';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = '#e9d5ff';
                ctx.font = '900 8.5px "Exo 2", sans-serif';
                ctx.textAlign = 'center';
                drawXpaceText(ctx, `[[xp:skull]] ${boss.name} · ${boss.hp}/${boss.maxHp} (ФИОЛЕТ. ИСКРЫ)`, this.width / 2, by - 5);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
                drawRoundRect(ctx, bx, by, barW, barH, 4);
                ctx.fill();

                const hpRatio = Math.max(0, boss.hp / boss.maxHp);
                const hpGrad = ctx.createLinearGradient(bx, 0, bx + barW, 0);
                hpGrad.addColorStop(0, '#ff0a78');
                hpGrad.addColorStop(0.5, '#a855f7');
                hpGrad.addColorStop(1, '#c084fc');
                ctx.fillStyle = hpGrad;
                if (hpRatio > 0) {
                    drawRoundRect(ctx, bx, by, Math.max(6, barW * hpRatio), barH, 4);
                    ctx.fill();
                }
                ctx.restore();
            },

            // =========================================================================
            // ВРАЖЕСКАЯ ЛЕТАЮЩАЯ ТАРЕЛКА (НЛО), КОТОРАЯ СТРЕЛЯЕТ В РЕЖИМЕ «ЗАЧИСТКА»
            // =========================================================================
            spawnEnemyUfo() {
                const r = 19;
                const margin = 42;
                const startX = margin + Math.random() * Math.max(40, this.width - margin * 2);
                const targetY = 112 + Math.random() * Math.min(90, this.height * 0.15);
                const hp = Math.max(6, Math.round(6 + this.difficulty * 2.2));
                const dir = Math.random() < 0.5 ? -1 : 1;
                const maxSpeed = 105 + this.difficulty * 14;

                this.enemyUfos.push({
                    x: startX,
                    y: -32,
                    baseY: -32,
                    targetY: targetY,
                    r: r,
                    hp: hp,
                    maxHp: hp,
                    dir: dir,
                    maxSpeed: maxSpeed,
                    vx: dir * maxSpeed * 0.5,
                    tilt: 0,
                    hoverPhase: 0,
                    hoverBlend: 0,
                    fireTimer: 1.35,
                    lifeTimer: 13.5,
                    leaving: false,
                    leaveVy: 0,
                    flashTimer: 0
                });

                this.sound.playUfoSpawn();
                this.addFloatingText(startX, 92, '[[xp:ufo]] ВРАЖЕСКОЕ НЛО!', '#ff0a78');
            },

            onEnemyUfoDestroyed(ufo) {
                this.sound.playRockDestroy();
                this.spawnExplosion(ufo.x, ufo.y, '#ff0a78', 18);
                this.spawnExplosion(ufo.x, ufo.y, '#a3e635', 14);
                this.triggerShake(5, 0.22);

                const shipPerk = this.getActiveShipPerk();
                const scoreMult = (this.overdriveActive ? 2 : 1) * (1 + shipPerk.score);
                const pts = this.awardRunScore(180 * this.combo * scoreMult, true, true);

                this.runRocksDestroyed += 1;
                this.pass.recordProgress('destroy_rocks', 1, false);

                this.addFloatingText(ufo.x, ufo.y - 10, `[[xp:ufo]] СБИТО НЛО +${pts}!`, '#a3e635');
                if (Math.random() < 0.55) {
                    this.spawnRockDrop(ufo.x, ufo.y, 'buff');
                } else {
                    this.rareCoins.push({ x: ufo.x, y: ufo.y, r: 15, vy: 195, phase: 0 });
                }
            },


            // =========================================================================
            // БОСС РЕЖИМА «ЗАЧИСТКА» (АРХИТЕКТОР РОЯ — МНОГОФАЗНЫЙ БОЙ С ЛАЗЕРАМИ)
            // =========================================================================
            spawnClearanceBoss() {
                this.clearanceBossTier = (this.clearanceBossTier || 0) + 1;
                const tier = this.expedition ? Math.min(6, this.clearanceBossTier) : this.clearanceBossTier;
                const maxHp = Math.round(90 + tier * 55);
                this.clearanceBoss = {
                    name: tier === 1 ? 'АРХИТЕКТОР РОЯ' : `АРХИТЕКТОР РОЯ MK-${tier}`,
                    x: this.width * 0.5,
                    y: -95,
                    targetY: 224,
                    w: 132,
                    h: 58,
                    hp: maxHp,
                    maxHp: maxHp,
                    dir: 1,
                    vx: 0,
                    maxSpeed: 98 + tier * 12,
                    attackTimer: 1.9,
                    attackIndex: 0,
                    flashTimer: 0,
                    pulse: 0
                };
                this.clearanceBossBullets = [];
                this.sound.playOverdriveStart();
                this.triggerShake(9, 0.45);
                this.showToast(`[[xp:warning]] БОСС ЗАЧИСТКИ: ${this.clearanceBoss.name} (${maxHp} HP)!`);
                this.addFloatingText(this.width * 0.5, 200, `[[xp:skull]] БОСС: ${this.clearanceBoss.name}!`, '#ffd60a');
            },

            onClearanceBossDefeated(boss) {
                if (!boss || this.clearanceBoss !== boss) return;
                this.clearanceBoss = null;
                this.clearanceBossBullets = [];

                this.sound.playLevelUp();
                this.triggerShake(14, 0.55);
                for (let k = -2; k <= 2; k++) {
                    this.spawnExplosion(boss.x + k * 25, boss.y + (k % 2) * 12, k % 2 === 0 ? '#ffd60a' : '#ff0a78', 18);
                }

                const shipPerk = this.getActiveShipPerk();
                const scoreMult = (this.overdriveActive ? 2 : 1) * (1 + shipPerk.score);

                const bonusScore = this.awardRunScore(2800 * scoreMult, true, true);
                const bonusSparks = this.pass.awardSparks(110);
                const bonusXp = 150;

                if (!this.expedition) {
                    const scoreStep = this.score >= LATE_GAME_BOSS_SCORE ? CLEARANCE_BOSS_LATE_SCORE_STEP : CLEARANCE_BOSS_SCORE_STEP;
                    this.nextClearanceBossScore = Math.floor(this.score) + scoreStep;
                    this.nextScoreBossTime = this.runTime + BOSS_RESPAWN_DELAY;
                }
                this.runSparks += bonusSparks;
                this.runXp += bonusXp;
                this.pass.addXp(bonusXp);
                this.pass.recordActiveContractProgress('bossesDefeated', 1, false);
                if (this.expedition) {
                    this.expedition.bosses++;
                    this.recordExpeditionProgress('expedition_bosses');
                }
                this.pass.triggerSave();

                this.rareCoins.push({ x: boss.x - 20, y: boss.y, r: 15, vy: 185, phase: 0 });
                this.rareCoins.push({ x: boss.x + 20, y: boss.y, r: 15, vy: 185, phase: 1.2 });
                this.spawnRockDrop(boss.x, boss.y + 10, 'buff');

                this.addFloatingText(boss.x, boss.y, `[[xp:trophy]] БОСС УНИЧТОЖЕН! +${bonusScore} ОЧКОВ!`, '#ffd60a');
                this.showToast(`[[xp:trophy]] БОСС ЗАЧИСТКИ ПОВЕРЖЕН! +${bonusScore} очков, +${bonusSparks} [[xp:spark]] и +${bonusXp} XP!`);
            },

            updateClearanceBoss(dt, obsTimeScale) {
                const boss = this.clearanceBoss;
                if (!boss) return;

                const bDt = dt * obsTimeScale;
                boss.pulse += bDt * 5.5;
                bossModels.update(boss, dt, bDt);

                const dy = boss.targetY - boss.y;
                if (Math.abs(dy) > 0.4) {
                    boss.y += dy * (1 - Math.exp(-3.2 * bDt));
                } else {
                    boss.y = boss.targetY + Math.sin(boss.pulse * 0.6) * 6;
                }

                const margin = boss.w * 0.5 + 18;
                if (boss.x <= margin) boss.dir = 1;
                else if (boss.x >= this.width - margin) boss.dir = -1;

                const desiredVx = boss.dir * boss.maxSpeed;
                boss.vx += (desiredVx - boss.vx) * (1 - Math.exp(-4.0 * bDt));
                boss.x += boss.vx * bDt;
                boss.x = Math.max(margin, Math.min(this.width - margin, boss.x));

                // Попадание лазерных пуль игрока по боссу
                for (let bIdx = this.bullets.length - 1; bIdx >= 0; bIdx--) {
                    const b = this.bullets[bIdx];
                    if (Math.abs(b.x - boss.x) < boss.w * 0.48 + b.r && Math.abs(b.y - boss.y) < boss.h * 0.48 + b.r) {
                        boss.hp -= b.dmg;
                        bossModels.hit(boss, b.x, b.y, 0.06);
                        this.bullets.splice(bIdx, 1);
                        this.sound.playRockHit();
                        this.spawnPlayerShotImpact(b, '#ffd60a', 4);
                        if (boss.hp <= 0) {
                            this.onClearanceBossDefeated(boss);
                            return;
                        }
                    }
                }

                // Атаки Босса Зачистки
                if (Math.abs(dy) < 24) {
                    boss.attackTimer -= bDt;
                    if (boss.attackTimer <= 0) {
                        const mode = boss.attackIndex % 3;
                        boss.attackIndex++;
                        bossModels.fired(boss, mode);
                        if (mode === 0) {
                            const count = 5;
                            for (let k = 0; k < count; k++) {
                                const spread = -0.44 + (k / (count - 1)) * 0.88;
                                const spd = 235;
                                this.clearanceBossBullets.push({
                                    x: boss.x + (k - 2) * 20,
                                    y: boss.y + 24,
                                    vx: Math.sin(spread) * spd,
                                    vy: Math.cos(spread) * spd,
                                    r: 6.5
                                });
                            }
                            this.sound.playUfoShot();
                            boss.attackTimer = 2.15;
                        } else if (mode === 1) {
                            const dx = this.player.x - boss.x;
                            const dyP = Math.max(60, this.player.y - boss.y);
                            const len = Math.hypot(dx, dyP);
                            const spd = 275;
                            [-14, 14].forEach(offX => {
                                this.clearanceBossBullets.push({
                                    x: boss.x + offX,
                                    y: boss.y + 22,
                                    vx: (dx / len) * spd,
                                    vy: (dyP / len) * spd,
                                    r: 7
                                });
                            });
                            this.sound.playLaserWarning();
                            boss.attackTimer = 1.95;
                        } else {
                            [-38, 38].forEach(offX => {
                                const r = 17;
                                const hp = Math.max(3, Math.round(3 + this.difficulty));
                                this.rocks.push({
                                    x: Math.max(28, Math.min(this.width - 28, boss.x + offX)),
                                    y: boss.y + 28,
                                    r: r,
                                    hp: hp,
                                    maxHp: hp,
                                    vy: 155 + this.difficulty * 18,
                                    vx: offX * 0.6,
                                    rot: 0,
                                    vRot: 1.6,
                                    isExplosive: false,
                                    isBoss: false,
                                    vertices: this.generateRockPolygon(7, r)
                                });
                            });
                            this.sound.playUfoSpawn();
                            boss.attackTimer = 2.2;
                        }
                    }
                }

                // Столкновение игрока с корпусом босса
                const hitW = boss.w * 0.46 + this.player.radius * 0.7;
                const hitH = boss.h * 0.46 + this.player.radius * 0.7;
                if (Math.abs(this.player.x - boss.x) < hitW && Math.abs(this.player.y - boss.y) < hitH) {
                    this.player.y = Math.min(this.height - 32, boss.y + hitH + 14);
                    if (this.devGodMode || this.overdriveActive) {
                        boss.hp -= 12;
                        bossModels.hit(boss, this.player.x, boss.y + 18, 0.08);
                        this.spawnExplosion(boss.x, boss.y + 18, '#ffd60a', 14);
                        if (boss.hp <= 0) {
                            this.onClearanceBossDefeated(boss);
                            return;
                        }
                    } else if (this.player.shield) {
                        this.player.shield = false;
                        document.getElementById('shieldIndicator').classList.remove('active');
                        this.sound.playShieldBreak();
                        this.spawnExplosion(this.player.x, this.player.y, '#3b82f6', 20);
                        this.addFloatingText(this.player.x, this.player.y - 18, 'ЩИТ СПАС!', '#93c5fd');
                    } else {
                        this.gameOver();
                        return;
                    }
                }
            },

            drawClearanceBoss() {
                const boss = this.clearanceBoss;
                if (!boss) return;
                const ctx = this.ctx;

                bossModels.drawArchitect(ctx, boss);

                ctx.save();
                const barW = Math.min(265, this.width - 44);
                const barH = 10;
                const bx = (this.width - barW) / 2;
                const by = 172;

                ctx.fillStyle = 'rgba(9, 1, 20, 0.85)';
                drawRoundRect(ctx, bx - 4, by - 16, barW + 8, barH + 21, 7);
                ctx.fill();
                ctx.strokeStyle = '#ffd60a';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = '#fef08a';
                ctx.font = '900 8.5px "Exo 2", sans-serif';
                ctx.textAlign = 'center';
                drawXpaceText(ctx, `[[xp:skull]] ${boss.name} · ${Math.max(0, boss.hp)}/${boss.maxHp} HP`, this.width / 2, by - 5);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
                drawRoundRect(ctx, bx, by, barW, barH, 4);
                ctx.fill();

                const hpRatio = Math.max(0, boss.hp / boss.maxHp);
                const hpGrad = ctx.createLinearGradient(bx, 0, bx + barW, 0);
                hpGrad.addColorStop(0, '#ff0a78');
                hpGrad.addColorStop(0.5, '#ffd60a');
                hpGrad.addColorStop(1, '#00f5d4');
                ctx.fillStyle = hpGrad;
                if (hpRatio > 0) {
                    drawRoundRect(ctx, bx, by, Math.max(6, barW * hpRatio), barH, 4);
                    ctx.fill();
                }
                ctx.restore();
            }
        });
