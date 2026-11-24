        const SHOP_NOVEMBER_42_END = Date.parse('2026-12-01T00:00:00+03:00');
        const SHOP_NOVEMBER_BUNDLE_ROTATION = Date.parse('2026-11-27T00:00:00+03:00');

        const ETERNAL_PILOT_STREAK = 100;

        // Каталог титулов профиля
        const PLAYER_TITLES = [
            {
                id: 'novice',
                name: 'Новичок Неона',
                cssClass: '',
                desc: 'Базовый титул пилота неоновой трассы.'
            },
            {
                id: 'spark_hunter',
                name: 'Ловец Искр',
                cssClass: 'title-rare',
                desc: 'Накопить 250 Жёлтых Искр на балансе.'
            },
            {
                id: 'phantom_grazer',
                name: 'Призрак Трассы',
                cssClass: 'title-rare',
                desc: 'Совершить 25 опасных обгонов (впритирку к лазерам).'
            },
            {
                id: 'drift_master',
                name: 'Повелитель Дрифта',
                cssClass: 'title-epic',
                desc: 'Установить рекорд 2 500 очков за один забег.'
            },
            {
                id: 'century_18',
                name: 'Дитя 18 века',
                cssClass: 'title-18th',
                icon: '[[xp:crown]]',
                desc: 'Эксклюзивная награда за прохождение конца НЕОН ПАССА (30 уровень).'
            },
            {
                id: 'eternal_pilot',
                name: 'Вечный Пилот',
                cssClass: 'title-daily10',
                icon: '[[xp:star4]]',
                desc: `Награда за ${ETERNAL_PILOT_STREAK} дней подряд в Ежедневном даре.`
            },
            {
                id: 'bratukha_42',
                name: '42 БРАТУХА',
                cssClass: 'title-42',
                icon: '[[xp:fire]]',
                desc: '???'
            },
            {
                id: 'kitsune_blessed',
                name: 'Благословение Кицунэ',
                cssClass: 'title-kitsune',
                icon: '[[xp:sparkle]]',
                bundleOnly: true,
                desc: 'Эксклюзив бандла «НЕОН-КИЦУНЭ» — получить можно только во вкладке АКЦИИ магазина.'
            }
        ];

        const INITIAL_SPARK_REWARD_REMAINDER = 10;

        // Цикл ежедневных подарков. Титул зависит от полной серии, а не от дня цикла.
        const DAILY_REWARDS = [
            { day: 1, title: '{sparks} [[xp:spark]] + 60 XP', sub: 'Стартовый заряд Искр и опыта', sparks: 75, xp: 60 },
            { day: 2, title: '140 XP + {sparks} [[xp:spark]]', sub: 'Ускорение XPACE Пасса', sparks: 50, xp: 140 },
            { day: 3, title: '{sparks} [[xp:spark]] Искр', sub: 'Запас Жёлтых Искр для магазина', sparks: 160, xp: 0 },
            { day: 4, title: '220 XP + {sparks} [[xp:spark]]', sub: 'Двойной рывок по уровням Пасса', sparks: 80, xp: 220 },
            { day: 5, title: '{sparks} [[xp:spark]] + 100 XP', sub: 'Бонус за пять дней подряд', sparks: 260, xp: 100 },
            { day: 6, title: 'СТИЛЬ «ЗАКАТ 1989»', sub: 'Оформление профиля (или {fallbackSparks} [[xp:spark]])', sparks: 0, xp: 80, themeId: 'sunset89', fallbackSparks: 220 },
            { day: 7, title: '360 XP + {sparks} [[xp:spark]]', sub: 'Недельный бонус ветерана', sparks: 150, xp: 360 },
            { day: 8, title: 'СЛЕД «СИНТВЕЙВ ДУО»', sub: 'Неоновый шлейф (или {fallbackSparks} [[xp:spark]])', sparks: 0, xp: 100, trailId: 'vhs_sunset', fallbackSparks: 250 },
            { day: 9, title: '{sparks} [[xp:spark]] + 250 XP', sub: 'Предфинальный кибер-сейф', sparks: 450, xp: 250 },
            { day: 10, title: '{sparks} [[xp:spark]] + 500 XP', sub: 'Половина цикла', sparks: 750, xp: 500 },
            { day: 11, title: '{sparks} [[xp:spark]] + 150 XP', sub: 'Начало второй половины', sparks: 180, xp: 150 },
            { day: 12, title: '{sparks} [[xp:spark]]', sub: 'Запас Жёлтых Искр для магазина', sparks: 360, xp: 0 },
            { day: 13, title: '{sparks} [[xp:spark]] + 250 XP', sub: 'Ускорение XPACE Пасса', sparks: 220, xp: 250 },
            { day: 14, title: 'СЛЕД «КИСЛОТНЫЙ НЕОН»', sub: '+ 180 XP · Повтор: {fallbackSparks} [[xp:spark]]', sparks: 0, xp: 180, trailId: 'acid_lime', fallbackSparks: 350 },
            { day: 15, title: '{sparks} [[xp:spark]] + 400 XP', sub: 'Бонус за пятнадцать дней подряд', sparks: 550, xp: 400 },
            { day: 16, title: '{sparks} [[xp:spark]] + 180 XP', sub: 'Запас Жёлтых Искр для магазина', sparks: 260, xp: 180 },
            { day: 17, title: '{sparks} [[xp:spark]] + 320 XP', sub: 'Ускорение XPACE Пасса', sparks: 340, xp: 320 },
            { day: 18, title: 'СТИЛЬ «ЗОЛОТОЙ СИНДИКАТ»', sub: '+ 240 XP · Повтор: {fallbackSparks} [[xp:spark]]', sparks: 0, xp: 240, themeId: 'gold_syndicate', fallbackSparks: 375 },
            { day: 19, title: '{sparks} [[xp:spark]] + 450 XP', sub: 'Предфинальный кибер-сейф', sparks: 650, xp: 450 },
            { day: 20, title: '{sparks} [[xp:spark]] + 750 XP', sub: 'Финал цикла', sparks: 1100, xp: 750 }
        ];

        function dailyClaimSnapshot(profile) {
            const lastDailyClaim = Number(profile.lastDailyClaim) || 0;
            let lastDailyClaimDate = String(profile.lastDailyClaimDate || '');
            if (!lastDailyClaimDate && lastDailyClaim > 0) {
                const date = new Date(lastDailyClaim);
                lastDailyClaimDate = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'),
                    String(date.getDate()).padStart(2, '0')].join('-');
            }
            return {
                lastDailyClaim,
                lastDailyClaimDate,
                dailyStreak: Math.max(0, Math.floor(Number(profile.dailyStreak) || 0))
            };
        }

        function latestDailyClaim(a, b) {
            const first = dailyClaimSnapshot(a);
            const second = dailyClaimSnapshot(b);
            const order = first.lastDailyClaim && second.lastDailyClaim
                ? second.lastDailyClaim - first.lastDailyClaim
                : second.lastDailyClaimDate.localeCompare(first.lastDailyClaimDate);
            if (order) return order > 0 ? second : first;
            return second.dailyStreak > first.dailyStreak ? second : first;
        }



        // Контракты пилота (можно выбрать только 1 активный контракт на выполнение!)
        const SPARK_CONTRACTS = [
            { id: 'c_first_run', name: 'Первый вылет', stat: 'runs', target: 1, sparks: 60, desc: 'Сыграть 1 забег при активном контракте.' },
            { id: 'c_grazer_25', name: 'Мастер дрифта', stat: 'nearMisses', target: 25, sparks: 130, desc: 'Совершить 25 опасных обгонов в «Драйве».' },
            { id: 'c_rocks_50', name: 'Охотник на астероиды', stat: 'rocksDestroyed', target: 50, sparks: 160, desc: 'Уничтожить 50 камней в режиме «Зачистка».' },
            { id: 'c_coins_25', name: 'Золотая лихорадка', stat: 'coins', target: 25, sparks: 160, desc: 'Собрать 25 редких жёлтых монет.' },
            { id: 'c_runs_15', name: 'Ветеран Xpace', stat: 'runs', target: 15, sparks: 220, desc: 'Провести 15 вылетов на неоновой трассе.' },
            { id: 'c_score_5000', name: 'Легенда скорости', stat: 'maxRunScore', target: 5000, sparks: 260, desc: 'Набрать 5 000 очков за один забег.' },
            { id: 'c_runs_5', name: 'Ночная смена', stat: 'runs', target: 5, sparks: 90, desc: 'Провести 5 вылетов на неоновой трассе.' },
            { id: 'c_survivor_45', name: 'Пульс города', stat: 'maxRunSurvive', target: 45, sparks: 140, desc: 'Продержаться 45 секунд в одном забеге.' },
            { id: 'c_grazer_60', name: 'Неоновый каскадёр', stat: 'nearMisses', target: 60, sparks: 180, desc: 'Совершить 60 опасных обгонов в «Драйве».' },
            { id: 'c_survivor_75', name: 'За гранью скорости', stat: 'maxRunSurvive', target: 75, sparks: 190, desc: 'Продержаться 75 секунд в одном забеге.' },
            { id: 'c_boss_1', name: 'Первый трофей', stat: 'bossesDefeated', target: 1, sparks: 200, desc: 'Победить 1 Босса в любом режиме.' },
            { id: 'c_rocks_120', name: 'Космический демонтаж', stat: 'rocksDestroyed', target: 120, sparks: 210, desc: 'Уничтожить 120 астероидов и НЛО в «Зачистке».' },
            { id: 'c_coins_50', name: 'Золотой маршрут', stat: 'coins', target: 50, sparks: 220, desc: 'Собрать 50 редких жёлтых монет.' },
            { id: 'c_runs_30', name: 'Хроники гиперпространства', stat: 'runs', target: 30, sparks: 320, desc: 'Провести 30 вылетов на неоновой трассе.' },
            { id: 'c_score_10000', name: 'Вне пределов', stat: 'maxRunScore', target: 10000, sparks: 340, desc: 'Набрать 10 000 очков за один забег.' },
            {
                id: 'hc_survivor_110',
                hard: true,
                name: 'Железный пилот',
                stat: 'maxRunSurvive',
                target: 110,
                sparks: 220,
                rewardType: 'mask',
                rewardId: 'chrono_core',
                rewardLabel: 'Модуль «ХРОНО-ЯДРО X1»',
                desc: 'Сложный контракт: продержаться 110 секунд в одном забеге.'
            },
            {
                id: 'hc_grazer_140',
                hard: true,
                name: 'Повелитель лезвий',
                stat: 'nearMisses',
                target: 140,
                sparks: 280,
                rewardType: 'mask',
                rewardId: 'void_prism',
                rewardLabel: 'Модуль «ПРИЗМА ПУСТОТЫ»',
                desc: 'Сложный контракт: совершить 140 опасных обгонов в «Драйве».'
            },
            {
                id: 'hc_rocks_350',
                hard: true,
                name: 'Разрушитель планет',
                stat: 'rocksDestroyed',
                target: 350,
                sparks: 320,
                rewardType: 'mask',
                rewardId: 'annihilator',
                rewardLabel: 'Модуль «АННИГИЛЯТОР Z-42»',
                desc: 'Сложный контракт: уничтожить 350 астероидов и НЛО в «Зачистке».'
            },
            {
                id: 'hc_boss_slayer',
                hard: true,
                name: 'Убийца Левиафанов',
                stat: 'bossesDefeated',
                target: 3,
                sparks: 350,
                rewardType: 'ship',
                rewardId: 'valkyrie_x',
                rewardLabel: 'Скин «ВАЛЬКИРИЯ X-9»',
                desc: 'Сложный контракт: победить 3 Боссов в любом режиме!'
            },
            {
                id: 'hc_night_swallow',
                hard: true,
                name: 'Сквозь неон',
                stat: 'nearMisses',
                target: 90,
                sparks: 210,
                rewardType: 'ship',
                rewardId: 'night_swallow',
                rewardLabel: 'Скин «НОЧНАЯ ЛАСТОЧКА»',
                desc: 'Совершить 90 опасных обгонов в «Драйве».'
            },
            {
                id: 'hc_iron_atlas',
                hard: true,
                name: 'Тяжёлая зачистка',
                stat: 'rocksDestroyed',
                target: 220,
                sparks: 270,
                rewardType: 'ship',
                rewardId: 'iron_atlas',
                rewardLabel: 'Скин «СТАЛЬНОЙ АТЛАС»',
                desc: 'Уничтожить 220 астероидов и НЛО в «Зачистке».'
            },
            {
                id: 'hc_sun_needle',
                hard: true,
                name: 'На линии солнца',
                stat: 'maxRunScore',
                target: 12000,
                sparks: 310,
                rewardType: 'ship',
                rewardId: 'sun_needle',
                rewardLabel: 'Скин «СОЛНЕЧНАЯ ИГЛА»',
                desc: 'Набрать 12 000 очков за один забег.'
            },
            {
                id: 'hc_leopard_hunt',
                hard: true,
                name: 'Охотник джунглей 1989',
                stat: 'coins',
                target: 75,
                sparks: 300,
                rewardType: 'theme',
                rewardId: 'leopard89',
                rewardLabel: 'Стиль «ЛЕОПАРД 1989»',
                desc: 'Сложный контракт: собрать 75 жёлтых монет за серию вылетов.'
            },
            {
                id: 'hc_legend_20000',
                hard: true,
                name: 'Абсолют Xpace',
                stat: 'maxRunScore',
                target: 20000,
                sparks: 450,
                rewardType: 'mask',
                rewardId: 'sovereign_42',
                rewardLabel: 'Модуль «РЕАКТОР СВЕРХНОВОЙ»',
                desc: 'Сложный контракт: набрать 20 000 очков за один забег.'
            }
        ];

        // Каталог оформлений карточки профиля за Жёлтые Искры (со своим цветом огня в профиле!)
        const PROFILE_THEMES = [
            {
                id: 'default',
                name: 'КИБЕР-СТАНДАРТ',
                cost: 0,
                cssClass: '',
                accent: '#00f5d4',
                fire: { outer1: '#00f5d4', outer2: '#7209b7', inner1: '#ffffff', inner2: '#c084fc', border: '#00f5d4', shadow: '#7209b7', bg: 'rgba(0, 245, 212, 0.18)', text: '#a5f3fc' },
                desc: 'Базовая неоново-бирюзовая рамка пилота.'
            },
            {
                id: 'sunset89',
                name: 'ЗАКАТ 1989',
                cost: 188,
                cssClass: 'theme-sunset89',
                accent: '#ff0a78',
                fire: { outer1: '#ff0a78', outer2: '#00f5d4', inner1: '#fff3b0', inner2: '#ff70d9', border: '#ff0a78', shadow: '#00f5d4', bg: 'rgba(255, 10, 120, 0.24)', text: '#fbcfe8' },
                desc: 'Неоново-малиновый градиент с бирюзовой 3D-тенью.'
            },
            {
                id: 'gold_syndicate',
                name: 'ЗОЛОТОЙ СИНДИКАТ',
                cost: 375,
                cssClass: 'theme-gold_syndicate',
                accent: '#ffd60a',
                fire: { outer1: '#ffd60a', outer2: '#b45309', inner1: '#ffffff', inner2: '#ff9f1c', border: '#ffd60a', shadow: '#92400e', bg: 'rgba(255, 214, 10, 0.22)', text: '#fef08a' },
                desc: 'Элитное золотое оформление с янтарным сиянием.'
            },
            {
                id: 'matrix_ghost',
                name: 'МАТРИЦА ПРИЗРАКА',
                cost: 563,
                cssClass: 'theme-matrix_ghost',
                accent: '#4ade80',
                fire: { outer1: '#a3e635', outer2: '#059669', inner1: '#ffffff', inner2: '#4ade80', border: '#4ade80', shadow: '#065f46', bg: 'rgba(74, 222, 128, 0.22)', text: '#bbf7d0' },
                desc: 'Изумрудно-лаймовый стелс-контур киберсети.'
            },
            {
                id: 'quantum_void',
                name: 'КВАНТОВАЯ ПУСТОТА',
                cost: 813,
                cssClass: 'theme-quantum_void',
                accent: '#c084fc',
                fire: { outer1: '#c084fc', outer2: '#3b82f6', inner1: '#f3e8ff', inner2: '#38bdf8', border: '#c084fc', shadow: '#1d4ed8', bg: 'rgba(139, 92, 246, 0.26)', text: '#e9d5ff' },
                desc: 'Ультрафиолетово-синяя аура глубокого космоса.'
            },
            {
                id: 'imperial_18',
                name: 'ИМПЕРАТОР XVIII ВЕКА',
                cost: 1125,
                cssClass: 'theme-imperial_18',
                accent: '#ffd60a',
                fire: { outer1: '#ffd60a', outer2: '#be185d', inner1: '#ffffff', inner2: '#f472b6', border: '#ffd60a', shadow: '#ff0a78', bg: 'rgba(190, 24, 93, 0.28)', text: '#fef08a' },
                desc: 'Королевское барочное оформление из пурпура и золота!'
            },
            {
                id: 'chrome2077',
                name: 'ХРОМ 2077',
                cost: 650,
                cssClass: 'theme-chrome2077',
                accent: '#e2e8f0',
                fire: { outer1: '#f8fafc', outer2: '#38bdf8', inner1: '#ffffff', inner2: '#94a3b8', border: '#f1f5f9', shadow: '#0284c7', bg: 'rgba(148, 163, 184, 0.28)', text: '#f8fafc' },
                desc: 'Жидкий металл и зеркальный хром корпоративного класса.'
            },
            {
                id: 'sakura_neon',
                name: 'САКУРА НЕОН',
                cost: 700,
                cssClass: 'theme-sakura_neon',
                accent: '#ffb7d5',
                fire: { outer1: '#ffb7d5', outer2: '#9333ea', inner1: '#ffffff', inner2: '#f472b6', border: '#ffb7d5', shadow: '#7e22ce', bg: 'rgba(255, 183, 213, 0.24)', text: '#fce7f3' },
                desc: 'Лепестки сакуры, запутавшиеся в неоновых проводах Токио-2099.'
            },
            {
                id: 'blood_moon',
                name: 'КРОВАВАЯ ЛУНА',
                cost: 800,
                cssClass: 'theme-blood_moon',
                accent: '#ef4444',
                fire: { outer1: '#ff2a85', outer2: '#991b1b', inner1: '#fecaca', inner2: '#ef4444', border: '#ef4444', shadow: '#7f1d1d', bg: 'rgba(239, 68, 68, 0.26)', text: '#fecaca' },
                desc: 'Багровое затмение и шёпот мёртвых пилотов на орбите.'
            },
            {
                id: 'crimson_sector',
                name: 'БАГРОВЫЙ СЕКТОР',
                cost: 825,
                cssClass: 'theme-crimson_sector',
                accent: '#fb8b83',
                fire: { outer1: '#dc4d50', outer2: '#781723', inner1: '#fff1ee', inner2: '#fb8b83', border: '#fb8b83', shadow: '#781723', bg: 'rgba(220, 77, 80, 0.22)', text: '#ffd8d4' },
                desc: 'Тёмно-красный градиент с тёплой подсветкой по краю.'
            },
            {
                id: 'cobalt_night',
                name: 'КОБАЛЬТОВАЯ НОЧЬ',
                cost: 675,
                cssClass: 'theme-cobalt_night',
                accent: '#8bb9ff',
                fire: { outer1: '#68a5ff', outer2: '#2146aa', inner1: '#eff6ff', inner2: '#bfdbfe', border: '#8bb9ff', shadow: '#244ab0', bg: 'rgba(88, 142, 255, 0.22)', text: '#dcecff' },
                desc: 'Глубокий синий фон с холодной голубой рамкой.'
            },
            {
                id: 'copper_circuit',
                name: 'МЕДНЫЙ КОНТУР',
                cost: 725,
                cssClass: 'theme-copper_circuit',
                accent: '#f3ac84',
                fire: { outer1: '#e79363', outer2: '#904b35', inner1: '#fff3ea', inner2: '#f3ac84', border: '#f3ac84', shadow: '#904b35', bg: 'rgba(231, 147, 99, 0.22)', text: '#ffe3d3' },
                desc: 'Тёмный бронзовый фон с подсветкой цвета меди.'
            },
            {
                id: 'pixel8',
                name: '8-БИТ ПИКСЕЛЬ',
                cost: 588,
                cssClass: 'theme-pixel8',
                accent: '#ffd60a',
                fire: { outer1: '#ffd60a', outer2: '#ff0a78', inner1: '#00f5d4', inner2: '#ffffff', border: '#ffd60a', shadow: '#00f5d4', bg: 'rgba(255, 214, 10, 0.24)', text: '#fef08a' },
                desc: 'Полосатый аркадный автомат 1987 года. INSERT COIN.'
            },
            {
                // The retired ID is deliberately excluded from the catalog so old grants expire.
                id: 'liquid_gold_v2',
                name: 'ЖИДКОЕ ЗОЛОТО',
                cost: 10000,
                cssClass: 'theme-liquid_gold',
                accent: '#ffd60a',
                fire: { outer1: '#fff3b0', outer2: '#d97706', inner1: '#ffffff', inner2: '#ffd60a', border: '#fff3b0', shadow: '#92400e', bg: 'rgba(255, 214, 10, 0.28)', text: '#fffbeb' },
                desc: 'Расплавленное золото, текущее по контуру профиля.'
            },
            {
                id: 'leopard89',
                name: 'ЛЕОПАРД 1989',
                cost: 850,
                cssClass: 'theme-leopard89',
                accent: '#fde047',
                fire: { outer1: '#f59e0b', outer2: '#78350f', inner1: '#fef08a', inner2: '#d97706', border: '#fde047', shadow: '#78350f', bg: 'rgba(245, 158, 11, 0.26)', text: '#fef08a' },
                desc: 'Хищный леопардовый окрас в духе ретро-аркад 80-х.'
            },
            {
                id: 'cyber_samurai',
                name: 'КИБЕР-САМУРАЙ',
                cost: 925,
                cssClass: 'theme-cyber_samurai',
                accent: '#fb7185',
                fire: { outer1: '#e11d48', outer2: '#fbbf24', inner1: '#ffffff', inner2: '#fb7185', border: '#fb7185', shadow: '#ffd60a', bg: 'rgba(225, 29, 72, 0.26)', text: '#ffe4e6' },
                desc: 'Багровый клинок Нео-Киото с золотой окантовкой.'
            },
            {
                id: 'nuclear_dawn',
                name: 'ЯДЕРНЫЙ РАССВЕТ',
                cost: 775,
                cssClass: 'theme-nuclear_dawn',
                accent: '#a3e635',
                fire: { outer1: '#a3e635', outer2: '#00f5d4', inner1: '#ffffff', inner2: '#84cc16', border: '#a3e635', shadow: '#065f46', bg: 'rgba(163, 230, 53, 0.24)', text: '#ecfccb' },
                desc: 'Кислотно-изумрудное излучение реактора с бирюзовым огнём.'
            },
            {
                id: 'abyss_42',
                name: 'БЕЗДНА 42',
                cost: 1188,
                shopEndsAt: SHOP_NOVEMBER_42_END,
                cssClass: 'theme-abyss_42',
                accent: '#00f5d4',
                fire: { outer1: '#00f5d4', outer2: '#ff0a78', inner1: '#ffd60a', inner2: '#ffffff', border: '#00f5d4', shadow: '#ff0a78', bg: 'rgba(0, 245, 212, 0.24)', text: '#ffffff' },
                desc: 'Трёхцветный кибер-контур для избранных мастеров Xpace.'
            },
            {
                id: 'kitsune_shrine',
                name: 'ХРАМ КИЦУНЭ',
                cost: 0,
                bundleOnly: true,
                cssClass: 'theme-kitsune_shrine',
                accent: '#f472b6',
                fire: { outer1: '#f472b6', outer2: '#22d3ee', inner1: '#ffffff', inner2: '#67e8f9', border: '#f472b6', shadow: '#0e7490', bg: 'rgba(244, 114, 182, 0.24)', text: '#fbcfe8' },
                desc: 'Эксклюзив бандла «НЕОН-КИЦУНЭ»: розовое свечение неоновых храмов и бирюзовый лисий огонь.'
            }
        ];

        // Бандлы раздела АКЦИИ: скин + титул + след + цвет профиля одним пакетом.
        // exclusive=false — предметы продаются и по отдельности; exclusive=true — только в бандле.
        const PROMO_BUNDLES = [
            {
                id: 'bundle_synth_start',
                shopEndsAt: SHOP_NOVEMBER_BUNDLE_ROTATION,
                name: 'СИНТВЕЙВ СТАРТ',
                tagline: 'Классика неоновой трассы одним пакетом',
                desc: 'Все предметы этого бандла продаются и по отдельности — но вместе заметно дешевле. Титул «Ловец Искр» также открывается за 250 Искр на балансе.',
                price: 450,
                oldPrice: 601,
                exclusive: false,
                accent: '#ff0a78',
                accent2: '#00f5d4',
                shipId: 'phantom',
                trailId: 'vhs_sunset',
                trailIsSkin: false,
                themeId: 'sunset89',
                titleId: 'spark_hunter'
            },
            {
                id: 'bundle_kitsune',
                shopEndsAt: SHOP_NOVEMBER_BUNDLE_ROTATION,
                name: 'НЕОН-КИЦУНЭ',
                tagline: 'Дух-лиса неоновых храмов спустился на трассу',
                desc: 'Все 4 предмета — эксклюзивы бандла: скин, след, титул и цвет профиля нельзя получить никаким другим способом. Только покупка бандла.',
                price: 3250,
                oldPrice: null,
                exclusive: true,
                accent: '#f472b6',
                accent2: '#67e8f9',
                shipId: 'kitsune',
                trailId: 'kitsune_foxfire',
                trailIsSkin: true,
                themeId: 'kitsune_shrine',
                titleId: 'kitsune_blessed'
            }
        ];

        // Прозрачный PNG-вырез головы Пятёрки для шуточного скина «42» (до конца ноября 2026)
