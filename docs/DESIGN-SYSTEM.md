# Дизайн-система та карта графічних ресурсів «Мур-Лате» (`KittyCaffe`)

- **Версія документа:** 27 листопада 2026 року (`main`, оновлення ілюстрацій — єдина цифрова гуаш)
- **Публічний репозиторій:** https://github.com/valviconsulting/KittyCaffe
- **Жива HTTPS-версія (PWA / GitHub Pages):** https://valviconsulting.github.io/KittyCaffe/
- **Призначення:** повна специфікація візуальної мови, токенів, асетів, SVG/Canvas-компонентів, макета, адаптивності та поточних performance-спостережень для передачі незалежному аудитору.

---

## 1. Художній напрямок і непорушні інваріанти

- **Естетика:** теплий напівреалістичний storybook у стилі цифрової гуаші з м’якою олійною текстурою та легкою зернистістю паперу (реалістична анатомія й промальоване хутро тварин, лагідні виразні очі, тепле пізньополудневе золоте світло зверху зліва, м’який бурштиновий контровий відблиск від ламп справа, приглушена тепла палітра: мед, дуб, крем, шавлія, припилена троянда, без жорстких чорних контурів).
- **Контури:** виключно темно-коричневе чорнило **`#5A3E32`** та теплі дерев’яні відтінки (`#7A523B`, `#8C6248`) — **заборонено** жорсткий чорний `#000000`.
- **Мова інтерфейсу:** 100% українська (тепла й природна для дитини 9 років); жодних таймерів програшу, штрафів чи агресивного UI.
- **Стек рендерингу:** React `19.3` + Vite `8.3` + TypeScript `~7.0` + Tailwind CSS `4.3` (`src/index.css`) + Framer Motion `14.14` + CSS `@keyframes` + inline SVG + 2 HTML5 `<canvas>` редактори (`LatteArtModal`, `WallArtModal`).
- **Нуль зовнішніх рантайм-залежностей для медіа:** усі ілюстрації зберігаються локально в `public/assets/` (із векторними fallback-компонентами), а всі звуки й музична скринька синтезуються через Web Audio API у `src/services/sound.ts`.

---

## 2. Типографіка та палітра кольорів

### 2.1. Шрифти (`index.html`, `src/index.css`)
- **Основний UI-шрифт:** `Comfortaa` (`400, 500, 600, 700`), fallback: `'Segoe UI Rounded', 'Trebuchet MS', system-ui, sans-serif`.
- **Рукописні заголовки (`.font-handwriting`):** `Caveat` (`500, 600, 700`) — логотип «Мур-Лате», заголовки станцій, модалок, листівок, табличка «Напій дня», цитати щоденника.
- Підключення Google Fonts у `index.html#L22-L26` із `preconnect`.

### 2.2. Базові CSS-токени (`src/index.css#L4-L11`)

| Токен / Елемент | Значення | Призначення |
| :--- | :--- | :--- |
| `--paper-bg` | `#FAF4E8` | Теплий акварельний папір (фон оболонки й модалок) |
| `--ink-brown` | `#5A3E32` | Основний текст і «чорнильні» контури SVG/рамок |
| `--ink-soft` | `#856352` | Вторинні підписи, підказки, мікротекст |
| `--honey-main` | `#E7B868` | Медові акценти, монетки-рибки, сонячний режим |
| `--sage-main` | `#BFD8C4` | Шавлієво-м’ятні акценти (холодні напої, «Друзі», успіх) |
| `--blush-main` | `#F4C7D2` | Полунично-рожеві акценти (випічка, «Магазин», «Подати!») |
| Барна стійка / дощечка | `#F4D5A1` → `#E4B574` → `#CE9450` / `#A86B36` | 3D медово-дубова стільниця, плоска таця, нижня панель |
| CTA «✓ На тацю» / «Відкрити» | `#94D3AA` → `#6CB889` (`border: #3E7A56`) | Позитивна дія приготування |
| CTA «🛎️ Подати замовлення!» | `#F5A1B8` → `#E67797` (`border: #B65370`) | Головна дія подачі гостю |

