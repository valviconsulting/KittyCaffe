import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  BASE_STICKER_CATALOG,
  RARE_STICKER_CATALOG,
  WISH_OPTIONS,
} from '../../data/stickers';
import { sound } from '../../services/sound';
import type {
  PlacedSticker,
  PreparedDrink,
  RareStickerId,
  StickerId,
  TakeawayDecoration,
} from '../../types/game';
import { StickerIconSvg, TakeawayCupSvg } from '../svg/TakeawayCupSvg';

interface TakeawayCupModalProps {
  drink: PreparedDrink | null;
  unlockedRareStickers?: RareStickerId[];
  onCancel: () => void;
  onConfirm: (decoration: TakeawayDecoration) => void;
}

export const TakeawayCupModal: React.FC<TakeawayCupModalProps> = ({
  drink,
  unlockedRareStickers = [],
  onCancel,
  onConfirm,
}) => {
  return (
    <AnimatePresence>
      {drink && (
        <TakeawayCupModalInner
          drink={drink}
          unlockedRareStickers={unlockedRareStickers}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}
    </AnimatePresence>
  );
};

const TakeawayCupModalInner: React.FC<{
  drink: PreparedDrink;
  unlockedRareStickers: RareStickerId[];
  onCancel: () => void;
  onConfirm: (decoration: TakeawayDecoration) => void;
}> = ({ drink, unlockedRareStickers, onCancel, onConfirm }) => {
  const [selectedSticker, setSelectedSticker] = useState<StickerId>('paw');
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [wishText, setWishText] = useState<string>(WISH_OPTIONS[0]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  const handleCupClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stickers.length >= 3) {
      sound.playPop();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    // Clamp neatly onto cup surface
    const x = Math.max(28, Math.min(72, rawX));
    const y = Math.max(32, Math.min(82, rawY));
    const rotation = Math.round((Math.random() - 0.5) * 20);

    setStickers((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        stickerId: selectedSticker,
        x,
        y,
        rotation,
      },
    ]);
    sound.playStickerPop();
  };

  const handleRemoveSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    sound.playPop();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5A3E32]/50 backdrop-blur-[2px] p-2 sm:p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label="Прикрась стаканчик із собою"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="watercolor-card flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-4 border-[#B88B61] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E3CCB0] bg-[#FAF0DF] px-4 sm:px-5 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl sm:text-2xl" aria-hidden="true">
              🏃
            </span>
            <div className="min-w-0">
              <h2 className="font-handwriting text-2xl sm:text-3xl leading-none font-bold text-[#5A3E32]">
                Прикрась стаканчик із собою!
              </h2>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#8A654A]">
                Обери стікер і торкнись стаканчика (до 3 стікерів) + додай побажання
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Закрити вікно стаканчика"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#D9A2B3] bg-[#FDF0F4] text-base font-bold text-[#8E3C55] hover:bg-[#F7D7E0]"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="cozy-scroll flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Left: Interactive Takeaway Cup Stage */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div
                onClick={handleCupClick}
                className="barista-linen-mat relative flex cursor-pointer items-center justify-center rounded-3xl border-2 border-[#B38961] px-4 py-3 transition-transform active:scale-[0.99]"
                title="Натисни на стаканчик, щоб приклеїти обраний стікер!"
              >
                <TakeawayCupSvg
                  drink={drink}
                  decoration={{ stickers, wishText }}
                  interactive={true}
                  onRemoveSticker={handleRemoveSticker}
                  className="h-52 w-40 sm:h-60 sm:w-46"
                />
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="rounded-full bg-[#F5E6CD] px-2.5 py-0.5 text-[10.5px] font-bold text-[#6E482D]">
                  Стікери: {stickers.length} / 3
                </span>
                {stickers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStickers([]);
                      sound.playPop();
                    }}
                    className="rounded-full bg-[#FCE9EF] px-2 py-0.5 text-[10px] font-bold text-[#8E3C55] hover:bg-[#F7D7E0]"
                  >
                    Прибрати всі
                  </button>
                )}
              </div>
            </div>

            {/* Right: Stickers + Wish Messages */}
            <div className="md:col-span-7 flex flex-col gap-3">
              {/* Stickers Palette */}
              <div className="barista-tray-recess rounded-2xl border-2 border-[#B9916B] p-2.5">
                <span className="block text-[11px] font-bold text-[#6A452C] mb-1.5">
                  1. Обери стікер і клікни по стаканчику:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {BASE_STICKER_CATALOG.map((item) => {
                    const active = selectedSticker === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedSticker(item.id);
                          sound.playPop();
                        }}
                        className={`barista-tile flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-bold text-[#4F3223] ${
                          active ? 'ring-2 ring-[#C96B84] ring-offset-1' : ''
                        }`}
                        style={{
                          backgroundColor: item.bg,
                          borderColor: active ? '#A84E68' : '#8B654B',
                        }}
                      >
                        <StickerIconSvg stickerId={item.id} className="h-7 w-7" />
                        <span className="leading-tight">{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Exclusive Rare Stickers gifted by Traveler Cat — Golden Border! */}
                  {RARE_STICKER_CATALOG.filter((item) =>
                    unlockedRareStickers.includes(item.id)
                  ).map((item) => {
                    const active = selectedSticker === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedSticker(item.id);
                          sound.playPop();
                        }}
                        title={`Рідкісний подарунок Котика-мандрівника: ${item.label}`}
                        className={`barista-tile relative flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[9.5px] font-bold text-[#5A390D] ${
                          active
                            ? 'ring-2 ring-[#D89426] ring-offset-1'
                            : 'shadow-[0_0_8px_rgba(226,170,62,0.38)]'
                        }`}
                        style={{
                          backgroundImage:
                            'linear-gradient(155deg, #FFFBEF 0%, #FCE6A8 100%)',
                          borderColor: '#D6972A',
                        }}
                      >
                        <span className="absolute right-1 top-0.5 text-[9px]" aria-hidden="true">
                          ⭐
                        </span>
                        <StickerIconSvg stickerId={item.id} className="h-7 w-7" />
                        <span className="leading-tight text-center">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {unlockedRareStickers.length < RARE_STICKER_CATALOG.length && (
                  <p className="mt-1.5 text-[10px] font-semibold text-[#8A6345]">
                    🎒 Пригощай Котика-мандрівника, щоб відкрити рідкісні золоті стікери ({unlockedRareStickers.length}/5)!
                  </p>
                )}
              </div>

              {/* Sleeve Wish Message */}
              <div className="barista-tray-recess rounded-2xl border-2 border-[#B9916B] p-2.5">
                <span className="block text-[11px] font-bold text-[#6A452C] mb-1.5">
                  2. Обери побажання на манжеті:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {WISH_OPTIONS.map((wish) => {
                    const active = wishText === wish;
                    return (
                      <button
                        key={wish}
                        type="button"
                        onClick={() => {
                          setWishText(wish);
                          sound.playPop();
                        }}
                        className={`barista-tile min-h-[40px] rounded-xl px-2 py-1 text-xs font-bold ${
                          active
                            ? 'text-[#184B2E]'
                            : 'text-[#5A3E32]'
                        }`}
                        style={{
                          backgroundImage: active
                            ? 'linear-gradient(155deg, #E4F6EA 0%, #BCE3C9 100%)'
                            : 'linear-gradient(155deg, #FFFDF8 0%, #F5E6CD 100%)',
                          borderColor: active ? '#43825A' : '#8B654B',
                        }}
                      >
                        «{wish}»
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t-2 border-[#E3CCB0] bg-[#FAF0DF] px-4 sm:px-5 py-2.5">
          <span className="text-[11px] font-bold text-[#7A5337]">
            🎁 Бонус +5 🐟 за стаканчик із собою!
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playTrayPlace();
              onConfirm({ stickers, wishText });
            }}
            className="min-h-[42px] rounded-2xl border-2 border-b-4 border-[#3E7A56] bg-gradient-to-b from-[#94D3AA] to-[#6CB889] px-5 py-1.5 text-xs sm:text-sm font-bold text-[#143D24] shadow-[0_4px_14px_rgba(78,150,104,0.35)] hover:brightness-105 active:translate-y-[2px] active:border-b-2"
          >
            ✓ Поставити на тацю!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
