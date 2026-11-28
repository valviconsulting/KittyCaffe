import type {
  HotIngredientId,
  MysteryDay1ChoiceId,
  MysteryDay2ChoiceId,
  RecipeMysteryRole,
} from '../types/game';

export const MYSTERY_FINALE_BONUS_COINS = 45;
export const MYSTERY_STORY_DAYS = 3;

export interface MysteryClueMeta {
  id: 1 | 2 | 3;
  title: string;
  finderName: string;
  finderEmoji: string;
  parchmentQuote: string;
  decodedHint: string;
  ingredients: HotIngredientId[];
}

export const MYSTERY_CLUES: MysteryClueMeta[] = [
  {
    id: 1,
    title: 'Уривок №1 — Шоколадна основа',
    finderName: 'Ведмедик Марсель',
    finderEmoji: '🐻',
    parchmentQuote:
      '«…налий ніжне Тепле молоко й додай ароматне Какао — жодної краплі кави, щоб могли пити й найменші кошенята…»',
    decodedHint: 'Тепле молоко + Какао (без еспресо)',
    ingredients: ['warmMilk', 'cocoa'],
  },
  {
    id: 2,
    title: 'Уривок №2 — Затишна пряна шапочка',
    finderName: 'Сова Софія',
    finderEmoji: '🦉',
    parchmentQuote:
      '«…укрий чашку Пишною пінкою та присип дрібкою теплої Кориці, немов золотим осіннім листям…»',
    decodedHint: 'Пишна пінка + Кориця',
    ingredients: ['foam', 'cinnamon'],
  },
  {
    id: 3,
    title: 'Уривок №3 — Солодка хмаринка',
    finderName: 'Кіт Персик',
    finderEmoji: '🐱',
    parchmentQuote:
      '«…а на самий верх поклади м’якенькі Маршмелоу — і напій засяє, мов домашній затишок!»',
    decodedHint: 'Маршмелоу зверху',
    ingredients: ['marshmallow'],
  },
];

export interface MysteryDialogueChoice<T extends string> {
  id: T;
  emoji: string;
  label: string;
  /** Immediate warm reply from the guest right after the child picks this option */
  guestReply: string;
  /** Remembered callback sentence used by friends on later days */
  callbackMemory: string;
  /** Short title used on the commemorative solved card */
  commemorativeLabel: string;
}

export const MYSTERY_DAY1_CHOICES: MysteryDialogueChoice<MysteryDay1ChoiceId>[] =
  [
    {
      id: 'sweet_cocoa',
      emoji: '🍫',
      label: 'Шоколадним какао!',
      guestReply:
        'Ого, яка інтуїція детектива! На першому уривку справді написано про Тепле молоко й Какао! Спробуймо спершу звичайне «Какао з маршмелоу» для натхнення!',
      callbackMemory: 'ти одразу вгадала, що в основі було ніжне какао',
      commemorativeLabel: 'шоколадний аромат какао',
    },
    {
      id: 'spiced_cozy',
      emoji: '✨',
      label: 'Теплою корицею!',
      guestReply:
        'Браво, тонкий нюх справжньої баристи! Папір справді ще трохи пахне прянощами! А в першому уривку вже видно основу — Тепле молоко й Какао. Зробиш мені «Капучино з корицею», поки я перепишу нотатку?',
      callbackMemory: 'ти відчула тонкий аромат кориці ще з першого аркуша',
      commemorativeLabel: 'теплий дух кориці',
    },
    {
      id: 'fluffy_cloud',
      emoji: '☁️',
      label: 'Ніжною пінкою й зефірками!',
      guestReply:
        'Чудова здогадка! Звучить як справжня хмаринка щастя! У першому уривку вже згадується Тепле молоко та Какао. Пригостиш мене «Какао з маршмелоу», поки я збережу підказку в Книзі Історій?',
      callbackMemory: 'ти одразу уявила пухку хмаринку пінки й маршмелоу',
      commemorativeLabel: 'ніжні хмаринки пінки й маршмелоу',
    },
  ];

export const MYSTERY_DAY2_CHOICES: MysteryDialogueChoice<MysteryDay2ChoiceId>[] =
  [
    {
      id: 'starlight_name',
      emoji: '🌟',
      label: '«Зоряний затишок»',
      guestReply:
        'Угу-у, як поетично! Я обов’язково впишу «Зоряний затишок» у свою книгу казок! Ось мій уривок №2: у рецепті точно є Пишна пінка й Кориця! А мені б зараз чашку «Американо», щоб не заснути!',
      callbackMemory: '«Зоряний затишок»',
      commemorativeLabel: 'Зоряний затишок',
    },
    {
      id: 'warm_paw_name',
      emoji: '🐾',
      label: '«Тепла лапка»',
      guestReply:
        'Яка мила й затишна назва — «Тепла лапка»! Марципану точно сподобається! Ось уривок №2 зі старої хроніки: потрібна Пишна пінка й дрібка Кориці! Зробиш мені бадьорий «Американо»?',
      callbackMemory: '«Тепла лапка»',
      commemorativeLabel: 'Тепла лапка',
    },
    {
      id: 'golden_mur_name',
      emoji: '🍯',
      label: '«Золотий Мур»',
      guestReply:
        'Ох, звучить по-справжньому легендарно — «Золотий Мур»! Передаю тобі уривок №2: напій вкривали Пишною пінкою та присипали Корицею! А мені, будь ласка, гарячий «Американо»!',
      callbackMemory: '«Золотий Мур»',
      commemorativeLabel: 'Золотий Мур',
    },
  ];

