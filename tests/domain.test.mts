import assert from 'node:assert/strict';
import {
  BEST_FRIEND_THRESHOLD,
  GUESTS,
  buildOrderGreeting,
  generateOrder,
  isBestFriend,
} from '../src/data/guests.ts';
import {
  DRINK_RECIPES,
  PASTRY_RECIPES,
  canDoLatteArt,
  getVisibleHotIngredients,
  secretDrinkHasCaffeine,
  secretDrinkHasEspresso,
  validateOrder,
} from '../src/data/recipes.ts';
import {
  CAFE_DECOR_ITEMS,
  MARZIPAN_WARDROBE,
  UNLOCKABLE_RECIPES,
} from '../src/data/shop.ts';
import {
  BASE_STICKER_CATALOG,
  RARE_STICKER_CATALOG,
  RARE_STICKER_ORDER,
} from '../src/data/stickers.ts';
import {
  DEFAULT_SAVE_STATE,
  exportSaveJson,
  importSaveJson,
  parseAndSanitizeSave,
  sanitizeSecretDrink,
} from '../src/services/storage.ts';
import {
  MILK_POUR_DURATION_PER_PORTION_MS,
  MILK_POUR_HOLD_THRESHOLD_MS,
  MILK_POUR_NOTCH_MS,
  advanceMilkPour,
  resolveMilkPourRelease,
} from '../src/utils/milkPour.ts';
import type { SecretDrinkRecipe } from '../src/types/game.ts';

// 1. Hot ingredients: 7 base slots, 8th slot unlocks Matcha without adding a 3rd row
assert.equal(getVisibleHotIngredients([]).length, 7);
assert.equal(getVisibleHotIngredients(['matcha_latte']).length, 8);
assert.equal(getVisibleHotIngredients(['matcha_latte'])[7].id, 'matcha');

// 2. Order-independent hot drink validation & Latte Art eligibility
assert.equal(canDoLatteArt({ espresso: 1 }), false);
assert.equal(canDoLatteArt({ foam: 1 }), true);
assert.equal(canDoLatteArt({ warmMilk: 1, cocoa: 1 }), true);
assert.equal(canDoLatteArt({ warmMilk: 2, espresso: 1 }), true);
assert.equal(canDoLatteArt({ warmMilk: 1, matcha: 1 }), true);

// 3. Puff no-espresso Easter egg (both standard and secret drinks)
const puhOrder = generateOrder(1, 'sunny');
assert.equal(puhOrder.guestId, 'puh');
const puhEspressoCheck = validateOrder(
  puhOrder,
  { category: 'hot', ingredients: { espresso: 1 } },
  null
);
assert.equal(puhEspressoCheck.ok, false);
assert.equal(puhEspressoCheck.isPuhCoffeeReject, true);

const espressoSecret: SecretDrinkRecipe = {
  name: 'Кавова Казка',
  icon: '⭐',
  accentColor: '#E8A84C',
  category: 'hot',
  hotIngredients: { espresso: 1, warmMilk: 1 },
};
assert.equal(secretDrinkHasEspresso(espressoSecret), true);
for (let i = 0; i < 25; i++) {
  const secretOrder = generateOrder(10 + i, 'rainy', undefined, {
    secretDrink: espressoSecret,
    forceSecretDrink: true,
  });
  assert.notEqual(secretOrder.guestId, 'puh');
}

// 4. Take-away packaging enforcement
const takeawayOrder = generateOrder(4, 'sunny');
assert.equal(takeawayOrder.serviceMode, 'takeaway');
const unpackedRes = validateOrder(
  takeawayOrder,
  DRINK_RECIPES.kids_mojito.sampleDrink,
  null
);
assert.equal(unpackedRes.ok, false);
const packedRes = validateOrder(
  takeawayOrder,
  {
    ...DRINK_RECIPES.kids_mojito.sampleDrink,
    takeaway: { stickers: [], wishText: 'Гарного дня!' },
  },
  null
);
assert.equal(packedRes.ok, true);

