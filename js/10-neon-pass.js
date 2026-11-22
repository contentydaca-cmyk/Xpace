        const SPARK_REWARD_TWENTIETHS = 12;

        /**
         * Система НЕОН ПАСС (30 уровней, в конце на 30-м уровне — титул «Дитя 18 века»)
         */
        class NeonPassSystem {
            constructor(sound, onSaveRequest) {
                this.sound = sound;
                this.onSaveRequest = onSaveRequest;
                this.maxLevel = 30;
                this.postMaxBonusSparks = 25;
                this.cooldownDurationMs = 10 * 60 * 1000; // 10:00
                this.maxActiveContracts = 1;
                this.onContractCompleted = null;

                // 2 пула квестов: 3 слота для режима «ДРАЙВ» и 3 слота для режима «ЗАЧИСТКА» (всего 6 квестов!)
                this.driveQuestTemplates = [
                    { mode: 'DRIVE', type: 'drive_runs', title: 'Сыграй {target} забега в режиме Драйв', targets: [2, 3, 4], xp: 85 },
                    { mode: 'DRIVE', type: 'near_misses', title: 'Соверши {target} опасных обгонов в Драйве', targets: [5, 8, 12], xp: 105 },
                    { mode: 'DRIVE', type: 'blue_sparks', title: 'Собери {target} синих искр', targets: [20, 30, 45], xp: 90 },
                    { mode: 'DRIVE', type: 'combo', title: 'Набери комбо x{target}', targets: [5, 7, 9], xp: 95 },
                    { mode: 'DRIVE', type: 'survive', title: 'Продержись {target} сек в забеге', targets: [30, 45, 60], xp: 100 },
                    { mode: 'DRIVE', type: 'overdrives', title: 'Активируй Форсаж {target} раз', targets: [1, 2], xp: 110 }
                ];

                this.clearanceQuestTemplates = [
                    { mode: 'CLEARANCE', type: 'destroy_rocks', title: 'Разрушь {target} камней в Зачистке', targets: [15, 25, 40], xp: 115 },
                    { mode: 'CLEARANCE', type: 'clearance_runs', title: 'Сыграй {target} раза в режим Зачистка', targets: [1, 2, 3], xp: 95 },
                    { mode: 'CLEARANCE', type: 'weapon_buffs', title: 'Подбери {target} баффа оружия в Зачистке', targets: [2, 3, 4], xp: 105 },
                    { mode: 'CLEARANCE', type: 'explosive_rocks', title: 'Взорви {target} детонирующих ядра в Зачистке', targets: [2, 3, 5], xp: 120 },
                    { mode: 'CLEARANCE', type: 'total_coins', title: 'Собери {target} жёлтых монет', targets: [3, 5, 7], xp: 105 },
                    { mode: 'CLEARANCE', type: 'powerups', title: 'Подбери {target} бонуса на трассе', targets: [2, 3, 4], xp: 90 }
                ];

                this.state = {
                    nickname: '',
                    bestScore: 0,
                    bestExpeditionSectors: 0,
                    bestScoreDrive: 0,
                    bestScoreClearance: 0,
                    bestSurviveSec: 0,
                    xp: 0,
                    sparks: 0,
                    sparkRewardRemainder: INITIAL_SPARK_REWARD_REMAINDER,
                    claimedLevels: [],
                    quests: [],
                    questCounter: 1,
                    unlockedTitles: ['novice'],
                    equippedTitle: 'novice',
                    unlockedShips: ['viper'],
                    equippedShip: 'viper',
                    unlockedMasks: ['none'],
                    equippedMask: 'none',
                    unlockedTrails: ['default'],
                    equippedTrail: 'default',
                    unlockedThemes: ['default'],
                    equippedTheme: 'default',
                    bonusClaimsCount: 0,
                    claimedContracts: [],
                    activeContractId: null,
                    activeContractIds: [],
                    contractProgress: {},
                    totalRuns: 0,
                    totalCoins: 0,
                    totalNearMisses: 0,
                    totalRocksDestroyed: 0,
                    dailyStreak: 0,
                    lastDailyClaim: 0,
                    lastDailyClaimDate: '',
                    isDevTester: false,
                    dailyScoreXpEarned: 0,
                    dailyScoreXpDay: ''
                };
            }

            applyLoadedData(data) {
                if (!data) {
                    this.ensureThreeQuests();
                    this.evaluateAutoTitles();
                    return;
                }
                if (data.nickname && (!this.state.nickname || this.state.nickname === 'Пилот')) {
                    this.state.nickname = String(data.nickname).slice(0, 16);
                }
                this.state.bestScore = Math.max(this.state.bestScore, Number(data.bestScore) || 0);
                this.state.bestExpeditionSectors = Math.max(this.state.bestExpeditionSectors || 0, Number(data.bestExpeditionSectors) || 0);
                this.state.bestScoreDrive = Math.max(this.state.bestScoreDrive || 0, Number(data.bestScoreDrive) || 0);
                this.state.bestScoreClearance = Math.max(this.state.bestScoreClearance || 0, Number(data.bestScoreClearance) || 0);
                this.state.bestSurviveSec = Math.max(this.state.bestSurviveSec || 0, Number(data.bestSurviveSec) || 0);
                if (this.state.bestScore > 0 && this.state.bestScoreDrive === 0 && this.state.bestScoreClearance === 0) {
                    this.state.bestScoreDrive = this.state.bestScore;
                }
                this.state.bestScore = Math.max(this.state.bestScore, this.state.bestScoreDrive, this.state.bestScoreClearance);
                this.state.xp = Math.max(this.state.xp, Number(data.xp) || 0);
                const savedSparks = Number(data.sparks) || 0;
                if (savedSparks > this.state.sparks ||
                    (savedSparks === this.state.sparks && data.sparkRewardRemainder !== undefined)) {
                    this.state.sparks = savedSparks;
                    this.state.sparkRewardRemainder = this.normalizeSparkRewardRemainder(data.sparkRewardRemainder);
                }
                this.state.bonusClaimsCount = Math.max(this.state.bonusClaimsCount || 0, Number(data.bonusClaimsCount) || 0);
                this.state.totalRuns = Math.max(this.state.totalRuns, Number(data.totalRuns) || 0);
                this.state.totalCoins = Math.max(this.state.totalCoins, Number(data.totalCoins) || 0);
                this.state.totalNearMisses = Math.max(this.state.totalNearMisses, Number(data.totalNearMisses) || 0);
                this.state.totalRocksDestroyed = Math.max(this.state.totalRocksDestroyed || 0, Number(data.totalRocksDestroyed) || 0);
                this.state.dailyStreak = Math.max(this.state.dailyStreak || 0, Number(data.dailyStreak) || 0);
                if (data.isDevTester) this.state.isDevTester = true;
                this.state.lastDailyClaim = Math.max(this.state.lastDailyClaim, Number(data.lastDailyClaim) || 0);
                if (data.lastDailyClaimDate) {
                    this.state.lastDailyClaimDate = String(data.lastDailyClaimDate);
                } else if (this.state.lastDailyClaim > 0 && !this.state.lastDailyClaimDate) {
                    const d = new Date(this.state.lastDailyClaim);
                    this.state.lastDailyClaimDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                }
                if (Array.isArray(data.claimedContracts)) {
                    const mergedContracts = new Set([...(this.state.claimedContracts || []), ...data.claimedContracts]);
                    this.state.claimedContracts = Array.from(mergedContracts);
                }
                if (Array.isArray(data.activeContractIds)) {
                    const mergedSlots = [];
                    [...(this.state.activeContractIds || []), ...data.activeContractIds].forEach(id => {
                        if (typeof id === 'string' && !mergedSlots.includes(id)) mergedSlots.push(id);
                    });
                    this.state.activeContractIds = mergedSlots;
                }
                if (data.activeContractId && typeof data.activeContractId === 'string') {
                    if (!Array.isArray(this.state.activeContractIds)) this.state.activeContractIds = [];
                    if (!this.state.activeContractIds.includes(data.activeContractId)) {
                        this.state.activeContractIds.unshift(data.activeContractId);
                    }
                    this.state.activeContractId = data.activeContractId;
                }
                this.normalizeActiveContracts();
                if (data.contractProgress && typeof data.contractProgress === 'object') {
                    this.state.contractProgress = { ...(this.state.contractProgress || {}), ...data.contractProgress };
                }
                const todayKey = new Date().toISOString().slice(0, 10);
                if (data.dailyScoreXpDay === todayKey) {
                    this.state.dailyScoreXpDay = todayKey;
                    this.state.dailyScoreXpEarned = Math.max(0, Number(data.dailyScoreXpEarned) || 0);
                } else {
                    this.state.dailyScoreXpDay = todayKey;
                    this.state.dailyScoreXpEarned = 0;
                }

                if (Array.isArray(data.claimedLevels)) {
                    const merged = new Set([...this.state.claimedLevels, ...data.claimedLevels.map(Number)]);
                    this.state.claimedLevels = Array.from(merged);
                }

                if (Array.isArray(data.unlockedTitles)) {
                    const mergedTitles = new Set(['novice', ...this.state.unlockedTitles, ...data.unlockedTitles]);
                    this.state.unlockedTitles = Array.from(mergedTitles);
                }
                if (data.equippedTitle && this.state.unlockedTitles.includes(data.equippedTitle)) {
                    this.state.equippedTitle = data.equippedTitle;
                }

                if (Array.isArray(data.unlockedShips)) {
                    const mergedShips = new Set(['viper', ...this.state.unlockedShips, ...data.unlockedShips]);
                    this.state.unlockedShips = Array.from(mergedShips);
                }
                if (data.equippedShip && this.state.unlockedShips.includes(data.equippedShip)) {
                    this.state.equippedShip = data.equippedShip;
                }

                if (Array.isArray(data.unlockedMasks)) {
                    const mergedMasks = new Set(['none', ...this.state.unlockedMasks, ...data.unlockedMasks]);
                    this.state.unlockedMasks = Array.from(mergedMasks);
                }
                if (data.equippedMask && this.state.unlockedMasks.includes(data.equippedMask)) {
                    this.state.equippedMask = data.equippedMask;
                }

                if (Array.isArray(data.unlockedTrails)) {
                    const mergedTrails = new Set(['default', ...this.state.unlockedTrails, ...data.unlockedTrails]);
                    this.state.unlockedTrails = Array.from(mergedTrails);
                }
                // equippedTrail может быть и фирменным следом со скина — он «владеется» через покупку скина
                const loadedSkinTrailOwned = SKIN_TRAILS.some(st => st.id === data.equippedTrail && this.state.unlockedShips.includes(st.shipId));
                if (data.equippedTrail && (this.state.unlockedTrails.includes(data.equippedTrail) || loadedSkinTrailOwned)) {
                    this.state.equippedTrail = data.equippedTrail;
                }

                if (Array.isArray(data.unlockedThemes)) {
                    const mergedThemes = new Set(['default', ...this.state.unlockedThemes, ...data.unlockedThemes]);
                    this.state.unlockedThemes = Array.from(mergedThemes);
                }
                this.normalizeProfileThemes();
                if (data.equippedTheme && this.state.unlockedThemes.includes(data.equippedTheme)) {
                    this.state.equippedTheme = data.equippedTheme;
                }

                if (Array.isArray(data.quests) && data.quests.length === 6) {
                    this.state.quests = data.quests
                        .filter(q => q && typeof q.title === 'string' && Number(q.target) >= 1)
                        .map((q, i) => ({
                            id: q.id || ('q_restored_' + i),
                            mode: i < 3 ? 'DRIVE' : 'CLEARANCE',
                            type: q.type === 'runs' ? 'drive_runs' : (q.type || 'drive_runs'),
                            title: q.title,
                            target: Math.max(1, Number(q.target) || 1),
                            progress: Math.max(0, Number(q.progress) || 0),
                            xp: Math.max(10, Number(q.xp) || 85),
                            cooldownUntil: Number(q.cooldownUntil) || 0
                        }));
                } else {
                    this.state.quests = [];
                }
                this.state.questCounter = Math.max(this.state.questCounter, Number(data.questCounter) || 1);
                this.ensureThreeQuests();
                this.evaluateAutoTitles();
            }

            normalizeProfileThemes() {
                const state = this.state;
                state.unlockedThemes = state.unlockedThemes.filter(id => PROFILE_THEMES.some(theme => theme.id === id));
                if (!state.unlockedThemes.includes(state.equippedTheme)) {
                    state.equippedTheme = 'default';
                }
            }

            replaceStateFromAccount(data) {
                if (!data) return;
                this.state = {
                    nickname: data.nickname ? String(data.nickname).slice(0, 16) : '',
                    bestScore: Number(data.bestScore) || 0,
                    bestExpeditionSectors: Number(data.bestExpeditionSectors) || 0,
                    bestScoreDrive: Number(data.bestScoreDrive) || (Number(data.bestScore) || 0),
                    bestScoreClearance: Number(data.bestScoreClearance) || 0,
                    bestSurviveSec: Number(data.bestSurviveSec) || 0,
                    xp: Number(data.xp) || 0,
                    sparks: Number(data.sparks) || 0,
                    sparkRewardRemainder: this.normalizeSparkRewardRemainder(data.sparkRewardRemainder),
                    claimedLevels: Array.isArray(data.claimedLevels) ? data.claimedLevels.map(Number) : [],
                    quests: Array.isArray(data.quests) ? data.quests : [],
                    questCounter: Number(data.questCounter) || 1,
                    unlockedTitles: Array.isArray(data.unlockedTitles) ? Array.from(new Set(['novice', ...data.unlockedTitles])) : ['novice'],
                    equippedTitle: data.equippedTitle || 'novice',
                    unlockedShips: Array.isArray(data.unlockedShips) ? Array.from(new Set(['viper', ...data.unlockedShips])) : ['viper'],
                    equippedShip: data.equippedShip || 'viper',
                    unlockedMasks: Array.isArray(data.unlockedMasks) ? Array.from(new Set(['none', ...data.unlockedMasks])) : ['none'],
                    equippedMask: data.equippedMask || 'none',
                    unlockedTrails: Array.isArray(data.unlockedTrails) ? Array.from(new Set(['default', ...data.unlockedTrails])) : ['default'],
                    equippedTrail: data.equippedTrail || 'default',
                    unlockedThemes: Array.isArray(data.unlockedThemes) ? Array.from(new Set(['default', ...data.unlockedThemes])) : ['default'],
                    equippedTheme: data.equippedTheme || 'default',
                    bonusClaimsCount: Number(data.bonusClaimsCount) || 0,
                    claimedContracts: Array.isArray(data.claimedContracts) ? data.claimedContracts : [],
                    activeContractId: data.activeContractId || null,
                    activeContractIds: Array.isArray(data.activeContractIds)
                        ? data.activeContractIds.filter(id => typeof id === 'string')
                        : (data.activeContractId ? [data.activeContractId] : []),
                    contractProgress: (data.contractProgress && typeof data.contractProgress === 'object') ? { ...data.contractProgress } : {},
                    totalRuns: Number(data.totalRuns) || 0,
                    totalCoins: Number(data.totalCoins) || 0,
                    totalNearMisses: Number(data.totalNearMisses) || 0,
                    totalRocksDestroyed: Number(data.totalRocksDestroyed) || 0,
                    isDevTester: Boolean(data.isDevTester),
                    dailyStreak: Number(data.dailyStreak) || 0,
                    lastDailyClaim: Number(data.lastDailyClaim) || 0,
                    lastDailyClaimDate: data.lastDailyClaimDate ? String(data.lastDailyClaimDate) : '',
                    dailyScoreXpEarned: Number(data.dailyScoreXpEarned) || 0,
                    dailyScoreXpDay: data.dailyScoreXpDay || ''
                };
                this.normalizeProfileThemes();
                this.normalizeActiveContracts();
                this.ensureThreeQuests();
                this.evaluateAutoTitles();
            }

            evaluateAutoTitles() {
                let unlockedNew = false;
                const unlock = (id) => {
                    if (!this.state.unlockedTitles.includes(id)) {
                        this.state.unlockedTitles.push(id);
                        unlockedNew = true;
                    }
                };
                if (this.state.sparks >= 250) unlock('spark_hunter');
                if (this.state.totalNearMisses >= 25) unlock('phantom_grazer');
                if (this.state.bestScore >= 2500) unlock('drift_master');
                if (this.state.claimedLevels.includes(this.maxLevel)) unlock('century_18');
                return unlockedNew;
            }

            triggerSave(immediate = false) {
                this.evaluateAutoTitles();
                if (this.onSaveRequest) {
                    this.onSaveRequest(this.state, this.getLevelInfo().level, immediate);
                }
            }

            getXpRequiredForLevel(lvl) {
                return 100 + (lvl - 1) * 25;
            }

            getLevelInfo() {
                let lvl = 1;
                let remainingXp = this.state.xp;
                let required = this.getXpRequiredForLevel(lvl);

                while (lvl < this.maxLevel && remainingXp >= required) {
                    remainingXp -= required;
                    lvl++;
                    required = this.getXpRequiredForLevel(lvl);
                }

                const isMaxed = lvl >= this.maxLevel;
                const bonusStepXp = 500;
                const bonusTotalEarned = isMaxed ? Math.floor(remainingXp / bonusStepXp) : 0;
                const bonusClaimed = Number(this.state.bonusClaimsCount) || 0;
                const bonusAvailable = Math.max(0, bonusTotalEarned - bonusClaimed);
                const bonusCurrentXp = isMaxed ? (remainingXp % bonusStepXp) : 0;

                return {
                    level: lvl,
                    currentXp: isMaxed ? bonusCurrentXp : remainingXp,
                    requiredXp: isMaxed ? bonusStepXp : required,
                    isMaxed,
                    overflowXp: isMaxed ? remainingXp : 0,
                    bonusAvailable,
                    bonusClaimed
                };
            }

            normalizeSparkRewardRemainder(remainder) {
                return Number.isInteger(remainder) && remainder >= 0 && remainder < 20
                    ? remainder
                    : INITIAL_SPARK_REWARD_REMAINDER;
            }

            previewSparkReward(baseSparks) {
                return Math.floor((baseSparks * SPARK_REWARD_TWENTIETHS + this.state.sparkRewardRemainder) / 20);
            }

            awardSparks(baseSparks, bonusSparks = 0) {
                // Keep fractions in twentieths for small rewards and existing saves.
                const granted = this.previewSparkReward(baseSparks);
                this.state.sparkRewardRemainder += baseSparks * SPARK_REWARD_TWENTIETHS - granted * 20;
                this.state.sparks += granted + bonusSparks;
                return granted + bonusSparks;
            }

            claimPostMaxBonus() {
                const info = this.getLevelInfo();
                if (!info.isMaxed || info.bonusAvailable <= 0) return null;
                this.state.bonusClaimsCount = (Number(this.state.bonusClaimsCount) || 0) + 1;
                this.state.sparks += this.postMaxBonusSparks;
                this.sound.playQuestComplete();
                this.triggerSave();
                return {
                    sparks: this.postMaxBonusSparks,
                    remainingAvailable: info.bonusAvailable - 1,
                    totalClaimed: this.state.bonusClaimsCount
                };
            }

            /* ===== XPACE v26: до 3 контрактов одновременно ===== */

            getActiveContractIds() {
                const claimed = this.state.claimedContracts || [];
                let ids = Array.isArray(this.state.activeContractIds) ? this.state.activeContractIds.slice() : [];
                if (!ids.length && this.state.activeContractId) {
                    ids = [this.state.activeContractId];
                }
                const clean = [];
                ids.forEach(id => {
                    if (typeof id !== 'string') return;
                    if (clean.includes(id)) return;
                    if (claimed.includes(id)) return;
                    if (!SPARK_CONTRACTS.some(c => c.id === id)) return;
                    clean.push(id);
                });
                const limited = clean.slice(0, this.maxActiveContracts);
                this.state.activeContractIds = limited;
                this.state.activeContractId = limited[0] || null;
                return limited;
            }

            normalizeActiveContracts() {
                return this.getActiveContractIds();
            }

            isContractActive(contractId) {
                return this.getActiveContractIds().includes(contractId);
            }

            getFreeContractSlots() {
                return Math.max(0, this.maxActiveContracts - this.getActiveContractIds().length);
            }

            selectActiveContract(contractId) {
                const contract = SPARK_CONTRACTS.find(c => c.id === contractId);
                if (!contract) return 'missing';
                if ((this.state.claimedContracts || []).includes(contractId)) return 'claimed';
                const ids = this.getActiveContractIds();
                if (ids.includes(contractId)) return 'already';
                if (ids.length >= this.maxActiveContracts) return 'full';
                if (ids.length) return 'full';

                ids.push(contractId);
                this.state.activeContractIds = ids;
                this.state.activeContractId = ids[0] || null;

                if (!this.state.contractProgress || typeof this.state.contractProgress !== 'object') {
                    this.state.contractProgress = {};
                }
                if (this.state.contractProgress[contractId] === undefined) {
                    this.state.contractProgress[contractId] = 0;
                }
                this.triggerSave();
                return 'ok';
            }

            unselectContract(contractId) {
                const ids = this.getActiveContractIds().filter(id => id !== contractId);
                this.state.activeContractIds = ids;
                this.state.activeContractId = ids[0] || null;
                this.triggerSave();
                return true;
            }

            recordActiveContractProgress(statType, amount = 1, isSingleRunMax = false) {
                const ids = this.getActiveContractIds();
                if (!ids.length) return false;
                if (!this.state.contractProgress || typeof this.state.contractProgress !== 'object') {
                    this.state.contractProgress = {};
                }

                let anyCompleted = false;
                ids.forEach(activeId => {
                    const contract = SPARK_CONTRACTS.find(c => c.id === activeId);
                    if (!contract || contract.stat !== statType) return;
                    const prev = Number(this.state.contractProgress[activeId]) || 0;
                    if (prev >= contract.target) return;

                    const next = isSingleRunMax
                        ? Math.min(contract.target, Math.max(prev, amount))
                        : Math.min(contract.target, prev + amount);

                    this.state.contractProgress[activeId] = next;
                    if (prev < contract.target && next >= contract.target) {
                        anyCompleted = true;
                        if (typeof this.onContractCompleted === 'function') {
                            try {
                                this.onContractCompleted(contract);
                            } catch (e) {}
                        }
                    }
                });

                if (anyCompleted) {
                    this.sound.playQuestComplete();
                }
                return anyCompleted;
            }

            getContractCurrentValue(contract) {
                if (!contract) return 0;
                if ((this.state.claimedContracts || []).includes(contract.id)) return contract.target;
                const progMap = this.state.contractProgress || {};
                return Math.min(contract.target, Number(progMap[contract.id]) || 0);
            }

            claimSparkContract(contractId) {
                const contract = SPARK_CONTRACTS.find(c => c.id === contractId);
                if (!contract) return null;
                if ((this.state.claimedContracts || []).includes(contractId)) return null;
                const currentVal = this.getContractCurrentValue(contract);
                if (currentVal < contract.target) return null;

                if (!Array.isArray(this.state.claimedContracts)) this.state.claimedContracts = [];
                this.state.claimedContracts.push(contractId);
                const remainingSlots = this.getActiveContractIds().filter(id => id !== contractId);
                this.state.activeContractIds = remainingSlots;
                this.state.activeContractId = remainingSlots[0] || null;
                const sparks = this.awardSparks(contract.sparks);

                if (contract.rewardType === 'mask' && contract.rewardId && !this.state.unlockedMasks.includes(contract.rewardId)) {
                    this.state.unlockedMasks.push(contract.rewardId);
                } else if (contract.rewardType === 'ship' && contract.rewardId && !this.state.unlockedShips.includes(contract.rewardId)) {
                    this.state.unlockedShips.push(contract.rewardId);
                } else if (contract.rewardType === 'theme' && contract.rewardId && !this.state.unlockedThemes.includes(contract.rewardId)) {
                    this.state.unlockedThemes.push(contract.rewardId);
                } else if (contract.rewardType === 'trail' && contract.rewardId && !this.state.unlockedTrails.includes(contract.rewardId)) {
                    this.state.unlockedTrails.push(contract.rewardId);
                }

                if (contract.rewardId) this.sound.playLevelUp();
                else this.sound.playQuestComplete();
                this.triggerSave();
                return { ...contract, sparks };
            }

            claimAllReadyContracts() {
                const claimed = this.state.claimedContracts || [];
                const ready = SPARK_CONTRACTS.filter(c => !claimed.includes(c.id) && this.getContractCurrentValue(c) >= c.target);
                const results = [];
                ready.forEach(ct => {
                    const res = this.claimSparkContract(ct.id);
                    if (res) results.push(res);
                });
                return results;
            }

            getAvailableContractsCount() {
                const claimed = this.state.claimedContracts || [];
                return SPARK_CONTRACTS.filter(c => !claimed.includes(c.id) && this.getContractCurrentValue(c) >= c.target).length;
            }

            getRewardForLevel(lvl) {
                const isFinale = lvl === this.maxLevel;
                const baseSparks = isFinale ? 500 : 50 + Math.floor((lvl - 1) / 3) * 25;
                return {
                    baseSparks,
                    sparks: this.previewSparkReward(baseSparks),
                    titleId: isFinale ? 'century_18' : null,
                    titleName: isFinale ? 'Дитя 18 века' : null
                };
            }

            createQuestForMode(mode = 'DRIVE', excludeTypes = []) {
                const sourceList = mode === 'CLEARANCE' ? this.clearanceQuestTemplates : this.driveQuestTemplates;
                const available = sourceList.filter(t => !excludeTypes.includes(t.type));
                const pool = available.length > 0 ? available : sourceList;
                const tpl = pool[Math.floor(Math.random() * pool.length)];
                const target = tpl.targets[Math.floor(Math.random() * tpl.targets.length)];

                return {
                    id: 'q_' + (this.state.questCounter++),
                    mode: mode,
                    type: tpl.type,
                    title: tpl.title.replace('{target}', target),
                    target: target,
                    progress: 0,
                    xp: tpl.xp,
                    cooldownUntil: 0
                };
            }

            ensureThreeQuests() {
                let changed = false;
                if (!Array.isArray(this.state.quests) || this.state.quests.length !== 6) {
                    const newQuests = [];
                    for (let i = 0; i < 3; i++) {
                        const used = newQuests.map(q => q.type);
                        newQuests.push(this.createQuestForMode('DRIVE', used));
                    }
                    for (let i = 0; i < 3; i++) {
                        const used = newQuests.map(q => q.type);
                        newQuests.push(this.createQuestForMode('CLEARANCE', used));
                    }
                    this.state.quests = newQuests;
                    changed = true;
                }
                if (this.checkCooldowns()) {
                    changed = true;
                }
                if (changed) this.triggerSave();
            }

            checkCooldowns() {
                const now = Date.now();
                let refreshedAny = false;

                for (let i = 0; i < this.state.quests.length; i++) {
                    const q = this.state.quests[i];
                    if (q && q.cooldownUntil && now >= q.cooldownUntil) {
                        const mode = i < 3 ? 'DRIVE' : 'CLEARANCE';
                        const usedTypes = this.state.quests
                            .filter((other, idx) => idx !== i && other && !other.cooldownUntil)
                            .map(other => other.type);
                        this.state.quests[i] = this.createQuestForMode(mode, usedTypes);
                        refreshedAny = true;
                    }
                }

                if (refreshedAny) {
                    this.triggerSave();
                }
                return refreshedAny;
            }

            // Начисление опыта за очки в конце забега (макс. 1000 XP на 1 000 000 очков, дневной лимит 5000 XP)
            awardScoreXp(finalScore) {
                const todayKey = new Date().toISOString().slice(0, 10);
                if (this.state.dailyScoreXpDay !== todayKey) {
                    this.state.dailyScoreXpDay = todayKey;
                    this.state.dailyScoreXpEarned = 0;
                }

                const dailyCap = 5000;
                const remainingCap = Math.max(0, dailyCap - this.state.dailyScoreXpEarned);
                if (remainingCap <= 0) {
                    return { granted: 0, capReached: true, dailyTotal: this.state.dailyScoreXpEarned };
                }

                // 1000 очков = 1 XP, максимум 1000 XP за один забег (при 1 000 000+ очков)
                const rawScoreXp = Math.min(1000, Math.floor(Math.max(0, finalScore) / 1000));
                const granted = Math.min(rawScoreXp, remainingCap);

                if (granted > 0) {
                    this.state.dailyScoreXpEarned += granted;
                    this.addXp(granted);
                }

                return {
                    granted,
                    capReached: this.state.dailyScoreXpEarned >= dailyCap,
                    dailyTotal: this.state.dailyScoreXpEarned
                };
            }

            addXp(amount) {
                if (amount <= 0) return false;
                const prevLvl = this.getLevelInfo().level;
                this.state.xp += amount;
                const newLvl = this.getLevelInfo().level;
                this.triggerSave();

                if (newLvl > prevLvl) {
                    this.sound.playLevelUp();
                    return true;
                }
                return false;
            }

            recordProgress(eventType, value = 1, isSingleRunRecord = false) {
                this.checkCooldowns();
                let anyNewlyCompleted = false;

                this.state.quests.forEach(q => {
                    if (q.cooldownUntil && q.cooldownUntil > Date.now()) return;
                    if (q.progress >= q.target) return;

                    if (q.type === eventType) {
                        const prev = q.progress;
                        if (isSingleRunRecord) {
                            q.progress = Math.min(q.target, Math.max(q.progress, value));
                        } else {
                            q.progress = Math.min(q.target, q.progress + value);
                        }

                        if (prev < q.target && q.progress >= q.target) {
                            anyNewlyCompleted = true;
                        }
                    }
                });

                if (anyNewlyCompleted) {
                    this.sound.playQuestComplete();
                }
                this.triggerSave();
                return anyNewlyCompleted;
            }

            claimQuest(questId) {
                const idx = this.state.quests.findIndex(q => q.id === questId);
                if (idx === -1) return null;
                const quest = this.state.quests[idx];
                if (quest.cooldownUntil && quest.cooldownUntil > Date.now()) return null;
                if (quest.progress < quest.target) return null;

                const gainedXp = quest.xp;
                const leveledUp = this.addXp(gainedXp);

                this.state.quests[idx] = {
                    ...quest,
                    cooldownUntil: Date.now() + this.cooldownDurationMs
                };
                this.triggerSave();

                return { gainedXp, leveledUp };
            }

            claimLevelReward(lvl) {
                const currentLvl = this.getLevelInfo().level;
                if (lvl > currentLvl || lvl > this.maxLevel) return null;
                if (this.state.claimedLevels.includes(lvl)) return null;

                const reward = this.getRewardForLevel(lvl);
                this.state.claimedLevels.push(lvl);
                this.awardSparks(reward.baseSparks);

                if (reward.titleId && !this.state.unlockedTitles.includes(reward.titleId)) {
                    this.state.unlockedTitles.push(reward.titleId);
                }

                this.sound.playQuestComplete();
                this.triggerSave();
                return reward;
            }

            getNotifications() {
                this.checkCooldowns();
                const hasQuestReady = this.state.quests.some(
                    q => (!q.cooldownUntil || q.cooldownUntil <= Date.now()) && q.progress >= q.target
                );

                const lvlInfo = this.getLevelInfo();
                let hasRewardReady = lvlInfo.bonusAvailable > 0;
                const currentLvl = Math.min(this.maxLevel, lvlInfo.level);
                if (!hasRewardReady) {
                    for (let l = 1; l <= currentLvl; l++) {
                        if (!this.state.claimedLevels.includes(l)) {
                            hasRewardReady = true;
                            break;
                        }
                    }
                }

                return {
                    hasQuestReady,
                    hasRewardReady,
                    any: hasQuestReady || hasRewardReady
                };
            }
        }