export const VALID_MYSTERY_ROLES: RecipeMysteryRole[] = [
  'mystery_day1_marsel',
  'mystery_day2_sofiya',
  'mystery_day2_persyk',
  'mystery_day3_finale',
];

export const VALID_DAY1_CHOICES: MysteryDay1ChoiceId[] = [
  'sweet_cocoa',
  'spiced_cozy',
  'fluffy_cloud',
];

export const VALID_DAY2_CHOICES: MysteryDay2ChoiceId[] = [
  'starlight_name',
  'warm_paw_name',
  'golden_mur_name',
];

export function getDay1ChoiceMeta(
  choice: MysteryDay1ChoiceId | null
): MysteryDialogueChoice<MysteryDay1ChoiceId> | null {
  if (!choice) return null;
  return MYSTERY_DAY1_CHOICES.find((c) => c.id === choice) ?? null;
}

export function getDay2ChoiceMeta(
  choice: MysteryDay2ChoiceId | null
): MysteryDialogueChoice<MysteryDay2ChoiceId> | null {
  if (!choice) return null;
  return MYSTERY_DAY2_CHOICES.find((c) => c.id === choice) ?? null;
}

export function getMysteryGreeting(
  role: RecipeMysteryRole,
  day1Choice: MysteryDay1ChoiceId | null,
  day2Choice: MysteryDay2ChoiceId | null
): string {
  if (role === 'mystery_day1_marsel') {
    const picked = getDay1ChoiceMeta(day1Choice);
    if (picked) {
      return picked.guestReply;
    }
    return 'Дивовижна знахідка! Між старих книжок я знайшов потертий аркуш легендарного рецепта «Мур-Лате», але слова стерлися! Як гадаєш, чим пахнув той напій?';
  }

  if (role === 'mystery_day2_sofiya') {
    const picked2 = getDay2ChoiceMeta(day2Choice);
    if (picked2) {
      return picked2.guestReply;
    }
    const day1Mem = getDay1ChoiceMeta(day1Choice);
    const callback = day1Mem
      ? `Марсель розповів, що ${day1Mem.callbackMemory}! `
      : '';
    return `Угу-у! ${callback}Я знайшла в бібліотеці другий уривок рецепта! Перш ніж відкрити його — яку таємну назву дамо нашій знахідці?`;
  }

  if (role === 'mystery_day2_persyk') {
    const day2Mem = getDay2ChoiceMeta(day2Choice);
    const titleRef = day2Mem ? ` для нашого ${day2Mem.callbackMemory}` : '';
    return `Мур-сенсація! У своєму щоденнику випічки я знайшов останній уривок №3${titleRef}: зверху клали м’якенькі Маршмелоу! Зробиш мені «Теплий круасан» і «Капучино», поки ми складаємо всі 3 підказки?`;
  }

  // mystery_day3_finale
  const day2Mem = getDay2ChoiceMeta(day2Choice);
  const subtitleNote = day2Mem ? ` (${day2Mem.callbackMemory})` : '';
  return `Усі 3 підказки зібрано! Спробуй відтворити загублене «Золоте какао «Мур-Лате»»${subtitleNote} за нашими уривками! Зазирни в «📜 Підказки (3/3)», якщо хочеш перевірити записи!`;
}

export function getMysteryPraise(
  role: RecipeMysteryRole,
  day2Choice: MysteryDay2ChoiceId | null
): string {
  if (role === 'mystery_day1_marsel') {
    return 'Чудово! Уривок №1 (Тепле молоко + Какао) записано в Книгу Історій! Завтра Софія пошукає решту в бібліотеці!';
  }
  if (role === 'mystery_day2_sofiya') {
    return 'Ох, яка бадьора кава! Уривок №2 (Пишна пінка + Кориця) вже у твоїй Книзі Історій! Залишився ще один уривок сьогодні!';
  }
  if (role === 'mystery_day2_persyk') {
    return 'Муррр, неймовірно! Усі 3 уривки рецепта зібрано! Завтра Марсель прийде на велику дегустацію-розгадку!';
  }
  const day2Mem = getDay2ChoiceMeta(day2Choice);
  const customTag = day2Mem ? ` — справжній ${day2Mem.callbackMemory}` : '';
  return `БРАВО!! Ти розгадала легендарний рецепт «Золоте какао «Мур-Лате»»${customTag}! Він назавжди у Книзі рецептів, а тобі +45 🐟 і Золота Книга на стійку!`;
}

export const MYSTERY_EVENING_NOTES = {
  day1: 'Розслідування (День 1/3): Ведмедик Марсель приніс перший уривок загубленого рецепта — основу з Теплого молока й Какао!',
  day2: 'Розслідування (День 2/3): Софія та Персик знайшли решту підказок (Пінка, Кориця і Маршмелоу)! Завтра — велика розгадка!',
  day3Solved: (day2Choice: MysteryDay2ChoiceId | null) => {
    const picked = getDay2ChoiceMeta(day2Choice);
    const titleSuffix = picked ? ` під назвою ${picked.callbackMemory}` : '';
    return `Таємницю розкрито! За трьома підказками друзів відновлено легендарне «Золоте какао «Мур-Лате»»${titleSuffix}!`;
  },
};