// 5. Unlockable Matcha-Latte & Carrot Cake recipes
const matchaOrder = generateOrder(9, 'rainy', 'puh', {
  unlockedRecipes: ['matcha_latte'],
  forceUnlockedRecipe: 'matcha_latte',
});
assert.equal(matchaOrder.drinkId, 'matcha_latte');
assert.ok(buildOrderGreeting(matchaOrder, 'Матча-Лате', 'rainy').includes('Матча-Лате'));
assert.equal(
  validateOrder(
    matchaOrder,
    { category: 'hot', ingredients: { foam: 1, matcha: 1, warmMilk: 1 } },
    null
  ).ok,
  true
);

const carrotOrder = generateOrder(10, 'sunny', 'persyk', {
  unlockedRecipes: ['carrot_cake'],
  forceUnlockedRecipe: 'carrot_cake',
});
assert.equal(carrotOrder.pastryId, 'carrot_cake');
assert.equal(carrotOrder.guestId, 'miya');
assert.ok(buildOrderGreeting(carrotOrder, 'Дитячий Мохіто', 'sunny').includes('Морквяним кексом'));
assert.equal(
  validateOrder(
    carrotOrder,
    DRINK_RECIPES[carrotOrder.drinkId as keyof typeof DRINK_RECIPES].sampleDrink,
    PASTRY_RECIPES.carrot_cake.expected
  ).ok,
  true
);

// 6. Special Traveler Cat cadence (#8, #14, #20...) & kindness mechanic
const traveler8 = generateOrder(8, 'snowy', 'puh');
assert.equal(traveler8.guestId, 'mandrivnyk');
assert.equal(traveler8.isTravelerGuest, true);
assert.ok(buildOrderGreeting(traveler8, '', 'snowy').includes('просто так'));
assert.equal(validateOrder(traveler8, null, null).ok, false);
assert.equal(
  validateOrder(traveler8, { category: 'hot', ingredients: { espresso: 1 } }, null).ok,
  true
);
assert.equal(validateOrder(traveler8, null, { type: 'cookie' }).ok, true);

// 7. Catalogs & Best Friend threshold
assert.equal(MARZIPAN_WARDROBE.length, 5);
assert.equal(CAFE_DECOR_ITEMS.length, 4);
assert.equal(UNLOCKABLE_RECIPES.length, 2);
assert.equal(BASE_STICKER_CATALOG.length, 7);
assert.equal(RARE_STICKER_CATALOG.length, 5);
assert.equal(RARE_STICKER_ORDER.length, 5);
assert.equal(GUESTS.mandrivnyk.isTraveler, true);
assert.equal(BEST_FRIEND_THRESHOLD, 3);
assert.equal(isBestFriend({ puh: 2 }, 'puh'), false);
assert.equal(isBestFriend({ puh: 3 }, 'puh'), true);
assert.equal(isBestFriend({ mandrivnyk: 5 }, 'mandrivnyk'), false);

// 8. SOL-003: Puff caffeine consistency (espresso AND matcha blocked; cocoa allowed!)
const puhMatchaCheck = validateOrder(
  puhOrder,
  { category: 'hot', ingredients: { matcha: 1, warmMilk: 1 } },
  null
);
assert.equal(puhMatchaCheck.ok, false);
assert.equal(puhMatchaCheck.isPuhCoffeeReject, true);
assert.ok(puhMatchaCheck.feedback.includes('матча'));

const matchaSecret: SecretDrinkRecipe = {
  name: 'Зелена Хмаринка',
  icon: '✨',
  accentColor: '#6FB58A',
  category: 'hot',
  hotIngredients: { matcha: 1, warmMilk: 1 },
};
assert.equal(secretDrinkHasCaffeine(matchaSecret), true);
for (let i = 0; i < 25; i++) {
  const secretOrder = generateOrder(20 + i, 'sunny', undefined, {
    secretDrink: matchaSecret,
    forceSecretDrink: true,
    unlockedRecipes: ['matcha_latte'],
  });
  assert.notEqual(secretOrder.guestId, 'puh');
}

