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
  onServe: () => void;
  onClearTray: () => void;
  onClearTrayDrink: () => void;
  onClearTrayPastry: () => void;
}

export const ServingTray: React.FC<ServingTrayProps> = ({
  trayDrink,
  trayPastry,
  isHappy,
  onServe,
  onClearTray,
  onClearTrayDrink,
  onClearTrayPastry,
}) => {
  const hasAnythingOnTray = Boolean(trayDrink || trayPastry);

  return (
    <div className="landscape-compact-tray relative z-10 flex shrink-0 flex-col items-center gap-1 rounded-2xl sm:rounded-3xl border-2 border-[#C2905E]/90 bg-[#FBF0DE]/84 backdrop-blur-[3px] px-2 py-1.5 sm:px-2.5 sm:py-1.5 shadow-[0_8px_22px_-6px_rgba(74,44,22,0.3)]">
      <div className="flex w-full items-center justify-between gap-1.5">
        <span className="font-handwriting text-sm sm:text-base lg:text-lg leading-none font-bold text-[#5A3E32] whitespace-nowrap">
          Таця подачі
        </span>
        {hasAnythingOnTray && !isHappy && (
          <button
            type="button"
            onClick={onClearTray}
            className="rounded-full bg-[#F8DDE3] px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#8E3C52] transition-colors hover:bg-[#F3C8D2] whitespace-nowrap"
          >
            Очистити
          </button>
        )}
      </div>

      {/* Two Compact Warm Translucent Tray Slots */}
      <div className="flex items-center gap-1.5">
        {/* Drink Slot */}
        <div
          className={`relative flex h-[54px] w-[54px] sm:h-[70px] sm:w-[74px] lg:h-[80px] lg:w-[86px] xl:h-[90px] xl:w-[96px] flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 transition-all ${
            trayDrink
              ? 'border-[#BA895A] bg-[#FFFDF8]/95 shadow-inner'
              : 'border-dashed border-[#C9A37C]/90 bg-[#F7E8D2]/75'
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
                    className="absolute -right-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#DF99AC] bg-[#FDF0F3] text-[10px] font-bold text-[#9A4058] shadow-xs hover:bg-[#F7D7DF] after:content-[''] after:absolute after:-inset-2"
                  >
                    ✕
                  </button>
                )}
                <DrinkPreviewSvg
                  drink={trayDrink}
                  className="h-10 w-10 sm:h-13 sm:w-13 lg:h-16 lg:w-16"
                />
                <span
                  title={describePreparedDrink(trayDrink)}
                  className="max-w-[94%] truncate text-[8.5px] sm:text-[10px] font-bold text-[#6E4934]"
                >
                  {shortTrayDrinkLabel(trayDrink)}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="tray-drink-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center px-1"
              >
                <span className="text-sm sm:text-lg opacity-45" aria-hidden="true">
                  ☕
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-[#A78466]">
                  Напій
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pastry Slot */}
        <div
          className={`relative flex h-[54px] w-[54px] sm:h-[70px] sm:w-[74px] lg:h-[80px] lg:w-[86px] xl:h-[90px] xl:w-[96px] flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 transition-all ${
            trayPastry
              ? 'border-[#D18BA0] bg-[#FFFDF8]/95 shadow-inner'
              : 'border-dashed border-[#C9A37C]/90 bg-[#F7E8D2]/75'
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
                    className="absolute -right-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#DF99AC] bg-[#FDF0F3] text-[10px] font-bold text-[#9A4058] shadow-xs hover:bg-[#F7D7DF] after:content-[''] after:absolute after:-inset-2"
                  >
                    ✕
                  </button>
                )}
                <PastrySvg
                  pastry={trayPastry}
                  showPlate={true}
                  className="h-9 w-12 sm:h-12 sm:w-16 lg:h-15 lg:w-20"
                />
                <span
                  title={describePreparedPastry(trayPastry)}
                  className="max-w-[94%] truncate text-[8.5px] sm:text-[10px] font-bold text-[#86455A]"
                >
                  {shortTrayPastryLabel(trayPastry)}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="tray-pastry-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center px-1"
              >
                <span className="text-sm sm:text-lg opacity-45" aria-hidden="true">
                  🥐
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-[#A78466]">
                  Випічка
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Touch-Friendly Springy Serve Order Button */}
      <motion.button
        type="button"
        onClick={onServe}
        disabled={isHappy}
        whileHover={isHappy ? undefined : { scale: 1.02 }}
        whileTap={isHappy ? undefined : { scale: 0.95 }}
        className={`w-full min-h-[42px] sm:min-h-[40px] rounded-xl sm:rounded-2xl border-2 px-2 sm:px-3.5 py-1 text-[11px] sm:text-xs font-bold shadow-xs transition-colors whitespace-nowrap ${
          isHappy
            ? 'border-[#9CCAA9] bg-[#DCEFE1] text-[#356A48] cursor-default'
            : hasAnythingOnTray
              ? 'border-[#C96B84] bg-gradient-to-r from-[#F29CB3] to-[#E9809D] text-white hover:brightness-105'
              : 'border-[#D9BE9F] bg-[#F2E3CE] text-[#8E6748] hover:bg-[#ECE0CE]'
        }`}
      >
        {isHappy ? '✓ Подано!' : (
          <>
            <span className="sm:hidden">🛎️ Подати!</span>
            <span className="hidden sm:inline">🛎️ Подати замовлення!</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
