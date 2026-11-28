import {
  BIRTHDAY_THEMES,
  resolveBirthdayPastry,
} from './birthdayStory.ts';
import type {
  BirthdayThemeId,
  DrinkRecipeId,
  GuestId,
  Order,
  PastryRecipeId,
  RegularGuestId,
  SecretDrinkRecipe,
  ServiceMode,
  TravelerWishCategory,
  UnlockableRecipeId,
  WeatherType,
} from '../types/game';

export const BEST_FRIEND_THRESHOLD = 3;

const COLD_DRINK_IDS = new Set<DrinkRecipeId>([
  'strawberry_milkshake',
  'kids_mojito',
  'sunrise',
]);

const LATTE_ART_ELIGIBLE_DRINKS = new Set<DrinkRecipeId>([
  'cappuccino',
  'cappuccino_cinnamon',
  'babyccino',
  'latte',
  'matcha_latte',
]);

export interface GuestProfile {
  id: GuestId;
  name: string;
  subtitle: string;
  accentBg: string;
  accentBorder: string;
  greetings: string[];
  weatherGreetings: Record<WeatherType, string>;
  praises: string[];
  favoriteDrinks: DrinkRecipeId[];
  favoritePastries: PastryRecipeId[];
  /** Friendship Album (Phase 3) */
  secretFact: string;
  favoriteComboLabel: string;
  souvenirName: string;
  souvenirEmoji: string;
  isTraveler?: boolean;
}

