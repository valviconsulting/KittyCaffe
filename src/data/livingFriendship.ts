import type {
  CafeDecorId,
  DrinkRecipeId,
  FriendshipMomentId,
  MarzipanEquipped,
  PastryRecipeId,
  RegularGuestId,
  WallArtState,
} from '../types/game';

export const FRIEND_GIFT_BONUS_COINS = 10;
export const MOOD_RIDDLE_BONUS_COINS = 10;

export interface FriendshipMomentMeta {
  id: FriendshipMomentId;
  title: string;
  emoji: string;
  fromGuestId: RegularGuestId;
  toGuestId: RegularGuestId;
  /** Step 1: Sender orders a take-away surprise combo for their friend */
  sendDrinkId: DrinkRecipeId;
  sendPastryId: PastryRecipeId;
  sendGreeting: string;
  sendPraise: string;
  /** Step 2: Recipient arrives next, delighted by the gift, and orders a cozy treat */
  receiveDrinkId: DrinkRecipeId;
  receiveGreeting: string;
  receivePraise: string;
  /** Keepsake memory caption in the Friendship Album */
  albumMemory: string;
}

export const FRIENDSHIP_MOMENT_ORDER: FriendshipMomentId[] = [
  'persyk_to_sofiya',
  'miya_to_puh',
  'luna_to_marsel',
  'sofiya_to_miya',
];

export const FRIENDSHIP_MOMENTS: Record<
  FriendshipMomentId,
  FriendshipMomentMeta
> = {
  persyk_to_sofiya: {
    id: 'persyk_to_sofiya',
    title: 'Теплий круасан для Софії',
    emoji: '🥐',
    fromGuestId: 'persyk',
    toGuestId: 'sofiya',
    sendDrinkId: 'americano',
    sendPastryId: 'warm_croissant',
    sendGreeting:
      'Тссс! Сова Софія читала всю ніч і геть сонна! Зроби для неї «Американо» із собою та «Теплий круасан» — я залишу їй теплий сюрприз на стійці!',
    sendPraise:
      'Муррр, ідеально! Залишу цей пакуночок для Софії — зараз вона зайде й дуже зрадіє!',
    receiveDrinkId: 'cappuccino',
    receiveGreeting:
      'Ой!! Кіт Персик залишив мені теплий круасан і каву?! Аж очі засяяли від доброти! Приготуй мені ще ніжне «Капучино» — хочу посидіти тут і написати про нього казку!',
    receivePraise:
      'Яка ж у «Мур-Лате» справжня дружба! Дякую тобі та Персику — тримай бонус +10 🐟!',
    albumMemory:
      'Персик таємно залишив для сонної Софії гарячу каву й теплий круасан — і вона присвятила йому нову казку!',
  },
  miya_to_puh: {
    id: 'miya_to_puh',
    title: 'Солодка хмаринка для Пуха',
    emoji: '☁️',
    fromGuestId: 'miya',
    toGuestId: 'puh',
    sendDrinkId: 'cocoa_marshmallow',
    sendPastryId: 'donut_pink',
    sendGreeting:
      'Привіт-привіт! Кошеня Пух сьогодні трохи сумувало через хмаринки — передаймо йому сюрприз! Зроби, будь ласка, «Какао з маршмелоу» із собою і «Пончик із рожевою глазур’ю»!',
    sendPraise:
      'Ура, який рожевий подаруночок! Пух ось-ось прибіжить і точно замуркоче від щастя!',
    receiveDrinkId: 'babyccino',
    receiveGreeting:
      'Мяу-мяу!! Кролиця Мія передала мені какао й рожевий пончик?! Мої вушка аж танцюють від радості! Зробиш мені ще ніжне «Бебічіно», щоб відсвяткувати?',
    receivePraise:
      'Няв-няв! З такими друзями кожен день стає сонячним! Тримай подарунок +10 🐟!',
    albumMemory:
      'Кролиця Мія підняла настрій Кошеняті Пуху рожевим пончиком і пухким какао з маршмелоу!',
  },
  luna_to_marsel: {
    id: 'luna_to_marsel',
    title: 'Комплімент для Марселя',
    emoji: '🎀',
    fromGuestId: 'luna',
    toGuestId: 'marsel',
    sendDrinkId: 'latte',
    sendPastryId: 'donut_chocolate',
    sendGreeting:
      'Тссс! У Ведмедика Марселя сьогодні новенький бордовий метелик — хочу зробити йому приємний сюрприз! Зроби «Лате» із собою і «Пончик із шоколадною глазур’ю»!',
    sendPraise:
      'Вау, вийшло дуже елегантно! Зараз Марсель завітає й отримає свій вишуканий сюрприз!',
    receiveDrinkId: 'cappuccino_cinnamon',
    receiveGreeting:
      'Оце так чарівна несподіванка від Лисички Луни! Мої найщиріші оплески! Приготуй мені ще «Капучино з корицею» — я напишу їй теплу записку-подяку!',
    receivePraise:
      'Браво! Немає нічого кращого за несподіваний подарунок від друга! Ось бонус +10 🐟!',
    albumMemory:
      'Лисичка Луна привітала Ведмедика Марселя з новим оксамитовим метеликом вишуканим лате й шоколадним пончиком!',
  },
  sofiya_to_miya: {
    id: 'sofiya_to_miya',
    title: 'Свіжість після пробіжки для Мії',
    emoji: '🌿',
    fromGuestId: 'sofiya',
    toGuestId: 'miya',
    sendDrinkId: 'kids_mojito',
    sendPastryId: 'chocolate_cookie',
    sendGreeting:
      'Угу-у… Кролиця Мія сьогодні зробила аж сто стрибків у саду! Передаймо їй освіжаючий сюрприз: «Дитячий Мохіто» із собою і «Печиво з шоколадом»!',
    sendPraise:
      'Чудово! Залишаю стаканчик для нашої веселої спортсменки — вона якраз добігає до кав’ярні!',
    receiveDrinkId: 'strawberry_milkshake',
    receiveGreeting:
      'Скок-поскок! Сова Софія передала мені крижаний Мохіто й печиво?! Яка ж вона турботлива! А тепер зробиш мені ще «Полуничний мілкшейк» на десерт?',
    receivePraise:
      'Юхуу! Найкраща команда друзів у світі! Дякую тобі та Софії — ось бонус +10 🐟!',
    albumMemory:
      'Сова Софія зустріла Кролицю Мію після садової пробіжки прохолодним мохіто та хрустким печивом!',
  },
};

