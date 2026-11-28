import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BIRTHDAY_FINALE_BONUS_COINS,
  BIRTHDAY_THEMES,
  BIRTHDAY_THEME_ORDER,
} from '../src/data/birthdayStory.ts';
import {
  DAY_EVENING_BONUS_COINS,
  DAY_GUEST_TARGET,
  getThemeForDayNumber,
} from '../src/data/days.ts';
import {
  BEST_FRIEND_THRESHOLD,
  GUESTS,
  buildOrderGreeting,
  generateOrder,
  isBestFriend,
} from '../src/data/guests.ts';
import { DEFAULT_CAFE_LETTERS } from '../src/data/letters.ts';
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
  CURRENT_SAVE_VERSION,
  DEFAULT_SAVE_STATE,
  MAX_WALL_ART_DATA_URL_LENGTH,
  exportSaveJson,
  importSaveJson,
  parseAndSanitizeSave,
  sanitizeSecretDrink,
  sanitizeWallArt,
} from '../src/services/storage.ts';
import {
  advanceBirthdayStageOnNextMorning,
  createInitialBirthdayStoryState,
  getActiveBirthdayDecor,
  getBirthdayOrderRoleForSlot,
  markBirthdayStoryOrderServed,
  settleBirthdayChapterAtEvening,
  startBirthdayChapter,
} from '../src/utils/birthdayStory.ts';
import {
  advanceToNextDay,
  completeDayIntoEvening,
  createFreshDayProgress,
  isDayTargetReached,
  isLateAfternoon,
  recordServedGuestInDay,
} from '../src/utils/dayDirector.ts';
import {
  getUnlockedLetters,
  getUnreadLettersCount,
  sanitizeLettersCatalog,
} from '../src/utils/letters.ts';
import { computeGuidedHint } from '../src/utils/guidedHints.ts';
import {
  MARZIPAN_PURR_PHRASES,
  getMarzipanPurrPhrase,
  resolveCafeLightingMood,
} from '../src/utils/atmosphere.ts';
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
  assert.equal(legacyV1.state.version, CURRENT_SAVE_VERSION);
  assert.equal(legacyV1.state.coins, 120);
  assert.equal(legacyV1.state.friendship.puh, 2);
  // 5 served guests -> seamlessly lands on Day 2 open
  assert.equal(legacyV1.state.dayProgress.dayNumber, 2);
  assert.equal(legacyV1.state.dayProgress.phase, 'open');
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

// 11. Step 04: Minimal Day Director — 5-guest day lifecycle, idempotent evening bonus & v4 persistence
let day = createFreshDayProgress(1, 'open');
assert.equal(day.dayNumber, 1);
assert.equal(day.themeId, getThemeForDayNumber(1).id);
assert.equal(isDayTargetReached(day), false);
assert.equal(isLateAfternoon(day), false);

const sampleGuests: Array<'puh' | 'persyk' | 'luna' | 'marsel' | 'sofiya'> = [
  'puh',
  'persyk',
  'luna',
  'marsel',
  'sofiya',
];
for (let i = 0; i < DAY_GUEST_TARGET; i++) {
  day = recordServedGuestInDay(day, {
    guestId: sampleGuests[i],
    coinsEarned: 15,
    hasLatteArt: i === 2,
    hasTakeaway: i === 3,
    isTraveler: false,
    becameBestFriend: i === 4,
  });
  if (i === 3) {
    assert.equal(isLateAfternoon(day), true);
    assert.equal(isDayTargetReached(day), false);
  }
}
assert.equal(isDayTargetReached(day), true);
assert.equal(day.guestsServedToday.length, DAY_GUEST_TARGET);
assert.equal(day.coinsEarnedToday, 75);
assert.equal(day.latteArtToday, 1);
assert.equal(day.takeawayToday, 1);