export const GUESTS: Record<GuestId, GuestProfile> = {
  puh: {
    id: 'puh',
    name: 'Кошеня Пух',
    subtitle: 'Пухнастий ласунчик',
    accentBg: '#FCF0F3',
    accentBorder: '#E9B4C2',
    greetings: [
      'Мяу-мяу! Можна мені щось дуже смачненьке?',
      'Привіт! Я прибіг по свій улюблений смаколик!',
    ],
    weatherGreetings: {
      sunny: 'Мяу! Сьогодні так сонячно — хочу солодкий смаколик!',
      rainy: 'Надворі дощик... Зробиш мені щось тепленьке й ніжне?',
      snowy: 'Брр, на вулиці сніжок! Хочу зігрітися в «Мур-Лате»!',
    },
    praises: [
      'Муррр! Це найсмачніше у світі! Дякую!',
      'Няв-няв! Так ніжно й солодко! Ти супер-бариста!',
    ],
    favoriteDrinks: ['babyccino', 'cocoa_marshmallow', 'strawberry_milkshake'],
    favoritePastries: ['donut_pink_sprinkles', 'donut_pink'],
    secretFact:
      'Щовечора перед сном Пух рахує уявні зефірки-маршмелоу замість овечок!',
    favoriteComboLabel: 'Какао з маршмелоу + Пончик із рожевою глазур’ю',
    souvenirName: 'Клубочок рожевих ниток',
    souvenirEmoji: '🧶',
  },
  persyk: {
    id: 'persyk',
    name: 'Кіт Персик',
    subtitle: 'Затишний гурман',
    accentBg: '#FBF0DF',
    accentBorder: '#DFB07C',
    greetings: [
      'Мур-привіт! Так пахне корицею й випічкою!',
      'Доброго дня! Хочу погрітися чимось запашним.',
    ],
    weatherGreetings: {
      sunny: 'Сонечко світить, а в кав’ярні так пахне корицею!',
      rainy: 'У такий дощик найкраще — капучино й теплий круасан!',
      snowy: 'За вікном снігопад — час зігрітися пухким капучино!',
    },
    praises: [
      'Муррр~ Справжня насолода! Аж вуса радіють!',
      'Ідеально! Найзатишніша кав’ярня в місті!',
    ],
    favoriteDrinks: ['cappuccino_cinnamon', 'cappuccino'],
    favoritePastries: ['warm_croissant', 'croissant'],
    secretFact:
      'Персик зберігає вдома цілу баночку запашних паличок кориці та веде щоденник найкращих круасанів!',
    favoriteComboLabel: 'Капучино з корицею + Теплий круасан',
    souvenirName: 'Золотий осінній листок у рамці',
    souvenirEmoji: '🍂',
  },
  luna: {
    id: 'luna',
    name: 'Лисичка Луна',
    subtitle: 'Стильна мрійниця',
    accentBg: '#F5EDF8',
    accentBorder: '#CCA7D9',
    greetings: [
      'Привіт-привіт! Я мрію про яскравий коктейль!',
      'Вітаю! Зробиш для мене щось особливо красиве?',
    ],
    weatherGreetings: {
      sunny: 'У спекотний день я мрію про прохолодний яскравий коктейль!',
      rainy: 'Хоч надворі дощ, яскравий коктейль підніме мені настрій!',
      snowy: 'Сніжинки танцюють, а мені хочеться казкового напою!',
    },
    praises: [
      'Вау, просто чарівно! І на смак — казка!',
      'Ох, аж хвостик радіє! Ти готуєш як справжня чарівниця!',
    ],
    favoriteDrinks: ['sunrise', 'strawberry_milkshake'],
    favoritePastries: ['chocolate_cookie'],
    secretFact:
      'Луна любить дивитися на вечірнє небо й вигадувати сузір’ям назви на честь смачних коктейлів!',
    favoriteComboLabel: 'Коктейль «Санрайз» + Печиво з шоколадом',
    souvenirName: 'Маленька зірочка-підвіска',
    souvenirEmoji: '🔮',
  },
  marsel: {
    id: 'marsel',
    name: 'Ведмедик Марсель',
    subtitle: 'Джентльмен у метелику',
    accentBg: '#F6EFE6',
    accentBorder: '#C7A688',
    greetings: [
      'Добридень! Один бездоганний напій, будь ласка.',
      'Мої вітання! Час для вишуканої кавової паузи.',
    ],
    weatherGreetings: {
      sunny: 'Чудовий сонячний ранок для вишуканої чашечки кави!',
      rainy: 'Дощовий день створений для ніжного лате й пончика!',
      snowy: 'У сніжну погоду чашка теплої кави — справжній скарб!',
    },
    praises: [
      'Браво! Бездоганний смак, мої оплески!',
      'Чудова робота! Обов’язково завітаю ще!',
    ],
    favoriteDrinks: ['latte', 'americano'],
    favoritePastries: ['donut_chocolate', 'donut_chocolate_sprinkles'],
    secretFact:
      'У Марселя вдома є аж сім бордових оксамитових краваток-метеликів — по одній на кожен день тижня!',
    favoriteComboLabel: 'Лате + Пончик із шоколадною глазур’ю',
    souvenirName: 'Вінтажна порцелянова чашечка',
    souvenirEmoji: '☕',
  },
  sofiya: {
    id: 'sofiya',
    name: 'Сова Софія',
    subtitle: 'Сонна бібліотекарка',
    accentBg: '#F5EDE1',
    accentBorder: '#C7A684',
    greetings: [
      'Угу-у... Я читала всю ніч... Мені б міцної кави...',
      'Позіхаю... Привіт! Допоможи прокинутись, будь ласка...',
    ],
    weatherGreetings: {
      sunny: 'Ой, сонечко вже високо, а я ще сонна... Кави б...',
      rainy: 'Під шум дощу так хилить у сон... Допоможи прокинутись!',
      snowy: 'Угу-у... Сніжно й сонно... Мені б гарячої кави...',
    },
    praises: [
      'Ух ти! Очі розплющились! Я знову сповнена сил!',
      'Яка бадьора кава! Тепер прочитаю ще три книжки!',
    ],
    favoriteDrinks: ['espresso', 'americano'],
    favoritePastries: ['warm_croissant', 'chocolate_cookie'],
    secretFact:
      'Ночами при місячному світлі Софія пише добрі казки про кав’ярню «Мур-Лате» та її гостей!',
    favoriteComboLabel: 'Американо + Теплий круасан',
    souvenirName: 'Стопка міні-книжок',
    souvenirEmoji: '📚',
  },
  miya: {
    id: 'miya',
    name: 'Кролиця Мія',
    subtitle: 'Весела стрибунка',
    accentBg: '#EAF4EC',
    accentBorder: '#97C5A5',
    greetings: [
      'Привіт-привіт! Після пробіжки хочу чогось свіженького!',
      'Скок-поскок! У вас найкращі коктейлі та випічка!',
    ],
    weatherGreetings: {
      sunny: 'У таку спеку після пробіжки хочу крижаний Мохіто!',
      rainy: 'Я прибігла з-під дощу! Хочу смачненького й затишного!',
      snowy: 'Я настрибалася по снігу! Час на улюблене частування!',
    },
    praises: [
      'Юхуу! Як освіжає! Аж вушка танцюють!',
      'Неймовірно смачно! Велике кроляче дякую!',
    ],
    favoriteDrinks: ['kids_mojito'],
    favoritePastries: ['warm_croissant', 'chocolate_cookie'],
    secretFact:
      'Щоранку Мія робить рівно 100 веселих стрибків у саду й мріє про найпухкіший морквяний кекс!',
    favoriteComboLabel: 'Дитячий Мохіто + Морквяний кекс',
    souvenirName: 'Керамічна баночка-морквинка',
    souvenirEmoji: '🥕',
  },
  mandrivnyk: {
    id: 'mandrivnyk',
    name: 'Котик-мандрівник',
    subtitle: 'Добрий мандрівник із лісів',
    accentBg: '#FDF3DF',
    accentBorder: '#D5A25A',
    greetings: [
      'Я йду здалеку й трохи змерз... Чи не пригостиш мене просто так?',
    ],
    weatherGreetings: {
      sunny:
        'Я йду здалеку під спекотним сонцем і трохи втомився… Чи не пригостиш мене просто так?',
      rainy:
        'Я йду здалеку крізь дощ і трохи змерз… Чи не пригостиш мене просто так?',
      snowy:
        'Я йду здалеку крізь сніги й трохи змерз… Чи не пригостиш мене просто так?',
    },
    praises: [
      'Щиро дякую за твоє добре серце! Прийми на згадку мій рідкісний сувенір із мандрів!',
    ],
    favoriteDrinks: ['cocoa_marshmallow'],
    favoritePastries: ['warm_croissant'],
    secretFact:
      'Котик-мандрівник обійшов усі лісові стежки й збирає найрідкісніші наліпки-талісмани для добрих друзів!',
    favoriteComboLabel: 'Будь-яке частування від щирого серця 💛',
    souvenirName: 'Щаслива шишка та рідкісні стікери',
    souvenirEmoji: '🌰',
    isTraveler: true,
  },
};

