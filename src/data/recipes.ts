import type {
  BlenderIngredientId,
  DrinkRecipeId,
  HotIngredientId,
  Order,
  PastryRecipeId,
  PreparedDrink,
  PreparedPastry,
  SecretDrinkRecipe,
  TallGlassIngredientId,
  UnlockableRecipeId,
  ValidationResult,
} from '../types/game';

export interface IngredientMeta<T extends string> {
  id: T;
  label: string;
  shortLabel: string;
  badgeBg: string;
  badgeText: string;
  buttonBg: string;
  buttonGradient: string;
  buttonBorder: string;
  maxCount?: number;
}

export const HOT_INGREDIENTS: IngredientMeta<HotIngredientId>[] = [
  {
    id: 'espresso',
    label: 'Еспресо',
    shortLabel: 'Еспресо',
    badgeBg: '#6B3E26',
    badgeText: '#FFF8F0',
    buttonBg: '#ECD7C4',
    buttonGradient: 'linear-gradient(155deg, #F7EAE0 0%, #E7CCB3 100%)',
    buttonBorder: '#7A523B',
    maxCount: 1,
  },
  {
    id: 'hotWater',
    label: 'Гаряча вода',
    shortLabel: 'Гаряча вода',
    badgeBg: '#BCE2F0',
    badgeText: '#2A5568',
    buttonBg: '#DCF1FA',
    buttonGradient: 'linear-gradient(155deg, #EFFAFF 0%, #C6E8F6 100%)',
    buttonBorder: '#6999AE',
    maxCount: 1,
  },
  {
    id: 'warmMilk',
    label: 'Тепле молоко',
    shortLabel: 'Тепле молоко',
    badgeBg: '#FFF3DC',
    badgeText: '#7D512D',
    buttonBg: '#FCF2DE',
    buttonGradient: 'linear-gradient(155deg, #FFFDF7 0%, #F5E3C2 100%)',
    buttonBorder: '#9A744B',
    maxCount: 2,
  },
  {
    id: 'foam',
    label: 'Пишна пінка',
    shortLabel: 'Пишна пінка',
    badgeBg: '#FDE8EF',
    badgeText: '#8A465C',
    buttonBg: '#FDEAF0',
    buttonGradient: 'linear-gradient(155deg, #FFF8FA 0%, #F7D8E2 100%)',
    buttonBorder: '#B07486',
    maxCount: 1,
  },
  {
    id: 'cocoa',
    label: 'Какао',
    shortLabel: 'Какао',
    badgeBg: '#8B5434',
    badgeText: '#FFF8F0',
    buttonBg: '#EED6C0',
    buttonGradient: 'linear-gradient(155deg, #F8EBE0 0%, #E5C1A2 100%)',
    buttonBorder: '#84563A',
    maxCount: 1,
  },
  {
    id: 'cinnamon',
    label: 'Кориця',
    shortLabel: 'Кориця',
    badgeBg: '#D48A4C',
    badgeText: '#FFFDF9',
    buttonBg: '#F9E1BE',
    buttonGradient: 'linear-gradient(155deg, #FEF4E2 0%, #EFC895 100%)',
    buttonBorder: '#9F6A38',
    maxCount: 1,
  },
  {
    id: 'marshmallow',
    label: 'Маршмелоу',
    shortLabel: 'Маршмелоу',
    badgeBg: '#FADADD',
    badgeText: '#8A3F54',
    buttonBg: '#FCE5EC',
    buttonGradient: 'linear-gradient(155deg, #FFF4F7 0%, #F6CCD8 100%)',
    buttonBorder: '#B46F83',
    maxCount: 1,
  },
  {
    id: 'matcha',
    label: 'Матча',
    shortLabel: 'Матча',
    badgeBg: '#D4EED3',
    badgeText: '#235E31',
    buttonBg: '#E3F5E2',
    buttonGradient: 'linear-gradient(155deg, #F1FBF0 0%, #BEE2BE 100%)',
    buttonBorder: '#578E5D',
    maxCount: 1,
  },
];

export function getVisibleHotIngredients(
  unlockedRecipes: UnlockableRecipeId[] = []
): IngredientMeta<HotIngredientId>[] {
  const hasMatcha = unlockedRecipes.includes('matcha_latte');
  return hasMatcha
    ? HOT_INGREDIENTS
    : HOT_INGREDIENTS.filter((i) => i.id !== 'matcha');
}

