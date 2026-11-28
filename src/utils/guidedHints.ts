import {
  BLENDER_INGREDIENT_LABELS,
  DRINK_RECIPES,
  HOT_INGREDIENT_LABELS,
  PASTRY_RECIPES,
  TALL_INGREDIENT_LABELS,
  getOrderDrinkTab,
  hasHotIngredients,
  hasTallIngredients,
} from '../data/recipes.ts';
import type {
  BlenderIngredientId,
  DonutGlaze,
  GuestEmotion,
  HotIngredientId,
  Order,
  PreparedDrink,
  PreparedPastry,
  StationTab,
  TallGlassIngredientId,
} from '../types/game';

export interface GuidedHintInput {
  order: Order;
  emotion: GuestEmotion;
  isWorkbenchOpen: boolean;
  activeTab: StationTab;
  trayDrink: PreparedDrink | null;
  trayPastry: PreparedPastry | null;
  hotIngredients: Partial<Record<HotIngredientId, number>>;
  coldGlassMode: 'empty' | 'cocktail' | 'milkshake';
  cocktailIngredients: Partial<Record<TallGlassIngredientId, number>>;
  blenderIngredients: Partial<Record<BlenderIngredientId, number>>;
  whippedCream: boolean;
  selectedPastry: PreparedPastry | null;
}

export interface GuidedHintState {
  hallText: string;
  stationText: string | null;
  highlightTab: StationTab | null;
  highlightHotIngredients: HotIngredientId[];
  highlightCocktailIngredients: TallGlassIngredientId[];
  highlightBlenderIngredients: BlenderIngredientId[];
  highlightBlendButton: boolean;
  highlightWhippedCream: boolean;
  highlightPastryBase: PreparedPastry['type'] | null;
  highlightWarmCroissant: boolean;
  highlightDonutGlaze: DonutGlaze | null;
  highlightDonutSprinkles: boolean;
  highlightPutOnTray: boolean;
  highlightClear: boolean;
  highlightServe: boolean;
}

const TAB_NAMES: Record<StationTab, string> = {
  hot: '☕ Кава',
  cold: '🍹 Коктейлі',
  pastry: '🥐 Випічка',
};

function emptyHint(hallText: string): GuidedHintState {
  return {
    hallText,
    stationText: null,
    highlightTab: null,
    highlightHotIngredients: [],
    highlightCocktailIngredients: [],
    highlightBlenderIngredients: [],
    highlightBlendButton: false,
    highlightWhippedCream: false,
    highlightPastryBase: null,
    highlightWarmCroissant: false,
    highlightDonutGlaze: null,
    highlightDonutSprinkles: false,
    highlightPutOnTray: false,
    highlightClear: false,
    highlightServe: false,
  };
}

/**
 * Computes a warm, single-step Ukrainian guided hint for young players based on the
 * live order, tray items, active workbench tab, and partially prepared cup/glass/plate.
 */
