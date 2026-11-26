import type { BaseStickerId, RareStickerId, StickerId } from '../types/game';

export interface StickerCatalogItem {
  id: StickerId;
  emoji: string;
  label: string;
  bg: string;
  isRare?: boolean;
  description?: string;
}

export const BASE_STICKER_CATALOG: Array<StickerCatalogItem & { id: BaseStickerId }> = [
  { id: 'paw', emoji: '🐾', label: 'Лапка', bg: '#FCEAEF' },
  { id: 'heart', emoji: '💖', label: 'Сердечко', bg: '#FDE8EE' },
  { id: 'crown', emoji: '👑', label: 'Корона', bg: '#FDF3D7' },
  { id: 'star', emoji: '⭐', label: 'Зірочка', bg: '#FCF5D8' },
  { id: 'cat', emoji: '🐱', label: 'Котик', bg: '#F9ECDC' },
  { id: 'flower', emoji: '🌸', label: 'Квіточка', bg: '#FCEBF2' },
  { id: 'rainbow', emoji: '🌈', label: 'Веселка', bg: '#EAF5EE' },
];

export const RARE_STICKER_CATALOG: Array<
  StickerCatalogItem & { id: RareStickerId; isRare: true; description: string }
> = [
  {
    id: 'mushroom',
    emoji: '🍄',
    label: 'Щасливий грибочок',
    bg: '#FFF3E0',
    isRare: true,
    description: 'Знайдений на сонячній лісовій галявині!',
  },
  {
    id: 'moon_cat',
    emoji: '🌙',
    label: 'Місячний котик',
    bg: '#F2EEFA',
    isRare: true,
    description: 'Талісман затишних зоряних мандрів.',
  },
  {
    id: 'clover',
    emoji: '🍀',
    label: 'Конюшина удачі',
    bg: '#E8F7EC',
    isRare: true,
    description: 'Чотирилиста конюшина на удачу бариста!',
  },
  {
    id: 'butterfly',
    emoji: '🦋',
    label: 'Чарівний метелик',
    bg: '#EAF5FC',
    isRare: true,
    description: 'Супроводжував Котика-мандрівника крізь луки.',
  },
  {
    id: 'pinecone',
    emoji: '🌰',
    label: 'Щаслива шишка',
    bg: '#F8ECDD',
    isRare: true,
    description: 'Прикрашає стійку кав’ярні як добрий сувенір!',
  },
];

export const STICKER_CATALOG: StickerCatalogItem[] = [
  ...BASE_STICKER_CATALOG,
  ...RARE_STICKER_CATALOG,
];

export const RARE_STICKER_ORDER: RareStickerId[] = [
  'mushroom',
  'moon_cat',
  'clover',
  'butterfly',
  'pinecone',
];

export const WISH_OPTIONS = [
  'Гарного дня!',
  'Ти супер!',
  'Мур-дякую!',
  'Більше усмішок!',
] as const;
