        // Game session, HUD and Neon Pass UI
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        defineNeonDriftGameMethods({

            clearActiveBuffIndicators() {
                document.getElementById('shieldIndicator').classList.remove('active');
                document.getElementById('overdriveIndicator').classList.remove('active');
                const edgeFx = document.getElementById('overdriveEdgeFx');
                if (edgeFx) edgeFx.classList.remove('active');
                document.getElementById('magnetIndicator').classList.remove('active');
                document.getElementById('slowmoIndicator').classList.remove('active');
                document.getElementById('weaponBuffIndicator').classList.remove('active');
                document.getElementById('debuffIndicator').classList.remove('active');
                const doubleInd = document.getElementById('doubleIndicator');
                if (doubleInd) doubleInd.classList.remove('active');
            },

            returnToMenu() {
                this.expedition = null;
                document.getElementById('expeditionHud').classList.add('hidden');
                document.getElementById('expeditionRefit').classList.add('hidden');
                this.keys={};this._requiemMorph=0;this._requiemLastShot=-100;
                this.player.trail=[];this.particles=[];this._trailAcc=0;
                this.state = 'MENU';
                this.pointerActive = false;
                this.activePointerId = null;
                this.sound.stopBgm();

                this.obstacles = [];
                this.blueSparks = [];
                this.rareCoins = [];
                this.powerups = [];
                this.empWaves = [];
                this.bullets = [];
                this.rocks = [];
                this.dropCapsules = [];
                this.floatingTexts = [];
                this.overdriveActive = false;
                this.overdriveCharge = 0;
                this.magnetTimer = 0;
                this.slowmoTimer = 0;
                this.weaponBuffTimer = 0;
                this.debuffTimer = 0;
                this.doubleScoreTimer = 0;
                this.driveBoss = null;
                this.bossProjectiles = [];
                this.purpleSparks = [];
                this.purpleSparkTimer = 0;
                this.homingBossShots = [];
                this.enemyUfos = [];
                this.enemyBullets = [];
                this.clearanceBoss = null;
                this.clearanceBossBullets = [];
                this.clearanceBossTier = 0;
                this.nextClearanceBossScore = CLEARANCE_BOSS_FIRST_SCORE;
                this.nextDriveBossScore = 30000;
                this.next4242Milestone = 4242;

                this.player.x = this.width * 0.5;
                this.player.y = this.height * 0.78;
                this.player.tilt = 0;
                this.player.rudderSteering = 0;
                this.player.shield = false;

                document.getElementById('pauseOverlay').classList.add('hidden');
                document.getElementById('gameOverOverlay').classList.add('hidden');
                document.getElementById('passOverlay').classList.add('hidden');
                document.getElementById('leaderboardOverlay').classList.add('hidden');
                document.getElementById('profileOverlay').classList.add('hidden');
                document.getElementById('hangarOverlay').classList.add('hidden');
                document.getElementById('onlineOverlay').classList.add('hidden');
                this.sound.stopBgm();
                this.clearActiveBuffIndicators();
                document.getElementById('startOverlay').classList.remove('hidden');
                this.updateAllUI();
                // Музыка главного меню
                this.sound.startBgm('MENU');
            },

            startGame() {
                this.keys={};this.pointerActive=false;this.activePointerId=null;
                this._requiemMorph=0;this._requiemLastShot=-100;
                this._trailAcc=0;this.trailSeq=0;
                this.lastFrameTime=performance.now();
                document.querySelectorAll('.overlay').forEach(el=>el.classList.add('hidden'));
                this.state = 'PLAYING';
                this.score = 0;
                this.combo = 1;
                this.comboTimer = 0;
                this.overdriveCharge = 0;
                this.overdriveActive = false;
                this.overdriveTimer = 0;
                this.magnetTimer = 0;
                this.slowmoTimer = 0;
                this.doubleScoreTimer = 0;
                this.comboMilestones = new Set();
                this.shakeMag = 0;
                this.shakeTime = 0;

                const runPerk = this.getActiveShipPerk();
                this.comboDuration = this.maxComboDuration + runPerk.combo;

                this.runBlueSparks = 0;
                this.runRareCoins = 0;
                this.runSparks = 0;
                this.runNearMisses = 0;
                this.runXp = 0;
                this.runTime = 0;
                this.driveSceneryDistance = 0;
                this.difficulty = 1;

                this.player.x = this.width * 0.5;
                this.player.y = this.height * 0.78;
                this.player.tilt = 0;
                this.player.rudderSteering = 0;
                this.player.shield = Boolean(runPerk.shield) || this.pass.state.equippedMask === 'cryo_gen' || this.pass.state.equippedMask === 'aegis_matrix';
                this.player.trail = [];
                document.getElementById('shieldIndicator').classList.toggle('active', this.player.shield);

                this.obstacles = [];
                this.blueSparks = [];
                this.rareCoins = [];
                this.powerups = [];
                this.empWaves = [];
                this.bullets = [];
                this.rocks = [];
                this.dropCapsules = [];
                this.particles = [];
                this.floatingTexts = [];

                this.weaponBuffType = null;
                this.weaponBuffTimer = 0;
                this.debuffType = null;
                this.debuffTimer = 0;
                this.shootCooldown = 0.1;
                this.rockSpawnTimer = 0.4;
                this.nextClearanceBossScore = CLEARANCE_BOSS_FIRST_SCORE;
                this.clearanceBoss = null;
                this.clearanceBossBullets = [];
                this.clearanceBossTier = 0;
                this.runRocksDestroyed = 0;
                this.expedition = this.gameMode === 'EXPEDITION' ? { completed: 0, bosses: 0, power: 0, cooling: 0, reactor: 0, style: 'DRIVE', bags: {} } : null;
                document.getElementById('expeditionHud').classList.toggle('hidden', !this.expedition);
                if (this.expedition) {
                    this.chooseExpeditionMission();
                    this.updateExpedition();
                }
                this.driveBoss = null;
                this.bossProjectiles = [];
                this.purpleSparks = [];
                this.purpleSparkTimer = 0;
                this.homingBossShots = [];
                this.enemyUfos = [];
                this.enemyBullets = [];
                this.ufoSpawnTimer = 11.0;
                this.nextDriveBossScore = 30000;
                this.next4242Milestone = 4242;

                this.spawnTimer = 0.5;
                this.collectibleTimer = 0.45;
                this.powerupTimer = 5.0;

                document.getElementById('startOverlay').classList.add('hidden');
                document.getElementById('modeSelectOverlay').classList.add('hidden');
                document.getElementById('pauseOverlay').classList.add('hidden');
                document.getElementById('gameOverOverlay').classList.add('hidden');
                document.getElementById('passOverlay').classList.add('hidden');
                document.getElementById('leaderboardOverlay').classList.add('hidden');
                document.getElementById('profileOverlay').classList.add('hidden');
                document.getElementById('hangarOverlay').classList.add('hidden');
                document.getElementById('onlineOverlay').classList.add('hidden');
                this.clearActiveBuffIndicators();

                this.updateHud();
                this.sound.startBgm(this.flightMode(), this.overdriveActive);
            },

            flightMode() {
                return this.expedition?.style || this.gameMode;
            },

            chooseExpeditionMission() {
                const run = this.expedition;
                const sector = run.completed;
                const style = sector % 2 ? 'CLEARANCE' : 'DRIVE';
                const tier = Math.min(8, Math.floor(sector / 4));
                const missions = {
                    time: ['Продержись в полёте', 'runTime', 18 + tier * 2, ' с'],
                    sparks: ['Собери синие искры', 'runBlueSparks', 5 + tier, ''],
                    coins: ['Подбери золотые монеты', 'runRareCoins', 2 + Math.floor(tier / 3), ''],
                    score: ['Набери очки', 'score', 500 + tier * 125, ''],
                    drift: ['Выполни опасные обгоны', 'runNearMisses', 2 + Math.floor(tier / 2), ''],
                    rocks: ['Разрушь астероиды', 'runRocksDestroyed', 4 + tier, ''],
                    boss: ['Победи босса', 'bosses', 1, '']
                };
                let key = 'boss';
                if (sector % 4 !== 3) {
                    let bag = run.bags[style];
                    if (!bag?.length) {
                        bag = ['time', 'sparks', 'coins', 'score', style === 'DRIVE' ? 'drift' : 'rocks'];
                        run.bags[style] = bag;
                    }
                    const alternatives = bag.filter(id => id !== run.mission?.key);
                    const pool = alternatives.length ? alternatives : bag;
                    key = pool[Math.floor(Math.random() * pool.length)];
                    bag.splice(bag.indexOf(key), 1);
                }
                const [label, stat, target, unit] = missions[key];
                run.mission = { key, label, stat, target, unit, start: key === 'boss' ? run.bosses : this[stat] };
            },

            offerExpeditionUpgrades() {
                const run = this.expedition;
                const available = {
                    Power: run.power < 6, Cooling: run.cooling < 6, Shield: !this.player.shield,
                    Magnet: true, Chrono: true, Reactor: run.reactor < 5, Double: true
                };
                const pool = Object.keys(available).filter(key => available[key]);
                run.offers = [];
                while (run.offers.length < 3) {
                    run.offers.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
                }
                for (const key of Object.keys(available)) {
                    const button = document.getElementById('expedition' + key);
                    button.disabled = !run.offers.includes(key);
                    button.classList.toggle('hidden', button.disabled);
                }
            },

            updateExpedition() {
                const run = this.expedition;
                const mission = run.mission;
                const value = mission.key === 'boss' ? run.bosses : this[mission.stat];
                const progress = Math.min(mission.target, Math.floor(value - mission.start));
                if (mission.progress !== progress) {
                    if (mission.progress === undefined) {
                        document.getElementById('expeditionHud').dataset.style = run.style;
                        document.getElementById('expeditionSector').textContent = 'Сектор ' + (run.completed + 1) + ' / ' + (run.style === 'DRIVE' ? 'Драйв' : 'Зачистка');
                        document.getElementById('expeditionGoal').textContent = mission.label;
                    }
                    mission.progress = progress;
                    document.getElementById('expeditionCount').textContent = progress + '/' + mission.target + mission.unit;
                    document.getElementById('expeditionBar').style.transform = 'scaleX(' + progress / mission.target + ')';
                }
                if (progress < mission.target) return;
                run.completed++;
                this.pass.state.bestExpeditionSectors = Math.max(this.pass.state.bestExpeditionSectors || 0, run.completed);
                this.pass.triggerSave(true);
                this.state = 'REFIT';
                this.keys = {};
                this.pointerActive = false;
                this.activePointerId = null;
                this.sound.stopBgm();
                this.sound.playLevelUp();
                this.chooseExpeditionMission();
                const next = run.mission;
                document.getElementById('expeditionHeading').textContent = `Сектор ${run.completed} пройден`;
                document.getElementById('expeditionNext').textContent = `Следом · ${run.completed % 2 ? 'Зачистка' : 'Драйв'} · ${next.label} · ${next.target}${next.unit}`;
                this.offerExpeditionUpgrades();
                document.getElementById('expeditionRefit').classList.remove('hidden');
                document.getElementById('expedition' + run.offers[0]).focus();
            },

            resumeExpedition(upgrade) {
                if (this.state !== 'REFIT' || !this.expedition.offers.includes(upgrade)) return;
                const run = this.expedition;
                run.style = run.completed % 2 ? 'CLEARANCE' : 'DRIVE';
                for (const objects of [this.obstacles, this.rocks, this.enemyUfos, this.enemyBullets,
                    this.bullets, this.clearanceBossBullets, this.dropCapsules, this.blueSparks,
                    this.rareCoins, this.powerups]) objects.length = 0;
                this.spawnTimer = 1;
                this.rockSpawnTimer = 1;
                this.ufoSpawnTimer = 10;
                this.collectibleTimer = 0.6;
                if (upgrade === 'Double') this.doubleScoreTimer += 12;
                if (upgrade === 'Magnet') this.magnetTimer += 18;
                if (upgrade === 'Chrono') this.slowmoTimer += 8;
                if (upgrade === 'Reactor') run.reactor = Math.min(5, run.reactor + 1);
                if (upgrade === 'Power') this.expedition.power++;
                if (upgrade === 'Cooling') this.expedition.cooling++;
                if (upgrade === 'Shield') {
                    this.player.shield = true;
                    document.getElementById('shieldIndicator').classList.add('active');
                }
                document.getElementById('expeditionRefit').classList.add('hidden');
                this.keys = {};
                this.state = 'PLAYING';
                this.lastFrameTime = performance.now();
                this.updateExpedition();
                this.difficulty = this.getRunDifficulty();
                if (this.expedition.completed % 4 === 3) this.spawnClearanceBoss();
                this.sound.startBgm(this.flightMode(), this.overdriveActive);
            },

            pauseGame() {
                if(this.state !== 'PLAYING')return;
                this.keys={};
                this.state = 'PAUSED';
                this.pointerActive = false;
                this.activePointerId = null;
                this.sound.stopBgm();
                this.updatePauseStats();
                document.getElementById('pauseOverlay').classList.remove('hidden');
            },

            resumeGame() {
                if(this.state !== 'PAUSED')return;
                if(document.querySelector('.overlay:not(.hidden):not(#pauseOverlay):not(#startOverlay)'))return;
                this.keys={};
                this.state = 'PLAYING';
                this.lastFrameTime = performance.now();
                document.getElementById('pauseOverlay').classList.add('hidden');
                this.sound.startBgm(this.flightMode(), this.overdriveActive);
            },

            addOverdriveCharge(amount) {
                if (this.overdriveActive) return;
                const br = this.pass.state.equippedMask === 'brandon' ? 1.25 : 1.0;
                const sh = this.pass.state.equippedMask === 'shadow_mod' ? 1.35 : 1.0;
                const maskBoost = Math.max(br, sh);
                const shipBoost = this.getActiveShipPerk().overdrive;
                // Форсаж набирается на 50% дольше
                this.overdriveCharge = Math.min(100, this.overdriveCharge + (amount / 1.5) * maskBoost * shipBoost * (1 + (this.expedition?.reactor || 0) * 0.1));
                if (this.overdriveCharge >= 100) {
                    this.overdriveActive = true;
                    this.overdriveTimer = this.overdriveDuration;
                    document.getElementById('overdriveIndicator').classList.add('active');
                    const edgeFx = document.getElementById('overdriveEdgeFx');
                    if (edgeFx) edgeFx.classList.add('active');
                    this.sound.playOverdriveStart();
                    this.sound.startBgm(this.flightMode(), true);
                    this.spawnExplosion(this.player.x, this.player.y, '#ffd60a', 24);
                    this.addFloatingText(this.player.x, this.player.y - 24, '« ФОРСАЖ x2 АКТИВЕН »', '#ffd60a');
                    this.pass.recordProgress('overdrives', 1, false);
                }
            },

            gameOver() {
                if (this.state === 'GAMEOVER') return;
                document.getElementById('expeditionHud').classList.add('hidden');
                document.getElementById('expeditionRefit').classList.add('hidden');
                this.state = 'GAMEOVER';
                this.pointerActive = false;
                this.activePointerId = null;
                this.overdriveActive = false;
                this.magnetTimer = 0;
                this.slowmoTimer = 0;
                this.sound.stopBgm();
                this.sound.playExplosion();
                this.triggerShake(12, 0.5);

                const shipCfg = this.getActiveShipConfig();
                this.spawnExplosion(this.player.x, this.player.y, shipCfg.primary, 28);
                this.spawnExplosion(this.player.x, this.player.y, '#ff2a85', 22);

                const finalScore = Math.floor(this.score);
                if (this.expedition) {
                    this.pass.state.bestExpeditionSectors = Math.max(this.pass.state.bestExpeditionSectors || 0, this.expedition.completed);
                } else if (this.gameMode === 'CLEARANCE') {
                    if (finalScore > (this.pass.state.bestScoreClearance || 0)) {
                        this.pass.state.bestScoreClearance = finalScore;
                    }
                } else if (this.gameMode === 'DRIVE') {
                    if (finalScore > (this.pass.state.bestScoreDrive || 0)) {
                        this.pass.state.bestScoreDrive = finalScore;
                    }
                }
                this.pass.state.bestScore = Math.max(
                    this.pass.state.bestScore || 0,
                    this.pass.state.bestScoreDrive || 0,
                    this.pass.state.bestScoreClearance || 0
                );
                this.pass.state.bestSurviveSec = Math.max(this.pass.state.bestSurviveSec || 0, Math.floor(this.runTime));

                const scoreXpResult = this.pass.awardScoreXp(finalScore);
                const totalRunXp = this.runXp + scoreXpResult.granted;
                const runScoreSparks = Math.min(125, Math.floor(Math.max(0, finalScore) / 300));
                const totalRunSparks = this.runSparks + this.pass.awardSparks(runScoreSparks);

                this.pass.state.totalRuns += 1;
                this.pass.recordActiveContractProgress('runs', 1, false);
                this.pass.recordActiveContractProgress('maxRunScore', finalScore, true);
                this.pass.recordActiveContractProgress('maxRunSurvive', Math.floor(this.runTime), true);
                if (this.gameMode === 'CLEARANCE') {
                    this.pass.recordProgress('clearance_runs', 1, false);
                } else if (this.gameMode === 'DRIVE') {
                    this.pass.recordProgress('drive_runs', 1, false);
                }
                this.pass.recordProgress('run_coins', this.runRareCoins, true);
                this.pass.recordProgress('survive', Math.floor(this.runTime), true);
                this.pass.triggerSave(true);

                const nick = this.pass.state.nickname || 'Пилот';
                const titleObj = this.getTitleObj(this.pass.state.equippedTitle);
                document.getElementById('endNickDisplay').textContent = nick;
                const endTitleEl = document.getElementById('endTitleDisplay');
                endTitleEl.className = `player-title-badge ${titleObj.cssClass}`;
                endTitleEl.textContent = `${titleObj.icon ? titleObj.icon + ' ' : ''}${titleObj.name}`;

                document.getElementById('endScore').textContent = finalScore;
                document.getElementById('endBestScore').textContent = this.expedition
                    ? `${this.pass.state.bestExpeditionSectors || 0} сект.`
                    : this.pass.state.bestScore;
                if (this.expedition) document.getElementById('endScore').textContent = `${finalScore} · ${this.expedition.completed} сект.`;
                const endSparksEl = document.getElementById('endSparksGained');
                if (endSparksEl) endSparksEl.textContent = `+${totalRunSparks} [[xp:spark]]`;
                document.getElementById('endXpGained').textContent = scoreXpResult.capReached && scoreXpResult.granted === 0
                    ? `+${totalRunXp} XP (ЛИМИТ 5000/ДЕНЬ)`
                    : `+${totalRunXp} XP`;
                this.clearActiveBuffIndicators();

                this.updateAllUI();
                setTimeout(() => {
                    if (this.state === 'GAMEOVER') {
                        document.getElementById('gameOverOverlay').classList.remove('hidden');
                    }
                }, 420);
            },

            updateHud() {
                document.getElementById('hudScore').textContent = Math.floor(this.score);
                document.getElementById('hudSparks').textContent = this.pass.state.sparks;

                const comboEl = document.getElementById('hudCombo');
                if (this.combo > 1) {
                    comboEl.textContent = `x${this.combo}`;
                    comboEl.classList.add('active');
                } else {
                    comboEl.classList.remove('active');
                }

                const pct = this.overdriveActive
                    ? Math.max(0, Math.round((this.overdriveTimer / this.overdriveDuration) * 100))
                    : Math.round(this.overdriveCharge);
                document.getElementById('hudOverdrivePct').textContent = this.overdriveActive
                    ? `${Math.max(0, this.overdriveTimer).toFixed(1)}с`
                    : `${pct}%`;
                document.getElementById('hudOverdriveFill').style.width = `${pct}%`;
                const odTimerSpan = document.getElementById('overdriveTimerText');
                if (odTimerSpan && this.overdriveActive) {
                    odTimerSpan.textContent = `${Math.max(0, this.overdriveTimer).toFixed(1)}с`;
                }

                const magnetEl = document.getElementById('magnetIndicator');
                if (this.magnetTimer > 0) {
                    magnetEl.classList.add('active');
                    document.getElementById('magnetTimerText').textContent = `${this.magnetTimer.toFixed(1)}с`;
                } else {
                    magnetEl.classList.remove('active');
                }

                const slowmoEl = document.getElementById('slowmoIndicator');
                if (this.slowmoTimer > 0) {
                    slowmoEl.classList.add('active');
                    document.getElementById('slowmoTimerText').textContent = `${this.slowmoTimer.toFixed(1)}с`;
                } else {
                    slowmoEl.classList.remove('active');
                }

                const doubleEl = document.getElementById('doubleIndicator');
                if (doubleEl) {
                    if (this.doubleScoreTimer > 0) {
                        doubleEl.classList.add('active');
                        const doubleText = document.getElementById('doubleTimerText');
                        if (doubleText) doubleText.textContent = `${this.doubleScoreTimer.toFixed(1)}с`;
                    } else {
                        doubleEl.classList.remove('active');
                    }
                }

                const wBuffEl = document.getElementById('weaponBuffIndicator');
                if (this.weaponBuffTimer > 0 && this.weaponBuffType) {
                    wBuffEl.classList.add('active');
                    const names = {
                        rapid: 'СКОРОСТРЕЛ',
                        spread: 'ТРОЙНОЙ ЛУЧ',
                        plasma: 'ПЛАЗМА x2'
                    };
                    document.getElementById('weaponBuffText').textContent = `${names[this.weaponBuffType] || 'ОРУДИЯ'}: ${this.weaponBuffTimer.toFixed(1)}с`;
                } else {
                    wBuffEl.classList.remove('active');
                }

                const debuffEl = document.getElementById('debuffIndicator');
                if (this.debuffTimer > 0 && this.debuffType) {
                    debuffEl.classList.add('active');
                    const dNames = {
                        slow_ship: 'ТЯЖЕСТЬ',
                        jam_guns: 'ПЕРЕГРЕВ',
                        scatter: 'РАЗБРОС'
                    };
                    document.getElementById('debuffText').textContent = `${dNames[this.debuffType] || 'СБОЙ'}: ${this.debuffTimer.toFixed(1)}с`;
                } else {
                    debuffEl.classList.remove('active');
                }
            },

            updateAllUI() {
                this.updateDevButtonsVisibility();
                this.pass.evaluateAutoTitles();
                const lvlInfo = this.pass.getLevelInfo();
                const pct = Math.min(100, Math.round((lvlInfo.currentXp / lvlInfo.requiredXp) * 100));
                const notif = this.pass.getNotifications();

                const nick = this.pass.state.nickname || 'Пилот';
                const titleObj = this.getTitleObj(this.pass.state.equippedTitle);
                this.applyThemeClassToElement(document.getElementById('btnOpenProfileCard'), 'account-bar');
                document.getElementById('menuDisplayNick').textContent = nick;
                const menuTitleEl = document.getElementById('menuDisplayTitle');
                menuTitleEl.className = `player-title-badge ${titleObj.cssClass}`;
                menuTitleEl.textContent = `${titleObj.icon ? titleObj.icon + ' ' : ''}${titleObj.name}`;

                document.getElementById('startBestScore').textContent = this.pass.state.bestScore;
                document.getElementById('startSparks').textContent = this.pass.state.sparks;
                document.getElementById('hudSparks').textContent = this.pass.state.sparks;

                const passLvlLabel = lvlInfo.isMaxed
                    ? `УР. 30 · БОНУС`
                    : `УР. ${lvlInfo.level} / ${this.pass.maxLevel}`;
                document.getElementById('startPassLvl').textContent = passLvlLabel;
                document.getElementById('startPassBar').style.width = `${pct}%`;
                document.getElementById('dotPassStart').classList.toggle('active', notif.any);

                document.getElementById('endPassLvl').textContent = passLvlLabel;
                document.getElementById('endPassBar').style.width = `${pct}%`;
                document.getElementById('dotPassEnd').classList.toggle('active', notif.any);

                document.getElementById('dotTabTrack').classList.toggle('active', notif.hasRewardReady);
                document.getElementById('dotTabQuests').classList.toggle('active', notif.hasQuestReady);

                const readyContractsCount = this.pass.getAvailableContractsCount();
                const hasContractsReady = readyContractsCount > 0;
                const readyContractsLabel = readyContractsCount > 9 ? '9+' : String(readyContractsCount);

                const dotProfileEl = document.getElementById('dotProfileContracts');
                if (dotProfileEl) {
                    dotProfileEl.textContent = hasContractsReady ? readyContractsLabel : '!';
                    dotProfileEl.classList.toggle('active', hasContractsReady);
                }
                const dotMenuContracts = document.getElementById('dotMenuContracts');
                if (dotMenuContracts) {
                    dotMenuContracts.textContent = hasContractsReady ? readyContractsLabel : '!';
                    dotMenuContracts.classList.toggle('active', hasContractsReady);
                }

                this.updateDailyBonusButton();
            },

            openPassModal() {
                const notif = this.pass.getNotifications();
                if (notif.hasQuestReady && !notif.hasRewardReady) {
                    this.activePassTab = 'QUESTS';
                } else {
                    this.activePassTab = 'TRACK';
                }
                this.renderPassModal(true);
                document.getElementById('passOverlay').classList.remove('hidden');
            },

            renderPassModal(autoScrollTrack = false) {
                this.pass.checkCooldowns();
                const lvlInfo = this.pass.getLevelInfo();
                const pct = Math.min(100, Math.round((lvlInfo.currentXp / lvlInfo.requiredXp) * 100));
                const notif = this.pass.getNotifications();

                document.getElementById('passSparksBalance').textContent = this.pass.state.sparks;
                document.getElementById('passModalLevelNum').textContent = lvlInfo.level;
                document.getElementById('passModalXpText').textContent = lvlInfo.isMaxed
                    ? `БОНУС +${this.pass.postMaxBonusSparks} [[xp:spark]]: ${lvlInfo.currentXp} / 500 XP`
                    : `${lvlInfo.currentXp} / ${lvlInfo.requiredXp} XP`;
                document.getElementById('passModalXpBar').style.width = `${pct}%`;

                document.getElementById('dotTabTrack').classList.toggle('active', notif.hasRewardReady);
                document.getElementById('dotTabQuests').classList.toggle('active', notif.hasQuestReady);

                const trackViewport = document.getElementById('brawlTrackViewport');
                const questsViewport = document.getElementById('brawlQuestsViewport');
                const tabBtnTrack = document.getElementById('tabBtnTrack');
                const tabBtnQuests = document.getElementById('tabBtnQuests');

                if (this.activePassTab === 'TRACK') {
                    tabBtnTrack.classList.add('active');
                    tabBtnQuests.classList.remove('active');
                    trackViewport.classList.remove('hidden');
                    questsViewport.classList.add('hidden');
                    this.renderBrawlTrack(trackViewport, lvlInfo.level, autoScrollTrack);
                } else {
                    tabBtnQuests.classList.add('active');
                    tabBtnTrack.classList.remove('active');
                    questsViewport.classList.remove('hidden');
                    trackViewport.classList.add('hidden');
                    this.renderBrawlQuests(questsViewport);
                }
            },

            renderBrawlTrack(container, currentLevel, autoScroll) {
                container.innerHTML = '';
                const maxTier = this.pass.maxLevel;
                let scrollTargetEl = null;

                for (let tierLvl = 1; tierLvl <= maxTier; tierLvl++) {
                    const isFinale = tierLvl === maxTier;
                    const unlocked = currentLevel >= tierLvl;
                    const claimed = this.pass.state.claimedLevels.includes(tierLvl);
                    const claimable = unlocked && !claimed;
                    const rewardObj = this.pass.getRewardForLevel(tierLvl);
                    const reqXpForTier = this.pass.getXpRequiredForLevel(tierLvl);

                    const col = document.createElement('div');
                    col.className = `brawl-tier-column ${unlocked ? 'unlocked' : ''} ${isFinale ? 'finale-tier' : ''}`;

                    if (!scrollTargetEl && (claimable || tierLvl === currentLevel)) {
                        scrollTargetEl = col;
                    }

                    const card = document.createElement('div');
                    card.className = `brawl-reward-card ${isFinale ? 'finale-card' : ''} ${claimable ? 'claimable' : ''} ${claimed ? 'claimed' : ''}`;

                    const pixelSparkSvgSmall = `
                        <svg style="width:18px; height:18px; image-rendering:pixelated; flex-shrink:0;" viewBox="0 0 8 8" shape-rendering="crispEdges">
                            <rect x="3" y="0" width="2" height="2" fill="#ffd60a"/>
                            <rect x="2" y="2" width="4" height="1" fill="#fff3b0"/>
                            <rect x="0" y="3" width="8" height="2" fill="#ffd60a"/>
                            <rect x="3" y="3" width="2" height="2" fill="#ffffff"/>
                            <rect x="2" y="5" width="4" height="1" fill="#ff9f1c"/>
                            <rect x="3" y="6" width="2" height="2" fill="#ffd60a"/>
                        </svg>
                    `;

                    if (isFinale) {
                        card.innerHTML = `
                            <div style="display:flex; flex-direction:column; align-items:center; gap:3px;">
                                <svg width="24" height="20" viewBox="0 0 24 20" fill="none" style="filter: drop-shadow(0 0 6px rgba(255, 214, 10, 0.85));">
                                    <polygon points="2 16 4 5 9 10 12 3 15 10 20 5 22 16 2 16" fill="#ffd60a" stroke="#090114" stroke-width="1.6" stroke-linejoin="round"/>
                                    <rect x="3" y="17" width="18" height="2.2" rx="1" fill="#00f5d4"/>
                                </svg>
                                <span class="brawl-card-tag">ФИНАЛ ПАССА</span>
                            </div>
                            <div style="display:flex; flex-direction:column; align-items:center; gap:5px; width:100%;">
                                <div class="finale-title-preview">ТИТУЛ:<br>«Дитя 18 века»</div>
                                <div style="display:flex; align-items:center; justify-content:center; gap:5px;">
                                    ${pixelSparkSvgSmall}
                                    <span class="brawl-reward-amount" style="font-size:0.68rem;">+${rewardObj.sparks}</span>
                                </div>
                            </div>
                        `;
                    } else {
                        card.innerHTML = `
                            <span class="brawl-card-tag">НАГРАДА</span>
                            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                                <svg style="width:32px; height:32px; image-rendering:pixelated;" viewBox="0 0 8 8" shape-rendering="crispEdges">
                                    <rect x="3" y="0" width="2" height="2" fill="#ffd60a"/>
                                    <rect x="2" y="2" width="4" height="1" fill="#fff3b0"/>
                                    <rect x="0" y="3" width="8" height="2" fill="#ffd60a"/>
                                    <rect x="3" y="3" width="2" height="2" fill="#ffffff"/>
                                    <rect x="2" y="5" width="4" height="1" fill="#ff9f1c"/>
                                    <rect x="3" y="6" width="2" height="2" fill="#ffd60a"/>
                                </svg>
                                <span class="brawl-reward-amount">+${rewardObj.sparks}</span>
                            </div>
                        `;
                    }

                    if (claimed) {
                        const status = document.createElement('div');
                        status.className = 'brawl-card-action status-done';
                        status.textContent = 'ПОЛУЧЕНО [[xp:check]]';
                        card.appendChild(status);
                    } else if (claimable) {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'brawl-card-action btn-grab';
                        btn.textContent = 'ЗАБРАТЬ!';
                        btn.addEventListener('click', () => {
                            const gained = this.pass.claimLevelReward(tierLvl);
                            if (gained) {
                                if (gained.titleName) {
                                    this.showToast(`ОТКРЫТ ТИТУЛ «${gained.titleName}» И +${gained.sparks} ИСКР!`);
                                } else {
                                    this.showToast(`ПОЛУЧЕНО +${gained.sparks} ЖЁЛТЫХ ИСКР!`);
                                }
                                this.renderPassModal(false);
                                this.updateAllUI();
                            }
                        });
                        card.appendChild(btn);
                    } else {
                        const lock = document.createElement('div');
                        lock.className = 'brawl-card-action status-lock';
                        lock.style.display = 'flex';
                        lock.style.alignItems = 'center';
                        lock.style.justifyContent = 'center';
                        lock.style.gap = '5px';
                        lock.innerHTML = `<span>УР. ${tierLvl}</span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
                        card.appendChild(lock);
                    }

                    const node = document.createElement('div');
                    node.className = 'brawl-node-medallion';
                    if (isFinale) {
                        node.style.borderColor = '#ffd60a';
                        node.style.boxShadow = '0 0 16px rgba(255, 214, 10, 0.65), 0 4px 0 #070b24';
                        node.innerHTML = `
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <polygon points="3 18 5 7 9.5 12 12 5 14.5 12 19 7 21 18 3 18" fill="#ffd60a" stroke="#090114" stroke-width="1.6" stroke-linejoin="round"/>
                                <rect x="4" y="19" width="16" height="2.5" rx="1" fill="#00f5d4"/>
                            </svg>
                        `;
                    } else {
                        node.textContent = tierLvl;
                    }

                    const footer = document.createElement('div');
                    footer.className = 'brawl-tier-footer-xp';
                    footer.textContent = isFinale ? 'УР. 30 ФИНАЛ' : `${reqXpForTier} XP`;

                    col.appendChild(card);
                    col.appendChild(node);
                    col.appendChild(footer);
                    container.appendChild(col);
                }

                // Бонусная карточка за каждые 500 XP после 30 уровня
                const lvlInfoForBonus = this.pass.getLevelInfo();
                const bonusAvail = lvlInfoForBonus.bonusAvailable;
                const bonusSparks = this.pass.postMaxBonusSparks;
                const bonusClaimedCount = lvlInfoForBonus.bonusClaimed;
                const bonusCol = document.createElement('div');
                bonusCol.className = `brawl-tier-column ${lvlInfoForBonus.isMaxed ? 'unlocked' : ''} finale-tier`;

                if (!scrollTargetEl && bonusAvail > 0) {
                    scrollTargetEl = bonusCol;
                }

                const bonusCard = document.createElement('div');
                bonusCard.className = `brawl-reward-card bonus-overflow-card ${bonusAvail > 0 ? 'claimable' : ''}`;
                bonusCard.innerHTML = `
                    <span class="brawl-card-tag">${bonusAvail > 0 ? `ДОСТУПНО: x${bonusAvail}` : 'БОНУС ПАССА'}</span>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                        <svg style="width:30px; height:30px; image-rendering:pixelated;" viewBox="0 0 8 8" shape-rendering="crispEdges">
                            <rect x="3" y="0" width="2" height="2" fill="#ffd60a"/>
                            <rect x="2" y="2" width="4" height="1" fill="#fff3b0"/>
                            <rect x="0" y="3" width="8" height="2" fill="#ffd60a"/>
                            <rect x="3" y="3" width="2" height="2" fill="#ffffff"/>
                            <rect x="2" y="5" width="4" height="1" fill="#ff9f1c"/>
                            <rect x="3" y="6" width="2" height="2" fill="#ffd60a"/>
                        </svg>
                        <span class="brawl-reward-amount">+${bonusSparks}</span>
                        <span class="bonus-reward-caption">За каждые 500 XP${bonusClaimedCount > 0 ? ` · Взято: ${bonusClaimedCount}` : ''}</span>
                    </div>
                `;

                if (bonusAvail > 0) {
                    const grabBonusBtn = document.createElement('button');
                    grabBonusBtn.type = 'button';
                    grabBonusBtn.className = 'brawl-card-action btn-grab';
                    grabBonusBtn.textContent = `ЗАБРАТЬ +${bonusSparks} [[xp:spark]]`;
                    grabBonusBtn.addEventListener('click', () => {
                        const res = this.pass.claimPostMaxBonus();
                        if (res) {
                            this.showToast(`БОНУС ПАССА: +${res.sparks} ЖЁЛТЫХ ИСКР!${res.remainingAvailable > 0 ? ` (Осталось ещё: ${res.remainingAvailable})` : ''}`);
                            this.renderPassModal(false);
                            this.updateAllUI();
                        }
                    });
                    bonusCard.appendChild(grabBonusBtn);
                } else {
                    const lockBonus = document.createElement('div');
                    lockBonus.className = 'brawl-card-action status-lock';
                    lockBonus.textContent = lvlInfoForBonus.isMaxed
                        ? `${lvlInfoForBonus.currentXp} / 500 XP`
                        : 'ПОСЛЕ 30 УР.';
                    bonusCard.appendChild(lockBonus);
                }

                const bonusNode = document.createElement('div');
                bonusNode.className = 'brawl-node-medallion';
                bonusNode.style.borderColor = '#00f5d4';
                bonusNode.style.fontSize = '0.9rem';
                bonusNode.textContent = '∞';

                const bonusFooter = document.createElement('div');
                bonusFooter.className = 'brawl-tier-footer-xp';
                bonusFooter.textContent = `500 XP = +${bonusSparks} [[xp:spark]]`;

                bonusCol.appendChild(bonusCard);
                bonusCol.appendChild(bonusNode);
                bonusCol.appendChild(bonusFooter);
                container.appendChild(bonusCol);

                const passOverlayEl = document.getElementById('passOverlay');
                if (passOverlayEl) {
                    passOverlayEl.scrollLeft = 0;
                    passOverlayEl.scrollTop = 0;
                }
                if (autoScroll && scrollTargetEl) {
                    setTimeout(() => {
                        const targetLeft = scrollTargetEl.offsetLeft - (container.clientWidth / 2) + (scrollTargetEl.offsetWidth / 2);
                        container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
                        if (passOverlayEl) passOverlayEl.scrollLeft = 0;
                    }, 40);
                }
            },

            renderBrawlQuests(container) {
                container.innerHTML = '';
                const now = Date.now();

                this.pass.state.quests.forEach((q, idx) => {
                    if (idx === 0) {
                        const b1 = document.createElement('div');
                        b1.className = 'quest-section-banner';
                        b1.textContent = '[[xp:bolt]] РЕЖИМ «ДРАЙВ» (3 КВЕСТА)';
                        container.appendChild(b1);
                    } else if (idx === 3) {
                        const b2 = document.createElement('div');
                        b2.className = 'quest-section-banner clearance';
                        b2.textContent = '[[xp:comet]] РЕЖИМ «ЗАЧИСТКА» (3 КВЕСТА)';
                        container.appendChild(b2);
                    }

                    const isClearance = q.mode === 'CLEARANCE' || idx >= 3;
                    const isCooldown = q.cooldownUntil && q.cooldownUntil > now;
                    const isReady = !isCooldown && q.progress >= q.target;

                    const card = document.createElement('div');
                    card.className = `brawl-quest-card ${isClearance ? 'clearance-quest' : ''} ${isReady ? 'ready' : ''} ${isCooldown ? 'cooldown' : ''}`;

                    if (isCooldown) {
                        const remText = this.formatRemainingTime(q.cooldownUntil - now);
                        card.innerHTML = `
                            <div class="brawl-quest-header">
                                <span class="brawl-quest-title" style="color:#94a3b8;">⏳ Слот квеста перезаряжается</span>
                                <span class="brawl-quest-xp-pill" style="background:#334155; color:#cbd5e1;">ОЖИДАНИЕ</span>
                            </div>
                            <div class="brawl-cooldown-panel">
                                <span class="brawl-cooldown-label">НОВЫЙ КВЕСТ ЧЕРЕЗ:</span>
                                <span class="brawl-cooldown-timer" data-cooldown-until="${q.cooldownUntil}">${remText}</span>
                            </div>
                        `;
                    } else {
                        const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
                        const templates = isClearance ? this.pass.clearanceQuestTemplates : this.pass.driveQuestTemplates;
                        const template = templates.find(item => item.type === q.type);
                        const title = template ? template.title.replace('{target}', q.target) : q.title;
                        card.innerHTML = `
                            <div><span class="quest-mode-pill ${isClearance ? 'clearance' : ''}">${isClearance ? '[[xp:comet]] ЗАЧИСТКА' : '[[xp:bolt]] ДРАЙВ'}</span></div>
                            <div class="brawl-quest-header">
                                <span class="brawl-quest-title">${isClearance ? '[[xp:comet]]' : '[[xp:bolt]]'} ${this.escapeHtml(title)}</span>
                                <span class="brawl-quest-xp-pill">+${q.xp} XP</span>
                            </div>
                            <div class="brawl-quest-bar-row">
                                <div class="brawl-quest-track">
                                    <div class="brawl-quest-fill" style="width:${pct}%"></div>
                                </div>
                                <span class="brawl-quest-counter">${q.progress}/${q.target}</span>
                            </div>
                        `;

                        if (isReady) {
                            const claimBtn = document.createElement('button');
                            claimBtn.type = 'button';
                            claimBtn.className = 'brawl-claim-xp-btn';
                            claimBtn.textContent = `ЗАБРАТЬ +${q.xp} XP`;
                            claimBtn.addEventListener('click', () => {
                                const res = this.pass.claimQuest(q.id);
                                if (res) {
                                    this.showToast(
                                        res.leveledUp
                                            ? `НОВЫЙ УРОВЕНЬ! +${res.gainedXp} XP (След. квест через 10:00)`
                                            : `Получено +${res.gainedXp} XP! Новый квест через 10:00`
                                    );
                                    this.renderPassModal(false);
                                    this.updateAllUI();
                                }
                            });
                            card.appendChild(claimBtn);
                        }
                    }

                    container.appendChild(card);
                });
            }
        });
