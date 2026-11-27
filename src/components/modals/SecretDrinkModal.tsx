import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  BLENDER_INGREDIENTS,
  TALL_GLASS_INGREDIENTS,
  getVisibleHotIngredients,
  secretDrinkToSample,
} from '../../data/recipes';
import { sound } from '../../services/sound';
import type {
  BlenderIngredientId,
  HotIngredientId,
  SecretDrinkRecipe,
  TallGlassIngredientId,
  UnlockableRecipeId,
} from '../../types/game';
import { DrinkPreviewSvg } from '../svg/DrinkVisualSvg';
import { BaristaCoasterSvg, IngredientIconSvg } from '../svg/UiIconsSvg';

const FUN_NAME_SUGGESTIONS = [
  'Полунична Хмаринка',
  'Золота Лапка',
  'Мур-Магія',
  'Сонячний Котик',
  'Космічний Мурчик',
  'Карамельна Зірочка',
  'Медовий Промінчик',
  'Ягідна Казка',
  'Оксамитовий Мур',
];

const BADGE_OPTIONS = [
  { icon: '⭐', color: '#E8A84C' },
  { icon: '💖', color: '#E27D9B' },
  { icon: '🌈', color: '#6FB58A' },
  { icon: '🌸', color: '#E594B0' },
  { icon: '✨', color: '#D89E43' },
  { icon: '🍓', color: '#DF6482' },
  { icon: '🐾', color: '#B57B4E' },
  { icon: '👑', color: '#DBA63E' },
];

interface SecretDrinkModalProps {
  isOpen: boolean;
  existingDrink: SecretDrinkRecipe | null;
  unlockedRecipes?: UnlockableRecipeId[];
  onClose: () => void;
  onSave: (recipe: SecretDrinkRecipe) => void;
}

export const SecretDrinkModal: React.FC<SecretDrinkModalProps> = ({
  isOpen,
  existingDrink,
  unlockedRecipes = [],
  onClose,
  onSave,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <SecretDrinkModalInner
          existingDrink={existingDrink}
          unlockedRecipes={unlockedRecipes}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </AnimatePresence>
  );
};

