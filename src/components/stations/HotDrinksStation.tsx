import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  HOT_INGREDIENT_LABELS,
  canDoLatteArt,
  getVisibleHotIngredients,
  hasHotIngredients,
} from '../../data/recipes';
import { sound } from '../../services/sound';
import type { HotIngredientId, UnlockableRecipeId } from '../../types/game';
import {
  MILK_MAX_PORTIONS,
  MILK_POUR_HOLD_THRESHOLD_MS,
  MILK_QUICK_POUR_ANIM_MS,
  advanceMilkPour,
  resolveMilkPourRelease,
  type MilkPourFrameState,
} from '../../utils/milkPour';
import { HotCupSvg } from '../svg/DrinkVisualSvg';
import { BaristaCoasterSvg, IngredientIconSvg } from '../svg/UiIconsSvg';

interface HotDrinksStationProps {
  ingredients: Partial<Record<HotIngredientId, number>>;
  latteArtDataUrl?: string;
  isTakeawayOrder?: boolean;
  unlockedRecipes?: UnlockableRecipeId[];
  onAddIngredient: (id: HotIngredientId) => void;
  onSetWarmMilkCount: (count: number) => void;
  onRemoveIngredient: (id: HotIngredientId) => void;
  onOpenLatteArt: () => void;
  onClear: () => void;
  onPutOnTray: () => void;
}

interface ActivePointerPour {
  pointerId: number;
  startTime: number;
  startCount: number;
  holdStarted: boolean;
  completedDuringHold: boolean;
}

function triggerGentleHaptic(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Haptics unavailable or blocked
    }
  }
}

