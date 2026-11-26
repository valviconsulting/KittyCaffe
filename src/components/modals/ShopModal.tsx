import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { CAFE_ASSETS } from '../../config/assets';
import { DRINK_RECIPES, PASTRY_RECIPES } from '../../data/recipes';
import {
  CAFE_DECOR_ITEMS,
  MARZIPAN_WARDROBE,
  UNLOCKABLE_RECIPES,
} from '../../data/shop';
import { sound } from '../../services/sound';
import type {
  CafeDecorId,
  MarzipanAccessoryId,
  MarzipanEquipped,
  UnlockableRecipeId,
} from '../../types/game';
import { AssetIllustration } from '../common/AssetIllustration';
import { DecorPreviewSvg } from '../svg/CafeDecorAndSouvenirsSvg';
import { DrinkPreviewSvg } from '../svg/DrinkVisualSvg';
import {
  AccessoryPreviewSvg,
  MarzipanAccessoriesOverlaySvg,
} from '../svg/MarzipanAccessoriesSvg';
import { MarzipanCatSvg } from '../svg/MarzipanCatSvg';
import { PastrySvg } from '../svg/PastryVisualSvg';
import { FishCoinSvg } from '../svg/UiIconsSvg';

type ShopTab = 'wardrobe' | 'decor' | 'recipes';

