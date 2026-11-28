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
  | 'golden_cocoa'
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

export type BirthdayThemeId = 'strawberry' | 'space' | 'forest';

export type BirthdayStoryStatus = 'not_started' | 'active' | 'completed';

export interface PuhBirthdayStoryState {
  status: BirthdayStoryStatus;
  /** Currently chosen (or last celebrated) theme: strawberry | space | forest */
  theme: BirthdayThemeId | null;
  /** Current chapter day (1 = prep, 2 = rehearsal, 3 = Puff's Birthday Party!) */
  stageDay: 1 | 2 | 3;
  /** Whether today's themed story order has already been served */
  storyOrderServedToday: boolean;
  /** All themes completed so far (unlocks their permanent collectible postcards!) */
  completedThemes: BirthdayThemeId[];
  /** Allows keeping festive birthday bunting up in the café after completing the chapter */
  keepDecorEnabled: boolean;
  /** Idempotent guard preventing duplicate +40 fish finale gift across reloads */
  finaleRewardClaimed: boolean;
}

export type RecipeMysteryStatus = 'not_started' | 'active' | 'completed';

export type MysteryDay1ChoiceId =
  | 'sweet_cocoa'
  | 'spiced_cozy'
  | 'fluffy_cloud';

export type MysteryDay2ChoiceId =
  | 'starlight_name'
  | 'warm_paw_name'
  | 'golden_mur_name';

export type RecipeMysteryRole =
  | 'mystery_day1_marsel'
  | 'mystery_day2_sofiya'
  | 'mystery_day2_persyk'
  | 'mystery_day3_finale';

export interface RecipeMysteryStoryState {
  status: RecipeMysteryStatus;
  /** 1 = Marsel's torn page (Clue 1), 2 = Sofiya & Persyk (Clues 2 & 3), 3 = Detective Finale! */
  stageDay: 1 | 2 | 3;
  /** Discovered clue numbers (1..3) */
  discoveredClues: number[];
  /** Scripted mystery roles already served during the current day */
  servedStepsToday: RecipeMysteryRole[];
  /** Remembered player intuition choice from Day 1 dialogue with Marsel */
  day1Choice: MysteryDay1ChoiceId | null;
  /** Remembered player nickname choice from Day 2 dialogue with Sofiya */
  day2Choice: MysteryDay2ChoiceId | null;
  /** Idempotent guard preventing duplicate +45 fish finale bonus across reloads */
  finaleRewardClaimed: boolean;
  /** Shows the permanent Golden Recipe Book & Magnifier souvenir on the counter */
  showCounterSouvenir: boolean;
}

export type FriendshipMomentId =
  | 'persyk_to_sofiya'
  | 'miya_to_puh'
  | 'luna_to_marsel'
  | 'sofiya_to_miya';

export interface PendingFriendGift {
  momentId: FriendshipMomentId;
  fromGuestId: RegularGuestId;
  toGuestId: RegularGuestId;
  wishText?: string;
}

export interface LivingFriendshipState {
  /** Active gift waiting to be received by the partner friend on the very next visit! */
  pendingGift: PendingFriendGift | null;
  /** Unique cross-guest friendship stories experienced so far (for Friendship Album) */
  completedMoments: FriendshipMomentId[];
  /** Total cozy flavor-mood riddles solved by the player */
  moodRiddlesSolved: number;
}

export type WallFrameStyle = 'honey_wood' | 'blush_ribbon' | 'golden_stars';

export interface WallArtState {
  /** Compact WebP/PNG dataURL (<= 65KB) painted by the player and hung on the café wall */
  dataUrl: string | null;
  title: string;
  frameStyle: WallFrameStyle;
  visible: boolean;
}

export interface MarzipanCareState {
  treatsGiven: number;
  yarnGamesPlayed: number;
  petsCount: number;
  /** Day number when the daily +5 fish yarn-game coin surprise was last awarded */
  lastPlayRewardDay: number;
}

export interface CafeLetter {
  /** Stable unique ID (preserved in saveState.readLetterIds) */
  id: string;
  fromName: string;
  fromEmoji: string;
  title: string;
  body: string;
  stampEmoji: string;
  /** Day number from which this letter arrives in the mailbox (1 = immediately) */
  unlockMinDay: number;
  /** Optional minimum total guests served required */
  unlockMinServed?: number;
  paperTint?: 'cream' | 'blush' | 'mint' | 'lavender';
}

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
  /** Step 05: Present when this guest's order is part of Puff's Birthday Story Chapter */
  birthdayStoryRole?: 'prep_day1' | 'prep_day2' | 'finale_party';
  birthdayTheme?: BirthdayThemeId;
  /** Chapter 2: Present when this guest's visit is part of «Таємниця загубленого рецепта» */
  mysteryRole?: RecipeMysteryRole;
  /** Living Friendship: 2-step cross-guest gift exchange */
  friendGiftRole?: 'send' | 'receive';
  friendGiftMomentId?: FriendshipMomentId;
  friendGiftPartnerId?: RegularGuestId;
  friendGiftWishText?: string;
  /** Living Friendship: Cozy mood-description flavor riddle */
  isMoodRiddle?: boolean;
  moodRiddlePrompt?: string;
}

export interface ValidationResult {
  ok: boolean;
  isPuhCoffeeReject?: boolean;
  feedback: string;
}

/** Full localStorage persistence schema (v6: Phase 1–3 + Day Director + Birthday Story + Personalization & Marzipan) */
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
  /** Step 05: First Story Chapter — «День народження Пуха» (3 days, 3 themes) */
  puhBirthday: PuhBirthdayStoryState;
  /** Chapter 2: Detective Story — «Таємниця загубленого рецепта» (3 days + choices + Golden Cocoa) */
  recipeMystery: RecipeMysteryStoryState;
  /** Living Friendship: Cross-guest secret gifts & mood riddles progress */
  livingFriendship: LivingFriendshipState;
  /** Step 06: Personalization — read letter IDs, child's framed wall art & Marzipan care */
  readLetterIds: string[];
  wallArt: WallArtState;
  marzipanCare: MarzipanCareState;
}