// First evening settlement awards +20 fish & writes 1 diary entry
const evening1 = completeDayIntoEvening(day, [], 'sunny');
assert.equal(evening1.bonusCoins, DAY_EVENING_BONUS_COINS);
assert.equal(evening1.nextDay.phase, 'evening');
assert.equal(evening1.nextDay.eveningBonusClaimed, true);
assert.equal(evening1.nextDay.eveningEntryRecorded, true);
assert.equal(evening1.nextHistory.length, 1);
assert.equal(evening1.nextHistory[0].coinsEarned, 75 + DAY_EVENING_BONUS_COINS);
assert.ok(evening1.nextHistory[0].highlight.includes('Сова Софія'));

// Calling completeDayIntoEvening again (e.g. after page reload) MUST be 100% idempotent (0 bonus, no duplicate!)
const eveningReload = completeDayIntoEvening(
  evening1.nextDay,
  evening1.nextHistory,
  'sunny'
);
assert.equal(eveningReload.bonusCoins, 0);
assert.equal(eveningReload.nextHistory.length, 1);

// Advancing from evening moves cleanly to Day 2 morning with fresh theme & weather
const day2Transition = advanceToNextDay(evening1.nextDay);
assert.equal(day2Transition.nextDay.dayNumber, 2);
assert.equal(day2Transition.nextDay.phase, 'morning');
assert.equal(day2Transition.nextDay.themeId, 'rainy_cocoa');
assert.equal(day2Transition.suggestedWeather, 'rainy');
assert.equal(day2Transition.nextDay.guestsServedToday.length, 0);

// Reload persistence round-trip preserves exact mid-day & evening day state
const exportedDaySave = exportSaveJson({
  ...DEFAULT_SAVE_STATE,
  coins: 195,
  servedCount: 5,
  dayProgress: evening1.nextDay,
  dayHistory: evening1.nextHistory,
});
const restoredDaySave = importSaveJson(exportedDaySave);
assert.equal(restoredDaySave.ok, true);
if (restoredDaySave.ok) {
  assert.equal(restoredDaySave.state.version, CURRENT_SAVE_VERSION);
  assert.equal(restoredDaySave.state.dayProgress.phase, 'evening');
  assert.equal(restoredDaySave.state.dayProgress.eveningBonusClaimed, true);
  assert.equal(restoredDaySave.state.dayHistory.length, 1);
  assert.equal(restoredDaySave.state.dayHistory[0].guestsServed.length, 5);
}

// 12. Step 05: Story Chapter 1 «День народження Пуха» (3 themes × 3 days + caffeine safety + idempotent finale)
assert.equal(BIRTHDAY_THEME_ORDER.length, 3);
let storyProgress = createInitialBirthdayStoryState();
assert.equal(getActiveBirthdayDecor(storyProgress), null);

