import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import {
  describePreparedDrink,
  describePreparedPastry,
  shortTrayDrinkLabel,
  shortTrayPastryLabel,
} from '../../data/recipes';
import type { PreparedDrink, PreparedPastry } from '../../types/game';
import { DrinkPreviewSvg } from '../svg/DrinkVisualSvg';
import { PastrySvg } from '../svg/PastryVisualSvg';

interface ServingTrayProps {
  trayDrink: PreparedDrink | null;
  trayPastry: PreparedPastry | null;
  isHappy: boolean;
  highlightServe?: boolean;
  onServe: () => void;
  onClearTray: () => void;
  onClearTrayDrink: () => void;
  onClearTrayPastry: () => void;
}

/**
 * Low-profile diegetic honey-wood serving board resting directly on the café counter.
 * Keeps the watercolor café interior open and uncluttered when empty, and smoothly
 * reveals the cheerful «🛎️ Подати!» button as soon as an item is placed on the board.
 */
export const ServingTray: React.FC<ServingTrayProps> = ({
  trayDrink,
  trayPastry,
  isHappy,
  highlightServe = false,
  onServe,
  onClearTray,
  onClearTrayDrink,
  onClearTrayPastry,
}) => {
  const hasAnythingOnTray = Boolean(trayDrink || trayPastry);

  return (
    <div
      data-serving-tray="true"
      className="landscape-compact-tray relative z-10 flex shrink-0 flex-col items-center gap-1"
    >
      {/* Floating Serve / Status Pill directly above or integrated neatly when items are ready */}
      <AnimatePresence>
        {(hasAnythingOnTray || isHappy) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="flex items-center gap-1"
          >
            <motion.button
              type="button"
              onClick={onServe}
              disabled={isHappy}
              whileHover={isHappy ? undefined : { scale: 1.04, y: -1 }}
              whileTap={isHappy ? undefined : { scale: 0.94 }}
              className={`min-h-[38px] sm:min-h-[40px] rounded-full border-2 border-b-[3px] px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-bold shadow-[0_6px_16px_rgba(92,40,56,0.28)] transition-all whitespace-nowrap ${
                isHappy
                  ? 'border-[#7DB58F] bg-[#E2F4E7] text-[#28613E] cursor-default'
                  : highlightServe
                    ? 'border-[#B65370] bg-gradient-to-b from-[#F5A1B8] to-[#E67797] text-white ring-3 ring-[#F4C452] ring-offset-1 ring-offset-[#FFF7E6] animate-pulse hover:brightness-105'
                    : 'border-[#B65370] bg-gradient-to-b from-[#F5A1B8] to-[#E67797] text-white hover:brightness-105'
              }`}
            >
              {isHappy ? (
                '✓ Подано!'
              ) : (
                <>
                  <span className="sm:hidden">
                    {highlightServe ? '👆 🛎️ Подати!' : '🛎️ Подати!'}
                  </span>
                  <span className="hidden sm:inline">
                    {highlightServe
                      ? '👆 🛎️ Подати замовлення!'
                      : '🛎️ Подати замовлення!'}
                  </span>
                </>
              )}
            </motion.button>

            {hasAnythingOnTray && !isHappy && (
              <button
                type="button"
                onClick={onClearTray}
                title="Очистити всю тацю"
                aria-label="Очистити всю тацю"
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#DF9FB0] bg-[#FDF1F4]/95 text-[11px] font-bold text-[#8E3C52] shadow-xs hover:bg-[#F7D7E0]"
              >
                ✕
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleek Flat Wooden Serving Board resting directly on top of the oak counter */}
      <div
        className={`relative flex items-end gap-1.5 sm:gap-2 rounded-2xl border-2 border-b-[4px] border-[#784925]/90 bg-gradient-to-b from-[#E8BD82]/94 via-[#DAA362]/95 to-[#C58746]/96 shadow-[0_6px_14px_-4px_rgba(58,32,12,0.42),inset_0_1.5px_0_rgba(255,248,230,0.65)] transition-all ${
          hasAnythingOnTray
            ? 'px-2.5 pt-1.5 pb-1.5 sm:px-3 sm:pt-2 sm:pb-1.5'
            : 'px-2 py-1 sm:px-2.5 sm:py-1.5'
        }`}
      >
        {/* Subtle carved wooden board side handles */}
        <span
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -left-1.5 bottom-2.5 h-3 w-1.5 rounded-l-full border border-r-0 border-[#784925]/80 bg-[#C78D4E]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -right-1.5 bottom-2.5 h-3 w-1.5 rounded-r-full border border-l-0 border-[#784925]/80 bg-[#C78D4E]"
        />

        {/* Drink Coaster Spot */}
        <div
          className={`relative flex flex-col items-center justify-center rounded-xl transition-all ${
            trayDrink
              ? 'h-[54px] w-[54px] sm:h-[68px] sm:w-[72px] lg:h-[76px] lg:w-[82px] border border-[#FFF6E5]/85 bg-[#FFFDF8]/72 shadow-inner'
              : 'h-[36px] w-[48px] sm:h-[42px] sm:w-[62px] border border-dashed border-[#7A4D2A]/45 bg-[#F8E7CA]/52'
          }`}
        >
          <AnimatePresence mode="wait">
            {trayDrink ? (
              <motion.div
                key="tray-drink-filled"
                initial={{ scale: 0.72, opacity: 0, y: 6 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.75, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                {!isHappy && (
                  <button
                    type="button"
                    onClick={onClearTrayDrink}
                    title="Прибрати напій із таці"
                    aria-label="Прибрати напій із таці"
                    className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-[#DF99AC] bg-[#FDF0F3] text-[9.5px] sm:text-[10px] font-bold text-[#9A4058] shadow-xs hover:bg-[#F7D7DF] after:content-[''] after:absolute after:-inset-2"
                  >
                    ✕
                  </button>
                )}
                <DrinkPreviewSvg
                  drink={trayDrink}
                  className="h-9 w-9 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                />
                <span
                  title={describePreparedDrink(trayDrink)}
                  className="max-w-[96%] truncate text-[8px] sm:text-[9.5px] font-bold text-[#5A3720]"
                >
                  {shortTrayDrinkLabel(trayDrink)}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="tray-drink-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-0.5 text-[#6D4423]/75"
              >
                <span className="text-xs sm:text-sm" aria-hidden="true">
                  ☕
                </span>
                <span className="hidden sm:inline text-[9.5px] font-bold">
                  Напій
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pastry Coaster Spot */}
        <div
          className={`relative flex flex-col items-center justify-center rounded-xl transition-all ${
            trayPastry
              ? 'h-[54px] w-[54px] sm:h-[68px] sm:w-[72px] lg:h-[76px] lg:w-[82px] border border-[#FFF6E5]/85 bg-[#FFFDF8]/72 shadow-inner'
              : 'h-[36px] w-[48px] sm:h-[42px] sm:w-[62px] border border-dashed border-[#7A4D2A]/45 bg-[#F8E7CA]/52'
          }`}
        >
          <AnimatePresence mode="wait">
            {trayPastry ? (
              <motion.div
                key="tray-pastry-filled"
                initial={{ scale: 0.72, opacity: 0, y: 6 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.75, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                {!isHappy && (
                  <button
                    type="button"
                    onClick={onClearTrayPastry}
                    title="Прибрати випічку з таці"
                    aria-label="Прибрати випічку з таці"
                    className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-[#DF99AC] bg-[#FDF0F3] text-[9.5px] sm:text-[10px] font-bold text-[#9A4058] shadow-xs hover:bg-[#F7D7DF] after:content-[''] after:absolute after:-inset-2"
                  >
                    ✕
                  </button>
                )}
                <PastrySvg
                  pastry={trayPastry}
                  showPlate={true}
                  className="h-8 w-11 sm:h-11 sm:w-14 lg:h-13 lg:w-17"
                />
                <span
                  title={describePreparedPastry(trayPastry)}
                  className="max-w-[96%] truncate text-[8px] sm:text-[9.5px] font-bold text-[#6E3446]"
                >
                  {shortTrayPastryLabel(trayPastry)}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="tray-pastry-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-0.5 text-[#6D4423]/75"
              >
                <span className="text-xs sm:text-sm" aria-hidden="true">
                  🥐
                </span>
                <span className="hidden sm:inline text-[9.5px] font-bold">
                  Десерт
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