### 2.3. Тематичні палітри в каталогах даних
- **Погода (`src/data/weather.ts`):**
  - `sunny` (`☀️ Сонячно`): `#FFF4D4` / `#E5B962` / `#7D5318`
  - `rainy` (`🌧️ Дощ`): `#E7F0F6` / `#9BB9CC` / `#3A596E`
  - `snowy` (`❄️ Сніг`): `#EEF4FA` / `#AFC5DF` / `#3F5A7B`
- **6 ранкових тем дня (`src/data/days.ts`):** `honey_morning`, `rainy_cocoa`, `berry_breeze`, `snowy_cozy`, `pastry_fair`, `starlight_friends`.
- **3 теми сюжетної глави «День народження Пуха» (`src/data/birthdayStory.ts`):**
  - `strawberry` (`🍓 Полунична вечірка`): рожево-кремова (`#FFF3F7` → `#FADCE6`, `#D67F9B`)
  - `space` (`🚀 Космічна подорож`): індиго-лавандово-золота (`#F3F0FC` → `#DFD6F6`, `#8D74BF`)
  - `forest` (`🌲 Лісова казка`): смарагдово-дерев’яна (`#EFF9F1` → `#D3ECDA`, `#6BA37C`)
- **Інгредієнти (`src/data/recipes.ts`):** індивідуальні м’які акварельні градієнти `linear-gradient(155deg, ...)` та кольорові рамки для кожної плитки (8 гарячих, 6 коктейльних, 3 блендерних інгредієнти).

---

## 3. CSS-поверхні та тактильна система (`src/index.css`)

| Клас | Файл / Рядки | Візуальна роль |
| :--- | :--- | :--- |
| `.cafe-outer-bg` | `src/index.css#L69-L74` | Теплий крафтовий фон поза межами `max-w-[1440px]` на широких моніторах |
| `.watercolor-paper` | `src/index.css#L77-L84` | Паперова основа головного контейнера з радіальними пастельними розмивами |
| `.watercolor-card` | `src/index.css#L87-L96` | Картки модалок і вікон із легким акварельним світінням |
| `.watercolor-notebook` | `src/index.css#L98-L109` | Сторінки «Книги рецептів» із ледь помітними лініями зошита |
| `.barista-workbench` | `src/index.css#L112-L131` | Медово-дерев’яна робоча стільниця з текстурою деревних волокон |
| `.barista-linen-mat` | `src/index.css#L134-L157` | Лляна підкладка під чашку / келих / тарілку з імітацією прошитого шва |
| `.barista-tray-recess` | `src/index.css#L160-L168` | Заглиблений дерев’яний лоток для сітки кнопок інгредієнтів |
| `.barista-tile` | `src/index.css#L171-L192` | 3D-тактильна кнопка (`border-bottom: 4px`, натискання `translateY(2px)`) |
| `.landscape-scroll-shell` | `src/index.css#L37-L60` | Вертикальний скрол-режим для низьких ландшафтних телефонів (`max-height: 480px`) |

---

## 4. Повний реєстр зображень і шляхів (`public/`)

- **Маніфест у коді:** `src/config/assets.ts` (відносні шляхи `./assets/*.png` для сумісності з `localhost` і підшляхом `/KittyCaffe/`).
- **Компонент завантаження:** `src/components/common/AssetIllustration.tsx` — рендерить `<picture>` із пріоритетом **`.webp`** (`type="image/webp"`), автоматичним fallback на **`.png`** (`decoding="async"`) і резервним **inline SVG** у разі `onError`.
- **Сумарна вага растрових асетів:** **`4 863.4 KB` (PNG)** → **`487.0 KB` (WebP, −90.0%)**.

### 4.1. Растрові ілюстрації (`public/assets/`)