for (const theme of BIRTHDAY_THEME_ORDER) {
  storyProgress = startBirthdayChapter(storyProgress, theme);
  assert.equal(storyProgress.status, 'active');
  assert.equal(storyProgress.stageDay, 1);
  assert.deepEqual(getActiveBirthdayDecor(storyProgress), { theme, level: 1 });

  // Day 1 prep order
  assert.equal(getBirthdayOrderRoleForSlot(storyProgress, 0, DAY_GUEST_TARGET), 'prep_day1');
  const day1Order = generateOrder(30, 'sunny', undefined, {
    birthdayStory: { role: 'prep_day1', theme },
  });
  assert.equal(day1Order.birthdayStoryRole, 'prep_day1');
  assert.equal(day1Order.birthdayTheme, theme);
  assert.equal(
    validateOrder(
      day1Order,
      DRINK_RECIPES[day1Order.drinkId as keyof typeof DRINK_RECIPES].sampleDrink,
      PASTRY_RECIPES[day1Order.pastryId!].expected
    ).ok,
    true
  );

  storyProgress = markBirthdayStoryOrderServed(storyProgress);
  assert.equal(getBirthdayOrderRoleForSlot(storyProgress, 1, DAY_GUEST_TARGET), null);
  const eve1 = settleBirthdayChapterAtEvening(storyProgress);
  assert.equal(eve1.finaleBonusCoins, 0);
  assert.equal(eve1.justCompletedFinale, false);
  assert.equal(eve1.eveningHighlightOverride, BIRTHDAY_THEMES[theme].day1EveningNote);

  // Day 2 rehearsal order
  storyProgress = advanceBirthdayStageOnNextMorning(eve1.nextStory);
  assert.equal(storyProgress.stageDay, 2);
  assert.deepEqual(getActiveBirthdayDecor(storyProgress), { theme, level: 2 });
  assert.equal(getBirthdayOrderRoleForSlot(storyProgress, 0, DAY_GUEST_TARGET), 'prep_day2');
  const eve2 = settleBirthdayChapterAtEvening(
    markBirthdayStoryOrderServed(storyProgress)
  );
  assert.equal(eve2.finaleBonusCoins, 0);

  // Day 3 Grand Finale — Puff arrives on slot #5 (index 4), 100% caffeine-free!
  storyProgress = advanceBirthdayStageOnNextMorning(eve2.nextStory);
  assert.equal(storyProgress.stageDay, 3);
  assert.equal(getBirthdayOrderRoleForSlot(storyProgress, 0, DAY_GUEST_TARGET), null);
  assert.equal(getBirthdayOrderRoleForSlot(storyProgress, 4, DAY_GUEST_TARGET), 'finale_party');

  // Verify Forest finale safely avoids locked carrot_cake when not unlocked, and uses it when unlocked!
  const finaleNoUnlocks = generateOrder(35, 'sunny', undefined, {
    unlockedRecipes: [],
    birthdayStory: { role: 'finale_party', theme },
  });
  assert.equal(finaleNoUnlocks.guestId, 'puh');
  assert.notEqual(finaleNoUnlocks.pastryId, 'carrot_cake');
  const finaleDrinkRecipe =
    DRINK_RECIPES[finaleNoUnlocks.drinkId as keyof typeof DRINK_RECIPES];
  // Crucial invariant: Puff's birthday drink NEVER contains espresso or matcha!
  if (finaleDrinkRecipe.sampleDrink.category === 'hot') {
    assert.equal(finaleDrinkRecipe.sampleDrink.ingredients.espresso ?? 0, 0);
    assert.equal(finaleDrinkRecipe.sampleDrink.ingredients.matcha ?? 0, 0);
  }
  assert.equal(
    validateOrder(
      finaleNoUnlocks,
      finaleDrinkRecipe.sampleDrink,
      PASTRY_RECIPES[finaleNoUnlocks.pastryId!].expected
    ).ok,
    true
  );

  // Evening settlement on Day 3 awards +40 fish ONCE and unlocks theme postcard
  storyProgress = markBirthdayStoryOrderServed(storyProgress);
  const eve3 = settleBirthdayChapterAtEvening(storyProgress);
  assert.equal(eve3.finaleBonusCoins, BIRTHDAY_FINALE_BONUS_COINS);
  assert.equal(eve3.justCompletedFinale, true);
  assert.equal(eve3.nextStory.status, 'completed');
  assert.ok(eve3.nextStory.completedThemes.includes(theme));

  // Idempotent reload check: calling settle again awards 0 bonus!
  const eve3Reload = settleBirthdayChapterAtEvening(eve3.nextStory);
  assert.equal(eve3Reload.finaleBonusCoins, 0);
  assert.equal(eve3Reload.justCompletedFinale, false);

  storyProgress = eve3.nextStory;
}

// All 3 themes completed & persist cleanly through export/import v5 save
assert.deepEqual(storyProgress.completedThemes, ['strawberry', 'space', 'forest']);
const exportedStory = exportSaveJson({
  ...DEFAULT_SAVE_STATE,
  coins: 320,
  puhBirthday: storyProgress,
});
const importedStory = importSaveJson(exportedStory);
assert.equal(importedStory.ok, true);
if (importedStory.ok) {
  assert.equal(importedStory.state.version, CURRENT_SAVE_VERSION);
  assert.deepEqual(importedStory.state.puhBirthday.completedThemes, [
    'strawberry',
    'space',
    'forest',
  ]);
  assert.equal(importedStory.state.puhBirthday.status, 'completed');
}

