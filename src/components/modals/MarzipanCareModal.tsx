import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { CAFE_ASSETS } from '../../config/assets';
import { sound } from '../../services/sound';
import type {
  MarzipanCareState,
  MarzipanEquipped,
} from '../../types/game';
import { AssetIllustration } from '../common/AssetIllustration';
import { MarzipanAccessoriesOverlaySvg } from '../svg/MarzipanAccessoriesSvg';
import { MarzipanCatSvg } from '../svg/MarzipanCatSvg';

interface MarzipanCareModalProps {
  isOpen: boolean;
  coins: number;
  currentDayNumber: number;
  equippedAccessories: MarzipanEquipped;
  care: MarzipanCareState;
  onGiveTreat: (treatId: 'fish_crunch' | 'cat_milk' | 'salmon_delight', cost: number) => void;
  onCompleteYarnRound: () => boolean;
  onClose: () => void;
}

const YARN_SPOTS: Array<{ left: string; top: string }> = [
  { left: '16%', top: '24%' },
  { left: '72%', top: '20%' },
  { left: '44%', top: '54%' },
  { left: '22%', top: '62%' },
  { left: '74%', top: '58%' },
  { left: '52%', top: '22%' },
];

const YARN_ROUND_TARGET = 5;

export const MarzipanCareModal: React.FC<MarzipanCareModalProps> = ({
  isOpen,
  coins,
  currentDayNumber,
  equippedAccessories,
  care,
  onGiveTreat,
  onCompleteYarnRound,
  onClose,
}) => {
  const [marzipanMoodText, setMarzipanMoodText] = useState<string>(
    'Муррр~ Пригости мене котячим смаколиком або пограймося з клубочком!'
  );
  const [isExcited, setIsExcited] = useState(false);
  const [yarnHits, setYarnHits] = useState(0);
  const [yarnSpotIdx, setYarnSpotIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const pulseHappy = (msg: string) => {
    setMarzipanMoodText(msg);
    setIsExcited(true);
    window.setTimeout(() => setIsExcited(false), 950);
  };

  const handleTreatClick = (
    treatId: 'fish_crunch' | 'cat_milk' | 'salmon_delight',
    cost: number,
    reaction: string
  ) => {
    if (cost > 0 && coins < cost) {
      sound.playGentleOops();
      setMarzipanMoodText('На лосось потрібно 5 🐟, але хрумка рибка й молочко завжди є!');
      return;
    }
    onGiveTreat(treatId, cost);
    sound.playPurr();
    pulseHappy(reaction);
  };

  const handleTapYarn = () => {
    const nextHits = yarnHits + 1;
    setYarnSpotIdx((prev) => (prev + 1 + (nextHits % 2)) % YARN_SPOTS.length);

    if (nextHits >= YARN_ROUND_TARGET) {
      setYarnHits(0);
      const gotDailyBonus = onCompleteYarnRound();
      if (gotDailyBonus) {
        sound.playSuccess();
        pulseHappy(
          'Ура-а-а! Муррр! Під килимком я знайшов загублену монетку: +5 🐟 для кав’ярні!'
        );
      } else {
        sound.playPurr();
        pulseHappy(
          'Хи-хи, як весело гратися з клубочком! Давай ще пострибаємо! 🧶♥'
        );
      }
      return;
    }

    setYarnHits(nextHits);
    sound.playStickerPop();
    setMarzipanMoodText(
      `Плюх! Мяу~ (${nextHits}/${YARN_ROUND_TARGET}) — лови рожевий клубочок!`
    );
  };

  const dailyRewardAvailable = care.lastPlayRewardDay < currentDayNumber;
  const spot = YARN_SPOTS[yarnSpotIdx];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3C281C]/52 p-3 sm:p-4 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Затишний куточок Марципана"
            data-marzipan-care-modal="true"
            className="watercolor-card relative flex max-h-[90dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl border-[3px] border-[#D19564] bg-[#FAF4E8] shadow-[0_22px_52px_rgba(48,26,12,0.4)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E6CBA8] bg-gradient-to-r from-[#FFF2DE] via-[#FCEAD2] to-[#FCEEF3] px-4 py-3 sm:px-5">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#9A6238]">
                  Турбота й весела гра • 100% котячі смаколики
                </p>
                <h2 className="font-handwriting text-2xl sm:text-3xl leading-tight font-bold text-[#5A3E32]">
                  🐱 Затишний куточок Марципана
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити куточок Марципана"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#D6AF85] bg-[#FFFDF8] text-sm font-bold text-[#6E4932] hover:bg-[#F5E4C8]"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="cozy-scroll flex-1 overflow-y-auto px-4 py-3.5 sm:px-5 space-y-3.5">
              {/* Dressed Marzipan Portrait + Speech */}
              <div className="flex items-center gap-3 rounded-2xl border-2 border-[#E2C29E] bg-[#FFFDF8] p-3 shadow-2xs">
                <motion.div
                  animate={
                    isExcited
                      ? { y: [0, -8, 0], rotate: [-4, 4, 0], scale: [1, 1.07, 1] }
                      : { scaleY: [1, 1.03, 1] }
                  }
                  transition={
                    isExcited
                      ? { duration: 0.55 }
                      : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }
                  }
                  className="relative aspect-[8/7] h-[84px] sm:h-[96px] shrink-0"
                >
                  <AssetIllustration
                    src={CAFE_ASSETS.marzipan}
                    alt="Кіт Марципан"
                    className="h-full w-full drop-shadow-[0_4px_6px_rgba(92,48,18,0.28)]"
                    imgClassName="h-full w-full object-fill saturate-[1.12]"
                    fallback={<MarzipanCatSvg isPurring={isExcited} className="h-full w-full" />}
                  />
                  <MarzipanAccessoriesOverlaySvg equipped={equippedAccessories} />
                </motion.div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-xs sm:text-[13px] font-bold leading-snug text-[#5A3E32]">
                    {marzipanMoodText}
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-[#7F583B]">
                    <span className="rounded-full bg-[#FDF3DF] border border-[#E2C18B] px-2 py-0.5">
                      🐟 Смаколиків: {care.treatsGiven}
                    </span>
                    <span className="rounded-full bg-[#FCEEF3] border border-[#E5B0C2] px-2 py-0.5 text-[#83344D]">
                      🧶 Ігор: {care.yarnGamesPlayed}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cat-Safe Cozy Treats (zero coffee, zero chocolate!) */}
              <div className="space-y-1.5">
                <h3 className="font-handwriting text-xl leading-none font-bold text-[#5A3E32]">
                  🐟 Пригостити котика-помічника:
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    data-marzipan-treat="fish_crunch"
                    onClick={() =>
                      handleTreatClick(
                        'fish_crunch',
                        0,
                        'Хрум-хрум! Дякую за хрумку котячу рибку! Муррр~ ♥'
                      )
                    }
                    className="barista-tile flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2 text-center"
                    style={{
                      backgroundImage: 'linear-gradient(155deg, #FFF9EB 0%, #F7DFAC 100%)',
                      borderColor: '#B98744',
                    }}
                  >
                    <span className="text-xl leading-none">🐟</span>
                    <span className="text-[11px] font-bold text-[#52341C]">
                      Хрумка рибка
                    </span>
                    <span className="text-[9.5px] font-bold text-[#2D6E45]">
                      У мисочці ♥
                    </span>
                  </button>

                  <button
                    type="button"
                    data-marzipan-treat="cat_milk"
                    onClick={() =>
                      handleTreatClick(
                        'cat_milk',
                        0,
                        'Сьорб-сьорб! Тепле молочко для котиків — просто мрія! 🥛♥'
                      )
                    }
                    className="barista-tile flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2 text-center"
                    style={{
                      backgroundImage: 'linear-gradient(155deg, #F4FAFE 0%, #D9ECF8 100%)',
                      borderColor: '#7EAAC7',
                    }}
                  >
                    <span className="text-xl leading-none">🥛</span>
                    <span className="text-[11px] font-bold text-[#2F4E66]">
                      Котяче молочко
                    </span>
                    <span className="text-[9.5px] font-bold text-[#2D6E45]">
                      У мисочці ♥
                    </span>
                  </button>

                  <button
                    type="button"
                    data-marzipan-treat="salmon_delight"
                    onClick={() =>
                      handleTreatClick(
                        'salmon_delight',
                        5,
                        'МЯУ!! Лососевий делікатес — я найщасливіший котик у світі!! ✨♥'
                      )
                    }
                    className="barista-tile flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2 text-center"
                    style={{
                      backgroundImage: 'linear-gradient(155deg, #FFF1F4 0%, #F8CED8 100%)',
                      borderColor: '#C4758C',
                    }}
                  >
                    <span className="text-xl leading-none">🍣</span>
                    <span className="text-[11px] font-bold text-[#7A2D45]">
                      Лосось-делікатес
                    </span>
                    <span className="text-[9.5px] font-bold text-[#8A5915]">
                      5 🐟
                    </span>
                  </button>
                </div>
              </div>

              {/* Interactive Bouncy Yarn-Ball Mini-Game */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-handwriting text-xl leading-none font-bold text-[#5A3E32]">
                    🧶 Гра з клубочком ({yarnHits}/{YARN_ROUND_TARGET}):
                  </h3>
                  <span className="rounded-full border border-[#E0B96B] bg-[#FFF5D8] px-2 py-0.5 text-[10px] font-bold text-[#784E12]">
                    {dailyRewardAvailable
                      ? '🎁 Сюрприз дня: +5 🐟'
                      : '✨ Сюрприз дня знайдено!'}
                  </span>
                </div>

                <div className="relative h-[132px] w-full overflow-hidden rounded-2xl border-2 border-dashed border-[#C79F74] bg-gradient-to-br from-[#FBF1DF] via-[#F7E7CE] to-[#F9EAEF] shadow-inner">
                  <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] font-bold text-[#9A7455]">
                    Натискай на рожевий клубочок, щоб Марципан його зловив!
                  </span>

                  <motion.button
                    type="button"
                    data-yarn-ball="true"
                    aria-label="Спіймати рожевий клубочок ниток"
                    onClick={handleTapYarn}
                    animate={{ left: spot.left, top: spot.top }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    whileTap={{ scale: 0.85, rotate: 24 }}
                    className="absolute flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#C86684] bg-gradient-to-br from-[#FCE0E9] to-[#F3A5BC] text-2xl shadow-[0_6px_12px_rgba(146,62,88,0.3)] hover:scale-110"
                  >
                    🧶
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
