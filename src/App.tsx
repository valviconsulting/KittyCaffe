import { MotionConfig } from 'framer-motion';
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  CafeHallScene,
  type CelebrationBanner,
} from './components/cafe/CafeHallScene';
import { TopBar } from './components/cafe/TopBar';
import { ColdDrinksStation } from './components/stations/ColdDrinksStation';
import { HotDrinksStation } from './components/stations/HotDrinksStation';
import { PastryStation } from './components/stations/PastryStation';
import { StationTabs } from './components/stations/StationTabs';
import {
  BEST_FRIEND_THRESHOLD,
  GUESTS,
  REGULAR_GUEST_IDS,
  buildOrderGreeting,
  buildOrderPraise,
  generateOrder,
  isBestFriend,
} from './data/guests';
import {
  HOT_INGREDIENTS,
  canDoLatteArt,
  getOrderDrinkName,
  hasBlenderIngredients,
  hasHotIngredients,
  hasTallIngredients,
  validateOrder,
} from './data/recipes';
import { MARZIPAN_WARDROBE } from './data/shop';
import { RARE_STICKER_CATALOG, RARE_STICKER_ORDER } from './data/stickers';
import { getNextWeather } from './data/weather';
import { sound } from './services/sound';
import type { DayJournalMode } from './components/modals/DayJournalModal';
import {
  DEFAULT_SAVE_STATE,
  loadCafeSaveWithStatus,
  saveCafeProgress,
} from './services/storage';
import type {
  BlenderIngredientId,
  CafeDecorId,
  CafeSaveState,
  DayProgressState,
  DonutGlaze,
  GuestEmotion,
  HotIngredientId,
  MarzipanAccessoryId,
  Order,
  PreparedDrink,
  PreparedPastry,
  SecretDrinkRecipe,
  StationTab,
  TakeawayDecoration,
  TallGlassIngredientId,
  UnlockableRecipeId,
  WeatherType,
} from './types/game';
import {
  advanceToNextDay,
  completeDayIntoEvening,
  createFreshDayProgress,
  isDayTargetReached,
  isLateAfternoon,
  recordServedGuestInDay,
} from './utils/dayDirector';

// Lazy-loaded modal flows so initial mobile bundle stays light & fast
const RecipeBookModal = lazy(() =>
  import('./components/modals/RecipeBookModal').then((m) => ({
    default: m.RecipeBookModal,
  }))
);
const LatteArtModal = lazy(() =>
  import('./components/modals/LatteArtModal').then((m) => ({
    default: m.LatteArtModal,
  }))
);
const TakeawayCupModal = lazy(() =>
  import('./components/modals/TakeawayCupModal').then((m) => ({
    default: m.TakeawayCupModal,
  }))
);
const SecretDrinkModal = lazy(() =>
  import('./components/modals/SecretDrinkModal').then((m) => ({
    default: m.SecretDrinkModal,
  }))
);
const ShopModal = lazy(() =>
  import('./components/modals/ShopModal').then((m) => ({
    default: m.ShopModal,
  }))
);
const FriendshipAlbumModal = lazy(() =>
  import('./components/modals/FriendshipAlbumModal').then((m) => ({
    default: m.FriendshipAlbumModal,
  }))
);
const BackupModal = lazy(() =>
  import('./components/modals/BackupModal').then((m) => ({
    default: m.BackupModal,
  }))
);
const DayJournalModal = lazy(() =>
  import('./components/modals/DayJournalModal').then((m) => ({
    default: m.DayJournalModal,
  }))
);

