const XpaceLanguage = (() => {
    const english = new Map(`
Улучшения|Upgrades
УЛУЧШЕНИЯ|UPGRADES
Только в режиме «Драйв»|Drive mode only
Только в режиме «Зачистка»|Clearance mode only
Зачистка и боевые секторы Экспедиции|Clearance and combat sectors in Expedition
Драйв и скоростные секторы Экспедиции|Drive and speed sectors in Expedition
Сверхсчёт ×5|Score Rush ×5
Резонанс|Resonance
Ионный веер|Ion Fan
СПАСАТЕЛЬНЫЙ МАЯК|RESCUE BEACON
ФИЛЬТР СБОЕВ|GLITCH FILTER
После 25 секунд полёта вызывает щит вместо следующего появившегося бонуса, если у корабля нет защиты. Один раз за вылет.|After 25 seconds of flight, replaces the next spawned pickup with a shield if your ship is unshielded. Once per run.
Нейтрализует вредную капсулу при подборе и перезаряжается 22 секунды. Первый перехват готов на старте.|Neutralizes a harmful capsule on pickup, then recharges for 22 seconds. Ready at the start of each run.
МАЯК ВЫЗВАЛ ЩИТ|BEACON CALLED IN A SHIELD
ФИЛЬТР ПЕРЕХВАТИЛ СБОЙ|FILTER BLOCKED A GLITCH
На 5 секунд умножает все получаемые очки на 5. Бонус ×2 в это время уступает место ×5.|Multiplies all points earned by 5 for 5 seconds. The ×5 multiplier replaces the ×2 bonus while active.
На 7 секунд расширяет зону опасного обгона. Каждый обгон дополнительно даёт 2 уровня комбо.|Widens the near-miss zone for 7 seconds. Each near miss adds 2 extra combo levels.
На 6 секунд каждый залп выпускает веер из пяти лазеров. Плазма и скорострел продолжают действовать.|For 6 seconds, every volley fires a fan of five lasers. Plasma and rapid fire stay active.
Этот супер недоступен в текущем режиме|This super is unavailable in the current mode
Только в режиме «Экспедиция»|Expedition mode only
ФЛЮКС-КОЛЛЕКТОР|FLUX COLLECTOR
ИМПУЛЬСНЫЙ НАКОПИТЕЛЬ|PULSE CAPACITOR
ИСКРОПЛАВ|SPARK REFINER
КРОМОЧНЫЕ СОПЛА|EDGE THRUSTERS
ПЯТЫЙ ИМПУЛЬС|FIFTH PULSE
РЕЗЕРВНАЯ ШИНА|AUXILIARY BUS
АБЛЯЦИОННЫЙ ПАНЦИРЬ|ABLATIVE SHELL
ФАЗОВЫЙ ГАСИТЕЛЬ|PHASE DAMPER
ОСКОЛОЧНАЯ КУЗНЯ|SHRAPNEL FORGE
ЯДРО СТАЗИСА|STASIS CORE
Постоянно притягивает синие искры вблизи корабля.|Continuously attracts nearby blue sparks.
Синие искры дают на 35% больше заряда установленному суперу.|Blue sparks give your equipped super 35% more charge.
За каждую жёлтую монету начисляет 1 дополнительную искру.|Awards 1 extra spark for each yellow coin.
Опасный обгон добавляет уровень комбо и обновляет его таймер.|A near miss increases your combo by one and resets its timer.
Каждый пятый залп наносит на 2 ед. больше базового урона за попадание.|Every fifth volley adds 2 base damage per hit.
При выборе улучшения между секторами предлагает третий вариант.|Adds a third upgrade choice between sectors.
Даёт щит на старте каждого вылета. Щит держит одно попадание.|Starts each run with a shield that absorbs one hit.
Каждый третий опасный обгон замедляет угрозы на 1,2 секунды.|Every third near miss slows threats for 1.2 seconds.
Радиус взрыва детонирующих ядер увеличен со 135 до 195.|Increases the blast radius of explosive cores from 135 to 195.
Подобранные магниты, замедление, множители очков и усиления оружия действуют на 35% дольше.|Magnet, slow-motion, score multiplier and weapon pickups last 35% longer.
Модуль «АБЛЯЦИОННЫЙ ПАНЦИРЬ»|Module “ABLATIVE SHELL”
Модуль «ФАЗОВЫЙ ГАСИТЕЛЬ»|Module “PHASE DAMPER”
Модуль «ОСКОЛОЧНАЯ КУЗНЯ»|Module “SHRAPNEL FORGE”
Модуль «ЯДРО СТАЗИСА»|Module “STASIS CORE”
Модуль 1|Module 1
Модуль 2|Module 2
Супер|Super
В магазин|Back to shop
Лимит мощности|Power capacity
Куплено модулей и суперов|Modules and supers purchased
Свободно|Empty
Максимум|Maximum
ед.|power
Назад к кораблю|Back to ship
Выбор оборудования|Equipment selection
Откройте первый слот и купите модуль|Unlock the first slot and buy a module
Купите хотя бы один модуль|Buy at least one module
Сначала откройте первый слот|Unlock the first slot first
Слот закрыт|Slot locked
Открыть ·|Unlock ·
Купить ·|Buy ·
Открыть|Unlock
Купить|Buy
Снять|Remove
Установить|Equip
Контракт|Contract
Перегрузка! Улучшите лимит мощности или снимите оборудование.|Over capacity! Upgrade the reactor or remove equipment.
Уже установлен в другом слоте|Equipped in the other slot
Достигнут максимальный уровень|Maximum level reached
Пополните коллекцию модулей и суперов|Buy more modules or supers
Лимит увеличен на 10 ед.|Capacity increased by 10
Слот открыт|Slot unlocked
Добавлено в коллекцию|Added to collection
Установлено|Equipped
Снято|Removed
Собирайте синие искры. При 100% заряда супер срабатывает автоматически.|Collect blue sparks. Your super activates automatically at full charge.
Хроно-щит|Chrono Shield
ЭМИ-импульс|EMP Pulse
6 секунд форсажа. Удваивает очки и урон, притягивает искры и защищает корабль.|6 seconds of overdrive. Doubles score and damage, attracts sparks and protects the ship.
Ударная волна расчищает трассу, сбивает снаряды и поражает НЛО.|A shockwave clears the track, intercepts projectiles and hits UFOs.
Щит поглощает одно попадание. Угрозы замедляются на 5 секунд.|Absorbs one hit and slows threats for 5 seconds.
впритирку. Синие искры заряжают установленный супер.|up close. Blue sparks charge your equipped super.
ЗАРЯДИТЬ СУПЕР|CHARGE SUPER
ДРАЙВ:|DRIVE:
« ДРАЙВ ×2 »|« DRIVE ×2 »
Сначала установите супер в ангаре|Equip a super in the hangar first
Язык игры|Game language
Заставка Xpace|Xpace intro
Загрузка игры|Loading game
Пропустить заставку|Skip intro
СИНХРОНИЗАЦИЯ НЕОНОВОЙ СЕТИ|SYNCING THE NEON NETWORK
КАЛИБРОВКА ДВИГАТЕЛЕЙ|CALIBRATING ENGINES
ПОСТРОЕНИЕ НЕОНОВОЙ ТРАССЫ|BUILDING THE NEON TRACK
СИСТЕМА ГОТОВА · ПРИЯТНОГО ПОЛЁТА|SYSTEMS READY · ENJOY THE FLIGHT
КАНАЛ ОТКРЫТ · ДОБРО ПОЖАЛОВАТЬ, ПИЛОТ|CHANNEL OPEN · WELCOME, PILOT
ПРОПУСТИТЬ|SKIP
Жёлтые Искры|Yellow Sparks
Пилот|Pilot
Новичок Неона|Neon Rookie
Новичок Неона ▾|Neon Rookie ▾
Гость|Guest
ПРОФИЛЬ|PROFILE
ИГРОВОЙ ПРОФИЛЬ|PLAYER PROFILE
КАРТОЧКА ПИЛОТА|PILOT CARD
ПРОГРЕСС ПАССА (МАКС. 30)|PASS PROGRESS (MAX 30)
XPACE ПАСС|XPACE PASS
ПАСС|PASS
КВЕСТЫ|QUESTS
РЕЖИМ «ДРАЙВ» (3 КВЕСТА)|DRIVE MODE (3 QUESTS)
РЕЖИМ «ЗАЧИСТКА» (3 КВЕСТА)|CLEARANCE MODE (3 QUESTS)
РЕЖИМ «ЭКСПЕДИЦИЯ» (3 КВЕСТА)|EXPEDITION MODE (3 QUESTS)
⏳ Слот квеста перезаряжается|⏳ Quest slot on cooldown
ОЖИДАНИЕ|WAITING
НОВЫЙ КВЕСТ ЧЕРЕЗ:|NEXT QUEST IN:
ОПЫТ|XP
ИСКРЫ|SPARKS
ИСКРЫ ЗА ВЫЛЕТ|SPARKS EARNED
СТАТИСТИКА ПИЛОТА|PILOT STATS
РЕКОРДЫ ПО РЕЖИМАМ|MODE RECORDS
РЕКОРД|RECORD
РЕКОРД ДРАЙВ|DRIVE RECORD
РЕКОРД ЗАЧИСТКА|CLEARANCE RECORD
ВРЕМЯ|TIME
Обгонов|Near misses
Монет|Coins
Забегов|Runs
Счёт|Score
СЧЁТ|SCORE
ФОРСАЖ|OVERDRIVE
ФОРСАЖ:|OVERDRIVE:
Форсаж x2|Overdrive x2
ВКЛЮЧИТЬ ФОРСАЖ|ENGAGE OVERDRIVE
МАГНИТ:|MAGNET:
ХРОНО:|CHRONO:
ОЧКИ x2:|SCORE x2:
ОРУДИЯ: 6.0с|WEAPONS: 6.0s
СБОЙ: 4.5с|JAM: 4.5s
ЩИТ АКТИВЕН|SHIELD ACTIVE
ЛИДЕРЫ|LEADERS
ТАБЛИЦА ЛИДЕРОВ|LEADERBOARD
Загрузка рекордов...|Loading scores...
ОБНОВИТЬ ТОП-20|REFRESH TOP 20
ОТПРАВИТЬ РЕКОРД|SUBMIT SCORE
ДИАГНОСТИКА ▸|DIAGNOSTICS ▸
ДИАГНОСТИКА СЕТИ XPACE|XPACE NETWORK DIAGNOSTICS
СЕТЬ XPACE|XPACE NETWORK
СЕТЬ И УПРАВЛЕНИЕ|NETWORK AND CONTROLS
ПРОВЕРКА СЕТИ...|CHECKING NETWORK...
ПРОВЕРИТЬ|CHECK
Проверка...|Checking...
ОФЛАЙН · ЛОКАЛЬНЫЙ ПРОФИЛЬ|OFFLINE · LOCAL PROFILE
ОНЛАЙН · ТАБЛИЦА РЕКОРДОВ|ONLINE · LEADERBOARD
Публичный релей (рекорды)|Public leaderboard relay
Пилотов в сети сейчас|Pilots online
Облако Firebase|Firebase Cloud
Мой рекорд|My high score
Отправка рекорда|Score submission
Последняя синхронизация|Last sync
Ошибка канала|Connection error
РАБОТАЕТ|AVAILABLE
ПРОВЕРКА|CHECKING
НЕДОСТУПЕН|UNAVAILABLE
работает|available
не проверен|not checked
не настроен|not configured
ещё не отправлялся|not submitted yet
нет ответа|no response
нет|none
Проверяю онлайн-канал...|Checking the online connection...
● Локальный профиль готов|● Local profile ready
● Облако (Гостевой ID)|● Cloud (Guest ID)
Аккаунт синхронизирован|Account synced
Синхронизация недоступна. Прогресс сохранён на устройстве.|Sync is unavailable. Progress is saved on this device.
Экран|Screen
ЭКРАН|SCREEN
ПАУЗА|PAUSED
Системы корабля переведены в режим ожидания|Ship systems are on standby
▶ ВЕРНУТЬСЯ В ИГРУ|▶ RESUME GAME
▶ ИГРАТЬ СНОВА|▶ PLAY AGAIN
▶ ПРОДОЛЖИТЬ|▶ CONTINUE
НАЧАТЬ ЗАНОВО|RESTART
В ГЛАВНОЕ МЕНЮ|MAIN MENU
В МЕНЮ|MENU
◀ НАЗАД В МЕНЮ|◀ BACK TO MENU
ДРАЙВ|DRIVE
ЗАЧИСТКА|CLEARANCE
ЭКСПЕДИЦИЯ|EXPEDITION
КЛАССИКА|CLASSIC
ВЫБОР РЕЖИМА|MODE SELECT
ВЫБЕРИТЕ ПРОТОКОЛ ВЫЛЕТА|CHOOSE A FLIGHT PROTOCOL
Опасные обгоны|Near Misses
Скоростной слалом между лазерами, дронами и ЭМИ-минами. Делай|Slalom through lasers, drones and EMP mines at high speed. Chain
впритирку и включай|and engage
Корабль автоматически стреляет лазерами по метеоритам с разным|Your ship automatically fires at meteors with varying
. Взрывай|. Detonate
детонирующие ядра|volatile cores
, лови|, collect
баффы пушек|weapon buffs
и уворачивайся от|and dodge
дебаффов|debuffs
Чередуй слалом и бой. Между секторами выбирай улучшение или штраф. Каждый четвёртый сектор охраняет босс.|Alternate slalom and combat. Choose an upgrade or a penalty between sectors. A boss guards every fourth sector.
Выбери одно улучшение|Choose one upgrade
Выбери один штраф на следующий сектор|Choose one penalty for the next sector
Стабилизатор · комбо держится на 1,5 с дольше до конца вылета|Stabilizer · combos last 1.5s longer for this run
Удлинитель · форсаж длится на 2 с дольше до конца вылета|Extender · Overdrive lasts 2s longer for this run
Утечка энергии · скорость заряда супера −30%|Energy Leak · super charge rate −30%
Сбой комбо · длительность комбо −30%|Combo Jam · combo duration −30%
Натиск угроз · скорость угроз +15%|Threat Rush · threat speed +15%
Утечка энергии|Energy Leak
Сбой комбо|Combo Jam
Натиск угроз|Threat Rush
Завершить вылет|End run
Пушка · +1 к урону|Cannon · +1 damage
Охлаждение · +15% к темпу стрельбы|Cooling · +15% fire rate
Защита · щит на один удар|Defense · absorbs one hit
Магнит · притяжение монет и искр на 18 секунд|Magnet · attracts coins and sparks for 18 seconds
Хроно · замедление угроз на 8 секунд|Chrono · slows threats for 8 seconds
Реактор · ускорить заряд супера на 10%|Reactor · charges your super 10% faster
Множитель · двойные очки на 12 секунд|Multiplier · doubles score for 12 seconds
ПК:|PC:
стрелки / WASD,|arrows / WASD,
— пауза,|— pause,
— звук.|— sound.
Телефон:|Phone:
ведите пальцем по экрану для маневрирования.|drag to steer.
НАСТРОЙКИ|SETTINGS
ЗВУК И ЭКРАН|SOUND AND DISPLAY
Звук и синтвейв-музыка|Sound and synthwave music
Тряска экрана при взрывах|Screen shake on explosions
Полноэкранный режим|Fullscreen
ВКЛ|ON
ВЫКЛ|OFF
ОТКРЫТЬ|OPEN
ЗАКРЫТЬ|CLOSE
ПРОИЗВОДИТЕЛЬНОСТЬ (FPS)|PERFORMANCE (FPS)
АВТО|AUTO
АВТО В ДРАЙВЕ|AUTO IN DRIVE
ОБЫЧНЫЙ|NORMAL
МОЩНЫЙ|HIGH
КАСТОМНЫЙ|CUSTOM
СВОЙ FPS|CUSTOM FPS
Кадры/сек:|Frames/sec:
НИКНЕЙМ ПИЛОТА|PILOT NICKNAME
Введите никнейм (до 16 симв.)|Enter nickname (up to 16 chars)
СОХРАНИТЬ|SAVE
ОБЛАЧНЫЙ АККАУНТ XPACE|XPACE CLOUD ACCOUNT
Логин (3-16 симв.)|Username (3–16 chars)
Пароль (от 6 симв.)|Password (at least 6 chars)
Показать/скрыть пароль|Show or hide password
ВОЙТИ|SIGN IN
ВЫЙТИ|SIGN OUT
РЕГИСТРАЦИЯ|REGISTER
СИНХРОНИЗИРОВАТЬ|SYNC
КОД ПЕРЕНОСА (ОФЛАЙН)|TRANSFER CODE (OFFLINE)
СОЗДАТЬ КОД|GENERATE CODE
ЗАГРУЗИТЬ КОД|IMPORT CODE
Резервная копия|Backup
КОНТРАКТЫ|CONTRACTS
1 СЛОТ · ОДИН КОНТРАКТ ЗА РАЗ|1 SLOT · ONE CONTRACT AT A TIME
ВАШИ ИСКРЫ:|YOUR SPARKS:
ЗАБРАТЬ ВСЁ|CLAIM ALL
ВСЕ|ALL
В РАБОТЕ|ACTIVE
ГОТОВЫ|READY
СЛОЖНЫЕ|HARD
ПОЛУЧЕНО|CLAIMED
АКТИВНЫЙ КОНТРАКТ|ACTIVE CONTRACT
В РАБОТЕ:|ACTIVE:
1 контракт|1 contract
. Чтобы выбрать другой, сначала снимите текущий.|. Remove it before picking another.
Слот пуст. Возьмите в работу один контракт — прогресс пойдёт только по нему.|The slot is empty. Pick a contract to start tracking progress.
ГОТОВ К ЗАБОРУ|READY TO CLAIM
СЛОЖНЫЙ|HARD
СВОБОДЕН|EMPTY
ГОТОВ|READY
Снять контракт|Remove contract
СНЯТЬ ×|REMOVE ×
СЛОТ ЗАНЯТ|SLOT IN USE
ВЗЯТЬ В РАБОТУ|ACCEPT CONTRACT
Пока нет полученных контрактов.|No claimed contracts yet.
В этой категории пусто. Попробуйте другой фильтр.|Nothing here. Try another filter.
Можно взять только один контракт — сначала снимите текущий|Remove the active contract before accepting another
МАГАЗИН|SHOP
МАГАЗИН XPACE|XPACE SHOP
БАЛАНС ИСКР:|SPARK BALANCE:
КОРАБЛИ|SHIPS
Корабли|Ships
МОДУЛИ|MODULES
СЛЕДЫ|TRAILS
СТИЛЬ|STYLE
АКЦИИ|DEALS
Осталось|Ends in
АКЦИИ И БАНДЛЫ|DEALS AND BUNDLES
Скин корабля + титул + след + цвет профиля одним пакетом.|Ship skin, title, trail and profile color in one bundle.
Сейчас нет активных акций.|No deals are active.
АКЦИЯ|DEAL
АКЦИЯ · ЭКСКЛЮЗИВ|DEAL · EXCLUSIVE
ЭКСКЛЮЗИВ|EXCLUSIVE
В КОЛЛЕКЦИИ|OWNED
НА ИСКРЫ|FOR SPARKS
КУПИТЬ ·|BUY ·
КУПИТЬ|BUY
ВЫБРАН|EQUIPPED
АКТИВНО|EQUIPPED
АКТИВЕН|EQUIPPED
АКТИВНА|EQUIPPED
ВЫБРАТЬ|EQUIP
НАДЕТЬ|EQUIP
УСТАНОВИТЬ|INSTALL
УБРАТЬ|REMOVE
НЕ ВЫДАЁТСЯ|UNAVAILABLE
БАНДЛ|BUNDLE
СНЯТ|UNAVAILABLE
КОНТРАКТ|CONTRACT
ИЗ БАНДЛА|FROM BUNDLE
НУЖЕН СКИН|SKIN REQUIRED
НАГРАДА · 1 000 000|REWARD · 1,000,000
ЛИМИТ|LIMITED
ОТКРЫТ|UNLOCKED
КОЛЛЕКЦИЯ СЛЕДОВ|TRAIL COLLECTION
СЛЕДЫ СО СКИНОВ|SKIN TRAILS
СЛЕДЫ МАГАЗИНА|SHOP TRAILS
◀ ◀ СЛЕДЫ МАГАЗИНА|◀ ◀ SHOP TRAILS
Купленный скин навсегда открывает свой фирменный след — ставь его на ЛЮБОЙ корабль!|Owning a skin permanently unlocks its trail for any ship!
СЛЕД|TRAIL
СКИН|SKIN
ТИТУЛ|TITLE
ЦВЕТ ПРОФИЛЯ|PROFILE COLOR
РАМКА ПРОФИЛЯ|PROFILE FRAME
Стиль профиля|Profile style
БЕЗ РАМКИ|NO FRAME
Стандартное оформление выбранного цвета.|Standard trim for your selected profile color.
НЕОНОВЫЙ КОНТУР|NEON CIRCUIT
Бирюзовые дорожки и скошенные углы печатной платы.|Teal circuit traces with beveled corners.
ВИНИЛ-89|VINYL-89
Розовый неон и три тёплые полосы в стиле аркадных автоматов.|Pink neon and three warm stripes inspired by arcade cabinets.
ПОЛЯРНАЯ ДУГА|POLAR ARC
Мятные дуги с серебристыми кристаллами на углах.|Mint-colored arcs with silver crystals at the corners.
КРАСНЫЙ СЕКТОР|RED SECTOR
Бронепластины аварийного сектора с янтарными метками.|Emergency-sector armor plates with amber markings.
ЗОЛОТОЙ МЕРИДИАН|GOLD MERIDIAN
Двойная латунная окантовка с вырезами и ромбами в углах.|Double brass trim with notches and diamond-cut corners.
СИГНАЛ-77|SIGNAL-77
Радиомодуль в углу и бегущий импульс по шкале осциллографа.|A corner radio module and a pulse traveling across an oscilloscope trace.
СОТОВЫЙ ЩИТ|HONEYCOMB GUARD
Разомкнутый контур из гранёных бронесот на противоположных углах.|An open outline with faceted armor cells on opposite corners.
Рамка профиля снята.|Profile frame removed.
ЭФФЕКТ ПРОФИЛЯ|PROFILE EFFECT
ТИТУЛЫ ПРОФИЛЯ|PROFILE TITLES
Открыть профиль и титулы|Open profile and titles
Нажмите, чтобы выбрать или посмотреть титулы|View or choose a title
Титулы|Titles
Стили|Styles
Профили (Стили)|Profiles (Styles)
КОЛЛЕКЦИЯ|COLLECTION
КОЛЛЕКЦИЯ И ПОКУПКИ|COLLECTION AND PURCHASES
Предложение завершилось.|This offer has ended.
БАГРОВЫЙ РЕКВИЕМ|CRIMSON REQUIEM
ЭКСКЛЮЗИВ «42»|EXCLUSIVE “42”
ТОСТЕР АПОКАЛИПСИСА|APOCALYPSE TOASTER
НЛО «ЗЕТА-9»|UFO “ZETA-9”
КОСМО-КОТ NEKO|SPACE CAT NEKO
ФАНТОМ 404|PHANTOM 404
КАССЕТА 1989|CASSETTE 1989
НЕО-ДРАКОН|NEO DRAGON
ВАЛЬКИРИЯ X-9|VALKYRIE X-9
НОЧНАЯ ЛАСТОЧКА|NIGHT SWALLOW
СТАЛЬНОЙ АТЛАС|IRON ATLAS
СОЛНЕЧНАЯ ИГЛА|SUN NEEDLE
НЕОН-КИЦУНЭ|NEON KITSUNE
БАТИСКАФ «ЛИМАН»|LIMAN BATHYSCAPHE
ОРИГАМИ «ЖУРАВЛЬ»|ORIGAMI CRANE
Именная награда за 1 000 000 очков. Саркофаг из багрового обсидиана, живые цепи и красные кости вместо лазеров. Выдача навсегда закрыта — гроб остался только у прежних владельцев.|A reward for scoring 1,000,000 points. A crimson obsidian coffin with living chains and red bone projectiles. Only previous owners can equip it.
Сбалансированный перехватчик с бирюзовым плазменным следом.|A balanced interceptor with a turquoise plasma trail.
Лимитированный шуточный скин: вместо корабля летит просто голова Пятёрки со следом «42»!|A limited joke skin that replaces your ship with Pyatyorka’s head and a “42” trail!
Биомеханическая манта с гибкими плавниками и полупрозрачным панцирем.|A biomechanical manta with flexible fins and a translucent shell.
Медный штурмовик с разнесёнными гондолами и пульсирующими соплами.|A copper assault ship with wide-set nacelles and pulsing thrusters.
Асимметричная капсула с лиловым ядром и подвижной хвостовой пластиной.|An asymmetric capsule with a violet core and an articulated tail plate.
Агрессивный кибер-истребитель с неоново-розовым форсажем.|An aggressive cyber fighter with neon-pink overdrive.
Солнечный крейсер, оставляющий за собой золотую комету.|A solar cruiser that leaves a golden comet in its wake.
Матричный стелс-корпус из глубины киберсети.|A stealth craft from the depths of the cybernet.
Аристократический флагман с золотым ядром и фиолетовым шлейфом.|An aristocratic flagship with a gold core and a violet trail.
Двухслотовый крейсер в мятной эмали. В форсаже рычаг опускается, а тосты подпрыгивают над раскалёнными турбинами.|A mint-enamel cruiser with twin slots. In overdrive, its lever drops and toast springs up above red-hot turbines.
Летающая тарелка с энергетическим куполом, орбитальными огнями и грави-лучом.|A flying saucer with an energy dome, orbiting lights and a gravity beam.
Космическая капсула с ушками, янтарными глазами и хвостом. В форсаже кот поднимает лапы, как манэки-нэко.|A space capsule with ears, amber eyes and a tail. In overdrive, the cat raises its paws like a maneki-neko.
Полупрозрачный спектральный дух киберсети с неоновым нимбом и шлейфом.|A translucent cybernet specter with a neon halo and trail.
Ретро-кассета с прозрачным окном, магнитной лентой и вращающимися бобинами.|A retro cassette with a clear window, magnetic tape and spinning reels.
Лакированный дракон с костяными рогами, нефритовыми глазами и гибким хвостом. В форсаже расправляет перепончатые крылья.|A lacquered dragon with bone horns, jade eyes and a flexible tail. It unfolds membrane wings in overdrive.
Плавный биоморфный перехватчик с живым сиянием и парящими энергетическими крыльями.|A biomorphic interceptor with living light and floating energy wings.
Инопланетный кристалл-цветок с подвижными лепестками и ядром чистой энергии.|An alien crystal flower with moving petals and a core of pure energy.
Бронированный космический самурай с клинковыми крыльями и бирюзовым визором.|An armored space samurai with blade wings and a turquoise visor.
Голографический серафим из огранённого света с переливающимися кристаллическими гранями.|A holographic seraph made of faceted light and shimmering crystal.
Имперский флагман с коронным носом, разнесёнными золотыми двигателями и вращающейся оправой рубинового реактора.|An imperial flagship with a crowned prow, twin gold engines and a rotating mount around its ruby reactor.
Легендарный небесный перехватчик за контракт «Убийца Левиафанов»: 3 яруса плазменных крыльев, золотой венец и шлейф световых перьев!|A legendary interceptor earned in the Leviathan Slayer contract, with three tiers of plasma wings, a gold crown and a trail of light feathers.
Птица-разведчик со стреловидными крыльями и раздвоенным хвостом.|A scout bird with swept wings and a forked tail.
Летающий тягач со стальными гусеничными блоками и открытым реактором.|A flying tug with steel track assemblies and an exposed reactor.
Узкий золотой зонд с вращающимся кольцом вокруг корпуса.|A slim golden probe with a spinning ring around its hull.
Эксклюзив бандла «НЕОН-КИЦУНЭ»: истребитель в форме лисы с ушами-килями и двумя плазменными хвостами.|A Neon Kitsune bundle exclusive. A fox-shaped fighter with ear-shaped fins and twin plasma tails.
Призрачный корабль из чистого эфира: полупрозрачный корпус с пульсирующим звёздным ядром и орбитальным нимбом.|A ghost ship made of ether, with a translucent hull, pulsing stellar core and orbiting halo.
Тяжёлый корабль для полётов над лавовыми полями. Керамическая броня, трафарет V7 и сдвоенные сопла, за которыми тянется след из раскалённого шлака.|A heavy ship for flying over lava fields. Ceramic armor, a stenciled V7 and twin thrusters leaving a trail of molten slag.
Глубоководный аппарат с латунным корпусом и толстым иллюминатором. В форсаже разводит поплавки и включает эхолот.|A deep-sea craft with a brass hull and thick porthole. In overdrive, its floats spread and its sonar powers on.
Журавль с крыльями из сложенной бумаги, индиговыми гранями и коралловым гребнем. Форсаж раскрывает нижний слой крыльев.|A paper crane with indigo folds and a coral crest. Overdrive unfolds a second layer of wings.
Эксклюзивный предмет. Сейчас его бандл недоступен.|Exclusive item. Its bundle is currently unavailable.
БОНУС ДНЯ|DAILY BONUS
БОНУС ПАССА|PASS BONUS
НАГРАДА|REWARD
ЗАБРАТЬ!|CLAIM!
ФИНАЛ ПАССА|PASS FINALE
УР.|LVL
УР. 30 ФИНАЛ|LVL 30 FINALE
УР. 30 · БОНУС|LVL 30 · BONUS
ПОСЛЕ 30 УР.|AFTER LEVEL 30
ТИТУЛ:|TITLE:
«Дитя 18 века»|“Child of the 18th Century”
ЕЖЕДНЕВНЫЙ ДАР|DAILY GIFT
Заходите каждый день за новыми наградами! Пропуск 1 дня сбрасывает серию.|Return daily for a new reward. Missing a day resets the streak.
ЗАБРАТЬ НАГРАДУ|CLAIM REWARD
ДОСТУПНО!|READY!
Вы пропустили день — серия сброшена! Начните заново с Дня 1.|You missed a day. Your streak restarts at day 1.
Вечный Пилот · ПОЛУЧЕНО|Eternal Pilot · UNLOCKED
Первый вылет|First Flight
Мастер дрифта|Drift Master
Охотник на астероиды|Asteroid Hunter
Золотая лихорадка|Gold Rush
Ветеран Xpace|Xpace Veteran
Легенда скорости|Speed Legend
Ночная смена|Night Shift
Пульс города|City Pulse
Неоновый каскадёр|Neon Stunt Pilot
За гранью скорости|Beyond Speed
Первый трофей|First Trophy
Космический демонтаж|Space Demolition
Золотой маршрут|Golden Route
Хроники гиперпространства|Hyperspace Chronicles
Вне пределов|Beyond Limits
Железный пилот|Iron Pilot
Повелитель лезвий|Blade Master
Разрушитель планет|Planet Breaker
Убийца Левиафанов|Leviathan Slayer
Сквозь неон|Through the Neon
Тяжёлая зачистка|Heavy Clearance
На линии солнца|On the Sunline
Охотник джунглей 1989|Jungle Hunter 1989
Абсолют Xpace|Xpace Absolute
Модуль «ХРОНО-ЯДРО X1»|Module “CHRONO CORE X1”
Модуль «ПРИЗМА ПУСТОТЫ»|Module “VOID PRISM”
Модуль «АННИГИЛЯТОР Z-42»|Module “ANNIHILATOR Z-42”
Модуль «РЕАКТОР СВЕРХНОВОЙ»|Module “SUPERNOVA REACTOR”
Скин «ВАЛЬКИРИЯ X-9»|Skin “VALKYRIE X-9”
Скин «НОЧНАЯ ЛАСТОЧКА»|Skin “NIGHT SWALLOW”
Скин «СТАЛЬНОЙ АТЛАС»|Skin “IRON ATLAS”
Скин «СОЛНЕЧНАЯ ИГЛА»|Skin “SUN NEEDLE”
Стиль «ЛЕОПАРД 1989»|Style “LEOPARD 1989”
Сыграть 1 забег при активном контракте.|Play 1 run with this contract active.
Победить 1 Босса в любом режиме.|Defeat 1 boss in any mode.
Сложный контракт: победить 3 Боссов в любом режиме!|Hard contract: defeat 3 bosses in any mode!
Сложный контракт: собрать 75 жёлтых монет за серию вылетов.|Hard contract: collect 75 yellow coins across runs.
Загрузка глобального рейтинга...|Loading global leaderboard...
ЛОКАЛЬНЫЕ ДАННЫЕ|LOCAL DATA
(Вы)|(You)
Ваш рекорд|Your record
Ловец Искр|Spark Hunter
Призрак Трассы|Track Phantom
Повелитель Дрифта|Drift Lord
Дитя 18 века|Child of the 18th Century
Вечный Пилот|Eternal Pilot
42 БРАТУХА|42 BROTHER
Благословение Кицунэ|Kitsune's Blessing
Базовый титул пилота неоновой трассы.|The starting title for pilots of the neon track.
Накопить 250 Жёлтых Искр на балансе.|Hold 250 yellow sparks in your balance.
Совершить 25 опасных обгонов (впритирку к лазерам).|Make 25 near misses by skimming past lasers.
Установить рекорд 2 500 очков за один забег.|Set a record of 2,500 points in one run.
Эксклюзивная награда за прохождение конца НЕОН ПАССА (30 уровень).|Exclusive reward for reaching level 30 of the Neon Pass.
Эксклюзив бандла «НЕОН-КИЦУНЭ» — получить можно только во вкладке АКЦИИ магазина.|A Neon Kitsune bundle exclusive. Find it under Deals in the shop.
ЗАКРЫТО|LOCKED
НАДЕТО|EQUIPPED
НАДЕТЬ И О ТИТУЛЕ|EQUIP AND VIEW TITLE
ИНФОРМАЦИЯ О ТИТУЛЕ|TITLE INFORMATION
ДОСЬЕ ТИТУЛА:|TITLE DOSSIER:
Редкость:|Rarity:
Как выбит:|How to unlock:
Легендарный секретный (0.42%)|Legendary secret (0.42%)
Срабатывает каждые 4 242 очков в любом режиме игры.|Triggers every 4,242 points in any mode.
Навсегда закреплён за вашим профилем и виден всем пилотам в Топ-20!|Permanently attached to your profile and visible on the Top 20 leaderboard.
СИСТЕМНЫЙ ПЕРЕХВАТ · ШАНС 0.42%|SYSTEM INTERCEPT · 0.42% CHANCE
АКТИВИРОВАН СЕКРЕТНЫЙ ПРОТОКОЛ!|SECRET PROTOCOL ACTIVATED!
Невероятная удача! На отметке|Incredible luck! At
очков сработал легендарный шанс|points, you hit the legendary odds
КИБЕР-СТАНДАРТ|CYBER STANDARD
ЗАКАТ 1989|SUNSET 1989
ЗОЛОТОЙ СИНДИКАТ|GOLD SYNDICATE
МАТРИЦА ПРИЗРАКА|GHOST MATRIX
КВАНТОВАЯ ПУСТОТА|QUANTUM VOID
ИМПЕРАТОР XVIII ВЕКА|18TH-CENTURY EMPEROR
ХРОМ 2077|CHROME 2077
САКУРА НЕОН|NEON SAKURA
КРОВАВАЯ ЛУНА|BLOOD MOON
БАГРОВЫЙ СЕКТОР|CRIMSON SECTOR
КОБАЛЬТОВАЯ НОЧЬ|COBALT NIGHT
МЕДНЫЙ КОНТУР|COPPER OUTLINE
8-БИТ ПИКСЕЛЬ|8-BIT PIXEL
ЖИДКОЕ ЗОЛОТО|LIQUID GOLD
ЛЕОПАРД 1989|LEOPARD 1989
КИБЕР-САМУРАЙ|CYBER SAMURAI
ЯДЕРНЫЙ РАССВЕТ|NUCLEAR DAWN
БЕЗДНА 42|ABYSS 42
ХРАМ КИЦУНЭ|KITSUNE SHRINE
СИНТВЕЙВ СТАРТ|SYNTHWAVE STARTER
СИНТВЕЙВ ДУО|SYNTHWAVE DUO
Бирюзовая плазма|Turquoise plasma
Багровая процессия|Crimson procession
Встроенная надпись «42»|Built-in “42” print
Ионные кольца|Ion rings
Двойной разряд|Double discharge
Кометный вихрь|Comet vortex
Малиновые ромбы|Crimson diamonds
Золотые звёзды|Golden stars
Матричный код 0/1|Binary matrix
Королевское золото|Royal gold
Горячие ломтики тоста|Hot toast slices
Гравитационные кольца|Gravity rings
Кошачьи лапки|Cat paws
Призрачная эктоплазма|Ghostly ectoplasm
Магнитная лента VHS|VHS magnetic tape
Огонь дракона|Dragon fire
Ленты северного сияния|Aurora ribbons
Лепестки фиолетовой пустоты|Violet void petals
Разрезы цифровой катаны|Digital katana slashes
Радужные осколки|Iridescent shards
Звёздная пыль чистого золота|Pure gold stardust
Крылья Валькирии|Valkyrie wings
Лазурные перья|Azure feathers
Реакторные звенья|Reactor links
Солнечные дуги|Solar arcs
Лисий огонь кицунэ|Kitsune foxfire
Звёздная пыль астрала|Astral stardust
Пепел и шлак|Ash and slag
Импульсы эхолота|Sonar pulses
Бумажные сгибы|Paper folds
КРИОСКАТ|CRYORAY
Криошлейф|Cryo wake
Титановый перехватчик с подвижными крыльями и ледяными зарядами. Любой супер раскладывает криолезвия.|A titanium interceptor with moving wings and ice rounds. Any super deploys its cryo blades.
ЧЁРНОЕ СОЛНЦЕ|BLACK SUN
След затмения|Eclipse wake
Обсидиановый флагман с плавающими бронеплитами и зарядами-затмениями. Любой супер раскрывает двойную корону.|An obsidian flagship with floating armor and eclipse rounds. Any super unfurls its double corona.
Элитное золотое оформление с янтарным сиянием.|Elite gold styling with an amber glow.
Изумрудно-лаймовый стелс-контур киберсети.|An emerald-and-lime stealth outline from the cybernet.
Фиолетовая аура глубокого космоса с пульсирующими орбитами.|A violet deep-space aura with pulsing orbits.
Королевское барочное оформление из пурпура и золота!|A royal baroque look in purple and gold!
Холодный блик скользит по зеркальному хрому.|Cool light sweeps across mirror chrome.
Розовые лепестки сакуры медленно дрейфуют в неоне Токио-2099.|Pink cherry blossom petals drift through the neon of Tokyo 2099.
Багровое затмение и шёпот мёртвых пилотов на орбите.|A crimson eclipse and whispers of lost pilots in orbit.
Тёмно-красный градиент с тёплой подсветкой по краю.|A dark red gradient with warm edge lighting.
Глубокий синий фон с холодной голубой рамкой.|A deep blue backdrop with a cool blue border.
Тёмный бронзовый фон с подсветкой цвета меди.|A dark bronze backdrop with copper lighting.
Полосатый аркадный автомат 1987 года. INSERT COIN.|A striped 1987 arcade cabinet. INSERT COIN.
Расплавленное золото, текущее по контуру профиля.|Molten gold flowing around the profile.
Хищный леопардовый окрас в духе ретро-аркад 80-х.|A fierce leopard print inspired by '80s arcades.
Багровый клинок Нео-Киото с золотой окантовкой.|A crimson Neo-Kyoto blade edged in gold.
Кислотно-изумрудное излучение реактора с бирюзовым огнём.|An acid-green reactor glow with turquoise fire.
Трёхцветный кибер-контур для избранных мастеров Xpace.|A three-color cyber outline for Xpace masters.
Эксклюзив бандла «НЕОН-КИЦУНЭ»: розовое свечение неоновых храмов и бирюзовый лисий огонь.|A Neon Kitsune exclusive with pink temple lights and turquoise foxfire.
Стартовый заряд Искр и опыта|A starting boost of sparks and XP
Ускорение XPACE Пасса|Xpace Pass boost
Запас Жёлтых Искр для магазина|A reserve of yellow sparks for the shop
Двойной рывок по уровням Пасса|A double boost through Pass levels
Бонус за пять дней подряд|Five-day streak bonus
Недельный бонус ветерана|Veteran's weekly bonus
Предфинальный кибер-сейф|The last vault before the finale
Половина цикла|Halfway through the cycle
Начало второй половины|Start of the second half
Бонус за пятнадцать дней подряд|Fifteen-day streak bonus
Финал цикла|Cycle finale
СТИЛЬ «ЗАКАТ 1989»|STYLE “SUNSET 1989”
СТИЛЬ «ЗОЛОТОЙ СИНДИКАТ»|STYLE “GOLD SYNDICATE”
КИСЛОТНЫЙ НЕОН|ACID NEON
Искр|sparks
Искр)!|sparks)!
Искры|Sparks
Модули|Modules
Следы|Trails
СЛЕДЫ СО СКИНОВ ▶ ▶|SKIN TRAILS ▶ ▶
КОЛЛЕКЦИЯ СЛЕДОВ ▶ ▶|TRAIL COLLECTION ▶ ▶
Плазма|Plasma
БАЗОВОЕ ЯДРО|BASE CORE
Стандартная конфигурация систем корабля без модификаторов.|Standard ship systems with no modifiers.
НЕЙРО-ЧИП «ОМЕГА»|OMEGA NEUROCHIP
Тактический сопроцессор: +20% ко всем получаемым очкам в обоих режимах.|Tactical coprocessor: +20% to all points earned in both modes.
ПЛАЗМЕННЫЙ КАТАЛИЗАТОР|PLASMA CATALYST
Разогнанная матрица орудий: +1 к урону каждого лазерного выстрела в режиме «Зачистка»!|Overclocked weapon matrix: +1 damage per laser shot in Clearance!
ГИПЕР-ТУРБИНА «ВЕКТОР»|VECTOR HYPERTURBINE
Ускоритель плазменной тяги: +25% к скорости заряда супера!|Plasma thrust accelerator: Your super charges 25% faster!
КВАНТОВЫЙ СКАНЕР «ЭХО»|ECHO QUANTUM SCANNER
Глубинный анализатор спектра: +10 XP дополнительно за каждую редкую жёлтую монету!|Deep-spectrum analyzer: +10 XP per rare yellow coin!
ХРОНО-ЯДРО X1|CHRONO CORE X1
Эксклюзив за контракт «Железный пилот»: +35% к длительности всех бонусов и +1.2 сек к комбо!|Iron Pilot contract reward: +35% power-up duration and +1.2s combo time!
ПРИЗМА ПУСТОТЫ|VOID PRISM
Эксклюзив за контракт «Повелитель лезвий»: +120 к радиусу магнита и +25% ко всем очкам!|Blade Master contract reward: +120 magnet radius and +25% to all points!
АННИГИЛЯТОР Z-42|ANNIHILATOR Z-42
Эксклюзив за контракт «Разрушитель планет»: +2 к урону лазеров и старт каждого забега со Щитом!|Planet Breaker contract reward: +2 laser damage and a shield at the start of each run!
РЕАКТОР СВЕРХНОВОЙ|SUPERNOVA REACTOR
Эксклюзив за контракт «Абсолют Xpace»: заряд супера быстрее на 40%, а монеты дают +15 XP и +1|Xpace Absolute contract reward: Your super charges 40% faster, and coins grant +15 XP and +1
ГРАВИ-ПУЛЬСАР «КВАЗАР»|QUASAR GRAVITY PULSAR
Гравитационная линза: +90 к радиусу притяжения Искр и +15% ко всем получаемым очкам!|Gravity lens: +90 spark attraction radius and +15% to all points earned!
ЭГИДА-МАТРИЦА «БАСТИОН»|BASTION AEGIS MATRIX
Защитный энергоконтур: старт каждого вылета со Щитом и +25% к длительности всех бонусов!|Defensive energy circuit: start each run with a shield and gain +25% power-up duration!
ФОТОННЫЙ РАСЩЕПИТЕЛЬ|PHOTON SPLITTER
Квантовый усилитель стволов: +1 к урону лазеров в «Зачистке», +20% к заряду супера и +0.8с к комбо!|Quantum weapon booster: +1 laser damage in Clearance, +20% super charge rate and +0.8s combo time!
GOLD-ПРОТОКОЛ «МИДАС»|MIDAS GOLD PROTOCOL
Алгоритм обогащения: каждая золотая монета приносит +2|Enrichment algorithm: each gold coin grants +2
Искры, +20 XP и +15% к очкам!|sparks, +20 XP and +15% to score!
СИНТ-ОВЕРКЛОК «1989»|1989 SYNTH OVERCLOCK
Разгон процессора VHS: +30% к очкам, +1.5 сек к удержанию комбо и +30% к скорости заряда супера!|VHS processor overclock: +30% score, +1.5s combo time and +30% super charge rate!
ЯДРО СИНГУЛЯРНОСТИ «АБСОЛЮТ»|ABSOLUTE SINGULARITY CORE
Топовый гибридный реактор: старт со Щитом, +35% к очкам, +2 к урону лазеров, +100 к магниту и +1|Hybrid reactor: start with a shield and gain +35% score, +2 laser damage, +100 magnet radius and +1
за монету!|per coin!
НЕЙРО-ЛИНЗА «ОРАКУЛ»|ORACLE NEURO LENS
Предиктивный сопроцессор: +25% ко всем получаемым очкам в обоих режимах!|Predictive coprocessor: +25% to all points earned in both modes!
КРИО-ГЕНЕРАТОР «ИНЕЙ»|FROST CRYO GENERATOR
Защитная крио-система: старт каждого вылета со Щитом и +15% к длительности всех бонусов!|Defensive cryo system: start each run with a shield and gain +15% power-up duration!
ФАНТОМ-МОДУЛЬ «ТЕНЬ»|SHADOW PHANTOM MODULE
Призрачный ускоритель: +35% к скорости заряда супера!|Phantom accelerator: Your super charges 35% faster!
СТАНДАРТНЫЙ СЛЕД|DEFAULT TRAIL
Фирменный след выбранного корабля.|The equipped ship’s signature trail.
Бирюзовая и розовая ленты переплетаются вокруг полосатого солнца.|Turquoise and pink ribbons weave around a striped sunset.
Лаймовые разряды рассыпаются на искры и пузырьки.|Lime-green discharges scatter into sparks and bubbles.
БАГРОВЫЙ ИМПУЛЬС|CRIMSON PULSE
Малиновый шлейф расходится резкими волнами, как на кардиограмме.|Crimson exhaust pulses in waves that look like an ECG trace.
РАДУЖНЫЙ РАЗЛОМ|RAINBOW RIFT
Белые вспышки прорезают шлейф, а края разлома переливаются всеми цветами.|White flashes cut through the wake as the edges of the rift shift through the spectrum.
ГЛИТЧ VHS|VHS GLITCH
Ломаный цифровой след с артефактами и сдвигами строк.|A broken digital trail with artifacts and shifted scanlines.
ПИКСЕЛЬНЫЙ ХВОСТ|PIXEL TRAIL
Фигуры из аркадных пикселей рассыпаются на мелкие блоки.|Arcade pixel shapes break apart into tiny blocks.
НЕО-СЕРДЦЕ|NEO HEART
Светящиеся неоновые сердечки, плавно тающие в кильватере.|Glowing neon hearts that fade in your wake.
ЧЁРНАЯ ДЫРА|BLACK HOLE
Тёмные ядра расширяются, пока вокруг них расходятся фиолетовые орбиты.|Dark cores expand as violet orbits unfurl around them.
ЛЕОПАРД «42»|LEOPARD “42”
Плавный сияющий золотисто-леопардовый шлейф с мягким неоновым свечением и числами «42».|A flowing gold leopard-print trail with a soft neon glow and “42” markers.
НЕОН-БИНАРЬ|NEON BINARY
Падающие символы 0 и 1: след в духе кибер-кода, мигающий изумрудно-бирюзовыми цифрами.|Falling 0s and 1s flash in emerald and turquoise, leaving a trail of cyber code.
КРИО-ИНЕЙ|CRYO FROST
Ледяные снежинки-кристаллы, оседающие за кораблём с лёгкой бирюзовой метелью.|Ice crystals drift behind the ship in a light turquoise flurry.
Эксклюзивный след награды за миллион. Выдача закрыта — след остался только у прежних владельцев скина.|Exclusive million-point reward trail. Available to existing skin owners only.
Продажа эксклюзивного скина «42» завершилась 30 ноября.|The exclusive “42” skin sale ended on November 30.
Базовая неоново-бирюзовая рамка пилота.|The standard neon-turquoise pilot frame.
Неоново-малиновый градиент с бирюзовой 3D-тенью.|A neon-crimson gradient with a turquoise 3D shadow.
Классика неоновой трассы одним пакетом|Neon track classics in one bundle
Все предметы этого бандла продаются и по отдельности — но вместе заметно дешевле. Титул «Ловец Искр» также открывается за 250 Искр на балансе.|Save by bundling items you can also buy separately. The Spark Hunter title also unlocks when you hold 250 sparks.
Дух-лиса неоновых храмов спустился на трассу|The fox spirit from the neon shrines has come to the track
Все 4 предмета — эксклюзивы бандла: скин, след, титул и цвет профиля нельзя получить никаким другим способом. Только покупка бандла.|All four items are exclusive to this bundle: the skin, trail, title and profile color.
Полный экран|Fullscreen
Выйти из полного экрана|Exit fullscreen
Полноэкранный режим включён|Fullscreen enabled
Браузер не поддерживает программный полный экран|Your browser does not support switching to fullscreen from the game
Откройте страницу напрямую для полноэкранного режима|Open the game page directly to use fullscreen
Звук|Sound
Пауза|Pause
Настройки|Settings
Настройки игры и аккаунта|Game and account settings
Настройки аккаунта и звука|Account and sound settings
Проверить онлайн и открыть диагностику сети|Check online status and open network diagnostics
Серия ежедневных входов подряд|Daily login streak
Серия огня|Fire streak
Цель сектора|Sector objective
Изменить оформление профиля|Change profile style
Закрыть|Close
Онлайн-режим работает без регистрации: рекорды уходят в публичный релей XPACE. Профиль и покупки всегда сохраняются локально на устройстве.|Online play works without an account. High scores are submitted to the public Xpace relay. Your profile and purchases are always saved on this device.
Статус:|Status:
пилот|pilot
ПИЛОТ|PILOT
ПИЛОТА|PILOTS
ПИЛОТОВ|PILOTS
· ЛОКАЛЬНЫЕ ДАННЫЕ|· LOCAL DATA
ошибка|error
нет связи|no connection
Сначала войдите в облачный аккаунт XPACE!|Sign in to your Xpace cloud account first!
Логин должен быть от 3 символов (латиница, цифры, _ . -)|Use at least 3 characters: Latin letters, digits, underscores, dots or hyphens
Пароль должен содержать минимум 6 символов!|Use a password with at least 6 characters!
Создаём аккаунт...|Creating account...
Этот логин уже занят! Нажмите «ВОЙТИ».|That username is taken. Select SIGN IN.
Введите логин и пароль!|Enter your username and password!
Проверяем аккаунт...|Checking account...
Вы вышли из аккаунта (активен гостевой профиль).|Signed out. The guest profile is now active.
Тестовые рекорды остаются в профиле разработчика.|Test scores stay in the developer profile.
Сначала установите рекорд в забеге!|Set a high score in a run first!
Рекорды отправлены в таблицу лидеров!|High scores submitted to the leaderboard!
Звук и музыка выключены|Sound and music off
Звук и музыка включены|Sound and music on
Тряска экрана включена|Screen shake on
Тряска экрана выключена|Screen shake off
Обычный режим: авто в Драйве, 60 FPS в Зачистке|Normal mode: Auto in Drive, 60 FPS in Clearance
Режим производительности: Мощный (120 FPS)|Performance mode: High (120 FPS)
Код переноса создан и скопирован в буфер!|Transfer code created and copied to the clipboard!
Код переноса создан — скопируйте его из поля!|Transfer code created. Copy it from the field.
Вставьте код переноса в поле выше!|Paste your transfer code into the field above!
Сохранение успешно восстановлено из кода!|Save restored from the transfer code!
Неверный или повреждённый код переноса!|Invalid or damaged transfer code!
Контракт снят со слота|Contract removed
Нет готовых наград — сначала выполните контракты|Complete a contract to unlock a reward
в меню контрактов|in the Contracts menu
Новый квест доступен в НЕОН ПАССЕ!|New quest available in the Neon Pass!
Введите никнейм от 1 до 16 символов|Enter a nickname between 1 and 16 characters
Сектор|Sector
Босс|Boss
Следом · Сектор босса|Next · Boss sector
Рекомендуется|Recommended
Собери припасы|Collect supplies
Активируй супер|Activate your super
Взорви детонирующие ядра|Detonate explosive cores
Прокладка маршрута|Chart the Route
Охота на стражей|Guardian Hunt
Глубокий рейд|Deep Raid
Пройти 6 секторов «Экспедиции» за один или несколько вылетов.|Clear 6 Expedition sectors across one or more runs.
Победить 3 боссов «Экспедиции» за один или несколько вылетов.|Defeat 3 Expedition bosses across one or more runs.
Пройти 8 секторов «Экспедиции» за один вылет.|Clear 8 Expedition sectors in a single run.
Драйв|Drive
Зачистка|Clearance
Продержись в полёте|Stay in flight
Собери синие искры|Collect blue sparks
Подбери золотые монеты|Collect gold coins
Набери очки|Earn points
Выполни опасные обгоны|Make near misses
Разрушь астероиды|Destroy asteroids
Победи босса|Defeat the boss
СКОРОСТРЕЛ|RAPID FIRE
ТРОЙНОЙ ЛУЧ|TRIPLE BEAM
ПЛАЗМА x2|PLASMA x2
ОРУДИЯ|WEAPONS
ТЯЖЕСТЬ|HEAVY CONTROLS
ПЕРЕГРЕВ|OVERHEAT
РАЗБРОС|SPREAD
СБОЙ|JAM
« ФОРСАЖ x2 АКТИВЕН »|« OVERDRIVE x2 ACTIVE »
ФОРСАЖ ЗАВЕРШЁН|OVERDRIVE ENDED
ЩИТ ОТБИЛ ЗАРЯД!|SHIELD BLOCKED THE SHOT!
ЩИТ ОТБИЛ ЛУЧ!|SHIELD BLOCKED THE BEAM!
ЩИТ СПАС!|SHIELD SAVED YOU!
ЩИТ РАЗБИЛ КАМЕНЬ!|SHIELD SHATTERED THE ROCK!
ЩИТ СБИЛ НЛО!|SHIELD TOOK DOWN A UFO!
ЩИТ ОТБИЛ ВЫСТРЕЛ!|SHIELD DEFLECTED THE SHOT!
[ ЭНЕРГО-ЩИТ ]|[ ENERGY SHIELD ]
[ МАГНИТ ИСКР ]|[ SPARK MAGNET ]
[ ХРОНО-СДВИГ ]|[ CHRONO SHIFT ]
[ ОЧКИ x2 НА 9с ]|[ SCORE x2 FOR 9s ]
[ СКОРОСТРЕЛ x2 ]|[ RAPID FIRE x2 ]
[ ТРОЙНОЙ ЛУЧ ]|[ TRIPLE BEAM ]
[ ПЛАЗМА x2 ]|[ PLASMA x2 ]
БАФФ ОРУЖИЯ!|WEAPON BOOST!
ФОРСАЖ СЖЁГ ДЕБАФФ!|OVERDRIVE CLEARED THE DEBUFF!
[ СБОЙ: ТЯЖЕСТЬ ]|[ JAM: HEAVY CONTROLS ]
[ СБОЙ: ПЕРЕГРЕВ ]|[ JAM: OVERHEAT ]
[ СБОЙ: РАЗБРОС ]|[ JAM: SPREAD ]
ДЕБАФФ!|DEBUFF!
ЗАЛП В БОССА!|VOLLEY AT THE BOSS!
ФИОЛЕТ. ИСКРА|PURPLE SPARK
ЮНКЕР-ОВЕРЛОРД|JUNKER OVERLORD
АРХИТЕКТОР РОЯ|SWARM ARCHITECT
БОСС: ЛОВИ ФИОЛЕТОВЫЕ ИСКРЫ!|BOSS: COLLECT PURPLE SPARKS!
ЛОВИ ФИОЛЕТОВЫЕ ИСКРЫ!|COLLECT PURPLE SPARKS!
ВРАЖЕСКОЕ НЛО!|ENEMY UFO!
ВНИМАНИЕ: ПРИБЛИЖАЕТСЯ МЕГА-АСТЕРОИД!|WARNING: MEGA ASTEROID INCOMING!
ДЕТОНАЦИЯ ЯДРА!|CORE DETONATION!
Панель разработчика|Developer panel
DEV ПАНЕЛЬ|DEV PANEL
DEV КОНСОЛЬ|DEV CONSOLE
Введите код доступа разработчика, чтобы открыть выдачу искр, уровней пасса, скинов и тест-аккаунт.|Enter the developer access code to grant Sparks, Pass levels and skins, or open the test account.
Код разработчика...|Developer code...
Подсказка: ваш фирменный код из 4 цифр|Hint: your four-digit code
ЗАЩИТА ТОПА: Текущий профиль скрыт из Топ-20|LEADERBOARD PROTECTION: CURRENT PROFILE HIDDEN FROM TOP 20
1. ТЕСТ-АККАУНТ (БЕЗ ПОПАДАНИЯ В ТОП)|1. TEST ACCOUNT (EXCLUDED FROM LEADERBOARD)
ТЕСТ-АККАУНТ (@dev_xpace)|TEST ACCOUNT (@dev_xpace)
СКРЫТЬ ИЗ ТОПА: ВКЛ|HIDE FROM LEADERBOARD: ON
2. ИСКРЫ И XPACE ПАСС|2. SPARKS AND XPACE PASS
+1 УР. ПАССА|+1 PASS LEVEL
30 УР. + БОНУС|LEVEL 30 + BONUS
⏱ СБРОСИТЬ КУЛДАУНЫ КВЕСТОВ И ДНЯ|⏱ RESET QUEST AND DAILY COOLDOWNS
3. РАЗБЛОКИРОВКА КОНТЕНТА|3. CONTENT UNLOCKS
ВСЕ КОРАБЛИ (Вкл. 42)|ALL SHIPS (INCL. 42)
ВСЕ ТИТУЛЫ, СТИЛИ, МОДУЛИ|ALL TITLES, STYLES AND MODULES
СБРОСИТЬ ПРОГРЕСС (КАК НОВИЧОК)|RESET PROGRESS TO A NEW PROFILE
4. ТЕСТ В ЗАБЕГЕ (ПАУЗА / ВЫЛЕТ)|4. IN-RUN TESTING (PAUSED / IN FLIGHT)
БЕССМЕРТИЕ: ВКЛ|INVINCIBILITY: ON
БЕССМЕРТИЕ: ВЫКЛ|INVINCIBILITY: OFF
ВЫДАТЬ ЩИТ|GRANT SHIELD
ПЛАЗМА + x2 ОЧКИ|PLASMA + DOUBLE SCORE
ДРОП «42 БРАТУХА»|DROP “42 BROTHER”
+1 ДЕНЬ БОНУСА|+1 DAILY BONUS DAY
5. ОЧИСТКА СПИСКА ЛИДЕРОВ (ТОП-20)|5. TOP 20 LEADERBOARD CLEANUP
Ник или UID старого аккаунта...|Nickname or UID of the old account...
СКРЫТЬ ВСЕХ ГОСТЕЙ|HIDE ALL GUESTS
↺ ВЕРНУТЬ СКРЫТЫХ|↺ RESTORE HIDDEN PLAYERS
АДМИН-АККАУНТ АКТИВЕН (прогресс не сохраняется · 2× клик по Xpace для выхода)|ADMIN ACCOUNT ACTIVE (progress is temporary · double-click Xpace to exit)
Вы вернулись в свой обычный аккаунт!|Back in your regular account!
АДМИН-ПЕСОЧНИЦА: Весь прогресс, очки и рекорды НЕ сохраняются и НЕ идут в Топ-20. Двойной клик по «Xpace» вернёт ваш обычный аккаунт.|ADMIN SANDBOX: Progress, scores and records are temporary and excluded from the Top 20. Double-click Xpace to return to your regular account.
↩ В ОБЫЧНЫЙ АККАУНТ|↩ RETURN TO REGULAR ACCOUNT
ТЕСТ ДЕБАГ-МЕНЮ|DEBUG TEST
Титул «|Title “
42 БРАТУХА» надет!|42 BROTHER” equipped!
Баланс Искр обнулён (0|Spark balance cleared (0
+500 XP добавлено в XPACE Пасс!|+500 XP added to the Xpace Pass!
Открыт 30 Уровень Пасса + 1500 бонусных XP!|Pass level 30 unlocked, plus 1,500 bonus XP!
Все таймеры квестов и бонуса дня сброшены!|All quest and daily bonus timers reset!
Разблокированы ВСЕ корабли (кроме эксклюзивов акций и наград)!|All ships unlocked except deal exclusives and reward ships!
Открыты ВСЕ корабли, модули, следы, стили и титулы!|All ships, modules, trails, styles and titles unlocked!
Нажмите ещё раз для полного сброса прогресса!|Press again to reset all progress!
Прогресс сброшен до состояния нового игрока!|Progress reset to a new profile!
Бессмертие ВКЛЮЧЕНО!|Invincibility ON!
Бессмертие выключено|Invincibility off
Сначала начните забег!|Start a run first!
Энерго-щит выдан!|Energy shield granted!
Тройной луч + Очки x2 на 15 сек!|Triple Beam and double score for 15s!
Введите никнейм или UID аккаунта!|Enter an account nickname or UID!
Все старые гостевые профили скрыты из Топ-20!|All old guest profiles hidden from the Top 20!
↺ Список скрытых игроков очищен!|↺ Hidden player list cleared!
Сдвинуто на следующий день! Откройте «БОНУС ДНЯ».|Moved to the next day. Open DAILY BONUS.
`.trim().split('\n').map(line => line.split('|')));

    const patterns = [
        [/^Куплено · (\d+\/\d+)$/, 'Purchased · $1'],
        [/^Не хватает искр: (\d+)$/, 'More sparks needed: $1'],
        [/^(\d+) ед\.$/, '$1 power'],
        [/^(.+) ▾$/, (_, label) => translate(label) + ' ▾'],
        [/^Сыграй (\d+) забега в режиме Драйв$/, 'Complete $1 runs in Drive'],
        [/^Соверши (\d+) опасных обгонов в Драйве$/, 'Make $1 near misses in Drive'],
        [/^Собери (\d+) синих искр$/, 'Collect $1 blue sparks'],
        [/^Набери комбо x(\d+)$/, 'Reach a ×$1 combo'],
        [/^Продержись (\d+) сек в забеге$/, 'Survive for $1 seconds in one run'],
        [/^Активируй супер (\d+) раз$/, (_, n) => 'Activate your super ' + (n === '1' ? 'once' : n + ' times')],
        [/^Разрушь (\d+) камней в Зачистке$/, 'Destroy $1 rocks in Clearance'],
        [/^Сыграй (\d+) раза в режим Зачистка$/, (_, n) => 'Complete ' + n + (n === '1' ? ' run' : ' runs') + ' in Clearance'],
        [/^Подбери (\d+) баффа оружия в Зачистке$/, 'Collect $1 weapon upgrades in Clearance'],
        [/^Взорви (\d+) детонирующих ядра в Зачистке$/, 'Blow up $1 explosive cores in Clearance'],
        [/^Собери (\d+) жёлтых монет$/, 'Collect $1 yellow coins'],
        [/^Подбери (\d+) бонуса на трассе$/, 'Collect $1 power-ups on the track'],
        [/^Секторы «Экспедиции»: (\d+)$/, 'Clear $1 Expedition sectors'],
        [/^Секторы «Экспедиции» за один вылет: (\d+)$/, 'Clear $1 Expedition sectors in a single run'],
        [/^Победи боссов «Экспедиции»: (\d+)$/, (_, count) => 'Defeat ' + count + (count === '1' ? ' Expedition boss' : ' Expedition bosses')],
        [/^Выбери улучшения в «Экспедиции»: (\d+)$/, 'Choose $1 Expedition upgrades'],
        [/^Активируй супер в «Экспедиции»: (\d+)$/, 'Activate your super $1 times in Expedition'],
        [/^НОВЫЙ УРОВЕНЬ! \+(\d+) XP \(След\. квест через ([\d:]+)\)$/, 'LEVEL UP! +$1 XP (Next quest in $2)'],
        [/^Получено \+(\d+) XP! Новый квест через ([\d:]+)$/, '+$1 XP earned! Next quest in $2'],
        [/^ОНЛАЙН · (\d+) ПИЛОТ(?:А|ОВ)? В СЕТИ$/, (_, count) => 'ONLINE · ' + count + (Number(count) === 1 ? ' PILOT CONNECTED' : ' PILOTS CONNECTED')],
        [/^● Аккаунт: (@.+)$/, '● Account: $1'],
        [/^недоступен \((.+)\)$/, 'unavailable ($1)'],
        [/^УР\. (.+)$/, 'LVL $1'],
        [/^БОНУС (\+\d+)$/, 'BONUS $1'],
        [/^ДОСТУПНО: x(\d+)$/, 'AVAILABLE: x$1'],
        [/^За каждые (\d+) XP(?: · Взято: (\d+))?$/, (_, xp, claimed) => 'Every ' + xp + ' XP' + (claimed ? ' · Claimed: ' + claimed : '')],
        [/^(\d+) (?:дн\.?|д)( \d{2}:\d{2}:\d{2})?$/, (_, days, clock) => days + 'd' + (clock || '')],
        [/^([\d ]+)\s*сект\.$/, '$1 sectors'],
        [/^(\d+(?:\.\d+)?)с$/, '$1s'],
        [/^ДАР · ДЕНЬ (\d+)$/, 'GIFT · DAY $1'],
        [/^ДАР \((\d+\/\d+)\)$/, 'GIFT ($1)'],
        [/^ДЕНЬ (\d+)$/, 'DAY $1'],
        [/^Вечный Пилот · (\d+\/\d+) дн\. подряд$/, 'Eternal Pilot · $1 consecutive days'],
        [/^(\d+) дней подряд! Получен титул «Вечный Пилот»\.$/, '$1 days in a row! Eternal Pilot title unlocked.'],
        [/^Награда за (\d+) дней подряд в Ежедневном даре\.$/, 'Reward for a $1-day Daily Gift streak.'],
        [/^День (\d+) из (\d+) · Пропуск дня сбрасывает серию\.$/, 'Day $1 of $2 · Missing a day resets your streak.'],
        [/^Награда за День (\d+) получена! Заходите завтра, чтобы не потерять прогресс\.$/, 'Day $1 reward claimed! Return tomorrow to keep your streak.'],
        [/^ЗАБРАТЬ НАГРАДУ · ДЕНЬ (\d+)$/, 'CLAIM REWARD · DAY $1'],
        [/^⏳ ПОЛУЧЕНО · СЛЕД\. ЧЕРЕЗ ([\d:]+)$/, '⏳ CLAIMED · NEXT IN $1'],
        [/^Сегодняшний подарок уже получен! Следующий через ([\d:]+)$/, 'Today’s gift is already claimed! Next in $1'],
        [/^\+ (\d+) XP · Повтор: (\d+)$/, '+ $1 XP · If owned: $2'],
        [/^Оформление профиля \(или (\d+)$/, 'Profile style (or $1'],
        [/^Неоновый шлейф \(или (\d+)$/, 'Neon trail (or $1'],
        [/^День (\d+): награда получена и НОВЫЙ УРОВЕНЬ!$/, 'Day $1: reward claimed and LEVEL UP!'],
        [/^День (\d+): получено \((.*?)(\)!)?$/, (_, day, reward, end) => 'Day ' + day + ': claimed (' + translate(reward) + (end || '')],
        [/^Гость · (.+)$/, 'Guest · $1'],
        [/^Облако \(Гостевой ID\)$/, 'Cloud (Guest ID)'],
        [/^Совершить (\d+) опасных обгонов в «Драйве»\.$/i, 'Make $1 near misses in Drive.'],
        [/^Уничтожить (\d+) камней в режиме «Зачистка»\.$/i, 'Destroy $1 rocks in Clearance.'],
        [/^Уничтожить (\d+) астероидов и НЛО в «Зачистке»\.$/i, 'Destroy $1 asteroids and UFOs in Clearance.'],
        [/^Собрать (\d+) редких жёлтых монет\.$/i, 'Collect $1 rare yellow coins.'],
        [/^Провести (\d+) вылетов на неоновой трассе\.$/i, 'Complete $1 runs on the neon track.'],
        [/^Набрать ([\d ]+) очков за один забег\.$/i, 'Score $1 points in one run.'],
        [/^Продержаться (\d+) секунд в одном забеге\.$/i, 'Survive $1 seconds in one run.'],
        [/^● В РАБОТЕ · СЛОТ (\d+)$/, '● ACTIVE · SLOT $1'],
        [/^· ГОТОВ$/, '· READY'],
        [/^(\d+\/\d+) · ГОТОВ$/, '$1 · READY'],
        [/^ЗАБРАТЬ ВСЁ · ([\d ]+)$/, 'CLAIM ALL · $1'],
        [/^ЗАБРАТЬ (.+)$/, (_, reward) => 'CLAIM ' + translate(reward)],
        [/^Контракт «(.+)» снят со слота$/, (_, name) => 'Contract “' + translate(name) + '” removed'],
        [/^Контракт «(.+)» взят в работу$/, (_, name) => 'Contract “' + translate(name) + '” accepted'],
        [/^Контракт выполнен: \+(\d+) Жёлтых Искр!$/, 'Contract complete: +$1 yellow sparks!'],
        [/^РЕЖИМ: (.+?)(?: · (ЛОКАЛЬНЫЕ ДАННЫЕ))?$/, (_, mode, source) => 'MODE: ' + translate(mode) + (source ? ' · ' + translate(source) : '')],
        [/^Пока нет рекордов в режиме «(.+)»\. Станьте первым!$/, (_, mode) => 'No scores in ' + translate(mode) + ' yet. Be the first!'],
        [/^Топ-20 \((.+)\) обновлён!$/, (_, mode) => 'Top 20 (' + translate(mode) + ') updated!'],
        [/^Титул «(.+)» установлен в профиль!$/, (_, title) => 'Title “' + translate(title) + '” equipped!'],
        [/^Условие: (.+)$/, (_, condition) => 'Requirement: ' + translate(condition)],
        [/^Кастомный след: (.+)$/, (_, trail) => 'Custom trail: ' + translate(trail)],
        [/^Цена: (\d+) искр$/, 'Price: $1 sparks'],
        [/^Цена бандла: (\d+) искр$/, 'Bundle price: $1 sparks'],
        [/^Недостаточно Искр! Нужно ещё (\d+)$/, 'Not enough sparks! You need $1 more'],
        [/^ДО 30 НОЯБРЯ \((\d+) ДН\.\)$/, 'UNTIL NOV 30 ($1 DAYS)'],
        [/^КАСТОМНЫЙ СЛЕД СКИНА \((.+)\)$/, (_, trail) => 'CUSTOM SKIN TRAIL (' + translate(trail) + ')'],
        [/^СЛЕД «(.+)»$/, (_, trail) => 'TRAIL “' + translate(trail) + '”'],
        [/^Предмет бандла «(.+)»\. Бандл доступен во вкладке «Акции»\.$/, (_, bundle) => 'Part of the “' + translate(bundle) + '” bundle, available under Deals.'],
        [/^Эксклюзивный след бандла «(.+)»\. Открывается только при покупке бандла в разделе АКЦИИ\.$/, (_, bundle) => 'Exclusive trail from the “' + translate(bundle) + '” bundle. Find it under Deals.'],
        [/^Фирменный след надетого скина (.+)\.$/, (_, skin) => 'Signature trail of the equipped ' + translate(skin) + ' skin.'],
        [/^Фирменный след скина (.+)\. Выполни контракт «(.+)», чтобы поставить этот след на любой корабль\.$/, (_, skin, contract) => 'Signature trail of the ' + translate(skin) + ' skin. Complete “' + translate(contract) + '” to use it with any ship.'],
        [/^Фирменный след скина (.+)\. Открывается навсегда при покупке скина и ставится на любой корабль\.$/, (_, skin) => 'Signature trail of the ' + translate(skin) + ' skin. Buying the skin unlocks this trail permanently for any ship.'],
        [/^Награда за сложный контракт «(.+)»!$/, (_, contract) => 'Reward for the “' + translate(contract) + '” hard contract!'],
        [/^Только за сложный контракт «(.+)»!$/, (_, contract) => 'Complete the “' + translate(contract) + '” hard contract to unlock this module!'],
        [/^Надет (.+) · твой след сохранён!$/, (_, ship) => translate(ship) + ' equipped. Your trail is still active!'],
        [/^Надет (.+) · след «(.+)» активирован!$/, (_, ship, trail) => translate(ship) + ' equipped with the “' + translate(trail) + '” trail!'],
        [/^Куплен (.+) · открыт след «(.+)»!$/, (_, ship, trail) => translate(ship) + ' purchased. “' + translate(trail) + '” trail unlocked!'],
        [/^Куплен (.+)!$/, (_, ship) => translate(ship) + ' purchased!'],
        [/^Модификация «(.+)» установлена!$/, (_, module) => '“' + translate(module) + '” module installed!'],
        [/^Модификация «(.+)» куплена и установлена!$/, (_, module) => '“' + translate(module) + '” module purchased and installed!'],
        [/^След «(.+)» активирован!$/, (_, trail) => '“' + translate(trail) + '” trail equipped!'],
        [/^След «(.+)» куплен и активирован!$/, (_, trail) => '“' + translate(trail) + '” trail purchased and equipped!'],
        [/^След (.+) активен на (.+)!$/, (_, trail, ship) => '“' + translate(trail) + '” trail equipped on ' + translate(ship) + '!'],
        [/^Выполни контракт «(.+)», чтобы открыть скин «(.+)» и его след\.$/, (_, contract, skin) => 'Complete “' + translate(contract) + '” to unlock the ' + translate(skin) + ' skin and its trail.'],
        [/^Купи скин «(.+)» в Ангаре — и след (.+) откроется навсегда на любой корабль!$/, (_, skin, trail) => 'Buy the “' + translate(skin) + '” skin in the Hangar to unlock its “' + translate(trail) + '” trail for any ship!'],
        [/^Оформление «(.+)» установлено!$/, (_, theme) => '“' + translate(theme) + '” profile style equipped!'],
        [/^Оформление «(.+)» куплено и надето!$/, (_, theme) => '“' + translate(theme) + '” profile style purchased and equipped!'],
        [/^Рамка «(.+)» установлена!$/, (_, frame) => '“' + translate(frame) + '” frame equipped!'],
        [/^Рамка «(.+)» куплена и надета!$/, (_, frame) => '“' + translate(frame) + '” frame purchased and equipped!'],
        [/^Куплено оформление «(.+)»!$/, (_, theme) => '“' + translate(theme) + '” profile style purchased!'],
        [/^Уже в коллекции: (\d+)\/4 — бандл добавит только недостающее\.$/, 'Already owned: $1/4. The bundle adds the remaining items.'],
        [/^КУПИТЬ · (.+)$/, 'BUY · $1'],
        [/^Бандл «(.+)» куплен! Скин, след, титул и цвет профиля уже надеты!$/, (_, bundle) => '“' + translate(bundle) + '” bundle purchased! Skin, trail, title and profile color equipped.'],
        [/^Синхронизация @(.+)\.\.\.$/, 'Syncing @$1...'],
        [/^✓ Аккаунт @(.+) синхронизирован!$/, '✓ Account @$1 synced!'],
        [/^✓ Сохранение @(.+) отправлено\.$/, '✓ Save for @$1 uploaded.'],
        [/^Вы вошли как @(.+)$/, 'Signed in as @$1'],
        [/^✓ @(.+) синхронизирован \(Облако \+ Устройство\)$/, '✓ @$1 synced (cloud and device)'],
        [/^✓ @(.+) запомнен на устройстве и в релее$/, '✓ @$1 saved on this device and the relay'],
        [/^Логин «(.+)» уже существует! Нажмите «ВОЙТИ»\.$/, 'Username “$1” already exists. Select SIGN IN.'],
        [/^Логин «(.+)» уже занят в сети! Нажмите «ВОЙТИ» или выберите другой\.$/, 'Username “$1” is already taken online. Sign in or pick a different username.'],
        [/^Аккаунт @(.+) зарегистрирован в облаке! Прогресс сохранён\.$/, 'Cloud account @$1 registered. Progress saved.'],
        [/^Аккаунт @(.+) создан локально \(нет сети для облака\)\.$/, 'Account @$1 created on this device. The cloud is offline.'],
        [/^Аккаунт @(.+) не найден — нажмите «РЕГИСТРАЦИЯ»!$/, 'Account @$1 was not found. Select REGISTER.'],
        [/^Неверный пароль для @(.+)!$/, 'Incorrect password for @$1!'],
        [/^Вход выполнен: @(.+)! Весь прогресс восстановлен\.$/, 'Signed in as @$1! Your progress has been restored.'],
        [/^Онлайн работает! Пилот\(ов\) в сети: (\d+)$/, 'Connected! Pilots online: $1'],
        [/^Онлайн недоступен: (.+)\. Играем локально\.$/, (_, reason) => 'Online unavailable: ' + translate(reason) + '. Playing locally.'],
        [/^Не удалось отправить: (.+)$/, (_, reason) => 'Submission failed: ' + translate(reason)],
        [/^Режим производительности: Кастомный \((\d+) FPS\)$/, 'Performance mode: Custom ($1 FPS)'],
        [/^Установлено: (\d+) кадров в секунду$/, 'Set to $1 frames per second'],
        [/^Серия входов: (\d+) дн\. подряд!$/, 'Login streak: $1 days in a row!'],
        [/^Никнейм «(.+)» сохранён!$/, 'Nickname “$1” saved!'],
        [/^Баланс: ([\d ]+) Жёлтых Искр$/, 'Balance: $1 Yellow Sparks'],
        [/^\+([\d ]+) Жёлтых Искр начислено!$/, '+$1 Yellow Sparks granted!'],
        [/^Уровень пасса повышен: УР\. (\d+)!$/, 'Pass leveled up: LVL $1!'],
        [/^Аккаунт «(.+)» убран из Топ-20!$/, 'Account “$1” removed from the Top 20!'],
        [/^Контракт готов: «(.+)» · заберите \+([\d ]+)$/, (_, name, sparks) => 'Contract complete: “' + translate(name) + '” · claim +' + sparks],
        [/^Контракт выполнен! Награда: (.+) и \+([\d ]+)$/, (_, reward, sparks) => 'Contract complete! Reward: ' + translate(reward) + ' and +' + sparks],
        [/^Получено (\d+) контракт\(ов\): \+([\d ]+)$/, 'Claimed $1 contracts: +$2'],
        [/^и (.+)!$/, (_, rewards) => 'and ' + rewards.split(', ').map(translate).join(', ') + '!'],
        [/^Сектор (\d+) \/ (Драйв|Зачистка|Босс)$/, (_, sector, mode) => 'Sector ' + sector + ' / ' + translate(mode)],
        [/^Сектор (\d+) пройден$/, 'Sector $1 cleared'],
        [/^Следом · (Драйв|Зачистка) · (.+) · (.+)$/, (_, mode, goal, target) => 'Next · ' + translate(mode) + ' · ' + translate(goal) + ' · ' + translate(target)],
        [/^(\d+\/\d+) с$/, '$1 s'],
        [/^(\d+) с$/, '$1 s'],
        [/^([\d ]+ · [\d ]+) сект\.$/, '$1 sectors'],
        [/^\+([\d ]+) XP \(ЛИМИТ 5000\/ДЕНЬ\)$/, '+$1 XP (5,000 DAILY CAP)'],
        [/^(.+): (\d+(?:\.\d+)?)с$/, (_, label, time) => translate(label) + ': ' + time + 's'],
        [/^ОТКРЫТ ТИТУЛ «(.+)» И \+(\d+) ИСКР!$/, (_, title, sparks) => 'TITLE “' + translate(title) + '” UNLOCKED AND +' + sparks + ' SPARKS!'],
        [/^ПОЛУЧЕНО \+(\d+) ЖЁЛТЫХ ИСКР!$/, '+$1 YELLOW SPARKS EARNED!'],
        [/^БОНУС ПАССА: \+(\d+) ЖЁЛТЫХ ИСКР!(?: \(Осталось ещё: (\d+)\))?$/, (_, sparks, remaining) => 'PASS BONUS: +' + sparks + ' YELLOW SPARKS!' + (remaining ? ' (' + remaining + ' left)' : '')],
        [/^XPACE ПАСС • УРОВЕНЬ (\d+)!$/, 'XPACE PASS • LEVEL $1!'],
        [/^КОМБО x(\d+)!$/, 'COMBO x$1!'],
        [/^\[ ЭМИ-ИМПУЛЬС \+([\d ]+) \]$/, '[ EMP PULSE +$1 ]'],
        [/^(ЮНКЕР-ОВЕРЛОРД|АРХИТЕКТОР РОЯ) (MK-\d+)$/, (_, name, tier) => translate(name) + ' ' + tier],
        [/^(.+) · (\d+\/\d+) \(ФИОЛЕТ\. ИСКРЫ\)$/, (_, name, hp) => translate(name) + ' · ' + hp + ' (PURPLE SPARKS)'],
        [/^(.+) · (\d+\/\d+) HP$/, (_, name, hp) => translate(name) + ' · ' + hp + ' HP'],
        [/^БОСС \((\d+)\): СОБИРАЙ ФИОЛЕТОВЫЕ ИСКРЫ!$/, 'BOSS ($1): COLLECT PURPLE SPARKS!'],
        [/^БОСС ЗАЧИСТКИ: (.+) \((\d+) HP\)!$/, (_, name, hp) => 'CLEARANCE BOSS: ' + translate(name) + ' (' + hp + ' HP)!'],
        [/^БОСС: (.+)!$/, (_, name) => 'BOSS: ' + translate(name) + '!'],
        [/^БОСС (?:ПОВЕРЖЕН|УНИЧТОЖЕН)! \+([\d ]+) ОЧКОВ!$/, 'BOSS DEFEATED! +$1 POINTS!'],
        [/^БОСС УНИЧТОЖЕН \+([\d ]+) \(\+(\d+) XP\)!$/, 'BOSS DESTROYED +$1 (+$2 XP)!'],
        [/^БОСС( ЗАЧИСТКИ)? ПОВЕРЖЕН! \+([\d ]+) очков, \+(\d+)$/, (_, clearance, points, sparks) => (clearance ? 'CLEARANCE BOSS' : 'BOSS') + ' DEFEATED! +' + points + ' points, +' + sparks],
        [/^СБИТО НЛО \+([\d ]+)!$/, 'UFO DOWN +$1!'],
        [/^ТАРАН \+([\d ]+)!$/, 'RAM +$1!'],
        [/^ДРИФТ \+([\d ]+)!$/, 'DRIFT +$1!'],
        [/^ОТРАЖЕНО \+([\d ]+)$/, 'DEFLECTED +$1'],
        [/^ФИОЛЕТ\. ИСКРА (-[\d.]+)$/, 'PURPLE SPARK $1']
    ];
    const storageKey = 'xpace_language';
    const attributes = ['title', 'aria-label', 'placeholder', 'alt'];
    const attributeSelector = attributes.map(name => '[' + name + ']').join(', ');
    const russian = /[А-Яа-яЁё]/;
    const originals = new WeakMap();
    const ignored = 'script, style, code, textarea, [translate="no"], [contenteditable]';
    let selected;
    try { selected = localStorage.getItem(storageKey); } catch {}
    if (!['ru', 'en'].includes(selected)) selected = null;

    function translate(value) {
        const phrase = value.trim().replace(/\s+/g, ' ');
        const exact = english.get(phrase);
        if (exact) return value.replace(value.trim(), () => exact);
        const nested = /^Сложный контракт: (.+)$/.exec(phrase);
        if (nested) {
            const sentence = translate(nested[1]);
            if (sentence !== nested[1]) return value.replace(value.trim(), () => 'Hard contract: ' + sentence);
        }
        for (const [match, replacement] of patterns) {
            if (match.test(phrase)) return value.replace(value.trim(), () => phrase.replace(match, replacement));
        }
        return value;
    }

    function text(value) {
        if (selected !== 'en' || !russian.test(value)) return value;
        if (!value.includes('[[xp:')) return translate(value);
        // The DOM icon renderer leaves one text node on each side of an icon.
        return value.split(/(\[\[xp:[a-z0-9_-]+\]\])/gi)
            .map((part, index) => index % 2 ? part : translate(part))
            .join('');
    }

    function localize(node, key, value, write) {
        const saved = originals.get(node);
        const previous = saved?.get(key);
        const original = previous?.translation === value ? previous.original : value;
        const translation = text(original);
        if (translation === original) saved?.delete(key);
        else {
            const entries = saved || new Map();
            entries.set(key, { original, translation });
            if (!saved) originals.set(node, entries);
        }
        if (translation !== value) write(translation);
    }

    function textNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest(ignored)) return;
        // Let the icon observer split tokens before recording the original text nodes.
        if (node.data.includes('[[xp:')) return;
        localize(node, 'text', node.data, value => { node.data = value; });
    }

    function attribute(node, name) {
        if (node.closest(ignored)) return;
        const value = node.getAttribute(name);
        if (value !== null) localize(node, name, value, translated => node.setAttribute(name, translated));
    }

    function subtree(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textNode(node);
            return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE || node.closest(ignored)) return;
        for (const name of attributes) attribute(node, name);
        for (const element of node.querySelectorAll(attributeSelector)) {
            for (const name of attributes) attribute(element, name);
        }
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) textNode(walker.currentNode);
    }

    const observer = new MutationObserver(records => {
        for (const record of records) {
            if (record.type === 'attributes') attribute(record.target, record.attributeName);
            else if (record.type === 'characterData') textNode(record.target);
            else for (const node of record.addedNodes) if (node.isConnected) subtree(node);
        }
    });

    function apply() {
        observer.disconnect();
        document.documentElement.lang = selected || 'ru';
        for (const button of document.querySelectorAll('#settingsLanguage button')) {
            button.setAttribute('aria-pressed', String(button.dataset.settingsLanguage === (selected || 'ru')));
        }
        subtree(document.body);
        if (selected === 'en') {
            observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributeFilter: attributes });
        }
    }

    function set(language) {
        if (!['ru', 'en'].includes(language)) return;
        selected = language;
        try { localStorage.setItem(storageKey, language); } catch {}
        apply();
    }

    function start() {
        document.getElementById('settingsLanguage').addEventListener('click', event => {
            const button = event.target.closest('[data-settings-language]');
            if (button && button.dataset.settingsLanguage !== selected) set(button.dataset.settingsLanguage);
        });
        if (selected === 'en') apply();
    }

    return { start, set, get selected() { return selected; }, text };
})();
