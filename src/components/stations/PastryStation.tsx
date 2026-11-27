import { motion } from 'framer-motion';
import React from 'react';
import { describePreparedPastry } from '../../data/recipes';
import type {
  DonutGlaze,
  PreparedPastry,
  UnlockableRecipeId,
} from '../../types/game';
import { MiniOvenSvg, PastrySvg } from '../svg/PastryVisualSvg';
import type { GuidedHintState } from '../../utils/guidedHints';

interface PastryStationProps {
  selectedPastry: PreparedPastry | null;
  isOvenWarming: boolean;
  ovenProgress: number;
  unlockedRecipes?: UnlockableRecipeId[];
  guidedHint?: GuidedHintState | null;
  onSelectBase: (type: PreparedPastry['type']) => void;
  onWarmCroissant: () => void;
  onSetDonutGlaze: (glaze: DonutGlaze) => void;
  onToggleDonutSprinkles: () => void;
  onClear: () => void;
  onPutOnTray: () => void;
}

export const PastryStation: React.FC<PastryStationProps> = ({
  selectedPastry,
  isOvenWarming,
  ovenProgress,
  unlockedRecipes = [],
  guidedHint = null,
  onSelectBase,
  onWarmCroissant,
  onSetDonutGlaze,
  onToggleDonutSprinkles,
  onClear,
  onPutOnTray,
}) => {
  const hasCarrotCake = unlockedRecipes.includes('carrot_cake');
  const showcaseCards = [
    {
      type: 'croissant' as const,
      title: 'Круасан',
      grad: 'linear-gradient(155deg, #FFF9EB 0%, #F5DCAC 100%)',
      sample: { type: 'croissant', warmed: false } as PreparedPastry,
    },
    {
      type: 'cookie' as const,
      title: 'Печиво з шоколадом',
      grad: 'linear-gradient(155deg, #FBF2E6 0%, #EAD0B0 100%)',
      sample: { type: 'cookie' } as PreparedPastry,
    },
    {
      type: 'donut' as const,
      title: 'Пончик',
      grad: 'linear-gradient(155deg, #FFF3F6 0%, #F6D2DC 100%)',
      sample: {
        type: 'donut',
        glaze: 'none',
        sprinkles: false,
      } as PreparedPastry,
    },
    ...(hasCarrotCake
      ? [
          {
            type: 'carrot_cake' as const,
            title: 'Морквяний кекс',
            grad: 'linear-gradient(155deg, #FFF6E8 0%, #F6D5A9 100%)',
            sample: { type: 'carrot_cake' } as PreparedPastry,
          },
        ]
      : []),
  ];
  return (
    <div className="flex h-full min-h-0 flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-2.5 lg:gap-3">
      {/* Left: Cozy Linen Mat for Pastry Plate (unified plate+napkin composition, zero hanging oval) */}
      <div
        data-station-card="pastry-plate"
        className="barista-linen-mat shrink-0 sm:col-span-4 flex sm:h-full sm:min-h-0 flex-row sm:flex-col justify-between gap-2 rounded-2xl sm:rounded-3xl border-2 border-[#B38391] p-2 sm:p-2.5"
      >
        {/* Tier 1: Top Badge */}
        <div
          data-station-header="pastry-plate"
          className="hidden sm:flex relative z-10 shrink-0 w-full justify-center"
        >
          <span className="rounded-full border border-[#D49FB0] bg-[#FCE9EF] px-2.5 py-0.5 text-[11px] font-bold text-[#82384F]">
            Тарілочка для десерту
          </span>
        </div>

        {/* Tier 2: Harmonious Unified Plate + Napkin + Label below */}
        <div className="flex shrink-0 sm:flex-1 sm:min-h-0 flex-col items-center justify-center gap-1 overflow-hidden">
          <div className="relative flex shrink-0 items-center justify-center">
            {selectedPastry ? (
              <motion.div
                key={`${selectedPastry.type}-${'warmed' in selectedPastry ? selectedPastry.warmed : ''}-${'glaze' in selectedPastry ? selectedPastry.glaze : ''}-${'sprinkles' in selectedPastry ? selectedPastry.sprinkles : ''}`}
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className="relative z-10"
              >
                <PastrySvg
                  pastry={selectedPastry}
                  showPlate={true}
                  className="h-[76px] w-[96px] sm:h-[88px] sm:w-[112px] lg:h-[96px] lg:w-[122px]"
                />
              </motion.div>
            ) : (
              <svg
                viewBox="0 0 150 90"
                className="relative z-10 h-[66px] w-[110px] sm:h-[78px] sm:w-[130px] lg:h-[84px] lg:w-[140px]"
                aria-hidden="true"
              >
                {/* Unified soft lace napkin halo directly around the plate */}
                <ellipse
                  cx="75"
                  cy="54"
                  rx="68"
                  ry="22"
                  fill="#F9E5EC"
                  stroke="#D9A8B8"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                />
                {/* Porcelain plate nested harmoniously inside */}
                <ellipse
                  cx="75"
                  cy="52"
                  rx="56"
                  ry="16"
                  fill="#FFFDF9"
                  stroke="#C7A484"
                  strokeWidth="2.4"
                  strokeDasharray="6 4"
                />
                <ellipse cx="75" cy="51" rx="38" ry="9.5" fill="#F5E8D5" />
              </svg>
            )}
          </div>

          <div className="hidden sm:flex shrink-0 min-h-[20px] items-center justify-center">
            {selectedPastry ? (
              <span className="rounded-full border border-[#D49FB0] bg-[#FFFDF8] px-3 py-0.5 text-[11px] font-bold text-[#7A384D] text-center shadow-2xs">
                {describePreparedPastry(selectedPastry)}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-[#946876]">
                Обери десерт із вітрини →
              </span>
            )}
          </div>
        </div>

        {/* Tier 3: Actions (+ mobile label) */}
        <div className="flex flex-1 sm:flex-none shrink-0 sm:w-full flex-col justify-center gap-1.5 min-w-0">
          <span className="sm:hidden text-[11px] font-bold text-[#7A384D] truncate">
            {selectedPastry
              ? describePreparedPastry(selectedPastry)
              : 'Обери десерт із вітрини ↓'}
          </span>

          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={onPutOnTray}
              disabled={!selectedPastry || isOvenWarming}
              className={`min-h-[40px] sm:min-h-[36px] flex-1 rounded-2xl border-2 px-2.5 py-1 text-xs font-bold transition-all whitespace-nowrap ${
                selectedPastry && !isOvenWarming
                  ? guidedHint?.highlightPutOnTray
                    ? 'border-[#3E7A56] border-b-4 bg-gradient-to-b from-[#94D3AA] to-[#6CB889] text-[#143D24] ring-2 ring-[#F2BA49] shadow-[0_4px_14px_rgba(78,150,104,0.48)] hover:brightness-105 active:translate-y-[2px] active:border-b-2'
                    : 'border-[#3E7A56] border-b-4 bg-gradient-to-b from-[#94D3AA] to-[#6CB889] text-[#143D24] shadow-[0_4px_14px_rgba(78,150,104,0.38)] hover:brightness-105 active:translate-y-[2px] active:border-b-2'
                  : 'border-[#CBB49B] border-b-[3px] bg-[#ECE0CF] text-[#9E8772] cursor-not-allowed'
              }`}
            >
              {guidedHint?.highlightPutOnTray && selectedPastry
                ? '👆 ✓ На тацю'
                : '✓ На тацю'}
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={!selectedPastry || isOvenWarming}
              className={`min-h-[40px] sm:min-h-[36px] rounded-2xl border-2 px-3 py-1 text-xs font-bold transition-all whitespace-nowrap ${
                selectedPastry && !isOvenWarming
                  ? 'border-[#A85F73] border-b-[3px] bg-gradient-to-b from-[#FCEEF2] to-[#F4D3DD] text-[#83344A] shadow-xs active:translate-y-[2px] active:border-b-2'
                  : 'border-[#D1BFA9] border-b-[3px] bg-[#EFE5D7] text-[#B09B86] cursor-not-allowed'
              }`}
            >
              Очистити
            </button>
          </div>
        </div>
      </div>

      {/* Right: Recessed Wooden Bakery Showcase + Mini-Oven / Glaze Decorator */}
      <div
        data-station-card="pastry-showcase"
        className="barista-tray-recess cozy-scroll flex-1 sm:col-span-8 flex h-full min-h-0 flex-col gap-2 rounded-2xl sm:rounded-3xl border-2 border-[#A67D58] px-2.5 pt-2 pb-2.5 sm:px-3 sm:pt-2.5 sm:pb-3 overflow-y-auto sm:overflow-hidden overflow-x-hidden"
      >
        {/* Strict Header Row — z-10 shrink-0 */}
        <div
          data-station-header="pastry-showcase"
          className="relative z-10 flex shrink-0 items-center justify-between gap-2"
        >
          <h2 className="font-handwriting text-xl sm:text-2xl leading-none font-bold text-[#4F3323]">
            Вітрина кондитерської:
          </h2>
          {guidedHint?.stationText ? (
            <span className="max-w-[60%] truncate rounded-full border border-[#D99B38] bg-[#FFF1C2] px-2.5 py-0.5 text-[10px] font-bold text-[#613808] shadow-2xs">
              {guidedHint.stationText}
            </span>
          ) : (
            <span className="hidden md:inline rounded-full border border-[#CFA97F] bg-[#FCF2DC] px-2.5 py-0.5 text-[10px] font-bold text-[#7C522B]">
              Свіжа випічка щодня 🥐
            </span>
          )}
        </div>

        {/* Compact Top Row: 3 (or 4 with Carrot Cake!) Tactile Pastry Showcase Cards in 1 clean row */}
        <div
          className={`shrink-0 grid gap-2 ${
            hasCarrotCake ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
          }`}
        >
          {showcaseCards.map((card) => {
            const active = selectedPastry?.type === card.type;
            const isHinted = guidedHint?.highlightPastryBase === card.type;
            return (
              <button
                key={card.type}
                type="button"
                disabled={isOvenWarming}
                onClick={() => onSelectBase(card.type)}
                className={`barista-tile flex flex-col items-center justify-center rounded-2xl px-1.5 py-1.5 sm:py-2 disabled:opacity-60 ${
                  isHinted
                    ? 'ring-2 ring-[#E89B2D] shadow-[0_0_10px_rgba(232,155,45,0.45)]'
                    : active
                      ? 'ring-2 ring-[#C96B84] ring-offset-1 ring-offset-[#F4E6D0]'
                      : ''
                }`}
                style={{
                  backgroundImage: card.grad,
                  borderColor: isHinted
                    ? '#C27D2C'
                    : active
                      ? '#A84E68'
                      : '#7A523B',
                }}
              >
                <PastrySvg
                  pastry={card.sample}
                  showPlate={false}
                  className="h-9 w-14 sm:h-10 sm:w-16"
                />
                <span className="mt-0.5 text-[10.5px] sm:text-xs font-bold text-[#4D3224] leading-tight text-center">
                  {card.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Cozy Prep Alcove (Mini-Oven OR Donut Decorator) — flex-1 min-h-0 so bottom border is ALWAYS visible */}
        <div
          data-pastry-alcove="true"
          className="flex flex-1 min-h-[76px] sm:min-h-0 items-center justify-center rounded-2xl border-2 border-dashed border-[#B68D64] bg-[#F2E2C9]/80 px-3 py-1.5 shadow-[inset_0_2px_8px_rgba(90,56,32,0.1)]"
        >
          {!selectedPastry && (
            <p className="text-[11px] sm:text-xs font-semibold text-[#7D583B] text-center">
              {hasCarrotCake
                ? 'Натисни на Круасан, Печиво, Пончик чи Морквяний кекс угорі, щоб підготувати десерт!'
                : 'Натисни на Круасан, Печиво чи Пончик угорі, щоб підготувати десерт!'}
            </p>
          )}

          {selectedPastry?.type === 'croissant' && (
            <div className="flex w-full items-center justify-around gap-3">
              <MiniOvenSvg
                isWarming={isOvenWarming}
                isWarmed={selectedPastry.warmed}
                className="h-16 w-22 sm:h-[68px] sm:w-24 shrink-0 drop-shadow-xs"
              />
              <div className="flex flex-1 flex-col items-start gap-1 max-w-[310px] min-w-0">
                <span className="font-handwriting text-lg sm:text-xl leading-none font-bold text-[#5A361C]">
                  Міні-пічка для круасанів
                </span>
                {selectedPastry.warmed ? (
                  <div className="rounded-xl border-2 border-[#6EA881] bg-[#E2F3E7] px-3 py-1 text-[11px] font-bold text-[#1E5633]">
                    ✨ Дзінь! Круасан рум’яний, теплий і запашний!
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={isOvenWarming}
                      onClick={onWarmCroissant}
                      className={`min-h-[34px] w-full rounded-xl border-2 px-3 py-1 text-xs font-bold transition-all ${
                        isOvenWarming
                          ? 'border-[#C9854B] border-b-[3px] bg-[#FBE0BE] text-[#834618]'
                          : guidedHint?.highlightWarmCroissant
                            ? 'border-[#9E5621] border-b-4 bg-gradient-to-b from-[#F4B465] to-[#DF8238] text-white ring-2 ring-[#F2BA49] shadow-[0_4px_12px_rgba(186,104,38,0.44)] hover:brightness-105 active:translate-y-[2px] active:border-b-2'
                            : 'border-[#9E5621] border-b-4 bg-gradient-to-b from-[#F4B465] to-[#DF8238] text-white shadow-[0_4px_12px_rgba(186,104,38,0.34)] hover:brightness-105 active:translate-y-[2px] active:border-b-2'
                      }`}
                    >
                      {isOvenWarming
                        ? '🔥 Підігріваємо в пічці...'
                        : '🔥 Підігріти в пічці (2 сек)'}
                    </button>
                    {isOvenWarming && (
                      <div className="h-2 w-full overflow-hidden rounded-full border border-[#C9A47C] bg-[#FBF1E1]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#EEA257] to-[#DF6E3D] transition-all duration-100"
                          style={{ width: `${ovenProgress}%` }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {selectedPastry?.type === 'cookie' && (
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">
                🍪
              </span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#4F3323]">
                  Свіженьке печиво з шоколадом!
                </p>
                <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#7F5A3E]">
                  Вже хрумке й готове — просто натисни «✓ На тацю»!
                </p>
              </div>
            </div>
          )}

          {selectedPastry?.type === 'carrot_cake' && (
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">
                🥕
              </span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#4F3323]">
                  Ароматний морквяний кекс із кремовою шапочкою!
                </p>
                <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#7F5A3E]">
                  Вже прикрашений і готовий — просто натисни «✓ На тацю»!
                </p>
              </div>
            </div>
          )}

          {selectedPastry?.type === 'donut' && (
            <div className="flex w-full flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-handwriting text-lg sm:text-xl leading-none font-bold text-[#7A334A]">
                  🎨 Станція декору пончика:
                </span>
                <span className="hidden sm:inline text-[10px] font-semibold text-[#8F5B6B]">
                  Обери глазур і посипку
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onSetDonutGlaze('pink')}
                  className={`barista-tile flex min-h-[34px] items-center justify-center gap-1.5 rounded-xl px-2 py-1 text-[11px] font-bold text-[#73263E] ${
                    guidedHint?.highlightDonutGlaze === 'pink'
                      ? 'ring-2 ring-[#E89B2D]'
                      : ''
                  }`}
                  style={{
                    backgroundImage:
                      selectedPastry.glaze === 'pink'
                        ? 'linear-gradient(155deg, #FBD9E3 0%, #F2B5C7 100%)'
                        : 'linear-gradient(155deg, #FFF5F8 0%, #F9DCE5 100%)',
                    borderColor:
                      guidedHint?.highlightDonutGlaze === 'pink'
                        ? '#C27D2C'
                        : selectedPastry.glaze === 'pink'
                          ? '#B34869'
                          : '#B6778B',
                  }}
                >
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#F59DB6] border border-[#9E4563]" />
                  <span>Рожева полунична</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSetDonutGlaze('chocolate')}
                  className={`barista-tile flex min-h-[34px] items-center justify-center gap-1.5 rounded-xl px-2 py-1 text-[11px] font-bold text-[#482612] ${
                    guidedHint?.highlightDonutGlaze === 'chocolate'
                      ? 'ring-2 ring-[#E89B2D]'
                      : ''
                  }`}
                  style={{
                    backgroundImage:
                      selectedPastry.glaze === 'chocolate'
                        ? 'linear-gradient(155deg, #E8CEB8 0%, #CFA889 100%)'
                        : 'linear-gradient(155deg, #FAF0E6 0%, #E7D0BA 100%)',
                    borderColor:
                      guidedHint?.highlightDonutGlaze === 'chocolate'
                        ? '#C27D2C'
                        : selectedPastry.glaze === 'chocolate'
                          ? '#5E331A'
                          : '#8C6347',
                  }}
                >
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#6F3D22] border border-[#3E1F0D]" />
                  <span>Шоколадна</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleDonutSprinkles}
                  className={`barista-tile flex min-h-[34px] items-center justify-center gap-1.5 rounded-xl px-2 py-1 text-[11px] font-bold text-[#4D3418] ${
                    guidedHint?.highlightDonutSprinkles
                      ? 'ring-2 ring-[#E89B2D]'
                      : ''
                  }`}
                  style={{
                    backgroundImage: selectedPastry.sprinkles
                      ? 'linear-gradient(155deg, #E3F5E8 0%, #BEE5CA 100%)'
                      : 'linear-gradient(155deg, #FFFBEF 0%, #F7E4B2 100%)',
                    borderColor: guidedHint?.highlightDonutSprinkles
                      ? '#C27D2C'
                      : selectedPastry.sprinkles
                        ? '#43825A'
                        : '#A98444',
                  }}
                >
                  <span aria-hidden="true">✨</span>
                  <span>
                    {selectedPastry.sprinkles
                      ? '✓ Кольорова посипка'
                      : 'Кольорова посипка'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