export interface MoodRiddleSpec {
  guestId: RegularGuestId;
  drinkId: DrinkRecipeId;
  prompt: string;
}

/** 6 cozy, crystal-clear flavor mood riddles (1 per regular guest; Puff stays 100% caffeine-free!) */
export const MOOD_RIDDLES: MoodRiddleSpec[] = [
  {
    guestId: 'puh',
    drinkId: 'cocoa_marshmallow',
    prompt:
      'Пограймо у вгадайку! Хочу щось тепленьке, шоколадне, зовсім без кави — із пухкими зефірками-хмаринками зверху!',
  },
  {
    guestId: 'miya',
    drinkId: 'kids_mojito',
    prompt:
      'Вгадай мій настрій! Після пробіжки мрію про крижаний прохолодний келих зі свіжою м’ятою, лимончиком і бульбашками!',
  },
  {
    guestId: 'luna',
    drinkId: 'sunrise',
    prompt:
      'Маленька загадка! Хочу яскравий прохолодний коктейль із льодом, де апельсиновий сік зустрічається з полуничним сиропом, мов світанок!',
  },
  {
    guestId: 'persyk',
    drinkId: 'cappuccino_cinnamon',
    prompt:
      'Вгадай, чого просить душа! Гаряча кава з молоком, пишною пінкою й дрібкою запашної кориці зверху!',
  },
  {
    guestId: 'marsel',
    drinkId: 'latte',
    prompt:
      'Загадка для справжньої баристи: вишуканий гарячий напій з еспресо, де теплого молока аж удвічі більше!',
  },
  {
    guestId: 'sofiya',
    drinkId: 'americano',
    prompt:
      'Угу-у, вгадай! Мені потрібна проста бадьора кава без молока — еспресо, пом’якшений гарячою водою!',
  },
];

export interface AmbientObservationContext {
  orderId: number;
  guestId: RegularGuestId;
  wallArt: WallArtState;
  equippedAccessories: MarzipanEquipped;
  enabledDecor: CafeDecorId[];
  musicBoxPlaying: boolean;
  muted: boolean;
  goldenBookVisible: boolean;
}

/**
 * Generates a warm, non-repeating 1-line observation when a guest notices the child's
 * own wall painting, Marzipan's dressed-up outfit, or cozy café decor!
 */
export function buildAmbientObservation(
  ctx: AmbientObservationContext
): string | null {
  const candidates: string[] = [];

  if (ctx.wallArt.visible && ctx.wallArt.dataUrl) {
    const titlePart = ctx.wallArt.title ? ` «${ctx.wallArt.title}»` : '';
    candidates.push(
      `🎨 Яка чудова твоя картина${titlePart} на стіні — милуватися нею одне задоволення!`
    );
  }

  if (ctx.equippedAccessories.head === 'chef_hat') {
    candidates.push(
      '🐱 Марципан у кухарському ковпаку виглядає як справжній шеф-кондитер!'
    );
  } else if (ctx.equippedAccessories.head === 'gold_crown') {
    candidates.push(
      '👑 Ого, яка золота корона на Марципані — справжній король затишку!'
    );
  }

  if (ctx.equippedAccessories.eyes === 'heart_glasses') {
    candidates.push(
      '💖 Марципану так пасують рожеві окуляри-сердечка — справжня зірка кав’ярні!'
    );
  }

  if (ctx.equippedAccessories.neck === 'red_bowtie') {
    candidates.push(
      '🎀 Який ошатний червоний метелик у Марципана — справжній джентльмен!'
    );
  } else if (ctx.equippedAccessories.neck === 'knit_scarf') {
    candidates.push(
      '🧣 Марципану так тепло й затишно у в’язаному шарфику!'
    );
  }

  if (
    ctx.enabledDecor.includes('music_box') &&
    ctx.musicBoxPlaying &&
    !ctx.muted
  ) {
    candidates.push(
      '🎵 Яка ніжна мелодія грає з музичної скриньки — аж муркотіти хочеться!'
    );
  }

  if (ctx.enabledDecor.includes('daisy_vase')) {
    candidates.push(
      '🌼 Свіжі ромашки на стійці роблять кав’ярню ще сонячнішою!'
    );
  }

  if (ctx.goldenBookVisible) {
    candidates.push(
      '📖 Вау, на стійці лежить та сама Золота книга рецептів «Мур-Лате»!'
    );
  }

  if (candidates.length === 0) return null;

  // Show on roughly half of regular visits so it feels organic & never repetitive
  if (ctx.orderId % 2 !== 0) return null;

  return candidates[Math.floor(ctx.orderId / 2) % candidates.length];
}