// 13. Step 06: Local letters (`public/content/letters.json`), Wall Art safety cap, & Marzipan Care v6 persistence
const rawLettersJson = JSON.parse(
  readFileSync(new URL('../public/content/letters.json', import.meta.url), 'utf8')
);
const parsedLetters = sanitizeLettersCatalog(rawLettersJson);
assert.ok(parsedLetters.length >= 6);
assert.equal(parsedLetters.length, DEFAULT_CAFE_LETTERS.length);
assert.equal(getUnlockedLetters(parsedLetters, 1, 0).length, 1);
assert.equal(getUnlockedLetters(parsedLetters, 6, 20).length, parsedLetters.length);
assert.equal(
  getUnreadLettersCount(
    getUnlockedLetters(parsedLetters, 3, 10),
    ['letter_welcome_marzipan']
  ),
  2
);
// Malformed letter payload safely falls back to defaults without throwing
assert.deepEqual(sanitizeLettersCatalog({ bad: true }), DEFAULT_CAFE_LETTERS);

// Wall art sanitizer blocks unsafe URLs / oversized payloads, preserves valid WebP drawings
assert.equal(
  sanitizeWallArt({ dataUrl: 'javascript:alert(1)', title: 'bad' }).dataUrl,
  null
);
assert.equal(
  sanitizeWallArt({
    dataUrl: `data:image/webp;base64,${'A'.repeat(MAX_WALL_ART_DATA_URL_LENGTH + 10)}`,
  }).dataUrl,
  null
);
const validArt = sanitizeWallArt({
  dataUrl: 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=',
  title: '  Мій котик  ',
  frameStyle: 'blush_ribbon',
  visible: true,
});
assert.ok(validArt.dataUrl?.startsWith('data:image/webp;base64,'));
assert.equal(validArt.title, 'Мій котик');
assert.equal(validArt.frameStyle, 'blush_ribbon');

// Full v6 save export/import preserves letters, wall art, and Marzipan care cleanly
const v6Export = exportSaveJson({
  ...DEFAULT_SAVE_STATE,
  coins: 303,
  readLetterIds: ['letter_welcome_marzipan', 'letter_puh_cocoa'],
  wallArt: validArt,
  marzipanCare: {
    treatsGiven: 4,
    yarnGamesPlayed: 2,
    petsCount: 9,
    lastPlayRewardDay: 6,
  },
});
const v6Import = importSaveJson(v6Export);
assert.equal(v6Import.ok, true);
if (v6Import.ok) {
  assert.equal(v6Import.state.version, CURRENT_SAVE_VERSION);
  assert.deepEqual(v6Import.state.readLetterIds, [
    'letter_welcome_marzipan',
    'letter_puh_cocoa',
  ]);
  assert.equal(v6Import.state.wallArt.title, 'Мій котик');
  assert.equal(v6Import.state.wallArt.frameStyle, 'blush_ribbon');
  assert.equal(v6Import.state.marzipanCare.treatsGiven, 4);
  assert.equal(v6Import.state.marzipanCare.lastPlayRewardDay, 6);
}

// 14. Child Guided Step-by-Step Hints (`computeGuidedHint`)
const firstOrder = generateOrder(1, 'sunny'); // Puff: cocoa_marshmallow
const hintClosed = computeGuidedHint({
  order: firstOrder,
  emotion: 'waiting',
  isWorkbenchOpen: false,
  activeTab: 'hot',
  trayDrink: null,
  trayPastry: null,
  hotIngredients: {},
  coldGlassMode: 'empty',
  cocktailIngredients: {},
  blenderIngredients: {},
  whippedCream: false,
  selectedPastry: null,
});
assert.equal(hintClosed.highlightTab, 'hot');
assert.equal(hintClosed.highlightServe, false);

