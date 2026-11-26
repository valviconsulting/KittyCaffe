import type {
  CafeDecorId,
  MarzipanAccessoryId,
  MarzipanAccessorySlot,
  UnlockableRecipeId,
} from '../types/game';

export interface WardrobeShopItem {
  id: MarzipanAccessoryId;
  slot: MarzipanAccessorySlot;
  slotLabel: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  accentBg: string;
  accentBorder: string;
}

export interface DecorShopItem {
  id: CafeDecorId;
  name: string;
  description: string;
  price: number;
  emoji: string;
  accentBg: string;
  accentBorder: string;
}

export interface RecipeShopItem {
  id: UnlockableRecipeId;
  name: string;
  description: string;
  ingredientsHint: string;
  price: number;
  emoji: string;
  accentBg: string;
  accentBorder: string;
}

export const MARZIPAN_WARDROBE: WardrobeShopItem[] = [
  {
    id: 'chef_hat',
    slot: 'head',
    slotLabel: 'На голову',
    name: 'Ковпак шеф-кухаря',
    description: 'Пишний білий ковпак головного бариста для Марципана!',
    price: 35,
    emoji: '👨‍🍳',
    accentBg: '#FFF8EE',
    accentBorder: '#D5B084',
  },
  {
    id: 'heart_glasses',
    slot: 'eyes',
    slotLabel: 'Окуляри',
    name: 'Рожеві окуляри-сердечка',
    description: 'Найстильніші акварельні окуляри у формі сердечок!',
    price: 45,
    emoji: '🕶️',
    accentBg: '#FDF0F5',
    accentBorder: '#DF97AE',
  },
  {
    id: 'red_bowtie',
    slot: 'neck',
    slotLabel: 'На шию',
    name: 'Червоний бантик-метелик',
    description: 'Святковий оксамитовий метелик для справжнього джентльмена!',
    price: 30,
    emoji: '🎀',
    accentBg: '#FCEEEF',
    accentBorder: '#DA8D96',
  },
  {
    id: 'knit_scarf',
    slot: 'neck',
    slotLabel: 'На шию',
    name: 'В’язаний шарфик',
    description: 'Теплий затишний м’ятно-кремовий шарфик у смужку.',
    price: 40,
    emoji: '🧣',
    accentBg: '#ECF6EF',
    accentBorder: '#8AB898',
  },
  {
    id: 'gold_crown',
    slot: 'head',
    slotLabel: 'На голову',
    name: 'Золота корона',
    description: 'Королівська корона з самоцвітами для котика-короля!',
    price: 75,
    emoji: '👑',
    accentBg: '#FFF6DC',
    accentBorder: '#DFA946',
  },
];

export const CAFE_DECOR_ITEMS: DecorShopItem[] = [
  {
    id: 'daisy_vase',
    name: 'Вазочка з ромашками на стійку',
    description: 'Ніжна керамічна вазочка зі свіжими ромашками прямо на дерев’яній стійці!',
    price: 40,
    emoji: '💐',
    accentBg: '#EFF8F1',
    accentBorder: '#8EB898',
  },
  {
    id: 'twinkle_stars',
    name: 'Мерехтливі зірочки на гірлянду',
    description: 'Золоті зірочки, що м’яко сяють і погойдуються під стелею кав’ярні.',
    price: 55,
    emoji: '✨',
    accentBg: '#FFF7DF',
    accentBorder: '#DDA84B',
  },
  {
    id: 'cat_clock',
    name: 'Настінний годинник-котик',
    description: 'Затишний дерев’яний годинник із котячими вушками й хвостиком-маятником!',
    price: 65,
    emoji: '🕰️',
    accentBg: '#FBF0E2',
    accentBorder: '#C79665',
  },
  {
    id: 'music_box',
    name: 'Затишна музична скринька',
    description: 'Вмикає ніжну спокійну мелодію музичної скриньки у кав’ярні (можна ставити на паузу).',
    price: 50,
    emoji: '🎶',
    accentBg: '#F6EFFA',
    accentBorder: '#BA98CE',
  },
];

export const UNLOCKABLE_RECIPES: RecipeShopItem[] = [
  {
    id: 'matcha_latte',
    name: 'Матча-Лате',
    description:
      'Відкриває японський зелений чай «Матча» у 8-му слоті гарячих напоїв та в конструкторі «Напій дня»!',
    ingredientsHint: 'Матча + Тепле молоко + Пишна пінка',
    price: 60,
    emoji: '🍵',
    accentBg: '#EDF7EE',
    accentBorder: '#74AA78',
  },
  {
    id: 'carrot_cake',
    name: 'Морквяний кекс',
    description:
      'Відкриває 4-й десерт у вітрині випічки — запашний морквяний кекс із ніжною кремовою шапочкою!',
    ingredientsHint: 'Обожнює Кролиця Мія та інші гості 🥕',
    price: 60,
    emoji: '🥕',
    accentBg: '#FFF3E4',
    accentBorder: '#DC954E',
  },
];
