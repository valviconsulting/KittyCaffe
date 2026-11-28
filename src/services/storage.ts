import { BIRTHDAY_THEME_ORDER } from '../data/birthdayStory.ts';
import {
  DAY_GUEST_TARGET,
  DAY_THEME_ORDER,
  MAX_DAY_HISTORY,
  getThemeForDayNumber,
} from '../data/days.ts';
import {
  FRIENDSHIP_MOMENTS,
  FRIENDSHIP_MOMENT_ORDER,
} from '../data/livingFriendship.ts';
import {
  VALID_DAY1_CHOICES,
  VALID_DAY2_CHOICES,
  VALID_MYSTERY_ROLES,
} from '../data/recipeMystery.ts';
import type {
  BirthdayStoryStatus,
  BirthdayThemeId,
  BlenderIngredientId,
  CafeDecorId,
  CafeSaveState,
  DayMemoryEntry,
  DayPhase,
  DayProgressState,
  DayThemeId,
  FriendshipMomentId,
  GuestId,
  HotIngredientId,
  LivingFriendshipState,
  MarzipanAccessoryId,
  MarzipanCareState,
  MarzipanEquipped,
  MarzipanEyesAccessoryId,
  MarzipanHeadAccessoryId,
  MarzipanNeckAccessoryId,
  MysteryDay1ChoiceId,
  MysteryDay2ChoiceId,
  PendingFriendGift,
  PuhBirthdayStoryState,
  RareStickerId,
  RecipeMysteryStatus,
  RecipeMysteryStoryState,
  RegularGuestId,
  SecretDrinkRecipe,
  TallGlassIngredientId,
  UnlockableRecipeId,
  WallArtState,
  WallFrameStyle,
  WeatherType,
} from '../types/game';
import { createInitialBirthdayStoryState } from '../utils/birthdayStory.ts';
import { createFreshDayProgress } from '../utils/dayDirector.ts';
import { createInitialLivingFriendshipState } from '../utils/livingFriendship.ts';
import { createInitialRecipeMysteryState } from '../utils/recipeMystery.ts';

export const CURRENT_SAVE_VERSION = 8;
export const STORAGE_KEY = 'mur_late_save_v1';
export const STORAGE_BACKUP_KEY = 'mur_late_save_v1_backup';
export const MAX_WALL_ART_DATA_URL_LENGTH = 65_000;

const VALID_WEATHERS: WeatherType[] = ['sunny', 'rainy', 'snowy'];
const VALID_FRAME_STYLES: WallFrameStyle[] = [
  'honey_wood',
  'blush_ribbon',
  'golden_stars',
];
const VALID_BIRTHDAY_STATUSES: BirthdayStoryStatus[] = [
  'not_started',
  'active',
  'completed',
];
const VALID_MYSTERY_STATUSES: RecipeMysteryStatus[] = [
  'not_started',
  'active',
  'completed',
];
const VALID_REGULAR_GUEST_IDS: RegularGuestId[] = [
  'puh',
  'persyk',
  'luna',
  'marsel',
  'sofiya',
  'miya',
];
const VALID_GUEST_IDS: GuestId[] = [...VALID_REGULAR_GUEST_IDS, 'mandrivnyk'];
const VALID_DAY_PHASES: DayPhase[] = ['morning', 'open', 'evening'];
const VALID_HOT_INGREDIENTS: HotIngredientId[] = [
  'espresso',
  'hotWater',
  'warmMilk',
  'foam',
  'cocoa',
  'cinnamon',
  'marshmallow',
  'matcha',
];
const VALID_TALL_INGREDIENTS: TallGlassIngredientId[] = [
  'ice',
  'soda',
  'orangeJuice',
  'strawberrySyrup',
  'mint',
  'lemon',
];
const VALID_BLENDER_INGREDIENTS: BlenderIngredientId[] = [
  'coldMilk',
  'iceCream',
  'strawberrySyrup',
];
const VALID_ACCESSORIES: MarzipanAccessoryId[] = [
  'chef_hat',
  'heart_glasses',
  'red_bowtie',
  'knit_scarf',
  'gold_crown',
];
const VALID_HEADS: MarzipanHeadAccessoryId[] = ['chef_hat', 'gold_crown'];
const VALID_EYES: MarzipanEyesAccessoryId[] = ['heart_glasses'];
const VALID_NECKS: MarzipanNeckAccessoryId[] = ['red_bowtie', 'knit_scarf'];
const VALID_DECOR: CafeDecorId[] = [
  'daisy_vase',
  'twinkle_stars',
  'cat_clock',
  'music_box',
];
const VALID_RECIPES: UnlockableRecipeId[] = ['matcha_latte', 'carrot_cake'];
const VALID_RARE_STICKERS: RareStickerId[] = [
  'mushroom',
  'moon_cat',
  'clover',
  'butterfly',
  'pinecone',
];

