import type { WeatherType } from '../types/game';

export interface WeatherMeta {
  id: WeatherType;
  icon: string;
  label: string;
  shortHint: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  guestMoodLine: string;
}

export const WEATHER_ORDER: WeatherType[] = ['sunny', 'rainy', 'snowy'];

export const WEATHER_CONFIG: Record<WeatherType, WeatherMeta> = {
  sunny: {
    id: 'sunny',
    icon: '☀️',
    label: 'Сонячно',
    shortHint: 'У теплу погоду гості частіше обирають холодні коктейлі',
    pillBg: '#FFF4D4',
    pillBorder: '#E5B962',
    pillText: '#7D5318',
    guestMoodLine: 'Який сонячний день! Хочеться чогось особливого~',
  },
  rainy: {
    id: 'rainy',
    icon: '🌧️',
    label: 'Дощ',
    shortHint: 'У дощик гості люблять какао, каву й теплі круасани',
    pillBg: '#E7F0F6',
    pillBorder: '#9BB9CC',
    pillText: '#3A596E',
    guestMoodLine: 'За вікном стукотить дощик... Зігрій мене, будь ласка!',
  },
  snowy: {
    id: 'snowy',
    icon: '❄️',
    label: 'Сніг',
    shortHint: 'У снігопад гості мріють про гарячі напої та теплу випічку',
    pillBg: '#EEF4FA',
    pillBorder: '#AFC5DF',
    pillText: '#3F5A7B',
    guestMoodLine: 'Надворі кружляють сніжинки! Як затишно в «Мур-Лате»!',
  },
};

export function getNextWeather(current: WeatherType): WeatherType {
  const idx = WEATHER_ORDER.indexOf(current);
  return WEATHER_ORDER[(idx + 1) % WEATHER_ORDER.length];
}