export const TALL_GLASS_INGREDIENTS: IngredientMeta<TallGlassIngredientId>[] = [
  {
    id: 'ice',
    label: 'Лід',
    shortLabel: 'Лід',
    badgeBg: '#D3F1FA',
    badgeText: '#2B6175',
    buttonBg: '#E2F6FD',
    buttonGradient: 'linear-gradient(155deg, #F2FCFF 0%, #C6EBF9 100%)',
    buttonBorder: '#699DB2',
  },
  {
    id: 'soda',
    label: 'Газована вода',
    shortLabel: 'Газована вода',
    badgeBg: '#D9F5EC',
    badgeText: '#236652',
    buttonBg: '#E1F6EE',
    buttonGradient: 'linear-gradient(155deg, #F2FCF8 0%, #C4EBDC 100%)',
    buttonBorder: '#5C9B83',
  },
  {
    id: 'orangeJuice',
    label: 'Апельсиновий сік',
    shortLabel: 'Апельс. сік',
    badgeBg: '#FFE0A3',
    badgeText: '#8B4F11',
    buttonBg: '#FCEAC8',
    buttonGradient: 'linear-gradient(155deg, #FFF7E5 0%, #F7D18E 100%)',
    buttonBorder: '#B47934',
  },
  {
    id: 'strawberrySyrup',
    label: 'Полуничний сироп',
    shortLabel: 'Полунич. сироп',
    badgeBg: '#FFC8D6',
    badgeText: '#922947',
    buttonBg: '#FCE2EA',
    buttonGradient: 'linear-gradient(155deg, #FFF2F6 0%, #F5BFCE 100%)',
    buttonBorder: '#B66079',
  },
  {
    id: 'mint',
    label: 'М’ята',
    shortLabel: 'М’ята',
    badgeBg: '#C4EED4',
    badgeText: '#1F6340',
    buttonBg: '#DDF4E5',
    buttonGradient: 'linear-gradient(155deg, #EFFBF3 0%, #BFE7CD 100%)',
    buttonBorder: '#56946F',
  },
  {
    id: 'lemon',
    label: 'Лимон',
    shortLabel: 'Лимон',
    badgeBg: '#FFF4B2',
    badgeText: '#7D6310',
    buttonBg: '#FCF5CA',
    buttonGradient: 'linear-gradient(155deg, #FFFDF0 0%, #F5E395 100%)',
    buttonBorder: '#AD9134',
  },
];

export const BLENDER_INGREDIENTS: IngredientMeta<BlenderIngredientId>[] = [
  {
    id: 'coldMilk',
    label: 'Холодне молоко',
    shortLabel: 'Холодне молоко',
    badgeBg: '#E3F2FA',
    badgeText: '#2F5C77',
    buttonBg: '#E8F4FB',
    buttonGradient: 'linear-gradient(155deg, #F6FBFE 0%, #D3E9F6 100%)',
    buttonBorder: '#6D9AB2',
  },
  {
    id: 'iceCream',
    label: 'Морозиво',
    shortLabel: 'Морозиво',
    badgeBg: '#FFF0C9',
    badgeText: '#82571C',
    buttonBg: '#FCF2D4',
    buttonGradient: 'linear-gradient(155deg, #FFFBF0 0%, #F5DFA9 100%)',
    buttonBorder: '#A98143',
  },
  {
    id: 'strawberrySyrup',
    label: 'Полуничний сироп',
    shortLabel: 'Полунич. сироп',
    badgeBg: '#FFC8D6',
    badgeText: '#922947',
    buttonBg: '#FCE2EA',
    buttonGradient: 'linear-gradient(155deg, #FFF2F6 0%, #F5BFCE 100%)',
    buttonBorder: '#B66079',
  },
];

export const HOT_INGREDIENT_LABELS: Record<HotIngredientId, string> = {
  espresso: 'Еспресо',
  hotWater: 'Гаряча вода',
  warmMilk: 'Тепле молоко',
  foam: 'Пишна пінка',
  cocoa: 'Какао',
  cinnamon: 'Кориця',
  marshmallow: 'Маршмелоу',
  matcha: 'Матча',
};

export const TALL_INGREDIENT_LABELS: Record<TallGlassIngredientId, string> = {
  ice: 'Лід',
  soda: 'Газована вода',
  orangeJuice: 'Апельсиновий сік',
  strawberrySyrup: 'Полуничний сироп',
  mint: 'М’ята',
  lemon: 'Лимон',
};

export const BLENDER_INGREDIENT_LABELS: Record<BlenderIngredientId, string> = {
  coldMilk: 'Холодне молоко',
  iceCream: 'Морозиво',
  strawberrySyrup: 'Полуничний сироп',
};

export interface DrinkRecipe {
  id: DrinkRecipeId;
  name: string;
  bookTab: 'hot' | 'cold';
  category: 'hot' | 'cocktail' | 'milkshake';
  hotIngredients?: Partial<Record<HotIngredientId, number>>;
  cocktailIngredients?: TallGlassIngredientId[];
  milkshakeIngredients?: BlenderIngredientId[];
  needsWhippedCream?: boolean;
  badges: string[];
  funFact: string;
  specialTip?: string;
  unlockableId?: UnlockableRecipeId;
  /** True when unlocked permanently by solving a Story Chapter (e.g. Chapter 2 Golden Cocoa) */
  storyUnlocked?: boolean;
  sampleDrink: PreparedDrink;
}

