import React from 'react';
import {
  BLENDER_INGREDIENTS,
  TALL_GLASS_INGREDIENTS,
  TALL_INGREDIENT_LABELS,
  hasBlenderIngredients,
  hasTallIngredients,
} from '../../data/recipes';
import type {
  BlenderIngredientId,
  TallGlassIngredientId,
} from '../../types/game';
import { BlenderSvg, TallGlassSvg } from '../svg/DrinkVisualSvg';
import { BaristaCoasterSvg, IngredientIconSvg } from '../svg/UiIconsSvg';

interface ColdDrinksStationProps {
  glassMode: 'empty' | 'cocktail' | 'milkshake';
  cocktailIngredients: Partial<Record<TallGlassIngredientId, number>>;
  blenderIngredients: Partial<Record<BlenderIngredientId, number>>;
  pouredMilkshakeIngredients: Partial<Record<BlenderIngredientId, number>>;
  whippedCream: boolean;
  isBlending: boolean;
  isTakeawayOrder?: boolean;
  onAddCocktailIngredient: (id: TallGlassIngredientId) => void;
  onRemoveCocktailIngredient: (id: TallGlassIngredientId) => void;
  onAddBlenderIngredient: (id: BlenderIngredientId) => void;
  onRemoveBlenderIngredient: (id: BlenderIngredientId) => void;
  onBlend: () => void;
  onToggleWhippedCream: () => void;
  onClearAll: () => void;
  onPutOnTray: () => void;
}

