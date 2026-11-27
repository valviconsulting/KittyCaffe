import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  DRINK_RECIPES,
  RECIPE_BOOK_PASTRY_CARDS,
  secretDrinkToBadges,
  secretDrinkToSample,
} from '../../data/recipes';
import type {
  SecretDrinkRecipe,
  StationTab,
  UnlockableRecipeId,
} from '../../types/game';
import { DrinkPreviewSvg } from '../svg/DrinkVisualSvg';
import { PastrySvg } from '../svg/PastryVisualSvg';

interface RecipeBookModalProps {
  isOpen: boolean;
  initialTab?: StationTab;
  secretDrink: SecretDrinkRecipe | null;
  unlockedRecipes?: UnlockableRecipeId[];
  onClose: () => void;
  onOpenSecretCreator: () => void;
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({
  isOpen,
  initialTab = 'hot',
  secretDrink,
  unlockedRecipes = [],
  onClose,
  onOpenSecretCreator,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <RecipeBookModalInner
          initialTab={initialTab}
          secretDrink={secretDrink}
          unlockedRecipes={unlockedRecipes}
          onClose={onClose}
          onOpenSecretCreator={onOpenSecretCreator}
        />
      )}
    </AnimatePresence>
  );
};

const RecipeBookModalInner: React.FC<{
  initialTab: StationTab;
  secretDrink: SecretDrinkRecipe | null;
  unlockedRecipes: UnlockableRecipeId[];
  onClose: () => void;
  onOpenSecretCreator: () => void;
}> = ({ initialTab, secretDrink, unlockedRecipes, onClose, onOpenSecretCreator }) => {
  const [tab, setTab] = useState<StationTab>(initialTab);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const hotRecipes = Object.values(DRINK_RECIPES).filter(
    (r) =>
      r.bookTab === 'hot' &&
      (!r.unlockableId || unlockedRecipes.includes(r.unlockableId))
  );
  const coldRecipes = Object.values(DRINK_RECIPES).filter(
    (r) => r.bookTab === 'cold'
  );
  const pastryCards = RECIPE_BOOK_PASTRY_CARDS.filter(
    (c) => !c.unlockableId || unlockedRecipes.includes(c.unlockableId)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5A3E32]/45 sm:backdrop-blur-[2px] p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Книга рецептів Мур-Лате"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="watercolor-notebook relative flex h-[94dvh] sm:h-auto sm:max-h-[88dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl sm:rounded-[2rem] border-4 border-[#CFA982] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative watercolor ribbon bookmark */}
        <div className="pointer-events-none hidden sm:block absolute right-16 top-0 h-8 w-5 rounded-b-md bg-[#E998AE] opacity-85 shadow-xs" />

        {/* Notebook Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E6D1B8] bg-[#FAF1E2]/95 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="text-xl sm:text-2xl shrink-0" aria-hidden="true">
              📖
            </span>
            <div className="min-w-0">
              <h2 className="font-handwriting text-xl sm:text-3xl leading-none font-bold text-[#5A3E32]">
                Книга рецептів «Мур-Лате»
              </h2>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#8C684F] mt-0.5">
                Порядок інгредієнтів у чашці й келиху не важливий (мілкшейк збиваємо перед вершками, круасан гріємо в пічці)!
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            aria-label="Закрити книгу рецептів"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#E0ACBC] bg-[#FDF0F4] text-lg font-bold text-[#914059] hover:bg-[#F7D7E0]"
          >
            ✕
          </motion.button>
        </div>

        {/* 3 Watercolor Notebook Tabs — always 1 clean row with zero horizontal scrollbar */}
        <div className="flex shrink-0 gap-1.5 sm:gap-2 border-b-2 border-[#EBD8C3] bg-[#F8EFE0]/90 px-3 sm:px-6 py-2">
          {(
            [
              { id: 'hot', short: '☕ Кава', label: '☕ Кава та какао' },
              { id: 'cold', short: '🍹 Коктейлі', label: '🍹 Коктейлі' },
              { id: 'pastry', short: '🥐 Випічка', label: '🥐 Випічка' },
            ] as const
          ).map((t) => (
            <motion.button
              key={t.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setTab(t.id)}
              className={`min-h-[40px] flex-1 sm:flex-none rounded-full border-2 px-2 sm:px-4 py-1 text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-[#CCA06E] bg-[#FBE8CE] text-[#5A3E32] shadow-xs'
                  : 'border-transparent bg-[#FFFDF8]/80 text-[#8D684E] hover:bg-[#FAF0DF]'
              }`}
            >
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Scrollable Watercolor Recipe Cards */}
        <div className="cozy-scroll flex-1 overflow-y-auto p-3.5 sm:p-5">
          {/* Highlighted Signature Secret Drink of the Day Card */}
          <div className="mb-4 rounded-3xl border-2 border-[#D9A143] bg-gradient-to-r from-[#FFF7DF] via-[#FCF0D2] to-[#FCEBF1] p-3.5 shadow-sm">
            {secretDrink ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#E5C27D] bg-[#FFFDF8]">
                  <DrinkPreviewSvg
                    drink={secretDrinkToSample(secretDrink)}
                    className="h-18 w-18"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 min-w-0 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                    <h3 className="font-handwriting text-2xl leading-none font-bold text-[#6A400B]">
                      ⭐ Фірмовий напій дня: {secretDrink.icon} {secretDrink.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSecretCreator();
                      }}
                      className="rounded-full border border-[#C99441] bg-[#FFFDF8] px-2.5 py-0.5 text-[10.5px] font-bold text-[#6E4410] hover:bg-[#FDF0CE]"
                    >
                      ✏️ Змінити
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                    {secretDrinkToBadges(secretDrink).map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-[#DFB25C] bg-[#FFFDF8] px-2.5 py-0.5 text-[10.5px] font-bold text-[#6B4212]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10.5px] font-semibold text-[#845C2E]">
                    Станція:{' '}
                    {secretDrink.category === 'hot'
                      ? '☕ Кава та какао'
                      : secretDrink.category === 'cocktail'
                        ? '🍹 Дитячі коктейлі (Високий келих)'
                        : '🍓 Дитячі коктейлі (Блендер)'}{' '}
                    • Нагорода: +25 🐟!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="text-center sm:text-left">
                  <h3 className="font-handwriting text-2xl leading-none font-bold text-[#6A400B]">
                    ⭐ Фірмовий напій дня ще не створено!
                  </h3>
                  <p className="text-[11px] font-semibold text-[#845C2E] mt-0.5">
                    Придумай власний секретний рецепт — гості платитимуть за нього +25 🐟!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSecretCreator();
                  }}
                  className="barista-tile min-h-[38px] shrink-0 rounded-full px-4 py-1 text-xs font-bold text-[#4D2E0B]"
                  style={{
                    backgroundImage:
                      'linear-gradient(155deg, #FFF3CC 0%, #F2C96B 100%)',
                    borderColor: '#A67224',
                  }}
                >
                  ✨ Створити напій дня
                </button>
              </div>
            )}
          </div>
          {tab === 'hot' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {hotRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="watercolor-card flex gap-3 rounded-3xl border-2 border-[#E5CEB4] p-3.5"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#FAF2E4]">
                    <DrinkPreviewSvg drink={recipe.sampleDrink} className="h-18 w-18" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-1.5 min-w-0">
                    <h3 className="font-handwriting text-xl leading-none font-bold text-[#5A3E32]">
                      {recipe.name}
                    </h3>

                    <div className="flex flex-wrap gap-1">
                      {recipe.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            badge.startsWith('2×')
                              ? 'bg-[#FCE5B3] text-[#764814] border border-[#DEAE59]'
                              : 'bg-[#F5E9D8] text-[#66442D]'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {recipe.specialTip && (
                      <p className="rounded-xl bg-[#FCF2D8] px-2.5 py-1 text-[10px] font-bold text-[#85531D]">
                        ⭐ {recipe.specialTip}
                      </p>
                    )}

                    <p className="text-[10.5px] leading-snug text-[#7D5D48]">
                      <strong className="text-[#5A3E32]">Цікавий факт:</strong>{' '}
                      {recipe.funFact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'cold' && (
            <div className="grid grid-cols-1 gap-3.5">
              {coldRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="watercolor-card flex items-center gap-4 rounded-3xl border-2 border-[#C2DEC9] p-4"
                >
                  <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#EDF7F0]">
                    <DrinkPreviewSvg drink={recipe.sampleDrink} className="h-22 w-18" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <h3 className="font-handwriting text-2xl leading-none font-bold text-[#2D5E3F]">
                      {recipe.name}
                    </h3>

                    <div className="flex flex-wrap gap-1.5">
                      {recipe.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full bg-[#E5F4E9] border border-[#B5D7BF] px-2.5 py-0.5 text-[11px] font-bold text-[#265B3B]"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {recipe.specialTip && (
                      <p className="rounded-xl bg-[#FDF0F4] px-2.5 py-1 text-[11px] font-bold text-[#8C3B54]">
                        ⭐ {recipe.specialTip}
                      </p>
                    )}

                    <p className="text-[11px] leading-snug text-[#547560]">
                      <strong className="text-[#2D5E3F]">Цікавий факт:</strong>{' '}
                      {recipe.funFact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'pastry' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {pastryCards.map((card) => (
                <div
                  key={card.id}
                  className="watercolor-card flex gap-3 rounded-3xl border-2 border-[#EBC4D0] p-3.5"
                >
                  <div className="flex h-20 w-22 shrink-0 items-center justify-center rounded-2xl bg-[#FCF0F4]">
                    <PastrySvg pastry={card.sample} showPlate={true} className="h-18 w-20" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <h3 className="font-handwriting text-xl leading-none font-bold text-[#7F364C]">
                      {card.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {card.badges.map((b) => (
                        <span
                          key={b}
                          className="rounded-full bg-[#FBE9EF] border border-[#EBC0CD] px-2.5 py-0.5 text-[10px] font-bold text-[#863B52]"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10.5px] leading-snug text-[#7F5A66]">
                      <strong className="text-[#6F3346]">Цікавий факт:</strong>{' '}
                      {card.funFact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
