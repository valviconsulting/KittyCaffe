import type {
  BlenderIngredientId,
  CafeDecorId,
  CafeSaveState,
  GuestId,
  HotIngredientId,
  MarzipanAccessoryId,
  MarzipanEquipped,
  MarzipanEyesAccessoryId,
  MarzipanHeadAccessoryId,
  MarzipanNeckAccessoryId,
  RareStickerId,
  SecretDrinkRecipe,
  TallGlassIngredientId,
  UnlockableRecipeId,
  WeatherType,
} from '../types/game';

export const CURRENT_SAVE_VERSION = 3;
export const STORAGE_KEY = 'mur_late_save_v1';
export const STORAGE_BACKUP_KEY = 'mur_late_save_v1_backup';

const VALID_WEATHERS: WeatherType[] = ['sunny', 'rainy', 'snowy'];
const VALID_GUEST_IDS: GuestId[] = [
  'puh',
  'persyk',
  'luna',
  'marsel',
  'sofiya',
  'miya',
  'mandrivnyk',
];
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