const SecretDrinkModalInner: React.FC<{
  existingDrink: SecretDrinkRecipe | null;
  unlockedRecipes: UnlockableRecipeId[];
  onClose: () => void;
  onSave: (recipe: SecretDrinkRecipe) => void;
}> = ({ existingDrink, unlockedRecipes, onClose, onSave }) => {
  const visibleHotIngredients = getVisibleHotIngredients(unlockedRecipes);
  const [category, setCategory] = useState<'hot' | 'cocktail' | 'milkshake'>(
    existingDrink?.category ?? 'hot'
  );
  const [hotMap, setHotMap] = useState<Partial<Record<HotIngredientId, number>>>(
    existingDrink?.category === 'hot' && existingDrink.hotIngredients
      ? { ...existingDrink.hotIngredients }
      : { cocoa: 1, warmMilk: 1, marshmallow: 1 }
  );
  const [cocktailList, setCocktailList] = useState<TallGlassIngredientId[]>(
    existingDrink?.category === 'cocktail' && existingDrink.cocktailIngredients
      ? [...existingDrink.cocktailIngredients]
      : ['ice', 'orangeJuice', 'strawberrySyrup']
  );
  const [milkshakeList, setMilkshakeList] = useState<BlenderIngredientId[]>(
    existingDrink?.category === 'milkshake' && existingDrink.milkshakeIngredients
      ? [...existingDrink.milkshakeIngredients]
      : ['coldMilk', 'iceCream', 'strawberrySyrup']
  );
  const [needsWhippedCream, setNeedsWhippedCream] = useState<boolean>(
    existingDrink?.category === 'milkshake'
      ? Boolean(existingDrink.needsWhippedCream)
      : true
  );

  const [name, setName] = useState<string>(existingDrink?.name ?? '');
  const [icon, setIcon] = useState<string>(existingDrink?.icon ?? '⭐');
  const [accentColor, setAccentColor] = useState<string>(
    existingDrink?.accentColor ?? '#E8A84C'
  );
  const [suggestionIdx, setSuggestionIdx] = useState<number>(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // Count chosen ingredients cleanly (must be 2..4)
  const totalSelectedCount =
    category === 'hot'
      ? Object.values(hotMap).reduce((sum, v) => sum + (v ?? 0), 0)
      : category === 'cocktail'
        ? cocktailList.length
        : milkshakeList.length + (needsWhippedCream ? 1 : 0);

  const isValidCount =
    totalSelectedCount >= 2 &&
    totalSelectedCount <= 4 &&
    (category !== 'milkshake' || milkshakeList.length >= 2);
  const canSave = isValidCount && name.trim().length >= 2;

  const toggleHot = (id: HotIngredientId) => {
    sound.playPop();
    setHotMap((prev) => {
      const current = prev[id] ?? 0;
      const total = Object.values(prev).reduce((s, v) => s + (v ?? 0), 0);

      if (id === 'warmMilk') {
        // Cycle 0 -> 1 -> 2 -> 0 (respecting max 4 total)
        if (current === 0) {
          if (total >= 4) return prev;
          return { ...prev, warmMilk: 1 };
        }
        if (current === 1 && total < 4) {
          return { ...prev, warmMilk: 2 };
        }
        const next = { ...prev };
        delete next.warmMilk;
        return next;
      }

      if (current > 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      if (total >= 4) return prev;
      return { ...prev, [id]: 1 };
    });
  };

  const toggleCocktail = (id: TallGlassIngredientId) => {
    sound.playPop();
    setCocktailList((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const toggleMilkshake = (id: BlenderIngredientId) => {
    sound.playPop();
    setMilkshakeList((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      return [...prev, id];
    });
  };

  const handleRandomName = () => {
    sound.playPop();
    const picked = FUN_NAME_SUGGESTIONS[suggestionIdx % FUN_NAME_SUGGESTIONS.length];
    setName(picked);
    setSuggestionIdx((i) => i + 1);
  };

  const draftRecipe: SecretDrinkRecipe = {
    name: name.trim() || 'Мій фірмовий напій',
    icon,
    accentColor,
    category,
    hotIngredients: category === 'hot' ? hotMap : undefined,
    cocktailIngredients: category === 'cocktail' ? cocktailList : undefined,
    milkshakeIngredients: category === 'milkshake' ? milkshakeList : undefined,
    needsWhippedCream: category === 'milkshake' ? needsWhippedCream : false,
  };

  const hasCaffeineWarning =
    category === 'hot' && ((hotMap.espresso ?? 0) > 0 || (hotMap.matcha ?? 0) > 0);

  const handleSaveClick = () => {
    if (!canSave) return;
    sound.playSecretSaved();
    onSave({
      ...draftRecipe,
      name: name.trim(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5A3E32]/50 sm:backdrop-blur-[2px] p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Конструктор Секретного напою дня"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="watercolor-card flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-4 border-[#C79B5C] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E3CCB0] bg-gradient-to-r from-[#FDF1D6] via-[#FAF0DF] to-[#FCECF1] px-4 sm:px-5 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl sm:text-2xl" aria-hidden="true">
              ✨
            </span>
            <div className="min-w-0">
              <h2 className="font-handwriting text-2xl sm:text-3xl leading-none font-bold text-[#5A3E32]">
                Створи свій фірмовий напій!
              </h2>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#8A654A]">
                Гості замовлятимуть твій рецепт і даруватимуть +25 🐟!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити конструктор напою дня"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#D9A2B3] bg-[#FDF0F4] text-base font-bold text-[#8E3C55] hover:bg-[#F7D7E0]"
          >
            ✕
          </button>
        </div>

        {/* Scrollable 3-Step Content */}
        <div className="cozy-scroll flex-1 overflow-y-auto p-3.5 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Left 8 cols: Steps 1, 2, 3 */}
            <div className="md:col-span-8 flex flex-col gap-3">
              {/* Step 1: Type & Vessel */}
              <div className="barista-tray-recess rounded-2xl border-2 border-[#B9916B] p-2.5">
                <span className="block text-[11px] font-bold text-[#6A452C] mb-1.5">
                  Крок 1. Обери основу й посуд:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'hot' as const, label: '☕ Гарячий напій' },
                      { id: 'cocktail' as const, label: '🍹 Коктейль' },
                      { id: 'milkshake' as const, label: '🍓 Мілкшейк' },
                    ] as const
                  ).map((opt) => {
                    const active = category === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setCategory(opt.id);
                          sound.playPop();
                        }}
                        className="barista-tile min-h-[40px] rounded-xl px-2 py-1 text-[11px] sm:text-xs font-bold text-[#4D3224]"
                        style={{
                          backgroundImage: active
                            ? 'linear-gradient(155deg, #FEF0CC 0%, #F4D28A 100%)'
                            : 'linear-gradient(155deg, #FFFDF8 0%, #F4E6CE 100%)',
                          borderColor: active ? '#A36F24' : '#8B654B',
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Real Station Ingredients (2 to 4) */}
              <div className="barista-tray-recess rounded-2xl border-2 border-[#B9916B] p-2.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold text-[#6A452C]">
                    Крок 2. Обери від 2 до 4 інгредієнтів:
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isValidCount
                        ? 'bg-[#DDF2E4] text-[#1E5D38]'
                        : 'bg-[#FCE9EF] text-[#8E3C55]'
                    }`}
                  >
                    Обрано: {totalSelectedCount} / 4
                  </span>
                </div>

                {category === 'hot' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {visibleHotIngredients.map((item) => {
                      const count = hotMap[item.id] ?? 0;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleHot(item.id)}
                          className="barista-tile relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-center"
                          style={{
                            backgroundImage: item.buttonGradient,
                            borderColor: count > 0 ? '#3F8058' : item.buttonBorder,
                          }}
                        >
                          {count > 0 && (
                            <span className="absolute right-1 top-0.5 rounded-full bg-[#A7DCB8] px-1 text-[9px] font-bold text-[#174A2C]">
                              {count > 1 ? `×${count}` : '✓'}
                            </span>
                          )}
                          <IngredientIconSvg type={item.id} className="h-6 w-6" />
                          <span className="text-[10px] font-bold leading-tight text-[#4D3224]">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {category === 'cocktail' && (
                  <div className="grid grid-cols-3 gap-1.5">
                    {TALL_GLASS_INGREDIENTS.map((item) => {
                      const added = cocktailList.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleCocktail(item.id)}
                          className="barista-tile relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-center"
                          style={{
                            backgroundImage: item.buttonGradient,
                            borderColor: added ? '#3F8058' : item.buttonBorder,
                          }}
                        >
                          {added && (
                            <span className="absolute right-1 top-0.5 rounded-full bg-[#A7DCB8] px-1 text-[9px] font-bold text-[#174A2C]">
                              ✓
                            </span>
                          )}
                          <IngredientIconSvg type={item.id} className="h-6 w-6" />
                          <span className="text-[10px] font-bold leading-tight text-[#4D3224]">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {category === 'milkshake' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {BLENDER_INGREDIENTS.map((item) => {
                      const added = milkshakeList.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleMilkshake(item.id)}
                          className="barista-tile relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-center"
                          style={{
                            backgroundImage: item.buttonGradient,
                            borderColor: added ? '#3F8058' : item.buttonBorder,
                          }}
                        >
                          {added && (
                            <span className="absolute right-1 top-0.5 rounded-full bg-[#A7DCB8] px-1 text-[9px] font-bold text-[#174A2C]">
                              ✓
                            </span>
                          )}
                          <IngredientIconSvg type={item.id} className="h-6 w-6" />
                          <span className="text-[10px] font-bold leading-tight text-[#4D3224]">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        setNeedsWhippedCream((v) => !v);
                        sound.playPop();
                      }}
                      className="barista-tile relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-center"
                      style={{
                        backgroundImage:
                          'linear-gradient(155deg, #FFFDF8 0%, #F7E8D0 100%)',
                        borderColor: needsWhippedCream ? '#3F8058' : '#A98444',
                      }}
                    >
                      {needsWhippedCream && (
                        <span className="absolute right-1 top-0.5 rounded-full bg-[#A7DCB8] px-1 text-[9px] font-bold text-[#174A2C]">
                          ✓
                        </span>
                      )}
                      <IngredientIconSvg type="whippedCream" className="h-6 w-6" />
                      <span className="text-[10px] font-bold leading-tight text-[#4D3224]">
                        Збиті вершки
                      </span>
                    </button>
                  </div>
                )}

                {hasCaffeineWarning && (
                  <p className="mt-1.5 text-[10px] font-semibold text-[#8C5B36]">
                    ℹ️ У рецепті є Еспресо або Матча — його замовлятимуть дорослі гості (Кошеня Пух каву й міцний чай не п’є!).
                  </p>
                )}
              </div>

              {/* Step 3: Name & Icon Badge */}
              <div className="barista-tray-recess rounded-2xl border-2 border-[#B9916B] p-2.5">
                <span className="block text-[11px] font-bold text-[#6A452C] mb-1.5">
                  Крок 3. Придумай назву та значок:
                </span>
                <div className="flex flex-col sm:flex-row gap-1.5">
                  <input
                    type="text"
                    value={name}
                    maxLength={28}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Наприклад: Космічний Мурчик"
                    className="min-h-[40px] flex-1 rounded-xl border-2 border-[#B38961] bg-[#FFFDF8] px-3 py-1 text-xs sm:text-sm font-bold text-[#4D3224] placeholder:text-[#B4977E] focus:border-[#7A523B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRandomName}
                    className="barista-tile min-h-[40px] rounded-xl px-3 py-1 text-xs font-bold text-[#5A3E32] whitespace-nowrap"
                    style={{
                      backgroundImage:
                        'linear-gradient(155deg, #FEF4D6 0%, #F4D38B 100%)',
                    }}
                  >
                    🎲 Придумати назву
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10.5px] font-bold text-[#6A452C]">
                    Значок:
                  </span>
                  {BADGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.icon}
                      type="button"
                      onClick={() => {
                        setIcon(opt.icon);
                        setAccentColor(opt.color);
                        sound.playPop();
                      }}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-base transition-transform hover:scale-110 active:scale-95 ${
                        icon === opt.icon
                          ? 'border-[#5A3E32] bg-[#FEF0CC] scale-105 shadow-xs'
                          : 'border-[#D4B898] bg-[#FFFDF8]'
                      }`}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 cols: Live Real-Time Preview Card */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="barista-linen-mat flex w-full flex-col items-center justify-between gap-2 rounded-3xl border-2 border-[#A67C52] p-3.5 text-center">
                <span
                  className="inline-flex items-center gap-1 rounded-full border-2 px-3 py-0.5 text-[11px] font-bold text-[#5A3E32]"
                  style={{
                    borderColor: accentColor,
                    backgroundColor: '#FFF8E6',
                  }}
                >
                  <span>{icon}</span>
                  <span>Напій дня</span>
                </span>

                <div className="relative my-2 flex items-center justify-center pb-1">
                  <BaristaCoasterSvg
                    tint={category === 'hot' ? 'cream' : 'sage'}
                    className="pointer-events-none absolute -bottom-1 w-32 h-7"
                  />
                  <DrinkPreviewSvg
                    drink={secretDrinkToSample(draftRecipe)}
                    className="relative z-10 h-32 w-32"
                  />
                </div>

                <h3 className="font-handwriting text-2xl leading-tight font-bold text-[#4F3323] break-words max-w-full">
                  {icon} {name.trim() || 'Твоя назва...'}
                </h3>

                <p className="text-[10.5px] font-semibold text-[#856248]">
                  Станція:{' '}
                  <strong className="text-[#5A3E32]">
                    {category === 'hot'
                      ? 'Кава та какао'
                      : category === 'cocktail'
                        ? 'Дитячі коктейлі (Келих)'
                        : 'Дитячі коктейлі (Блендер)'}
                  </strong>
                </p>

                <span className="rounded-full bg-[#FDF0CE] border border-[#DFB35C] px-2.5 py-0.5 text-[10.5px] font-bold text-[#7C5016]">
                  Нагорода гостя: +25 🐟
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t-2 border-[#E3CCB0] bg-[#FAF0DF] px-4 sm:px-5 py-2.5">
          <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#7A5337]">
            {!isValidCount
              ? 'Обери від 2 до 4 інгредієнтів'
              : name.trim().length < 2
                ? 'Введи назву напою або натисни 🎲'
                : 'Готово! Рецепт з’явиться в Книзі рецептів і на дошці!'}
          </span>

          <button
            type="button"
            disabled={!canSave}
            onClick={handleSaveClick}
            className={`min-h-[42px] rounded-2xl border-2 px-5 py-1.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              canSave
                ? 'border-[#9B6822] border-b-4 bg-gradient-to-b from-[#F7D37A] to-[#E2A53E] text-[#45280A] shadow-[0_4px_14px_rgba(218,162,62,0.4)] hover:brightness-105 active:translate-y-[2px] active:border-b-2'
                : 'border-[#D1BFA9] border-b-[3px] bg-[#EFE5D7] text-[#AC9884] cursor-not-allowed'
            }`}
          >
            ✨ Зберегти напій дня!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
