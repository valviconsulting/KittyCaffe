// Pure tactile milk-pouring mechanics for «Мур-Лате» (Step 03 — Mobile-First)
// Supports both continuous hold-to-pour (mouse/touch) with a friendly magnetic notch at ×1,
// and zero-hold quick-tap / keyboard single-portion pouring.

export const MILK_MAX_PORTIONS = 2;
/** Hold duration before switching from a quick tap (+1) to continuous pouring. */
export const MILK_POUR_HOLD_THRESHOLD_MS = 140;
/** Time required to pour 1 full portion while holding continuously. */
export const MILK_POUR_DURATION_PER_PORTION_MS = 720;
/** Gentle magnetic pause at ×1 when pouring from 0 so stopping at 1 portion is effortless. */
export const MILK_POUR_NOTCH_MS = 230;
/** Visual auto-pour duration for quick-tap / keyboard mode. */
export const MILK_QUICK_POUR_ANIM_MS = 380;

export interface MilkPourFrameState {
  /** Current continuous milk level in [0, 2]. */
  level: number;
  /** Remaining magnetic pause time (ms) at level 1.0 before continuing toward 2.0. */
  notchRemainingMs: number;
  /** Highest committed discrete milestone (0, 1, or 2). */
  committedCount: number;
}

export interface MilkPourStepResult {
  next: MilkPourFrameState;
  /** Non-null if this frame crossed a milestone (1 or 2). */
  milestoneReached: 1 | 2 | null;
  /** True when the cup reached the maximum 2.0 portions and pouring should finish. */
  completed: boolean;
}

/**
 * Advances continuous milk pouring by `dtMs` milliseconds.
 * Pure & deterministic so it can be unit-tested independently of DOM timers.
 */
export function advanceMilkPour(
  state: MilkPourFrameState,
  dtMs: number
): MilkPourStepResult {
  const safeDt = Math.max(0, Math.min(dtMs, 100));
  if (state.level >= MILK_MAX_PORTIONS) {
    return {
      next: {
        level: MILK_MAX_PORTIONS,
        notchRemainingMs: 0,
        committedCount: MILK_MAX_PORTIONS,
      },
      milestoneReached: null,
      completed: true,
    };
  }

  let level = state.level;
  let notchRemainingMs = state.notchRemainingMs;
  let committedCount = state.committedCount;
  let milestoneReached: 1 | 2 | null = null;

  if (notchRemainingMs > 0) {
    const consumed = Math.min(notchRemainingMs, safeDt);
    notchRemainingMs -= consumed;
    const leftoverDt = safeDt - consumed;
    if (leftoverDt > 0) {
      level = Math.min(
        MILK_MAX_PORTIONS,
        level + leftoverDt / MILK_POUR_DURATION_PER_PORTION_MS
      );
    }
  } else {
    const prevLevel = level;
    const delta = safeDt / MILK_POUR_DURATION_PER_PORTION_MS;
    const candidate = prevLevel + delta;

    // Crossed ×1 from below -> engage friendly magnetic notch & commit portion 1
    if (prevLevel < 1 && candidate >= 1) {
      level = 1;
      notchRemainingMs = MILK_POUR_NOTCH_MS;
      if (committedCount < 1) {
        committedCount = 1;
        milestoneReached = 1;
      }
    } else {
      level = Math.min(MILK_MAX_PORTIONS, candidate);
    }
  }

  // Reached ×2 -> commit portion 2 and complete gracefully (zero overflow!)
  if (level >= MILK_MAX_PORTIONS) {
    level = MILK_MAX_PORTIONS;
    notchRemainingMs = 0;
    if (committedCount < MILK_MAX_PORTIONS) {
      committedCount = MILK_MAX_PORTIONS;
      milestoneReached = 2;
    }
    return {
      next: { level, notchRemainingMs, committedCount },
      milestoneReached,
      completed: true,
    };
  }

  return {
    next: { level, notchRemainingMs, committedCount },
    milestoneReached,
    completed: false,
  };
}

/**
 * Resolves the final discrete warmMilk count (1 or 2) when the player releases their finger/mouse.
 * Never punishes partial pours:
 * - Quick tap (or release before 1.0): gently tops off to startCount + 1 (clamped to 2).
 * - Released right on or just slightly past the ×1 notch (< 1.24): keeps clean ×1 for Cappuccino/Cocoa!
 * - Released clearly past 1.24 while holding: gently tops off to ×2 for Latte!
 */
export function resolveMilkPourRelease(
  startCount: number,
  currentLevel: number,
  heldMs: number
): number {
  const clampedStart = Math.max(0, Math.min(MILK_MAX_PORTIONS, Math.floor(startCount)));
  if (clampedStart >= MILK_MAX_PORTIONS) return MILK_MAX_PORTIONS;

  // Quick tap / accessibility single press: always cleanly adds +1 portion
  if (heldMs < MILK_POUR_HOLD_THRESHOLD_MS) {
    return Math.min(MILK_MAX_PORTIONS, clampedStart + 1);
  }

  // Starting from 1 portion and holding -> always top off to 2
  if (clampedStart === 1) {
    return MILK_MAX_PORTIONS;
  }

  // Starting from 0 portions:
  if (currentLevel < 1.24) {
    return 1;
  }
  return MILK_MAX_PORTIONS;
}
