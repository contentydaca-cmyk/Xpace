        const RETIRED_MODULE_PRICES = new Map(Object.entries({
            richard: 260, tony: 455, brandon: 585, rasmus: 715, chrono_core: 0, void_prism: 0,
            annihilator: 0, sovereign_42: 0, gravi_pulsar: 845, aegis_matrix: 1040, photon_splitter: 1235,
            midas_protocol: 1560, synth_overclock: 1885, omega_singularity: 2860, neuro_lens: 2340,
            cryo_gen: 2080, shadow_mod: 2600
        }));

        const MASK_CATALOG = [
            { id: 'flux_collector', name: 'ФЛЮКС-КОЛЛЕКТОР', power: 17, cost: 1100, perks: { blueMagnet: 96 },
                desc: 'Постоянно притягивает синие искры вблизи корабля.' },
            { id: 'capacitor_bank', name: 'ИМПУЛЬСНЫЙ НАКОПИТЕЛЬ', power: 22, cost: 2100, perks: { overdrive: 0.35 },
                desc: 'Синие искры дают на 35% больше заряда установленному суперу.' },
            { id: 'salvage_refiner', name: 'ИСКРОПЛАВ', power: 24, cost: 2650, perks: { coinSparks: 1 },
                desc: 'За каждую жёлтую монету начисляет 1 дополнительную искру.' },
            { id: 'edge_thrusters', name: 'КРОМОЧНЫЕ СОПЛА', power: 18, cost: 1450, perks: { grazeCombo: true },
                desc: 'Опасный обгон добавляет уровень комбо и обновляет его таймер.' },
            { id: 'thermal_sink', name: 'ПЯТЫЙ ИМПУЛЬС', power: 25, cost: 2850, mode: 'CLEARANCE', perks: { pulseVolley: true },
                desc: 'Каждый пятый залп наносит на 2 ед. больше базового урона за попадание.' },
            { id: 'auxiliary_bus', name: 'РЕЗЕРВНАЯ ШИНА', power: 20, cost: 1900, mode: 'EXPEDITION', perks: { extraRefit: true },
                desc: 'При выборе улучшения между секторами предлагает третий вариант.' },
            { id: 'rescue_beacon', name: 'СПАСАТЕЛЬНЫЙ МАЯК', power: 24, cost: 2600, perks: { rescueBeacon: true },
                desc: 'После 25 секунд полёта вызывает щит вместо следующего появившегося бонуса, если у корабля нет защиты. Один раз за вылет.' },
            { id: 'debuff_filter', name: 'ФИЛЬТР СБОЕВ', power: 19, cost: 2200, mode: 'CLEARANCE', perks: { debuffFilter: true },
                desc: 'Нейтрализует вредную капсулу при подборе и перезаряжается 22 секунды. Первый перехват готов на старте.' },
            { id: 'ablative_shell', name: 'АБЛЯЦИОННЫЙ ПАНЦИРЬ', power: 27, cost: 0, perks: { shield: true },
                contractOnly: true, legacyContractId: 'hc_survivor_90', retiredId: 'chrono_core',
                desc: 'Даёт щит на старте каждого вылета. Щит держит одно попадание.' },
            { id: 'phase_damper', name: 'ФАЗОВЫЙ ГАСИТЕЛЬ', power: 31, cost: 0, perks: { grazeSlowmo: true },
                contractOnly: true, legacyContractId: 'hc_grazer_100', retiredId: 'void_prism',
                desc: 'Каждый третий опасный обгон замедляет угрозы на 1,2 секунды.' },
            { id: 'shrapnel_forge', name: 'ОСКОЛОЧНАЯ КУЗНЯ', power: 34, cost: 0, mode: 'CLEARANCE', perks: { blastRadius: 60 },
                contractOnly: true, legacyContractId: 'hc_rocks_250', retiredId: 'annihilator',
                desc: 'Радиус взрыва детонирующих ядер увеличен со 135 до 195.' },
            { id: 'stasis_core', name: 'ЯДРО СТАЗИСА', power: 36, cost: 0, perks: { buffDuration: 0.35 },
                contractOnly: true, legacyContractId: 'hc_legend_15000', retiredId: 'sovereign_42',
                desc: 'Подобранные магниты, замедление, множители очков и усиления оружия действуют на 35% дольше.' }
        ];

        // Каталог Неоновых Следов (Trails) в магазине Xpace
        const TRAIL_CATALOG = [
            {
                id: 'default',
                name: 'СТАНДАРТНЫЙ СЛЕД',
                cost: 0,
                desc: 'Фирменный след выбранного корабля.'
            },
            {
                id: 'vhs_sunset',
                name: 'СИНТВЕЙВ ДУО',
                cost: 225,
                desc: 'Бирюзовая и розовая ленты переплетаются вокруг полосатого солнца.'
            },
            {
                id: 'acid_lime',
                name: 'КИСЛОТНЫЙ НЕОН',
                cost: 350,
                desc: 'Лаймовые разряды рассыпаются на искры и пузырьки.'
            },
            {
                id: 'blood_dragon',
                name: 'БАГРОВЫЙ ИМПУЛЬС',
                cost: 500,
                desc: 'Малиновый шлейф расходится резкими волнами, как на кардиограмме.'
            },
            {
                id: 'rainbow',
                name: 'РАДУЖНЫЙ РАЗЛОМ',
                cost: 575,
                desc: 'Белые вспышки прорезают шлейф, а края разлома переливаются всеми цветами.'
            },
            {
                id: 'glitch',
                name: 'ГЛИТЧ VHS',
                cost: 650,
                desc: 'Ломаный цифровой след с артефактами и сдвигами строк.'
            },
            {
                id: 'pixel_tail',
                name: 'ПИКСЕЛЬНЫЙ ХВОСТ',
                cost: 475,
                desc: 'Фигуры из аркадных пикселей рассыпаются на мелкие блоки.'
            },
            {
                id: 'neon_heart',
                name: 'НЕО-СЕРДЦЕ',
                cost: 625,
                desc: 'Светящиеся неоновые сердечки, плавно тающие в кильватере.'
            },
            {
                id: 'void',
                name: 'ЧЁРНАЯ ДЫРА',
                cost: 900,
                desc: 'Тёмные ядра расширяются, пока вокруг них расходятся фиолетовые орбиты.'
            },
            {
                id: 'cleopatra_42',
                name: 'ЛЕОПАРД «42»',
                cost: 525,
                shopEndsAt: SHOP_NOVEMBER_42_END,
                desc: 'Плавный сияющий золотисто-леопардовый шлейф с мягким неоновым свечением и числами «42».'
            },
            {
                id: 'neon_binary',
                name: 'НЕОН-БИНАРЬ',
                cost: 725,
                desc: 'Падающие символы 0 и 1: след в духе кибер-кода, мигающий изумрудно-бирюзовыми цифрами.'
            },
            {
                id: 'cryo_frost',
                name: 'КРИО-ИНЕЙ',
                cost: 800,
                eventOnly: true,
                desc: 'Ледяные снежинки-кристаллы, оседающие за кораблём с лёгкой бирюзовой метелью.'
            }
        ];

        // Фирменные следы со скинов: покупаешь скин — след открывается НАВСЕГДА
        // и его можно поставить на любой корабль (владельцем считается покупка скина).
        const SKIN_TRAILS = SHIP_CATALOG
            .filter(s => s.builtinTrail && s.builtinTrail !== 'cyan_plasma')
            .map(s => ({
                id: s.builtinTrail,
                name: `СЛЕД «${s.trailLabel}»`,
                shipId: s.id,
                shipName: s.name,
                accent: s.primary,
                desc: s.adminOnly ? 'Эксклюзивный след награды за миллион. Выдача закрыта — след остался только у прежних владельцев скина.' : (s.bundleOnly ? `Эксклюзивный след бандла «${s.bundleName}». Открывается только при покупке бандла в разделе АКЦИИ.` : s.contractOnly ? `Фирменный след скина ${s.name}. Выполни контракт «${s.contractName}», чтобы поставить этот след на любой корабль.` : `Фирменный след скина ${s.name}. Открывается навсегда при покупке скина и ставится на любой корабль.`)
            }));

        const collectionIds = items => new Set(items.map(item => item.id));
        const COLLECTION_CATALOG = {
            Ships: collectionIds(SHIP_CATALOG),
            Masks: collectionIds(MASK_CATALOG),
            Trails: collectionIds([...TRAIL_CATALOG.filter(trail => trail.id !== 'default'), ...SKIN_TRAILS]),
            Titles: collectionIds(PLAYER_TITLES),
            Themes: collectionIds(PROFILE_THEMES.filter(theme => theme.id !== 'default'))
        };

        // Public records carry counts only. Older saves can contain repeated or retired IDs.
        function collectionCounts(profile) {
            const counts = {};
            for (const [category, catalog] of Object.entries(COLLECTION_CATALOG)) {
                const key = 'owned' + category;
                const unlocked = profile['unlocked' + category];
                if (Array.isArray(unlocked)) {
                    const owned = new Set(unlocked);
                    if (category === 'Trails') {
                        for (const trail of SKIN_TRAILS) {
                            if (profile.unlockedShips?.includes(trail.shipId)) owned.add(trail.id);
                        }
                    }
                    counts[key] = [...owned].filter(id => catalog.has(id)).length;
                } else if (Number.isInteger(profile[key]) && profile[key] >= 0) {
                    counts[key] = Math.min(profile[key], catalog.size);
                }
            }
            return counts;
        }