export function App() {
  // Safe initial load from localStorage (never silently overwrites corrupted or future-version saves!)
  const [initialLoad] = useState(() => {
    const loaded = loadCafeSaveWithStatus();
    sound.setMuted(loaded.state.muted);
    // Reload-safe evening recovery: if player served 5/5 guests & reloaded before evening opened,
    // settle evening idempotently ONCE without duplicating bonus coins or diary history.
    if (
      loaded.state.dayProgress.phase === 'open' &&
      isDayTargetReached(loaded.state.dayProgress)
    ) {
      const { nextDay, nextHistory, bonusCoins } = completeDayIntoEvening(
        loaded.state.dayProgress,
        loaded.state.dayHistory,
        loaded.state.weather
      );
      return {
        ...loaded,
        state: {
          ...loaded.state,
          coins: loaded.state.coins + bonusCoins,
          dayProgress: nextDay,
          dayHistory: nextHistory,
        },
        forceInitialPersist: true,
      };
    }
    return { ...loaded, forceInitialPersist: false };
  });

  const [saveState, setSaveState] = useState<CafeSaveState>(initialLoad.state);
  const canAutoSaveRef = useRef<boolean>(initialLoad.canAutoSave);
  const [storageWarning, setStorageWarning] = useState<string | null>(() => {
    if (initialLoad.status === 'newer_version') {
      return 'Знайдено збереження з новішої версії гри. Його резервну копію збережено — автозапис призупинено, доки ти не відновиш або не скинеш прогрес у «💾 Сейв».';
    }
    if (initialLoad.status === 'corrupted') {
      return 'Попереднє збереження було пошкоджене (оригінал збережено в резервному ключі). Можеш завантажити резервний файл у «💾 Сейв».';
    }
    return null;
  });

  // Current order & guest mood
  const [order, setOrder] = useState<Order>(() =>
    generateOrder(
      initialLoad.state.servedCount + 1,
      initialLoad.state.weather,
      undefined,
      {
        secretDrink: initialLoad.state.secretDrink,
        unlockedRecipes: initialLoad.state.unlockedRecipes,
      }
    )
  );
  const [emotion, setEmotion] = useState<GuestEmotion>('waiting');
  const [speechText, setSpeechText] = useState<string>(() =>
    buildOrderGreeting(
      order,
      getOrderDrinkName(order),
      initialLoad.state.weather
    )
  );
  const [lastReward, setLastReward] = useState<number | null>(null);
  const [celebration, setCelebration] = useState<CelebrationBanner | null>(null);
  const [hasNewBestFriend, setHasNewBestFriend] = useState<boolean>(false);

  // Modals & UI state
  const [isRecipeBookOpen, setIsRecipeBookOpen] = useState<boolean>(false);
  const [isLatteArtOpen, setIsLatteArtOpen] = useState<boolean>(false);
  const [isSecretCreatorOpen, setIsSecretCreatorOpen] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isFriendshipAlbumOpen, setIsFriendshipAlbumOpen] =
    useState<boolean>(false);
  const [isBackupOpen, setIsBackupOpen] = useState<boolean>(false);
  const [isDiaryOpen, setIsDiaryOpen] = useState<boolean>(false);
  const [pendingTakeawayDrink, setPendingTakeawayDrink] =
    useState<PreparedDrink | null>(null);
  const [pendingTakeawaySource, setPendingTakeawaySource] = useState<
    'hot' | 'cold' | null
  >(null);

  const [activeTab, setActiveTab] = useState<StationTab>('hot');
  const [marzipanPurring, setMarzipanPurring] = useState<boolean>(false);

  // Serving Tray
  const [trayDrink, setTrayDrink] = useState<PreparedDrink | null>(null);
  const [trayPastry, setTrayPastry] = useState<PreparedPastry | null>(null);

  // Station 1: Hot Drinks + Latte Art
  const [hotIngredients, setHotIngredients] = useState<
    Partial<Record<HotIngredientId, number>>
  >({});
  const [hotLatteArtUrl, setHotLatteArtUrl] = useState<string | undefined>(
    undefined
  );

  // Station 2: Cold Drinks & Blender
  const [coldGlassMode, setColdGlassMode] = useState<
    'empty' | 'cocktail' | 'milkshake'
  >('empty');
  const [cocktailIngredients, setCocktailIngredients] = useState<
    Partial<Record<TallGlassIngredientId, number>>
  >({});
  const [blenderIngredients, setBlenderIngredients] = useState<
    Partial<Record<BlenderIngredientId, number>>
  >({});
  const [pouredMilkshakeIngredients, setPouredMilkshakeIngredients] = useState<
    Partial<Record<BlenderIngredientId, number>>
  >({});
  const [whippedCream, setWhippedCream] = useState<boolean>(false);
  const [isBlending, setIsBlending] = useState<boolean>(false);

  // Station 3: Pastries
  const [selectedPastry, setSelectedPastry] = useState<PreparedPastry | null>(
    null
  );
  const [isOvenWarming, setIsOvenWarming] = useState<boolean>(false);
  const [ovenProgress, setOvenProgress] = useState<number>(0);

  // Refs synced with latest state for timers & StrictMode-pure atomic transitions
  const orderRef = useRef<Order>(order);
  const servedOrderIdRef = useRef<number | null>(null);
  const weatherRef = useRef<WeatherType>(saveState.weather);
  const secretDrinkRef = useRef<SecretDrinkRecipe | null>(saveState.secretDrink);
  const unlockedRecipesRef = useRef<UnlockableRecipeId[]>(
    saveState.unlockedRecipes
  );
  const dayProgressRef = useRef<DayProgressState>(saveState.dayProgress);
  const forceNextSecretRef = useRef<boolean>(false);
  const forceNextRecipeRef = useRef<UnlockableRecipeId | null>(null);
  const isFirstSaveEffectRef = useRef<boolean>(true);

  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  useEffect(() => {
    weatherRef.current = saveState.weather;
    secretDrinkRef.current = saveState.secretDrink;
    unlockedRecipesRef.current = saveState.unlockedRecipes;
    dayProgressRef.current = saveState.dayProgress;
  }, [
    saveState.weather,
    saveState.secretDrink,
    saveState.unlockedRecipes,
    saveState.dayProgress,
  ]);

  // Persist saveState cleanly whenever progress changes (never clobbering unreadable saves on mount!)
  useEffect(() => {
    if (isFirstSaveEffectRef.current) {
      isFirstSaveEffectRef.current = false;
      if (initialLoad.status !== 'migrated' && !initialLoad.forceInitialPersist) {
        return;
      }
    }
    if (!canAutoSaveRef.current) return;
    saveCafeProgress(saveState);
  }, [saveState, initialLoad.status, initialLoad.forceInitialPersist]);

  // Sync Cozy Web Audio Music Box with decor + mute state
  useEffect(() => {
    const shouldPlay =
      !saveState.muted &&
      saveState.enabledDecor.includes('music_box') &&
      saveState.musicBoxPlaying;
    sound.setMusicBoxEnabled(shouldPlay);
    return () => {
      sound.setMusicBoxEnabled(false);
    };
  }, [saveState.muted, saveState.enabledDecor, saveState.musicBoxPlaying]);

  // Cleanup active timers on unmount
  const marzipanTimerRef = useRef<number | null>(null);
  const nextGuestTimerRef = useRef<number | null>(null);
  const blendTimerRef = useRef<number | null>(null);
  const ovenIntervalRef = useRef<number | null>(null);
  const ovenTimerRef = useRef<number | null>(null);
  const celebrationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (marzipanTimerRef.current) window.clearTimeout(marzipanTimerRef.current);
      if (nextGuestTimerRef.current) window.clearTimeout(nextGuestTimerRef.current);
      if (blendTimerRef.current) window.clearTimeout(blendTimerRef.current);
      if (ovenIntervalRef.current) window.clearInterval(ovenIntervalRef.current);
      if (ovenTimerRef.current) window.clearTimeout(ovenTimerRef.current);
      if (celebrationTimerRef.current)
        window.clearTimeout(celebrationTimerRef.current);
    };
  }, []);

  const showCelebration = useCallback(
    (banner: Omit<CelebrationBanner, 'id'>) => {
      setCelebration({ ...banner, id: Date.now() });
      if (celebrationTimerRef.current) {
        window.clearTimeout(celebrationTimerRef.current);
      }
      celebrationTimerRef.current = window.setTimeout(() => {
        setCelebration(null);
      }, 4200);
    },
    []
  );

  const dayJournalMode: DayJournalMode | null =
    saveState.dayProgress.phase === 'morning'
      ? 'morning'
      : saveState.dayProgress.phase === 'evening'
        ? 'evening'
        : isDiaryOpen
          ? 'diary'
          : null;

  const anyModalOpen =
    isRecipeBookOpen ||
    isLatteArtOpen ||
    isSecretCreatorOpen ||
    isShopOpen ||
    isFriendshipAlbumOpen ||
    isBackupOpen ||
    dayJournalMode !== null ||
    Boolean(pendingTakeawayDrink);

  // Advance to next guest OR settle the Evening Memory Diary when all 5 guests of the day are served
  const goToNextGuest = useCallback(() => {
    if (nextGuestTimerRef.current) {
      window.clearTimeout(nextGuestTimerRef.current);
      nextGuestTimerRef.current = null;
    }

    if (isDayTargetReached(dayProgressRef.current)) {
      canAutoSaveRef.current = true;
      setSaveState((prev) => {
        const { nextDay, nextHistory, bonusCoins } = completeDayIntoEvening(
          prev.dayProgress,
          prev.dayHistory,
          prev.weather
        );
        return {
          ...prev,
          coins: prev.coins + bonusCoins,
          dayProgress: nextDay,
          dayHistory: nextHistory,
        };
      });
      setEmotion('waiting');
      setLastReward(null);
      setTrayDrink(null);
      setTrayPastry(null);
      sound.playBestFriendFanfare();
      return;
    }

    const prevOrder = orderRef.current;
    const currentWeather = weatherRef.current;
    const currentSecret = secretDrinkRef.current;
    const currentUnlocked = unlockedRecipesRef.current;
    const forceSecret = forceNextSecretRef.current && Boolean(currentSecret);
    forceNextSecretRef.current = false;
    const forceRecipe = forceNextRecipeRef.current;
    forceNextRecipeRef.current = null;

    const next = generateOrder(
      prevOrder.id + 1,
      currentWeather,
      prevOrder.guestId,
      {
        secretDrink: currentSecret,
        forceSecretDrink: forceSecret,
        unlockedRecipes: currentUnlocked,
        forceUnlockedRecipe: forceRecipe,
      }
    );
    orderRef.current = next;
    servedOrderIdRef.current = null;
    setOrder(next);
    setSpeechText(
      buildOrderGreeting(next, getOrderDrinkName(next), currentWeather)
    );
    setEmotion('waiting');
    setLastReward(null);
    setTrayDrink(null);
    setTrayPastry(null);
    if (next.isTravelerGuest) {
      sound.playTravelerBell();
    } else {
      sound.playGuestBell();
    }
  }, []);

  // Auto-advance after 2.8s when happy (pauses if any modal is open)
  useEffect(() => {
    if (emotion !== 'happy' || anyModalOpen) {
      if (nextGuestTimerRef.current) {
        window.clearTimeout(nextGuestTimerRef.current);
        nextGuestTimerRef.current = null;
      }
      return;
    }

    nextGuestTimerRef.current = window.setTimeout(() => {
      goToNextGuest();
    }, 2800);

    return () => {
      if (nextGuestTimerRef.current) {
        window.clearTimeout(nextGuestTimerRef.current);
        nextGuestTimerRef.current = null;
      }
    };
  }, [emotion, anyModalOpen, goToNextGuest]);

  // StrictMode-pure handlers (zero side effects inside state updaters!)
  const handleCycleWeather = () => {
    sound.playPop();
    const nextWeather = getNextWeather(weatherRef.current);
    weatherRef.current = nextWeather;
    canAutoSaveRef.current = true;
    setSaveState((prev) => ({ ...prev, weather: nextWeather }));
    if (emotion === 'waiting') {
      const currentOrder = orderRef.current;
      setSpeechText(
        buildOrderGreeting(
          currentOrder,
          getOrderDrinkName(currentOrder),
          nextWeather
        )
      );
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !saveState.muted;
    sound.setMuted(nextMuted);
    if (!nextMuted) sound.playPop();
    canAutoSaveRef.current = true;
    setSaveState((prev) => ({ ...prev, muted: nextMuted }));
  };

  const handlePetMarzipan = () => {
    sound.playPurr();
    setMarzipanPurring(true);
    if (marzipanTimerRef.current) window.clearTimeout(marzipanTimerRef.current);
    marzipanTimerRef.current = window.setTimeout(() => {
      setMarzipanPurring(false);
    }, 1700);
  };

  const handleSaveSecretDrink = (recipe: SecretDrinkRecipe) => {
    secretDrinkRef.current = recipe;
    forceNextSecretRef.current = true;
    canAutoSaveRef.current = true;
    setSaveState((prev) => ({
      ...prev,
      secretDrink: recipe,
    }));
    setIsSecretCreatorOpen(false);
  };

  const handleStartMorningDay = () => {
    canAutoSaveRef.current = true;
    setSaveState((prev) => ({
      ...prev,
      dayProgress: { ...prev.dayProgress, phase: 'open' },
    }));
    if (orderRef.current.isTravelerGuest) {
      sound.playTravelerBell();
    } else {
      sound.playGuestBell();
    }
  };

  const handleAdvanceNextDay = () => {
    const { nextDay, suggestedWeather } = advanceToNextDay(
      saveState.dayProgress
    );
    canAutoSaveRef.current = true;
    weatherRef.current = suggestedWeather;
    dayProgressRef.current = nextDay;

    const freshOrder = generateOrder(
      saveState.servedCount + 1,
      suggestedWeather,
      orderRef.current.guestId,
      {
        secretDrink: secretDrinkRef.current,
        unlockedRecipes: unlockedRecipesRef.current,
      }
    );
    orderRef.current = freshOrder;
    servedOrderIdRef.current = null;
    setOrder(freshOrder);
    setEmotion('waiting');
    setLastReward(null);
    setTrayDrink(null);
    setTrayPastry(null);
    setSpeechText(
      buildOrderGreeting(
        freshOrder,
        getOrderDrinkName(freshOrder),
        suggestedWeather
      )
    );
    setSaveState((prev) => ({
      ...prev,
      weather: suggestedWeather,
      dayProgress: nextDay,
    }));
    sound.playSecretSaved();
  };

  const handleImportSave = (imported: CafeSaveState) => {
    canAutoSaveRef.current = true;
    setStorageWarning(null);
    setIsDiaryOpen(false);
    sound.setMuted(imported.muted);
    weatherRef.current = imported.weather;
    secretDrinkRef.current = imported.secretDrink;
    unlockedRecipesRef.current = imported.unlockedRecipes;
    dayProgressRef.current = imported.dayProgress;
    setSaveState(imported);
    saveCafeProgress(imported);

    const freshOrder = generateOrder(
      imported.servedCount + 1,
      imported.weather,
      undefined,
      {
        secretDrink: imported.secretDrink,
        unlockedRecipes: imported.unlockedRecipes,
      }
    );
    orderRef.current = freshOrder;
    servedOrderIdRef.current = null;
    setOrder(freshOrder);
    setEmotion('waiting');
    setLastReward(null);
    setTrayDrink(null);
    setTrayPastry(null);
    setSpeechText(
      buildOrderGreeting(
        freshOrder,
        getOrderDrinkName(freshOrder),
        imported.weather
      )
    );
  };

  const handleResetSave = () => {
    handleImportSave({
      ...DEFAULT_SAVE_STATE,
      equippedAccessories: { ...DEFAULT_SAVE_STATE.equippedAccessories },
      friendship: {},
      dayProgress: createFreshDayProgress(1, 'open'),
      dayHistory: [],
    });
  };

  // --- Phase 3: Shop & Marzipan Wardrobe Handlers (StrictMode-pure) ---
  const handleBuyAccessory = (id: MarzipanAccessoryId, price: number) => {
    const itemMeta = MARZIPAN_WARDROBE.find((w) => w.id === id);
    if (
      !itemMeta ||
      saveState.ownedAccessories.includes(id) ||
      saveState.coins < price
    ) {
      return;
    }
    canAutoSaveRef.current = true;
    setSaveState((prev) => {
      if (prev.ownedAccessories.includes(id) || prev.coins < price) return prev;
      const nextEquipped = { ...prev.equippedAccessories };
      if (itemMeta.slot === 'head') {
        nextEquipped.head = id as 'chef_hat' | 'gold_crown';
      } else if (itemMeta.slot === 'eyes') {
        nextEquipped.eyes = id as 'heart_glasses';
      } else {
        nextEquipped.neck = id as 'red_bowtie' | 'knit_scarf';
      }
      return {
        ...prev,
        coins: prev.coins - price,
        ownedAccessories: [...prev.ownedAccessories, id],
        equippedAccessories: nextEquipped,
      };
    });
    sound.playShopBuy();
  };

  const handleToggleEquipAccessory = (id: MarzipanAccessoryId) => {
    const itemMeta = MARZIPAN_WARDROBE.find((w) => w.id === id);
    if (!itemMeta || !saveState.ownedAccessories.includes(id)) return;
    canAutoSaveRef.current = true;
    setSaveState((prev) => {
      if (!prev.ownedAccessories.includes(id)) return prev;
      const nextEquipped = { ...prev.equippedAccessories };
      if (itemMeta.slot === 'head') {
        nextEquipped.head =
          nextEquipped.head === id ? null : (id as 'chef_hat' | 'gold_crown');
      } else if (itemMeta.slot === 'eyes') {
        nextEquipped.eyes =
          nextEquipped.eyes === id ? null : (id as 'heart_glasses');
      } else {
        nextEquipped.neck =
          nextEquipped.neck === id ? null : (id as 'red_bowtie' | 'knit_scarf');
      }
      return { ...prev, equippedAccessories: nextEquipped };
    });
    sound.playPop();
  };

  const handleBuyDecor = (id: CafeDecorId, price: number) => {
    if (saveState.ownedDecor.includes(id) || saveState.coins < price) return;
    canAutoSaveRef.current = true;
    setSaveState((prev) => {
      if (prev.ownedDecor.includes(id) || prev.coins < price) return prev;
      return {
        ...prev,
        coins: prev.coins - price,
        ownedDecor: [...prev.ownedDecor, id],
        enabledDecor: [...prev.enabledDecor, id],
        musicBoxPlaying: id === 'music_box' ? true : prev.musicBoxPlaying,
      };
    });
    sound.playShopBuy();
  };

  const handleToggleDecor = (id: CafeDecorId) => {
    if (!saveState.ownedDecor.includes(id)) return;
    canAutoSaveRef.current = true;
    setSaveState((prev) => {
      if (!prev.ownedDecor.includes(id)) return prev;
      const isCurrentlyOn = prev.enabledDecor.includes(id);
      const nextEnabled = isCurrentlyOn
        ? prev.enabledDecor.filter((d) => d !== id)
        : [...prev.enabledDecor, id];
      return {
        ...prev,
        enabledDecor: nextEnabled,
        musicBoxPlaying:
          id === 'music_box' ? !isCurrentlyOn : prev.musicBoxPlaying,
      };
    });
    sound.playPop();
  };

  const handleToggleMusicBox = () => {
    if (!saveState.enabledDecor.includes('music_box')) return;
    canAutoSaveRef.current = true;
    setSaveState((prev) => {
      if (!prev.enabledDecor.includes('music_box')) return prev;
      return { ...prev, musicBoxPlaying: !prev.musicBoxPlaying };
    });
    sound.playPop();
  };

  const handleBuyRecipe = (id: UnlockableRecipeId, price: number) => {
    if (saveState.unlockedRecipes.includes(id) || saveState.coins < price) {
      return;
    }
    const nextUnlocked = [...saveState.unlockedRecipes, id];
    unlockedRecipesRef.current = nextUnlocked;
    forceNextRecipeRef.current = id;
    canAutoSaveRef.current = true;
    setSaveState((prev) => {
      if (prev.unlockedRecipes.includes(id) || prev.coins < price) return prev;
      return {
        ...prev,
        coins: prev.coins - price,
        unlockedRecipes: [...prev.unlockedRecipes, id],
      };
    });
    sound.playSecretSaved();
    showCelebration({
      icon: id === 'matcha_latte' ? '🍵' : '🥕',
      title:
        id === 'matcha_latte'
          ? 'Відкрито «Матча-Лате»!'
          : 'Відкрито «Морквяний кекс»!',
      subtitle:
        id === 'matcha_latte'
          ? 'Матча вже у 8-му слоті гарячих напоїв та Книзі рецептів!'
          : 'Морквяний кекс уже на вітрині випічки та в Книзі рецептів!',
      tone: 'recipe',
    });
  };

  // --- Station 1: Hot Drinks & Latte Art ---
  const handleAddHotIngredient = (id: HotIngredientId) => {
    const meta = HOT_INGREDIENTS.find((i) => i.id === id);
    const max = meta?.maxCount ?? 1;
    setHotIngredients((prev) => {
      const current = prev[id] ?? 0;
      if (current >= max) return prev;
      return { ...prev, [id]: current + 1 };
    });
    if (id === 'warmMilk' || id === 'foam') {
      sound.playMilkSteam();
    } else if (id === 'cinnamon' || id === 'marshmallow' || id === 'matcha') {
      sound.playPop();
    } else {
      sound.playPour();
    }
  };

  const handleSetWarmMilkCount = (count: number) => {
    const clamped = Math.max(0, Math.min(2, Math.round(count)));
    setHotIngredients((prev) => {
      if ((prev.warmMilk ?? 0) === clamped) return prev;
      if (clamped <= 0) {
        const next = { ...prev };
        delete next.warmMilk;
        return next;
      }
      return { ...prev, warmMilk: clamped };
    });
  };

  const handleRemoveHotIngredient = (id: HotIngredientId) => {
    const current = hotIngredients[id] ?? 0;
    const next = { ...hotIngredients };
    if (current <= 1) {
      delete next[id];
    } else {
      next[id] = current - 1;
    }
    setHotIngredients(next);
    if (!canDoLatteArt(next)) {
      setHotLatteArtUrl(undefined);
    }
    sound.playPop();
  };

  const handleClearHot = () => {
    setHotIngredients({});
    setHotLatteArtUrl(undefined);
    sound.playPop();
  };

  const handlePutHotOnTray = () => {
    if (!hasHotIngredients(hotIngredients)) return;
    const builtDrink: PreparedDrink = {
      category: 'hot',
      ingredients: { ...hotIngredients },
      latteArtDataUrl: hotLatteArtUrl,
    };

    if (order.serviceMode === 'takeaway' && !order.isTravelerGuest) {
      sound.playPop();
      setPendingTakeawayDrink(builtDrink);
      setPendingTakeawaySource('hot');
      return;
    }

    setTrayDrink(builtDrink);
    setHotIngredients({});
    setHotLatteArtUrl(undefined);
    if (emotion !== 'happy') setEmotion('waiting');
    sound.playTrayPlace();
  };

  // --- Station 2: Cold Drinks & Blender ---
  const handleAddCocktailIngredient = (id: TallGlassIngredientId) => {
    if (isBlending) return;
    setColdGlassMode('cocktail');
    setWhippedCream(false);
    setCocktailIngredients((prev) => ({ ...prev, [id]: 1 }));
    if (id === 'ice') {
      sound.playIce();
    } else if (id === 'mint' || id === 'lemon') {
      sound.playPop();
    } else {
      sound.playPour();
    }
  };

  const handleRemoveCocktailIngredient = (id: TallGlassIngredientId) => {
    const next = { ...cocktailIngredients };
    delete next[id];
    setCocktailIngredients(next);
    if (!hasTallIngredients(next)) {
      setColdGlassMode('empty');
    }
    sound.playPop();
  };

  const handleAddBlenderIngredient = (id: BlenderIngredientId) => {
    if (isBlending) return;
    setBlenderIngredients((prev) => ({ ...prev, [id]: 1 }));
    if (id === 'iceCream') {
      sound.playPop();
    } else {
      sound.playPour();
    }
  };

  const handleRemoveBlenderIngredient = (id: BlenderIngredientId) => {
    if (isBlending) return;
    setBlenderIngredients((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    sound.playPop();
  };

  const handleBlend = () => {
    if (!hasBlenderIngredients(blenderIngredients) || isBlending) return;
    const snapshot = { ...blenderIngredients };
    setIsBlending(true);
    sound.playBlender(1.5);

    if (blendTimerRef.current) window.clearTimeout(blendTimerRef.current);
    blendTimerRef.current = window.setTimeout(() => {
      setIsBlending(false);
      setCocktailIngredients({});
      setPouredMilkshakeIngredients(snapshot);
      setColdGlassMode('milkshake');
      setWhippedCream(false);
      setBlenderIngredients({});
      sound.playPour();
    }, 1500);
  };

  const handleToggleWhippedCream = () => {
    if (coldGlassMode !== 'milkshake' || isBlending) return;
    setWhippedCream((prev) => !prev);
    sound.playPop();
  };

  const handleClearCold = () => {
    if (isBlending) return;
    setColdGlassMode('empty');
    setCocktailIngredients({});
    setBlenderIngredients({});
    setPouredMilkshakeIngredients({});
    setWhippedCream(false);
    sound.playPop();
  };

  const handlePutColdOnTray = () => {
    if (isBlending) return;
    let builtDrink: PreparedDrink | null = null;

    if (coldGlassMode === 'cocktail' && hasTallIngredients(cocktailIngredients)) {
      builtDrink = {
        category: 'cocktail',
        ingredients: { ...cocktailIngredients },
      };
    } else if (coldGlassMode === 'milkshake') {
      builtDrink = {
        category: 'milkshake',
        blenderIngredients: { ...pouredMilkshakeIngredients },
        whippedCream,
      };
    }

    if (!builtDrink) return;

    if (order.serviceMode === 'takeaway' && !order.isTravelerGuest) {
      sound.playPop();
      setPendingTakeawayDrink(builtDrink);
      setPendingTakeawaySource('cold');
      return;
    }

    setTrayDrink(builtDrink);
    setCocktailIngredients({});
    setPouredMilkshakeIngredients({});
    setWhippedCream(false);
    setColdGlassMode('empty');
    if (emotion !== 'happy') setEmotion('waiting');
    sound.playTrayPlace();
  };

  // Complete «Із собою» sticker cup decoration
  const handleConfirmTakeaway = (decoration: TakeawayDecoration) => {
    if (!pendingTakeawayDrink) return;
    setTrayDrink({
      ...pendingTakeawayDrink,
      takeaway: decoration,
    });
    if (pendingTakeawaySource === 'hot') {
      setHotIngredients({});
      setHotLatteArtUrl(undefined);
    } else if (pendingTakeawaySource === 'cold') {
      setCocktailIngredients({});
      setPouredMilkshakeIngredients({});
      setWhippedCream(false);
      setColdGlassMode('empty');
    }
    setPendingTakeawayDrink(null);
    setPendingTakeawaySource(null);
    if (emotion !== 'happy') setEmotion('waiting');
  };

  // --- Station 3: Pastries ---
  const handleSelectPastryBase = (type: PreparedPastry['type']) => {
    if (isOvenWarming) return;
    sound.playPop();
    if (type === 'croissant') {
      setSelectedPastry({ type: 'croissant', warmed: false });
    } else if (type === 'cookie') {
      setSelectedPastry({ type: 'cookie' });
    } else if (type === 'carrot_cake') {
      setSelectedPastry({ type: 'carrot_cake' });
    } else {
      setSelectedPastry({ type: 'donut', glaze: 'none', sprinkles: false });
    }
  };

  const handleWarmCroissant = () => {
    if (
      isOvenWarming ||
      selectedPastry?.type !== 'croissant' ||
      selectedPastry.warmed
    ) {
      return;
    }

    setIsOvenWarming(true);
    setOvenProgress(8);
    sound.playOvenWarm(1.95);

    const startTime = Date.now();
    if (ovenIntervalRef.current) window.clearInterval(ovenIntervalRef.current);
    ovenIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      setOvenProgress(Math.min(100, Math.round((elapsed / 2000) * 100)));
    }, 80);

    if (ovenTimerRef.current) window.clearTimeout(ovenTimerRef.current);
    ovenTimerRef.current = window.setTimeout(() => {
      if (ovenIntervalRef.current) {
        window.clearInterval(ovenIntervalRef.current);
        ovenIntervalRef.current = null;
      }
      setIsOvenWarming(false);
      setOvenProgress(100);
      setSelectedPastry({ type: 'croissant', warmed: true });
      sound.playOvenDing();
    }, 2000);
  };

  const handleSetDonutGlaze = (glaze: DonutGlaze) => {
    if (selectedPastry?.type !== 'donut') return;
    setSelectedPastry({ ...selectedPastry, glaze });
    sound.playPop();
  };

  const handleToggleDonutSprinkles = () => {
    if (selectedPastry?.type !== 'donut') return;
    setSelectedPastry({
      ...selectedPastry,
      sprinkles: !selectedPastry.sprinkles,
    });
    sound.playPop();
  };

  const handleClearPastry = () => {
    if (isOvenWarming) return;
    setSelectedPastry(null);
    sound.playPop();
  };

  const handlePutPastryOnTray = () => {
    if (!selectedPastry || isOvenWarming) return;
    setTrayPastry({ ...selectedPastry });
    setSelectedPastry(null);
    if (emotion !== 'happy') setEmotion('waiting');
    sound.playTrayPlace();
  };

  // --- Serve Order (Atomic single-reward guard + StrictMode-pure) ---
  const handleServe = () => {
    if (emotion === 'happy' || servedOrderIdRef.current === order.id) return;

    const result = validateOrder(order, trayDrink, trayPastry);
    if (!result.ok) {
      setEmotion(result.isPuhCoffeeReject ? 'no_coffee' : 'surprised');
      setSpeechText(result.feedback);
      sound.playGentleOops();
      return;
    }

    servedOrderIdRef.current = order.id;
    canAutoSaveRef.current = true;
    const nextServedCount = saveState.servedCount + 1;
    const nextWeather =
      nextServedCount % 4 === 0
        ? getNextWeather(saveState.weather)
        : saveState.weather;
    weatherRef.current = nextWeather;

    // Special Kindness Reward for «Котик-мандрівник»!
    if (order.isTravelerGuest) {
      const nextStickerId = RARE_STICKER_ORDER.find(
        (sid) => !saveState.unlockedRareStickers.includes(sid)
      );
      const stickerMeta = nextStickerId
        ? RARE_STICKER_CATALOG.find((s) => s.id === nextStickerId)
        : null;
      const riverCoins = nextStickerId ? 0 : 20;

      setEmotion('happy');
      setLastReward(riverCoins > 0 ? riverCoins : null);
      setSpeechText(
        buildOrderPraise(order, {
          hasLatteArt: false,
          hasTakeawayDecor: false,
          isSecretDrink: false,
          travelerGiftLabel: stickerMeta
            ? `${stickerMeta.emoji} ${stickerMeta.label}`
            : undefined,
          travelerAllCollected: !nextStickerId,
        })
      );

      const travelerDayPayload = {
        guestId: 'mandrivnyk' as const,
        coinsEarned: riverCoins,
        hasLatteArt: false,
        hasTakeaway: false,
        isTraveler: true,
        becameBestFriend: false,
      };
      dayProgressRef.current = recordServedGuestInDay(
        dayProgressRef.current,
        travelerDayPayload
      );

      setSaveState((prev) => {
        const nextRare =
          nextStickerId && !prev.unlockedRareStickers.includes(nextStickerId)
            ? [...prev.unlockedRareStickers, nextStickerId]
            : prev.unlockedRareStickers;

        return {
          ...prev,
          coins: prev.coins + riverCoins,
          servedCount: prev.servedCount + 1,
          weather: nextWeather,
          unlockedRareStickers: nextRare,
          travelerVisits: prev.travelerVisits + 1,
          friendship: {
            ...prev.friendship,
            mandrivnyk: (prev.friendship.mandrivnyk ?? 0) + 1,
          },
          dayProgress: recordServedGuestInDay(
            prev.dayProgress,
            travelerDayPayload
          ),
        };
      });

      sound.playBestFriendFanfare();
      if (stickerMeta) {
        showCelebration({
          icon: stickerMeta.emoji,
          title: `Новий рідкісний стікер: ${stickerMeta.label}!`,
          subtitle:
            stickerMeta.id === 'pinecone'
              ? 'Додано в «Із собою» із золотою рамкою та на стійку кав’ярні!'
              : 'Додано в декор стаканчиків «Із собою» із золотою рамкою!',
          tone: 'traveler',
        });
      } else {
        showCelebration({
          icon: '💌',
          title: 'Тепла листівка від Котика-мандрівника!',
          subtitle: 'Усі 5 сувенірів зібрано • Подарунок +20 🐟 біля річки!',
          tone: 'traveler',
        });
      }
      return;
    }

    // Regular Guests (Secret Drink, Combo, Latte Art, Take-away & Best Friend +5 🐟 tips)
    const isSecretDrink = order.drinkId === 'secret_daily';
    const hasLatteArt = Boolean(
      trayDrink?.category === 'hot' && trayDrink.latteArtDataUrl
    );
    const hasTakeawayDecor = Boolean(
      order.serviceMode === 'takeaway' && trayDrink?.takeaway
    );
    const alreadyBestFriend = isBestFriend(saveState.friendship, order.guestId);
    const prevFriendScore = saveState.friendship[order.guestId] ?? 0;
    const nextFriendScore = prevFriendScore + 1;
    const justBecameBestFriend =
      prevFriendScore < BEST_FRIEND_THRESHOLD &&
      nextFriendScore >= BEST_FRIEND_THRESHOLD;

    let reward = isSecretDrink ? 25 : 15;
    if (order.isCombo) reward += 15;
    if (hasLatteArt) reward += order.wantsLatteArt ? 5 : 3;
    if (hasTakeawayDecor) reward += 5;
    if (alreadyBestFriend) reward += 5;

    setEmotion('happy');
    setSpeechText(
      buildOrderPraise(order, {
        hasLatteArt,
        hasTakeawayDecor,
        wishText: trayDrink?.takeaway?.wishText,
        isSecretDrink,
        isBestFriendBonus: alreadyBestFriend,
      })
    );
    setLastReward(reward);

    const regularDayPayload = {
      guestId: order.guestId,
      coinsEarned: reward,
      hasLatteArt,
      hasTakeaway: hasTakeawayDecor,
      isTraveler: false,
      becameBestFriend: justBecameBestFriend,
    };
    dayProgressRef.current = recordServedGuestInDay(
      dayProgressRef.current,
      regularDayPayload
    );

    setSaveState((prev) => ({
      ...prev,
      coins: prev.coins + reward,
      servedCount: prev.servedCount + 1,
      weather: nextWeather,
      friendship: {
        ...prev.friendship,
        [order.guestId]: (prev.friendship[order.guestId] ?? 0) + 1,
      },
      dayProgress: recordServedGuestInDay(prev.dayProgress, regularDayPayload),
    }));

    if (justBecameBestFriend) {
      const guest = GUESTS[order.guestId];
      setHasNewBestFriend(true);
      sound.playBestFriendFanfare();
      showCelebration({
        icon: '💖',
        title: `Новий найкращий друг: ${guest.name}!`,
        subtitle: `Подарунок ${guest.souvenirEmoji} «${guest.souvenirName}» на поличці + назавжди +5 🐟 чайових!`,
        tone: 'friend',
      });
    } else {
      sound.playSuccess();
    }
  };

  const handleClearTray = () => {
    setTrayDrink(null);
    setTrayPastry(null);
    if (emotion !== 'happy') setEmotion('waiting');
    sound.playPop();
  };

  const bestFriendsCount = REGULAR_GUEST_IDS.filter(
    (id) => (saveState.friendship[id] ?? 0) >= BEST_FRIEND_THRESHOLD
  ).length;

  return (
    <MotionConfig reducedMotion="user">
      <div className="cafe-outer-bg flex h-[100dvh] w-full justify-center overflow-hidden">
        <div
          className="watercolor-paper landscape-scroll-shell flex h-[100dvh] w-full max-w-[1440px] flex-col overflow-hidden xl:border-x-2 xl:border-[#C5A482] xl:shadow-[0_0_52px_rgba(82,52,30,0.22)]"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
          }}
        >
          {/* 1. Compact Single-Row Top Bar */}
          <TopBar
            coins={saveState.coins}
            servedCount={saveState.servedCount}
            weather={saveState.weather}
            muted={saveState.muted}
            secretDrink={saveState.secretDrink}
            bestFriendsCount={bestFriendsCount}
            hasNewBestFriend={hasNewBestFriend}
            onCycleWeather={handleCycleWeather}
            onToggleMute={handleToggleMute}
            onOpenRecipeBook={() => {
              sound.playPop();
              setIsRecipeBookOpen(true);
            }}
            onOpenSecretCreator={() => {
              sound.playPop();
              setIsSecretCreatorOpen(true);
            }}
            onOpenShop={() => {
              sound.playPop();
              setIsShopOpen(true);
            }}
            onOpenFriendshipAlbum={() => {
              sound.playPop();
              setHasNewBestFriend(false);
              setIsFriendshipAlbumOpen(true);
            }}
          />

          {/* 2. Upper Scene: Cafe Hall, Decor, Souvenirs, Guest, Dressed Marzipan & Tray */}
          <CafeHallScene
            order={order}
            weather={saveState.weather}
            emotion={emotion}
            speechText={speechText}
            trayDrink={trayDrink}
            trayPastry={trayPastry}
            marzipanPurring={marzipanPurring}
            equippedAccessories={saveState.equippedAccessories}
            enabledDecor={saveState.enabledDecor}
            musicBoxPlaying={saveState.musicBoxPlaying}
            muted={saveState.muted}
            friendship={saveState.friendship}
            unlockedRareStickers={saveState.unlockedRareStickers}
            secretDrink={saveState.secretDrink}
            lastReward={lastReward}
            celebration={celebration}
            isLateAfternoon={isLateAfternoon(saveState.dayProgress)}
            isDayComplete={isDayTargetReached(saveState.dayProgress)}
            onPetMarzipan={handlePetMarzipan}
            onToggleMusicBox={handleToggleMusicBox}
            onOpenSecretCreator={() => {
              sound.playPop();
              setIsSecretCreatorOpen(true);
            }}
            onOpenFriendshipAlbum={() => {
              sound.playPop();
              setHasNewBestFriend(false);
              setIsFriendshipAlbumOpen(true);
            }}
            onServe={handleServe}
            onClearTray={handleClearTray}
            onClearTrayDrink={() => {
              setTrayDrink(null);
              sound.playPop();
            }}
            onClearTrayPastry={() => {
              setTrayPastry(null);
              sound.playPop();
            }}
            onNextGuest={goToNextGuest}
          />

          {/* 3. Lower Barista Workbench (3 Cozy Kraft/Wood Menu Tabs) */}
          <main className="landscape-compact-main flex flex-1 min-h-0 lg:flex-none lg:shrink-0 flex-col bg-gradient-to-b from-[#DFC5A2] via-[#E7D2B6] to-[#DCBF9A] px-2 sm:px-4 lg:px-5 pb-2 sm:pb-2.5 pt-1.5 overflow-hidden">
            <StationTabs
              activeTab={activeTab}
              dayProgress={saveState.dayProgress}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                sound.playPop();
              }}
              onOpenDayJournal={() => {
                sound.playPop();
                setIsDiaryOpen(true);
              }}
            />

            <div className="barista-workbench relative flex-1 min-h-0 lg:flex-none lg:shrink-0 lg:h-[265px] rounded-b-2xl sm:rounded-b-3xl rounded-tr-2xl sm:rounded-tr-3xl border-2 border-[#8C6248] p-2 sm:p-2.5 overflow-hidden">
              {activeTab === 'hot' && (
                <HotDrinksStation
                  ingredients={hotIngredients}
                  latteArtDataUrl={hotLatteArtUrl}
                  isTakeawayOrder={
                    order.serviceMode === 'takeaway' && !order.isTravelerGuest
                  }
                  unlockedRecipes={saveState.unlockedRecipes}
                  onAddIngredient={handleAddHotIngredient}
                  onSetWarmMilkCount={handleSetWarmMilkCount}
                  onRemoveIngredient={handleRemoveHotIngredient}
                  onOpenLatteArt={() => {
                    sound.playPop();
                    setIsLatteArtOpen(true);
                  }}
                  onClear={handleClearHot}
                  onPutOnTray={handlePutHotOnTray}
                />
              )}

              {activeTab === 'cold' && (
                <ColdDrinksStation
                  glassMode={coldGlassMode}
                  cocktailIngredients={cocktailIngredients}
                  blenderIngredients={blenderIngredients}
                  pouredMilkshakeIngredients={pouredMilkshakeIngredients}
                  whippedCream={whippedCream}
                  isBlending={isBlending}
                  isTakeawayOrder={
                    order.serviceMode === 'takeaway' && !order.isTravelerGuest
                  }
                  onAddCocktailIngredient={handleAddCocktailIngredient}
                  onRemoveCocktailIngredient={handleRemoveCocktailIngredient}
                  onAddBlenderIngredient={handleAddBlenderIngredient}
                  onRemoveBlenderIngredient={handleRemoveBlenderIngredient}
                  onBlend={handleBlend}
                  onToggleWhippedCream={handleToggleWhippedCream}
                  onClearAll={handleClearCold}
                  onPutOnTray={handlePutColdOnTray}
                />
              )}

              {activeTab === 'pastry' && (
                <PastryStation
                  selectedPastry={selectedPastry}
                  isOvenWarming={isOvenWarming}
                  ovenProgress={ovenProgress}
                  unlockedRecipes={saveState.unlockedRecipes}
                  onSelectBase={handleSelectPastryBase}
                  onWarmCroissant={handleWarmCroissant}
                  onSetDonutGlaze={handleSetDonutGlaze}
                  onToggleDonutSprinkles={handleToggleDonutSprinkles}
                  onClear={handleClearPastry}
                  onPutOnTray={handlePutPastryOnTray}
                />
              )}
            </div>
          </main>

          {/* Lazy-Loaded Modals — chunks load only on demand for snappy mobile startup */}
          <Suspense fallback={null}>
            {isRecipeBookOpen && (
              <RecipeBookModal
                isOpen={isRecipeBookOpen}
                initialTab={activeTab}
                secretDrink={saveState.secretDrink}
                unlockedRecipes={saveState.unlockedRecipes}
                onClose={() => {
                  sound.playPop();
                  setIsRecipeBookOpen(false);
                }}
                onOpenSecretCreator={() => {
                  sound.playPop();
                  setIsSecretCreatorOpen(true);
                }}
              />
            )}

            {isLatteArtOpen && (
              <LatteArtModal
                isOpen={isLatteArtOpen}
                initialDataUrl={hotLatteArtUrl}
                onClose={() => {
                  sound.playPop();
                  setIsLatteArtOpen(false);
                }}
                onSave={(dataUrl) => {
                  setHotLatteArtUrl(dataUrl);
                  setIsLatteArtOpen(false);
                }}
              />
            )}

            {pendingTakeawayDrink && (
              <TakeawayCupModal
                drink={pendingTakeawayDrink}
                unlockedRareStickers={saveState.unlockedRareStickers}
                onCancel={() => {
                  sound.playPop();
                  setPendingTakeawayDrink(null);
                  setPendingTakeawaySource(null);
                }}
                onConfirm={handleConfirmTakeaway}
              />
            )}

            {isSecretCreatorOpen && (
              <SecretDrinkModal
                isOpen={isSecretCreatorOpen}
                existingDrink={saveState.secretDrink}
                unlockedRecipes={saveState.unlockedRecipes}
                onClose={() => {
                  sound.playPop();
                  setIsSecretCreatorOpen(false);
                }}
                onSave={handleSaveSecretDrink}
              />
            )}

            {isShopOpen && (
              <ShopModal
                isOpen={isShopOpen}
                coins={saveState.coins}
                ownedAccessories={saveState.ownedAccessories}
                equippedAccessories={saveState.equippedAccessories}
                ownedDecor={saveState.ownedDecor}
                enabledDecor={saveState.enabledDecor}
                unlockedRecipes={saveState.unlockedRecipes}
                musicBoxPlaying={saveState.musicBoxPlaying}
                onClose={() => {
                  sound.playPop();
                  setIsShopOpen(false);
                }}
                onBuyAccessory={handleBuyAccessory}
                onToggleEquipAccessory={handleToggleEquipAccessory}
                onBuyDecor={handleBuyDecor}
                onToggleDecor={handleToggleDecor}
                onToggleMusicBox={handleToggleMusicBox}
                onBuyRecipe={handleBuyRecipe}
                onOpenBackup={() => setIsBackupOpen(true)}
              />
            )}

            {isFriendshipAlbumOpen && (
              <FriendshipAlbumModal
                isOpen={isFriendshipAlbumOpen}
                friendship={saveState.friendship}
                unlockedRareStickers={saveState.unlockedRareStickers}
                travelerVisits={saveState.travelerVisits}
                onClose={() => {
                  sound.playPop();
                  setIsFriendshipAlbumOpen(false);
                }}
              />
            )}

            {isBackupOpen && (
              <BackupModal
                isOpen={isBackupOpen}
                saveState={saveState}
                storageWarning={storageWarning}
                onClose={() => {
                  sound.playPop();
                  setIsBackupOpen(false);
                }}
                onImportSave={handleImportSave}
                onResetSave={handleResetSave}
              />
            )}

            {dayJournalMode && (
              <DayJournalModal
                isOpen={true}
                mode={dayJournalMode}
                dayProgress={saveState.dayProgress}
                dayHistory={saveState.dayHistory}
                weather={saveState.weather}
                onStartDay={handleStartMorningDay}
                onAdvanceNextDay={handleAdvanceNextDay}
                onClose={() => {
                  sound.playPop();
                  setIsDiaryOpen(false);
                }}
              />
            )}
          </Suspense>
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