export const DRINK_RECIPES: Record<DrinkRecipeId, DrinkRecipe> = {
  espresso: {
    id: 'espresso',
    name: 'Еспресо',
    bookTab: 'hot',
    category: 'hot',
    hotIngredients: { espresso: 1 },
    badges: ['Еспресо'],
    funFact: 'Слово «еспресо» прийшло з Італії й означає напій, приготований спеціально для тебе тут і зараз!',
    sampleDrink: { category: 'hot', ingredients: { espresso: 1 } },
  },
  americano: {
    id: 'americano',
    name: 'Американо',
    bookTab: 'hot',
    category: 'hot',
    hotIngredients: { espresso: 1, hotWater: 1 },
    badges: ['Еспресо', 'Гаряча вода'],
    funFact: 'Американо м’якший за еспресо, бо гаряча вода робить смак ніжнішим і більшим за об’ємом.',
    sampleDrink: { category: 'hot', ingredients: { espresso: 1, hotWater: 1 } },
  },
  cappuccino: {
    id: 'cappuccino',
    name: 'Капучино',
    bookTab: 'hot',
    category: 'hot',
    hotIngredients: { espresso: 1, warmMilk: 1, foam: 1 },
    badges: ['Еспресо', 'Тепле молоко', 'Пишна пінка'],
    funFact: 'Головна окраса капучино — хмаринка пишної молочної пінки, на якій бариста часто малюють котиків!',
    sampleDrink: { category: 'hot', ingredients: { espresso: 1, warmMilk: 1, foam: 1 } },
  },
  cappuccino_cinnamon: {
    id: 'cappuccino_cinnamon',
    name: 'Капучино з корицею',
    bookTab: 'hot',
    category: 'hot',
    hotIngredients: { espresso: 1, warmMilk: 1, foam: 1, cinnamon: 1 },
    badges: ['Еспресо', 'Тепле молоко', 'Пишна пінка', 'Кориця'],
    funFact: 'Кориця — це духмяна кора тропічного дерева. Її теплий аромат одразу створює затишок!',
    sampleDrink: {
      category: 'hot',
      ingredients: { espresso: 1, warmMilk: 1, foam: 1, cinnamon: 1 },
    },
  },
  latte: {
    id: 'latte',
    name: 'Лате',
    bookTab: 'hot',
    category: 'hot',
    hotIngredients: { espresso: 1, warmMilk: 2 },
    badges: ['2× Тепле молоко', 'Еспресо'],
    specialTip: 'Секрет лате: натисни «Тепле молоко» двічі — у лате вдвічі більше молока!',
    funFact: 'Італійською «latte» буквально означає «молоко», тому його тут удвічі більше, ніж у звичайній каві!',
    sampleDrink: { category: 'hot', ingredients: { espresso: 1, warmMilk: 2 } },
  },
  babyccino: {
    id: 'babyccino',
    name: 'Бебічино',
    bookTab: 'hot',
    category: 'hot',
    hotIngredients: { warmMilk: 1, foam: 1, cinnamon: 1 },
    badges: ['Тепле молоко', 'Пишна пінка', 'Кориця'],
    specialTip: 'Зовсім без кави — ідеально для кошенят і дітей!',
    funFact: 'Бебічино вигадали спеціально для маленьких гостей кав’ярень: пухка молочна пінка й жодної краплі кави.',
    sampleDrink: {
      category: 'hot',
      ingredients: { warmMilk: 1, foam: 1, cinnamon: 1 },
    },
  },
  cocoa_marshmallow: {
    id: 'cocoa_marshmallow',
    name: 'Какао з маршмелоу',
    bookTab: 'hot',
    category: 'hot',
    hotIngredients: { cocoa: 1, warmMilk: 1, marshmallow: 1 },
    badges: ['Какао', 'Тепле молоко', 'Маршмелоу'],
    funFact: 'Какао роблять із плодів шоколадного дерева, а теплі маршмелоу зверху стають ніжними, мов хмаринки.',
    sampleDrink: {
      category: 'hot',
      ingredients: { cocoa: 1, warmMilk: 1, marshmallow: 1 },
    },
  },
  matcha_latte: {
    id: 'matcha_latte',
    name: 'Матча-Лате',
    bookTab: 'hot',
    category: 'hot',
    hotIngredients: { matcha: 1, warmMilk: 1, foam: 1 },
    badges: ['Матча', 'Тепле молоко', 'Пишна пінка'],
    specialTip: 'Особливий відкривний рецепт із Магазину — ніжний смарагдово-зелений шар у чашці!',
    funFact: 'Матча — це подрібнене листя японського зеленого чаю. З молоком і пінкою воно має м’який вершковий смак!',
    unlockableId: 'matcha_latte',
    sampleDrink: {
      category: 'hot',
      ingredients: { matcha: 1, warmMilk: 1, foam: 1 },
    },
  },
  golden_cocoa: {
    id: 'golden_cocoa',
    name: 'Золоте какао «Мур-Лате»',
    bookTab: 'hot',
    category: 'hot',
    hotIngredients: {
      cocoa: 1,
      warmMilk: 1,
      foam: 1,
      cinnamon: 1,
      marshmallow: 1,
    },
    badges: [
      'Тепле молоко',
      'Какао',
      'Пишна пінка',
      'Кориця',
      'Маршмелоу',
    ],
    specialTip:
      'Легендарний рецепт засновника кав’ярні! Зовсім без кави — підходить навіть для Кошеняти Пуха й приносить +25 🐟!',
    funFact:
      'У старовинній книзі «Мур-Лате» записано: поєднання теплого какао, пухкої пінки, кориці й маршмелоу робить затишним навіть найсніжніший день!',
    storyUnlocked: true,
    sampleDrink: {
      category: 'hot',
      ingredients: {
        cocoa: 1,
        warmMilk: 1,
        foam: 1,
        cinnamon: 1,
        marshmallow: 1,
      },
    },
  },
  strawberry_milkshake: {
    id: 'strawberry_milkshake',
    name: 'Полуничний мілкшейк',
    bookTab: 'cold',
    category: 'milkshake',
    milkshakeIngredients: ['coldMilk', 'iceCream', 'strawberrySyrup'],
    needsWhippedCream: true,
    badges: [
      'Блендер: Холодне молоко',
      'Морозиво',
      'Полуничний сироп',
      'Збити!',
      'Зверху: Збиті вершки',
    ],
    specialTip: 'Змішай у блендері, натисни «Збити!», а потім прикрась збитими вершками.',
    funFact: 'Назва «мілкшейк» означає «збите молоко». Що густіше морозиво, то смачніший виходить коктейль!',
    sampleDrink: {
      category: 'milkshake',
      blenderIngredients: { coldMilk: 1, iceCream: 1, strawberrySyrup: 1 },
      whippedCream: true,
    },
  },
  kids_mojito: {
    id: 'kids_mojito',
    name: 'Дитячий Мохіто',
    bookTab: 'cold',
    category: 'cocktail',
    cocktailIngredients: ['ice', 'mint', 'lemon', 'soda'],
    badges: ['Лід', 'М’ята', 'Лимон', 'Газована вода'],
    funFact: 'Свіжі листочки м’яти й бульбашки газованої води чудово освіжають навіть у найспекотніший день!',
    sampleDrink: {
      category: 'cocktail',
      ingredients: { ice: 1, mint: 1, lemon: 1, soda: 1 },
    },
  },
  sunrise: {
    id: 'sunrise',
    name: 'Коктейль «Санрайз»',
    bookTab: 'cold',
    category: 'cocktail',
    cocktailIngredients: ['ice', 'orangeJuice', 'strawberrySyrup'],
    badges: ['Лід', 'Апельсиновий сік', 'Полуничний сироп'],
    funFact: '«Санрайз» означає «схід сонця» — червоний сироп опускається на дно, створюючи яскравий світанок у келиху!',
    sampleDrink: {
      category: 'cocktail',
      ingredients: { ice: 1, orangeJuice: 1, strawberrySyrup: 1 },
    },
  },
};

