import type {
  BirthdayThemeId,
  DrinkRecipeId,
  PastryRecipeId,
  RegularGuestId,
  UnlockableRecipeId,
} from '../types/game';

export const BIRTHDAY_FINALE_BONUS_COINS = 40;
export const BIRTHDAY_STORY_DAYS = 3;

export interface BirthdayThemeMeta {
  id: BirthdayThemeId;
  icon: string;
  title: string;
  shortTitle: string;
  tagline: string;
  decorDescription: string;
  treatSummary: string;
  cardBg: string;
  cardBorder: string;
  pillBg: string;
  pillText: string;
  accentColor: string;
  /** Prep Day 1 helper guest & themed order */
  prepDay1Guest: RegularGuestId;
  prepDay1Drink: DrinkRecipeId;
  prepDay1Pastry: PastryRecipeId;
  prepDay1Greeting: string;
  /** Prep Day 2 helper guest & themed order */
  prepDay2Guest: RegularGuestId;
  prepDay2Drink: DrinkRecipeId;
  prepDay2Pastry: PastryRecipeId;
  prepDay2Greeting: string;
  /** Day 3 Finale — Puff's caffeine-free birthday feast! */
  finaleDrink: DrinkRecipeId;
  finalePastry: PastryRecipeId;
  finaleWantsLatteArt?: boolean;
  finaleGreeting: string;
  finalePraise: string;
  /** Storybook postcard memory line */
  postcardTitle: string;
  postcardMessage: string;
  day1EveningNote: string;
  day2EveningNote: string;
}

export const BIRTHDAY_THEME_ORDER: BirthdayThemeId[] = [
  'strawberry',
  'space',
  'forest',
];

