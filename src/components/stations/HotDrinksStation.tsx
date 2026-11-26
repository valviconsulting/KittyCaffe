import { motion } from 'framer-motion';
import React from 'react';
import {
  HOT_INGREDIENT_LABELS,
  canDoLatteArt,
  getVisibleHotIngredients,
  hasHotIngredients,
} from '../../data/recipes';
import type { HotIngredientId, UnlockableRecipeId } from '../../types/game';
import { HotCupSvg } from '../svg/DrinkVisualSvg';
import { BaristaCoasterSvg, IngredientIconSvg } from '../svg/UiIconsSvg';

interface HotDrinksStationProps {
  ingredients: Partial<Record<HotIngredientId, number>>;
  latteArtDataUrl?: string;
  isTakeawayOrder?: boolean;
  unlockedRecipes?: UnlockableRecipeId[];
  onAddIngredient: (id: HotIngredientId) => void;
  onRemoveIngredient: (id: HotIngredientId) => void;
  onOpenLatteArt: () => void;
  onClear: () => void;
  onPutOnTray: () => void;
}

export const HotDrinksStation: React.FC<HotDrinksStationProps> = ({
  ingredients,
  latteArtDataUrl,
  isTakeawayOrder = false,
  unlockedRecipes = [],
  onAddIngredient,
  onRemoveIngredient,
  onOpenLatteArt,
  onClear,
  onPutOnTray,
}) => {
  const visibleIngredients = getVisibleHotIngredients(unlockedRecipes);
  const hasAny = hasHotIngredients(ingredients);
  const latteArtAllowed = canDoLatteArt(ingredients);
  const activeEntries = (
    Object.entries(ingredients) as [HotIngredientId, number][]
  ).filter(([, count]) => count > 0);

  return (
    <div className="flex h-full min-h-0 flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-2.5 lg:gap-3">
      {/* Left: Cozy Linen Barista Mat with strict 3-tier non-overlapping column */}
      <div
        data-station-card="hot-cup"
        className="barista-linen-mat shrink-0 sm:col-span-4 flex sm:h-full sm:min-h-0 flex-row sm:flex-col justify-between gap-2 rounded-2xl sm:rounded-3xl border-2 border-[#9B724E] p-2 sm:p-2.5"
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

        {/* Tier 2: Middle Vessel Zone (Cup resting directly on ONE neat coaster + Latte Art on sm+ + chips below) */}
        <div className="flex shrink-0 sm:flex-1 sm:min-h-0 flex-col items-center justify-center gap-1 overflow-hidden">
          <div className="relative flex shrink-0 items-center justify-center gap-2">
            <div className="relative flex items-center justify-center">
              <BaristaCoasterSvg
                tint="cream"
                className="pointer-events-none absolute bottom-0.5 w-20 sm:w-24 lg:w-28 h-5"
              />
              <HotCupSvg
                ingredients={ingredients}
                showSaucer={false}
                className="relative z-10 h-[72px] w-[72px] sm:h-[84px] sm:w-[84px] lg:h-[92px] lg:w-[92px]"
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
                Додай інгредієнти справа →
              </span>
            ) : (
              activeEntries.map(([id, count]) => (
                <motion.button
                  key={id}
                  type="button"
                  initial={{ scale: 0.78, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onRemoveIngredient(id)}
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
                Обери інгредієнти нижче ↓
              </span>
            ) : (
              activeEntries.map(([id, count]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onRemoveIngredient(id)}
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
              onClick={onPutOnTray}
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
              onClick={onClear}
              disabled={!hasAny}
              title="Вилити (почати спочатку)"
              className={`min-h-[40px] sm:min-h-[36px] rounded-2xl border-2 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                hasAny
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
        className="barista-tray-recess flex-1 sm:col-span-8 flex h-full min-h-0 flex-col gap-2 rounded-2xl sm:rounded-3xl border-2 border-[#A67D58] px-2.5 pt-2 pb-2.5 sm:px-3 sm:pt-2.5 sm:pb-3 overflow-hidden"
      >
        {/* Strict Header Row physically above the grid — z-10 shrink-0 */}
        <div
          data-station-header="hot-ingredients"
          className="relative z-10 flex shrink-0 items-center justify-between gap-2"
        >
          <h2 className="font-handwriting text-xl sm:text-2xl leading-none font-bold text-[#4F3323]">
            Обери інгредієнти:
          </h2>
          <span className="rounded-full border border-[#C89B58] bg-[#FDF1D4] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#7A4F1C] shadow-2xs whitespace-nowrap">
            💡 Лате = 2× Тепле молоко
          </span>
        </div>

        {/* Dedicated Grid Box strictly below Header — 3 cols on phone (all 8 items fit above fold!), 4×2 on sm+ */}
        <div className="cozy-scroll flex-1 min-h-0 overflow-y-auto sm:overflow-visible overflow-x-hidden">
          <div className="grid grid-cols-3 sm:grid-cols-4 sm:grid-rows-2 gap-1.5 sm:gap-2 h-full">
            {visibleIngredients.map((item) => {
              const count = ingredients[item.id] ?? 0;
              const max = item.maxCount ?? 1;
              const isFull = count >= max;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAddIngredient(item.id)}
                  className="barista-tile group relative flex h-full min-h-[54px] sm:min-h-0 flex-col items-center justify-center gap-0.5 rounded-2xl px-1.5 sm:px-2 py-1 sm:py-1.5 text-center"
                  style={{
                    backgroundImage: item.buttonGradient,
                    borderColor: count > 0 ? '#4B8B63' : item.buttonBorder,
                  }}
                >
                  {count > 0 && (
                    <span className="absolute right-1.5 top-1 rounded-full border border-[#4B8B63]/40 bg-[#A7DCB8] px-1.5 py-0.2 text-[9.5px] font-bold text-[#174A2C]">
                      {max > 1 ? `×${count}` : '✓'}
                    </span>
                  )}

                  <IngredientIconSvg
                    type={item.id}
                    className="h-6 w-6 shrink-0 drop-shadow-[0_1px_1px_rgba(90,62,50,0.16)]"
                  />
                  <span className="text-[11px] sm:text-xs font-bold leading-tight text-[#4D3224]">
                    {item.label}
                  </span>

                  {item.id === 'warmMilk' && (
                    <div className="flex items-center gap-1 text-[9px] font-bold text-[#7E522B]">
                      <span
                        className={`h-2 w-2 rounded-full border border-[#8E6138] ${
                          count >= 1 ? 'bg-[#B97B42]' : 'bg-[#FFFDF8]'
                        }`}
                      />
                      <span
                        className={`h-2 w-2 rounded-full border border-[#8E6138] ${
                          count >= 2 ? 'bg-[#B97B42]' : 'bg-[#FFFDF8]'
                        }`}
                      />
                      <span>
                        {count === 1 ? 'ще (лате)' : count === 2 ? '×2' : 'до ×2'}
                      </span>
                    </div>
                  )}

                  {item.id !== 'warmMilk' && isFull && (
                    <span className="text-[9px] font-bold text-[#2B6E44] leading-none">
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