export interface PastryRecipe {
  id: PastryRecipeId;
  name: string;
  expected: PreparedPastry;
  badges: string[];
  funFact: string;
}

export const PASTRY_RECIPES: Record<PastryRecipeId, PastryRecipe> = {
  croissant: {
    id: 'croissant',
    name: 'Круасан',
    expected: { type: 'croissant', warmed: false },
    badges: ['Обрати Круасан'],
    funFact: 'Назва «круасан» французькою означає «півмісяць» — саме таку форму має ця листкова булочка!',
  },
  warm_croissant: {
    id: 'warm_croissant',
    name: 'Теплий круасан',
    expected: { type: 'croissant', warmed: true },
    badges: ['Обрати Круасан', 'Підігріти в пічці'],
    funFact: 'У теплій міні-пічці круасан стає рум’яним, хрустким і пахне вершковим маслом на всю кав’ярню!',
  },
  chocolate_cookie: {
    id: 'chocolate_cookie',
    name: 'Печиво з шоколадом',
    expected: { type: 'cookie' },
    badges: ['Обрати Печиво з шоколадом'],
    funFact: 'Шоколадне печиво винайшли майже випадково, коли шматочки шоколаду не розтанули в тісті, а залишились хрумкими!',
  },
  donut_pink: {
    id: 'donut_pink',
    name: 'Пончик із рожевою глазур’ю',
    expected: { type: 'donut', glaze: 'pink', sprinkles: false },
    badges: ['Обрати Пончик', 'Глазур: Рожева полунична'],
    funFact: 'Пончик має дірочку посередині, щоб тісто рівномірно пропікалося з усіх боків!',
  },
  donut_pink_sprinkles: {
    id: 'donut_pink_sprinkles',
    name: 'Пончик із рожевою глазур’ю та посипкою',
    expected: { type: 'donut', glaze: 'pink', sprinkles: true },
    badges: ['Обрати Пончик', 'Глазур: Рожева полунична', 'Кольорова посипка'],
    funFact: 'Різнокольорова посипка перетворює звичайний пончик на справжнє маленьке свято!',
  },
  donut_chocolate: {
    id: 'donut_chocolate',
    name: 'Пончик із шоколадною глазур’ю',
    expected: { type: 'donut', glaze: 'chocolate', sprinkles: false },
    badges: ['Обрати Пончик', 'Глазур: Шоколадна'],
    funFact: 'Шоколадна глазур чудово пасує до кави лате та ароматного американо.',
  },
  donut_chocolate_sprinkles: {
    id: 'donut_chocolate_sprinkles',
    name: 'Пончик із шоколадною глазур’ю та посипкою',
    expected: { type: 'donut', glaze: 'chocolate', sprinkles: true },
    badges: ['Обрати Пончик', 'Глазур: Шоколадна', 'Кольорова посипка'],
    funFact: 'Шоколад і веселка посипки — подвійна радість для ласунів!',
  },
  carrot_cake: {
    id: 'carrot_cake',
    name: 'Морквяний кекс',
    expected: { type: 'carrot_cake' },
    badges: ['Обрати Морквяний кекс', 'Одразу готовий із кремовою шапочкою!'],
    funFact: 'Морквяний кекс із вершковим кремом виходить ніжним і солоденьким — Кролиця Мія просто в захваті від нього!',
  },
};