export function computeGuidedHint(input: GuidedHintInput): GuidedHintState {
  const {
    order,
    emotion,
    isWorkbenchOpen,
    activeTab,
    trayDrink,
    trayPastry,
    hotIngredients,
    coldGlassMode,
    cocktailIngredients,
    blenderIngredients,
    whippedCream,
    selectedPastry,
  } = input;

  if (emotion === 'happy') {
    return emptyHint('✨ Ура! Натисни «Наступний гість →»!');
  }

  // Traveler Cat accepts any single drink or pastry on the tray
  if (order.isTravelerGuest) {
    if (trayDrink || trayPastry) {
      return {
        ...emptyHint('🛎️ Смаколик на таці! Натисни «Подати!»'),
        highlightServe: true,
      };
    }
    const preferredTab: StationTab =
      order.travelerWishCategory === 'cold'
        ? 'cold'
        : order.travelerWishCategory === 'pastry'
          ? 'pastry'
          : 'hot';
    if (!isWorkbenchOpen) {
      return {
        ...emptyHint(
          `👇 Відкрий «${TAB_NAMES[preferredTab]}» і приготуй будь-який смаколик!`
        ),
        highlightTab: preferredTab,
      };
    }
    const readyNow =
      (activeTab === 'hot' && hasHotIngredients(hotIngredients)) ||
      (activeTab === 'cold' &&
        ((coldGlassMode === 'cocktail' && hasTallIngredients(cocktailIngredients)) ||
          coldGlassMode === 'milkshake')) ||
      (activeTab === 'pastry' && Boolean(selectedPastry));
    return {
      ...emptyHint(
        readyNow
          ? '✅ Натисни «✓ На тацю», а потім «🛎️ Подати!»'
          : '💡 Мандрівник радий будь-якому частуванню — додай інгредієнти!'
      ),
      stationText: readyNow
        ? '✅ Натисни зелену кнопку «✓ На тацю»!'
        : '💛 Обери будь-що смачненьке!',
      highlightPutOnTray: readyNow,
    };
  }

  const needsDrink = !trayDrink;
  const needsPastry = Boolean(order.isCombo && order.pastryId && !trayPastry);

  // Everything required is already on the tray → Serve!
  if (!needsDrink && !needsPastry) {
    return {
      ...emptyHint('🛎️ Усе готово! Натисни рожеву кнопку «Подати!»'),
      stationText: '🛎️ Усе на таці — подавай гостю!',
      highlightServe: true,
    };
  }

  const targetTab: StationTab = needsDrink ? getOrderDrinkTab(order) : 'pastry';

  // Workbench closed → invite the child to open the needed station
  if (!isWorkbenchOpen) {
    const stepPrefix = !needsDrink && needsPastry ? 'Тепер десерт' : 'Крок 1';
    return {
      ...emptyHint(
        `👇 ${stepPrefix}: натисни «${TAB_NAMES[targetTab]}» внизу!`
      ),
      highlightTab: targetTab,
    };
  }

  // Open on the wrong tab → gently point to the needed tab
  if (activeTab !== targetTab) {
    return {
      ...emptyHint(`👉 Перемкни вкладку внизу на «${TAB_NAMES[targetTab]}»!`),
      stationText: `👉 Перейди у «${TAB_NAMES[targetTab]}»`,
      highlightTab: targetTab,
    };
  }

  // --- HOT DRINKS GUIDANCE ---
  if (targetTab === 'hot') {
    const required: Partial<Record<HotIngredientId, number>> =
      order.drinkId === 'secret_daily'
        ? (order.secretDrink?.hotIngredients ?? {})
        : order.drinkId !== 'traveler_any'
          ? (DRINK_RECIPES[order.drinkId].hotIngredients ?? {})
          : {};

    const missingIds: HotIngredientId[] = [];
    const missingLabels: string[] = [];
    let hasWrongExtra = false;

    for (const [id, rawCount] of Object.entries(hotIngredients) as [
      HotIngredientId,
      number,
    ][]) {
      if (rawCount <= 0) continue;
      const reqCount = required[id] ?? 0;
      if (rawCount > reqCount) {
        hasWrongExtra = true;
      }
    }

    for (const [id, reqCount] of Object.entries(required) as [
      HotIngredientId,
      number,
    ][]) {
      if (!reqCount || reqCount <= 0) continue;
      const cur = hotIngredients[id] ?? 0;
      if (cur < reqCount) {
        missingIds.push(id);
        const needMore = reqCount - cur;
        missingLabels.push(
          needMore > 1
            ? `${HOT_INGREDIENT_LABELS[id]} ×${needMore}`
            : HOT_INGREDIENT_LABELS[id]
        );
      }
    }

    if (hasWrongExtra) {
      return {
        ...emptyHint('💡 У чашці є зайве — натисни «Вилити» і спробуй ще раз!'),
        stationText: '💡 Натисни «Вилити» і спробуй ще раз',
        highlightClear: true,
      };
    }

    if (missingIds.length === 0) {
      return {
        ...emptyHint('✅ Напій готовий! Натисни зелену кнопку «✓ На тацю»!'),
        stationText: '✅ Готово! Натисни «✓ На тацю»',
        highlightPutOnTray: true,
      };
    }

    const list = missingLabels.join(' + ');
    const prefix =
      order.mysteryRole === 'mystery_day3_finale'
        ? '🔍 Підказка детектива: додай у чашку'
        : '👉 Додай у чашку';
    return {
      ...emptyHint(`${prefix}: ${list}`),
      stationText: `👉 Додай: ${list}`,
      highlightHotIngredients: missingIds,
    };
  }

  // --- COLD DRINKS GUIDANCE ---
  if (targetTab === 'cold') {
    const coldSpec =
      order.drinkId === 'secret_daily'
        ? (order.secretDrink ?? null)
        : order.drinkId !== 'traveler_any'
          ? DRINK_RECIPES[order.drinkId]
          : null;
    const isMilkshake = coldSpec?.category === 'milkshake';

    if (isMilkshake && coldSpec) {
      const reqList: BlenderIngredientId[] = coldSpec.milkshakeIngredients ?? [];
      if (coldGlassMode === 'milkshake') {
        if (coldSpec.needsWhippedCream && !whippedCream) {
          return {
            ...emptyHint('👉 Натисни «Збиті вершки», щоб прикрасити мілкшейк!'),
            stationText: '👉 Додай «Збиті вершки»!',
            highlightWhippedCream: true,
          };
        }
        return {
          ...emptyHint('✅ Мілкшейк готовий! Натисни «✓ На тацю»!'),
          stationText: '✅ Готово! Натисни «✓ На тацю»',
          highlightPutOnTray: true,
        };
      }

      const missingBlender = reqList.filter(
        (id) => (blenderIngredients[id] ?? 0) <= 0
      );
      if (missingBlender.length > 0) {
        const list = missingBlender
          .map((id) => BLENDER_INGREDIENT_LABELS[id])
          .join(' + ');
        return {
          ...emptyHint(`👉 Додай у блендер: ${list}`),
          stationText: `👉 У блендер: ${list}`,
          highlightBlenderIngredients: missingBlender,
        };
      }

      return {
        ...emptyHint('👉 Усе в блендері! Натисни «🌀 Збити!»'),
        stationText: '👉 Натисни «🌀 Збити!»',
        highlightBlendButton: true,
      };
    }

    // Tall glass cocktail (or cold secret drink)
    const reqCocktail: TallGlassIngredientId[] = coldSpec?.cocktailIngredients ?? [];

    if (coldGlassMode === 'milkshake') {
      return {
        ...emptyHint('💡 Потрібен коктейль — натисни «Очистити» і збери в келиху!'),
        stationText: '💡 Натисни «Очистити» для коктейлю',
        highlightClear: true,
      };
    }

    const reqSet = new Set(reqCocktail);
    const hasWrongCocktail = (
      Object.entries(cocktailIngredients) as [TallGlassIngredientId, number][]
    ).some(([id, count]) => count > 0 && !reqSet.has(id));

    if (hasWrongCocktail) {
      return {
        ...emptyHint('💡 У келиху є зайве — натисни «Очистити» і спробуй ще раз!'),
        stationText: '💡 Натисни «Очистити» і спробуй ще раз',
        highlightClear: true,
      };
    }

    const missingCocktail = reqCocktail.filter(
      (id) => (cocktailIngredients[id] ?? 0) <= 0
    );
    if (missingCocktail.length === 0) {
      return {
        ...emptyHint('✅ Коктейль готовий! Натисни «✓ На тацю»!'),
        stationText: '✅ Готово! Натисни «✓ На тацю»',
        highlightPutOnTray: true,
      };
    }

    const list = missingCocktail
      .map((id) => TALL_INGREDIENT_LABELS[id])
      .join(' + ');
    return {
      ...emptyHint(`👉 Додай у келих: ${list}`),
      stationText: `👉 У келих: ${list}`,
      highlightCocktailIngredients: missingCocktail,
    };
  }

  // --- PASTRY GUIDANCE ---
  if (order.pastryId) {
    const expected = PASTRY_RECIPES[order.pastryId].expected;

    if (!selectedPastry || selectedPastry.type !== expected.type) {
      const baseNames: Record<PreparedPastry['type'], string> = {
        croissant: 'Круасан',
        cookie: 'Печиво з шоколадом',
        donut: 'Пончик',
        carrot_cake: 'Морквяний кекс',
      };
      return {
        ...emptyHint(`👉 Обери у вітрині: «${baseNames[expected.type]}»!`),
        stationText: `👉 Обери: ${baseNames[expected.type]}`,
        highlightPastryBase: expected.type,
      };
    }

    if (expected.type === 'croissant' && selectedPastry.type === 'croissant') {
      if (expected.warmed && !selectedPastry.warmed) {
        return {
          ...emptyHint('👉 Натисни «🔥 Підігріти в пічці», щоб круасан став теплим!'),
          stationText: '👉 Натисни «🔥 Підігріти в пічці»',
          highlightWarmCroissant: true,
        };
      }
      if (!expected.warmed && selectedPastry.warmed) {
        return {
          ...emptyHint('💡 Гість хотів звичайний круасан — натисни «Очистити»!'),
          stationText: '💡 Натисни «Очистити» і візьми круасан',
          highlightClear: true,
        };
      }
    }

    if (expected.type === 'donut' && selectedPastry.type === 'donut') {
      if (selectedPastry.glaze !== expected.glaze) {
        const glazeName =
          expected.glaze === 'pink' ? 'Рожева полунична' : 'Шоколадна';
        return {
          ...emptyHint(`👉 Обери глазур: «${glazeName}»!`),
          stationText: `👉 Глазур: ${glazeName}`,
          highlightDonutGlaze: expected.glaze,
        };
      }
      if (expected.sprinkles !== selectedPastry.sprinkles) {
        return {
          ...emptyHint(
            expected.sprinkles
              ? '👉 Додай «✨ Кольорова посипка»!'
              : '💡 Зніми посипку, щоб пончик був без неї!'
          ),
          stationText: expected.sprinkles
            ? '👉 Додай «Кольорова посипка»'
            : '💡 Прибери посипку',
          highlightDonutSprinkles: true,
        };
      }
    }

    return {
      ...emptyHint('✅ Десерт готовий! Натисни «✓ На тацю»!'),
      stationText: '✅ Готово! Натисни «✓ На тацю»',
      highlightPutOnTray: true,
    };
  }

  return emptyHint('💡 Обери інгредієнти й натисни «✓ На тацю»!');
}