| Персонаж / Сцена | Шлях у репозиторії | Публічний HTTPS URL (WebP) | Розмір (px) | Канали | WebP | PNG | SVG Fallback |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| Інтер’єр кав’ярні «золота година» | `public/assets/bg-cafe.webp` / `.png` | `https://valviconsulting.github.io/KittyCaffe/assets/bg-cafe.webp` | `1680×938` | RGB | `111.2 KB` | `1878.9 KB` | `src/components/svg/CafeBackgroundSvg.tsx` |
| Кіт-помічник Марципан (`aspect-[8/7]`) | `public/assets/cat-marzipan.webp` / `.png` | `https://valviconsulting.github.io/KittyCaffe/assets/cat-marzipan.webp` | `640×560` | RGBA | `40.0 KB` | `350.7 KB` | `src/components/svg/MarzipanCatSvg.tsx` |
| Кошеня Пух | `public/assets/guest-pukh.webp` / `.png` | `https://valviconsulting.github.io/KittyCaffe/assets/guest-pukh.webp` | `466×640` | RGBA | `42.8 KB` | `359.4 KB` | `src/components/svg/GuestCharacterSvg.tsx` |
| Кіт Персик | `public/assets/guest-persyk.webp` / `.png` | `https://valviconsulting.github.io/KittyCaffe/assets/guest-persyk.webp` | `475×640` | RGBA | `46.6 KB` | `371.3 KB` | `src/components/svg/GuestCharacterSvg.tsx` |
| Кішечка Луна | `public/assets/guest-luna.webp` / `.png` | `https://valviconsulting.github.io/KittyCaffe/assets/guest-luna.webp` | `456×640` | RGBA | `39.9 KB` | `332.3 KB` | `src/components/svg/GuestCharacterSvg.tsx` |
| Кіт Марсель | `public/assets/guest-marsel.webp` / `.png` | `https://valviconsulting.github.io/KittyCaffe/assets/guest-marsel.webp` | `551×640` | RGBA | `54.8 KB` | `430.0 KB` | `src/components/svg/GuestCharacterSvg.tsx` |
| Сова Софія | `public/assets/guest-sofia.webp` / `.png` | `https://valviconsulting.github.io/KittyCaffe/assets/guest-sofia.webp` | `466×640` | RGBA | `55.6 KB` | `419.4 KB` | `src/components/svg/GuestCharacterSvg.tsx` |
| Кролиця Мія | `public/assets/guest-miya.webp` / `.png` | `https://valviconsulting.github.io/KittyCaffe/assets/guest-miya.webp` | `392×640` | RGBA | `39.3 KB` | `277.0 KB` | `src/components/svg/GuestCharacterSvg.tsx` |
| Котик-мандрівник *(особливий гість)* | `public/assets/guest-mandrivnyk.webp` / `.png` | `https://valviconsulting.github.io/KittyCaffe/assets/guest-mandrivnyk.webp` | `555×640` | RGBA | `56.8 KB` | `444.5 KB` | `src/components/svg/GuestCharacterSvg.tsx` |

### 4.2. Інші статичні файли (`public/`)

| Файл | Розмір | Призначення |
| :--- | :---: | :--- |
| `public/favicon.svg` | `0.9 KB` | Векторна іконка вкладки та PWA |
| `public/manifest.webmanifest` | `0.7 KB` | PWA-маніфест (`standalone`, `start_url: "./"`, іконки `favicon.svg` + `cat-marzipan.png`) |
| `public/content/letters.json` | `3.6 KB` | Локальний редагований JSON-каталог теплих листів зі стабільними ID |
| `public/assets/README.md` | `1.2 KB` | Пам’ятка по іменуванню файлів ілюстрацій |

---

## 5. Векторна графіка (Inline SVG) та HTML5 `<canvas>`

### 5.1. Каталог SVG-компонентів (`src/components/svg/`)

