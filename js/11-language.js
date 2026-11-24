const XpaceLanguage = (() => {
    const english = new Map(`
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
Чередуй слалом и бой. Каждый четвёртый сектор охраняет босс. Между секторами выбирай улучшение корабля.|Alternate slalom and combat. A boss guards every fourth sector. Upgrade your ship between sectors.
Выбери улучшение для этого вылета|Choose an upgrade for this run
Завершить вылет|End run
Пушка · +1 к урону|Cannon · +1 damage
Охлаждение · +15% к темпу стрельбы|Cooling · +15% fire rate
Защита · щит на один удар|Defense · absorbs one hit
Магнит · притяжение монет и искр на 18 секунд|Magnet · attracts coins and sparks for 18 seconds
Хроно · замедление угроз на 8 секунд|Chrono · slows threats for 8 seconds
Реактор · ускорить заряд форсажа на 10%|Reactor · charges overdrive 10% faster
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
Эксклюзив бандла «НЕОН-КИЦУНЭ»: дух-лиса с ушами-клинками, двумя плазменными хвостами и блуждающим лисьим огнём. Только в разделе АКЦИИ!|A Neon Kitsune bundle exclusive. This fox spirit has blade ears, twin plasma tails and roaming foxfire. Available under Deals.
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
Элитное золотое оформление с янтарным сиянием.|Elite gold styling with an amber glow.
Изумрудно-лаймовый стелс-контур киберсети.|An emerald-and-lime stealth outline from the cybernet.
Ультрафиолетово-синяя аура глубокого космоса.|An ultraviolet and blue aura from deep space.
Королевское барочное оформление из пурпура и золота!|A royal baroque look in purple and gold!
Жидкий металл и зеркальный хром корпоративного класса.|Liquid metal and corporate-grade mirror chrome.
Лепестки сакуры, запутавшиеся в неоновых проводах Токио-2099.|Cherry blossoms snagged in the neon wires of Tokyo 2099.
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
`.trim().split('\n').map(line => line.split('|')));

    const patterns = [
        [/^(.+) ▾$/, (_, label) => translate(label) + ' ▾'],
        [/^Сыграй (\d+) забега в режиме Драйв$/, 'Complete $1 runs in Drive'],
        [/^Соверши (\d+) опасных обгонов в Драйве$/, 'Make $1 near misses in Drive'],
        [/^Собери (\d+) синих искр$/, 'Collect $1 blue sparks'],
        [/^Набери комбо x(\d+)$/, 'Reach a ×$1 combo'],
        [/^Продержись (\d+) сек в забеге$/, 'Survive for $1 seconds in one run'],
        [/^Активируй Форсаж (\d+) раз$/, (_, n) => 'Activate Overdrive ' + (n === '1' ? 'once' : n + ' times')],
        [/^Разрушь (\d+) камней в Зачистке$/, 'Destroy $1 rocks in Clearance'],
        [/^Сыграй (\d+) раза в режим Зачистка$/, (_, n) => 'Complete ' + n + (n === '1' ? ' run' : ' runs') + ' in Clearance'],
        [/^Подбери (\d+) баффа оружия в Зачистке$/, 'Collect $1 weapon upgrades in Clearance'],
        [/^Взорви (\d+) детонирующих ядра в Зачистке$/, 'Blow up $1 explosive cores in Clearance'],
        [/^Собери (\d+) жёлтых монет$/, 'Collect $1 yellow coins'],
        [/^Подбери (\d+) бонуса на трассе$/, 'Collect $1 power-ups on the track'],
        [/^НОВЫЙ УРОВЕНЬ! \+(\d+) XP \(След\. квест через ([\d:]+)\)$/, 'LEVEL UP! +$1 XP (Next quest in $2)'],
        [/^Получено \+(\d+) XP! Новый квест через ([\d:]+)$/, '+$1 XP earned! Next quest in $2'],
        [/^ОНЛАЙН · (\d+) ПИЛОТ(?:А|ОВ)? В СЕТИ$/, (_, count) => 'ONLINE · ' + count + (Number(count) === 1 ? ' PILOT CONNECTED' : ' PILOTS CONNECTED')],
        [/^● Аккаунт: (@.+)$/, '● Account: $1'],
        [/^недоступен \((.+)\)$/, 'unavailable ($1)'],
        [/^УР\. (.+)$/, 'LVL $1'],
        [/^БОНУС (\+\d+)$/, 'BONUS $1'],
        [/^ДОСТУПНО: x(\d+)$/, 'AVAILABLE: x$1'],
        [/^За каждые (\d+) XP(?: · Взято: (\d+))?$/, (_, xp, claimed) => 'Every ' + xp + ' XP' + (claimed ? ' · Claimed: ' + claimed : '')],
        [/^(\d+) (?:дн\.?|д)(.*)$/, '$1d$2'],
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
        [/^ЗАБРАТЬ (.+)$/, 'CLAIM $1'],
        [/^Контракт «(.+)» снят со слота$/, 'Contract “$1” removed'],
        [/^Контракт «(.+)» взят в работу$/, 'Contract “$1” accepted'],
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
        [/^Предмет бандла «(.+)»\. Бандл доступен во вкладке «Акции»\.$/, 'Part of the “$1” bundle, available under Deals.']
    ];
    const storageKey = 'xpace_language';
    const attributes = ['title', 'aria-label', 'placeholder'];
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

    function localize(node, key, value, write) {
        const saved = originals.get(node);
        const previous = saved?.get(key);
        const original = previous?.translation === value ? previous.original : value;
        const translation = selected === 'en' && /[А-Яа-яЁё]/.test(original) ? translate(original) : original;
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
        for (const element of node.querySelectorAll('[title], [aria-label], [placeholder]')) {
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

    return { start, set, get selected() { return selected; } };
})();
