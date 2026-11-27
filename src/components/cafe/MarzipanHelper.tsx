import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { CAFE_ASSETS } from '../../config/assets';
import type { MarzipanEquipped } from '../../types/game';
import { AssetIllustration } from '../common/AssetIllustration';
import { MarzipanAccessoriesOverlaySvg } from '../svg/MarzipanAccessoriesSvg';
import { MarzipanCatSvg } from '../svg/MarzipanCatSvg';

interface MarzipanHelperProps {
  isPurring: boolean;
  equippedAccessories?: MarzipanEquipped;
  onPet: () => void;
  onOpenCare?: () => void;
}

const EMPTY_EQUIPPED: MarzipanEquipped = {
  head: null,
  eyes: null,
  neck: null,
};

export const MarzipanHelper: React.FC<MarzipanHelperProps> = ({
  isPurring,
  equippedAccessories = EMPTY_EQUIPPED,
  onPet,
  onOpenCare,
}) => {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onPet}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        title="Погладити кота-помічника Марципана"
        aria-label="Кіт-помічник Марципан. Натисни, щоб погладити!"
        className="group relative flex min-h-[44px] min-w-[44px] flex-col items-center focus:outline-none"
      >
      {/* Floating handwritten «Муррр~ ♥» and rising watercolor hearts */}
      <AnimatePresence>
        {isPurring && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.85 }}
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
          >
            <span className="font-handwriting rounded-full border-2 border-[#E9A8BA] bg-[#FDF1F5] px-2.5 py-0.2 text-sm sm:text-base font-bold text-[#9C425E] shadow-sm whitespace-nowrap">
              Муррр~ ♥
            </span>
            <div className="relative h-7 w-14">
              {[
                { left: '15%', delay: 0, size: 12 },
                { left: '48%', delay: 0.16, size: 14 },
                { left: '76%', delay: 0.3, size: 11 },
              ].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], y: -26, scale: 1.05 }}
                  transition={{ duration: 1.3, delay: h.delay, ease: 'easeOut' }}
                  style={{ left: h.left, fontSize: h.size }}
                  className="absolute bottom-0 text-[#E97A98]"
                >
                  ♥
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleepy floating zZz when resting */}
      {!isPurring && (
        <div className="pointer-events-none absolute -top-2 right-0 sm:right-1 z-20 font-handwriting font-bold text-[#7A563E]">
          <span className="animate-zzz-1 inline-block text-xs sm:text-sm">z</span>
          <span className="animate-zzz-2 inline-block text-sm sm:text-lg ml-0.5">Z</span>
        </div>
      )}

      {/* Warm natural contact shadow + soft honey sunlight cushion beneath sleeping Marzipan */}
      <div className="pointer-events-none absolute bottom-3 h-4 w-20 sm:h-5 sm:w-30 rounded-full bg-[#5B3214]/45 blur-[5px]" />

      {/* Breathing / happy purr wiggle with EXACT 8:7 aspect lock so wardrobe accessories NEVER drift */}
      <motion.div
        animate={
          isPurring
            ? { rotate: [-4, 4, -3, 3, 0], scale: [1, 1.06, 1.04, 1] }
            : { scaleY: [1, 1.038, 1], scaleX: [1, 0.985, 1] }
        }
        transition={
          isPurring
            ? { duration: 0.65, ease: 'easeInOut' }
            : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ transformOrigin: 'bottom center' }}
        className="relative z-10 aspect-[8/7] h-[64px] sm:h-[78px] md:h-[88px] lg:h-[104px] xl:h-[118px]"
      >
        <AssetIllustration
          src={CAFE_ASSETS.marzipan}
          alt="Кіт-помічник Марципан"
          className="h-full w-full drop-shadow-[0_6px_9px_rgba(92,48,18,0.38)]"
          imgClassName="h-full w-full object-fill saturate-[1.03] contrast-[1.01]"
          fallback={<MarzipanCatSvg isPurring={isPurring} className="h-full w-full" />}
        />
        <MarzipanAccessoriesOverlaySvg equipped={equippedAccessories} />
      </motion.div>
      </motion.button>

      <div className="relative z-20 -mt-1.5 flex items-center gap-1">
        <button
          type="button"
          onClick={onPet}
          className="rounded-full border border-[#D4AD84] bg-[#FCF7EC]/95 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#6E4A34] shadow-xs hover:border-[#E59FB3] hover:bg-[#FDF0F4] transition-colors"
        >
          Марципан
        </button>
        {onOpenCare && (
          <motion.button
            type="button"
            data-marzipan-care-open="true"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenCare}
            title="Куточок Марципана: котячі смаколики й гра з клубочком!"
            aria-label="Відкрити куточок Марципана зі смаколиками та клубочком"
            className="relative flex h-6 w-6 items-center justify-center rounded-full border border-[#D894AA] bg-[#FFF0F5] text-[11px] shadow-xs hover:bg-[#FADBE5] after:content-[''] after:absolute after:-inset-2"
          >
            🧶
          </motion.button>
        )}
      </div>
    </div>
  );
};
