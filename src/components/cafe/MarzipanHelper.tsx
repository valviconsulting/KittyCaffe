import { AnimatePresence, motion } from 'framer-motion';
import React, { useId } from 'react';
import { CAFE_ASSETS } from '../../config/assets';
import type { MarzipanEquipped, WeatherType } from '../../types/game';
import { getMarzipanPurrPhrase } from '../../utils/atmosphere';
import { AssetIllustration } from '../common/AssetIllustration';
import { MarzipanAccessoriesOverlaySvg } from '../svg/MarzipanAccessoriesSvg';
import { MarzipanCatSvg } from '../svg/MarzipanCatSvg';

interface MarzipanHelperProps {
  isPurring: boolean;
  petsCount?: number;
  guestHappy?: boolean;
  weather?: WeatherType;
  isWarmLampMode?: boolean;
  equippedAccessories?: MarzipanEquipped;
  /** Larger scale on portrait mobile when workbench is collapsed */
  largeMobile?: boolean;
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
  petsCount = 0,
  guestHappy = false,
  weather = 'sunny',
  isWarmLampMode = false,
  equippedAccessories = EMPTY_EQUIPPED,
  largeMobile = false,
  onPet,
  onOpenCare,
}) => {
  const uid = useId().replace(/:/g, '');
  const purrPhrase = getMarzipanPurrPhrase(petsCount);
  const isCozyIndoorWeather = weather !== 'sunny' || isWarmLampMode;

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
        {/* Floating rotating handwritten purr phrases & rising hearts when petted */}
        <AnimatePresence>
          {isPurring && (
            <motion.div
              key={`purr-${petsCount}`}
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.85 }}
              className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
            >
              <span className="font-handwriting rounded-full border-2 border-[#E9A8BA] bg-[#FDF1F5] px-2.5 py-0.2 text-sm sm:text-base font-bold text-[#9C425E] shadow-sm whitespace-nowrap">
                {purrPhrase}
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

        {/* Warm sympathetic musical purr when a guest is happily served! */}
        <AnimatePresence>
          {!isPurring && guestHappy && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.7 }}
              animate={{ opacity: 1, y: -4, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute -top-5 right-0 sm:right-1 z-20 flex items-center gap-0.5 text-xs sm:text-sm font-bold text-[#DE7492]"
            >
              <span aria-hidden="true">♪</span>
              <span aria-hidden="true">♥</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sleepy floating zZz when resting calmly */}
        {!isPurring && !guestHappy && (
          <div className="pointer-events-none absolute -top-2 right-0 sm:right-1 z-20 font-handwriting font-bold text-[#7A563E]">
            <span className="animate-zzz-1 inline-block text-xs sm:text-sm">z</span>
            <span className="animate-zzz-2 inline-block text-sm sm:text-lg ml-0.5">Z</span>
          </div>
        )}

        {/* Cozy Quilted Sage-Linen Cushion Bed nestled beneath Marzipan on the counter */}
        <svg
          viewBox="0 0 180 56"
          className="pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-[5] w-[116%] h-auto"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`mz-pill-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isCozyIndoorWeather ? '#DCEADB' : '#D7E8D8'} />
              <stop offset="55%" stopColor="#B3CFB8" />
              <stop offset="100%" stopColor="#89AE92" />
            </linearGradient>
            <linearGradient id={`mz-trim-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F4C7D2" />
              <stop offset="50%" stopColor="#FCE7EC" />
              <stop offset="100%" stopColor="#E4AEBD" />
            </linearGradient>
          </defs>
          {/* Soft warm oval shadow on honey-oak bar (zero CSS blur filter) */}
          <ellipse cx="90" cy="45" rx="82" ry="9" fill="#4A2710" opacity="0.34" />
          {/* Gentle warm amber pillow highlight during rainy/snowy/evening lamp glow */}
          {isCozyIndoorWeather && (
            <ellipse cx="90" cy="30" rx="78" ry="18" fill="#FFD98E" opacity="0.18" />
          )}
          {/* Plump quilted pillow base */}
          <path
            d="M14 33 C12 20 34 12 90 12 C146 12 168 20 166 33 C165 44 140 48 90 48 C40 48 15 44 14 33 Z"
            fill={`url(#mz-pill-${uid})`}
            stroke="#6C5340"
            strokeWidth="2.2"
          />
          {/* Cozy blush-cream stitched piping trim around cushion */}
          <path
            d="M19 31 C28 38 56 41 90 41 C124 41 152 38 161 31"
            fill="none"
            stroke={`url(#mz-trim-${uid})`}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M24 31 C34 37 59 40 90 40 C121 40 146 37 156 31"
            fill="none"
            stroke="#8B6854"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          {/* Corner cozy fabric tassels */}
          <ellipse cx="14" cy="34" rx="5.5" ry="4" fill="#F2B8C7" stroke="#6C5340" strokeWidth="1.5" />
          <ellipse cx="166" cy="34" rx="5.5" ry="4" fill="#F2B8C7" stroke="#6C5340" strokeWidth="1.5" />
          {/* Subtle indented nest shadow where Marzipan's curled body rests */}
          <ellipse cx="90" cy="27" rx="58" ry="11" fill="#6D8E75" opacity="0.38" />
        </svg>

        {/* Organic 7.2s GPU CSS breathing + sleepy nestle micro-shift, or happy cozy stretch on pet/serve */}
        <div
          key={isPurring ? `stretch-${petsCount}` : 'resting'}
          style={{ transformOrigin: 'bottom center' }}
          className={`relative z-10 aspect-[8/7] ${
            largeMobile
              ? 'h-[84px] [@media(min-height:760px)]:h-[96px]'
              : 'h-[64px]'
          } sm:h-[78px] md:h-[88px] lg:h-[104px] xl:h-[118px] transition-[height] duration-200 ${
            isPurring
              ? 'animate-marzipan-stretch'
              : guestHappy
                ? 'animate-marzipan-stretch'
                : 'animate-marzipan-breathe'
          }`}
        >
          <AssetIllustration
            src={CAFE_ASSETS.marzipan}
            alt="Кіт-помічник Марципан"
            className="h-full w-full sm:drop-shadow-[0_6px_9px_rgba(92,48,18,0.34)]"
            imgClassName="h-full w-full object-fill sm:saturate-[1.03] sm:contrast-[1.01]"
            fallback={<MarzipanCatSvg isPurring={isPurring} className="h-full w-full" />}
          />
          <MarzipanAccessoriesOverlaySvg equipped={equippedAccessories} />
        </div>
      </motion.button>

      <div className="relative z-20 -mt-1 flex items-center gap-1">
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