export const DEFAULT_EQUIPPED: MarzipanEquipped = {
  head: null,
  eyes: null,
  neck: null,
};

export const DEFAULT_WALL_ART: WallArtState = {
  dataUrl: null,
  title: '',
  frameStyle: 'honey_wood',
  visible: true,
};

export const DEFAULT_MARZIPAN_CARE: MarzipanCareState = {
  treatsGiven: 0,
  yarnGamesPlayed: 0,
  petsCount: 0,
  lastPlayRewardDay: 0,
};

export const DEFAULT_SAVE_STATE: CafeSaveState = {
  version: CURRENT_SAVE_VERSION,
  coins: 0,
  servedCount: 0,
  weather: 'sunny',
  muted: false,
  friendship: {},
  marzipanOutfitId: 'default',
  secretDrink: null,
  ownedAccessories: [],
  equippedAccessories: { ...DEFAULT_EQUIPPED },
  ownedDecor: [],
  enabledDecor: [],
  unlockedRecipes: [],
  unlockedRareStickers: [],
  musicBoxPlaying: false,
  travelerVisits: 0,
  dayProgress: createFreshDayProgress(1, 'open'),
  dayHistory: [],
  puhBirthday: createInitialBirthdayStoryState(),
  recipeMystery: createInitialRecipeMysteryState(),
  livingFriendship: createInitialLivingFriendshipState(),
  readLetterIds: [],
  wallArt: { ...DEFAULT_WALL_ART },
  marzipanCare: { ...DEFAULT_MARZIPAN_CARE },
};

export type LoadSaveStatus =
  | 'ok'
  | 'empty'
  | 'migrated'
  | 'corrupted'
  | 'newer_version';

export interface LoadSaveResult {
  state: CafeSaveState;
  status: LoadSaveStatus;
  /** False when a corrupted or future-version save was found so mount never overwrites it */
  canAutoSave: boolean;
}

export interface SaveWriteResult {
  ok: boolean;
  error?: 'quota' | 'unknown';
}

export type ParseSaveResult =
  | { ok: true; state: CafeSaveState; migrated: boolean }
  | { ok: false; reason: 'invalid_format' | 'newer_version' };

function sanitizeStringArray<T extends string>(
  raw: unknown,
  allowed: readonly T[]
): T[] {
  if (!Array.isArray(raw)) return [];
  const allowedSet = new Set<string>(allowed);
  const unique = new Set<T>();
  for (const item of raw) {
    if (typeof item === 'string' && allowedSet.has(item)) {
      unique.add(item as T);
    }
  }
  return Array.from(unique);
}

function sanitizeFriendship(raw: unknown): Partial<Record<GuestId, number>> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Partial<Record<GuestId, number>> = {};
  const src = raw as Record<string, unknown>;
  for (const guestId of VALID_GUEST_IDS) {
    const val = src[guestId];
    if (typeof val === 'number' && Number.isFinite(val) && val > 0) {
      result[guestId] = Math.floor(val);
    }
  }
  return result;
}

function sanitizeEquipped(
  raw: unknown,
  owned: MarzipanAccessoryId[]
): MarzipanEquipped {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_EQUIPPED };
  const ownedSet = new Set<MarzipanAccessoryId>(owned);
  const c = raw as Partial<MarzipanEquipped>;
  const head =
    c.head && VALID_HEADS.includes(c.head) && ownedSet.has(c.head)
      ? c.head
      : null;
  const eyes =
    c.eyes && VALID_EYES.includes(c.eyes) && ownedSet.has(c.eyes)
      ? c.eyes
      : null;
  const neck =
    c.neck && VALID_NECKS.includes(c.neck) && ownedSet.has(c.neck)
      ? c.neck
      : null;
  return { head, eyes, neck };
}