export const BIRTHDAY_THEMES: Record<BirthdayThemeId, BirthdayThemeMeta> = {
  strawberry: {
    id: 'strawberry',
    icon: '🍓',
    title: 'Полунична вечірка',
    shortTitle: 'Полунична',
    tagline: 'Рожеві прапорці з ягідками, солодкі мілкшейки й ягідний тортик!',
    decorDescription:
      'Ягідна гірлянда під стелею та кремова підставка з полуничним тістечком на стійці',
    treatSummary: 'Полуничний мілкшейк і рожевий пончик із посипкою',
    cardBg: 'linear-gradient(155deg, #FFF3F7 0%, #FADCE6 100%)',
    cardBorder: '#D67F9B',
    pillBg: '#FCE8EF',
    pillText: '#872D4B',
    accentColor: '#E56D93',
    prepDay1Guest: 'miya',
    prepDay1Drink: 'strawberry_milkshake',
    prepDay1Pastry: 'donut_pink',
    prepDay1Greeting:
      'Тссс! Я готую полуничні прапорці для свята Пуха! Спробуймо разом «Полуничний мілкшейк» і «Пончик із рожевою глазур’ю» — щоб усе було найсмачніше!',
    prepDay2Guest: 'luna',
    prepDay2Drink: 'strawberry_milkshake',
    prepDay2Pastry: 'donut_pink_sprinkles',
    prepDay2Greeting:
      'Завтра день народження Пуха! Я вже повісила рожеві стрічки — перевірмо святкове частування: «Полуничний мілкшейк» і «Рожевий пончик із посипкою»!',
    finaleDrink: 'strawberry_milkshake',
    finalePastry: 'donut_pink_sprinkles',
    finaleGreeting:
      'Ой, як тут гарно — усе в полуничках! Сюрприз для мене?! Муррр! Можна мені святковий «Полуничний мілкшейк» і «Рожевий пончик із посипкою»?',
    finalePraise:
      'Ура-а-а! Це найсолодший Полуничний день народження у світі! Дякую тобі, люба бариста, і всім друзям!',
    postcardTitle: '🍓 Полуничне свято Пуха!',
    postcardMessage:
      'У кав’ярні пахло стиглою полуницею, рожеві прапорці тріпотіли над вікном, а щасливе Кошеня Пух загадало найдобріше бажання!',
    day1EveningNote:
      'День 1/3 підготовки: полуничні прапорці вже прикрашають кав’ярню, а Мія в захваті від дегустації!',
    day2EveningNote:
      'День 2/3 підготовки: ягідний тортик уже на стійці! Завтра завітає іменинник — Кошеня Пух!',
  },
  space: {
    id: 'space',
    icon: '🚀',
    title: 'Космічна подорож',
    shortTitle: 'Космічна',
    tagline: 'Зоряні прапорці з місяцем і планетами, маршмелоу-комети та зоряна посипка!',
    decorDescription:
      'Космічна гірлянда з планетами й ракетами та сяючий ліхтарик-місяць на стійці',
    treatSummary: 'Какао з маршмелоу та шоколадний пончик із зоряною посипкою',
    cardBg: 'linear-gradient(155deg, #F3F0FC 0%, #DFD6F6 100%)',
    cardBorder: '#8D74BF',
    pillBg: '#EFEAF9',
    pillText: '#4C3678',
    accentColor: '#7E64B5',
    prepDay1Guest: 'luna',
    prepDay1Drink: 'sunrise',
    prepDay1Pastry: 'donut_chocolate',
    prepDay1Greeting:
      'Тссс! Ми готуємо Космічне свято для Пуха! Зроби, будь ласка, галактичний «Коктейль «Санрайз»» і «Пончик із шоколадною глазур’ю» на пробу!',
    prepDay2Guest: 'sofiya',
    prepDay2Drink: 'cocoa_marshmallow',
    prepDay2Pastry: 'donut_chocolate_sprinkles',
    prepDay2Greeting:
      'Я вирізала зірочки й Сатурн із золотого паперу! Перевірмо космічне меню для Пуха: «Какао з маршмелоу» та «Шоколадний пончик із посипкою»!',
    finaleDrink: 'cocoa_marshmallow',
    finalePastry: 'donut_chocolate_sprinkles',
    finaleWantsLatteArt: true,
    finaleGreeting:
      'Вау!! Справжній космос, ракети й зірочки — і це все для мене?! Муррр! Зроби мені святкове «Какао з маршмелоу» й «Шоколадний пончик із посипкою»!',
    finalePraise:
      'Мяу-у-у! Я ніби побував на справжній солодкій планеті! Найкращий Космічний день народження!',
    postcardTitle: '🚀 Космічне свято Пуха!',
    postcardMessage:
      'Над стійкою мерехтіли золоті планети й ракети, маршмелоу плавали немов комети, а Пух радісно махав лапкою зі свого свята!',
    day1EveningNote:
      'День 1/3 підготовки: зоряна гірлянда з планетами вже світиться в кав’ярні! Луна в захваті!',
    day2EveningNote:
      'День 2/3 підготовки: космічний ліхтарик на стійці готовий! Завтра великий день народження Пуха!',
  },
  forest: {
    id: 'forest',
    icon: '🌲',
    title: 'Лісова казка',
    shortTitle: 'Лісова',
    tagline: 'Листочки, грибочки, золоті жолуді, ніжне бебічіно та запашна випічка!',
    decorDescription:
      'Лісова гірлянда з листочків і мухоморчиків та затишний лісовий пеньочок зі свічкою на стійці',
    treatSummary: 'Ніжне Бебічіно та теплий круасан (або морквяний кекс)',
    cardBg: 'linear-gradient(155deg, #EFF9F1 0%, #D3ECDA 100%)',
    cardBorder: '#6BA37C',
    pillBg: '#E6F5EA',
    pillText: '#235736',
    accentColor: '#58966B',
    prepDay1Guest: 'persyk',
    prepDay1Drink: 'kids_mojito',
    prepDay1Pastry: 'warm_croissant',
    prepDay1Greeting:
      'Тссс! Ми прикрашаємо кав’ярню як затишну лісову галявину для Пуха! Спробуймо свіжий «Дитячий Мохіто» і «Теплий круасан» для нашого свята!',
    prepDay2Guest: 'miya',
    prepDay2Drink: 'babyccino',
    prepDay2Pastry: 'warm_croissant',
    prepDay2Greeting:
      'Я принесла лісові листочки й маленькі шишки! Прорепетируймо улюблене частування Пуха: ніжне «Бебічіно» і «Теплий круасан»!',
    finaleDrink: 'babyccino',
    finalePastry: 'warm_croissant',
    finaleWantsLatteArt: true,
    finaleGreeting:
      'Ой, як затишно — справжня лісова галявина з листочками й грибочками! Сюрприз на мій день народження?! Можна мені святкове «Бебічіно» й теплий смаколик?',
    finalePraise:
      'Муррр! Це найтепліша Лісова казка на світі! Дякую за чарівне свято й ароматні смаколики!',
    postcardTitle: '🌲 Лісове свято Пуха!',
    postcardMessage:
      'У кав’ярні розквітла зелена лісова гірлянда, пахло свіжим молочком і випічкою, а Кошеня Пух обійняло всіх друзів!',
    day1EveningNote:
      'День 1/3 підготовки: лісова гірлянда з листочками й грибочками вже прикрашає вікно!',
    day2EveningNote:
      'День 2/3 підготовки: на стійці засяяв лісовий ліхтарик-пеньочок! Завтра святкуємо День народження Пуха!',
  },
};

/** Resolves the theme pastry safely (uses carrot_cake for Forest finale ONLY if unlocked!) */
export function resolveBirthdayPastry(
  themeId: BirthdayThemeId,
  role: 'prep_day1' | 'prep_day2' | 'finale_party',
  unlockedRecipes: UnlockableRecipeId[]
): PastryRecipeId {
  const theme = BIRTHDAY_THEMES[themeId];
  if (
    themeId === 'forest' &&
    role === 'finale_party' &&
    unlockedRecipes.includes('carrot_cake')
  ) {
    return 'carrot_cake';
  }
  if (role === 'prep_day1') return theme.prepDay1Pastry;
  if (role === 'prep_day2') return theme.prepDay2Pastry;
  return theme.finalePastry;
}
