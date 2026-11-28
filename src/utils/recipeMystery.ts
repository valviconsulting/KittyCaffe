import {
  MYSTERY_EVENING_NOTES,
  MYSTERY_FINALE_BONUS_COINS,
} from '../data/recipeMystery.ts';
import type {
  MysteryDay1ChoiceId,
  MysteryDay2ChoiceId,
  RecipeMysteryRole,
  RecipeMysteryStoryState,
} from '../types/game';

export function createInitialRecipeMysteryState(): RecipeMysteryStoryState {
  return {
    status: 'not_started',
    stageDay: 1,
    discoveredClues: [],
    servedStepsToday: [],
    day1Choice: null,
    day2Choice: null,
    finaleRewardClaimed: false,
    showCounterSouvenir: true,
  };
}

/** Starts Chapter 2 («Таємниця загубленого рецепта») cleanly at Stage Day 1 */
export function startRecipeMysteryChapter(
  prev: RecipeMysteryStoryState
): RecipeMysteryStoryState {
  if (prev.status === 'completed') return prev;
  return {
    ...prev,
    status: 'active',
    stageDay: 1,
    discoveredClues: prev.discoveredClues.includes(1)
      ? prev.discoveredClues
      : [1],
    servedStepsToday: [],
    showCounterSouvenir: true,
  };
}

export function recordMysteryDay1Choice(
  prev: RecipeMysteryStoryState,
  choice: MysteryDay1ChoiceId
): RecipeMysteryStoryState {
  const nextClues = prev.discoveredClues.includes(1)
    ? prev.discoveredClues
    : [...prev.discoveredClues, 1].sort((a, b) => a - b);
  return {
    ...prev,
    day1Choice: choice,
    discoveredClues: nextClues,
  };
}

export function recordMysteryDay2Choice(
  prev: RecipeMysteryStoryState,
  choice: MysteryDay2ChoiceId
): RecipeMysteryStoryState {
  const nextClues = prev.discoveredClues.includes(2)
    ? prev.discoveredClues
    : [...prev.discoveredClues, 2].sort((a, b) => a - b);
  return {
    ...prev,
    day2Choice: choice,
    discoveredClues: nextClues,
  };
}

/**
 * Determines whether the next arriving guest slot inside the current day should be a
 * scripted Chapter 2 Detective Mystery visit:
 * - Stage Day 1: slot #0 -> Marsel brings torn page & Clue 1
 * - Stage Day 2: slot #0 -> Sofiya brings Clue 2; slot #2 (3rd guest) -> Persyk brings Clue 3
 * - Stage Day 3: slot #0 -> Marsel returns for the Detective Finale (brew Golden Cocoa!)
 */
export function getMysteryOrderRoleForSlot(
  story: RecipeMysteryStoryState,
  guestsServedTodayCount: number
): RecipeMysteryRole | null {
  if (story.status !== 'active') return null;

  if (story.stageDay === 1) {
    if (!story.servedStepsToday.includes('mystery_day1_marsel')) {
      return 'mystery_day1_marsel';
    }
    return null;
  }

  if (story.stageDay === 2) {
    if (
      guestsServedTodayCount === 0 &&
      !story.servedStepsToday.includes('mystery_day2_sofiya')
    ) {
      return 'mystery_day2_sofiya';
    }
    if (
      guestsServedTodayCount >= 2 &&
      !story.servedStepsToday.includes('mystery_day2_persyk')
    ) {
      return 'mystery_day2_persyk';
    }
    return null;
  }

  // Stage Day 3: Detective Finale immediately on first guest (or next guest if mid-day)
  if (
    story.stageDay === 3 &&
    !story.servedStepsToday.includes('mystery_day3_finale')
  ) {
    return 'mystery_day3_finale';
  }
  return null;
}

/** Records a completed scripted mystery visit & unlocks its clue (or completes the finale immediately!) */
export function markMysteryStepServed(
  story: RecipeMysteryStoryState,
  role: RecipeMysteryRole
): {
  nextStory: RecipeMysteryStoryState;
  finaleBonusCoins: number;
  justSolvedMystery: boolean;
} {
  if (story.status !== 'active') {
    return {
      nextStory: story,
      finaleBonusCoins: 0,
      justSolvedMystery: false,
    };
  }

  const nextServed = story.servedStepsToday.includes(role)
    ? story.servedStepsToday
    : [...story.servedStepsToday, role];

  const clueSet = new Set<number>(story.discoveredClues);
  if (role === 'mystery_day1_marsel') clueSet.add(1);
  if (role === 'mystery_day2_sofiya') {
    clueSet.add(1);
    clueSet.add(2);
  }
  if (role === 'mystery_day2_persyk') {
    clueSet.add(1);
    clueSet.add(2);
    clueSet.add(3);
  }

  if (role === 'mystery_day3_finale') {
    clueSet.add(1);
    clueSet.add(2);
    clueSet.add(3);
    const bonus = story.finaleRewardClaimed ? 0 : MYSTERY_FINALE_BONUS_COINS;
    return {
      nextStory: {
        ...story,
        status: 'completed',
        discoveredClues: [1, 2, 3],
        servedStepsToday: nextServed,
        finaleRewardClaimed: true,
        showCounterSouvenir: true,
      },
      finaleBonusCoins: bonus,
      justSolvedMystery: !story.finaleRewardClaimed,
    };
  }

  return {
    nextStory: {
      ...story,
      discoveredClues: Array.from(clueSet).sort((a, b) => a - b),
      servedStepsToday: nextServed,
    },
    finaleBonusCoins: 0,
    justSolvedMystery: false,
  };
}

/** Provides an evening diary highlight override for Chapter 2 days */
export function settleRecipeMysteryAtEvening(story: RecipeMysteryStoryState): {
  nextStory: RecipeMysteryStoryState;
  eveningHighlightOverride: string | null;
} {
  if (story.status === 'active') {
    if (story.stageDay === 1) {
      return {
        nextStory: story,
        eveningHighlightOverride: MYSTERY_EVENING_NOTES.day1,
      };
    }
    if (story.stageDay === 2) {
      // Ensure clues 2 & 3 are available for Day 3 even if Day 2 was joined late
      const ensuredClues = [1, 2, 3];
      return {
        nextStory: { ...story, discoveredClues: ensuredClues },
        eveningHighlightOverride: MYSTERY_EVENING_NOTES.day2,
      };
    }
  }

  if (
    story.status === 'completed' &&
    story.servedStepsToday.includes('mystery_day3_finale')
  ) {
    return {
      nextStory: story,
      eveningHighlightOverride: MYSTERY_EVENING_NOTES.day3Solved(
        story.day2Choice
      ),
    };
  }

  return {
    nextStory: story,
    eveningHighlightOverride: null,
  };
}

/** Advances stageDay (1 -> 2 -> 3) cleanly on Next Morning */
export function advanceMysteryStageOnNextMorning(
  story: RecipeMysteryStoryState
): RecipeMysteryStoryState {
  if (story.status === 'completed') {
    return {
      ...story,
      servedStepsToday: [],
    };
  }
  if (story.status !== 'active') return story;
  const nextStage: 1 | 2 | 3 =
    story.stageDay === 1 ? 2 : story.stageDay === 2 ? 3 : 3;
  return {
    ...story,
    stageDay: nextStage,
    servedStepsToday: [],
    discoveredClues:
      nextStage === 3 ? [1, 2, 3] : story.discoveredClues,
  };
}

export function isGoldenCocoaUnlocked(
  story: RecipeMysteryStoryState
): boolean {
  return story.status === 'completed';
}