function sanitizeOrderedGuests(raw: unknown, limit: number): GuestId[] {
  if (!Array.isArray(raw)) return [];
  const allowed = new Set<string>(VALID_GUEST_IDS);
  const out: GuestId[] = [];
  for (const item of raw) {
    if (typeof item === 'string' && allowed.has(item)) {
      out.push(item as GuestId);
      if (out.length >= limit) break;
    }
  }
  return out;
}

function sanitizeDayProgress(
  raw: unknown,
  fallbackDayNumber: number
): DayProgressState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return createFreshDayProgress(fallbackDayNumber, 'open');
  }
  const c = raw as Partial<DayProgressState>;
  const dayNumber =
    typeof c.dayNumber === 'number' &&
    Number.isFinite(c.dayNumber) &&
    c.dayNumber >= 1
      ? Math.floor(c.dayNumber)
      : fallbackDayNumber;
  const fallbackTheme = getThemeForDayNumber(dayNumber).id;
  const themeId: DayThemeId =
    c.themeId && DAY_THEME_ORDER.includes(c.themeId) ? c.themeId : fallbackTheme;
  const phase: DayPhase =
    c.phase && VALID_DAY_PHASES.includes(c.phase) ? c.phase : 'open';
  const guestsTarget = DAY_GUEST_TARGET;
  const guestsServedToday = sanitizeOrderedGuests(
    c.guestsServedToday,
    guestsTarget
  );
  const coinsEarnedToday =
    typeof c.coinsEarnedToday === 'number' &&
    Number.isFinite(c.coinsEarnedToday) &&
    c.coinsEarnedToday >= 0
      ? Math.floor(c.coinsEarnedToday)
      : 0;
  const latteArtToday =
    typeof c.latteArtToday === 'number' &&
    Number.isFinite(c.latteArtToday) &&
    c.latteArtToday >= 0
      ? Math.floor(c.latteArtToday)
      : 0;
  const takeawayToday =
    typeof c.takeawayToday === 'number' &&
    Number.isFinite(c.takeawayToday) &&
    c.takeawayToday >= 0
      ? Math.floor(c.takeawayToday)
      : 0;
  const newBestFriendsToday = sanitizeStringArray(
    c.newBestFriendsToday,
    VALID_REGULAR_GUEST_IDS
  );

  return {
    dayNumber,
    themeId,
    phase,
    guestsTarget,
    guestsServedToday,
    coinsEarnedToday,
    latteArtToday,
    takeawayToday,
    travelerVisitedToday: Boolean(c.travelerVisitedToday),
    newBestFriendsToday,
    eveningBonusClaimed: Boolean(c.eveningBonusClaimed),
    eveningEntryRecorded: Boolean(c.eveningEntryRecorded),
  };
}

function sanitizeDayHistory(raw: unknown): DayMemoryEntry[] {
  if (!Array.isArray(raw)) return [];
  const seenDays = new Set<number>();
  const entries: DayMemoryEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const c = item as Partial<DayMemoryEntry>;
    if (
      typeof c.dayNumber !== 'number' ||
      !Number.isFinite(c.dayNumber) ||
      c.dayNumber < 1
    ) {
      continue;
    }
    const dayNumber = Math.floor(c.dayNumber);
    if (seenDays.has(dayNumber)) continue;
    seenDays.add(dayNumber);

    const themeId: DayThemeId =
      c.themeId && DAY_THEME_ORDER.includes(c.themeId)
        ? c.themeId
        : getThemeForDayNumber(dayNumber).id;
    const weather: WeatherType =
      c.weather && VALID_WEATHERS.includes(c.weather) ? c.weather : 'sunny';
    const guestsServed = sanitizeOrderedGuests(c.guestsServed, DAY_GUEST_TARGET);
    const coinsEarned =
      typeof c.coinsEarned === 'number' &&
      Number.isFinite(c.coinsEarned) &&
      c.coinsEarned >= 0
        ? Math.floor(c.coinsEarned)
        : 0;
    const latteArtCount =
      typeof c.latteArtCount === 'number' &&
      Number.isFinite(c.latteArtCount) &&
      c.latteArtCount >= 0
        ? Math.floor(c.latteArtCount)
        : 0;
    const takeawayCount =
      typeof c.takeawayCount === 'number' &&
      Number.isFinite(c.takeawayCount) &&
      c.takeawayCount >= 0
        ? Math.floor(c.takeawayCount)
        : 0;
    const highlight =
      typeof c.highlight === 'string' && c.highlight.trim()
        ? c.highlight.trim().slice(0, 180)
        : 'Теплий і затишний день у «Мур-Лате»!';

    entries.push({
      dayNumber,
      themeId,
      weather,
      guestsServed,
      coinsEarned,
      latteArtCount,
      takeawayCount,
      highlight,
    });
    if (entries.length >= MAX_DAY_HISTORY) break;
  }
  return entries;
}

