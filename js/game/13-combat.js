        // Weapons, rocks, drops and particles
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

                        // Методы боевого режима «ЗАЧИСТКА»
            firePlayerLasers() {
                this.lastPlayerShotAt = this.runTime;
                const shipCfg = this.getActiveShipConfig();
                const isPlasma = this.weaponBuffTimer > 0 && this.weaponBuffType === 'plasma';
                const isSpread = this.weaponBuffTimer > 0 && this.weaponBuffType === 'spread';
                const ionFan = this.hasTimedSuper('ion_fan');
                const isScatter = this.debuffTimer > 0 && this.debuffType === 'scatter';

                const perks = this.getActiveShipPerk();
                const chargedVolley = perks.pulseVolley && ++this.runLaserVolleys % 5 === 0;
                const shipLaserBonus = perks.laser + (this.expedition?.power || 0) + (chargedVolley ? 2 : 0);
                const dmg = ((isPlasma ? 2 : 1) + shipLaserBonus) * (this.overdriveActive ? 2 : 1);
                const bulletColor = shipCfg.id === 'crimson_requiem' ? '#e63249'
                    : (isPlasma || chargedVolley ? '#ffd60a' : (ionFan ? this.runSuper.color : shipCfg.primary));
                const speed = -640;
                const requiem = shipCfg.id === 'crimson_requiem';
                const volcanic = shipCfg.id === 'volcanic';
                const customStyle = customShipShots.get(shipCfg.id);
                const shotStyle = {
                    requiem,
                    volcanic,
                    customStyle,
                    plasma: isPlasma,
                    born: this.runTime,
                    ascended: Boolean(requiem || volcanic || customStyle) && this.overdriveActive
                };

                const jitter = isScatter ? (Math.random() - 0.5) * 210 : 0;

                if (isSpread || ionFan) {
                    const angles = ionFan ? [-0.32, -0.16, 0, 0.16, 0.32] : [-0.22, 0, 0.22];
                    angles.forEach(a => {
                        this.bullets.push({
                            x: this.player.x,
                            y: this.player.y - 18,
                            vx: Math.sin(a) * 560 + jitter,
                            vy: Math.cos(a) * speed,
                            r: isPlasma ? 5 : 4,
                            dmg: dmg,
                            color: bulletColor,
                            ...shotStyle
                        });
                    });
                } else {
                    this.bullets.push({
                        x: this.player.x,
                        y: this.player.y - 18,
                        vx: jitter,
                        vy: speed,
                        r: isPlasma ? 5.5 : 4,
                        dmg: dmg,
                        color: bulletColor,
                        ...shotStyle
                    });
                }
                this.sound.playLaserShot(shipCfg.id, this.overdriveActive);
            },

            spawnPlayerShotImpact(shot, fallbackColor, count) {
                const impact = shot.customStyle?.impact;
                this.spawnExplosion(shot.x, shot.y, impact ? shot.color : fallbackColor, count);
                if (impact && this.particles.length < 260 && !detailedShipMotion.matches) {
                    const life = shot.ascended ? 0.22 : 0.16;
                    this.particles.push({ x: shot.x, y: shot.y, vx: 0, vy: 0, life, maxLife: life, impact });
                }
            },

            spawnRock(forceBoss = false, forceCore = false) {
                const baseSpeed = 115 + this.difficulty * 24;
                if (forceBoss) {
                    const maxHp = Math.round(35 + this.difficulty * 15);
                    this.rocks.push({
                        x: this.width * 0.5,
                        y: -55,
                        r: 44,
                        hp: maxHp,
                        maxHp: maxHp,
                        vy: baseSpeed * 0.58,
                        vx: 42,
                        rot: 0,
                        vRot: 0.6,
                        isExplosive: false,
                        isBoss: true,
                        vertices: this.generateRockPolygon(9, 44)
                    });
                    this.showToast('[[xp:warning]] ВНИМАНИЕ: ПРИБЛИЖАЕТСЯ МЕГА-АСТЕРОИД!');
                    this.triggerShake(7, 0.4);
                    return;
                }

                const roll = Math.random();
                let r = 22;
                let hp = 3;
                let isExplosive = false;

                if (forceCore || (roll >= 0.80 && roll < 0.92)) {
                    // Взрывной детонирующий кристалл
                    r = 23;
                    hp = Math.round(4 + this.difficulty * 1.6);
                    isExplosive = true;
                } else if (roll < 0.45) {
                    // Малый метеорит
                    r = 18 + Math.random() * 5;
                    hp = Math.max(2, Math.round(2 + this.difficulty * 1.2));
                } else if (roll < 0.80) {
                    // Средний бронированный камень
                    r = 26 + Math.random() * 6;
                    hp = Math.round(5 + this.difficulty * 2.3);
                } else {
                    // Тяжёлая глыба
                    r = 34 + Math.random() * 5;
                    hp = Math.round(10 + this.difficulty * 3.5);
                }

                const x = r + 16 + Math.random() * Math.max(20, this.width - (r + 16) * 2);
                this.rocks.push({
                    x: x,
                    y: -r - 15,
                    r: r,
                    hp: hp,
                    maxHp: hp,
                    vy: baseSpeed * (0.85 + Math.random() * 0.3),
                    vx: (Math.random() - 0.5) * 38,
                    rot: Math.random() * Math.PI * 2,
                    vRot: (Math.random() - 0.5) * 2.2,
                    isExplosive: isExplosive,
                    isBoss: false,
                    vertices: this.generateRockPolygon(7 + Math.floor(Math.random() * 3), r)
                });
            },

            generateRockPolygon(sides, radius) {
                const pts = [];
                for (let i = 0; i < sides; i++) {
                    const a = (i / sides) * Math.PI * 2;
                    const dist = radius * (0.82 + Math.random() * 0.26);
                    pts.push({ x: Math.cos(a) * dist, y: Math.sin(a) * dist });
                }
                return pts;
            },

            onRockDestroyed(rk) {
                this.sound.playRockDestroy();
                const col = rk.isBoss ? '#ffd60a' : (rk.isExplosive ? '#ff9f1c' : '#38bdf8');
                this.spawnExplosion(rk.x, rk.y, col, rk.isBoss ? 32 : 16);

                const pts = this.awardRunScore((rk.isBoss ? Math.round(300 * 0.85) : rk.maxHp * 12) * this.combo * (this.overdriveActive ? 2 : 1));
                this.runRocksDestroyed += 1;
                this.pass.state.totalRocksDestroyed = (this.pass.state.totalRocksDestroyed || 0) + 1;
                this.pass.recordActiveContractProgress('rocksDestroyed', 1, false);
                this.pass.recordProgress('destroy_rocks', 1, false);

                if (rk.isBoss) {
                    const bossXp = Math.round(50 * 0.85);
                    this.runXp += bossXp;
                    this.pass.addXp(bossXp);
                    this.addFloatingText(rk.x, rk.y, `[[xp:burst]] БОСС УНИЧТОЖЕН +${pts} (+${bossXp} XP)!`, '#ffd60a');
                } else {
                    this.addFloatingText(rk.x, rk.y, `+${pts}`, '#67e8f9');
                }

                // Если это детонирующий кристалл — взрывает соседние камни цепной реакцией!
                if (rk.isExplosive) {
                    const blastRadius = 135 + this.getActiveShipPerk().blastRadius;
                    this.empWaves.push({
                        x: rk.x,
                        y: rk.y,
                        r: 10,
                        maxR: blastRadius,
                        alpha: 0.95
                    });
                    this.pass.recordProgress('explosive_rocks', 1, false);
                    if (this.expedition) this.expedition.cores++;
                    this.addFloatingText(rk.x, rk.y - 16, '[[xp:burst]] ДЕТОНАЦИЯ ЯДРА!', '#ff9f1c');
                    for (let j = this.rocks.length - 1; j >= 0; j--) {
                        const other = this.rocks[j];
                        if (other === rk) continue;
                        const d = Math.hypot(other.x - rk.x, other.y - rk.y);
                        if (d < blastRadius + other.r) {
                            other.hp -= 6;
                            this.spawnExplosion(other.x, other.y, '#ff9f1c', 8);
                        }
                    }
                }

                // Дроп из камня: чаще всего (~65%) ничего, ~22% бафф, ~13% дебафф (у босса 100% бафф + монета)
                if (rk.isBoss) {
                    this.rareCoins.push({ x: rk.x - 16, y: rk.y, r: 15, vy: 190, phase: 0 });
                    this.rareCoins.push({ x: rk.x + 16, y: rk.y, r: 15, vy: 190, phase: 1 });
                    this.spawnRockDrop(rk.x, rk.y, 'buff');
                    return;
                }

                const dropRoll = Math.random();
                if (dropRoll < 0.65) {
                    // Ничего (или иногда обычная синяя искра)
                    if (Math.random() < 0.35) {
                        this.blueSparks.push({ x: rk.x, y: rk.y, r: 12, vy: 200, pulse: 0 });
                    }
                } else if (dropRoll < 0.87) {
                    // Выпадает БАФФ (22%)
                    this.spawnRockDrop(rk.x, rk.y, 'buff');
                } else {
                    // Выпадает ДЕБАФФ (13%)
                    this.spawnRockDrop(rk.x, rk.y, 'debuff');
                }
            },

            spawnRockDrop(x, y, category) {
                if (category === 'buff') {
                    const buffs = ['rapid', 'spread', 'plasma', 'shield_drop'];
                    const sub = buffs[Math.floor(Math.random() * buffs.length)];
                    this.dropCapsules.push({
                        x, y, r: 15,
                        vy: 185,
                        category: 'buff',
                        subType: sub,
                        pulse: 0
                    });
                } else {
                    const debuffs = ['slow_ship', 'jam_guns', 'scatter'];
                    const sub = debuffs[Math.floor(Math.random() * debuffs.length)];
                    this.dropCapsules.push({
                        x, y, r: 15,
                        vy: 205,
                        category: 'debuff',
                        subType: sub,
                        pulse: 0
                    });
                }
            },

            spawnExplosion(x, y, color, count = 14) {
                const budget = Math.max(0, 260 - this.particles.length);
                const realCount = Math.min(count, budget);
                const effCount = (this.isMobileDevice && this.isMobileDevice()) ? Math.max(3, Math.ceil(realCount * 0.5)) : realCount;
                for (let i = 0; i < effCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 50 + Math.random() * 210;
                    this.particles.push({
                        x,
                        y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 0.45 + Math.random() * 0.3,
                        maxLife: 0.75,
                        size: 2.5 + Math.random() * 3,
                        color
                    });
                }
            },

            addFloatingText(x, y, text, color) {
                this.floatingTexts.push({
                    x,
                    y,
                    text,
                    color,
                    life: 0.95
                });
            }
        });