export interface RecipeBookPastryCard {
  id: string;
  title: string;
  badges: string[];
  funFact: string;
  sample: PreparedPastry;
  unlockableId?: UnlockableRecipeId;
}

export const RECIPE_BOOK_PASTRY_CARDS: RecipeBookPastryCard[] = [
  {
    id: 'croissant_card',
    title: 'Круасан / Теплий круасан',
    badges: ['Круасан', 'Опція: Підігріти в пічці (2 сек)'],
    funFact:
      '«Круасан» французькою означає «півмісяць»! Якщо гість просить теплий круасан, обов’язково підігрій його в пічці.',
    sample: { type: 'croissant', warmed: true },
  },
  {
    id: 'cookie_card',
    title: 'Печиво з шоколадом',
    badges: ['Обрати Печиво з шоколадом', 'Одразу готове!'],
    funFact:
      'Це печиво з’явилося майже випадково: шматочки шоколаду не розтанули в духовці, а стали смачними крапельками!',
    sample: { type: 'cookie' },
  },
  {
    id: 'donut_pink_card',
    title: 'Пончик із рожевою глазур’ю',
    badges: ['Пончик', 'Рожева полунична глазур', 'За бажанням: Кольорова посипка'],
    funFact:
      'Дірочка в пончику потрібна, щоб він пропікався рівномірно. А полунична глазур із посипкою — улюблена для кошеняти Пуха!',
    sample: { type: 'donut', glaze: 'pink', sprinkles: true },
  },
  {
    id: 'donut_choco_card',
    title: 'Пончик із шоколадною глазур’ю',
    badges: ['Пончик', 'Шоколадна глазур', 'За бажанням: Кольорова посипка'],
    funFact:
      'Гладенька шоколадна глазур робить пончик особливо ніжним. Ведмедик Марсель просто обожнює його з лате!',
    sample: { type: 'donut', glaze: 'chocolate', sprinkles: false },
  },
  {
    id: 'carrot_cake_card',
    title: 'Морквяний кекс',
    badges: ['Обрати Морквяний кекс', 'З ніжною кремовою шапочкою!'],
    funFact:
      'Солодка морква робить кекс надзвичайно м’яким і пухким. Особливий десерт із Магазину, який обожнює Кролиця Мія!',
    sample: { type: 'carrot_cake' },
    unlockableId: 'carrot_cake',
  },
];

export function hasHotIngredients(
  ingredients: Partial<Record<HotIngredientId, number>>
): boolean {
  return Object.values(ingredients).some((v) => (v ?? 0) > 0);
}

export function hasTallIngredients(
  ingredients: Partial<Record<TallGlassIngredientId, number>>
): boolean {
  return Object.values(ingredients).some((v) => (v ?? 0) > 0);
}

export function hasBlenderIngredients(
  ingredients: Partial<Record<BlenderIngredientId, number>>
): boolean {
  return Object.values(ingredients).some((v) => (v ?? 0) > 0);
}

export function describePreparedPastry(pastry: PreparedPastry): string {
  if (pastry.type === 'croissant') {
    return pastry.warmed ? 'Теплий круасан' : 'Круасан';
  }
  if (pastry.type === 'cookie') {
    return 'Печиво з шоколадом';
  }
  if (pastry.type === 'carrot_cake') {
    return 'Морквяний кекс';
  }
  if (pastry.glaze === 'none') {
    return pastry.sprinkles ? 'Пончик із посипкою' : 'Пончик без глазурі';
  }
  const glazeLabel =
    pastry.glaze === 'pink' ? 'рожевою глазур’ю' : 'шоколадною глазур’ю';
  return pastry.sprinkles
    ? `Пончик із ${glazeLabel} та посипкою`
    : `Пончик із ${glazeLabel}`;
}

export function shortTrayPastryLabel(pastry: PreparedPastry): string {
  if (pastry.type === 'croissant') {
    return pastry.warmed ? 'Теплий круасан' : 'Круасан';
  }
  if (pastry.type === 'cookie') {
    return 'Печиво';
  }
  if (pastry.type === 'carrot_cake') {
    return 'Морквяний кекс';
  }
  if (pastry.glaze === 'none') {
    return pastry.sprinkles ? 'Пончик ✨' : 'Пончик';
  }
  const glazeShort = pastry.glaze === 'pink' ? 'рожев.' : 'шокол.';
  return pastry.sprinkles
    ? `Пончик (${glazeShort} ✨)`
    : `Пончик (${glazeShort})`;
}

export function describePreparedDrink(drink: PreparedDrink): string {
  if (drink.category === 'milkshake') {
    return drink.whippedCream ? 'Мілкшейк із вершками' : 'Мілкшейк';
  }
  if (drink.category === 'cocktail') {
    return 'Холодний коктейль';
  }
  return 'Гарячий напій';
}

export function canDoLatteArt(
  ingredients: Partial<Record<HotIngredientId, number>>
): boolean {
  const hasFoam = (ingredients.foam ?? 0) > 0;
  const hasWarmMilk = (ingredients.warmMilk ?? 0) > 0;
  const hasCocoa = (ingredients.cocoa ?? 0) > 0;
  const hasEspresso = (ingredients.espresso ?? 0) > 0;
  const hasMatcha = (ingredients.matcha ?? 0) > 0;
  return (
    hasFoam ||
    (hasWarmMilk && (hasCocoa || hasEspresso || hasMatcha))
  );
}

