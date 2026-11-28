import type { WeatherType } from '../types/game';

export type CafeLightingMood =
  | 'morning_fresh'
  | 'afternoon_golden'
  | 'evening_amber'
  | 'rainy_sanctuary'
  | 'snowy_hearth';

export interface LightingMoodInput {
  weather: WeatherType;
  servedToday: number;
  guestsTarget: number;
  isLateAfternoon?: boolean;
  isDayComplete?: boolean;
}

export interface CafeLightingProfile {
  mood: CafeLightingMood;
  /** Warmth intensity of the two ribbed-amber pendant lamps (0..1) */
  pendantGlow: number;
  /** Warmth intensity of the left vintage brass wall sconce (0..1) */
  sconceGlow: number;
  /** Subtle sunbeam opacity when sunny (0 when overcast/rainy/snowy) */
  sunbeamOpacity: number;
  /** Gentle room atmospheric wash gradient (pure alpha, zero mix-blend-mode) */
  roomWashGradient: string | null;
  /** Soft corner vignette opacity grounding cozy depth */
  vignetteOpacity: number;
  /** Subtle warm ceiling fairy-light twinkle glints (active in evening/rain/snow) */
  fairyTwinkleOpacity: number;
  /** Optional warm sunset-peach wash strictly inside the window glass */
  windowSunsetOpacity: number;
}

/**
 * Pure day-arc + weather atmosphere director for Wave C.
 * Produces 5 distinct, child-safe cozy lighting scenarios (never dark or gloomy!)
 * using lightweight pure-alpha overlays that hold 60 FPS on mobile.
 */
export function resolveCafeLightingMood(
  input: LightingMoodInput
): CafeLightingProfile {
  const {
    weather,
    servedToday,
    guestsTarget,
    isLateAfternoon = false,
    isDayComplete = false,
  } = input;

  const isEvening =
    isDayComplete ||
    isLateAfternoon ||
    (guestsTarget > 0 && servedToday >= Math.max(1, guestsTarget - 1));

  if (weather === 'rainy') {
    return {
      mood: 'rainy_sanctuary',
      pendantGlow: isEvening ? 0.56 : 0.46,
      sconceGlow: isEvening ? 0.44 : 0.34,
      sunbeamOpacity: 0,
      roomWashGradient: isEvening
        ? 'linear-gradient(to bottom, rgba(255, 182, 102, 0.12) 0%, rgba(186, 126, 86, 0.08) 65%, rgba(110, 68, 42, 0.08) 100%)'
        : 'linear-gradient(to bottom, rgba(162, 186, 206, 0.06) 0%, rgba(255, 198, 126, 0.08) 65%, rgba(132, 84, 46, 0.06) 100%)',
      vignetteOpacity: 0.19,
      fairyTwinkleOpacity: 0.72,
      windowSunsetOpacity: isEvening ? 0.12 : 0,
    };
  }

  if (weather === 'snowy') {
    return {
      mood: 'snowy_hearth',
      pendantGlow: isEvening ? 0.58 : 0.48,
      sconceGlow: isEvening ? 0.46 : 0.36,
      sunbeamOpacity: 0,
      roomWashGradient:
        'linear-gradient(to bottom, rgba(224, 238, 250, 0.06) 0%, rgba(255, 192, 114, 0.1) 60%, rgba(160, 96, 48, 0.07) 100%)',
      vignetteOpacity: 0.18,
      fairyTwinkleOpacity: 0.85,
      windowSunsetOpacity: isEvening ? 0.1 : 0,
    };
  }

  // Sunny day arc: Morning Fresh -> Afternoon Golden -> Evening Amber
  if (isEvening) {
    return {
      mood: 'evening_amber',
      pendantGlow: 0.54,
      sconceGlow: 0.42,
      sunbeamOpacity: 0.44,
      roomWashGradient:
        'linear-gradient(to bottom, rgba(255, 174, 98, 0.15) 0%, rgba(238, 142, 98, 0.1) 58%, rgba(154, 88, 62, 0.07) 100%)',
      vignetteOpacity: 0.18,
      fairyTwinkleOpacity: 0.82,
      windowSunsetOpacity: 0.24,
    };
  }

  if (servedToday <= 1) {
    return {
      mood: 'morning_fresh',
      pendantGlow: 0.24,
      sconceGlow: 0.18,
      sunbeamOpacity: 0.38,
      roomWashGradient:
        'linear-gradient(160deg, rgba(255, 249, 218, 0.12) 0%, rgba(255, 240, 200, 0.04) 48%, transparent 100%)',
      vignetteOpacity: 0.11,
      fairyTwinkleOpacity: 0.25,
      windowSunsetOpacity: 0,
    };
  }

  return {
    mood: 'afternoon_golden',
    pendantGlow: 0.34,
    sconceGlow: 0.25,
    sunbeamOpacity: 0.42,
    roomWashGradient:
      'linear-gradient(to bottom, rgba(255, 224, 152, 0.07) 0%, rgba(255, 198, 118, 0.04) 60%, transparent 100%)',
    vignetteOpacity: 0.14,
    fairyTwinkleOpacity: 0.4,
    windowSunsetOpacity: 0.06,
  };
}

export const MARZIPAN_PURR_PHRASES: readonly string[] = [
  'Муррр~ ♥',
  'Мррр… так тепло~',
  'Мяу-мур! 🐾',
  'Солодкий затишок~ ♥',
  'Дякую за ласку~',
];

export function getMarzipanPurrPhrase(petCount: number): string {
  const safeIndex = Math.abs(Math.floor(petCount)) % MARZIPAN_PURR_PHRASES.length;
  return MARZIPAN_PURR_PHRASES[safeIndex];
}
