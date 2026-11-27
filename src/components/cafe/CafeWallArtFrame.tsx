import { motion } from 'framer-motion';
import React from 'react';
import type { WallArtState } from '../../types/game';

interface CafeWallArtFrameProps {
  wallArt: WallArtState;
  onEdit: () => void;
}

const FRAME_STYLES = {
  honey_wood: {
    outer: 'border-[#7C4E2B] bg-gradient-to-b from-[#DDA66B] to-[#BC7D45]',
    inner: 'border-[#F7E5C8]',
    plaque: 'bg-[#FFF5DC] border-[#C99A58] text-[#5F3C18]',
  },
  blush_ribbon: {
    outer: 'border-[#A6536E] bg-gradient-to-b from-[#F8C4D4] to-[#E69AB2]',
    inner: 'border-[#FFF6F9]',
    plaque: 'bg-[#FFF0F5] border-[#D98EA6] text-[#7D2E49]',
  },
  golden_stars: {
    outer: 'border-[#9B6D1F] bg-gradient-to-b from-[#FCE08B] to-[#DFAB48]',
    inner: 'border-[#FFFBF0]',
    plaque: 'bg-[#FFF9E4] border-[#CCA048] text-[#66410B]',
  },
};

/**
 * Displays the player's own painted watercolor picture hanging on the cozy café wall.
 * Clicking it opens the Watercolor Easel (`WallArtModal`) to repaint or change the frame anytime.
 */
export const CafeWallArtFrame: React.FC<CafeWallArtFrameProps> = ({
  wallArt,
  onEdit,
}) => {
  if (!wallArt.dataUrl || !wallArt.visible) return null;
  const style = FRAME_STYLES[wallArt.frameStyle];

  return (
    <motion.button
      type="button"
      data-cafe-wall-art="true"
      initial={{ opacity: 0, scale: 0.88, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      whileTap={{ scale: 0.96 }}
      onClick={(e) => {
        e.stopPropagation();
        onEdit();
      }}
      title={
        wallArt.title
          ? `Твоя картина «${wallArt.title}» — натисни, щоб домалювати або змінити рамку!`
          : 'Твоя картина на стіні — натисни, щоб домалювати або змінити рамку!'
      }
      aria-label={
        wallArt.title
          ? `Твоя картина на стіні: ${wallArt.title}. Натисни, щоб редагувати.`
          : 'Твоя картина на стіні кав’ярні. Натисни, щоб редагувати.'
      }
      className="hidden sm:flex absolute left-[20%] lg:left-[20.8%] top-[23%] lg:top-[25%] z-[14] flex-col items-center focus:outline-none drop-shadow-[0_8px_14px_rgba(52,28,12,0.34)]"
    >
      {/* Cute brass nail & delicate hanging twine */}
      <div className="relative h-3.5 w-14 flex items-start justify-center pointer-events-none">
        <svg viewBox="0 0 60 16" className="h-full w-full" aria-hidden="true">
          <path
            d="M12 16 L30 3 L48 16"
            fill="none"
            stroke="#7A5236"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="30" cy="3.5" r="2.6" fill="#F0C664" stroke="#5A3E32" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Watercolor wooden / blush / golden frame */}
      <div
        className={`relative rounded-xl border-2 p-1.5 shadow-[inset_0_1px_0_rgba(255,252,240,0.65)] ${style.outer}`}
      >
        {wallArt.frameStyle === 'blush_ribbon' && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs leading-none"
          >
            🎀
          </span>
        )}
        {wallArt.frameStyle === 'golden_stars' && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 -right-2 text-xs leading-none"
          >
            ✨
          </span>
        )}
        <div
          className={`w-[86px] md:w-[98px] lg:w-[114px] aspect-[4/3] overflow-hidden rounded-md border-[1.5px] bg-[#FFFDF8] ${style.inner}`}
        >
          <img
            src={wallArt.dataUrl}
            alt={wallArt.title || 'Твоя картина в кав’ярні'}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {wallArt.title && (
        <span
          className={`mt-0.5 max-w-[112px] truncate rounded-full border px-2 py-0.2 text-[9px] font-bold shadow-2xs ${style.plaque}`}
        >
          {wallArt.title}
        </span>
      )}
    </motion.button>
  );
};