// 9. SOL-001 & SOL-003: Storage sanitization, locked-ingredient filtering, migration & export/import
// Locked matcha secret drink is dropped cleanly if matcha_latte isn't unlocked
assert.equal(sanitizeSecretDrink(matchaSecret, []), null);
assert.ok(sanitizeSecretDrink(matchaSecret, ['matcha_latte']) !== null);

// Future unknown version must NOT be silently overwritten/downgraded
const futureRes = parseAndSanitizeSave({ version: 99, coins: 999 });
assert.equal(futureRes.ok, false);
if (!futureRes.ok) assert.equal(futureRes.reason, 'newer_version');

// v1 legacy migration preserves coins & friendship safely
const legacyV1 = parseAndSanitizeSave({
  version: 1,
  coins: 120,
  servedCount: 5,
  weather: 'rainy',
  friendship: { puh: 2, invalid_guest: 99 },
});
assert.equal(legacyV1.ok, true);
if (legacyV1.ok) {
  assert.equal(legacyV1.migrated, true);
  assert.equal(legacyV1.state.version, 3);
  assert.equal(legacyV1.state.coins, 120);
  assert.equal(legacyV1.state.friendship.puh, 2);
}

// Export / Import round-trip + invalid file rejection
const exported = exportSaveJson({
  ...DEFAULT_SAVE_STATE,
  coins: 245,
  servedCount: 11,
  unlockedRecipes: ['matcha_latte'],
  secretDrink: matchaSecret,
  unlockedRareStickers: ['mushroom', 'pinecone'],
});
const importedOk = importSaveJson(exported);
assert.equal(importedOk.ok, true);
if (importedOk.ok) {
  assert.equal(importedOk.state.coins, 245);
  assert.equal(importedOk.state.secretDrink?.name, 'Зелена Хмаринка');
  assert.deepEqual(importedOk.state.unlockedRareStickers, ['mushroom', 'pinecone']);
}

const importedBadJson = importSaveJson('{not valid json');
assert.equal(importedBadJson.ok, false);
const importedWrongObj = importSaveJson(JSON.stringify({ hello: 'world' }));
assert.equal(importedWrongObj.ok, false);

// 10. Step 03: Tactile milk-pouring physics (hold with ×1 notch + zero-hold quick tap)
// Quick tap (< 140ms) always adds +1 portion cleanly, clamped to 2
assert.equal(resolveMilkPourRelease(0, 0, MILK_POUR_HOLD_THRESHOLD_MS - 20), 1);
assert.equal(resolveMilkPourRelease(1, 1, 50), 2);
assert.equal(resolveMilkPourRelease(2, 2, 50), 2);

// Continuous hold from 0 crosses ×1, triggers milestone 1 and engages magnetic notch
let pourState = { level: 0, notchRemainingMs: 0, committedCount: 0 };
let hit1 = false;
let hit2 = false;
let elapsed = 0;
while (elapsed < MILK_POUR_DURATION_PER_PORTION_MS + 80 && !hit1) {
  const step = advanceMilkPour(pourState, 50);
  pourState = step.next;
  elapsed += 50;
  if (step.milestoneReached === 1) hit1 = true;
}
assert.equal(hit1, true);
assert.equal(pourState.level, 1);
assert.equal(pourState.committedCount, 1);
assert.equal(pourState.notchRemainingMs, MILK_POUR_NOTCH_MS);

// Holding during notch stays gracefully right at 1.0 (easy to release for Cappuccino!)
const duringNotch = advanceMilkPour(pourState, 100);
assert.equal(duringNotch.next.level, 1);
assert.equal(resolveMilkPourRelease(0, 1.15, 950), 1);
assert.equal(resolveMilkPourRelease(0, 1.35, 1100), 2);

// Continuing hold past notch reaches ×2 cleanly without overflowing
let completed = false;
for (let i = 0; i < 40 && !completed; i++) {
  const step = advanceMilkPour(pourState, 50);
  pourState = step.next;
  if (step.milestoneReached === 2) hit2 = true;
  completed = step.completed;
}
assert.equal(hit2, true);
assert.equal(completed, true);
assert.equal(pourState.level, 2);
assert.equal(pourState.committedCount, 2);

console.log('ALL_DOMAIN_TESTS_PASSED');