| Файл | Опис візуалу |
| :--- | :--- |
| `src/components/svg/DrinkVisualSvg.tsx` | Прозора чашка (`HotCupSvg`: шари напою, пара, пінка, маршмелоу, кориця, нахилений керамічний пітчер + живий струмінь молока та поділки `×1`/`×2`), високий келих (`TallGlassSvg`), блендер (`BlenderSvg`), прев’ю на таці (`DrinkPreviewSvg`) |
| `src/components/svg/PastryVisualSvg.tsx` | Круасан (холодний/теплий із парою), печиво з шоколадом, пончик (рожева/шоколадна глазур + посипка), морквяний кекс, міні-пічка (`MiniOvenSvg`) |
| `src/components/svg/TakeawayCupSvg.tsx` | Стаканчик «Із собою» з кришкою, манжетою, 7 базовими та 5 рідкісними золотими стікерами й текстом побажання |
| `src/components/svg/MarzipanAccessoriesSvg.tsx` | 5 аксесуарів гардероба Марципана (`viewBox="0 0 640 560"`, прив’язаний 1:1 до `cat-marzipan.webp` у контейнері `aspect-[8/7]`): ковпак кухаря, золота корона, окуляри-сердечка, червоний метелик, в’язаний шарф |
| `src/components/svg/CafeDecorAndSouvenirsSvg.tsx` | 4 предмети декору залу (ваза з ромашками, гірлянда зірочок, годинник-котик із маятником, музична скринька) + 6 сувенірів від найкращих друзів + щаслива шишка мандрівника |
| `src/components/svg/BirthdayDecorOverlaySvg.tsx` | Святкові гірлянди, центральний декор на стійці й легке конфетті для всіх 3 тем «Дня народження Пуха» (`strawberry`, `space`, `forest`) |
| `src/components/svg/UiIconsSvg.tsx` | Логотип-чашка, монетка-рибка, значок лапки, усі іконки інгредієнтів, плетені підставки (`BaristaCoasterSvg`) |
| `src/components/svg/CafeBackgroundSvg.tsx` | Повноцінний векторний fallback інтер’єру |
| `src/components/svg/GuestCharacterSvg.tsx` | Повноцінні векторні fallback-портрети всіх 7 гостей |
| `src/components/svg/MarzipanCatSvg.tsx` | Векторний fallback сплячого/муркотливого Марципана |

### 5.2. Інтерактивні HTML5 `<canvas>` поверхні
1. **Лате-арт (`src/components/modals/LatteArtModal.tsx`):** кругла чашка вигляд зверху, Pointer Events + `touch-none`, малюнок зберігається лише в рантаймі на поточній чашці (не пишеться у `localStorage`).
2. **Картина дитини на стіні кав’ярні (`src/components/modals/WallArtModal.tsx` + `src/components/cafe/CafeWallArtFrame.tsx`):** мольберт `360×270`, 8 кольорів, 3 пензлі, 4 штампики (`🐾`, `🌸`, `⭐`, `❤️`), 3 стилі рамок (`honey_wood`, `blush_ribbon`, `golden_stars`), підпис; експорт у компактний WebP `240×180` із лімітом безпеки `<= 65 KB` у `localStorage v6`, реально висить у рамці на вільній теплій стіні праворуч (`left: 72%`).

---

## 6. Компонування екрана, шари сцени та адаптивність

### 6.1. Ієрархія головного екрана (`src/App.tsx`)
Оболонка: `flex h-[100dvh] w-full max-w-[1440px] flex-col overflow-hidden` із `env(safe-area-inset-*)`.

1. **Верхня панель (`src/components/cafe/TopBar.tsx`):**
   - `shrink-0`, **суворо 1 горизонтальний рядок** (`50px` мобільний, `52px` десктоп) на всьому діапазоні `375px–1920px`.
   - Елементи: логотип «Мур-Лате», погода, монетки-рибки, лічильник гостей (`xl+`), «Напій дня», «Магазин», «Друзі», «Рецепти», звук.
2. **Панорамна зала кав’ярні (`src/components/cafe/CafeHallScene.tsx`):**
   - За замовчуванням (стійка згорнута) займає **`~85%` висоти екрана** (`614px / 720px` на `1366×720`, `567px / 667px` на `375×667`).
   - Карта шарів (`z-index`):
     - `z-0`: фон `bg-cafe.webp` (`object-cover`)
     - `z-[2]`: `WindowWeatherOverlay.tsx` (віньєтка, золоті ореоли ламп, передвечірній теплий відтінок на 5-му гості, промені/пилинки, дощ або сніг у віконній масці)
     - `z-[10]`: портрет гостя `GuestCard.tsx` (стоїть *за* дерев’яною стійкою)
     - `z-[12]`: гірлянда зірочок та святкова гірлянда `BirthdayDecorOverlaySvg.tsx`
     - `z-[13]`: настінний годинник-котик (`sm+`, між крейдяною дошкою та вікном)
     - `z-[14]`: картина дитини в рамці `CafeWallArtFrame.tsx` (`sm+`, на вільній теплій стіні праворуч між лампами й поличками з чайниками)
     - `z-[15]`: 3D медово-дубова барна стійка + ваза з ромашками / шишка
     - `z-20`: кутові плашки («Напій дня», «Поличка друзів»), музична скринька, Марципан + кнопка `🧶`, табличка імені гостя, легка напівпрозора бульбашка діалогу з клікабельними бейджами замовлення, плоска дерев’яна дощечка подачі `ServingTray.tsx` (`~50–59px` порожня; при заповненні показує напій/десерт + рожеву кнопку `🛎️ Подати!`)
     - `z-30`: анімовані святкові банери-тости