export const REGULAR_GUEST_IDS: RegularGuestId[] = [
  'puh',
  'persyk',
  'luna',
  'marsel',
  'sofiya',
  'miya',
];

const COLD_LOVING_GUESTS: RegularGuestId[] = ['miya', 'luna', 'puh'];
const WARM_LOVING_GUESTS: RegularGuestId[] = [
  'puh',
  'persyk',
  'marsel',
  'sofiya',
];
const MATCHA_LOVING_GUESTS: RegularGuestId[] = [
  'persyk',
  'luna',
  'marsel',
  'miya',
];
const CARROT_CAKE_LOVING_GUESTS: RegularGuestId[] = [
  'miya',
  'puh',
  'persyk',
  'sofiya',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function isBestFriend(
  friendship: Partial<Record<GuestId, number>>,
  guestId: GuestId
): boolean {
  if (guestId === 'mandrivnyk') return false;
  return (friendship[guestId] ?? 0) >= BEST_FRIEND_THRESHOLD;
}

export interface GenerateOrderOptions {
  secretDrink?: SecretDrinkRecipe | null;
  forceSecretDrink?: boolean;
  forceTakeaway?: boolean;
  unlockedRecipes?: UnlockableRecipeId[];
  forceTraveler?: boolean;
  forceUnlockedRecipe?: UnlockableRecipeId | null;
  birthdayStory?: {
    role: 'prep_day1' | 'prep_day2' | 'finale_party';
    theme: BirthdayThemeId;
  } | null;
}

/**
 * Generates a guest order influenced by weather, Phase 2 creative features, and Phase 3 specials:
 * - Orders 1–2: welcoming single-drink dine-in orders.
 * - Take-away «🏃 Із собою»: #4, #7, #10, #13, #16...
 * - Special «🎒 Котик-мандрівник»: roughly every 6–7 guests (#8, #14, #20, #26...) or forced!
 * - Unlocked shop recipes (`matcha_latte`, `carrot_cake`) naturally join guest menus (and immediately showcase on purchase!).
 * - Secret Drink of the Day: ~25% of orders (or immediately after saving), Puff excluded if espresso is inside.
 */
export function generateOrder(
  orderNumber: number,
  weather: WeatherType = 'sunny',
  previousGuestId?: GuestId,
  options: GenerateOrderOptions = {}
): Order {
  const {
    secretDrink,
    forceSecretDrink,
    forceTakeaway,
    unlockedRecipes = [],
    forceTraveler,
    forceUnlockedRecipe,
    birthdayStory,
  } = options;

  const hasMatcha = unlockedRecipes.includes('matcha_latte');
  const hasCarrotCake = unlockedRecipes.includes('carrot_cake');

  // 0. Scripted Story Chapter moment («День народження Пуха» — theme-specific treats & Puff's party!)
  if (birthdayStory) {
    const themeMeta = BIRTHDAY_THEMES[birthdayStory.theme];
    const pastryId = resolveBirthdayPastry(
      birthdayStory.theme,
      birthdayStory.role,
      unlockedRecipes
    );

    if (birthdayStory.role === 'prep_day1') {
      return {
        id: orderNumber,
        guestId: themeMeta.prepDay1Guest,
        drinkId: themeMeta.prepDay1Drink,
        pastryId,
        isCombo: true,
        weatherAtArrival: weather,
        serviceMode: 'dine-in',
        birthdayStoryRole: 'prep_day1',
        birthdayTheme: birthdayStory.theme,
      };
    }

    if (birthdayStory.role === 'prep_day2') {
      return {
        id: orderNumber,
        guestId: themeMeta.prepDay2Guest,
        drinkId: themeMeta.prepDay2Drink,
        pastryId,
        isCombo: true,
        weatherAtArrival: weather,
        serviceMode: 'dine-in',
        birthdayStoryRole: 'prep_day2',
        birthdayTheme: birthdayStory.theme,
      };
    }

    // Grand Day 3 Finale: Кошеня Пух's Birthday Party (100% caffeine-free!)
    return {
      id: orderNumber,
      guestId: 'puh',
      drinkId: themeMeta.finaleDrink,
      pastryId,
      isCombo: true,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
      wantsLatteArt: themeMeta.finaleWantsLatteArt,
      birthdayStoryRole: 'finale_party',
      birthdayTheme: birthdayStory.theme,
    };
  }

  // 1. Immediate showcase when player creates a brand-new Secret Drink!
  if (secretDrink && forceSecretDrink) {
    const hasCaffeine =
      secretDrink.category === 'hot' &&
      ((secretDrink.hotIngredients?.espresso ?? 0) > 0 ||
        (secretDrink.hotIngredients?.matcha ?? 0) > 0);
    const pool = REGULAR_GUEST_IDS.filter(
      (id) => id !== previousGuestId && (!hasCaffeine || id !== 'puh')
    );
    const guestId = pickRandom(pool);
    const wantsLatteArt =
      secretDrink.category === 'hot' &&
      ((secretDrink.hotIngredients?.foam ?? 0) > 0 ||
        (secretDrink.hotIngredients?.warmMilk ?? 0) > 0);
    return {
      id: orderNumber,
      guestId,
      drinkId: 'secret_daily',
      secretDrink,
      isCombo: false,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
      wantsLatteArt,
    };
  }

  // 2. Immediate showcase when player unlocks a brand-new Shop Recipe!
  if (forceUnlockedRecipe === 'matcha_latte' && hasMatcha) {
    const pool = MATCHA_LOVING_GUESTS.filter((id) => id !== previousGuestId);
    const guestId = pickRandom(pool.length > 0 ? pool : MATCHA_LOVING_GUESTS);
    return {
      id: orderNumber,
      guestId,
      drinkId: 'matcha_latte',
      isCombo: false,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
      wantsLatteArt: true,
    };
  }
  if (forceUnlockedRecipe === 'carrot_cake' && hasCarrotCake) {
    const guestId: RegularGuestId =
      previousGuestId === 'miya' ? 'persyk' : 'miya';
    const guest = GUESTS[guestId];
    return {
      id: orderNumber,
      guestId,
      drinkId: pickRandom(guest.favoriteDrinks),
      pastryId: 'carrot_cake',
      isCombo: true,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
    };
  }

  // 3. Special Traveler Cat «Котик-мандрівник» (~every 6 guests: #8, #14, #20, #26... or forced)
  const isScheduledTraveler =
    orderNumber >= 8 && (orderNumber - 2) % 6 === 0 && previousGuestId !== 'mandrivnyk';
  if (forceTraveler || isScheduledTraveler) {
    const wishCategories: TravelerWishCategory[] =
      weather === 'sunny' ? ['cold', 'pastry', 'hot'] : ['hot', 'pastry', 'cold'];
    const wish = wishCategories[Math.floor(orderNumber / 6) % wishCategories.length];
    return {
      id: orderNumber,
      guestId: 'mandrivnyk',
      drinkId: 'traveler_any',
      isCombo: false,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
      isTravelerGuest: true,
      travelerWishCategory: wish,
    };
  }

  // Friendly opening pair: simple single dine-in drinks
  if (orderNumber === 1) {
    return {
      id: 1,
      guestId: 'puh',
      drinkId: 'cocoa_marshmallow',
      isCombo: false,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
    };
  }
  if (orderNumber === 2) {
    return {
      id: 2,
      guestId: 'sofiya',
      drinkId: 'americano',
      isCombo: false,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
    };
  }

  // Roughly every 3rd guest after #2 (#4, #7, #10, #13, #16...) is a «🏃 Із собою» take-away order
  const serviceMode: ServiceMode =
    forceTakeaway || (orderNumber >= 4 && (orderNumber - 1) % 3 === 0)
      ? 'takeaway'
      : 'dine-in';

  // Orders 3–6 showcase all remaining characters & features smoothly
  if (orderNumber === 3) {
    return {
      id: 3,
      guestId: 'persyk',
      drinkId: 'cappuccino_cinnamon',
      pastryId: 'warm_croissant',
      isCombo: true,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
      wantsLatteArt: true,
    };
  }
  if (orderNumber === 4) {
    return {
      id: 4,
      guestId: 'miya',
      drinkId: 'kids_mojito',
      isCombo: false,
      weatherAtArrival: weather,
      serviceMode: 'takeaway',
    };
  }
  if (orderNumber === 5) {
    return {
      id: 5,
      guestId: 'luna',
      drinkId: 'strawberry_milkshake',
      pastryId: 'chocolate_cookie',
      isCombo: true,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
    };
  }
  if (orderNumber === 6) {
    return {
      id: 6,
      guestId: 'marsel',
      drinkId: 'latte',
      isCombo: false,
      weatherAtArrival: weather,
      serviceMode: 'dine-in',
      wantsLatteArt: true,
    };
  }

  // Orders 7+: Alternate combo & single, weather-aware + Secret Drink + Unlocked Recipes!
  const isCombo = orderNumber % 2 === 1;

  // ~25% chance to request the player's Secret Drink of the Day (if created)
  if (secretDrink && Math.random() < 0.25) {
    const hasCaffeine =
      secretDrink.category === 'hot' &&
      ((secretDrink.hotIngredients?.espresso ?? 0) > 0 ||
        (secretDrink.hotIngredients?.matcha ?? 0) > 0);
    const pool = REGULAR_GUEST_IDS.filter(
      (id) => id !== previousGuestId && (!hasCaffeine || id !== 'puh')
    );
    const guestId = pickRandom(pool);
    const guest = GUESTS[guestId];
    const guestPastries: PastryRecipeId[] =
      hasCarrotCake && CARROT_CAKE_LOVING_GUESTS.includes(guestId)
        ? [...guest.favoritePastries, 'carrot_cake']
        : guest.favoritePastries;
    const pastryId = isCombo ? pickRandom(guestPastries) : undefined;
    const wantsLatteArt =
      serviceMode === 'dine-in' &&
      secretDrink.category === 'hot' &&
      ((secretDrink.hotIngredients?.foam ?? 0) > 0 ||
        ((secretDrink.hotIngredients?.warmMilk ?? 0) > 0 &&
          ((secretDrink.hotIngredients?.cocoa ?? 0) > 0 ||
            (secretDrink.hotIngredients?.espresso ?? 0) > 0 ||
            (secretDrink.hotIngredients?.matcha ?? 0) > 0))) &&
      Math.random() < 0.5;

    return {
      id: orderNumber,
      guestId,
      drinkId: 'secret_daily',
      secretDrink,
      pastryId,
      isCombo,
      weatherAtArrival: weather,
      serviceMode,
      wantsLatteArt,
    };
  }

  const preferCold =
    weather === 'sunny' ? Math.random() < 0.68 : Math.random() < 0.2;

  const preferredPool = (
    preferCold ? COLD_LOVING_GUESTS : WARM_LOVING_GUESTS
  ).filter((id) => id !== previousGuestId);
  const fallbackPool = REGULAR_GUEST_IDS.filter((id) => id !== previousGuestId);
  const guestId =
    preferredPool.length > 0
      ? pickRandom(preferredPool)
      : pickRandom(fallbackPool);

  const guest = GUESTS[guestId];

  const availableDrinks: DrinkRecipeId[] =
    hasMatcha && MATCHA_LOVING_GUESTS.includes(guestId)
      ? [...guest.favoriteDrinks, 'matcha_latte']
      : guest.favoriteDrinks;

  const coldDrinks = availableDrinks.filter((d) => COLD_DRINK_IDS.has(d));
  const hotDrinks = availableDrinks.filter((d) => !COLD_DRINK_IDS.has(d));

  let drinkId: DrinkRecipeId;
  if (weather === 'sunny' && coldDrinks.length > 0 && Math.random() < 0.72) {
    drinkId = pickRandom(coldDrinks);
  } else if (weather !== 'sunny' && hotDrinks.length > 0 && Math.random() < 0.82) {
    drinkId = pickRandom(hotDrinks);
  } else {
    drinkId = pickRandom(availableDrinks);
  }

  let pastryId: PastryRecipeId | undefined;
  if (isCombo) {
    const availablePastries: PastryRecipeId[] =
      hasCarrotCake && CARROT_CAKE_LOVING_GUESTS.includes(guestId)
        ? [...guest.favoritePastries, 'carrot_cake']
        : guest.favoritePastries;

    if (hasCarrotCake && guestId === 'miya' && Math.random() < 0.6) {
      pastryId = 'carrot_cake';
    } else if (
      weather !== 'sunny' &&
      availablePastries.includes('warm_croissant') &&
      Math.random() < 0.7
    ) {
      pastryId = 'warm_croissant';
    } else {
      pastryId = pickRandom(availablePastries);
    }
  }

  const wantsLatteArt =
    serviceMode === 'dine-in' &&
    LATTE_ART_ELIGIBLE_DRINKS.has(drinkId) &&
    Math.random() < 0.5;

  return {
    id: orderNumber,
    guestId,
    drinkId,
    pastryId,
    isCombo,
    weatherAtArrival: weather,
    serviceMode,
    wantsLatteArt,
  };
}

export function buildOrderGreeting(
  order: Order,
  drinkName: string,
  weather: WeatherType
): string {
  // Step 05: Puff's Birthday Story Chapter scripted dialogues
  if (order.birthdayStoryRole && order.birthdayTheme) {
    const themeMeta = BIRTHDAY_THEMES[order.birthdayTheme];
    if (order.birthdayStoryRole === 'prep_day1') {
      return themeMeta.prepDay1Greeting;
    }
    if (order.birthdayStoryRole === 'prep_day2') {
      return themeMeta.prepDay2Greeting;
    }
    return themeMeta.finaleGreeting;
  }

  // Special Traveler Cat greeting
  if (order.isTravelerGuest) {
    const feeling = weather === 'sunny' ? 'втомився' : 'змерз';
    const wishText =
      order.travelerWishCategory === 'cold'
        ? 'прохолодним коктейлем'
        : order.travelerWishCategory === 'pastry'
          ? 'смаколиком'
          : 'теплим напоєм';
    return `Я йду здалеку й трохи ${feeling}… Чи не пригостиш мене будь-яким ${wishText} просто так?`;
  }

  // Secret drink greeting
  if (order.drinkId === 'secret_daily' && order.secretDrink) {
    if (order.serviceMode === 'takeaway') {
      return `Ой, поспішаю, але вже знаю про ваш секретний «${drinkName}»! Зроби, будь ласка, із собою та зі стікером!`;
    }
    return `Я вже знаю про ваш секретний «${drinkName}»! Приготуєш мені його?`;
  }

  // Take-away greeting
  if (order.serviceMode === 'takeaway') {
    return `Ой, дуже поспішаю! Зроби, будь ласка, мені «${drinkName}» із собою — і наклей гарний стікер на стаканчик!`;
  }

  // Newly unlocked Matcha-Latte or Carrot Cake dedicated greetings so text ALWAYS matches order pill!
  if (order.drinkId === 'matcha_latte') {
    const baseMatcha =
      'Ой, у вас у меню з’явився ніжний «Матча-Лате»! Приготуєш мені його?';
    return order.wantsLatteArt
      ? `${baseMatcha} І намалюй, будь ласка, щось гарненьке на пінці!`
      : baseMatcha;
  }
  if (order.pastryId === 'carrot_cake') {
    const baseCarrot = `Ммм, так пахне свіжим «Морквяним кексом»! Зробиш мені «${drinkName}» і кекс?`;
    return order.wantsLatteArt
      ? `${baseCarrot} І гарний малюнок на пінці!`
      : baseCarrot;
  }

  // Regular / Weather greeting + optional Latte Art wish
  const guest = GUESTS[order.guestId];
  const base =
    order.id >= 3 || weather !== 'sunny'
      ? order.id % 2 === 1 || weather !== 'sunny'
        ? guest.weatherGreetings[weather]
        : guest.greetings[order.id % guest.greetings.length]
      : guest.greetings[order.id % guest.greetings.length];

  if (order.wantsLatteArt) {
    return order.drinkId === 'latte'
      ? `${base} І намалюй, будь ласка, щось гарненьке на молочній шапочці!`
      : `${base} І намалюй, будь ласка, щось гарненьке на пінці!`;
  }
  return base;
}

export function buildOrderPraise(
  order: Order,
  options: {
    hasLatteArt: boolean;
    hasTakeawayDecor: boolean;
    wishText?: string;
    isSecretDrink: boolean;
    isBestFriendBonus?: boolean;
    travelerGiftLabel?: string;
    travelerAllCollected?: boolean;
  }
): string {
  if (order.birthdayStoryRole === 'finale_party' && order.birthdayTheme) {
    return BIRTHDAY_THEMES[order.birthdayTheme].finalePraise;
  }
  if (order.birthdayStoryRole && order.birthdayTheme) {
    const themeTitle = BIRTHDAY_THEMES[order.birthdayTheme].title;
    return `Смакота! «${themeTitle}» для Пуха буде просто чарівною — тримай бонус!`;
  }

  if (order.isTravelerGuest) {
    if (options.travelerGiftLabel) {
      return `Ой, яке ж у тебе добре серце! Дякую за частування! Дарую тобі рідкісний стікер «${options.travelerGiftLabel}» на згадку!`;
    }
    if (options.travelerAllCollected) {
      return `Дякую, добрий друже! Прийми теплу листівку-подяку та +20 🐟, які я знайшов біля лісової річки!`;
    }
    return GUESTS.mandrivnyk.praises[0];
  }

  const guest = GUESTS[order.guestId];
  const base = guest.praises[order.id % guest.praises.length];
  const friendNote = options.isBestFriendBonus ? ' (+5 🐟 від найкращого друга 💖)' : '';

  if (options.isSecretDrink) {
    return `Вау!! Секретний «${order.secretDrink?.name}» — просто магія! Ось +25 рибок!${friendNote}`;
  }
  if (options.hasTakeawayDecor) {
    const wishNote = options.wishText ? ` І дякую за «${options.wishText}»!` : '';
    return `Який милий стаканчик зі стікером!${wishNote} Ти чудо-бариста!${friendNote}`;
  }
  if (options.hasLatteArt) {
    return order.wantsLatteArt
      ? `Ой, який чарівний малюнок на пінці! Аж шкода пити — тримай бонус!${friendNote}`
      : `Ого, ти ще й малюнок на пінці зробила! Я в захваті — тримай чайові!${friendNote}`;
  }
  return `${base}${friendNote}`;
}