interface ShopModalProps {
  isOpen: boolean;
  coins: number;
  ownedAccessories: MarzipanAccessoryId[];
  equippedAccessories: MarzipanEquipped;
  ownedDecor: CafeDecorId[];
  enabledDecor: CafeDecorId[];
  unlockedRecipes: UnlockableRecipeId[];
  musicBoxPlaying: boolean;
  onClose: () => void;
  onBuyAccessory: (id: MarzipanAccessoryId, price: number) => void;
  onToggleEquipAccessory: (id: MarzipanAccessoryId) => void;
  onBuyDecor: (id: CafeDecorId, price: number) => void;
  onToggleDecor: (id: CafeDecorId) => void;
  onToggleMusicBox: () => void;
  onBuyRecipe: (id: UnlockableRecipeId, price: number) => void;
  onOpenBackup?: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = (props) => {
  return (
    <AnimatePresence>
      {props.isOpen && <ShopModalInner {...props} />}
    </AnimatePresence>
  );
};

const ShopModalInner: React.FC<ShopModalProps> = ({
  coins,
  ownedAccessories,
  equippedAccessories,
  ownedDecor,
  enabledDecor,
  unlockedRecipes,
  musicBoxPlaying,
  onClose,
  onBuyAccessory,
  onToggleEquipAccessory,
  onBuyDecor,
  onToggleDecor,
  onToggleMusicBox,
  onBuyRecipe,
  onOpenBackup,
}) => {
  const [tab, setTab] = useState<ShopTab>('wardrobe');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const isEquipped = (id: MarzipanAccessoryId): boolean =>
    equippedAccessories.head === id ||
    equippedAccessories.eyes === id ||
    equippedAccessories.neck === id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5A3E32]/48 backdrop-blur-[2px] p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Магазин і Гардероб Марципана"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="watercolor-notebook relative flex h-[94dvh] sm:h-auto sm:max-h-[88dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl sm:rounded-[2rem] border-4 border-[#C99B67] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E6D1B8] bg-gradient-to-r from-[#FBF0DC] via-[#FAF1E2] to-[#FCEBF1] px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl sm:text-2xl shrink-0" aria-hidden="true">
              🛍️
            </span>
            <div className="min-w-0">
              <h2 className="font-handwriting text-2xl sm:text-3xl leading-none font-bold text-[#5A3E32]">
                Магазин і Гардероб Марципана
              </h2>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#8A644B] mt-0.5">
                Прикрашай котика, додавай затишок у кав’ярню та відкривай нові рецепти!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenBackup && (
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onClose();
                  onOpenBackup();
                }}
                title="Зберегти або завантажити файл прогресу (.json)"
                aria-label="Збереження прогресу"
                className="flex h-10 items-center gap-1 rounded-full border-2 border-[#C8A67D] bg-[#FFFDF8] px-2.5 text-xs font-bold text-[#6A4528] hover:bg-[#FAF0DF]"
              >
                <span aria-hidden="true">💾</span>
                <span className="hidden sm:inline">Сейв</span>
              </button>
            )}
            <div className="flex items-center gap-1 rounded-full border-2 border-[#E3BE73] bg-[#FDF5DC] px-2.5 py-1 shadow-xs">
              <FishCoinSvg className="h-4.5 w-4.5" />
              <span className="text-xs sm:text-sm font-bold text-[#7B5218] tabular-nums">
                {coins}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрити магазин"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E0ACBC] bg-[#FDF0F4] text-base font-bold text-[#914059] hover:bg-[#F7D7E0]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 3 Shop Tabs */}
        <div className="flex shrink-0 gap-1.5 sm:gap-2 border-b-2 border-[#EBD8C3] bg-[#F8EFE0]/90 px-3 sm:px-6 py-2">
          {(
            [
              {
                id: 'wardrobe' as const,
                short: '🐱 Гардероб',
                label: '🐱 Гардероб Марципана',
              },
              {
                id: 'decor' as const,
                short: '✨ Затишок',
                label: '✨ Затишок у кав’ярні',
              },
              {
                id: 'recipes' as const,
                short: '📜 Рецепти',
                label: '📜 Нові рецепти',
              },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                sound.playPop();
              }}
              className={`min-h-[38px] flex-1 sm:flex-none rounded-full border-2 px-2 sm:px-4 py-1 text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-[#C69358] bg-[#FBE8CE] text-[#5A3E32] shadow-xs'
                  : 'border-transparent bg-[#FFFDF8]/80 text-[#8D684E] hover:bg-[#FAF0DF]'
              }`}
            >
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="cozy-scroll flex-1 overflow-y-auto p-3.5 sm:p-5">
          {/* TAB 1: MARZIPAN WARDROBE */}
          {tab === 'wardrobe' && (
            <div className="flex flex-col gap-3.5">
              {/* Live Dressing-Room Preview of Marzipan */}
              <div className="barista-linen-mat flex flex-col sm:flex-row items-center justify-between gap-3 rounded-3xl border-2 border-[#C89F72] px-4 py-3">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-24 w-28 shrink-0 items-end justify-center pt-3">
                    <div className="relative aspect-[8/7] h-[82px]">
                      <AssetIllustration
                        src={CAFE_ASSETS.marzipan}
                        alt="Марципан у примірочній"
                        className="h-full w-full"
                        imgClassName="h-full w-full object-contain"
                        fallback={<MarzipanCatSvg isPurring={false} className="h-full w-full" />}
                      />
                      <MarzipanAccessoriesOverlaySvg equipped={equippedAccessories} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-handwriting text-2xl leading-none font-bold text-[#5A3E32]">
                      Примірочна Марципана
                    </h3>
                    <p className="text-[11px] font-semibold text-[#856248] mt-1">
                      Можна поєднувати одночасно: <strong>капелюх/корону</strong> +{' '}
                      <strong>окуляри</strong> + <strong>аксесуар на шию</strong>!
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] font-bold">
                      <span className="rounded-full bg-[#FFFDF8] border border-[#D4B48F] px-2 py-0.5 text-[#6F4C32]">
                        Голова:{' '}
                        {equippedAccessories.head === 'chef_hat'
                          ? 'Ковпак 👨‍🍳'
                          : equippedAccessories.head === 'gold_crown'
                            ? 'Корона 👑'
                            : '—'}
                      </span>
                      <span className="rounded-full bg-[#FFFDF8] border border-[#D4B48F] px-2 py-0.5 text-[#6F4C32]">
                        Окуляри:{' '}
                        {equippedAccessories.eyes === 'heart_glasses'
                          ? 'Сердечка 🕶️'
                          : '—'}
                      </span>
                      <span className="rounded-full bg-[#FFFDF8] border border-[#D4B48F] px-2 py-0.5 text-[#6F4C32]">
                        Шия:{' '}
                        {equippedAccessories.neck === 'red_bowtie'
                          ? 'Метелик 🎀'
                          : equippedAccessories.neck === 'knit_scarf'
                            ? 'Шарфик 🧣'
                            : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Wardrobe Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MARZIPAN_WARDROBE.map((item) => {
                  const owned = ownedAccessories.includes(item.id);
                  const equipped = isEquipped(item.id);
                  const canAfford = coins >= item.price;

                  return (
                    <div
                      key={item.id}
                      className="watercolor-card flex items-center gap-3 rounded-3xl border-2 p-3"
                      style={{
                        borderColor: equipped ? '#4E9468' : item.accentBorder,
                      }}
                    >
                      <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border"
                        style={{
                          backgroundColor: item.accentBg,
                          borderColor: item.accentBorder,
                        }}
                      >
                        <AccessoryPreviewSvg accessoryId={item.id} className="h-14 w-14" />
                      </div>

                      <div className="flex flex-1 flex-col gap-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-handwriting text-xl leading-none font-bold text-[#5A3E32] truncate">
                            {item.name}
                          </h4>
                          <span className="shrink-0 rounded-full bg-[#F6EBDC] px-2 py-0.5 text-[9.5px] font-bold text-[#7D583B]">
                            {item.slotLabel}
                          </span>
                        </div>
                        <p className="text-[10.5px] leading-snug text-[#7F5E48]">
                          {item.description}
                        </p>

                        <div className="mt-1 flex items-center justify-between gap-2">
                          {owned ? (
                            <button
                              type="button"
                              onClick={() => onToggleEquipAccessory(item.id)}
                              className={`min-h-[34px] w-full rounded-xl border-2 border-b-[3px] px-3 py-1 text-xs font-bold transition-all ${
                                equipped
                                  ? 'border-[#3E7A56] bg-gradient-to-b from-[#DDF3E4] to-[#B6DFC3] text-[#174A2C]'
                                  : 'border-[#B88B5D] bg-gradient-to-b from-[#FFFDF8] to-[#F4E3C9] text-[#5A3E32] hover:brightness-98'
                              }`}
                            >
                              {equipped ? '✓ Одягнуто (Зняти)' : '✨ Одягнути на Марципана'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={!canAfford}
                              onClick={() => onBuyAccessory(item.id, item.price)}
                              className={`min-h-[34px] w-full flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-1 text-xs font-bold transition-all ${
                                canAfford
                                  ? 'border-[#9B6822] border-b-4 bg-gradient-to-b from-[#FCE197] to-[#E9B54D] text-[#4C2E0B] hover:brightness-105 active:translate-y-[1px]'
                                  : 'border-[#D1BFA9] border-b-[3px] bg-[#EFE5D7] text-[#9E8874] cursor-not-allowed'
                              }`}
                            >
                              <span>Купити за {item.price}</span>
                              <FishCoinSvg className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CAFE INTERIOR DECOR */}
          {tab === 'decor' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CAFE_DECOR_ITEMS.map((item) => {
                const owned = ownedDecor.includes(item.id);
                const enabled = enabledDecor.includes(item.id);
                const canAfford = coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className="watercolor-card flex gap-3 rounded-3xl border-2 p-3.5"
                    style={{
                      borderColor: enabled ? '#4E9468' : item.accentBorder,
                    }}
                  >
                    <div
                      className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl border"
                      style={{
                        backgroundColor: item.accentBg,
                        borderColor: item.accentBorder,
                      }}
                    >
                      <DecorPreviewSvg decorId={item.id} className="h-14 w-14" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-1.5 min-w-0">
                      <div>
                        <h4 className="font-handwriting text-xl leading-tight font-bold text-[#5A3E32]">
                          {item.name}
                        </h4>
                        <p className="text-[10.5px] leading-snug text-[#7F5E48] mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {owned ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onToggleDecor(item.id)}
                              className={`min-h-[34px] flex-1 rounded-xl border-2 border-b-[3px] px-2.5 py-1 text-xs font-bold transition-all ${
                                enabled
                                  ? 'border-[#3E7A56] bg-gradient-to-b from-[#DDF3E4] to-[#B6DFC3] text-[#174A2C]'
                                  : 'border-[#B88B5D] bg-gradient-to-b from-[#FFFDF8] to-[#F4E3C9] text-[#5A3E32]'
                              }`}
                            >
                              {enabled ? '✓ У кав’ярні (Сховати)' : '✨ Поставити в кав’ярню'}
                            </button>

                            {item.id === 'music_box' && enabled && (
                              <button
                                type="button"
                                onClick={onToggleMusicBox}
                                className="min-h-[34px] rounded-xl border-2 border-b-[3px] border-[#9B72B0] bg-[#F4E9FA] px-2.5 py-1 text-xs font-bold text-[#5C3472] hover:brightness-98"
                              >
                                {musicBoxPlaying ? '⏸️ Пауза' : '▶️ Грати'}
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => onBuyDecor(item.id, item.price)}
                            className={`min-h-[34px] w-full flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-1 text-xs font-bold transition-all ${
                              canAfford
                                ? 'border-[#9B6822] border-b-4 bg-gradient-to-b from-[#FCE197] to-[#E9B54D] text-[#4C2E0B] hover:brightness-105 active:translate-y-[1px]'
                                : 'border-[#D1BFA9] border-b-[3px] bg-[#EFE5D7] text-[#9E8874] cursor-not-allowed'
                            }`}
                          >
                            <span>Купити за {item.price}</span>
                            <FishCoinSvg className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: UNLOCKABLE RECIPES */}
          {tab === 'recipes' && (
            <div className="grid grid-cols-1 gap-3.5">
              {UNLOCKABLE_RECIPES.map((item) => {
                const unlocked = unlockedRecipes.includes(item.id);
                const canAfford = coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className="watercolor-card flex flex-col sm:flex-row items-center gap-4 rounded-3xl border-2 p-4"
                    style={{
                      borderColor: unlocked ? '#4E9468' : item.accentBorder,
                    }}
                  >
                    <div
                      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border"
                      style={{
                        backgroundColor: item.accentBg,
                        borderColor: item.accentBorder,
                      }}
                    >
                      {item.id === 'matcha_latte' ? (
                        <DrinkPreviewSvg
                          drink={DRINK_RECIPES.matcha_latte.sampleDrink}
                          className="h-20 w-20"
                        />
                      ) : (
                        <PastrySvg
                          pastry={PASTRY_RECIPES.carrot_cake.expected}
                          showPlate={true}
                          className="h-20 w-22"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-1.5 text-center sm:text-left min-w-0">
                      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                        <h4 className="font-handwriting text-2xl leading-none font-bold text-[#5A3E32]">
                          {item.emoji} {item.name}
                        </h4>
                        {unlocked && (
                          <span className="rounded-full border border-[#6EA881] bg-[#E2F3E7] px-3 py-0.5 text-[11px] font-bold text-[#1D5A35]">
                            ✓ Відкрито в меню та Книзі рецептів!
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-snug text-[#785942]">
                        {item.description}
                      </p>
                      <span className="inline-block self-center sm:self-start rounded-full bg-[#FAF0DE] border border-[#DEBD93] px-2.5 py-0.5 text-[10.5px] font-bold text-[#6E4728]">
                        📜 {item.ingredientsHint}
                      </span>

                      {!unlocked && (
                        <div className="mt-1">
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => onBuyRecipe(item.id, item.price)}
                            className={`min-h-[38px] w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border-2 px-5 py-1.5 text-xs font-bold transition-all ${
                              canAfford
                                ? 'border-[#9B6822] border-b-4 bg-gradient-to-b from-[#FCE197] to-[#E9B54D] text-[#4C2E0B] hover:brightness-105 active:translate-y-[1px]'
                                : 'border-[#D1BFA9] border-b-[3px] bg-[#EFE5D7] text-[#9E8874] cursor-not-allowed'
                            }`}
                          >
                            <span>Відкрити рецепт за {item.price}</span>
                            <FishCoinSvg className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
