export type WeatherType = 'sunny' | 'rainy' | 'snowy';

export type HotIngredientId =
  | 'espresso'
  | 'hotWater'
  | 'warmMilk'
  | 'foam'
  | 'cocoa'
  | 'cinnamon'
  | 'marshmallow'
  | 'matcha';

export type TallGlassIngredientId =
  | 'ice'
  | 'soda'
  | 'orangeJuice'
  | 'strawberrySyrup'
  | 'mint'
  | 'lemon';

export type BlenderIngredientId =
  | 'coldMilk'
  | 'iceCream'
  | 'strawberrySyrup';

export type BaseStickerId =
  | 'paw'
  | 'heart'
  | 'crown'
  | 'star'
  | 'cat'
  | 'flower'
  | 'rainbow';

export type RareStickerId =
  | 'mushroom'
  | 'moon_cat'
  | 'clover'
  | 'butterfly'
  | 'pinecone';

export type StickerId = BaseStickerId | RareStickerId;

export interface PlacedSticker {
  id: string;
  stickerId: StickerId;
  /** Relative coordinates (0..100%) on the cup decoration area */
  x: number;
  y: number;
  rotation: number;
}

export interface TakeawayDecoration {
  stickers: PlacedSticker[];
  wishText: string;
}

export type PreparedHotDrink = {
  category: 'hot';
  ingredients: Partial<Record<HotIngredientId, number>>;
  /** Saved dataURL of player's foam drawing from «Лате-арт» */
  latteArtDataUrl?: string;
  /** Present when packed in «Із собою» paper cup */
  takeaway?: TakeawayDecoration;
};

export type PreparedCocktailDrink = {
  category: 'cocktail';
  ingredients: Partial<Record<TallGlassIngredientId, number>>;
  takeaway?: TakeawayDecoration;
};

export type PreparedMilkshakeDrink = {
  category: 'milkshake';
  blenderIngredients: Partial<Record<BlenderIngredientId, number>>;
  whippedCream: boolean;
  takeaway?: TakeawayDecoration;
};

export type PreparedDrink =
  | PreparedHotDrink
  | PreparedCocktailDrink
  | PreparedMilkshakeDrink;

export type DonutGlaze = 'none' | 'pink' | 'chocolate';

export type PreparedPastry =
  | { type: 'croissant'; warmed: boolean }
  | { type: 'cookie' }
  | { type: 'donut'; glaze: DonutGlaze; sprinkles: boolean }
  | { type: 'carrot_cake' };

export type DrinkRecipeId =
  | 'espresso'
  | 'americano'
  | 'cappuccino'
  | 'cappuccino_cinnamon'
  | 'latte'
  | 'babyccino'
  | 'cocoa_marshmallow'
  | 'matcha_latte'
  | 'strawberry_milkshake'
  | 'kids_mojito'
  | 'sunrise';

export type PastryRecipeId =
  | 'croissant'
  | 'warm_croissant'
  | 'chocolate_cookie'
  | 'donut_pink'
  | 'donut_pink_sprinkles'
  | 'donut_chocolate'
  | 'donut_chocolate_sprinkles'
  | 'carrot_cake';

export type RegularGuestId =
  | 'puh'
  | 'persyk'
  | 'luna'
  | 'marsel'
  | 'sofiya'
  | 'miya';

export type GuestId = RegularGuestId | 'mandrivnyk';

export type GuestEmotion = 'waiting' | 'happy' | 'surprised' | 'no_coffee';

export type StationTab = 'hot' | 'cold' | 'pastry';

export type ServiceMode = 'dine-in' | 'takeaway';

export type TravelerWishCategory = 'hot' | 'cold' | 'pastry';

export type MarzipanAccessorySlot = 'head' | 'eyes' | 'neck';

export type MarzipanHeadAccessoryId = 'chef_hat' | 'gold_crown';
export type MarzipanEyesAccessoryId = 'heart_glasses';
export type MarzipanNeckAccessoryId = 'red_bowtie' | 'knit_scarf';

export type MarzipanAccessoryId =
  | MarzipanHeadAccessoryId
  | MarzipanEyesAccessoryId
  | MarzipanNeckAccessoryId;