function sanitizeBirthdayStory(raw: unknown): PuhBirthdayStoryState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return createInitialBirthdayStoryState();
  }
  const c = raw as Partial<PuhBirthdayStoryState>;
  const completedThemes = sanitizeStringArray(
    c.completedThemes,
    BIRTHDAY_THEME_ORDER
  );
  const theme: BirthdayThemeId | null =
    c.theme && BIRTHDAY_THEME_ORDER.includes(c.theme) ? c.theme : null;
  let status: BirthdayStoryStatus =
    c.status && VALID_BIRTHDAY_STATUSES.includes(c.status)
      ? c.status
      : 'not_started';
  // Prevent broken 'active' state without a valid chosen theme
  if (status === 'active' && !theme) {
    status = completedThemes.length > 0 ? 'completed' : 'not_started';
  }
  const stageDay: 1 | 2 | 3 =
    c.stageDay === 1 || c.stageDay === 2 || c.stageDay === 3 ? c.stageDay : 1;

  return {
    status,
    theme: theme ?? (completedThemes[completedThemes.length - 1] ?? null),
    stageDay,
    storyOrderServedToday: Boolean(c.storyOrderServedToday),
    completedThemes,
    keepDecorEnabled:
      typeof c.keepDecorEnabled === 'boolean' ? c.keepDecorEnabled : true,
    finaleRewardClaimed: Boolean(c.finaleRewardClaimed),
  };
}

function sanitizeRecipeMystery(raw: unknown): RecipeMysteryStoryState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return createInitialRecipeMysteryState();
  }
  const c = raw as Partial<RecipeMysteryStoryState>;
  const status: RecipeMysteryStatus =
    c.status && VALID_MYSTERY_STATUSES.includes(c.status)
      ? c.status
      : 'not_started';
  const stageDay: 1 | 2 | 3 =
    c.stageDay === 1 || c.stageDay === 2 || c.stageDay === 3 ? c.stageDay : 1;
  const discoveredSet = new Set<number>();
  if (Array.isArray(c.discoveredClues)) {
    for (const item of c.discoveredClues) {
      if (item === 1 || item === 2 || item === 3) {
        discoveredSet.add(item);
      }
    }
  }
  if (status === 'completed') {
    discoveredSet.add(1);
    discoveredSet.add(2);
    discoveredSet.add(3);
  }
  const servedStepsToday = sanitizeStringArray(
    c.servedStepsToday,
    VALID_MYSTERY_ROLES
  );
  const day1Choice: MysteryDay1ChoiceId | null =
    c.day1Choice && VALID_DAY1_CHOICES.includes(c.day1Choice)
      ? c.day1Choice
      : null;
  const day2Choice: MysteryDay2ChoiceId | null =
    c.day2Choice && VALID_DAY2_CHOICES.includes(c.day2Choice)
      ? c.day2Choice
      : null;

  return {
    status,
    stageDay,
    discoveredClues: Array.from(discoveredSet).sort((a, b) => a - b),
    servedStepsToday,
    day1Choice,
    day2Choice,
    finaleRewardClaimed: Boolean(c.finaleRewardClaimed),
    showCounterSouvenir:
      typeof c.showCounterSouvenir === 'boolean'
        ? c.showCounterSouvenir
        : true,
  };
}

function sanitizeLivingFriendship(raw: unknown): LivingFriendshipState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return createInitialLivingFriendshipState();
  }
  const c = raw as Partial<LivingFriendshipState>;
  const completedMoments = sanitizeStringArray(
    c.completedMoments,
    FRIENDSHIP_MOMENT_ORDER
  );
  const moodRiddlesSolved =
    typeof c.moodRiddlesSolved === 'number' &&
    Number.isFinite(c.moodRiddlesSolved) &&
    c.moodRiddlesSolved >= 0
      ? Math.floor(c.moodRiddlesSolved)
      : 0;

  let pendingGift: PendingFriendGift | null = null;
  if (
    c.pendingGift &&
    typeof c.pendingGift === 'object' &&
    !Array.isArray(c.pendingGift)
  ) {
    const pg = c.pendingGift as Partial<PendingFriendGift>;
    if (
      pg.momentId &&
      FRIENDSHIP_MOMENT_ORDER.includes(pg.momentId as FriendshipMomentId)
    ) {
      const meta = FRIENDSHIP_MOMENTS[pg.momentId as FriendshipMomentId];
      pendingGift = {
        momentId: meta.id,
        fromGuestId: meta.fromGuestId,
        toGuestId: meta.toGuestId,
        wishText:
          typeof pg.wishText === 'string' && pg.wishText.trim()
            ? pg.wishText.trim().slice(0, 48)
            : undefined,
      };
    }
  }

  return {
    pendingGift,
    completedMoments,
    moodRiddlesSolved,
  };
}

function sanitizeReadLetterIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const unique = new Set<string>();
  for (const item of raw) {
    if (typeof item === 'string' && item.trim() && item.trim().length <= 64) {
      unique.add(item.trim());
      if (unique.size >= 120) break;
    }
  }
  return Array.from(unique);
}

export function sanitizeWallArt(raw: unknown): WallArtState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_WALL_ART };
  }
  const c = raw as Partial<WallArtState>;
  const isSafeDataUrl =
    typeof c.dataUrl === 'string' &&
    c.dataUrl.length <= MAX_WALL_ART_DATA_URL_LENGTH &&
    (c.dataUrl.startsWith('data:image/webp;base64,') ||
      c.dataUrl.startsWith('data:image/png;base64,'));
  const title =
    typeof c.title === 'string' ? c.title.trim().slice(0, 32) : '';
  const frameStyle: WallFrameStyle =
    c.frameStyle && VALID_FRAME_STYLES.includes(c.frameStyle)
      ? c.frameStyle
      : 'honey_wood';

  return {
    dataUrl: isSafeDataUrl ? c.dataUrl! : null,
    title,
    frameStyle,
    visible: typeof c.visible === 'boolean' ? c.visible : true,
  };
}

function sanitizeMarzipanCare(raw: unknown): MarzipanCareState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_MARZIPAN_CARE };
  }
  const c = raw as Partial<MarzipanCareState>;
  const safeNum = (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;

  return {
    treatsGiven: safeNum(c.treatsGiven),
    yarnGamesPlayed: safeNum(c.yarnGamesPlayed),
    petsCount: safeNum(c.petsCount),
    lastPlayRewardDay: safeNum(c.lastPlayRewardDay),
  };
}

export function sanitizeSecretDrink(
  raw: unknown,
  unlockedRecipes: UnlockableRecipeId[]
): SecretDrinkRecipe | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const candidate = raw as Partial<SecretDrinkRecipe>;
  if (
    typeof candidate.name !== 'string' ||
    !candidate.name.trim() ||
    (candidate.category !== 'hot' &&
      candidate.category !== 'cocktail' &&
      candidate.category !== 'milkshake')
  ) {
    return null;
  }

  const base = {
    name: candidate.name.trim().slice(0, 32),
    icon:
      typeof candidate.icon === 'string' && candidate.icon
        ? candidate.icon.slice(0, 4)
        : '⭐',
    accentColor:
      typeof candidate.accentColor === 'string' &&
      /^#[0-9a-fA-F]{3,8}$/.test(candidate.accentColor)
        ? candidate.accentColor
        : '#E8A84C',
    category: candidate.category,
  };

  if (candidate.category === 'hot') {
    if (!candidate.hotIngredients || typeof candidate.hotIngredients !== 'object') {
      return null;
    }
    const hasMatchaUnlocked = unlockedRecipes.includes('matcha_latte');
    const hotMap: Partial<Record<HotIngredientId, number>> = {};
    let total = 0;
    const rawMap = candidate.hotIngredients as Record<string, unknown>;
    for (const id of VALID_HOT_INGREDIENTS) {
      if (id === 'matcha' && !hasMatchaUnlocked) continue;
      const val = rawMap[id];
      if (typeof val === 'number' && Number.isFinite(val) && val >= 1) {
        const max = id === 'warmMilk' ? 2 : 1;
        const clamped = Math.min(max, Math.floor(val));
        if (total + clamped <= 4) {
          hotMap[id] = clamped;
          total += clamped;
        }
      }
    }
    if (total < 2) return null;
    return { ...base, hotIngredients: hotMap };
  }

  if (candidate.category === 'cocktail') {
    const list = sanitizeStringArray(
      candidate.cocktailIngredients,
      VALID_TALL_INGREDIENTS
    ).slice(0, 4);
    if (list.length < 2) return null;
    return { ...base, cocktailIngredients: list };
  }

  const milkshakeList = sanitizeStringArray(
    candidate.milkshakeIngredients,
    VALID_BLENDER_INGREDIENTS
  ).slice(0, 3);
  if (milkshakeList.length < 2) return null;
  return {
    ...base,
    milkshakeIngredients: milkshakeList,
    needsWhippedCream: Boolean(candidate.needsWhippedCream),
  };
}