export function secretDrinkHasEspresso(secret: SecretDrinkRecipe): boolean {
  return (
    secret.category === 'hot' && (secret.hotIngredients?.espresso ?? 0) > 0
  );
}

/** Checks any caffeinated hot ingredient (espresso OR matcha) — cocoa stays kid-friendly */
export function secretDrinkHasCaffeine(secret: SecretDrinkRecipe): boolean {
  return (
    secret.category === 'hot' &&
    ((secret.hotIngredients?.espresso ?? 0) > 0 ||
      (secret.hotIngredients?.matcha ?? 0) > 0)
  );
}

export function secretDrinkToBadges(secret: SecretDrinkRecipe): string[] {
  if (secret.category === 'hot') {
    const badges: string[] = [];
    for (const [id, count] of Object.entries(secret.hotIngredients ?? {}) as [
      HotIngredientId,
      number,
    ][]) {
      if (count > 0) {
        badges.push(
          count > 1
            ? `${count}× ${HOT_INGREDIENT_LABELS[id]}`
            : HOT_INGREDIENT_LABELS[id]
        );
      }
    }
    return badges;
  }
  if (secret.category === 'cocktail') {
    return (secret.cocktailIngredients ?? []).map(
      (id) => TALL_INGREDIENT_LABELS[id]
    );
  }
  const list = (secret.milkshakeIngredients ?? []).map(
    (id) => BLENDER_INGREDIENT_LABELS[id]
  );
  list.push('Збити в блендері!');
  if (secret.needsWhippedCream) {
    list.push('Зверху: Збиті вершки');
  }
  return list;
}

export function secretDrinkToSample(secret: SecretDrinkRecipe): PreparedDrink {
  if (secret.category === 'hot') {
    return {
      category: 'hot',
      ingredients: { ...(secret.hotIngredients ?? {}) },
    };
  }
  if (secret.category === 'cocktail') {
    const map: Partial<Record<TallGlassIngredientId, number>> = {};
    for (const id of secret.cocktailIngredients ?? []) {
      map[id] = 1;
    }
    return { category: 'cocktail', ingredients: map };
  }
  const map: Partial<Record<BlenderIngredientId, number>> = {};
  for (const id of secret.milkshakeIngredients ?? []) {
    map[id] = 1;
  }
  return {
    category: 'milkshake',
    blenderIngredients: map,
    whippedCream: Boolean(secret.needsWhippedCream),
  };
}

export function getOrderDrinkName(order: Order): string {
  if (order.isTravelerGuest || order.drinkId === 'traveler_any') {
    if (order.travelerWishCategory === 'cold') return 'Будь-який коктейль';
    if (order.travelerWishCategory === 'pastry') return 'Будь-який смаколик';
    return 'Будь-який теплий напій';
  }
  if (order.drinkId === 'secret_daily' && order.secretDrink) {
    return order.secretDrink.name;
  }
  if (order.drinkId !== 'secret_daily') {
    return DRINK_RECIPES[order.drinkId].name;
  }
  return 'Секретний напій дня';
}

export function getOrderDrinkTab(order: Order): 'hot' | 'cold' {
  if (order.isTravelerGuest || order.drinkId === 'traveler_any') {
    return order.travelerWishCategory === 'cold' ? 'cold' : 'hot';
  }
  if (order.drinkId === 'secret_daily' && order.secretDrink) {
    return order.secretDrink.category === 'hot' ? 'hot' : 'cold';
  }
  if (order.drinkId !== 'secret_daily') {
    return DRINK_RECIPES[order.drinkId].bookTab;
  }
  return 'hot';
}

export function shortTrayDrinkLabel(drink: PreparedDrink): string {
  if (drink.takeaway) {
    return drink.category === 'hot' ? 'Із собою ☕' : 'Із собою 🍹';
  }
  if (drink.category === 'milkshake') {
    return drink.whippedCream ? 'Мілкшейк ✨' : 'Мілкшейк';
  }
  if (drink.category === 'cocktail') {
    return 'Коктейль';
  }
  return drink.latteArtDataUrl ? 'Напій + арт 🎨' : 'Гарячий напій';
}

