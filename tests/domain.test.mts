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

console.log('ALL_DOMAIN_TESTS_PASSED');
