import {
  DAY_EVENING_BONUS_COINS,
  DAY_GUEST_TARGET,
  DAY_THEMES,
  MAX_DAY_HISTORY,
  getThemeForDayNumber,
} from '../data/days.ts';
import { GUESTS } from '../data/guests.ts';
import type {
  DayMemoryEntry,
  DayPhase,
  DayProgressState,
  GuestId,
  RegularGuestId,
  WeatherType,
} from '../types/game';

export interface ServedGuestDayPayload {
  guestId: GuestId;
  coinsEarned: number;
  hasLatteArt: boolean;
  hasTakeaway: boolean;
  isTraveler: boolean;
  becameBestFriend: boolean;
}

export function createFreshDayProgress(
  dayNumber: number,
  phase: DayPhase = 'open'
): DayProgressState {
  const safeDay = Math.max(1, Math.floor(dayNumber));
  const theme = getThemeForDayNumber(safeDay);
  return {
    dayNumber: safeDay,
    themeId: theme.id,
    phase,
    guestsTarget: DAY_GUEST_TARGET,
    guestsServedToday: [],
    coinsEarnedToday: 0,
    latteArtToday: 0,
    takeawayToday: 0,
    travelerVisitedToday: false,
    newBestFriendsToday: [],
    eveningBonusClaimed: false,
    eveningEntryRecorded: false,
  };
}

/**
 * Pure update when a guest is served during the active day.
 * Clamps guest list cleanly at guestsTarget so a day never silently overflows.
 */
export function recordServedGuestInDay(
  day: DayProgressState,
  payload: ServedGuestDayPayload
): DayProgressState {
  if (day.phase === 'evening') return day;
  const nextGuests =
    day.guestsServedToday.length < day.guestsTarget
      ? [...day.guestsServedToday, payload.guestId]
      : day.guestsServedToday;

  const nextBestFriends =
    payload.becameBestFriend &&
    payload.guestId !== 'mandrivnyk' &&
    !day.newBestFriendsToday.includes(payload.guestId as RegularGuestId)
      ? [...day.newBestFriendsToday, payload.guestId as RegularGuestId]
      : day.newBestFriendsToday;

  return {
    ...day,
    phase: 'open',
    guestsServedToday: nextGuests,
    coinsEarnedToday: day.coinsEarnedToday + Math.max(0, Math.floor(payload.coinsEarned)),
    latteArtToday: day.latteArtToday + (payload.hasLatteArt ? 1 : 0),
    takeawayToday: day.takeawayToday + (payload.hasTakeaway ? 1 : 0),
    travelerVisitedToday: day.travelerVisitedToday || payload.isTraveler,
    newBestFriendsToday: nextBestFriends,
  };
}

export function isDayTargetReached(day: DayProgressState): boolean {
  return day.guestsServedToday.length >= day.guestsTarget;
}

export function isLateAfternoon(day: DayProgressState): boolean {
  return (
    day.phase === 'evening' ||
    day.guestsServedToday.length >= Math.max(1, day.guestsTarget - 1)
  );
}

/** Builds a warm storybook Ukrainian highlight sentence for the Evening Diary */
export function buildDayMemoryHighlight(day: DayProgressState): string {
  if (day.newBestFriendsToday.length > 0) {
    const firstFriendId = day.newBestFriendsToday[0];
    const firstFriend = GUESTS[firstFriendId].name;
    if (
      firstFriendId === 'luna' ||
      firstFriendId === 'sofiya' ||
      firstFriendId === 'miya'
    ) {
      return `${firstFriend} стала найкращою подругою кав’ярні та залишила сувенір на поличці!`;
    }
    if (firstFriendId === 'puh') {
      return `${firstFriend} стало найкращим другом кав’ярні та залишило сувенір на поличці!`;
    }
    return `${firstFriend} став найкращим другом кав’ярні та залишив сувенір на поличці!`;
  }
  if (day.travelerVisitedToday) {
    return 'У гості завітав Котик-мандрівник і подякував за доброту рідкісним сувеніром!';
  }
  if (day.latteArtToday >= 2) {
    return `Сьогодні ти намалювала ${day.latteArtToday} лате-арти на пінці — гості в захваті!`;
  }
  if (day.latteArtToday === 1) {
    return 'Ти прикрасила напій ніжним лате-артом, а Марципан схвально муркотів!';
  }
  if (day.takeawayToday >= 2) {
    return `Аж ${day.takeawayToday} стаканчики «із собою» прикрашені яскравими стікерами!`;
  }
  const theme = DAY_THEMES[day.themeId];
  return theme.eveningClosing;
}

/**
 * Transitions a finished day into its Evening Diary state.
 * Strictly IDEMPOTENT: calling it again after reload NEVER duplicates coins or diary history!
 */
export function completeDayIntoEvening(
  day: DayProgressState,
  history: DayMemoryEntry[],
  weather: WeatherType,
  highlightOverride?: string | null
): {
  nextDay: DayProgressState;
  nextHistory: DayMemoryEntry[];
  bonusCoins: number;
} {
  const bonusCoins = day.eveningBonusClaimed ? 0 : DAY_EVENING_BONUS_COINS;
  const totalDayCoins = day.coinsEarnedToday + bonusCoins;

  const alreadyInHistory =
    day.eveningEntryRecorded ||
    history.some((entry) => entry.dayNumber === day.dayNumber);

  const nextDay: DayProgressState = {
    ...day,
    phase: 'evening',
    coinsEarnedToday: totalDayCoins,
    eveningBonusClaimed: true,
    eveningEntryRecorded: true,
  };

  if (alreadyInHistory) {
    return { nextDay, nextHistory: history, bonusCoins };
  }

  const newEntry: DayMemoryEntry = {
    dayNumber: day.dayNumber,
    themeId: day.themeId,
    weather,
    guestsServed: [...day.guestsServedToday],
    coinsEarned: totalDayCoins,
    latteArtCount: day.latteArtToday,
    takeawayCount: day.takeawayToday,
    highlight: highlightOverride || buildDayMemoryHighlight(nextDay),
  };

  const nextHistory = [newEntry, ...history].slice(0, MAX_DAY_HISTORY);
  return { nextDay, nextHistory, bonusCoins };
}

/** Advances cleanly from a finished evening into the next morning (Day N + 1). */
export function advanceToNextDay(day: DayProgressState): {
  nextDay: DayProgressState;
  suggestedWeather: WeatherType;
} {
  const nextNumber = day.dayNumber + 1;
  const theme = getThemeForDayNumber(nextNumber);
  return {
    nextDay: createFreshDayProgress(nextNumber, 'morning'),
    suggestedWeather: theme.suggestedWeather,
  };
}