export interface MarzipanEquipped {
  head: MarzipanHeadAccessoryId | null;
  eyes: MarzipanEyesAccessoryId | null;
  neck: MarzipanNeckAccessoryId | null;
}

export type CafeDecorId =
  | 'daisy_vase'
  | 'twinkle_stars'
  | 'cat_clock'
  | 'music_box';

export type UnlockableRecipeId = 'matcha_latte' | 'carrot_cake';

export type DayThemeId =
  | 'honey_morning'
  | 'rainy_cocoa'
  | 'berry_breeze'
  | 'snowy_cozy'
  | 'pastry_fair'
  | 'starlight_friends';

export type DayPhase = 'morning' | 'open' | 'evening';

export interface DayProgressState {
  dayNumber: number;
  themeId: DayThemeId;
  phase: DayPhase;
  guestsTarget: number;
  guestsServedToday: GuestId[];
  coinsEarnedToday: number;
  latteArtToday: number;
  takeawayToday: number;
  travelerVisitedToday: boolean;
  newBestFriendsToday: RegularGuestId[];
  /** Idempotent guard: prevents duplicate +20 fish evening bonus across reloads */
  eveningBonusClaimed: boolean;
  /** Idempotent guard: prevents duplicate diary entries across reloads */
  eveningEntryRecorded: boolean;
}

export interface DayMemoryEntry {
  dayNumber: number;
  themeId: DayThemeId;
  weather: WeatherType;
  guestsServed: GuestId[];
  coinsEarned: number;
  latteArtCount: number;
  takeawayCount: number;
  highlight: string;
}

export interface SecretDrinkRecipe {
  name: string;
  icon: string;
  accentColor: string;
  category: 'hot' | 'cocktail' | 'milkshake';
  hotIngredients?: Partial<Record<HotIngredientId, number>>;
  cocktailIngredients?: TallGlassIngredientId[];
  milkshakeIngredients?: BlenderIngredientId[];
  needsWhippedCream?: boolean;
}

export interface Order {
  id: number;
  guestId: GuestId;
  /** Standard recipe ID, `'secret_daily'`, or `'traveler_any'` for special kindness guest */
  drinkId: DrinkRecipeId | 'secret_daily' | 'traveler_any';
  /** Snapshot of the secret drink requested by this guest */
  secretDrink?: SecretDrinkRecipe;
  pastryId?: PastryRecipeId;
  isCombo: boolean;
  weatherAtArrival: WeatherType;
  serviceMode: ServiceMode;
  wantsLatteArt?: boolean;
  /** True when the special Traveler Cat «Котик-мандрівник» visits */
  isTravelerGuest?: boolean;
  /** What category the Traveler Cat kindly asks for */
  travelerWishCategory?: TravelerWishCategory;
}

export interface ValidationResult {
  ok: boolean;
  isPuhCoffeeReject?: boolean;
  feedback: string;
}

/** Full localStorage persistence schema (v4: Phase 1–3 + Minimal Day Director) */
export interface CafeSaveState {
  version: number;
  coins: number;
  servedCount: number;
  weather: WeatherType;
  muted: boolean;
  /** Number of served orders per guest (3+ unlocks Best Friend!) */
  friendship: Partial<Record<GuestId, number>>;
  /** Legacy field preserved for migration compatibility */
  marzipanOutfitId: string;
  /** Player's custom «Секретний напій дня» */
  secretDrink: SecretDrinkRecipe | null;
  /** Phase 3: Marzipan's Wardrobe */
  ownedAccessories: MarzipanAccessoryId[];
  equippedAccessories: MarzipanEquipped;
  /** Phase 3: Cafe Interior Decor */
  ownedDecor: CafeDecorId[];
  enabledDecor: CafeDecorId[];
  /** Phase 3: Unlockable Shop Recipes */
  unlockedRecipes: UnlockableRecipeId[];
  /** Phase 3: Rare Exclusive Stickers gifted by Traveler Cat */
  unlockedRareStickers: RareStickerId[];
  /** Phase 3: Cozy Web Audio Music Box play/pause state */
  musicBoxPlaying: boolean;
  /** Phase 3: Number of times player treated the Traveler Cat */
  travelerVisits: number;
  /** Step 04: Minimal Day Director — current day progress & evening memory diary */
  dayProgress: DayProgressState;
  dayHistory: DayMemoryEntry[];
}