3. **Нижня висувна стійка бариста (`src/components/stations/`):**
   - `StationTabs.tsx`: у згорнутому стані — дерев’яна док-смужка (`~54px`) з 3 кнопками станцій (потрібна станція підсвічується золотою рамкою) + індикатором дня **`День N • X/5`** (із бейджем **`💌`** при непрочитаних листах та **`🎂`** під час свята Пуха).
   - У розгорнутому стані — робоча зона (`262px` на `lg+`, `268px` на `sm–md`, `320–340px` на телефоні):
     - `HotDrinksStation.tsx`: лляна підкладка з чашкою + тактильне наливання молока (утримання з магнітною паузою на `×1` або короткий тап/клавіша `Enter`) + сітка **`4×2`** на всіх екранах без скролу.
     - `ColdDrinksStation.tsx`: високий келих + 6 інгредієнтів коктейлів (`2×3`) + блендер для мілкшейку з вершками.
     - `PastryStation.tsx`: тарілочка + вітрина (3–4 позиції) + міні-пічка / декоратор пончиків.
   - Усі картки станцій дотримуються контракту `flex flex-col` + `shrink-0 z-10` заголовок + `flex-1 min-h-0` без `content-center` / `justify-center` на переповнюваних сітках.
   - Автоматичне перемикання на потрібну вкладку в комбо та автозгортання стійки вниз після завершення збирання замовлення на тацю.

### 6.2. Ліниво завантажувані модальні вікна (`src/components/modals/`, 11 файлів)
Усі 11 модалок підключені через `React.lazy` + `<Suspense>` (окремі JS-чанки `7.4–20.9 KB`):
`BackupModal`, `BirthdayStoryModal`, `DayJournalModal`, `FriendshipAlbumModal`, `LatteArtModal`, `MarzipanCareModal`, `RecipeBookModal`, `SecretDrinkModal`, `ShopModal`, `TakeawayCupModal`, `WallArtModal`.

### 6.3. Підтверджені брейкпоінти QA
- Десктоп / ноутбук: `1536×740`, `1366×720`
- Планшет: `768×1024`
- Телефон (портрет): `390×844`, `375×667`
- Телефон (ландшафт): `844×390`

---

## 7. Мобільна продуктивність 60 FPS (реалізовано у Хвилі 0)

Усі 5 виявлених раніше мобільних вузьких місць усунено:

1. **GPU-виїзд стійки (`src/App.tsx`):** прибрано per-frame flexbox reflow `height: 0 → 'auto'`; панель відкривається легким GPU-переходом `transform: translateY + opacity`.
2. **Нуль `backdrop-blur` і `mix-blend-mode` на телефонах (`CafeHallScene.tsx`, `WindowWeatherOverlay.tsx`, усі 12 модалок):** важкі `mix-blend-mode: screen/soft-light` замінено на чистий альфа-градієнт, а `backdrop-blur` обмежено виключно `sm+` (`>=640px`).
3. **Чисті GPU CSS `@keyframes` (`src/index.css`, `GuestCard.tsx`, `MarzipanHelper.tsx`, `MarzipanCareModal.tsx`):** усі нескінченні JS-цикли `repeat: Infinity` переведено на `animate-guest-breathe`, `animate-guest-happy`, `animate-marzipan-breathe` та `animate-heart-rise` із підтримкою `prefers-reduced-motion`, а `blur-md`/`blur-[8px]` тіні замінено на чисті радіальні градієнти.
4. **Нуль `feTurbulence` у CSS (`src/index.css`):** видалено всі 3 фрактальні SVG-шуми з `.cafe-outer-bg`, `.watercolor-paper` і `.watercolor-card`.
5. **Мемоізація й очищення (`TopBar.tsx`, `WindowWeatherOverlay.tsx`, `CafeHallScene.tsx`):** додано `React.memo`, видалено невикористаний `public/icons.svg`, а сумарну вагу 9 WebP-асетів зменшено до `487.0 KB`.