export function parseAndSanitizeSave(rawObj: unknown): ParseSaveResult {
  if (!rawObj || typeof rawObj !== 'object' || Array.isArray(rawObj)) {
    return { ok: false, reason: 'invalid_format' };
  }
  const parsed = rawObj as Partial<CafeSaveState> & Record<string, unknown>;

  // Reject unknown future versions so we never silently downgrade/overwrite them
  if (
    typeof parsed.version === 'number' &&
    Number.isFinite(parsed.version) &&
    parsed.version > CURRENT_SAVE_VERSION
  ) {
    return { ok: false, reason: 'newer_version' };
  }

  // Must look like a genuine KittyCaffe save (has at least one known numeric/state key)
  const hasKnownKey =
    typeof parsed.coins === 'number' ||
    typeof parsed.servedCount === 'number' ||
    typeof parsed.version === 'number' ||
    typeof parsed.weather === 'string';
  if (!hasKnownKey) {
    return { ok: false, reason: 'invalid_format' };
  }

  const sourceVersion =
    typeof parsed.version === 'number' && Number.isFinite(parsed.version)
      ? Math.floor(parsed.version)
      : 1;

  const coins =
    typeof parsed.coins === 'number' &&
    Number.isFinite(parsed.coins) &&
    parsed.coins >= 0
      ? Math.floor(parsed.coins)
      : 0;
  const servedCount =
    typeof parsed.servedCount === 'number' &&
    Number.isFinite(parsed.servedCount) &&
    parsed.servedCount >= 0
      ? Math.floor(parsed.servedCount)
      : 0;
  const weather: WeatherType =
    parsed.weather && VALID_WEATHERS.includes(parsed.weather)
      ? parsed.weather
      : 'sunny';
  const muted = Boolean(parsed.muted);
  const friendship = sanitizeFriendship(parsed.friendship);
  const marzipanOutfitId =
    typeof parsed.marzipanOutfitId === 'string'
      ? parsed.marzipanOutfitId
      : 'default';

  const ownedAccessories = sanitizeStringArray(
    parsed.ownedAccessories,
    VALID_ACCESSORIES
  );
  const equippedAccessories = sanitizeEquipped(
    parsed.equippedAccessories,
    ownedAccessories
  );
  const ownedDecor = sanitizeStringArray(parsed.ownedDecor, VALID_DECOR);
  const ownedDecorSet = new Set(ownedDecor);
  const enabledDecor = sanitizeStringArray(
    parsed.enabledDecor,
    VALID_DECOR
  ).filter((id) => ownedDecorSet.has(id));
  const unlockedRecipes = sanitizeStringArray(
    parsed.unlockedRecipes,
    VALID_RECIPES
  );
  const unlockedRareStickers = sanitizeStringArray(
    parsed.unlockedRareStickers,
    VALID_RARE_STICKERS
  );
  const secretDrink = sanitizeSecretDrink(parsed.secretDrink, unlockedRecipes);
  const musicBoxPlaying =
    Boolean(parsed.musicBoxPlaying) && enabledDecor.includes('music_box');
  const travelerVisits =
    typeof parsed.travelerVisits === 'number' &&
    Number.isFinite(parsed.travelerVisits) &&
    parsed.travelerVisits >= 0
      ? Math.floor(parsed.travelerVisits)
      : 0;

  const fallbackDayNumber = Math.max(
    1,
    Math.floor(servedCount / DAY_GUEST_TARGET) + 1
  );
  const dayProgress = sanitizeDayProgress(parsed.dayProgress, fallbackDayNumber);
  const dayHistory = sanitizeDayHistory(parsed.dayHistory);
  const puhBirthday = sanitizeBirthdayStory(parsed.puhBirthday);
  const recipeMystery = sanitizeRecipeMystery(parsed.recipeMystery);
  const livingFriendship = sanitizeLivingFriendship(parsed.livingFriendship);
  const readLetterIds = sanitizeReadLetterIds(parsed.readLetterIds);
  const wallArt = sanitizeWallArt(parsed.wallArt);
  const marzipanCare = sanitizeMarzipanCare(parsed.marzipanCare);

  return {
    ok: true,
    migrated: sourceVersion < CURRENT_SAVE_VERSION,
    state: {
      version: CURRENT_SAVE_VERSION,
      coins,
      servedCount,
      weather,
      muted,
      friendship,
      marzipanOutfitId,
      secretDrink,
      ownedAccessories,
      equippedAccessories,
      ownedDecor,
      enabledDecor,
      unlockedRecipes,
      unlockedRareStickers,
      musicBoxPlaying,
      travelerVisits,
      dayProgress,
      dayHistory,
      puhBirthday,
      recipeMystery,
      livingFriendship,
      readLetterIds,
      wallArt,
      marzipanCare,
    },
  };
}