export const ColdDrinksStation: React.FC<ColdDrinksStationProps> = ({
  glassMode,
  cocktailIngredients,
  blenderIngredients,
  pouredMilkshakeIngredients,
  whippedCream,
  isBlending,
  isTakeawayOrder = false,
  onAddCocktailIngredient,
  onRemoveCocktailIngredient,
  onAddBlenderIngredient,
  onRemoveBlenderIngredient,
  onBlend,
  onToggleWhippedCream,
  onClearAll,
  onPutOnTray,
}) => {
  const glassReady =
    (glassMode === 'cocktail' && hasTallIngredients(cocktailIngredients)) ||
    glassMode === 'milkshake';
  const blenderHasItems = hasBlenderIngredients(blenderIngredients);

  const cocktailEntries = (
    Object.entries(cocktailIngredients) as [TallGlassIngredientId, number][]
  ).filter(([, c]) => c > 0);

  const blenderEntries = (
    Object.entries(blenderIngredients) as [BlenderIngredientId, number][]
  ).filter(([, c]) => c > 0);

  return (
    <div className="flex h-full min-h-0 flex-col lg:grid lg:grid-cols-12 gap-2 sm:gap-2.5 overflow-y-auto lg:overflow-hidden cozy-scroll">
      {/* Left: Cozy Linen Mat for Tall Glass (horizontal strip on phone/tablet-portrait, left column on lg+) */}
      <div
        data-station-card="cold-glass"
        className="barista-linen-mat shrink-0 lg:col-span-3 flex lg:h-full lg:min-h-0 flex-row lg:flex-col justify-between gap-2 rounded-2xl sm:rounded-3xl border-2 border-[#7E9E85] p-2 sm:p-2.5"
      >
        {/* Tier 1: Top Vessel Badge */}
        <div
          data-station-header="cold-glass"
          className="hidden lg:flex relative z-10 shrink-0 w-full justify-center"
        >
          <span className="rounded-full border border-[#8EB697] bg-[#E2F1E5] px-2.5 py-0.5 text-[11px] font-bold text-[#255739]">
            {glassMode === 'milkshake' ? 'Келих із мілкшейком' : 'Високий келих'}
          </span>
        </div>

        {/* Tier 2: Tall Glass on sage woven coaster + separate caption below */}
        <div className="flex shrink-0 lg:flex-1 lg:min-h-0 flex-col items-center justify-center gap-1 overflow-hidden">
          <div className="relative flex shrink-0 items-center justify-center">
            <BaristaCoasterSvg
              tint="sage"
              className="pointer-events-none absolute bottom-0.5 w-20 lg:w-24 h-5"
            />
            <TallGlassSvg
              mode={glassMode === 'milkshake' ? 'milkshake' : 'cocktail'}
              cocktailIngredients={cocktailIngredients}
              milkshakeIngredients={pouredMilkshakeIngredients}
              whippedCream={whippedCream}
              className="relative z-10 h-[76px] w-[58px] sm:h-[84px] sm:w-[64px] lg:h-[94px] lg:w-[72px]"
            />
          </div>

          <div className="hidden lg:flex shrink-0 min-h-[20px] w-full flex-wrap items-center justify-center gap-1 px-0.5">
            {glassMode === 'cocktail' && cocktailEntries.length > 0 ? (
              cocktailEntries.map(([id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onRemoveCocktailIngredient(id)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#8BB898] bg-[#FFFDF8] px-1.5 py-0.5 text-[9.5px] font-bold text-[#245738] hover:bg-[#FDF0F3]"
                >
                  <span>{TALL_INGREDIENT_LABELS[id]}</span>
                  <span className="text-[#B06C7E]">✕</span>
                </button>
              ))
            ) : glassMode === 'milkshake' ? (
              <span className="rounded-full border border-[#DDA4B6] bg-[#FCE9EF] px-2.5 py-0.5 text-[10px] font-bold text-[#85334E]">
                {whippedCream ? 'Мілкшейк + Вершки ✨' : 'Збито! Додай вершки ✨'}
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-[#5E846A] text-center leading-tight">
                Збери коктейль або збий мілкшейк →
              </span>
            )}
          </div>
        </div>

        {/* Tier 3: Actions (+ mobile/tablet-portrait chips) */}
        <div className="flex flex-1 lg:flex-none shrink-0 lg:w-full flex-col justify-center gap-1.5 min-w-0">
          <div className="flex lg:hidden min-h-[22px] w-full flex-wrap items-center gap-1">
            {glassMode === 'cocktail' && cocktailEntries.length > 0 ? (
              cocktailEntries.map(([id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onRemoveCocktailIngredient(id)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#8BB898] bg-[#FFFDF8] px-2 py-0.5 text-[9.5px] font-bold text-[#245738]"
                >
                  <span>{TALL_INGREDIENT_LABELS[id]}</span>
                  <span className="text-[#B06C7E]">✕</span>
                </button>
              ))
            ) : glassMode === 'milkshake' ? (
              <span className="rounded-full bg-[#FCE9EF] px-2.5 py-0.5 text-[10px] font-bold text-[#85334E]">
                {whippedCream ? 'Мілкшейк + Вершки ✨' : 'Збито! Додай вершки ✨'}
              </span>
            ) : (
              <span className="text-[10.5px] font-semibold text-[#5E846A]">
                Збери коктейль або збий мілкшейк ↓
              </span>
            )}
          </div>

          <div className="flex w-full gap-1.5">
            <button
              type="button"
              onClick={onPutOnTray}
              disabled={!glassReady || isBlending}
              className={`min-h-[40px] lg:min-h-[36px] flex-1 rounded-2xl border-2 px-2 py-1 text-xs font-bold transition-all whitespace-nowrap ${
                glassReady && !isBlending
                  ? 'border-[#3E7A56] border-b-4 bg-gradient-to-b from-[#94D3AA] to-[#6CB889] text-[#143D24] shadow-[0_4px_14px_rgba(78,150,104,0.38)] hover:brightness-105 active:translate-y-[2px] active:border-b-2'
                  : 'border-[#C4D3C7] border-b-[3px] bg-[#E8EFE9] text-[#8FA596] cursor-not-allowed'
              }`}
            >
              {isTakeawayOrder && glassReady ? '🏃 Із собою →' : '✓ На тацю'}
            </button>
            <button
              type="button"
              onClick={onClearAll}
              disabled={(!glassReady && !blenderHasItems) || isBlending}
              className={`min-h-[40px] lg:min-h-[36px] rounded-2xl border-2 px-2.5 py-1 text-[11px] font-bold transition-all whitespace-nowrap ${
                (glassReady || blenderHasItems) && !isBlending
                  ? 'border-[#A85F73] border-b-[3px] bg-gradient-to-b from-[#FCEEF2] to-[#F4D3DD] text-[#83344A] shadow-xs active:translate-y-[2px] active:border-b-2'
                  : 'border-[#D1BFA9] border-b-[3px] bg-[#EFE5D7] text-[#B09B86] cursor-not-allowed'
              }`}
            >
              Очистити
            </button>
          </div>
        </div>
      </div>

      {/* Right 2 Recessed Wooden Boxes: Tall Glass Ingredients + Blender */}
      <div className="lg:col-span-9 flex flex-1 min-h-0 flex-col sm:grid sm:grid-cols-2 lg:grid-cols-9 gap-2 sm:gap-2.5">
        {/* Mini-Zone 1: Tall Glass Recessed Tray — strict flex-col gap-2 h-full with 2×3 horizontal buttons */}
        <div
          data-station-card="cold-cocktail"
          className="barista-tray-recess shrink-0 lg:shrink lg:col-span-4 flex sm:h-full lg:min-h-0 flex-col gap-1.5 sm:gap-2 rounded-2xl sm:rounded-3xl border-2 border-[#8AA68F] px-2.5 pt-2 pb-2.5 sm:px-3 sm:pt-2.5 sm:pb-3 lg:overflow-hidden"
        >
          <div
            data-station-header="cold-cocktail"
            className="relative z-10 flex shrink-0 items-baseline justify-between gap-2"
          >
            <h3 className="font-handwriting text-lg sm:text-xl leading-none font-bold text-[#255537] whitespace-nowrap">
              🍹 У високий келих
            </h3>
            <span className="text-[10px] font-semibold text-[#5A8268] whitespace-nowrap">
              Мохіто / Санрайз
            </span>
          </div>

          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-2 grid-rows-3 gap-1.5 sm:gap-2 h-full">
              {TALL_GLASS_INGREDIENTS.map((item) => {
                const added =
                  glassMode === 'cocktail' && (cocktailIngredients[item.id] ?? 0) > 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isBlending}
                    onClick={() => onAddCocktailIngredient(item.id)}
                    className="barista-tile relative flex h-full min-h-[36px] sm:min-h-0 items-center justify-center gap-1.5 sm:gap-2 rounded-2xl px-2 sm:px-2.5 py-1 sm:py-1.5 text-left disabled:opacity-60"
                    style={{
                      backgroundImage: item.buttonGradient,
                      borderColor: added ? '#3F8058' : item.buttonBorder,
                    }}
                  >
                    <IngredientIconSvg
                      type={item.id}
                      className="h-5 w-5 shrink-0 drop-shadow-[0_1px_1px_rgba(90,62,50,0.16)]"
                    />
                    <span className="truncate text-[11px] xl:text-xs font-bold leading-tight text-[#4D3224]">
                      {item.label}
                    </span>
                    {added && (
                      <span className="shrink-0 rounded-full bg-[#A7DCB8] px-1 text-[9px] font-bold text-[#174A2C]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mini-Zone 2: Blender Recessed Station — strict single-line header + stretched blender/buttons */}
        <div
          data-station-card="cold-blender"
          className="barista-tray-recess shrink-0 lg:shrink lg:col-span-5 flex sm:h-full lg:min-h-0 flex-col gap-1.5 rounded-2xl sm:rounded-3xl border-2 border-[#B88896] px-2.5 pt-2 pb-2.5 sm:px-3 sm:pt-2.5 sm:pb-3 lg:overflow-hidden"
        >
          <div
            data-station-header="cold-blender"
            className="relative z-10 flex shrink-0 items-baseline justify-between gap-2"
          >
            <h3 className="font-handwriting text-lg sm:text-xl leading-none font-bold text-[#7F344C] whitespace-nowrap">
              🍓 Блендер для мілкшейку
            </h3>
            {isBlending ? (
              <span className="animate-pulse rounded-full border border-[#D4829A] bg-[#F9DAE3] px-2 py-0.5 text-[10px] font-bold text-[#88304C] whitespace-nowrap">
                Вжжжж~!
              </span>
            ) : (
              <span className="truncate text-[10px] font-semibold text-[#965C6E]">
                Додай → «Збити!» → вершки
              </span>
            )}
          </div>

          <div className="flex flex-1 min-h-0 items-stretch gap-3">
            {/* Compact Blender Column scaling cleanly within available height */}
            <div className="flex shrink-0 flex-col items-center justify-center min-h-0 max-h-full">
              <div className="relative flex min-h-0 items-center justify-center">
                <BaristaCoasterSvg
                  tint="blush"
                  className="pointer-events-none absolute bottom-0.5 w-20 sm:w-22 h-4"
                />
                <BlenderSvg
                  ingredients={blenderIngredients}
                  isBlending={isBlending}
                  className="relative z-10 h-[96px] w-[82px] sm:h-[104px] sm:w-[90px] max-h-full"
                />
              </div>
              {blenderEntries.length > 0 && (
                <div className="mt-1 flex flex-wrap justify-center gap-1 max-w-[100px]">
                  {blenderEntries.map(([id]) => (
                    <button
                      key={id}
                      type="button"
                      disabled={isBlending}
                      onClick={() => onRemoveBlenderIngredient(id)}
                      className="rounded-full bg-[#FFFDF8] border border-[#D59EB0] px-1.5 py-0.2 text-[9px] font-bold text-[#7F344C]"
                      title="Прибрати з блендера"
                    >
                      {id === 'coldMilk'
                        ? 'Молоко'
                        : id === 'iceCream'
                          ? 'Морозиво'
                          : 'Сироп'}{' '}
                      ✕
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: 3 compact single-line ingredient buttons + bottom action row */}
            <div className="flex flex-1 min-w-0 min-h-0 flex-col justify-between gap-1.5">
              {BLENDER_INGREDIENTS.map((item) => {
                const added = (blenderIngredients[item.id] ?? 0) > 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isBlending}
                    onClick={() => onAddBlenderIngredient(item.id)}
                    className="barista-tile flex flex-1 min-h-[34px] lg:min-h-0 items-center justify-between gap-1.5 rounded-xl px-2.5 py-1 text-left disabled:opacity-60"
                    style={{
                      backgroundImage: item.buttonGradient,
                      borderColor: added ? '#3F8058' : item.buttonBorder,
                    }}
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <IngredientIconSvg type={item.id} className="h-5 w-5 shrink-0" />
                      <span className="truncate text-xs sm:text-[13px] font-bold text-[#4D3224]">
                        {item.label}
                      </span>
                    </span>
                    {added && (
                      <span className="shrink-0 rounded-full bg-[#A7DCB8] px-1.5 text-[9px] font-bold text-[#174A2C]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  disabled={!blenderHasItems || isBlending}
                  onClick={onBlend}
                  className={`flex-1 rounded-xl border-2 px-2 py-1.5 text-[11px] font-bold transition-all whitespace-nowrap ${
                    blenderHasItems && !isBlending
                      ? 'border-[#A34561] border-b-4 bg-gradient-to-b from-[#F49AB3] to-[#DF6E8E] text-white shadow-[0_4px_12px_rgba(204,96,128,0.34)] hover:brightness-105 active:translate-y-[2px] active:border-b-2'
                      : 'border-[#D5BCC4] border-b-[3px] bg-[#EFE3E7] text-[#A88B94] cursor-not-allowed'
                  }`}
                >
                  {isBlending ? '🌀 Збиваємо...' : '🌀 Збити!'}
                </button>

                <button
                  type="button"
                  disabled={glassMode !== 'milkshake' || isBlending}
                  onClick={onToggleWhippedCream}
                  className={`flex items-center justify-center gap-1 rounded-xl border-2 px-2 py-1.5 text-[11px] font-bold transition-all whitespace-nowrap ${
                    glassMode === 'milkshake' && !isBlending
                      ? whippedCream
                        ? 'border-[#4B8B63] border-b-4 bg-gradient-to-b from-[#E3F5E8] to-[#C2E6CE] text-[#1A4E2F] active:translate-y-[2px] active:border-b-2'
                        : 'border-[#A9793E] border-b-4 bg-gradient-to-b from-[#FFF9E8] to-[#F4DFAF] text-[#6B4316] shadow-xs hover:brightness-105 active:translate-y-[2px] active:border-b-2'
                      : 'border-[#D4C4B2] border-b-[3px] bg-[#EFE6DA] text-[#AD9B89] cursor-not-allowed'
                  }`}
                  title={
                    glassMode === 'milkshake'
                      ? 'Додати збиті вершки зверху на мілкшейк'
                      : 'Спочатку збий мілкшейк у блендері!'
                  }
                >
                  <IngredientIconSvg type="whippedCream" className="h-4 w-4 shrink-0" />
                  <span>{whippedCream ? '✓ Вершки' : 'Збиті вершки'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
