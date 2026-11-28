// Equipment data shared by the garage, flight simulation and profile migrations.
const SUPER_CATALOG = [
    { id: 'drive', name: 'Драйв', icon: 'bolt', power: 34, cost: 4500,
        desc: '6 секунд форсажа. Удваивает очки и урон, притягивает искры и защищает корабль.' },
    { id: 'emp', name: 'ЭМИ-импульс', icon: 'target', power: 28, cost: 3200,
        desc: 'Ударная волна расчищает трассу, сбивает снаряды и поражает НЛО.' },
    { id: 'chrono', name: 'Хроно-щит', icon: 'hourglass', power: 22, cost: 2400, duration: 5,
        desc: 'Щит поглощает одно попадание. Угрозы замедляются на 5 секунд.' },
    { id: 'score_rush', name: 'Сверхсчёт ×5', power: 40, cost: 6200, duration: 5, color: '#ffda75',
        desc: 'На 5 секунд умножает все получаемые очки на 5. Бонус ×2 в это время уступает место ×5.' },
    { id: 'drift_resonance', name: 'Резонанс', power: 27, cost: 3700, duration: 7, color: '#ff85cf', mode: 'DRIVE',
        desc: 'На 7 секунд расширяет зону опасного обгона. Каждый обгон дополнительно даёт 2 уровня комбо.' },
    { id: 'ion_fan', name: 'Ионный веер', power: 36, cost: 4800, duration: 6, color: '#77f8ff', mode: 'CLEARANCE',
        desc: 'На 6 секунд каждый залп выпускает веер из пяти лазеров. Плазма и скорострел продолжают действовать.' }
];
const LOADOUT_SLOTS = [
    { name: 'Модуль 1', cost: 5000 },
    { name: 'Модуль 2', cost: 10000 },
    { name: 'Супер', cost: 15000 }
];
const POWER_PRICES = [1500, 3000, 5000, 7500, 10000];
const MODULE_BY_ID = new Map(MASK_CATALOG.map(item => [item.id, item]));
const SUPER_BY_ID = new Map(SUPER_CATALOG.map(item => [item.id, item]));
const powerCapacity = level => 60 + level * 10;
const slotOpen = (state, slot) => slot === 2 ? state.module1Paid && state.superSlotUnlocked : slot < state.moduleSlots;
const installedPower = state => state.equippedModules.reduce((sum, id) => sum + (MODULE_BY_ID.get(id)?.power || 0),
    slotOpen(state, 2) ? SUPER_BY_ID.get(state.equippedSuper)?.power || 0 : 0);
const paidModuleCount = state => state.unlockedMasks.filter(id => MODULE_BY_ID.get(id)?.cost > 0).length;
const collectionCount = state => paidModuleCount(state) + state.unlockedSupers.length;

function sparksWithModuleRefunds(snapshot, refundedModules) {
    const alreadyIncluded = new Set(Array.isArray(snapshot.retiredModuleRefunds) ? snapshot.retiredModuleRefunds : []);
    return refundedModules.reduce((balance, id) => balance + (alreadyIncluded.has(id) ? 0 : RETIRED_MODULE_PRICES.get(id) || 0),
        Number(snapshot.sparks) || 0);
}

function migrateModuleProfile(data) {
    if (!data) return null;
    const owned = new Set(Array.isArray(data.unlockedMasks) ? data.unlockedMasks : []);
    const retired = [...owned].filter(id => RETIRED_MODULE_PRICES.has(id));
    // The previous version also granted slot 1 to legacy module owners. Only a paid marker
    // or a pre-replacement snapshot with an open slot and no retired items proves purchase.
    const module1Paid = data.module1Paid ?? (Number(data.moduleSlots) > 0 && Array.isArray(data.unlockedMasks) && retired.length === 0);
    const module2Paid = data.module2Paid ?? (Number(data.moduleSlots) >= 2);
    const claimedContracts = new Set(Array.isArray(data.claimedContracts) ? data.claimedContracts : []);
    const claimedModuleRewards = new Set(SPARK_CONTRACTS
        .filter(contract => contract.rewardType === 'mask' && claimedContracts.has(contract.id)).map(contract => contract.rewardId));
    const unlockedMasks = MASK_CATALOG.filter(item => owned.has(item.id)
        || (item.contractOnly && (owned.has(item.retiredId) || claimedContracts.has(item.legacyContractId) || claimedModuleRewards.has(item.id))))
        .map(item => item.id);
    const priorRefunds = Array.isArray(data.retiredModuleRefunds) ? data.retiredModuleRefunds : [];
    const retiredModuleRefunds = [...new Set([...priorRefunds, ...retired])].filter(id => RETIRED_MODULE_PRICES.get(id) > 0);
    const loadout = normalizedLoadout({ ...data, unlockedMasks, module1Paid, module2Paid });
    return { ...data, ...loadout, unlockedMasks, retiredModuleRefunds,
        ...(data.sparks !== undefined || retiredModuleRefunds.length ? { sparks: sparksWithModuleRefunds(data, retiredModuleRefunds) } : {}) };
}

