        // Obstacles, collectibles and EMP
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            // Генерация разнообразных препятствий (включая новые: лазерные ворота, ЭМИ-мины и снайперские лучи)
            spawnObstacle() {
                const roll = Math.random();
                const baseSpeed = 240 + this.difficulty * 46;

                if (roll < 0.28) {
                    // 1. Классический лазерный барьер
                    const barW = Math.min(this.width * 0.44, 72 + Math.random() * 68);
                    let x = Math.random() * (this.width - barW - 24) + 12;
                    if (this.lastWideBarrierSide < 0 && x > this.width * 0.45) {
                        x = 14 + Math.random() * (this.width * 0.25);
                    } else if (this.lastWideBarrierSide > 0 && x < this.width * 0.25) {
                        x = this.width - barW - 14 - Math.random() * (this.width * 0.2);
                    }
                    this.lastWideBarrierSide = x + barW / 2 < this.width / 2 ? -1 : 1;

                    this.obstacles.push({
                        type: 'barrier',
                        x: x,
                        y: -30,
                        w: barW,
                        h: 16,
                        vy: baseSpeed,
                        vx: 0,
                        grazed: false
                    });
                } else if (roll < 0.50) {
                    // 2. Вращающийся кибер-дрон
                    const r = 17 + Math.random() * 7;
                    const x = r + 16 + Math.random() * (this.width - (r + 16) * 2);
                    this.obstacles.push({
                        type: 'drone',
                        x: x,
                        y: -35,
                        r: r,
                        vy: baseSpeed * 1.1,
                        vx: (Math.random() - 0.5) * 90,
                        angle: Math.random() * Math.PI * 2,
                        grazed: false
                    });
                } else if (roll < 0.68) {
                    // 3. Подвижная фиолетовая балка
                    const barW = Math.min(this.width * 0.35, 62 + Math.random() * 44);
                    const x = Math.random() * (this.width - barW - 30) + 15;
                    const dir = Math.random() < 0.5 ? -1 : 1;
                    this.obstacles.push({
                        type: 'moving_beam',
                        x: x,
                        y: -30,
                        w: barW,
                        h: 14,
                        vy: baseSpeed * 0.96,
                        vx: dir * (105 + this.difficulty * 18),
                        grazed: false
                    });
                } else if (roll < 0.84) {
                    // 4. НОВОЕ ПРЕПЯТСТВИЕ: Лазерные ворота с окном посередине
                    const gapW = Math.max(96, this.width * 0.34);
                    const minSide = 22;
                    const gapX = minSide + Math.random() * Math.max(10, this.width - gapW - minSide * 2);
                    this.obstacles.push({
                        type: 'laser_gate',
                        gapX: gapX,
                        gapW: gapW,
                        y: -26,
                        h: 14,
                        vy: baseSpeed * 0.92,
                        grazed: false
                    });
                } else if (roll < 0.94) {
                    // 5. НОВОЕ ПРЕПЯТСТВИЕ: Пульсирующая ЭМИ-мина с силовым полем
                    const r = 20;
                    const x = r + 20 + Math.random() * (this.width - (r + 20) * 2);
                    this.obstacles.push({
                        type: 'emp_mine',
                        x: x,
                        y: -35,
                        r: r,
                        vy: baseSpeed * 0.88,
                        vx: (Math.random() < 0.5 ? -1 : 1) * 55,
                        pulse: Math.random() * Math.PI * 2,
                        grazed: false
                    });
                } else {
                    // 6. НОВОЕ ПРЕПЯТСТВИЕ: Снайперский плазменный луч с предупреждением
                    const hasExistingLaser = this.obstacles.some(o => o.type === 'warning_laser');
                    if (hasExistingLaser) {
                        // Заменяем на дрон, чтобы не перегружать экран
                        const r = 18;
                        const x = r + 20 + Math.random() * (this.width - (r + 20) * 2);
                        this.obstacles.push({
                            type: 'drone',
                            x, y: -35, r,
                            vy: baseSpeed * 1.1,
                            vx: (Math.random() - 0.5) * 90,
                            angle: 0,
                            grazed: false
                        });
                    } else {
                        const x = 36 + Math.random() * (this.width - 72);
                        this.sound.playLaserWarning();
                        this.obstacles.push({
                            type: 'warning_laser',
                            x: x,
                            w: 18,
                            phase: 'warning', // warning -> firing
                            timer: 1.15,
                            grazed: false
                        });
                    }
                }
            },

            spawnCollectibleWave() {
                const startX = 34 + Math.random() * (this.width - 68);
                const drift = (Math.random() - 0.5) * 45;
                const count = Math.floor(Math.random() * 3) + 2;

                for (let i = 0; i < count; i++) {
                    const cx = Math.max(26, Math.min(this.width - 26, startX + drift * i * 0.35));
                    const cy = -25 - i * 44;
                    const vy = 215 + this.difficulty * 35;

                    if (Math.random() < 0.16) {
                        this.rareCoins.push({
                            x: cx,
                            y: cy,
                            r: 15,
                            vy: vy,
                            phase: i * 0.7
                        });
                    } else {
                        this.blueSparks.push({
                            x: cx,
                            y: cy,
                            r: 12,
                            vy: vy,
                            pulse: i * 0.8
                        });
                    }
                }
            },

            // Генерация вспомогательных предметов (Щит, Магнит, Хроно-Замедление, ЭМИ-Разряд)
            spawnHelperPowerup() {
                const x = 38 + Math.random() * (this.width - 76);
                const types = ['shield', 'magnet', 'slowmo', 'emp_bomb', 'double'];
                // Если щит уже надет, убираем его из пула на этот спавн
                const pool = this.player.shield ? types.filter(t => t !== 'shield') : types;
                const kind = pool[Math.floor(Math.random() * pool.length)];

                this.powerups.push({
                    kind: kind,
                    x: x,
                    y: -30,
                    r: 17,
                    vy: 205 + this.difficulty * 28,
                    pulse: 0
                });
            },

            triggerEmpShockwave() {
                this.sound.playEmpBlast();
                this.triggerShake(9, 0.35);
                this.empWaves.push({
                    x: this.player.x,
                    y: this.player.y,
                    r: 20,
                    maxR: Math.max(this.width, this.height) * 1.15,
                    alpha: 1
                });

                let clearedCount = 0;
                for (let i = this.obstacles.length - 1; i >= 0; i--) {
                    const obs = this.obstacles[i];
                    const ox = obs.type === 'laser_gate' ? this.width / 2 : (obs.x || this.player.x);
                    const oy = obs.y || this.player.y;
                    this.spawnExplosion(ox, oy, '#ffd60a', 12);
                    this.obstacles.splice(i, 1);
                    clearedCount++;
                }
                for (let i = this.rocks.length - 1; i >= 0; i--) {
                    const rk = this.rocks[i];
                    this.spawnExplosion(rk.x, rk.y, '#ff9f1c', 14);
                    if (rk.isBoss) {
                        rk.hp = Math.max(1, rk.hp - 18);
                    } else {
                        this.rocks.splice(i, 1);
                        this.runRocksDestroyed++;
                        this.pass.recordProgress('destroy_rocks', 1, false);
                        clearedCount++;
                    }
                }

                if (this.driveBoss) {
                    // ЭМИ-волна сбивает снаряды босса и призывает 2 фиолетовые искры для атаки
                    this.spawnPurpleBossSpark();
                    this.spawnPurpleBossSpark();
                    clearedCount += 2;
                }
                for (let i = this.enemyUfos.length - 1; i >= 0; i--) {
                    const ufo = this.enemyUfos[i];
                    this.spawnExplosion(ufo.x, ufo.y, '#ff0a78', 14);
                    ufo.hp -= 10;
                    if (ufo.hp <= 0) {
                        this.enemyUfos.splice(i, 1);
                        this.onEnemyUfoDestroyed(ufo);
                        clearedCount++;
                    }
                }
                this.enemyBullets = [];
                this.bossProjectiles = [];

                const bonusPts = Math.max(100, clearedCount * 45 * this.combo);
                this.score += bonusPts;
                this.addFloatingText(this.player.x, this.player.y - 24, `[ ЭМИ-ИМПУЛЬС +${bonusPts} ]`, '#ff9f1c');
            }
        });
