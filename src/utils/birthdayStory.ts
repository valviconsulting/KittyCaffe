import {
  BIRTHDAY_FINALE_BONUS_COINS,
  BIRTHDAY_THEMES,
} from '../data/birthdayStory.ts';
import type {
  BirthdayThemeId,
  PuhBirthdayStoryState,
} from '../types/game';

export function createInitialBirthdayStoryState(): PuhBirthdayStoryState {
  return {
    status: 'not_started',
    theme: null,
    stageDay: 1,
    storyOrderServedToday: false,
    completedThemes: [],
    keepDecorEnabled: true,
    finaleRewardClaimed: false,
  };
}

/** Starts (or replays with another theme!) the 3-day «День народження Пуха» chapter */
export function startBirthdayChapter(
  prev: PuhBirthdayStoryState,
  theme: BirthdayThemeId
): PuhBirthdayStoryState {
  return {
    ...prev,
    status: 'active',
    theme,
    stageDay: 1,
    storyOrderServedToday: false,
    keepDecorEnabled: true,
    finaleRewardClaimed: false,
  };
}

/**
 * Determines whether the NEXT arriving guest inside the current day should be a
 * scripted Birthday Story moment:
 * - Stage Day 1 (prep): Guest slot #1 (index 0) -> prep_day1
 * - Stage Day 2 (rehearsal): Guest slot #1 (index 0) -> prep_day2
 * - Stage Day 3 (BIRTHDAY PARTY FINALE!): Guest slot #5 (index 4, final guest!) -> finale_party (Puff!)
 */
export function getBirthdayOrderRoleForSlot(
  story: PuhBirthdayStoryState,
  guestsServedTodayCount: number,
  guestsTarget: number
): 'prep_day1' | 'prep_day2' | 'finale_party' | null {
  if (story.status !== 'active' || !story.theme) return null;
  if (story.storyOrderServedToday) return null;

  if (story.stageDay === 1) {
    return 'prep_day1';
  }
  if (story.stageDay === 2 && guestsServedTodayCount === 0) {
    return 'prep_day2';
  }
  if (
    story.stageDay === 3 &&
    guestsServedTodayCount === Math.max(0, guestsTarget - 1)
  ) {
    return 'finale_party';
  }
  return null;
}

export function markBirthdayStoryOrderServed(
  story: PuhBirthdayStoryState
): PuhBirthdayStoryState {
  if (story.status !== 'active') return story;
  return {
    ...story,
    storyOrderServedToday: true,
  };
}

/**
 * Called at the Evening settlement of a finished day.
 * - Stage Day 1 or 2 -> records note, stays active (advances to stageDay + 1 on Next Morning).
 * - Stage Day 3 -> completes the chapter, unlocks the chosen theme's permanent postcard,
 *   and awards +40 fish bonus ONCE (strictly idempotent across reloads!).
 */
export function settleBirthdayChapterAtEvening(
  story: PuhBirthdayStoryState
): {
  nextStory: PuhBirthdayStoryState;
  finaleBonusCoins: number;
  justCompletedFinale: boolean;
  eveningHighlightOverride: string | null;
} {
  if (story.status !== 'active' || !story.theme) {
    return {
      nextStory: story,
      finaleBonusCoins: 0,
      justCompletedFinale: false,
      eveningHighlightOverride: null,
    };
  }

  const themeMeta = BIRTHDAY_THEMES[story.theme];

  if (story.stageDay === 1) {
    return {
      nextStory: story,
      finaleBonusCoins: 0,
      justCompletedFinale: false,
      eveningHighlightOverride: themeMeta.day1EveningNote,
    };
  }

  if (story.stageDay === 2) {
    return {
      nextStory: story,
      finaleBonusCoins: 0,
      justCompletedFinale: false,
      eveningHighlightOverride: themeMeta.day2EveningNote,
    };
  }

  // Stage Day 3 Finale completed!
  const finaleBonusCoins = story.finaleRewardClaimed
    ? 0
    : BIRTHDAY_FINALE_BONUS_COINS;
  const nextCompleted = story.completedThemes.includes(story.theme)
    ? story.completedThemes
    : [...story.completedThemes, story.theme];

  return {
    nextStory: {
      ...story,
      status: 'completed',
      completedThemes: nextCompleted,
      keepDecorEnabled: true,
      finaleRewardClaimed: true,
    },
    finaleBonusCoins,
    justCompletedFinale: !story.finaleRewardClaimed,
    eveningHighlightOverride: themeMeta.postcardMessage,
  };
}

/** Advances stageDay (1 -> 2 -> 3) cleanly when stepping from Evening into Next Morning. */
export function advanceBirthdayStageOnNextMorning(
  story: PuhBirthdayStoryState
): PuhBirthdayStoryState {
  if (story.status !== 'active') return story;
  const nextStage: 1 | 2 | 3 =
    story.stageDay === 1 ? 2 : story.stageDay === 2 ? 3 : 3;
  return {
    ...story,
    stageDay: nextStage,
    storyOrderServedToday: false,
  };
}

/** Returns which theme's festive decor should currently be rendered in CafeHallScene */
export function getActiveBirthdayDecor(
  story: PuhBirthdayStoryState
): { theme: BirthdayThemeId; level: 1 | 2 | 3 } | null {
  if (!story.theme) return null;
  if (story.status === 'active') {
    return { theme: story.theme, level: story.stageDay };
  }
  if (story.status === 'completed' && story.keepDecorEnabled) {
    return { theme: story.theme, level: 3 };
  }
  return null;
}