function slotRequirement(state, slot) {
    if (slot === 1 && !state.moduleSlots) return 'Откройте первый слот и купите модуль';
    if (slot === 1 && !paidModuleCount(state)) return 'Купите хотя бы один модуль';
    if (slot === 2 && !state.moduleSlots) return 'Сначала откройте первый слот';
    return '';
}

function normalizedLoadout(data = {}) {
    const owned = new Set(Array.isArray(data.unlockedMasks) ? data.unlockedMasks : []);
    const module1Paid = data.module1Paid === true;
    const module2Paid = data.module2Paid === true;
    const moduleSlots = module1Paid ? (module2Paid ? 2 : 1) : 0;
    const powerLimitLevel = Math.min(POWER_PRICES.length, Math.max(0, Math.trunc(Number(data.powerLimitLevel)) || 0));
    const unlockedSupers = [...new Set(Array.isArray(data.unlockedSupers) ? data.unlockedSupers : [])].filter(id => SUPER_BY_ID.has(id));
    const superSlotUnlocked = data.superSlotUnlocked === true;
    const equippedModules = [null, null];
    const saved = Array.isArray(data.equippedModules) ? data.equippedModules : [];
    let free = powerCapacity(powerLimitLevel);
    for (let i = 0; i < moduleSlots; i++) {
        const item = MODULE_BY_ID.get(saved[i]);
        if (!item || !owned.has(item.id) || equippedModules.includes(item.id) || item.power > free) continue;
        equippedModules[i] = item.id;
        free -= item.power;
    }
    const chosen = SUPER_BY_ID.get(data.equippedSuper);
    const equippedSuper = superSlotUnlocked && chosen && unlockedSupers.includes(chosen.id) && chosen.power <= free ? chosen.id : null;
    return { module1Paid, module2Paid, moduleSlots, equippedModules, equippedMask: equippedModules[0] || 'none',
        unlockedSupers, superSlotUnlocked, equippedSuper, powerLimitLevel };
}

function mergeLoadouts(older, newer, unlockedMasks) {
    return normalizedLoadout({ ...newer, unlockedMasks,
        module1Paid: older.module1Paid || newer.module1Paid,
        module2Paid: older.module2Paid || newer.module2Paid,
        superSlotUnlocked: older.superSlotUnlocked || newer.superSlotUnlocked,
        unlockedSupers: [...older.unlockedSupers, ...newer.unlockedSupers],
        powerLimitLevel: Math.max(older.powerLimitLevel, newer.powerLimitLevel) });
}

function spendGarageSparks(state, price) {
    if (state.sparks < price) return `Не хватает искр: ${price - state.sparks}`;
    state.sparks -= price;
    return '';
}

// Validate against the current profile on each click, then commit the change before saving.
function changeLoadout(state, action, slot, id) {
    if (action === 'power') {
        const level = state.powerLimitLevel;
        if (level >= POWER_PRICES.length) return 'Достигнут максимальный уровень';
        if (collectionCount(state) < level + 2) return 'Пополните коллекцию модулей и суперов';
        const error = spendGarageSparks(state, POWER_PRICES[level]);
        if (!error) state.powerLimitLevel++;
        return error;
    }

    if (!Number.isInteger(slot) || !LOADOUT_SLOTS[slot]) return 'Выберите слот';
    const isSuper = slot === 2;
    if (action === 'unlock') {
        if (slotOpen(state, slot)) return 'Слот уже открыт';
        const error = slotRequirement(state, slot) || spendGarageSparks(state, LOADOUT_SLOTS[slot].cost);
        if (error) return error;
        if (isSuper) state.superSlotUnlocked = true;
        else {
            if (slot === 0) state.module1Paid = true;
            else state.module2Paid = true;
            state.moduleSlots = state.module2Paid ? 2 : 1;
        }
        return '';
    }

    if (!slotOpen(state, slot)) return 'Сначала откройте слот';
    const item = (isSuper ? SUPER_BY_ID : MODULE_BY_ID).get(id);
    if (!item) return 'Выберите оборудование';
    const owned = isSuper ? state.unlockedSupers : state.unlockedMasks;
    if (action === 'buy') {
        if (owned.includes(id) || item.contractOnly) return 'Покупка недоступна';
        const error = spendGarageSparks(state, item.cost);
        if (!error) owned.push(id);
        return error;
    }

    if (action !== 'equip' && action !== 'remove') return 'Выберите действие';
    const current = isSuper ? state.equippedSuper : state.equippedModules[slot];
    if (!owned.includes(id) || (action === 'remove' && current !== id)) return 'Выберите оборудование';
    if (action === 'equip' && !isSuper && state.equippedModules[1 - slot] === id) return 'Уже установлен в другом слоте';
    const next = action === 'remove' ? null : id;
    const proposal = { equippedModules: [...state.equippedModules], equippedSuper: state.equippedSuper };
    if (isSuper) proposal.equippedSuper = next;
    else proposal.equippedModules[slot] = next;
    if (installedPower(proposal) > powerCapacity(state.powerLimitLevel)) return 'Перегрузка! Улучшите лимит мощности или снимите оборудование.';
    Object.assign(state, proposal, { equippedMask: proposal.equippedModules[0] || 'none' });
    return '';
}
