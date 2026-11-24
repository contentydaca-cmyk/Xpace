        const MASK_CATALOG = [
            {
                id: 'none',
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`,
                name: 'БАЗОВОЕ ЯДРО',
                cost: 0,
                desc: 'Стандартная конфигурация систем корабля без модификаторов.'
            },
            {
                id: 'richard',
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="5" y="5" width="14" height="14" rx="2" stroke="#00f5d4" stroke-width="2"/><rect x="9" y="9" width="6" height="6" fill="#ff0a78"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="#00f5d4" stroke-width="2" stroke-linecap="round"/></svg>`,
                name: 'НЕЙРО-ЧИП «ОМЕГА»',
                cost: 260,
                desc: 'Тактический сопроцессор: +20% ко всем получаемым очкам в обоих режимах.'
            },
            {
                id: 'tony',
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polygon points="12 2 22 12 12 22 2 12" stroke="#ff0a78" stroke-width="2" fill="rgba(255,10,120,0.18)"/><circle cx="12" cy="12" r="4" fill="#ffbe0b"/><path d="M12 6v2M12 16v2M6 12h2M16 12h2" stroke="#00f5d4" stroke-width="2" stroke-linecap="round"/></svg>`,
                name: 'ПЛАЗМЕННЫЙ КАТАЛИЗАТОР',
                cost: 455,
                desc: 'Разогнанная матрица орудий: +1 к урону каждого лазерного выстрела в режиме «Зачистка»!'
            },
            {
                id: 'brandon',
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="#ffbe0b" stroke-width="2" fill="rgba(255,190,11,0.22)" stroke-linejoin="round"/></svg>`,
                name: 'ГИПЕР-ТУРБИНА «ВЕКТОР»',
                cost: 585,
                desc: 'Ускоритель плазменной тяги: +25% к скорости заряда шкалы Форсажа!'
            },
            {
                id: 'rasmus',
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#00f5d4" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke="#ff0a78" stroke-width="2" stroke-dasharray="3 2"/><circle cx="12" cy="12" r="2" fill="#ffbe0b"/></svg>`,
                name: 'КВАНТОВЫЙ СКАНЕР «ЭХО»',
                cost: 715,
                desc: 'Глубинный анализатор спектра: +10 XP дополнительно за каждую редкую жёлтую монету!'
            },
            {
                id: 'chrono_core',
                contractOnly: true,
                contractId: 'hc_survivor_90',
                contractName: 'Железный пилот',
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#4ade80" stroke-width="2"/><path d="M12 7v5l3.5 2" stroke="#00f5d4" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#ffd60a"/></svg>`,
                name: 'ХРОНО-ЯДРО X1',
                cost: 0,
                desc: 'Эксклюзив за контракт «Железный пилот»: +35% к длительности всех бонусов и +1.2 сек к комбо!'
            },
            {
                id: 'void_prism',
                contractOnly: true,
                contractId: 'hc_grazer_100',
                contractName: 'Повелитель лезвий',
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polygon points="12 2 21 19 3 19" stroke="#c084fc" stroke-width="2" fill="rgba(192,132,252,0.18)"/><circle cx="12" cy="13" r="3" fill="#00f5d4"/></svg>`,
                name: 'ПРИЗМА ПУСТОТЫ',
                cost: 0,
                desc: 'Эксклюзив за контракт «Повелитель лезвий»: +120 к радиусу магнита и +25% ко всем очкам!'
            },
            {
                id: 'annihilator',
                contractOnly: true,
                contractId: 'hc_rocks_250',
                contractName: 'Разрушитель планет',
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polygon points="12 2 19 6 22 13 17 21 7 21 2 13 5 6" stroke="#ff0a78" stroke-width="2" fill="rgba(255,10,120,0.2)"/><circle cx="12" cy="12" r="3.5" fill="#ffd60a"/></svg>`,
                name: 'АННИГИЛЯТОР Z-42',
                cost: 0,
                desc: 'Эксклюзив за контракт «Разрушитель планет»: +2 к урону лазеров и старт каждого забега со Щитом!'
            },
            {
                id: 'sovereign_42',
                contractOnly: true,
                contractId: 'hc_legend_15000',
                contractName: 'Абсолют Xpace',
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.8 5.6L21 8.5l-4.5 4.4 1.1 6.1L12 16l-5.6 3 1.1-6.1L3 8.5l6.2-.9L12 2z" stroke="#ffd60a" stroke-width="2" fill="rgba(255,214,10,0.24)"/></svg>`,
                name: 'РЕАКТОР СВЕРХНОВОЙ',
                cost: 0,
                desc: 'Эксклюзив за контракт «Абсолют Xpace»: Форсаж быстрее на +40%, а монеты дают +15 XP и +1 [[xp:spark]]!'
            },
            {
                id: 'gravi_pulsar',
                isNew: true,
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#a855f7" stroke-width="2" stroke-dasharray="4 2"/><circle cx="12" cy="12" r="5" stroke="#00f5d4" stroke-width="2"/><circle cx="12" cy="12" r="2.2" fill="#ffd60a"/></svg>`,
                name: 'ГРАВИ-ПУЛЬСАР «КВАЗАР»',
                cost: 845,
                desc: 'Гравитационная линза: +90 к радиусу притяжения Искр и +15% ко всем получаемым очкам!'
            },
            {
                id: 'aegis_matrix',
                isNew: true,
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.2 3.4 9.6 8 11 4.6-1.4 8-5.8 8-11V6l-8-4z" stroke="#38bdf8" stroke-width="2" fill="rgba(56,189,248,0.2)"/><path d="M12 7v10M8 11h8" stroke="#ffd60a" stroke-width="2" stroke-linecap="round"/></svg>`,
                name: 'ЭГИДА-МАТРИЦА «БАСТИОН»',
                cost: 1040,
                desc: 'Защитный энергоконтур: старт каждого вылета со Щитом и +25% к длительности всех бонусов!'
            },
            {
                id: 'photon_splitter',
                isNew: true,
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polygon points="12 2 21 19 12 15 3 19" stroke="#ff0a78" stroke-width="2" fill="rgba(255,10,120,0.22)"/><circle cx="12" cy="11" r="2.5" fill="#00f5d4"/></svg>`,
                name: 'ФОТОННЫЙ РАСЩЕПИТЕЛЬ',
                cost: 1235,
                desc: 'Квантовый усилитель стволов: +1 к урону лазеров в «Зачистке», +20% к заряду Форсажа и +0.8с к комбо!'
            },
            {
                id: 'midas_protocol',
                isNew: true,
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polygon points="12 2 20 8 17 20 7 20 4 8" stroke="#ffd60a" stroke-width="2" fill="rgba(255,214,10,0.22)"/><circle cx="12" cy="12" r="3.5" fill="#ff0a78"/><path d="M12 5v2M12 17v2" stroke="#ffffff" stroke-width="2"/></svg>`,
                name: 'GOLD-ПРОТОКОЛ «МИДАС»',
                cost: 1560,
                desc: 'Алгоритм обогащения: каждая золотая монета приносит +2 [[xp:spark]] Искры, +20 XP и +15% к очкам!'
            },
            {
                id: 'synth_overclock',
                isNew: true,
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="#00f5d4" stroke-width="2" fill="rgba(0,245,212,0.15)"/><path d="M7 15l3-6 4 6 3-4" stroke="#ff0a78" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
                name: 'СИНТ-ОВЕРКЛОК «1989»',
                cost: 1885,
                desc: 'Разгон процессора VHS: +30% к очкам, +1.5 сек к удержанию комбо и +30% к скорости заряда Форсажа!'
            },
            {
                id: 'omega_singularity',
                isNew: true,
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" stroke="#ffd60a" stroke-width="2"/><polygon points="12 3 19 12 12 21 5 12" stroke="#00f5d4" stroke-width="1.8" fill="rgba(255,10,120,0.26)"/><circle cx="12" cy="12" r="3" fill="#ffffff"/></svg>`,
                name: 'ЯДРО СИНГУЛЯРНОСТИ «АБСОЛЮТ»',
                cost: 2860,
                desc: 'Топовый гибридный реактор: старт со Щитом, +35% к очкам, +2 к урону лазеров, +100 к магниту и +1 [[xp:spark]] за монету!'
            },
            {
                id: 'neuro_lens',
                isNew: true,
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#c084fc" stroke-width="2"/><circle cx="12" cy="12" r="6" stroke="#f472b6" stroke-width="1.6" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="3" fill="#ffffff"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#f472b6" stroke-width="1.8" stroke-linecap="round"/></svg>`,
                name: 'НЕЙРО-ЛИНЗА «ОРАКУЛ»',
                cost: 2340,
                desc: 'Предиктивный сопроцессор: +25% ко всем получаемым очкам в обоих режимах!'
            },
            {
                id: 'cryo_gen',
                isNew: true,
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15" stroke="#67e8f9" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="3.5" fill="rgba(186,230,253,0.7)" stroke="#bae6fd" stroke-width="1.4"/></svg>`,
                name: 'КРИО-ГЕНЕРАТОР «ИНЕЙ»',
                cost: 2080,
                desc: 'Защитная крио-система: старт каждого вылета со Щитом и +15% к длительности всех бонусов!'
            },
            {
                id: 'shadow_mod',
                isNew: true,
                svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#64748b" stroke-width="2" stroke-dasharray="3 2"/><path d="M12 4l2 5h5l-4 3 1.5 5L12 14 7.5 17 9 12 5 9h5z" stroke="#c084fc" stroke-width="1.6" fill="rgba(192,132,252,0.2)"/><circle cx="12" cy="12" r="1.4" fill="#ffffff"/></svg>`,
                name: 'ФАНТОМ-МОДУЛЬ «ТЕНЬ»',
                cost: 2600,
                desc: 'Призрачный ускоритель: +35% к скорости заряда шкалы Форсажа!'
            }
        ];

        // Каталог Неоновых Следов (Trails) в магазине Xpace
        const TRAIL_CATALOG = [
            {
                id: 'default',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" stroke="#00f5d4" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="#ffffff"/></svg>`,
                name: 'СТАНДАРТНЫЙ СЛЕД',
                cost: 0,
                color: null,
                desc: 'Фирменный плазменный след выбранного корабля.'
            },
            {
                id: 'vhs_sunset',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 16c4-6 12-6 16 0" stroke="#00f5d4" stroke-width="2.5" stroke-linecap="round"/><path d="M4 10c4-6 12-6 16 0" stroke="#ff0a78" stroke-width="2.5" stroke-linecap="round"/></svg>`,
                name: 'СИНТВЕЙВ ДУО',
                cost: 225,
                color: 'vhs_sunset',
                desc: 'Переливающийся бирюзово-пурпурный двойной след.'
            },
            {
                id: 'acid_lime',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><polygon points="12 3 20 18 4 18" stroke="#a3e635" stroke-width="2" fill="rgba(163,230,53,0.2)"/></svg>`,
                name: 'КИСЛОТНЫЙ НЕОН',
                cost: 350,
                color: 'rgba(163, 230, 53, ',
                desc: 'Ярко-лаймовый реактивный след высокой яркости.'
            },
            {
                id: 'blood_dragon',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 7 6 11 6 15a6 6 0 0012 0c0-4-2-8-6-13z" stroke="#ff0a78" stroke-width="2" fill="rgba(255,10,120,0.25)"/></svg>`,
                name: 'БАГРОВЫЙ ИМПУЛЬС',
                cost: 500,
                color: 'rgba(255, 10, 120, ',
                desc: 'Густой неоново-малиновый шлейф высокой мощности.'
            },
            {
                id: 'rainbow',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 18c4-8 12-8 16 0" stroke="#ff0a78" stroke-width="2.4" stroke-linecap="round"/><path d="M4 13c4-8 12-8 16 0" stroke="#ffd60a" stroke-width="2.4" stroke-linecap="round"/><path d="M4 8c4-8 12-8 16 0" stroke="#00f5d4" stroke-width="2.4" stroke-linecap="round"/></svg>`,
                name: 'РАДУЖНЫЙ РАЗЛОМ',
                cost: 575,
                color: 'rainbow',
                desc: 'Переливается всеми цветами спектра на каждом кадре.'
            },
            {
                id: 'glitch',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="3" height="18" fill="#00f5d4"/><rect x="10" y="6" width="3" height="9" fill="#ff0a78"/><rect x="15" y="9" width="3" height="12" fill="#ffffff"/></svg>`,
                name: 'ГЛИТЧ VHS',
                cost: 650,
                color: 'glitch',
                desc: 'Ломаный цифровой след с артефактами и сдвигами строк.'
            },
            {
                id: 'pixel_tail',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="4" y="14" width="4" height="4" fill="#a3e635"/><rect x="10" y="10" width="4" height="4" fill="#4ade80"/><rect x="16" y="6" width="4" height="4" fill="#00f5d4"/></svg>`,
                name: 'ПИКСЕЛЬНЫЙ ХВОСТ',
                cost: 475,
                color: 'pixel',
                desc: 'Восьмибитные квадратики, будто из аркадного автомата 1987-го.'
            },
            {
                id: 'neon_heart',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-7-9a4 4 0 017-2.5A4 4 0 0119 12c0 4.5-7 9-7 9z" stroke="#ff2a85" stroke-width="2" fill="rgba(255,42,133,0.28)"/></svg>`,
                name: 'НЕО-СЕРДЦЕ',
                cost: 625,
                color: 'heart',
                desc: 'Светящиеся неоновые сердечки, плавно тающие в кильватере.'
            },
            {
                id: 'void',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#090114" stroke="#c084fc" stroke-width="2"/><path d="M4 12a8 7 0 0016 0" stroke="#8b5cf6" stroke-width="1.6" stroke-dasharray="3 3"/></svg>`,
                name: 'ЧЁРНАЯ ДЫРА',
                cost: 900,
                color: 'void',
                desc: 'Тёмное ядро с фиолетовым гравитационным кольцом.'
            },
            {
                id: 'cleopatra_42',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="4" fill="#d97706" stroke="#fde047" stroke-width="1.8"/><circle cx="6.5" cy="7" r="1.4" fill="#291506"/><circle cx="17.5" cy="7.5" r="1.5" fill="#291506"/><circle cx="6" cy="17" r="1.3" fill="#291506"/><circle cx="18" cy="16.5" r="1.4" fill="#291506"/><text x="12" y="15.5" text-anchor="middle" font-family="Exo 2, sans-serif" font-weight="900" font-size="10.5" fill="#fef08a" stroke="#291506" stroke-width="0.9">42</text></svg>`,
                name: 'ЛЕОПАРД «42»',
                cost: 525,
                shopEndsAt: SHOP_NOVEMBER_42_END,
                color: 'cleopatra_42',
                desc: 'Плавный сияющий золотисто-леопардовый шлейф с мягким неоновым свечением и числами «42».'
            },
            {
                id: 'neon_binary',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="3" height="4" fill="#4ade80"/><rect x="4" y="9" width="3" height="3" fill="#4ade80" opacity="0.8"/><rect x="4" y="14" width="3" height="2" fill="#4ade80" opacity="0.6"/><rect x="10" y="5" width="3" height="3" fill="#00f5d4"/><rect x="10" y="10" width="3" height="4" fill="#00f5d4" opacity="0.85"/><rect x="10" y="16" width="3" height="3" fill="#00f5d4" opacity="0.55"/><rect x="16" y="4" width="3" height="3" fill="#4ade80" opacity="0.9"/><rect x="16" y="9" width="3" height="5" fill="#4ade80" opacity="0.7"/><rect x="16" y="16" width="3" height="2" fill="#4ade80" opacity="0.5"/></svg>`,
                name: 'НЕОН-БИНАРЬ',
                cost: 725,
                color: 'neon_binary',
                desc: 'Падающие символы 0 и 1: след в духе кибер-кода, мигающий изумрудно-бирюзовыми цифрами.'
            },
            {
                id: 'cryo_frost',
                svg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke-linecap="round"><path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" stroke="#67e8f9" stroke-width="1.4"/><circle cx="12" cy="12" r="3" fill="rgba(186,230,253,0.7)" stroke="#bae6fd" stroke-width="1.2"/><path d="M9 4l3 2 3-2M9 20l3-2 3 2M4 9l2 3-2 3M20 9l-2 3 2 3" stroke="#a5f3fc" stroke-width="1.1"/></svg>`,
                name: 'КРИО-ИНЕЙ',
                cost: 800,
                eventOnly: true,
                color: 'cryo_frost',
                desc: 'Ледяные снежинки-кристаллы, оседающие за кораблём с лёгкой бирюзовой метелью.'
            }
        ];

        // Фирменные следы со скинов: покупаешь скин — след открывается НАВСЕГДА
        // и его можно поставить на любой корабль (владельцем считается покупка скина).
        function skinTrailEffect(outline, detail, stride, pose) {
            return {
                outline, detail, stride, pose,
                outlinePath: new Path2D(outline),
                detailPath: new Path2D(detail)
            };
        }

        const SKIN_TRAIL_EFFECTS = {
            ion_manta: skinTrailEffect(
                'M-9 0a9 4 0 1 0 18 0a9 4 0 1 0 -18 0 M-6 6a6 2.5 0 1 0 12 0a6 2.5 0 1 0 -12 0',
                'M-5 -1Q-2 -3 2 -2', 10,
                (ctx, age) => { ctx.translate(0, age * 16); ctx.scale(0.65 + age, 0.7 + age * 0.6); }),
            copper_jackal: skinTrailEffect(
                'M-4 -9 -9 -1 -5 -2 -10 8 M4 -9 9 -1 5 -2 10 8',
                'M0 -6 V2 M0 5 V8', 9,
                (ctx, age, seq) => { ctx.rotate(seq % 18 === 0 ? -age * 0.6 : age * 0.6); ctx.scale(1 + age * 0.25, 1 + age * 0.8); }),
            violet_comet: skinTrailEffect(
                'M2 -8Q13 -7 8 2Q4 8 -10 9Q-2 5 -3 2Q-9 -3 2 -8Z',
                'M0 -3Q3 -6 6 -3Q4 0 1 1Q-2 0 0 -3Z', 14,
                (ctx, age, seq) => { ctx.translate(Math.sin(seq * 0.72 + age * 3) * age * 17, age * 8); ctx.rotate(seq * 0.17 + age * 2); }),
            night_swallow: skinTrailEffect(
                'M0 8Q-9 3 -7 -5Q-4 -9 1 -10Q6 -5 4 -1L1 2 3 2Q2 6 0 8Z',
                'M-2 10Q0 1 0 -7 M-1 2 -4 -2 M0 -1 2 -4', 12,
                (ctx, age, seq) => { const side = seq % 24 === 0 ? 1 : -1; ctx.translate(side * age * 13, age * 10); ctx.rotate(side * (0.4 + age)); }),
            iron_atlas: skinTrailEffect(
                'M-9 -4 -5 -8H5L9 -4V4L5 8H-5L-9 4Z M-5 4H5',
                'M-4 -1 -1 2 5 -4', 10,
                (ctx, age) => ctx.scale(1 - age * 0.45, 1 - age * 0.45)),
            sun_needle: skinTrailEffect(
                'M-10 -4Q0 5 10 -4 M-8 3Q0 9 8 3',
                'M0 -6V9 M-3 1H3', 8,
                (ctx, age, seq) => { ctx.rotate(Math.sin(seq * 0.5) * 0.32); ctx.scale(0.55 + age * 1.25, 0.85 + age * 0.3); }),
            dragon: skinTrailEffect(
                'M-9 7Q-3-1 0-9Q2-2 1 1Q6-3 8-6Q9 3 3 8Z',
                'M-4 5Q0 0 1-4 M2 6Q6 3 6 0', 7,
                (ctx, age, seq) => {
                    ctx.rotate(Math.sin(seq * 0.5) * 0.45);
                    ctx.scale(1 - age * 0.45, 0.9 + age * 0.35);
                }),
            neko: skinTrailEffect(
                'M0 0Q3-2 7 3Q8 7 4 8H-4Q-8 7-7 3Q-3-2 0 0Z M-8-4H-6 M-3-8H-1 M1-8H3 M6-4H8',
                'M-3 4Q0 1 3 4', 10,
                (ctx, age, seq) => {
                    const side = seq % 20 ? 1 : -1;
                    ctx.translate(side * (3 + age * 9), age * 5);
                    ctx.rotate(side * (0.18 + age * 0.45));
                }),
            toaster: skinTrailEffect(
                'M-6 7V-1Q-8-4-5-6Q0-10 5-6Q8-4 6-1V7Z M8 4 10 5 M-11 3-9 2',
                'M-2-2 1-4 3-2 0 0Z', 9,
                (ctx, age, seq) => {
                    ctx.rotate(Math.sin(seq * 0.8) * (0.33 + age * 1.1));
                    ctx.scale(0.82 - age * 0.28, 0.82 - age * 0.28);
                }),
            bathyscaphe_liman: skinTrailEffect(
                'M-9 0Q0-9 9 0 M-11 4Q0-2 11 4 M-7 8Q0 4 7 8',
                'M-2 0H2 M0-2V2', 9,
                (ctx, age) => {
                    ctx.translate(0, age * 9);
                    ctx.scale(0.58 + age * 0.91, 0.75 + age * 0.29);
                }),
            origami_crane: skinTrailEffect(
                'M-10-4-3 3 0-6 3 3 10-4 6 5 0 9-6 5Z',
                'M-3 3 0 9 3 3 M0-6V4', 11,
                (ctx, age, seq) => {
                    ctx.translate(Math.sin(seq * 0.5) * age * 10, age * 7);
                    ctx.rotate(Math.sin(seq * 0.27 + age * 1.4) * 0.6);
                    ctx.scale(1 - age * 0.37, 1 - age * 0.37);
                })
        };

        const SKIN_TRAILS = SHIP_CATALOG
            .filter(s => s.builtinTrail && s.builtinTrail !== 'cyan_plasma')
            .map(s => ({
                id: s.builtinTrail,
                name: `СЛЕД «${s.trailLabel}»`,
                shipId: s.id,
                shipName: s.name,
                accent: s.primary,
                effect: SKIN_TRAIL_EFFECTS[s.id],
                desc: s.adminOnly ? 'Эксклюзивный след награды за миллион. Выдача закрыта — след остался только у прежних владельцев скина.' : (s.bundleOnly ? `Эксклюзивный след бандла «${s.bundleName}». Открывается только при покупке бандла в разделе АКЦИИ.` : s.contractOnly ? `Фирменный след скина ${s.name}. Выполни контракт «${s.contractName}», чтобы поставить этот след на любой корабль.` : `Фирменный след скина ${s.name}. Открывается навсегда при покупке скина и ставится на любой корабль.`)
            }));

        const collectionIds = items => new Set(items.map(item => item.id));
        const COLLECTION_CATALOG = {
            Ships: collectionIds(SHIP_CATALOG),
            Masks: collectionIds(MASK_CATALOG.filter(mask => mask.id !== 'none')),
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

        // Уникальные иконки следов со скинов — мини-версии самого эффекта
        const SKIN_TRAIL_ICONS = {
            requiem_skulls: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 15C-2-2 28-2 20 15L18 17V23H8V17Z" fill="#aa2440" stroke="#ff798d"/><path d="M10 19V23M13 19V23M16 19V23" stroke="#2b0916"/><ellipse cx="9" cy="11" rx="3" ry="3.5" fill="#260914"/><ellipse cx="17" cy="11" rx="3" ry="3.5" fill="#260914"/><path d="M13 14L11 17H15Z" fill="#260914"/></svg>`,
            text42: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="4" fill="rgba(255,214,10,0.12)" stroke="#ffd60a" stroke-width="1.5"/><text x="12" y="15.6" text-anchor="middle" font-family="Exo 2, sans-serif" font-weight="900" font-size="10" fill="#ff0a78">42</text><text x="10.6" y="14.2" text-anchor="middle" font-family="Exo 2, sans-serif" font-weight="900" font-size="10" fill="#00f5d4" opacity="0.8">42</text></svg>`,
            crimson_slash: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="7.8" y="7.8" width="8.4" height="8.4" transform="rotate(45 12 12)" fill="rgba(255,42,133,0.3)" stroke="#ff2a85" stroke-width="1.6"/><rect x="14.2" y="14.2" width="4.4" height="4.4" transform="rotate(45 16.4 16.4)" fill="#ff2a85" opacity="0.6"/><rect x="4.4" y="4.4" width="3.4" height="3.4" transform="rotate(45 6.1 6.1)" fill="#ffe4e6" opacity="0.7"/></svg>`,
            solar_gold: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="11.5" cy="12" r="4.4" fill="#ffd60a"/><path d="M11.5 3.4v2.4M11.5 18.2v2.4M2.9 12h2.4M17.7 12h2.4M5.3 5.8l1.7 1.7M16 16.5l1.7 1.7M17.7 5.8L16 7.5M7 16.5l-1.7 1.7" stroke="#fef9c3" stroke-width="1.5" stroke-linecap="round"/><circle cx="20.6" cy="4.2" r="1.3" fill="#ffd60a" opacity="0.7"/></svg>`,
            matrix_code: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 3v18M20 3v18" stroke="#4ade80" stroke-width="1.2" opacity="0.45"/><text x="6.2" y="9.4" font-family="Exo 2, sans-serif" font-weight="900" font-size="6.4" fill="#4ade80">01</text><text x="10.2" y="15.2" font-family="Exo 2, sans-serif" font-weight="900" font-size="6.4" fill="#00f5d4">10</text><text x="7.2" y="21" font-family="Exo 2, sans-serif" font-weight="900" font-size="6.4" fill="#4ade80" opacity="0.7">0</text></svg>`,
            imperial_crown: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3.5 17.5L5 8l4.2 3.4L12 5.5l2.8 5.9L19 8l1.5 9.5z" fill="rgba(255,214,10,0.28)" stroke="#ffd60a" stroke-width="1.5" stroke-linejoin="round"/><path d="M4.6 20.4h14.8" stroke="#c084fc" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="9.8" r="1.1" fill="#c084fc"/></svg>`,
            ufo_beam: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="7.4" rx="6.2" ry="2.3" fill="rgba(74,222,128,0.55)" stroke="#a7f3d0" stroke-width="1.2"/><circle cx="12" cy="5.6" r="2" fill="rgba(167,243,208,0.6)"/><path d="M8.6 10.4L6 14.2h12l-2.6-3.8" stroke="#4ade80" stroke-width="1.1" opacity="0.45" fill="rgba(74,222,128,0.12)"/><ellipse cx="12" cy="16.6" rx="4.4" ry="1.5" stroke="#4ade80" stroke-width="1.4"/><ellipse cx="12" cy="20" rx="6.4" ry="2" stroke="#4ade80" stroke-width="1.2" opacity="0.55"/></svg>`,
            ghost_ectoplasm: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6.4 19V10.4a5.6 5.6 0 0111.2 0V19l-2.8-2.1-2.8 2.1-2.8-2.1z" fill="rgba(103,232,249,0.32)" stroke="#67e8f9" stroke-width="1.5" stroke-linejoin="round"/><circle cx="9.8" cy="10.6" r="1.15" fill="#ecfeff"/><circle cx="14.2" cy="10.6" r="1.15" fill="#ecfeff"/><circle cx="4.8" cy="6.4" r="0.9" fill="#67e8f9" opacity="0.6"/><circle cx="19.4" cy="5.4" r="0.7" fill="#67e8f9" opacity="0.45"/></svg>`,
            vhs_tape: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2.4" y="5.6" width="19.2" height="12.8" rx="2.6" fill="rgba(255,42,133,0.16)" stroke="#ff2a85" stroke-width="1.5"/><circle cx="8.2" cy="12" r="2.4" stroke="#00f5d4" stroke-width="1.3"/><circle cx="15.8" cy="12" r="2.4" stroke="#00f5d4" stroke-width="1.3"/><path d="M8.2 12h7.6" stroke="#ffe4e6" stroke-width="1" opacity="0.6"/><rect x="6" y="18.4" width="12" height="1.6" rx="0.8" fill="#00f5d4" opacity="0.35"/></svg>`,
            aurora_ribbon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-width="2.3"><path d="M3 18.4c2.6-2.4 5.2 0.4 7.8-2" stroke="#67e8f9" opacity="0.9"/><path d="M6.4 14.8c2.6-2.4 5.2 0.4 7.8-2" stroke="#c084fc" opacity="0.95"/><path d="M9.8 11.2c2.6-2.4 5.2 0.4 7.8-2" stroke="#67e8f9" opacity="0.9"/><path d="M13.2 7.6c2.6-2.4 5.2 0.4 7.8-2" stroke="#c084fc" opacity="0.95"/><path d="M16.6 4.4c2-1.8 4 0.3 6-1.5" stroke="#67e8f9" opacity="0.8"/></svg>`,
            lotus_petals: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 3.4c2.5 3.1 2.5 6.9 0 10-2.5-3.1-2.5-6.9 0-10z" fill="rgba(192,132,252,0.5)" stroke="#f5d0fe" stroke-width="1.1"/><path d="M4.4 8.6c3.8 1 5.9 4 5.1 8.3-3.8-1-5.9-4-5.1-8.3z" fill="rgba(255,112,217,0.4)" stroke="#ff70d9" stroke-width="1.1"/><path d="M19.6 8.6c-3.8 1-5.9 4-5.1 8.3 3.8-1 5.9-4 5.1-8.3z" fill="rgba(192,132,252,0.4)" stroke="#c084fc" stroke-width="1.1"/></svg>`,
            ronin_slash: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke-linecap="round"><path d="M2 20C10 20 17 15 21 10C19 16 11 23 2 20Z" fill="#e54655"/><path d="M2 16C10 15 18 9 22 4C19 11 12 18 2 16Z" fill="#26c8b6"/><path d="M4 16Q15 14 22 4" stroke="#c4ffec" stroke-width="1.15"/></svg>`,
            prism_shards: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><polygon points="12,2.8 18.4,11 12,21.2" fill="rgba(255,112,217,0.7)" stroke="#ffffff" stroke-width="0.9"/><polygon points="12,2.8 5.6,11 12,21.2" fill="rgba(103,232,249,0.7)" stroke="#ffffff" stroke-width="0.9"/><polygon points="12,7.6 15.2,11.6 12,16 8.8,11.6" fill="rgba(255,255,255,0.75)"/></svg>`,
            aurum_dust: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke-linecap="round"><path d="M8 3C19 7 20 9 12 12S3 17 11 21" stroke="#ffd982" stroke-width="1.9"/><path d="M16 3C5 7 4 9 12 12S21 17 13 21" stroke="#fff0b5" stroke-width="1.65"/><circle cx="6" cy="5" r="1" fill="#fff0b5"/><circle cx="18" cy="18" r="1.35" fill="#ef6571"/><circle cx="5" cy="17" r="0.8" fill="#ef6571"/></svg>`,
            valkyrie_wings: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M11.5 13C8 7 5 9 2 4C2.5 10 6 13 11.5 13ZM12.5 13C16 7 19 9 22 4C21.5 10 18 13 12.5 13Z" fill="#f15443"/><path d="M11 16C8 12 5 14 2.5 10C4 16 7 18 11 16ZM13 16C16 12 19 14 21.5 10C20 16 17 18 13 16Z" fill="#4c9aff"/><path d="M12 15Q15.4 18 12 21Q8.6 18 12 15Z" fill="#ffe071"/></svg>`,
            kitsune_foxfire: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M8 3.5c2.6 3.2 3.4 5.4 2.2 8.2-1.2 2.7-4.4 3-5.6.6-1-2 .2-4.6 3.4-8.8z" fill="rgba(244,114,182,0.75)" stroke="#fbcfe8" stroke-width="1.1"/><path d="M16.5 8c2 2.5 2.6 4.2 1.7 6.3-.9 2-3.4 2.3-4.3.4-.8-1.5.1-3.5 2.6-6.7z" fill="rgba(103,232,249,0.75)" stroke="#ecfeff" stroke-width="1.1"/><circle cx="7.4" cy="10.4" r="1.15" fill="#ffffff"/><circle cx="16" cy="13.4" r="0.95" fill="#ffffff"/><path d="M5 19.5c2.4-1.6 4.8-1.6 7.2 0M12.2 19.5c2.4-1.6 4.8-1.6 7.2 0" stroke="#f472b6" stroke-width="1.3" stroke-linecap="round" opacity="0.6"/></svg>`,
            astral_stars: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2.4" fill="#ffffff" stroke="#60a5fa" stroke-width="1.2"/><path d="M12 2l.7 4.2L17 8l-4.3.8L12 13l-.7-4.2L7 8l4.3-.8z" fill="#60a5fa" opacity="0.85"/><path d="M4 4l.4 2.2L7 7l-2.6.5L4 10l-.4-2.5L1 7l2.6-.5z" fill="#c4b5fd" opacity="0.8"/><path d="M20 14l.4 2.2.6.3-.6.3-.4 2.2-.4-2.2-.6-.3.6-.3z" fill="#bae6fd"/></svg>`,
            magma_drips: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 4l3 6m6-7 1 6m5-4-2 6" stroke="#bd8268" stroke-width="1.2" stroke-linecap="round"/><path d="m6 13 6-4 5 4-2 6-6 2-4-4z" fill="#55403b" stroke="#d77b50" stroke-width="1.2"/><path d="m6 13 6-4 1 4-4 2z" fill="#ffd196"/><path d="m18 16 3-2 1 3-3 2zM3 15l1 3-2 1-1-2z" fill="#e59863"/></svg>`,
        };

        // Запасная универсальная иконка (для новых следов, если иконку не добавили)
        function skinTrailIconSvg(trailId, accent) {
            if (SKIN_TRAIL_ICONS[trailId]) return SKIN_TRAIL_ICONS[trailId];
            const effect = SKIN_TRAILS.find(trail => trail.id === trailId)?.effect;
            if (effect) {
                return `<svg width="26" height="26" viewBox="-13 -13 26 26" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${effect.outline}" stroke="${accent}" stroke-width="2"/><path d="${effect.detail}" stroke="#fff" stroke-width="1.2"/></svg>`;
            }
            return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 17c3.2-7.5 6.2-7.5 8.4-4.2c2.2 3.3 5 3.3 8.6-4.3" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/><path d="M3 12.5c3.2-7.5 6.2-7.5 8.4-4.2" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round" opacity="0.65"/><circle cx="19.4" cy="7.6" r="2.3" fill="${accent}"/><circle cx="19.4" cy="7.6" r="0.9" fill="#ffffff"/></svg>`;
        }