function writeRawBackup(raw: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_BACKUP_KEY, raw);
  } catch {
    // Ignore backup quota failures
  }
}

export function loadCafeSaveWithStatus(): LoadSaveResult {
  if (typeof window === 'undefined') {
    return { state: DEFAULT_SAVE_STATE, status: 'empty', canAutoSave: true };
  }
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return { state: DEFAULT_SAVE_STATE, status: 'empty', canAutoSave: false };
  }

  if (!raw) {
    return { state: DEFAULT_SAVE_STATE, status: 'empty', canAutoSave: true };
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const res = parseAndSanitizeSave(parsed);
    if (!res.ok) {
      writeRawBackup(raw);
      return {
        state: DEFAULT_SAVE_STATE,
        status: res.reason === 'newer_version' ? 'newer_version' : 'corrupted',
        canAutoSave: false,
      };
    }

    if (res.migrated) {
      writeRawBackup(raw);
      return { state: res.state, status: 'migrated', canAutoSave: true };
    }
    return { state: res.state, status: 'ok', canAutoSave: true };
  } catch {
    writeRawBackup(raw);
    return {
      state: DEFAULT_SAVE_STATE,
      status: 'corrupted',
      canAutoSave: false,
    };
  }
}

export function loadCafeSave(): CafeSaveState {
  return loadCafeSaveWithStatus().state;
}

let lastSaveError: 'quota' | 'unknown' | null = null;

export function getLastSaveError(): 'quota' | 'unknown' | null {
  return lastSaveError;
}

export function saveCafeProgress(state: CafeSaveState): SaveWriteResult {
  if (typeof window === 'undefined') return { ok: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lastSaveError = null;
    return { ok: true };
  } catch (err) {
    const isQuota =
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED');
    lastSaveError = isQuota ? 'quota' : 'unknown';
    return { ok: false, error: lastSaveError };
  }
}

export function exportSaveJson(state: CafeSaveState): string {
  return JSON.stringify(
    {
      format: 'mur_late_backup',
      exportedAt: new Date().toISOString(),
      data: state,
    },
    null,
    2
  );
}

export type ImportSaveResult =
  | { ok: true; state: CafeSaveState }
  | { ok: false; error: string };

export function importSaveJson(rawText: string): ImportSaveResult {
  if (!rawText || !rawText.trim()) {
    return { ok: false, error: 'Файл порожній — обери файл збереження «Мур-Лате».' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return {
      ok: false,
      error: 'Не вдалося прочитати JSON — перевір, чи це правильний файл збереження.',
    };
  }

  // Unwrap `{ format: 'mur_late_backup', data: ... }` or accept raw save state JSON
  const payload =
    parsed &&
    typeof parsed === 'object' &&
    !Array.isArray(parsed) &&
    'data' in parsed &&
    (parsed as { format?: unknown }).format === 'mur_late_backup'
      ? (parsed as { data: unknown }).data
      : parsed;

  const validated = parseAndSanitizeSave(payload);
  if (!validated.ok) {
    if (validated.reason === 'newer_version') {
      return {
        ok: false,
        error:
          'Це збереження з новішої версії «Мур-Лате» — онови гру, щоб відкрити його безпечно.',
      };
    }
    return {
      ok: false,
      error:
        'Формат файлу не схожий на збереження «Мур-Лате». Поточний прогрес не змінено!',
    };
  }

  return { ok: true, state: validated.state };
}
