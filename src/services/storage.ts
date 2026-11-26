import type {
  CafeDecorId,
  CafeSaveState,
  MarzipanAccessoryId,
  MarzipanEquipped,
  MarzipanEyesAccessoryId,
  MarzipanHeadAccessoryId,
  MarzipanNeckAccessoryId,
  RareStickerId,
  SecretDrinkRecipe,
  UnlockableRecipeId,
  WeatherType,
} from '../types/game';

const STORAGE_KEY = 'mur_late_save_v1';

const VALID_WEATHERS: WeatherType[] = ['sunny', 'rainy', 'snowy'];
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
  version: 3,
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

function sanitizeSecretDrink(raw: unknown): SecretDrinkRecipe | null {
  if (!raw || typeof raw !== 'object') return null;
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

  return {
    name: candidate.name.trim().slice(0, 32),
    icon: typeof candidate.icon === 'string' && candidate.icon ? candidate.icon : '⭐',
    accentColor:
      typeof candidate.accentColor === 'string' && candidate.accentColor
        ? candidate.accentColor
        : '#E8A84C',
    category: candidate.category,
    hotIngredients: candidate.hotIngredients,
    cocktailIngredients: Array.isArray(candidate.cocktailIngredients)
      ? candidate.cocktailIngredients
      : undefined,
    milkshakeIngredients: Array.isArray(candidate.milkshakeIngredients)
      ? candidate.milkshakeIngredients
      : undefined,
    needsWhippedCream: Boolean(candidate.needsWhippedCream),
  };
}

export function loadCafeSave(): CafeSaveState {
  if (typeof window === 'undefined') return DEFAULT_SAVE_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SAVE_STATE;
    const parsed = JSON.parse(raw) as Partial<CafeSaveState>;

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
    const friendship =
      parsed.friendship && typeof parsed.friendship === 'object'
        ? parsed.friendship
        : {};
    const marzipanOutfitId =
      typeof parsed.marzipanOutfitId === 'string'
        ? parsed.marzipanOutfitId
        : 'default';
    const secretDrink = sanitizeSecretDrink(parsed.secretDrink);

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
    const musicBoxPlaying =
      Boolean(parsed.musicBoxPlaying) && enabledDecor.includes('music_box');
    const travelerVisits =
      typeof parsed.travelerVisits === 'number' &&
      Number.isFinite(parsed.travelerVisits) &&
      parsed.travelerVisits >= 0
        ? Math.floor(parsed.travelerVisits)
        : 0;

    return {
      version: 3,
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
    };
  } catch {
    return DEFAULT_SAVE_STATE;
  }
}

export function saveCafeProgress(state: CafeSaveState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or private-mode errors gracefully
  }
}
