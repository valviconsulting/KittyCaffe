import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { CAFE_ASSETS } from '../../config/assets';
import {
  MYSTERY_CLUES,
  MYSTERY_FINALE_BONUS_COINS,
  MYSTERY_STORY_DAYS,
  getDay1ChoiceMeta,
  getDay2ChoiceMeta,
} from '../../data/recipeMystery';
import { DRINK_RECIPES, HOT_INGREDIENT_LABELS } from '../../data/recipes';
import type { RecipeMysteryStoryState } from '../../types/game';
import { AssetIllustration } from '../common/AssetIllustration';
import { DrinkPreviewSvg } from '../svg/DrinkVisualSvg';
import { GuestCharacterSvg } from '../svg/GuestCharacterSvg';
import { IngredientIconSvg } from '../svg/UiIconsSvg';

export type RecipeMysteryModalMode = 'intro' | 'clues' | 'solved';

interface RecipeMysteryModalProps {
  isOpen: boolean;
  mode: RecipeMysteryModalMode;
  story: RecipeMysteryStoryState;
  onStartMystery: () => void;
  onToggleCounterSouvenir: () => void;
  onClose: () => void;
}

export const RecipeMysteryModal: React.FC<RecipeMysteryModalProps> = ({
  isOpen,
  mode,
  story,
  onStartMystery,
  onToggleCounterSouvenir,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const discoveredSet = new Set(story.discoveredClues);
  const day1Meta = getDay1ChoiceMeta(story.day1Choice);
  const day2Meta = getDay2ChoiceMeta(story.day2Choice);
  const goldenRecipe = DRINK_RECIPES.golden_cocoa;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3C281C]/52 p-3 sm:p-4 sm:backdrop-blur-[2px]"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Глава 2: Таємниця загубленого рецепта"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            data-mystery-modal={mode}
            className="watercolor-card relative flex max-h-[90dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-3xl border-[3px] border-[#A8763C] bg-[#FAF4E8] shadow-[0_22px_50px_rgba(48,26,12,0.38)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#DFC08F] bg-gradient-to-r from-[#FFF3D4] via-[#FCE7BC] to-[#F9DFBF] px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#8C5B20]">
                  {mode === 'intro'
                    ? 'Глава 2 • Детективна казка (3 дні)'
                    : mode === 'solved'
                      ? 'Таємницю розкрито! • Легендарний рецепт'
                      : `Дошка підказок • Знайдено ${story.discoveredClues.length}/3`}
                </p>
                <h2 className="font-handwriting text-2xl sm:text-3xl leading-tight font-bold text-[#5A3E32]">
                  {mode === 'intro'
                    ? '🔍 Таємниця загубленого рецепта'
                    : mode === 'solved'
                      ? '⭐ Золоте какао «Мур-Лате»!'
                      : '📜 Загублений рецепт «Мур-Лате»'}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити вікно таємниці"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#CFA36B] bg-[#FFFDF8] text-sm font-bold text-[#6E4932] hover:bg-[#F5E4C8]"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="cozy-scroll flex-1 overflow-y-auto px-4 py-3.5 sm:px-5 sm:py-4 space-y-3.5">
              {mode === 'intro' && (
                <>
                  <div className="flex items-center gap-3 rounded-2xl border-2 border-[#DFBE91] bg-[#FFFDF8] p-3.5 shadow-2xs">
                    <div className="flex h-20 w-20 shrink-0 items-end justify-center overflow-hidden rounded-2xl border border-[#DFC198] bg-[#F6EFE6]">
                      <AssetIllustration
                        src={CAFE_ASSETS.guests.marsel}
                        alt="Ведмедик Марсель"
                        className="h-18 w-18"
                        imgClassName="h-full w-full object-contain object-bottom"
                        fallback={
                          <GuestCharacterSvg
                            guestId="marsel"
                            emotion="waiting"
                            className="h-full w-full"
                          />
                        }
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-bold text-[#8A5A23]">
                        🐻 Ведмедик Марсель приніс знахідку:
                      </p>
                      <p className="text-xs sm:text-[13px] font-semibold leading-snug text-[#5A3E32]">
                        «Між старих книжок я знайшов потертий аркуш із легендарним напоєм засновника «Мур-Лате»! Слова майже стерлися — зберімо за 3 дні всі 3 підказки з друзями й відновимо рецепт!»
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-bold text-[#6B462B]">
                    <div className="rounded-2xl border border-[#E5C9A1] bg-[#FFF9ED] p-2.5">
                      <span className="block text-sm mb-0.5">🔍 День 1</span>
                      Діалог із Марселем і перший уривок аркуша
                    </div>
                    <div className="rounded-2xl border border-[#E5C9A1] bg-[#FFF9ED] p-2.5">
                      <span className="block text-sm mb-0.5">🦉 День 2</span>
                      Підказки від Софії та Персика + твоя назва
                    </div>
                    <div className="rounded-2xl border border-[#DFB56A] bg-[#FFF4D6] p-2.5 text-[#663E0B]">
                      <span className="block text-sm mb-0.5">⭐ День 3</span>
                      Збери рецепт у чашці й отримай +{MYSTERY_FINALE_BONUS_COINS} 🐟!
                    </div>
                  </div>

                  <button
                    type="button"
                    data-mystery-action="start"
                    onClick={onStartMystery}
                    className="w-full min-h-[46px] rounded-2xl border-2 border-[#A66B1F] border-b-4 bg-gradient-to-b from-[#FFE7A3] to-[#F2BC57] px-4 py-2.5 text-sm sm:text-base font-bold text-[#532E06] shadow-[0_6px_16px_rgba(208,144,44,0.34)] transition-all hover:brightness-105 active:translate-y-[2px] active:border-b-2"
                  >
                    🔍 Почати розслідування з Марселем!
                  </button>
                </>
              )}

              {mode === 'clues' && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#DFC092] bg-[#FFF9ED] px-3.5 py-2 text-xs font-bold text-[#6E492B]">
                    <span>
                      🔍 Прогрес: День {story.stageDay}/{MYSTERY_STORY_DAYS}
                    </span>
                    <span className="rounded-full bg-[#FFEBC0] px-2.5 py-0.5 text-[11px] text-[#6B410B]">
                      Підказок: {story.discoveredClues.length}/3
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {MYSTERY_CLUES.map((clue) => {
                      const isFound = discoveredSet.has(clue.id);
                      return (
                        <div
                          key={clue.id}
                          data-mystery-clue={clue.id}
                          data-clue-found={isFound ? 'true' : 'false'}
                          className={`rounded-2xl border-2 p-3 transition-all ${
                            isFound
                              ? 'border-[#D4A054] bg-gradient-to-br from-[#FFFDF7] to-[#FAF0D8] shadow-2xs'
                              : 'border-dashed border-[#D6BE9E] bg-[#F5ECDE]/75 opacity-80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#5A3E32]">
                              {isFound ? `${clue.finderEmoji} ${clue.title}` : `🔒 Уривок №${clue.id} — ще не знайдено`}
                            </span>
                            {isFound && (
                              <span className="rounded-full border border-[#82B892] bg-[#E5F6EA] px-2 py-0.5 text-[10px] font-bold text-[#1E5933]">
                                Знайдено ✓
                              </span>
                            )}
                          </div>

                          {isFound ? (
                            <>
                              <p className="mt-1.5 font-handwriting text-lg sm:text-xl leading-snug font-bold text-[#5A3E32]">
                                {clue.parchmentQuote}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                {clue.ingredients.map((ingId) => (
                                  <span
                                    key={ingId}
                                    className="inline-flex items-center gap-1 rounded-full border border-[#DFB97C] bg-[#FFFDF8] px-2 py-0.5 text-[10.5px] font-bold text-[#613C18]"
                                  >
                                    <IngredientIconSvg
                                      type={ingId}
                                      className="h-3.5 w-3.5"
                                    />
                                    <span>{HOT_INGREDIENT_LABELS[ingId]}</span>
                                  </span>
                                ))}
                              </div>
                            </>
                          ) : (
                            <p className="mt-1 text-[11px] font-semibold text-[#8A674C]">
                              Продовжуй пригощати гостей — {clue.finderName} принесе цю підказку!
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {story.discoveredClues.length === 3 && (
                    <div className="rounded-2xl border-2 border-[#7EB690] bg-[#ECF8EF] px-3.5 py-2.5 text-xs font-bold text-[#1F5632]">
                      ✨ Усі 3 уривки зібрано! Змішай усі 5 інгредієнтів у «☕ Кава та какао» — без еспресо — та пригости Ведмедика Марселя!
                    </div>
                  )}
                </>
              )}

              {mode === 'solved' && (
                <>
                  <div className="flex flex-col sm:flex-row items-center gap-3.5 rounded-3xl border-2 border-[#D9A143] bg-gradient-to-br from-[#FFF9E3] via-[#FFFDF8] to-[#FCEEF3] p-4 shadow-sm">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-[#E2BA72] bg-[#FFFDF8] shadow-inner">
                      <DrinkPreviewSvg
                        drink={goldenRecipe.sampleDrink}
                        className="h-22 w-22"
                      />
                    </div>
                    <div className="min-w-0 space-y-1.5 text-center sm:text-left">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#D4972C] bg-[#FFF1BE] px-2.5 py-0.5 text-[10.5px] font-bold text-[#633A08]">
                        ⭐ Легендарний рецепт відкрито!
                      </span>
                      <h3 className="font-handwriting text-2xl leading-none font-bold text-[#5A3E32]">
                        {goldenRecipe.name}
                        {day2Meta ? ` «${day2Meta.commemorativeLabel}»` : ''}
                      </h3>
                      <p className="text-xs font-semibold leading-snug text-[#6E4A33]">
                        {day1Meta
                          ? `Ти відчула ${day1Meta.commemorativeLabel} ще з першої сторінки, а разом із Марселем, Софією та Персиком повернула кав’ярні її легендарний смак!`
                          : 'Разом із Марселем, Софією та Персиком ти розгадала старовинний рецепт і повернула його у Книгу рецептів!'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {goldenRecipe.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-[#DFB56A] bg-[#FFF9EA] px-2.5 py-0.5 text-[11px] font-bold text-[#663F10]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#DFC092] bg-[#FFFDF8] px-3.5 py-2.5">
                    <div className="text-xs font-bold text-[#5A3E32]">
                      📖 Золота книга рецептів на стійці
                      <span className="block text-[10.5px] font-semibold text-[#845F43]">
                        Пам’ятний сувенір за розкриту таємницю (+25 🐟 за кожне замовлення напою!)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onToggleCounterSouvenir}
                      className={`min-h-[34px] shrink-0 rounded-full border-2 px-3 py-0.5 text-[11px] font-bold transition-colors ${
                        story.showCounterSouvenir
                          ? 'border-[#5D9B73] bg-[#E3F5E9] text-[#1D5632]'
                          : 'border-[#CBB49B] bg-[#F5ECDF] text-[#78573E]'
                      }`}
                    >
                      {story.showCounterSouvenir ? 'На стійці ✓' : 'Показати'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