const hintPartialHot = computeGuidedHint({
  order: firstOrder,
  emotion: 'waiting',
  isWorkbenchOpen: true,
  activeTab: 'hot',
  trayDrink: null,
  trayPastry: null,
  hotIngredients: { cocoa: 1 },
  coldGlassMode: 'empty',
  cocktailIngredients: {},
  blenderIngredients: {},
  whippedCream: false,
  selectedPastry: null,
});
assert.deepEqual(hintPartialHot.highlightHotIngredients, ['warmMilk', 'marshmallow']);
assert.equal(hintPartialHot.highlightPutOnTray, false);

const hintReadyHot = computeGuidedHint({
  order: firstOrder,
  emotion: 'waiting',
  isWorkbenchOpen: true,
  activeTab: 'hot',
  trayDrink: null,
  trayPastry: null,
  hotIngredients: { cocoa: 1, warmMilk: 1, marshmallow: 1 },
  coldGlassMode: 'empty',
  cocktailIngredients: {},
  blenderIngredients: {},
  whippedCream: false,
  selectedPastry: null,
});
assert.equal(hintReadyHot.highlightPutOnTray, true);
assert.deepEqual(hintReadyHot.highlightHotIngredients, []);

const hintServeNow = computeGuidedHint({
  order: firstOrder,
  emotion: 'waiting',
  isWorkbenchOpen: false,
  activeTab: 'hot',
  trayDrink: { category: 'hot', ingredients: { cocoa: 1, warmMilk: 1, marshmallow: 1 } },
  trayPastry: null,
  hotIngredients: {},
  coldGlassMode: 'empty',
  cocktailIngredients: {},
  blenderIngredients: {},
  whippedCream: false,
  selectedPastry: null,
});
assert.equal(hintServeNow.highlightServe, true);

// 15. Wave C Atmosphere & Lighting Scenarios + Marzipan Purr Rotation
const morningLight = resolveCafeLightingMood({
  weather: 'sunny',
  servedToday: 0,
  guestsTarget: 5,
});
assert.equal(morningLight.mood, 'morning_fresh');
assert.ok(morningLight.sunbeamOpacity > 0);

const afternoonLight = resolveCafeLightingMood({
  weather: 'sunny',
  servedToday: 2,
  guestsTarget: 5,
});
assert.equal(afternoonLight.mood, 'afternoon_golden');
assert.ok(afternoonLight.pendantGlow > morningLight.pendantGlow);

const eveningLight = resolveCafeLightingMood({
  weather: 'sunny',
  servedToday: 4,
  guestsTarget: 5,
  isLateAfternoon: true,
});
assert.equal(eveningLight.mood, 'evening_amber');
assert.ok(eveningLight.pendantGlow > afternoonLight.pendantGlow);
assert.ok(eveningLight.windowSunsetOpacity > 0.15);
assert.ok(eveningLight.fairyTwinkleOpacity > 0.7);

const rainyLight = resolveCafeLightingMood({
  weather: 'rainy',
  servedToday: 1,
  guestsTarget: 5,
});
assert.equal(rainyLight.mood, 'rainy_sanctuary');
assert.equal(rainyLight.sunbeamOpacity, 0);
assert.ok(rainyLight.pendantGlow > morningLight.pendantGlow);

const snowyLight = resolveCafeLightingMood({
  weather: 'snowy',
  servedToday: 1,
  guestsTarget: 5,
});
assert.equal(snowyLight.mood, 'snowy_hearth');
assert.equal(snowyLight.sunbeamOpacity, 0);
assert.ok(snowyLight.fairyTwinkleOpacity >= 0.8);

assert.equal(getMarzipanPurrPhrase(0), MARZIPAN_PURR_PHRASES[0]);
assert.equal(
  getMarzipanPurrPhrase(MARZIPAN_PURR_PHRASES.length),
  MARZIPAN_PURR_PHRASES[0]
);
assert.notEqual(getMarzipanPurrPhrase(1), getMarzipanPurrPhrase(2));

console.log('ALL_DOMAIN_TESTS_PASSED');