function validateAgainstSpec(
  prepared: PreparedDrink | null,
  spec: {
    name: string;
    category: 'hot' | 'cocktail' | 'milkshake';
    hotIngredients?: Partial<Record<HotIngredientId, number>>;
    cocktailIngredients?: TallGlassIngredientId[];
    milkshakeIngredients?: BlenderIngredientId[];
    needsWhippedCream?: boolean;
    isBabyccino?: boolean;
  },
  guestId: Order['guestId']
): ValidationResult {
  // Special Puff rule: if given ANY drink containing espresso or matcha!
  if (
    guestId === 'puh' &&
    prepared?.category === 'hot' &&
    ((prepared.ingredients.espresso ?? 0) > 0 ||
      (prepared.ingredients.matcha ?? 0) > 0)
  ) {
    const isMatcha = (prepared.ingredients.matcha ?? 0) > 0 && !(prepared.ingredients.espresso ?? 0);
    return {
      ok: false,
      isPuhCoffeeReject: true,
      feedback: isMatcha
        ? 'Няв! Мені мама міцний зелений чай матча ще не дозволяє!'
        : 'Няв! Мені мама каву ще не дозволяє!',
    };
  }

  if (!prepared) {
    return {
      ok: false,
      feedback: `Ой, на таці ще немає напою! Я чекаю на «${spec.name}».`,
    };
  }

  if (spec.category === 'hot') {
    if (prepared.category !== 'hot') {
      return {
        ok: false,
        feedback: `Мені хотілося гарячого напою «${spec.name}» зі станції «Кава та какао»!`,
      };
    }

    const expectedMap = spec.hotIngredients ?? {};
    const actualMap = prepared.ingredients;

    for (const [key, needCount] of Object.entries(expectedMap) as [
      HotIngredientId,
      number,
    ][]) {
      const gotCount = actualMap[key] ?? 0;
      if (gotCount < needCount) {
        if (key === 'warmMilk' && needCount === 2 && gotCount === 1) {
          return {
            ok: false,
            feedback:
              'Мур, для цього напою потрібно вдвічі більше теплого молока (додай його ще раз)!',
          };
        }
        return {
          ok: false,
          feedback: `Здається, тут бракує інгредієнта «${HOT_INGREDIENT_LABELS[key]}» — зазирни в Книгу рецептів!`,
        };
      }
      if (gotCount > needCount) {
        if (key === 'warmMilk' && needCount === 1 && gotCount === 2) {
          return {
            ok: false,
            feedback: `Ой, для «${spec.name}» потрібна лише одна порція теплого молока, а не дві!`,
          };
        }
        return {
          ok: false,
          feedback: `Ой, тут забагато «${HOT_INGREDIENT_LABELS[key]}» для «${spec.name}»!`,
        };
      }
    }

    for (const [key, gotCount] of Object.entries(actualMap) as [
      HotIngredientId,
      number,
    ][]) {
      if ((gotCount ?? 0) > 0 && !(expectedMap[key] ?? 0)) {
        if (key === 'espresso' && spec.isBabyccino) {
          return {
            ok: false,
            feedback:
              'Бебічино готується зовсім без еспресо — тільки молоко, пінка й кориця!',
          };
        }
        return {
          ok: false,
          feedback: `Ой, у «${spec.name}» зайвий інгредієнт — «${HOT_INGREDIENT_LABELS[key]}»! Зазирни в Книгу рецептів.`,
        };
      }
    }

    return { ok: true, feedback: '' };
  }

  if (spec.category === 'cocktail') {
    if (prepared.category !== 'cocktail') {
      return {
        ok: false,
        feedback: `Я замовив освіжаючий «${spec.name}» у високому келиху на вкладці «Дитячі коктейлі»!`,
      };
    }

    const expectedList = spec.cocktailIngredients ?? [];
    const expectedSet = new Set<TallGlassIngredientId>(expectedList);
    const actualMap = prepared.ingredients;

    for (const key of expectedList) {
      if ((actualMap[key] ?? 0) < 1) {
        return {
          ok: false,
          feedback: `У «${spec.name}» бракує інгредієнта «${TALL_INGREDIENT_LABELS[key]}» — перевір Книгу рецептів!`,
        };
      }
    }

    for (const [key, gotCount] of Object.entries(actualMap) as [
      TallGlassIngredientId,
      number,
    ][]) {
      if ((gotCount ?? 0) > 0 && !expectedSet.has(key)) {
        return {
          ok: false,
          feedback: `Ой, у «${spec.name}» не треба додавати «${TALL_INGREDIENT_LABELS[key]}»!`,
        };
      }
    }

    return { ok: true, feedback: '' };
  }

  // Milkshake
  if (prepared.category !== 'milkshake') {
    return {
      ok: false,
      feedback: `Для «${spec.name}» треба змішати інгредієнти в блендері й натиснути «Збити!»`,
    };
  }

  const expectedBlender = spec.milkshakeIngredients ?? [];
  const expectedSet = new Set<BlenderIngredientId>(expectedBlender);
  for (const key of expectedBlender) {
    if ((prepared.blenderIngredients[key] ?? 0) < 1) {
      return {
        ok: false,
        feedback: `У «${spec.name}» бракує інгредієнта «${BLENDER_INGREDIENT_LABELS[key]}» — зазирни в Книгу рецептів!`,
      };
    }
  }
  for (const [key, gotCount] of Object.entries(prepared.blenderIngredients) as [
    BlenderIngredientId,
    number,
  ][]) {
    if ((gotCount ?? 0) > 0 && !expectedSet.has(key)) {
      return {
        ok: false,
        feedback: `Ой, у «${spec.name}» зайвий інгредієнт — «${BLENDER_INGREDIENT_LABELS[key]}»!`,
      };
    }
  }

  if (spec.needsWhippedCream && !prepared.whippedCream) {
    return {
      ok: false,
      feedback: `Ммм, пахне смачно, але бракує «Збитих вершків» зверху на «${spec.name}»!`,
    };
  }
  if (!spec.needsWhippedCream && prepared.whippedCream) {
    return {
      ok: false,
      feedback: `Ой, у рецепті «${spec.name}» немає збитих вершків — прибери їх!`,
    };
  }

  return { ok: true, feedback: '' };
}