export const HotDrinksStation: React.FC<HotDrinksStationProps> = ({
  ingredients,
  latteArtDataUrl,
  isTakeawayOrder = false,
  unlockedRecipes = [],
  onAddIngredient,
  onSetWarmMilkCount,
  onRemoveIngredient,
  onOpenLatteArt,
  onClear,
  onPutOnTray,
}) => {
  const visibleIngredients = getVisibleHotIngredients(unlockedRecipes);
  const hasAny = hasHotIngredients(ingredients);
  const latteArtAllowed = canDoLatteArt(ingredients);
  const warmMilkCount = ingredients.warmMilk ?? 0;

  // Tactile milk pouring UI state (both hold-to-pour & quick-tap/keyboard animated pour)
  const [isPouringMilk, setIsPouringMilk] = useState(false);
  const [pourLevel, setPourLevel] = useState<number | null>(null);
  const [inNotch, setInNotch] = useState(false);

  const pointerRef = useRef<ActivePointerPour | null>(null);
  const frameStateRef = useRef<MilkPourFrameState>({
    level: 0,
    notchRemainingMs: 0,
    committedCount: 0,
  });
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const handledPointerUpRef = useRef(false);
  const onSetWarmMilkRef = useRef(onSetWarmMilkCount);

  useEffect(() => {
    onSetWarmMilkRef.current = onSetWarmMilkCount;
  }, [onSetWarmMilkCount]);

  const stopAllPourActivity = useCallback(() => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTsRef.current = null;
    pointerRef.current = null;
    sound.stopMilkPour();
    setIsPouringMilk(false);
    setPourLevel(null);
    setInNotch(false);
  }, []);

  // Clean up timers, rAF, and continuous Web Audio stream on unmount or window blur
  useEffect(() => {
    const handleBlur = () => {
      if (pointerRef.current) {
        stopAllPourActivity();
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
      stopAllPourActivity();
    };
  }, [stopAllPourActivity]);

  /** Smooth zero-hold animated pitcher pour for quick tap or keyboard Enter/Space */
  const runQuickTapPour = useCallback(
    (startCount: number) => {
      if (startCount >= MILK_MAX_PORTIONS) {
        sound.playPop();
        return;
      }
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const targetCount = Math.min(MILK_MAX_PORTIONS, startCount + 1);
      // Commit immediately so rapid double-taps or immediate "На тацю" never drop a portion
      onSetWarmMilkRef.current(targetCount);
      sound.playMilkSteam();
      triggerGentleHaptic(14);

      setIsPouringMilk(true);
      setInNotch(false);
      setPourLevel(startCount);

      const animStart = performance.now();
      const stepQuick = (now: number) => {
        const progress = Math.min(1, (now - animStart) / MILK_QUICK_POUR_ANIM_MS);
        const eased = 1 - (1 - progress) * (1 - progress);
        setPourLevel(startCount + (targetCount - startCount) * eased);
        if (progress < 1) {
          rafRef.current = window.requestAnimationFrame(stepQuick);
        } else {
          rafRef.current = null;
          setIsPouringMilk(false);
          setPourLevel(null);
        }
      };
      rafRef.current = window.requestAnimationFrame(stepQuick);
    },
    []
  );

  const startContinuousHoldPour = useCallback(() => {
    const active = pointerRef.current;
    if (!active || active.holdStarted) return;
    active.holdStarted = true;

    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    frameStateRef.current = {
      level: active.startCount,
      notchRemainingMs: 0,
      committedCount: active.startCount,
    };
    setIsPouringMilk(true);
    setPourLevel(active.startCount);
    setInNotch(false);
    sound.startMilkPour(active.startCount);
    lastTsRef.current = performance.now();

    const tick = (now: number) => {
      const currentPointer = pointerRef.current;
      if (!currentPointer || !currentPointer.holdStarted) {
        rafRef.current = null;
        return;
      }

      const prevTs = lastTsRef.current ?? now;
      lastTsRef.current = now;
      const dtMs = Math.max(0, now - prevTs);

      const { next, milestoneReached, completed } = advanceMilkPour(
        frameStateRef.current,
        dtMs
      );
      frameStateRef.current = next;

      setPourLevel(next.level);
      setInNotch(next.notchRemainingMs > 0);
      sound.updateMilkPour(next.level);

      if (milestoneReached === 1) {
        onSetWarmMilkRef.current(1);
        sound.playMilkMilestone(1);
        triggerGentleHaptic(18);
      } else if (milestoneReached === 2) {
        onSetWarmMilkRef.current(2);
        sound.playMilkMilestone(2);
        triggerGentleHaptic([16, 40, 22]);
      }

      if (completed) {
        currentPointer.completedDuringHold = true;
        sound.stopMilkPour();
        rafRef.current = null;
        settleTimerRef.current = window.setTimeout(() => {
          settleTimerRef.current = null;
          setIsPouringMilk(false);
          setPourLevel(null);
          setInNotch(false);
        }, 180);
        return;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, []);

  const handleMilkPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (warmMilkCount >= MILK_MAX_PORTIONS) {
      handledPointerUpRef.current = true;
      window.setTimeout(() => {
        handledPointerUpRef.current = false;
      }, 80);
      sound.playPop();
      return;
    }

    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic pointer events may not support capture
    }

    handledPointerUpRef.current = false;
    pointerRef.current = {
      pointerId: e.pointerId,
      startTime: performance.now(),
      startCount: warmMilkCount,
      holdStarted: false,
      completedDuringHold: false,
    };

    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      startContinuousHoldPour();
    }, MILK_POUR_HOLD_THRESHOLD_MS);
  };

  const finishMilkPointer = (
    e: React.PointerEvent<HTMLButtonElement>,
    cancelled: boolean
  ) => {
    const active = pointerRef.current;
    if (!active || active.pointerId !== e.pointerId) return;
    pointerRef.current = null;

    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTsRef.current = null;
    sound.stopMilkPour();

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore release errors
    }

    handledPointerUpRef.current = !cancelled;
    if (!cancelled) {
      window.setTimeout(() => {
        handledPointerUpRef.current = false;
      }, 80);
    }

    if (cancelled) {
      setIsPouringMilk(false);
      setPourLevel(null);
      setInNotch(false);
      return;
    }

    const heldMs = performance.now() - active.startTime;

    if (!active.holdStarted) {
      // Quick tap (< 140ms): zero-hold animated +1 portion pour!
      runQuickTapPour(active.startCount);
      return;
    }

    if (!active.completedDuringHold) {
      const finalCount = resolveMilkPourRelease(
        active.startCount,
        frameStateRef.current.level,
        heldMs
      );
      if (finalCount !== frameStateRef.current.committedCount) {
        onSetWarmMilkRef.current(finalCount);
        if (finalCount > frameStateRef.current.committedCount) {
          sound.playMilkMilestone(finalCount as 1 | 2);
        }
      }
    }

    setIsPouringMilk(false);
    setPourLevel(null);
    setInNotch(false);
  };

  /** Keyboard (Enter / Space) & accessibility zero-hold activation */
  const handleMilkClick = () => {
    if (handledPointerUpRef.current) {
      handledPointerUpRef.current = false;
      return;
    }
    runQuickTapPour(warmMilkCount);
  };

  const displayMilkLevel = pourLevel !== null ? pourLevel : warmMilkCount;

  const activeEntries = (
    Object.entries(ingredients) as [HotIngredientId, number][]
  ).filter(([, count]) => count > 0);

  const pourHintBadge = isPouringMilk
    ? inNotch
      ? {
          text: '✨ ×1 готово! Тримай для Лате',
          className:
            'border-[#6FA883] bg-[#E3F5E8] text-[#1D5632] shadow-xs',
        }
      : displayMilkLevel >= 1.98
        ? {
            text: '✨ Молочко ×2 (Лате) готово!',
            className:
              'border-[#5E9C74] bg-[#DDF4E5] text-[#184E2C] shadow-xs',
          }
        : displayMilkLevel >= 1
          ? {
              text: '🥛 Доливаємо до Лате ×2…',
              className:
                'border-[#D49744] bg-[#FFF2CC] text-[#73450F] shadow-xs',
            }
          : {
              text: '🥛 Наливаємо тепле молочко…',
              className:
                'border-[#D49744] bg-[#FFF5D8] text-[#73450F] shadow-xs',
            }
    : {
        text: '💡 Лате = 2× Тепле молоко',
        className: 'border-[#C89B58] bg-[#FDF1D4] text-[#7A4F1C]',
      };

  return (
    <div className="flex h-full min-h-0 flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-2.5 lg:gap-3">
      {/* Left: Cozy Linen Barista Mat with strict 3-tier non-overlapping column */}
      <div
        data-station-card="hot-cup"
        className="barista-linen-mat shrink-0 sm:col-span-4 flex sm:h-full sm:min-h-0 flex-row sm:flex-col justify-between gap-2 rounded-2xl sm:rounded-3xl border-2 border-[#9B724E] p-1.5 sm:p-2.5"
      >
        {/* Tier 1: Top Badge Row (desktop/tablet) */}
        <div
          data-station-header="hot-cup"
          className="hidden sm:flex relative z-10 shrink-0 w-full items-center justify-between gap-1"
        >
          <span className="rounded-full border border-[#CFA97F] bg-[#F5E4C8] px-2.5 py-0.5 text-[11px] font-bold text-[#5A3E32]">
            Прозора чашка
          </span>
          <span className="hidden lg:inline text-[10px] font-semibold text-[#8A6347]">
            Порядок не важливий ✨
          </span>
        </div>

        {/* Tier 2: Middle Vessel Zone (Cup resting directly on ONE neat coaster + live milk pitcher) */}
        <div className="flex shrink-0 sm:flex-1 sm:min-h-0 flex-col items-center justify-center gap-1 overflow-hidden">
          <div className="relative flex shrink-0 items-center justify-center gap-2">
            <div className="relative flex items-center justify-center">
              <BaristaCoasterSvg
                tint="cream"
                className="pointer-events-none absolute bottom-0.5 w-16 sm:w-24 lg:w-28 h-4 sm:h-5"
              />
              <HotCupSvg
                ingredients={ingredients}
                showSaucer={false}
                milkPourLevel={pourLevel ?? undefined}
                isPouringMilk={isPouringMilk}
                className="relative z-10 h-[62px] w-[62px] sm:h-[84px] sm:w-[84px] lg:h-[92px] lg:w-[92px]"
              />
            </div>

            {/* Bright «🎨 Лате-арт» trigger + circular miniature on sm+ */}
            {latteArtAllowed && (
              <div className="hidden sm:flex flex-col items-center gap-1">
                {latteArtDataUrl && (
                  <img
                    src={latteArtDataUrl}
                    alt="Твій лате-арт"
                    className="h-9 w-9 lg:h-10 lg:w-10 rounded-full border-2 border-[#FFFDF8] object-cover shadow-md ring-2 ring-[#C59160]"
                  />
                )}
                <button
                  type="button"
                  onClick={onOpenLatteArt}
                  className="barista-tile min-h-[32px] rounded-xl px-2 py-1 text-[10.5px] font-bold text-[#6F2D43] whitespace-nowrap"
                  style={{
                    backgroundImage: latteArtDataUrl
                      ? 'linear-gradient(155deg, #E5F6EA 0%, #BFE4CB 100%)'
                      : 'linear-gradient(155deg, #FFF2F6 0%, #F7C7D7 100%)',
                    borderColor: latteArtDataUrl ? '#43825A' : '#B65D78',
                  }}
                >
                  {latteArtDataUrl ? '🎨 Арт ✓' : '🎨 Лате-арт'}
                </button>
              </div>
            )}
          </div>

          {/* Caption / Chips strictly BELOW the coaster on sm+ */}
          <div className="hidden sm:flex shrink-0 min-h-[20px] w-full flex-wrap items-center justify-center gap-1 px-0.5">
            {activeEntries.length === 0 ? (
              <span className="text-[11px] font-semibold text-[#8A6449]">
                {isPouringMilk
                  ? 'Наливаємо тепле молочко…'
                  : 'Додай інгредієнти справа →'}
              </span>
            ) : (
              activeEntries.map(([id, count]) => (
                <motion.button
                  key={id}
                  type="button"
                  initial={{ scale: 0.78, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (id === 'warmMilk') stopAllPourActivity();
                    onRemoveIngredient(id);
                  }}
                  title="Натисни, щоб прибрати"
                  className="inline-flex items-center gap-1 rounded-full border border-[#C4986E] bg-[#FFFDF8] px-1.5 py-0.5 text-[9.5px] lg:text-[10px] font-bold text-[#5A3E32] shadow-2xs transition-colors hover:border-[#D47E96] hover:bg-[#FDF0F3]"
                >
                  <span>
                    {HOT_INGREDIENT_LABELS[id]}
                    {count > 1 ? ` ×${count}` : ''}
                  </span>
                  <span className="text-[9px] text-[#B06C7E]">✕</span>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Tier 3: Action Buttons (plus compact mobile chips & Latte Art button on portrait phone) */}
        <div className="flex flex-1 sm:flex-none shrink-0 sm:w-full flex-col justify-center gap-1.5 min-w-0">
          {/* Mobile-only chips + inline Latte Art trigger */}
          <div className="flex sm:hidden min-h-[22px] w-full flex-wrap items-center gap-1">
            {latteArtAllowed && (
              <button
                type="button"
                onClick={onOpenLatteArt}
                className="inline-flex items-center gap-1 rounded-full border-2 px-2 py-0.5 text-[10px] font-bold text-[#6F2D43] shadow-2xs"
                style={{
                  backgroundImage: latteArtDataUrl
                    ? 'linear-gradient(155deg, #E5F6EA 0%, #BFE4CB 100%)'
                    : 'linear-gradient(155deg, #FFF2F6 0%, #F7C7D7 100%)',
                  borderColor: latteArtDataUrl ? '#43825A' : '#B65D78',
                }}
              >
                {latteArtDataUrl && (
                  <img
                    src={latteArtDataUrl}
                    alt="Арт"
                    className="h-4 w-4 rounded-full object-cover"
                  />
                )}
                <span>{latteArtDataUrl ? '🎨 Арт ✓' : '🎨 Лате-арт'}</span>
              </button>
            )}
            {activeEntries.length === 0 ? (
              <span className="text-[10.5px] font-semibold text-[#8A6449]">
                {isPouringMilk
                  ? '🥛 Наливаємо молочко…'
                  : 'Обери інгредієнти нижче ↓'}
              </span>
            ) : (
              activeEntries.map(([id, count]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    if (id === 'warmMilk') stopAllPourActivity();
                    onRemoveIngredient(id);
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-[#C4986E] bg-[#FFFDF8] px-1.5 py-0.5 text-[9.5px] font-bold text-[#5A3E32]"
                >
                  <span>
                    {HOT_INGREDIENT_LABELS[id]}
                    {count > 1 ? ` ×${count}` : ''}
                  </span>
                  <span className="text-[9px] text-[#B06C7E]">✕</span>
                </button>
              ))
            )}
          </div>

          <div className="flex w-full gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                stopAllPourActivity();
                onPutOnTray();
              }}
              disabled={!hasAny}
              className={`min-h-[40px] sm:min-h-[36px] flex-1 rounded-2xl border-2 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                hasAny
                  ? 'border-[#3E7A56] border-b-4 bg-gradient-to-b from-[#94D3AA] to-[#6CB889] text-[#143D24] shadow-[0_4px_14px_rgba(78,150,104,0.38)] hover:brightness-105 active:translate-y-[2px] active:border-b-2'
                  : 'border-[#CBB49B] border-b-[3px] bg-[#ECE0CF] text-[#9E8772] cursor-not-allowed'
              }`}
            >
              {isTakeawayOrder && hasAny ? '🏃 Із собою →' : '✓ На тацю'}
            </button>
            <button
              type="button"
              onClick={() => {
                stopAllPourActivity();
                onClear();
              }}
              disabled={!hasAny && !isPouringMilk}
              title="Вилити (почати спочатку)"
              className={`min-h-[40px] sm:min-h-[36px] rounded-2xl border-2 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                hasAny || isPouringMilk
                  ? 'border-[#A85F73] border-b-[3px] bg-gradient-to-b from-[#FCEEF2] to-[#F4D3DD] text-[#83344A] shadow-xs hover:brightness-[0.98] active:translate-y-[2px] active:border-b-2'
                  : 'border-[#D1BFA9] border-b-[3px] bg-[#EFE5D7] text-[#B09B86] cursor-not-allowed'
              }`}
            >
              Вилити
            </button>
          </div>
        </div>
      </div>

      {/* Right: Recessed Wooden Ingredient Box — strict flex-col gap-2 h-full with zero content-center overflow */}
      <div
        data-station-card="hot-ingredients"
        className="barista-tray-recess flex-1 sm:col-span-8 flex h-full min-h-0 flex-col gap-1.5 sm:gap-2 rounded-2xl sm:rounded-3xl border-2 border-[#A67D58] px-2 pt-1.5 pb-2 sm:px-3 sm:pt-2.5 sm:pb-3 overflow-hidden"
      >
        {/* Strict Header Row physically above the grid — z-10 shrink-0 */}
        <div
          data-station-header="hot-ingredients"
          className="relative z-10 flex shrink-0 items-center justify-between gap-1.5 sm:gap-2"
        >
          <h2 className="font-handwriting text-lg sm:text-2xl leading-none font-bold text-[#4F3323]">
            Обери інгредієнти:
          </h2>
          <span
            className={`rounded-full border px-2 sm:px-2.5 py-0.5 text-[9.5px] sm:text-[11px] font-bold shadow-2xs whitespace-nowrap transition-colors ${pourHintBadge.className}`}
          >
            {pourHintBadge.text}
          </span>
        </div>

        {/* Dedicated Grid Box strictly below Header — 4×2 across all viewports so all 8 tiles fit above fold even on 375×667 */}
        <div className="flex-1 min-h-0 overflow-hidden sm:overflow-visible">
          <div className="grid grid-cols-4 grid-rows-2 gap-1.5 sm:gap-2 h-full">
            {visibleIngredients.map((item) => {
              const count = ingredients[item.id] ?? 0;
              const max = item.maxCount ?? 1;
              const isFull = count >= max;
              const isWarmMilk = item.id === 'warmMilk';
              const milkFillPercent = isWarmMilk
                ? Math.round((displayMilkLevel / MILK_MAX_PORTIONS) * 100)
                : 0;

              if (isWarmMilk) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-milk-pour-btn="true"
                    aria-label="Тепле молоко: натисни для однієї порції або затисни, щоб наливати з пітчера"
                    title="Затисни, щоб наливати з пітчера (або просто клікни для +1 порції)"
                    onPointerDown={handleMilkPointerDown}
                    onPointerUp={(e) => finishMilkPointer(e, false)}
                    onPointerCancel={(e) => finishMilkPointer(e, true)}
                    onClick={handleMilkClick}
                    onContextMenu={(e) => e.preventDefault()}
                    className={`barista-tile group relative flex h-full min-h-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-xl sm:rounded-2xl px-1 sm:px-2 py-1 sm:py-1.5 text-center touch-none select-none ${
                      isPouringMilk ? 'ring-2 ring-[#D69B46]/80' : ''
                    }`}
                    style={{
                      backgroundImage: item.buttonGradient,
                      borderColor: isPouringMilk
                        ? '#C27D2C'
                        : count > 0
                          ? '#4B8B63'
                          : item.buttonBorder,
                    }}
                  >
                    {/* Live creamy tactile pour progress gauge behind label */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-[#F6DDA6]/65 to-[#F1C97F]/55 transition-[width] duration-75"
                      style={{ width: `${milkFillPercent}%` }}
                    />

                    {/* Subtle center ×1 tick line while pouring */}
                    {isPouringMilk && (
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-1.5 left-1/2 w-[1.5px] -translate-x-1/2 rounded-full ${
                          displayMilkLevel >= 0.98
                            ? 'bg-[#4B8B63]/75'
                            : 'bg-[#B98746]/45'
                        }`}
                      />
                    )}

                    {count > 0 && (
                      <span className="absolute right-1 top-0.5 sm:right-1.5 sm:top-1 z-10 rounded-full border border-[#4B8B63]/40 bg-[#A7DCB8] px-1 sm:px-1.5 py-0.2 text-[8.5px] sm:text-[9.5px] font-bold text-[#174A2C]">
                        ×{count}
                      </span>
                    )}

                    <IngredientIconSvg
                      type={item.id}
                      className={`relative z-10 h-5 w-5 sm:h-6 sm:w-6 shrink-0 drop-shadow-[0_1px_1px_rgba(90,62,50,0.16)] transition-transform ${
                        isPouringMilk ? '-rotate-12 scale-105' : ''
                      }`}
                    />
                    <span className="relative z-10 text-[9.5px] min-[420px]:text-[11px] sm:text-xs font-bold leading-[1.12] text-[#4D3224]">
                      {item.label}
                    </span>

                    <div className="relative z-10 flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[9px] font-bold text-[#7E522B]">
                      <span
                        className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full border border-[#8E6138] transition-colors ${
                          displayMilkLevel >= 0.98 ? 'bg-[#B97B42]' : 'bg-[#FFFDF8]'
                        }`}
                      />
                      <span
                        className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full border border-[#8E6138] transition-colors ${
                          displayMilkLevel >= 1.98 ? 'bg-[#B97B42]' : 'bg-[#FFFDF8]'
                        }`}
                      />
                      <span className="whitespace-nowrap">
                        {isPouringMilk
                          ? inNotch
                            ? '×1 ✨'
                            : 'ллється…'
                          : count === 1
                            ? 'ще ×2'
                            : count === 2
                              ? '×2 ✓'
                              : 'тримай'}
                      </span>
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAddIngredient(item.id)}
                  className="barista-tile group relative flex h-full min-h-0 flex-col items-center justify-center gap-0.5 rounded-xl sm:rounded-2xl px-1 sm:px-2 py-1 sm:py-1.5 text-center"
                  style={{
                    backgroundImage: item.buttonGradient,
                    borderColor: count > 0 ? '#4B8B63' : item.buttonBorder,
                  }}
                >
                  {count > 0 && (
                    <span className="absolute right-1 top-0.5 sm:right-1.5 sm:top-1 rounded-full border border-[#4B8B63]/40 bg-[#A7DCB8] px-1 sm:px-1.5 py-0.2 text-[8.5px] sm:text-[9.5px] font-bold text-[#174A2C]">
                      {max > 1 ? `×${count}` : '✓'}
                    </span>
                  )}

                  <IngredientIconSvg
                    type={item.id}
                    className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 drop-shadow-[0_1px_1px_rgba(90,62,50,0.16)]"
                  />
                  <span className="text-[9.5px] min-[420px]:text-[11px] sm:text-xs font-bold leading-[1.12] text-[#4D3224]">
                    {item.label}
                  </span>

                  {isFull && (
                    <span className="text-[8.5px] sm:text-[9px] font-bold text-[#2B6E44] leading-none">
                      У чашці
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
