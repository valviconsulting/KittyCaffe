import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { CAFE_ASSETS } from '../../config/assets';
import { GUESTS } from '../../data/guests';
import type { GuestEmotion, GuestId } from '../../types/game';
import { AssetIllustration } from '../common/AssetIllustration';
import { GuestCharacterSvg } from '../svg/GuestCharacterSvg';
import { FishCoinSvg } from '../svg/UiIconsSvg';

interface GuestCardProps {
  orderId: number;
  guestId: GuestId;
  emotion: GuestEmotion;
  lastReward: number | null;
  isBestFriend?: boolean;
}

export const GuestCard: React.FC<GuestCardProps> = ({
  orderId,
  guestId,
  emotion,
  lastReward,
  isBestFriend = false,
}) => {
  const guest = GUESTS[guestId];
  const isHappy = emotion === 'happy';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={orderId}
        initial={{ opacity: 0, y: 20, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 230, damping: 22 }}
        className="relative flex shrink-0 flex-col items-center"
      >
        {/* Soft joyful golden watercolor aura behind guest when happy */}
        <AnimatePresence>
          {isHappy && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.85, scale: 1.08 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-x-0 bottom-4 top-2 -z-10 rounded-full bg-radial from-[#FFEBA0]/75 via-[#F8CFD9]/45 to-transparent blur-md"
            />
          )}
        </AnimatePresence>

        {/* Flying Fish-Coin Reward Pop */}
        <AnimatePresence>
          {isHappy && lastReward !== null && lastReward > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.6 }}
              animate={{ opacity: 1, y: -14, scale: 1.08 }}
              exit={{ opacity: 0, y: -34, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className="pointer-events-none absolute -top-3 -right-2 z-30 flex items-center gap-1 rounded-full border-2 border-[#DFB257] bg-[#FDF6DC] px-2 py-0.5 text-xs sm:text-sm font-bold text-[#885A14] shadow-md"
            >
              <span>+{lastReward}</span>
              <FishCoinSvg className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Best Friend Tiny Heart Halo Badge */}
        {isBestFriend && !isHappy && (
          <div
            title="Найкращий друг (+5 🐟 чайових!)"
            className="pointer-events-none absolute -top-1 right-1 z-20 rounded-full border border-[#E59DB3] bg-[#FFF4F7]/95 px-1.5 py-0.2 text-[10px] font-bold text-[#9C3B58] shadow-xs"
          >
            💖 +5
          </div>
        )}

        {/* Rising watercolor hearts & awake sparkles on happy emotion */}
        <AnimatePresence>
          {isHappy && (
            <div className="pointer-events-none absolute -top-2 inset-x-0 z-30 flex justify-around">
              {['♥', '✨', '♥'].map((symbol, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 14, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], y: -34, scale: 1.15 }}
                  transition={{
                    duration: 1.45,
                    delay: idx * 0.22,
                    repeat: Infinity,
                  }}
                  className={
                    symbol === '✨'
                      ? 'text-base sm:text-lg text-[#E6AE39]'
                      : 'text-base sm:text-lg text-[#EC7E9B]'
                  }
                >
                  {symbol}
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Expressive watercolor emotion badge for surprised / Puff no-coffee */}
        <AnimatePresence>
          {(emotion === 'surprised' || emotion === 'no_coffee') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="pointer-events-none absolute right-0 top-1 z-30 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-[#E398AD] bg-[#FFF4F7] font-handwriting text-lg sm:text-xl font-bold text-[#C85A77] shadow-sm"
            >
              {emotion === 'no_coffee' ? '!' : '?'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Soft warm golden-afternoon ambient bounce behind guest so fur blends naturally into the café */}
        <div className="pointer-events-none absolute inset-x-2 bottom-3 top-4 -z-10 rounded-full bg-radial from-[#FFEAB3]/52 via-[#FADBC4]/22 to-transparent blur-md" />
        <div className="pointer-events-none absolute bottom-1 inset-x-4 h-7 rounded-full bg-[#5A3214]/32 blur-[8px]" />

        {/* Portrait Sprite standing behind wooden counter — natural breathing + cute subtle head sway */}
        <motion.div
          animate={
            emotion === 'no_coffee'
              ? { x: [0, -7, 7, -6, 6, -3, 3, 0], rotate: [0, -5, 5, -4, 4, 0] }
              : isHappy
                ? { y: [0, -8, 0, -4, 0], scale: [1, 1.045, 0.99, 1.025, 1], rotate: [0, -2, 2, -1, 0] }
                : { scaleY: [1, 1.024, 1], y: [0, -1.8, 0], rotate: [0, 0.85, 0, -0.85, 0] }
          }
          transition={
            emotion === 'no_coffee'
              ? { duration: 0.65, ease: 'easeInOut' }
              : isHappy
                ? { duration: 0.95, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ transformOrigin: 'bottom center' }}
          className="relative"
        >
          <AssetIllustration
            src={CAFE_ASSETS.guests[guestId]}
            alt={guest.name}
            className="h-[116px] w-[104px] sm:h-[146px] sm:w-[136px] md:h-[172px] md:w-[162px] lg:h-[196px] lg:w-[190px] xl:h-[234px] xl:w-[224px] drop-shadow-[0_10px_14px_rgba(90,48,18,0.34)]"
            imgClassName="h-full w-full object-contain object-bottom saturate-[1.11] contrast-[1.03] sepia-[0.04]"
            fallback={
              <GuestCharacterSvg
                guestId={guestId}
                emotion={emotion}
                className="h-full w-full"
              />
            }
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