function validateDrink(
  prepared: PreparedDrink | null,
  order: Order
): ValidationResult {
  if (order.drinkId === 'traveler_any') {
    return { ok: true, feedback: '' };
  }
  if (order.drinkId === 'secret_daily' && order.secretDrink) {
    return validateAgainstSpec(prepared, order.secretDrink, order.guestId);
  }
  const recipe =
    DRINK_RECIPES[
      order.drinkId === 'secret_daily' ? 'cocoa_marshmallow' : order.drinkId
    ];
  return validateAgainstSpec(
    prepared,
    {
      name: recipe.name,
      category: recipe.category,
      hotIngredients: recipe.hotIngredients,
      cocktailIngredients: recipe.cocktailIngredients,
      milkshakeIngredients: recipe.milkshakeIngredients,
      needsWhippedCream: recipe.needsWhippedCream,
      isBabyccino: recipe.id === 'babyccino',
    },
    order.guestId
  );
}

function validatePastry(
  prepared: PreparedPastry | null,
  expectedId: PastryRecipeId
): ValidationResult {
  const recipe = PASTRY_RECIPES[expectedId];
  const expected = recipe.expected;

  if (!prepared) {
    return {
      ok: false,
      feedback: `Напій чудовий, але на таці бракує випічки: «${recipe.name}»!`,
    };
  }

  if (prepared.type !== expected.type) {
    return {
      ok: false,
      feedback: `Ой, я замовляв інший смаколик — «${recipe.name}»! Зазирни на вкладку «Випічка».`,
    };
  }

  if (expected.type === 'croissant' && prepared.type === 'croissant') {
    if (expected.warmed && !prepared.warmed) {
      return {
        ok: false,
        feedback: 'Ой, круасан ще холодний — підігрій його в міні-пічці!',
      };
    }
    if (!expected.warmed && prepared.warmed) {
      return {
        ok: false,
        feedback: 'Ой, цього разу я хотів звичайний круасан, не підігрітий!',
      };
    }
    return { ok: true, feedback: '' };
  }

  if (expected.type === 'donut' && prepared.type === 'donut') {
    if (prepared.glaze === 'none') {
      const wantGlaze =
        expected.glaze === 'pink' ? 'рожеву полуничну' : 'шоколадну';
      return {
        ok: false,
        feedback: `Ой, пончик без глазурі! Додай ${wantGlaze} глазур!`,
      };
    }
    if (prepared.glaze !== expected.glaze) {
      const wantGlaze =
        expected.glaze === 'pink' ? 'рожевою полуничною' : 'шоколадною';
      return {
        ok: false,
        feedback: `Мені хотілося пончик із ${wantGlaze} глазур’ю!`,
      };
    }
    if (expected.sprinkles && !prepared.sprinkles) {
      return {
        ok: false,
        feedback: 'Глазур ідеальна, але ще бракує кольорової посипки на пончику!',
      };
    }
    if (!expected.sprinkles && prepared.sprinkles) {
      return {
        ok: false,
        feedback: 'Ой, я просив пончик без кольорової посипки — прибери посипку на вкладці «Випічка»!',
      };
    }
    return { ok: true, feedback: '' };
  }

  return { ok: true, feedback: '' };
}

export function validateOrder(
  order: Order,
  trayDrink: PreparedDrink | null,
  trayPastry: PreparedPastry | null
): ValidationResult {
  // Special Traveler Cat: kindness mechanic — accepts ANY drink or pastry on the tray!
  if (order.isTravelerGuest || order.drinkId === 'traveler_any') {
    if (!trayDrink && !trayPastry) {
      return {
        ok: false,
        feedback:
          'Поклади на тацю будь-який напій або смаколик — Котик-мандрівник буде щасливий пригоститися!',
      };
    }
    return { ok: true, feedback: '' };
  }

  // Check Puff's caffeine Easter Egg (espresso or matcha) immediately even if pastry is missing
  if (
    order.guestId === 'puh' &&
    trayDrink?.category === 'hot' &&
    ((trayDrink.ingredients.espresso ?? 0) > 0 ||
      (trayDrink.ingredients.matcha ?? 0) > 0)
  ) {
    const isMatcha =
      (trayDrink.ingredients.matcha ?? 0) > 0 &&
      !(trayDrink.ingredients.espresso ?? 0);
    return {
      ok: false,
      isPuhCoffeeReject: true,
      feedback: isMatcha
        ? 'Няв! Мені мама міцний зелений чай матча ще не дозволяє!'
        : 'Няв! Мені мама каву ще не дозволяє!',
    };
  }

  if (!trayDrink && !trayPastry) {
    return {
      ok: false,
      feedback: 'Таця ще порожня! Приготуй замовлення й натисни «На тацю».',
    };
  }

  const drinkRes = validateDrink(trayDrink, order);
  if (!drinkRes.ok) {
    return drinkRes;
  }

  if (order.serviceMode === 'takeaway' && trayDrink && !trayDrink.takeaway) {
    return {
      ok: false,
      feedback:
        'Я дуже поспішаю — спакуй, будь ласка, цей напій у стаканчик «Із собою» зі стікером!',
    };
  }

  if (order.pastryId) {
    const pastryRes = validatePastry(trayPastry, order.pastryId);
    if (!pastryRes.ok) {
      return pastryRes;
    }
  } else if (trayPastry) {
    return {
      ok: false,
      feedback:
        'Ой, дякую за смаколик, але сьогодні я замовляв лише напій! Прибери випічку з таці.',
    };
  }

  return { ok: true, feedback: '' };
}
