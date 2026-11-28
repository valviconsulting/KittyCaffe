import {
  FRIENDSHIP_MOMENTS,
  FRIENDSHIP_MOMENT_ORDER,
  MOOD_RIDDLES,
  type MoodRiddleSpec,
} from '../data/livingFriendship.ts';
import type {
  FriendshipMomentId,
  LivingFriendshipState,
  PendingFriendGift,
  RegularGuestId,
} from '../types/game';

export function createInitialLivingFriendshipState(): LivingFriendshipState {
  return {
    pendingGift: null,
    completedMoments: [],
    moodRiddlesSolved: 0,
  };
}

/** Records that the player prepared & sent a surprise gift for another friend */
export function recordSentFriendGift(
  prev: LivingFriendshipState,
  momentId: FriendshipMomentId,
  wishText?: string
): LivingFriendshipState {
  const meta = FRIENDSHIP_MOMENTS[momentId];
  const pendingGift: PendingFriendGift = {
    momentId,
    fromGuestId: meta.fromGuestId,
    toGuestId: meta.toGuestId,
    wishText: wishText?.trim() ? wishText.trim().slice(0, 48) : undefined,
  };
  return {
    ...prev,
    pendingGift,
  };
}

/** Completes the gift exchange when the recipient guest finishes their happy visit */
export function completeReceivedFriendGift(
  prev: LivingFriendshipState,
  momentId: FriendshipMomentId
): {
  nextState: LivingFriendshipState;
  isFirstTimeMoment: boolean;
} {
  const isFirstTimeMoment = !prev.completedMoments.includes(momentId);
  const nextCompleted = isFirstTimeMoment
    ? [...prev.completedMoments, momentId]
    : prev.completedMoments;

  return {
    nextState: {
      ...prev,
      pendingGift:
        prev.pendingGift?.momentId === momentId ? null : prev.pendingGift,
      completedMoments: nextCompleted,
    },
    isFirstTimeMoment,
  };
}

export function recordSolvedMoodRiddle(
  prev: LivingFriendshipState
): LivingFriendshipState {
  return {
    ...prev,
    moodRiddlesSolved: prev.moodRiddlesSolved + 1,
  };
}

export type LivingEventDirective =
  | {
      type: 'receive_gift';
      momentId: FriendshipMomentId;
      wishText?: string;
    }
  | {
      type: 'send_gift';
      momentId: FriendshipMomentId;
    }
  | {
      type: 'mood_riddle';
      riddle: MoodRiddleSpec;
    };

/**
 * Picks an organic Living Friendship event for a regular order slot (when no scripted
 * Chapter 1 / Chapter 2 / Traveler beat is active):
 * 1. If a `pendingGift` is waiting, the recipient ALWAYS arrives next!
 * 2. Every ~4th regular order after #6 (#7, #11, #15, #19...) triggers a cross-guest gift exchange
 *    (preferring moments the child hasn't seen yet!).
 * 3. On alternating cadence (#9, #13, #17, #21...), triggers a cozy flavor mood riddle!
 */
export function resolveNextLivingEvent(
  state: LivingFriendshipState,
  orderNumber: number,
  previousGuestId?: RegularGuestId | 'mandrivnyk'
): LivingEventDirective | null {
  if (state.pendingGift) {
    return {
      type: 'receive_gift',
      momentId: state.pendingGift.momentId,
      wishText: state.pendingGift.wishText,
    };
  }

  if (orderNumber < 7) return null;

  // Cross-guest surprise gift cadence: #7, #11, #15, #19, #23...
  if ((orderNumber - 7) % 4 === 0) {
    const unseen = FRIENDSHIP_MOMENT_ORDER.filter(
      (id) =>
        !state.completedMoments.includes(id) &&
        FRIENDSHIP_MOMENTS[id].fromGuestId !== previousGuestId
    );
    const pool =
      unseen.length > 0
        ? unseen
        : FRIENDSHIP_MOMENT_ORDER.filter(
            (id) => FRIENDSHIP_MOMENTS[id].fromGuestId !== previousGuestId
          );
    const picked = pool[Math.floor(orderNumber / 4) % pool.length];
    return { type: 'send_gift', momentId: picked };
  }

  // Cozy flavor mood-riddle cadence: #9, #13, #17, #21...
  if ((orderNumber - 9) % 4 === 0) {
    const eligible = MOOD_RIDDLES.filter((r) => r.guestId !== previousGuestId);
    const picked =
      eligible[Math.floor(orderNumber / 4) % eligible.length] ??
      MOOD_RIDDLES[0];
    return { type: 'mood_riddle', riddle: picked };
  }

  return null;
}
