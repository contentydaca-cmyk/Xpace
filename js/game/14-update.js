        // Main simulation update
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            getRunDifficulty() {
                const score = Math.max(0, this.score);
                const halfScore = RUN_DIFFICULTY_HALF_SCORE[this.gameMode] ?? RUN_DIFFICULTY_HALF_SCORE.DRIVE;
                return 1 + 4.5 * (score / (score + halfScore));
            },

            recordNearMiss(threat, scoreMult) {
                threat.grazed = true;
                const points = this.awardRunScore(40 * this.combo * scoreMult, true);
                this.runNearMisses++;
                this.pass.state.totalNearMisses++;

                const perks = this.getActiveShipPerk();
                const comboBonus = Number(perks.grazeCombo) + (this.hasTimedSuper('drift_resonance') ? 2 : 0);
                if (comboBonus) {
                    this.combo = Math.min(10, this.combo + comboBonus);
                    this.comboTimer = this.comboDuration;
                    this.onComboIncreased();
                    this.pass.recordProgress('combo', this.combo, true);
                }
                if (perks.grazeSlowmo && this.runNearMisses % 3 === 0) {
                    this.slowmoTimer = Math.max(this.slowmoTimer, 1.2);
                }
                // Existing contracts and pass quests specifically ask for Drive-style near misses.
                if (this.flightMode() === 'DRIVE') {
                    this.pass.recordActiveContractProgress('nearMisses', 1, false);
                    this.pass.recordProgress('near_misses', 1, false);
                }
                this.sound.playNearMiss();
                this.spawnExplosion(this.player.x, this.player.y, '#f472b6', 6);
                this.addFloatingText(this.player.x, this.player.y - 16, `ДРИФТ +${points}!`, '#f472b6');
            },

            update(dt) {
                if (this.state === 'PAUSED' || this.state === 'REFIT') return;
                const starSpeedMult = this.state === 'PLAYING'
                    ? (this.overdriveActive ? 2.2 : (this.slowmoTimer > 0 ? 0.55 : 1 + this.difficulty * 0.25))
                    : 0.35;
                this.stars.forEach(s => {
                    s.y += s.speed * starSpeedMult * dt;
                    if (s.y > this.height) {
                        s.y = -4;
                        s.x = Math.random() * this.width;
                    }
                });

                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const p = this.particles[i];
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.life -= dt;
                    if (p.life <= 0) this.particles.splice(i, 1);
                }

                for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
                    const ft = this.floatingTexts[i];
                    ft.y -= 42 * dt;
                    ft.life -= dt;
                    if (ft.life <= 0) this.floatingTexts.splice(i, 1);
                }

                if (this.shakeTime > 0) {
                    this.shakeTime = Math.max(0, this.shakeTime - dt);
                    if (this.shakeTime <= 0) this.shakeMag = 0;
                }

                for (let i = this.empWaves.length - 1; i >= 0; i--) {
                    const w = this.empWaves[i];
                    w.r += 950 * dt;
                    w.alpha -= 1.6 * dt;
                    if (w.alpha <= 0 || w.r >= w.maxR) {
                        this.empWaves.splice(i, 1);
                    }
                }

                if (this.state !== 'PLAYING') return;

                const trailStartX = this.player.x;
                const trailStartY = this.player.y;
                const targetMorph=this.overdriveActive?1:0;
                this._requiemMorph=(this._requiemMorph||0)+(targetMorph-(this._requiemMorph||0))*(1-Math.exp(-7*dt));
                if(Math.abs(this._requiemMorph-targetMorph)<.001)this._requiemMorph=targetMorph;
                const keySpeed = (this.debuffTimer > 0 && this.debuffType === 'slow_ship') ? 240 : 420;
                let kx = 0;
                let ky = 0;
                if (this.keys['ArrowLeft'] || this.keys['KeyA']) kx -= 1;
                if (this.keys['ArrowRight'] || this.keys['KeyD']) kx += 1;
                if (this.keys['ArrowUp'] || this.keys['KeyW']) ky -= 1;
                if (this.keys['ArrowDown'] || this.keys['KeyS']) ky += 1;

                if (kx !== 0 || ky !== 0) {
                    const norm = Math.hypot(kx, ky);
                    this.player.x = Math.max(22, Math.min(this.width - 22, this.player.x + (kx / norm) * keySpeed * dt));
                    this.player.y = Math.max(82, Math.min(this.height - 30, this.player.y + (ky / norm) * keySpeed * dt));
                    this.player.tilt = (kx / norm) * 0.32;
                }

                if (this.superEffectTimer > 0) this.superEffectTimer = Math.max(0, this.superEffectTimer - dt);
                this.runTime += dt;
                // Keep passive scoring independent of combat difficulty so it can't accelerate itself.
                const passiveScoreRate = this.expedition
                    ? 1 + 4.5 * this.expedition.completed / (this.expedition.completed + 10)
                    : 1 + Math.min(4.5, this.runTime / 22);
                const shipPerk = this.getActiveShipPerk();
                const scoreMult = (this.overdriveActive ? 2 : 1) * (1 + shipPerk.score);
                this.awardRunScore(dt * 18 * passiveScoreRate * scoreMult, true);
                this.difficulty = this.getRunDifficulty();
                if (this.flightMode() === 'DRIVE') {
                    const scenerySpeed = this.overdriveActive ? 1.85 : this.slowmoTimer > 0 ? 0.5 : 1;
                    this.driveSceneryDistance += 150 * (1 + (this.difficulty - 1) * 0.12) * scenerySpeed * dt;
                }

                // Каждые 4 242 очков в классической игре и в зачистке — шанс 0.42% на выпадение титула «42 БРАТУХА»
                while (this.score >= this.next4242Milestone) {
                    this.next4242Milestone += 4242;
                    if (!this.pass.state.unlockedTitles.includes('bratukha_42') && Math.random() < 0.0042) {
                        this.triggerTitle42Drop(false);
                        return;
                    }
                }

                if (this.overdriveActive) {
                    this.overdriveTimer -= dt;
                    if (this.overdriveTimer <= 0) {
                        this.overdriveActive = false;
                        this.overdriveTimer = 0;
                        this.overdriveCharge = 0;
                        document.getElementById('overdriveIndicator').classList.remove('active');
                const edgeFx = document.getElementById('overdriveEdgeFx');
                if (edgeFx) edgeFx.classList.remove('active');
                        this.sound.startBgm(this.flightMode(), false);
                        this.addFloatingText(this.player.x, this.player.y - 16, 'ФОРСАЖ ЗАВЕРШЁН', '#94a3b8');
                    }
                }

                if (this.magnetTimer > 0) {
                    this.magnetTimer = Math.max(0, this.magnetTimer - dt);
                }

                if (this.slowmoTimer > 0) {
                    this.slowmoTimer = Math.max(0, this.slowmoTimer - dt);
                }

                if (this.doubleScoreTimer > 0) {
                    this.doubleScoreTimer = Math.max(0, this.doubleScoreTimer - dt);
                }

                if (this.weaponBuffTimer > 0) {
                    this.weaponBuffTimer = Math.max(0, this.weaponBuffTimer - dt);
                    if (this.weaponBuffTimer <= 0) this.weaponBuffType = null;
                }

                if (this.debuffTimer > 0) {
                    this.debuffTimer = Math.max(0, this.debuffTimer - dt);
                    if (this.debuffTimer <= 0) this.debuffType = null;
                }

                this.player.tilt *= Math.pow(0.04, dt);
                if (this.pass.state.equippedShip === 'violet_comet') {
                    const steering = this.player.rudderSteering || 0;
                    this.player.rudderSteering = steering + (this.player.tilt - steering) * (1 - Math.exp(-13 * dt));
                }

                this.updatePlayerTrail(dt, trailStartX, trailStartY);

                if (this.combo > 1) {
                    this.comboTimer -= this.expedition?.refitPenalty === 'ComboJam' ? dt / 0.7 : dt;
                    if (this.comboTimer <= 0) {
                        this.combo = 1;
                    }
                }

                const threatSpeed = this.expedition?.refitPenalty === 'ThreatRush' ? 1.15 : 1;
                const obsTimeScale = (this.slowmoTimer > 0 ? 0.55 : 1) * threatSpeed;
                const canSpawnScoreBoss = !this.expedition && this.runTime >= this.nextScoreBossTime;

                if (this.flightMode() === 'DRIVE') {
                    if (canSpawnScoreBoss && !this.driveBoss && this.score >= this.nextDriveBossScore) {
                        this.spawnDriveBoss();
                    }
                    if (this.driveBoss) {
                        this.updateDriveBoss(dt, obsTimeScale);
                        if (this.state !== 'PLAYING') return;
                    } else {
                        this.spawnTimer -= dt * obsTimeScale;
                        if (this.spawnTimer <= 0) {
                            this.spawnObstacle();
                            this.spawnTimer = Math.max(0.46, 1.18 - this.difficulty * 0.14);
                        }
                    }
                } else {
                    // В режиме «ЗАЧИСТКА» корабль автоматически стреляет лазерами, а сверху летят камни с HP
                    let baseFireInterval = 0.22;
                    if (this.weaponBuffTimer > 0 && this.weaponBuffType === 'rapid') baseFireInterval = 0.105;
                    if (this.debuffTimer > 0 && this.debuffType === 'jam_guns') baseFireInterval *= 1.85;
                    if (this.overdriveActive) baseFireInterval *= 0.75;

                    this.shootCooldown -= dt;
                    if (this.shootCooldown <= 0) {
                        this.firePlayerLasers();
                        this.shootCooldown = baseFireInterval / (1 + (this.expedition?.cooling || 0) * 0.15);
                    }

                    if (canSpawnScoreBoss && !this.clearanceBoss && this.score >= this.nextClearanceBossScore) {
                        this.spawnClearanceBoss();
                    }
                    if (this.clearanceBoss) {
                        this.updateClearanceBoss(dt, obsTimeScale);
                        if (this.state !== 'PLAYING') return;
                    } else {
                        this.rockSpawnTimer -= dt * obsTimeScale;
                        if (this.rockSpawnTimer <= 0) {
                            const forceCore = this.expedition?.mission.key === 'cores'
                                && !this.rocks.some(rock => rock.isExplosive);
                            this.spawnRock(false, forceCore);
                            this.rockSpawnTimer = Math.max(0.48, 1.25 - this.difficulty * 0.14);
                        }

                        this.ufoSpawnTimer -= dt;
                        if (this.ufoSpawnTimer <= 0) {
                            this.spawnEnemyUfo();
                            this.ufoSpawnTimer = 15.0;
                        }
                    }

                    // Снаряды Босса Зачистки
                    for (let cbIdx = this.clearanceBossBullets.length - 1; cbIdx >= 0; cbIdx--) {
                        const cb = this.clearanceBossBullets[cbIdx];
                        cb.x += cb.vx * dt * obsTimeScale;
                        cb.y += cb.vy * dt * obsTimeScale;
                        if (cb.y > this.height + 30 || cb.x < -30 || cb.x > this.width + 30) {
                            this.clearanceBossBullets.splice(cbIdx, 1);
                            continue;
                        }
                        if (Math.hypot(cb.x - this.player.x, cb.y - this.player.y) < cb.r + this.player.radius * 0.72) {
                            this.clearanceBossBullets.splice(cbIdx, 1);
                            if (this.devGodMode || this.overdriveActive) {
                                this.spawnExplosion(cb.x, cb.y, '#ffd60a', 8);
                            } else if (this.player.shield) {
                                this.player.shield = false;
                                document.getElementById('shieldIndicator').classList.remove('active');
                                this.sound.playShieldBreak();
                                this.spawnExplosion(this.player.x, this.player.y, '#3b82f6', 18);
                                this.addFloatingText(this.player.x, this.player.y - 18, 'ЩИТ ОТБИЛ ЗАРЯД!', '#93c5fd');
                            } else {
                                this.gameOver();
                                return;
                            }
                        }
                    }
                }

                this.collectibleTimer -= dt;
                if (this.collectibleTimer <= 0) {
                    this.spawnCollectibleWave();
                    this.collectibleTimer = 1.6 + Math.random() * 0.75;
                }

                this.powerupTimer -= dt;
                if (this.powerupTimer <= 0) {
                    if (this.powerups.length === 0) {
                        this.spawnHelperPowerup();
                    }
                    this.powerupTimer = 8.5 + Math.random() * 3.5;
                }

                const magnetActive = this.overdriveActive || this.magnetTimer > 0;
                const magnetRadius = (this.magnetTimer > 0 ? 250 : 185) + shipPerk.magnet;
                const blueMagnetRadius = magnetActive ? magnetRadius : shipPerk.blueMagnet;

                // Синие Искры
                for (let i = this.blueSparks.length - 1; i >= 0; i--) {
                    const bs = this.blueSparks[i];
                    bs.y += bs.vy * dt;
                    bs.pulse += dt * 7;

                    const dx = this.player.x - bs.x;
                    const dy = this.player.y - bs.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < blueMagnetRadius && dist > 1) {
                        bs.x += (dx / dist) * 460 * dt;
                        bs.y += (dy / dist) * 460 * dt;
                    }

                    if (dist < bs.r + this.player.radius + 6) {
                        const pts = this.awardRunScore(15 * this.combo * scoreMult, true);
                        this.runBlueSparks += 1;

                        this.combo = Math.min(10, this.combo + 1);
                        this.comboTimer = this.comboDuration;
                        this.onComboIncreased();
                        this.addOverdriveCharge(8);

                        this.sound.playBlueSpark(this.combo);
                        this.spawnExplosion(bs.x, bs.y, '#00f3ff', 8);
                        this.addFloatingText(bs.x, bs.y - 10, `+${pts} • x${this.combo}`, '#38bdf8');

                        this.pass.recordProgress('blue_sparks', 1, false);
                        this.pass.recordProgress('combo', this.combo, true);

                        this.blueSparks.splice(i, 1);
                        continue;
                    }

                    if (bs.y > this.height + 40) {
                        this.blueSparks.splice(i, 1);
                    }
                }

                // Редкие Пиксельные Жёлтые Монеты
                for (let i = this.rareCoins.length - 1; i >= 0; i--) {
                    const c = this.rareCoins[i];
                    c.y += c.vy * dt;
                    c.phase += dt * 6;

                    const dx = this.player.x - c.x;
                    const dy = this.player.y - c.y;
                    const dist = Math.hypot(dx, dy);

                    if (magnetActive && dist < magnetRadius + 15 && dist > 1) {
                        c.x += (dx / dist) * 480 * dt;
                        c.y += (dy / dist) * 480 * dt;
                    }

                    if (dist < c.r + this.player.radius + 7) {
                        const modPerk = this.getActiveShipPerk();
                        const xpGain = (this.overdriveActive ? 50 : 25) + modPerk.coinXp;
                        const sparksGain = this.pass.awardSparks(this.overdriveActive ? 6 : 3, modPerk.coinSparks);
                        const pts = this.awardRunScore(50 * this.combo * scoreMult, true);
                        this.runRareCoins += 1;
                        this.pass.state.totalCoins += 1;
                        this.pass.recordActiveContractProgress('coins', 1, false);
                        this.runSparks += sparksGain;
                        this.runXp += xpGain;

                        this.combo = Math.min(10, this.combo + 1);
                        this.comboTimer = this.comboDuration;
                        this.onComboIncreased();

                        this.sound.playRareCoin(this.combo);
                        this.spawnExplosion(c.x, c.y, '#ffd60a', 14);
                        this.addFloatingText(c.x, c.y - 12, `+${sparksGain} [[xp:spark]] • +${xpGain} XP`, '#ffd60a');

                        const leveledUp = this.pass.addXp(xpGain);
                        if (leveledUp) {
                            this.showToast(`XPACE ПАСС • УРОВЕНЬ ${this.pass.getLevelInfo().level}!`);
                        }
                        this.pass.recordProgress('total_coins', 1, false);
                        this.pass.recordProgress('run_coins', this.runRareCoins, true);
                        this.pass.recordProgress('combo', this.combo, true);

                        this.rareCoins.splice(i, 1);
                        continue;
                    }

                    if (c.y > this.height + 40) {
                        this.rareCoins.splice(i, 1);
                    }
                }

                // Вспомогательные предметы (Щит, Магнит, Замедление времени, ЭМИ-разряд)
                for (let i = this.powerups.length - 1; i >= 0; i--) {
                    const p = this.powerups[i];
                    p.y += p.vy * dt;
                    p.pulse += dt * 5.5;

                    const dist = Math.hypot(p.x - this.player.x, p.y - this.player.y);
                    if (dist < p.r + this.player.radius + 5) {
                        this.pass.recordProgress('powerups', 1, false);
                        if (this.expedition) this.expedition.supplies++;

                        if (p.kind === 'shield') {
                            this.player.shield = true;
                            document.getElementById('shieldIndicator').classList.add('active');
                            this.sound.playShield();
                            this.spawnExplosion(p.x, p.y, '#3b82f6', 14);
                            this.addFloatingText(p.x, p.y - 12, '[ ЭНЕРГО-ЩИТ ]', '#60a5fa');
                        } else if (p.kind === 'magnet') {
                            this.magnetTimer = 8.0 * this.getActiveShipPerk().buffDuration;
                            this.sound.playMagnet();
                            this.spawnExplosion(p.x, p.y, '#c084fc', 16);
                            this.addFloatingText(p.x, p.y - 12, '[ МАГНИТ ИСКР ]', '#e9d5ff');
                        } else if (p.kind === 'slowmo') {
                            this.slowmoTimer = 5.5 * this.getActiveShipPerk().buffDuration;
                            this.sound.playSlowMo();
                            this.spawnExplosion(p.x, p.y, '#4ade80', 16);
                            this.addFloatingText(p.x, p.y - 12, '[ ХРОНО-СДВИГ ]', '#86efac');
                        } else if (p.kind === 'emp_bomb') {
                            this.triggerEmpShockwave();
                        } else if (p.kind === 'double') {
                            this.doubleScoreTimer = 9.0 * this.getActiveShipPerk().buffDuration;
                            this.sound.playRareCoin(6);
                            this.spawnExplosion(p.x, p.y, '#ffd60a', 18);
                            this.addFloatingText(p.x, p.y - 12, '[ ОЧКИ x2 НА 9с ]', '#ffd60a');
                            document.getElementById('doubleIndicator').classList.add('active');
                            this.triggerShake(4, 0.2);
                        }

                        this.powerups.splice(i, 1);
                        continue;
                    }

                    if (p.y > this.height + 40) {
                        this.powerups.splice(i, 1);
                    }
                }

                // Препятствия (все 6 типов)
                const nearMissReach = this.hasTimedSuper('drift_resonance') ? 44 : 24;
                for (let i = this.obstacles.length - 1; i >= 0; i--) {
                    const obs = this.obstacles[i];
                    const hitRadius = this.player.radius * 0.72;
                    let distToPlayer = 999;
                    let obsYForGraze = obs.y || 0;

                    if (obs.type === 'warning_laser') {
                        obs.timer -= dt * obsTimeScale;
                        if (obs.phase === 'warning') {
                            if (obs.timer <= 0) {
                                obs.phase = 'firing';
                                obs.timer = 0.45;
                                this.sound.playShieldBreak();
                            }
                            continue;
                        } else {
                            // Активный вертикальный луч
                            distToPlayer = Math.abs(this.player.x - obs.x) - obs.w / 2;
                            obsYForGraze = this.player.y + 15;
                            if (obs.timer <= 0) {
                                this.obstacles.splice(i, 1);
                                continue;
                            }
                        }
                    } else {
                        obs.y += obs.vy * dt * obsTimeScale;
                        obsYForGraze = obs.y;

                        if (obs.type === 'moving_beam') {
                            obs.x += obs.vx * dt * obsTimeScale;
                            if (obs.x <= 10 || obs.x + obs.w >= this.width - 10) {
                                obs.vx *= -1;
                                obs.x = Math.max(10, Math.min(this.width - obs.w - 10, obs.x));
                            }
                        } else if (obs.type === 'drone') {
                            obs.x += obs.vx * dt * obsTimeScale;
                            obs.angle += dt * 4.5 * obsTimeScale;
                            if (obs.x - obs.r <= 10 || obs.x + obs.r >= this.width - 10) {
                                obs.vx *= -1;
                            }
                        } else if (obs.type === 'emp_mine') {
                            obs.x += obs.vx * dt * obsTimeScale;
                            obs.pulse += dt * 6;
                            if (obs.x - obs.r <= 14 || obs.x + obs.r >= this.width - 14) {
                                obs.vx *= -1;
                            }
                        }

                        if (obs.type === 'drone' || obs.type === 'emp_mine') {
                            distToPlayer = Math.hypot(obs.x - this.player.x, obs.y - this.player.y) - obs.r;
                        } else if (obs.type === 'laser_gate') {
                            // Левое крыло: [0 .. obs.gapX], Правое крыло: [obs.gapX + obs.gapW .. this.width]
                            const leftClosestX = Math.max(0, Math.min(this.player.x, obs.gapX));
                            const leftClosestY = Math.max(obs.y, Math.min(this.player.y, obs.y + obs.h));
                            const distLeft = Math.hypot(this.player.x - leftClosestX, this.player.y - leftClosestY);

                            const rightStart = obs.gapX + obs.gapW;
                            const rightClosestX = Math.max(rightStart, Math.min(this.player.x, this.width));
                            const rightClosestY = Math.max(obs.y, Math.min(this.player.y, obs.y + obs.h));
                            const distRight = Math.hypot(this.player.x - rightClosestX, this.player.y - rightClosestY);

                            distToPlayer = Math.min(distLeft, distRight);
                        } else {
                            const closestX = Math.max(obs.x, Math.min(this.player.x, obs.x + obs.w));
                            const closestY = Math.max(obs.y, Math.min(this.player.y, obs.y + obs.h));
                            distToPlayer = Math.hypot(this.player.x - closestX, this.player.y - closestY);
                        }
                    }

                    const hit = distToPlayer < hitRadius;

                    if (hit) {
                        if (this.devGodMode) {
                            this.spawnExplosion(this.player.x, this.player.y, '#00f5d4', 10);
                            this.obstacles.splice(i, 1);
                            continue;
                        } else if (this.overdriveActive) {
                            const smashPts = this.awardRunScore(60 * this.combo);
                            this.sound.playShieldBreak();
                            this.spawnExplosion(this.player.x, this.player.y - 10, '#ffd60a', 18);
                            this.addFloatingText(this.player.x, this.player.y - 18, `ТАРАН +${smashPts}!`, '#ffd60a');
                            this.obstacles.splice(i, 1);
                            continue;
                        } else if (this.player.shield) {
                            this.player.shield = false;
                            document.getElementById('shieldIndicator').classList.remove('active');
                            this.sound.playShieldBreak();
                            this.spawnExplosion(this.player.x, this.player.y, '#3b82f6', 20);
                            this.addFloatingText(this.player.x, this.player.y - 18, 'ЩИТ СПАС!', '#93c5fd');
                            this.obstacles.splice(i, 1);
                            continue;
                        } else {
                            this.gameOver();
                            return;
                        }
                    } else if (!obs.grazed && distToPlayer < hitRadius + nearMissReach && obsYForGraze > this.player.y - 10) {
                        this.recordNearMiss(obs, scoreMult);
                    }

                    if (obs.y && obs.y > this.height + 60) {
                        this.obstacles.splice(i, 1);
                    }
                }

                // Обновление пуль, камней и капсул баффов/дебаффов в режиме «ЗАЧИСТКА»
                for (let i = this.bullets.length - 1; i >= 0; i--) {
                    const b = this.bullets[i];
                    b.x += b.vx * dt;
                    b.y += b.vy * dt;
                    if (b.y < -30 || b.x < -20 || b.x > this.width + 20) {
                        this.bullets.splice(i, 1);
                    }
                }

                for (let i = this.dropCapsules.length - 1; i >= 0; i--) {
                    const cap = this.dropCapsules[i];
                    cap.y += cap.vy * dt;
                    cap.pulse += dt * 6;

                    const dist = Math.hypot(cap.x - this.player.x, cap.y - this.player.y);
                    if (dist < cap.r + this.player.radius + 5) {
                        if (cap.category === 'buff') {
                            this.pass.recordProgress('weapon_buffs', 1, false);
                            this.pass.recordProgress('powerups', 1, false);
                            if (this.expedition) this.expedition.supplies++;
                            if (cap.subType === 'shield_drop') {
                                this.player.shield = true;
                                document.getElementById('shieldIndicator').classList.add('active');
                                this.sound.playShield();
                                this.addFloatingText(cap.x, cap.y - 12, '[ ЭНЕРГО-ЩИТ ]', '#60a5fa');
                            } else {
                                this.weaponBuffType = cap.subType;
                                this.weaponBuffTimer = 7.5 * this.getActiveShipPerk().buffDuration;
                                this.sound.playMagnet();
                                const labels = {
                                    rapid: '[ СКОРОСТРЕЛ x2 ]',
                                    spread: '[ ТРОЙНОЙ ЛУЧ ]',
                                    plasma: '[ ПЛАЗМА x2 ]'
                                };
                                this.addFloatingText(cap.x, cap.y - 12, labels[cap.subType] || 'БАФФ ОРУЖИЯ!', '#4ade80');
                            }
                        } else {
                            // Подобрали дебафф!
                            if (this.overdriveActive) {
                                this.addFloatingText(cap.x, cap.y - 12, 'ФОРСАЖ СЖЁГ ДЕБАФФ!', '#ffd60a');
                            } else if (shipPerk.debuffFilter && this.runTime >= this.nextDebuffFilterAt) {
                                this.nextDebuffFilterAt = this.runTime + 22;
                                this.sound.playShield();
                                this.addFloatingText(cap.x, cap.y - 12, 'ФИЛЬТР ПЕРЕХВАТИЛ СБОЙ', '#85f8dc');
                            } else {
                                this.debuffType = cap.subType;
                                this.debuffTimer = 4.5;
                                this.sound.playDebuff();
                                const dLabels = {
                                    slow_ship: '[ СБОЙ: ТЯЖЕСТЬ ]',
                                    jam_guns: '[ СБОЙ: ПЕРЕГРЕВ ]',
                                    scatter: '[ СБОЙ: РАЗБРОС ]'
                                };
                                this.addFloatingText(cap.x, cap.y - 12, dLabels[cap.subType] || 'ДЕБАФФ!', '#ef4444');
                            }
                        }
                        this.dropCapsules.splice(i, 1);
                        continue;
                    }

                    if (cap.y > this.height + 40) {
                        this.dropCapsules.splice(i, 1);
                    }
                }

                for (let i = this.rocks.length - 1; i >= 0; i--) {
                    const rk = this.rocks[i];
                    rk.y += rk.vy * dt * obsTimeScale;
                    rk.x += rk.vx * dt * obsTimeScale;
                    rk.rot += rk.vRot * dt * obsTimeScale;

                    if (rk.x - rk.r <= 12 || rk.x + rk.r >= this.width - 12) {
                        rk.vx *= -1;
                        rk.x = Math.max(12 + rk.r, Math.min(this.width - 12 - rk.r, rk.x));
                    }

                    // Проверка попадания лазерных пуль по камню
                    for (let bIdx = this.bullets.length - 1; bIdx >= 0; bIdx--) {
                        const b = this.bullets[bIdx];
                        if (Math.hypot(b.x - rk.x, b.y - rk.y) < rk.r + b.r) {
                            rk.hp -= b.dmg;
                            this.bullets.splice(bIdx, 1);
                            this.sound.playRockHit();
                            this.spawnPlayerShotImpact(b, b.color, 3);
                            if (rk.hp <= 0) break;
                        }
                    }

                    if (rk.hp <= 0) {
                        this.rocks.splice(i, 1);
                        this.onRockDestroyed(rk);
                        continue;
                    }

                    // Проверка столкновения корабля с камнем
                    const distToShip = Math.hypot(rk.x - this.player.x, rk.y - this.player.y);
                    const rockHitDistance = rk.r + this.player.radius * 0.72;
                    if (distToShip < rockHitDistance) {
                        if (this.devGodMode) {
                            this.rocks.splice(i, 1);
                            this.onRockDestroyed(rk);
                            continue;
                        } else if (this.overdriveActive) {
                            this.rocks.splice(i, 1);
                            this.onRockDestroyed(rk);
                            continue;
                        } else if (this.player.shield) {
                            this.player.shield = false;
                            document.getElementById('shieldIndicator').classList.remove('active');
                            this.sound.playShieldBreak();
                            this.spawnExplosion(rk.x, rk.y, '#3b82f6', 20);
                            this.addFloatingText(this.player.x, this.player.y - 18, 'ЩИТ РАЗБИЛ КАМЕНЬ!', '#93c5fd');
                            this.rocks.splice(i, 1);
                            continue;
                        } else {
                            this.gameOver();
                            return;
                        }
                    } else if (!rk.grazed && distToShip < rockHitDistance + 24 && rk.y > this.player.y - 10) {
                        this.recordNearMiss(rk, scoreMult);
                    }

                    if (rk.y - rk.r > this.height + 50) {
                        this.rocks.splice(i, 1);
                    }
                }

                // Фиолетовые искры для атаки по Боссу в режиме «ДРАЙВ»
                for (let i = this.purpleSparks.length - 1; i >= 0; i--) {
                    const ps = this.purpleSparks[i];
                    ps.y += ps.vy * dt;
                    ps.swayPhase += dt * 3.2;
                    ps.pulse += dt * 8;
                    ps.baseX = Math.max(26, Math.min(this.width - 26, ps.baseX));
                    ps.x = Math.max(22, Math.min(this.width - 22, ps.baseX + Math.sin(ps.swayPhase) * ps.swayAmp));

                    const dx = this.player.x - ps.x;
                    const dy = this.player.y - ps.y;
                    const dist = Math.hypot(dx, dy);

                    if (magnetActive && dist < magnetRadius + 25 && dist > 1) {
                        ps.baseX += (dx / dist) * 440 * dt;
                        ps.y += (dy / dist) * 440 * dt;
                    }

                    if (dist < ps.r + this.player.radius + 8) {
                        this.sound.playMagnet();
                        this.spawnExplosion(ps.x, ps.y, '#c084fc', 12);
                        const pts = this.awardRunScore(35 * this.combo * scoreMult, true);

                        if (this.driveBoss) {
                            this.homingBossShots.push({
                                x: ps.x,
                                y: ps.y,
                                dmg: 20,
                                speed: 700,
                                pulse: 0
                            });
                            this.addFloatingText(ps.x, ps.y - 12, '[[xp:bolt]] ЗАЛП В БОССА!', '#e9d5ff');
                        } else {
                            this.addFloatingText(ps.x, ps.y - 12, `+${pts}`, '#c084fc');
                        }

                        this.purpleSparks.splice(i, 1);
                        continue;
                    }

                    if (ps.y > this.height + 40) {
                        this.purpleSparks.splice(i, 1);
                    }
                }

                // Самонаводящиеся фиолетовые заряды, летящие прямо в Босса
                for (let i = this.homingBossShots.length - 1; i >= 0; i--) {
                    const hs = this.homingBossShots[i];
                    hs.pulse += dt * 14;
                    if (!this.driveBoss) {
                        this.homingBossShots.splice(i, 1);
                        continue;
                    }
                    const dx = this.driveBoss.x - hs.x;
                    const dy = this.driveBoss.y - hs.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 26) {
                        this.spawnExplosion(hs.x, hs.y, '#c084fc', 16);
                        this.sound.playRockHit();
                        this.damageDriveBoss(hs.dmg, 'ФИОЛЕТ. ИСКРА', hs.x, hs.y);
                        this.homingBossShots.splice(i, 1);
                        continue;
                    }
                    hs.x += (dx / dist) * hs.speed * dt;
                    hs.y += (dy / dist) * hs.speed * dt;
                }

                // Вражеские летающие тарелки (НЛО), которые стреляют в режиме «ЗАЧИСТКА»
                for (let i = this.enemyUfos.length - 1; i >= 0; i--) {
                    const ufo = this.enemyUfos[i];
                    const ufoDt = dt * obsTimeScale;
                    ufo.hoverPhase += ufoDt * 3.4;
                    if (ufo.flashTimer > 0) ufo.flashTimer = Math.max(0, ufo.flashTimer - dt);

                    if (ufo.leaving) {
                        ufo.leaveVy = Math.min(260, (ufo.leaveVy || 0) + 340 * ufoDt);
                        ufo.baseY -= ufo.leaveVy * ufoDt;
                        ufo.y = ufo.baseY + Math.sin(ufo.hoverPhase) * 9 * ufo.hoverBlend;
                        ufo.tilt *= Math.pow(0.05, ufoDt);
                        if (ufo.y < -55) {
                            this.enemyUfos.splice(i, 1);
                        }
                        continue;
                    }

                    const distToTargetY = ufo.targetY - ufo.baseY;
                    if (Math.abs(distToTargetY) > 0.25) {
                        ufo.baseY += distToTargetY * (1 - Math.exp(-3.4 * ufoDt));
                    } else {
                        ufo.baseY = ufo.targetY;
                    }

                    if (Math.abs(distToTargetY) < 28) {
                        ufo.hoverBlend = Math.min(1, ufo.hoverBlend + ufoDt * 1.4);
                    }
                    ufo.y = ufo.baseY + Math.sin(ufo.hoverPhase) * 9 * ufo.hoverBlend;

                    const turnZone = ufo.r + 44;
                    if (ufo.x <= turnZone) {
                        ufo.dir = 1;
                    } else if (ufo.x >= this.width - turnZone) {
                        ufo.dir = -1;
                    }
                    const desiredVx = ufo.dir * ufo.maxSpeed;
                    ufo.vx += (desiredVx - ufo.vx) * (1 - Math.exp(-4.5 * ufoDt));
                    ufo.x += ufo.vx * ufoDt;

                    const hardPad = ufo.r + 14;
                    if (ufo.x < hardPad) {
                        ufo.x = hardPad;
                        ufo.dir = 1;
                    } else if (ufo.x > this.width - hardPad) {
                        ufo.x = this.width - hardPad;
                        ufo.dir = -1;
                    }

                    const targetTilt = (ufo.vx / Math.max(1, ufo.maxSpeed)) * 0.16;
                    ufo.tilt += (targetTilt - ufo.tilt) * (1 - Math.exp(-8 * ufoDt));

                    ufo.lifeTimer -= dt;
                    if (ufo.lifeTimer <= 0) {
                        ufo.leaving = true;
                        continue;
                    }

                    // Прицельная стрельба по игроку
                    ufo.fireTimer -= ufoDt;
                    if (ufo.fireTimer <= 0 && Math.abs(distToTargetY) < 18) {
                        ufo.fireTimer = Math.max(1.15, 1.75 - this.difficulty * 0.08);
                        const dx = this.player.x - ufo.x;
                        const dy = this.player.y - (ufo.y + 8);
                        const dist = Math.max(1, Math.hypot(dx, dy));
                        const shotSpeed = 275 + this.difficulty * 22;
                        this.enemyBullets.push({
                            x: ufo.x,
                            y: ufo.y + 8,
                            vx: (dx / dist) * shotSpeed,
                            vy: (dy / dist) * shotSpeed,
                            r: 5.5,
                            color: '#ff0a78'
                        });
                        this.sound.playUfoShot();
                    }

                    // Попадания лазерных пуль игрока по тарелке
                    for (let bIdx = this.bullets.length - 1; bIdx >= 0; bIdx--) {
                        const b = this.bullets[bIdx];
                        if (Math.hypot(b.x - ufo.x, b.y - ufo.y) < ufo.r + b.r) {
                            ufo.hp -= b.dmg;
                            ufo.flashTimer = 0.08;
                            this.bullets.splice(bIdx, 1);
                            this.sound.playRockHit();
                            this.spawnPlayerShotImpact(b, '#a3e635', 4);
                            if (ufo.hp <= 0) break;
                        }
                    }

                    if (ufo.hp <= 0) {
                        this.enemyUfos.splice(i, 1);
                        this.onEnemyUfoDestroyed(ufo);
                        continue;
                    }

                    // Столкновение корабля игрока с корпусом тарелки
                    const distToUfo = Math.hypot(ufo.x - this.player.x, ufo.y - this.player.y);
                    const ufoHitDistance = ufo.r + this.player.radius * 0.72;
                    if (distToUfo < ufoHitDistance) {
                        if (this.devGodMode || this.overdriveActive) {
                            this.enemyUfos.splice(i, 1);
                            this.onEnemyUfoDestroyed(ufo);
                            continue;
                        } else if (this.player.shield) {
                            this.player.shield = false;
                            document.getElementById('shieldIndicator').classList.remove('active');
                            this.sound.playShieldBreak();
                            this.spawnExplosion(ufo.x, ufo.y, '#3b82f6', 20);
                            this.addFloatingText(this.player.x, this.player.y - 18, 'ЩИТ СБИЛ НЛО!', '#93c5fd');
                            this.enemyUfos.splice(i, 1);
                            continue;
                        } else {
                            this.gameOver();
                            return;
                        }
                    } else if (!ufo.grazed && distToUfo < ufoHitDistance + 24 && ufo.y > this.player.y - 10) {
                        this.recordNearMiss(ufo, scoreMult);
                    }
                }

                // Плазменные снаряды вражеской летающей тарелки
                for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
                    const eb = this.enemyBullets[i];
                    eb.x += eb.vx * dt * obsTimeScale;
                    eb.y += eb.vy * dt * obsTimeScale;

                    const hitDist = Math.hypot(eb.x - this.player.x, eb.y - this.player.y);
                    if (hitDist < eb.r + this.player.radius * 0.68) {
                        this.enemyBullets.splice(i, 1);
                        if (this.devGodMode) {
                            continue;
                        } else if (this.overdriveActive) {
                            const grazePts = this.awardRunScore(25 * this.combo);
                            this.spawnExplosion(eb.x, eb.y, '#ffd60a', 8);
                            this.addFloatingText(eb.x, eb.y - 10, `ОТРАЖЕНО +${grazePts}`, '#ffd60a');
                            continue;
                        } else if (this.player.shield) {
                            this.player.shield = false;
                            document.getElementById('shieldIndicator').classList.remove('active');
                            this.sound.playShieldBreak();
                            this.spawnExplosion(this.player.x, this.player.y, '#3b82f6', 18);
                            this.addFloatingText(this.player.x, this.player.y - 18, 'ЩИТ ОТБИЛ ВЫСТРЕЛ!', '#93c5fd');
                            continue;
                        } else {
                            this.gameOver();
                            return;
                        }
                    }

                    if (eb.y > this.height + 30 || eb.y < -40 || eb.x < -30 || eb.x > this.width + 30) {
                        this.enemyBullets.splice(i, 1);
                    }
                }

                // Снаряды Босса классического режима «ДРАЙВ»
                for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
                    const bp = this.bossProjectiles[i];
                    bp.x += bp.vx * dt * obsTimeScale;
                    bp.y += bp.vy * dt * obsTimeScale;

                    const d = Math.hypot(bp.x - this.player.x, bp.y - this.player.y);
                    if (d < bp.r + this.player.radius * 0.68) {
                        this.bossProjectiles.splice(i, 1);
                        if (this.devGodMode) {
                            continue;
                        } else if (this.overdriveActive) {
                            this.spawnExplosion(bp.x, bp.y, '#ffd60a', 8);
                            continue;
                        } else if (this.player.shield) {
                            this.player.shield = false;
                            document.getElementById('shieldIndicator').classList.remove('active');
                            this.sound.playShieldBreak();
                            this.spawnExplosion(this.player.x, this.player.y, '#3b82f6', 18);
                            this.addFloatingText(this.player.x, this.player.y - 18, 'ЩИТ ОТБИЛ ЗАРЯД!', '#93c5fd');
                            continue;
                        } else {
                            this.gameOver();
                            return;
                        }
                    }

                    if (bp.y > this.height + 30 || bp.x < -30 || bp.x > this.width + 30) {
                        this.bossProjectiles.splice(i, 1);
                    }
                }

                if (this.expedition) this.updateExpedition();
                this.updateHud();
            }
        });
