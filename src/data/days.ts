import type { DayThemeId, WeatherType } from '../types/game';

export const DAY_GUEST_TARGET = 5;
export const DAY_EVENING_BONUS_COINS = 20;
export const MAX_DAY_HISTORY = 30;

export interface DayThemeMeta {
  id: DayThemeId;
  icon: string;
  title: string;
  shortTitle: string;
  morningNote: string;
  eveningClosing: string;
  suggestedWeather: WeatherType;
  pillBg: string;
  pillBorder: string;
  pillText: string;
}

export const DAY_THEME_ORDER: DayThemeId[] = [
  'honey_morning',
  'rainy_cocoa',
  'berry_breeze',
  'snowy_cozy',
  'pastry_fair',
  'starlight_friends',
];

export const DAY_THEMES: Record<DayThemeId, DayThemeMeta> = {
  honey_morning: {
    id: 'honey_morning',
    icon: '☀️',
    title: 'Медовий ранок',
    shortTitle: 'Медовий',
    morningNote:
      'Сонячні зайчики стрибають по чашках — чудовий день для ніжного лате та теплих круасанів!',
    eveningClosing:
      'Сонечко сховалося за дахами, а в кав’ярні ще пахне медом і свіжим молочком.',
    suggestedWeather: 'sunny',
    pillBg: '#FFF5D8',
    pillBorder: '#D8A653',
    pillText: '#6F4713',
  },
  rainy_cocoa: {
    id: 'rainy_cocoa',
    icon: '🌧️',
    title: 'Дощовий день какао',
    shortTitle: 'Дощовий',
    morningNote:
      'За вікном шепоче теплий дощик — тваринки забігають по какао з маршмелоу й затишок!',
    eveningClosing:
      'Крапельки стихли на підвіконні, а всі гості пішли додому зігрітими й щасливими.',
    suggestedWeather: 'rainy',
    pillBg: '#EAF3FA',
    pillBorder: '#8CB0CF',
    pillText: '#2A4E6E',
  },
  berry_breeze: {
    id: 'berry_breeze',
    icon: '🍓',
    title: 'Ягідний вітерець',
    shortTitle: 'Ягідний',
    morningNote:
      'Сьогодні у повітрі пахне полуницею, м’ятою та прохолодними дитячими коктейлями!',
    eveningClosing:
      'Ягідний день промайнув як яскрава казка — солодкі спогади залишились у щоденнику.',
    suggestedWeather: 'sunny',
    pillBg: '#FCEEF3',
    pillBorder: '#D690A8',
    pillText: '#7D2E48',
  },
  snowy_cozy: {
    id: 'snowy_cozy',
    icon: '❄️',
    title: 'Сніжна казка',
    shortTitle: 'Сніжний',
    morningNote:
      'Пухнасті сніжинки кружляють за вікном — саме час гріти молоко з корицею і пекти смаколики!',
    eveningClosing:
      'Сніг тихо іскриться під ліхтарями, а Марципан згорнувся клубочком біля теплої стійки.',
    suggestedWeather: 'snowy',
    pillBg: '#EDF6FC',
    pillBorder: '#97BDD8',
    pillText: '#2C516C',
  },
  pastry_fair: {
    id: 'pastry_fair',
    icon: '🥐',
    title: 'Свято випічки',
    shortTitle: 'Випічка',
    morningNote:
      'Із міні-пічки тягнеться аромат ванілі та глазурі — гості сьогодні у захваті від десертів!',
    eveningClosing:
      'Вітрина спорожніла до останньої крихти — найкраща похвала для справжньої кондитерки!',
    suggestedWeather: 'sunny',
    pillBg: '#FBF0DE',
    pillBorder: '#CF9B62',
    pillText: '#6B421B',
  },
  starlight_friends: {
    id: 'starlight_friends',
    icon: '✨',
    title: 'День теплих друзів',
    shortTitle: 'Дружній',
    morningNote:
      'У «Мур-Лате» сьогодні особливо затишно — Марципан муркоче, а друзі діляться посмішками!',
    eveningClosing:
      'Над кав’ярнею засвітилися перші зірочки — ще один теплий день у нашій історії.',
    suggestedWeather: 'rainy',
    pillBg: '#F4EEFA',
    pillBorder: '#B495CE',
    pillText: '#53356E',
  },
};

export function getThemeForDayNumber(dayNumber: number): DayThemeMeta {
  const safeDay = Math.max(1, Math.floor(dayNumber));
  const themeId = DAY_THEME_ORDER[(safeDay - 1) % DAY_THEME_ORDER.length];
  return DAY_THEMES[themeId];
}
