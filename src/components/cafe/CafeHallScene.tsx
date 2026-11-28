import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { CAFE_ASSETS } from '../../config/assets';
import {
  BEST_FRIEND_THRESHOLD,
  GUESTS,
  REGULAR_GUEST_IDS,
  isBestFriend,
} from '../../data/guests';
import {
  PASTRY_RECIPES,
  getOrderDrinkName,
  getOrderDrinkTab,
} from '../../data/recipes';
import {
  MYSTERY_DAY1_CHOICES,
  MYSTERY_DAY2_CHOICES,
} from '../../data/recipeMystery';
import type {
  BirthdayThemeId,
  CafeDecorId,
  GuestEmotion,
  GuestId,
  MarzipanEquipped,
  MysteryDay1ChoiceId,
  MysteryDay2ChoiceId,
  Order,
  PreparedDrink,
  PreparedPastry,
  PuhBirthdayStoryState,
  RareStickerId,
  RecipeMysteryStoryState,
  SecretDrinkRecipe,
  StationTab,
  WallArtState,
  WeatherType,
} from '../../types/game';
import { AssetIllustration } from '../common/AssetIllustration';
import { BirthdayDecorOverlaySvg } from '../svg/BirthdayDecorOverlaySvg';
import { CafeBackgroundSvg } from '../svg/CafeBackgroundSvg';
import {
  CatWallClockSvg,
  DaisyVaseSvg,
  GoldenRecipeBookCounterSvg,
  MusicBoxCounterSvg,
  SouvenirSvg,
  TwinkleStarsGarlandSvg,
} from '../svg/CafeDecorAndSouvenirsSvg';
import type { DayJournalTab } from '../modals/DayJournalModal';
import { CafeWallArtFrame } from './CafeWallArtFrame';
import { GuestCard } from './GuestCard';
import { MarzipanHelper } from './MarzipanHelper';
import { ServingTray } from './ServingTray';
import { WindowWeatherOverlay } from './WindowWeatherOverlay';
import type { GuidedHintState } from '../../utils/guidedHints';

export interface CelebrationBanner {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  tone: 'friend' | 'traveler' | 'recipe';
}

interface CafeHallSceneProps {
  order: Order;
  weather: WeatherType;
  emotion: GuestEmotion;
  speechText: string;
  trayDrink: PreparedDrink | null;
  trayPastry: PreparedPastry | null;
  marzipanPurring: boolean;
  marzipanPetsCount?: number;
  equippedAccessories: MarzipanEquipped;
  enabledDecor: CafeDecorId[];
  musicBoxPlaying: boolean;
  muted: boolean;
  friendship: Partial<Record<GuestId, number>>;
  unlockedRareStickers: RareStickerId[];
  secretDrink: SecretDrinkRecipe | null;
  lastReward: number | null;
  celebration: CelebrationBanner | null;
  servedTodayCount?: number;
  guestsTarget?: number;
  isLateAfternoon?: boolean;
  isDayComplete?: boolean;
  isWorkbenchOpen?: boolean;
  birthdayDecor?: { theme: BirthdayThemeId; level: 1 | 2 | 3 } | null;
  puhBirthday?: PuhBirthdayStoryState;
  recipeMystery?: RecipeMysteryStoryState;
  ambientObservation?: string | null;
  unreadLettersCount?: number;
  canOfferMysteryInvite?: boolean;
  wallArt?: WallArtState;
  guidedHint?: GuidedHintState | null;
  hintsActive?: boolean;
  onToggleHints?: () => void;
  onOpenHowToPlay?: () => void;
  onOpenStoryHub?: (tab?: DayJournalTab) => void;
  onOpenMysteryModal?: (mode: 'intro' | 'clues' | 'solved') => void;
  onSelectMysteryDay1Choice?: (choice: MysteryDay1ChoiceId) => void;
  onSelectMysteryDay2Choice?: (choice: MysteryDay2ChoiceId) => void;
  onPetMarzipan: () => void;
  onOpenMarzipanCare?: () => void;
  onOpenWallArt?: () => void;
  onToggleMusicBox: () => void;
  onOpenSecretCreator: () => void;
  onOpenFriendshipAlbum: () => void;
  onOpenStationForOrder?: (tab: StationTab) => void;
  onDismissWorkbench?: () => void;
  onServe: () => void;
  onClearTray: () => void;
  onClearTrayDrink: () => void;
  onClearTrayPastry: () => void;
  onNextGuest: () => void;
}

export const CafeHallScene: React.FC<CafeHallSceneProps> = React.memo(({
  order,
  weather,
  emotion,
  speechText,
  trayDrink,
  trayPastry,
  marzipanPurring,
  marzipanPetsCount = 0,
  equippedAccessories,
  enabledDecor,
  musicBoxPlaying,
  muted,
  friendship,
  unlockedRareStickers,
  secretDrink,
  lastReward,
  celebration,
  servedTodayCount = 0,
  guestsTarget = 5,
  isLateAfternoon = false,
  isDayComplete = false,
  isWorkbenchOpen = false,
  birthdayDecor = null,
  puhBirthday,
  recipeMystery,
  ambientObservation = null,
  unreadLettersCount = 0,
  canOfferMysteryInvite = false,
  wallArt,
  guidedHint = null,
  hintsActive = false,
  onToggleHints,
  onOpenHowToPlay,
  onOpenStoryHub,
  onOpenMysteryModal,
  onSelectMysteryDay1Choice,
  onSelectMysteryDay2Choice,
  onPetMarzipan,
  onOpenMarzipanCare,
  onOpenWallArt,
  onToggleMusicBox,
  onOpenSecretCreator,
  onOpenFriendshipAlbum,
  onOpenStationForOrder,
  onDismissWorkbench,
  onServe,
  onClearTray,
  onClearTrayDrink,
  onClearTrayPastry,
  onNextGuest,
}) => {
  const guest = GUESTS[order.guestId];
  const drinkName = getOrderDrinkName(order);
  const drinkTab = getOrderDrinkTab(order);
  const isSecretOrder = order.drinkId === 'secret_daily';
  const isTraveler = Boolean(order.isTravelerGuest);
  const guestIsBestFriend = isBestFriend(friendship, order.guestId);
  const pastryRecipe = order.pastryId ? PASTRY_RECIPES[order.pastryId] : null;
  const isHappy = emotion === 'happy';

  const hasDaisyVase = enabledDecor.includes('daisy_vase');
  const hasTwinkleStars = enabledDecor.includes('twinkle_stars');
  const hasCatClock = enabledDecor.includes('cat_clock');
  const hasMusicBox = enabledDecor.includes('music_box');
  const hasLuckyPinecone = unlockedRareStickers.includes('pinecone');
  const showGoldenBookSouvenir = Boolean(
    recipeMystery?.status === 'completed' && recipeMystery.showCounterSouvenir
  );
  const needsMysteryDay1Choice = Boolean(
    !isHappy &&
      order.mysteryRole === 'mystery_day1_marsel' &&
      recipeMystery?.status === 'active' &&
      !recipeMystery.day1Choice
  );
  const needsMysteryDay2Choice = Boolean(
    !isHappy &&
      order.mysteryRole === 'mystery_day2_sofiya' &&
      recipeMystery?.status === 'active' &&
      !recipeMystery.day2Choice
  );
  const isWaitingForChoice = needsMysteryDay1Choice || needsMysteryDay2Choice;

  const unlockedFriendSouvenirs = REGULAR_GUEST_IDS.filter(
    (id) => (friendship[id] ?? 0) >= BEST_FRIEND_THRESHOLD
  );

  const speechBubbleContent = (
    <motion.div
      key={`${order.id}-${speechText}`}
      initial={{ opacity: 0.72, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22 }}
      onClick={(e) => e.stopPropagation()}
      className={`landscape-compact-bubble relative z-20 rounded-2xl sm:rounded-3xl border-2 bg-[#FFFDF8]/95 sm:bg-[#FFFDF8]/88 sm:backdrop-blur-[3px] px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-[0_8px_22px_-8px_rgba(74,44,22,0.24)] transition-colors ${
        isHappy
          ? 'border-[#96C7A6]'
          : isTraveler
            ? 'border-[#D9A24B]'
            : emotion === 'no_coffee' || emotion === 'surprised'
              ? 'border-[#E69CB0]'
              : 'border-[#DFC2A0]'
      }`}
    >
      {/* Tail pointing left toward guest on tablet/desktop */}
      <div
        className={`hidden sm:block absolute -left-2 bottom-5 h-3.5 w-3.5 rotate-45 border-b-2 border-l-2 bg-[#FFFDF8]/95 ${
          isHappy
            ? 'border-[#96C7A6]'
            : isTraveler
              ? 'border-[#D9A24B]'
              : emotion === 'no_coffee' || emotion === 'surprised'
                ? 'border-[#E69CB0]'
                : 'border-[#DFC2A0]'
        }`}
      />

      {!isHappy && ambientObservation && (
        <div
          data-ambient-observation="true"
          className="relative z-10 mb-1 inline-flex max-w-full items-center gap-1 rounded-xl border border-[#E4C9A1] bg-[#FFF8EB] px-2 py-0.5 text-[10px] font-bold leading-snug text-[#7A512D]"
        >
          <span>{ambientObservation}</span>
        </div>
      )}

      <p className="relative z-10 text-[11px] sm:text-xs font-bold leading-snug text-[#5A3E32]">
        {speechText}
      </p>

      {/* Live Interactive Detective Dialogue Choices (Chapter 2, Day 1 & Day 2) */}
      {needsMysteryDay1Choice && onSelectMysteryDay1Choice && (
        <div
          data-mystery-choices="day1"
          className="relative z-10 mt-1.5 flex flex-wrap gap-1.5"
        >
          {MYSTERY_DAY1_CHOICES.map((ch) => (
            <button
              key={ch.id}
              type="button"
              data-mystery-choice={ch.id}
              onClick={() => onSelectMysteryDay1Choice(ch.id)}
              className="inline-flex min-h-[30px] items-center gap-1 rounded-xl border-2 border-[#C88E38] border-b-[3px] bg-gradient-to-b from-[#FFF8E0] to-[#F7DB98] px-2.5 py-0.5 text-[10.5px] sm:text-[11px] font-bold text-[#593308] shadow-2xs transition-transform hover:scale-[1.02] active:translate-y-[1px]"
            >
              <span aria-hidden="true">{ch.emoji}</span>
              <span>{ch.label}</span>
            </button>
          ))}
        </div>
      )}

      {needsMysteryDay2Choice && onSelectMysteryDay2Choice && (
        <div
          data-mystery-choices="day2"
          className="relative z-10 mt-1.5 flex flex-wrap gap-1.5"
        >
          {MYSTERY_DAY2_CHOICES.map((ch) => (
            <button
              key={ch.id}
              type="button"
              data-mystery-choice={ch.id}
              onClick={() => onSelectMysteryDay2Choice(ch.id)}
              className="inline-flex min-h-[30px] items-center gap-1 rounded-xl border-2 border-[#9B7CC4] border-b-[3px] bg-gradient-to-b from-[#F7F1FE] to-[#E2D3F7] px-2.5 py-0.5 text-[10.5px] sm:text-[11px] font-bold text-[#44286E] shadow-2xs transition-transform hover:scale-[1.02] active:translate-y-[1px]"
            >
              <span aria-hidden="true">{ch.emoji}</span>
              <span>{ch.label}</span>
            </button>
          ))}
        </div>
      )}

      {!isHappy ? (
        isWaitingForChoice ? null : (
        <div className="relative z-10 mt-1.5 flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {isTraveler ? (
              <>
                <span className="inline-flex items-center gap-1 rounded-xl border border-[#C98E35] bg-[#FFF4D2] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#6E420A]">
                  🎒 Особливий гість
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onOpenStationForOrder?.(
                      order.travelerWishCategory === 'cold'
                        ? 'cold'
                        : order.travelerWishCategory === 'pastry'
                          ? 'pastry'
                          : 'hot'
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-[#8EB898] bg-[#ECF7EF] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#215936] hover:brightness-97 transition-all"
                >
                  💛 {drinkName} (натисни, щоб приготувати →)
                </button>
              </>
            ) : (
              <>
                {order.serviceMode === 'takeaway' && (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-[#DFB257] bg-[#FFF4D1] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#7A4E14]">
                    🏃 Із собою
                  </span>
                )}

                {order.birthdayStoryRole && (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-[#D4839E] bg-[#FCEAF0] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#832C49]">
                    🎂{' '}
                    {order.birthdayStoryRole === 'finale_party'
                      ? 'День народження Пуха!'
                      : 'Свято Пуха'}
                  </span>
                )}

                {order.mysteryRole && onOpenMysteryModal && (
                  <button
                    type="button"
                    data-mystery-clues-btn="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMysteryModal('clues');
                    }}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#C6892C] bg-[#FFF2C9] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#5E3608] hover:brightness-97"
                  >
                    📜 Підказки ({recipeMystery?.discoveredClues.length ?? 0}/3)
                  </button>
                )}

                {order.friendGiftRole === 'send' && order.friendGiftPartnerId && (
                  <span
                    data-friend-gift-badge="send"
                    className="inline-flex items-center gap-1 rounded-xl border border-[#DF9BB1] bg-[#FCEEF3] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#832C49]"
                  >
                    🎁 Сюрприз для: {GUESTS[order.friendGiftPartnerId].name}
                  </span>
                )}

                {order.friendGiftRole === 'receive' &&
                  order.friendGiftPartnerId && (
                    <span
                      data-friend-gift-badge="receive"
                      className="inline-flex items-center gap-1 rounded-xl border border-[#88BC98] bg-[#EAF7EE] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#1E5933]"
                    >
                      💌 Подарунок від: {GUESTS[order.friendGiftPartnerId].name}{' '}
                      (+10 🐟)
                    </span>
                  )}

                {order.isMoodRiddle && (
                  <span
                    data-mood-riddle-badge="true"
                    className="inline-flex items-center gap-1 rounded-xl border border-[#A584CC] bg-[#F5EEFC] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#4C2E73]"
                  >
                    🤔 Загадка настрою (+10 🐟)
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => onOpenStationForOrder?.(drinkTab)}
                  title="Натисни, щоб відкрити станцію приготування цього напою!"
                  className={`inline-flex items-center gap-1 rounded-xl border px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[10.5px] sm:text-[11px] font-bold transition-transform hover:scale-[1.03] active:scale-[0.97] ${
                    order.mysteryRole === 'mystery_day3_finale'
                      ? 'border-[#C6892C] bg-[#FFF0BE] text-[#5C3406]'
                      : order.isMoodRiddle
                        ? 'border-[#9B7AC4] bg-[#F3EAFB] text-[#4A2B72]'
                        : isSecretOrder || order.drinkId === 'golden_cocoa'
                          ? 'border-[#D9A143] bg-[#FFF4D6] text-[#6C420C]'
                          : 'border-[#DFBE97] bg-[#FBF0DE] text-[#664128]'
                  }`}
                >
                  <span aria-hidden="true">
                    {order.mysteryRole === 'mystery_day3_finale'
                      ? '🔍'
                      : order.isMoodRiddle
                        ? '✨'
                        : isSecretOrder
                          ? (order.secretDrink?.icon ?? '⭐')
                          : order.drinkId === 'golden_cocoa'
                            ? '⭐'
                            : drinkTab === 'hot'
                              ? '☕'
                              : '🍹'}
                  </span>
                  <span>
                    {order.mysteryRole === 'mystery_day3_finale'
                      ? 'Відновити «Золоте какао»'
                      : order.isMoodRiddle
                        ? 'Вгадай напій!'
                        : drinkName}
                  </span>
                </button>

                {pastryRecipe && (
                  <button
                    type="button"
                    onClick={() => onOpenStationForOrder?.('pastry')}
                    title="Натисни, щоб відкрити вітрину випічки!"
                    className="inline-flex items-center gap-1 rounded-xl border border-[#EAB5C4] bg-[#FDF0F4] px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[10.5px] sm:text-[11px] font-bold text-[#883C54] transition-transform hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <span aria-hidden="true">🥐</span>
                    <span>{pastryRecipe.name}</span>
                  </button>
                )}

                {order.wantsLatteArt && (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-[#D49EB0] bg-[#FDF0F5] px-2 py-0.5 text-[10px] font-bold text-[#8B3A54]">
                    🎨 +Лате-арт
                  </span>
                )}
              </>
            )}

            {/* Friendly on-demand Hint & How-to-Play buttons grouped together so `?` never wraps alone */}
            {(onToggleHints || onOpenHowToPlay) && (
              <div className="ml-auto inline-flex shrink-0 items-center gap-1">
                {onToggleHints && (
                  <button
                    type="button"
                    data-hints-toggle="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHints();
                    }}
                    title={
                      hintsActive
                        ? 'Вимкнути покрокову підказку'
                        : 'Увімкнути покрокову підказку для цього замовлення'
                    }
                    className={`inline-flex min-h-[28px] items-center gap-0.5 rounded-xl border px-2 py-0.5 text-[10px] font-bold transition-colors whitespace-nowrap ${
                      hintsActive
                        ? 'border-[#D99B38] bg-[#FFF0BE] text-[#663C07]'
                        : 'border-[#DFC6A6] bg-[#FFF8EB] text-[#7D583B] hover:bg-[#FCEFD6]'
                    }`}
                  >
                    <span aria-hidden="true">💡</span>
                    <span>{hintsActive ? 'Підказка ✓' : 'Підказка'}</span>
                  </button>
                )}
                {onOpenHowToPlay && (
                  <button
                    type="button"
                    data-howtoplay-open="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenHowToPlay();
                    }}
                    title="Як грати? (коротка інструкція)"
                    aria-label="Відкрити коротку інструкцію «Як грати»"
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D4B188] bg-[#FFFDF8] text-[11px] font-bold text-[#6F4B32] hover:bg-[#F9EBD5]"
                  >
                    ?
                  </button>
                )}
              </div>
            )}
          </div>

          {hintsActive && guidedHint && (
            <div
              data-guided-hint-banner="true"
              className="mt-0.5 flex items-center gap-1 rounded-xl border border-[#DFB054] bg-[#FFF4CF] px-2 py-1 text-[10.5px] sm:text-[11px] font-bold leading-tight text-[#5E3709] shadow-2xs"
            >
              <span>{guidedHint.hallText}</span>
            </div>
          )}

          {!isWorkbenchOpen && !hintsActive && (
            <div className="hidden sm:flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] leading-tight font-semibold text-[#8E6950]">
              {isTraveler ? (
                <span className="text-[#7C4E12]">
                  🎁 Подарунок за доброту: рідкісний золотий стікер!
                </span>
              ) : (
                <span>
                  {isSecretOrder
                    ? `Напій дня (+${order.isCombo ? 40 : 25} 🐟)`
                    : order.drinkId === 'golden_cocoa'
                      ? `Легендарний напій (+${order.isCombo ? 40 : 25} 🐟)`
                      : order.isCombo
                        ? 'Комбо (+30 🐟)'
                        : 'Замовлення (+15 🐟)'}
                  {order.serviceMode === 'takeaway' ? ' • +5 🐟 за стікер' : ''}
                  {order.wantsLatteArt ? ' • +5 🐟 за лате-арт' : ''}
                  {order.friendGiftRole === 'receive'
                    ? ' • +10 🐟 за теплу дружбу 💌'
                    : ''}
                  {order.isMoodRiddle ? ' • +10 🐟 за загадку 🤔' : ''}
                  {guestIsBestFriend ? ' • +5 🐟 від друга 💖' : ''}
                </span>
              )}
            </div>
          )}
        </div>
        )
      ) : (
        <div className="relative z-10 mt-1.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F2E7] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#2F6A44]">
            {isTraveler ? '🎁 Подарунок отримано!' : '✨ Виконано!'}
          </span>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={onNextGuest}
            className={`min-h-[34px] rounded-full border-2 px-3 py-0.5 text-[11px] font-bold shadow-xs ${
              isDayComplete
                ? 'border-[#C98F35] bg-[#FFE7A8] text-[#5C370A] hover:bg-[#FBD980]'
                : 'border-[#84BC96] bg-[#B7DEC3] text-[#235436] hover:bg-[#A3D2B1]'
            }`}
          >
            {isDayComplete ? '📖 Підсумок дня →' : 'Наступний гість →'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );

  const isMobileOpenCafe = !isWorkbenchOpen;

  return (
    <section
      onClick={() => {
        if (isWorkbenchOpen) onDismissWorkbench?.();
      }}
      className={`landscape-compact-scene relative flex flex-1 min-h-[215px] w-full flex-col justify-between sm:flex-row sm:items-end overflow-hidden border-b-4 border-[#6B4223] bg-gradient-to-b from-[#E1C9A7] via-[#E8D5B8] to-[#A86B36] px-2 sm:px-4 lg:px-6 pb-1.5 sm:pb-2 pt-1.5 sm:pt-2 transition-all ${
        isWorkbenchOpen ? 'cursor-pointer' : ''
      }`}
      aria-label="Зала кав’ярні та вікно з погодою"
    >
      {/* Background + Window Weather locked in ONE container so portrait phones show the FULL cozy interior (chalkboard, pastry display, window, lamps & shelves) AND aligned rain/snow! */}
      <div
        data-cafe-backdrop="true"
        className={`pointer-events-none absolute inset-x-0 overflow-hidden transition-all duration-300 sm:inset-0 sm:h-auto ${
          isMobileOpenCafe
            ? 'bottom-[74px] h-[320px] [@media(min-height:760px)]:bottom-[152px] [@media(min-height:760px)]:h-[396px]'
            : 'inset-y-0'
        }`}
      >
        <AssetIllustration
          src={CAFE_ASSETS.background}
          alt="Ілюстрований інтер’єр кав’ярні Мур-Лате"
          className="absolute inset-0 h-full w-full pointer-events-none"
          imgClassName="h-full w-full object-cover object-center saturate-[1.03] contrast-[1.01] transition-all duration-300"
          fallback={<CafeBackgroundSvg weather={weather} />}
        />

        {/* Warm 5-mood lighting halos, fairy glints & live weather effects over central window */}
        <WindowWeatherOverlay
          weather={weather}
          servedToday={servedTodayCount}
          guestsTarget={guestsTarget}
          isLateAfternoon={isLateAfternoon}
          isDayComplete={isDayComplete}
        />

        {/* Seamless top plaster fade on portrait phones so upper speech-bubble area melts gently into the café wall */}
        {isMobileOpenCafe && (
          <div
            aria-hidden="true"
            className="sm:hidden absolute inset-x-0 top-0 z-[3] h-9 bg-gradient-to-b from-[#E3CCA9] to-transparent"
          />
        )}
      </div>

      {/* Shop Decor: Twinkling Golden Stars along Top Garland */}
      {hasTwinkleStars && <TwinkleStarsGarlandSvg />}

      {/* Step 05 Story Decor: Real themed Birthday Bunting & Counter Centerpiece */}
      {birthdayDecor && (
        <BirthdayDecorOverlaySvg
          theme={birthdayDecor.theme}
          level={birthdayDecor.level}
        />
      )}

      {/* Step 06 Personalization: Child's Own Framed Watercolor Painting on the Café Wall */}
      {wallArt && onOpenWallArt && (
        <CafeWallArtFrame wallArt={wallArt} onEdit={onOpenWallArt} />
      )}

      {/* Shop Decor: Wooden Cat Wall Clock on sunlit warm plaster wall beside framed wall art */}
      {hasCatClock && (
        <div
          title="Настінний годинник-котик"
          className="pointer-events-none hidden sm:block absolute left-[63.5%] lg:left-[64.2%] top-[43%] lg:top-[44%] z-[13] drop-shadow-[0_4px_6px_rgba(68,38,18,0.3)]"
        >
          <CatWallClockSvg className="h-14 w-10 lg:h-16 lg:w-12" />
        </div>
      )}

      {/* Top-Left Diegetic Stack (sm+): Secret Drink Chalkboard + Visible Story Book & Mailbox Hub */}
      <div className="hidden sm:flex absolute left-2.5 top-2 z-20 flex-col items-start gap-1.5">
        {secretDrink && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenSecretCreator();
            }}
            title="Натисни, щоб змінити «Секретний напій дня»"
            className="flex items-center gap-1.5 rounded-xl border-[1.5px] border-[#C89A67]/90 bg-[#4C3629]/82 backdrop-blur-[2px] px-2.5 py-0.5 text-left shadow-[0_3px_10px_rgba(48,28,14,0.28)]"
          >
            <span className="text-sm leading-none">{secretDrink.icon}</span>
            <div className="leading-tight">
              <span className="block text-[8px] font-bold uppercase tracking-wider text-[#F4D8A8]">
                Напій дня
              </span>
              <span className="font-handwriting block text-[15px] leading-none font-bold text-[#FFF9EE]">
                {secretDrink.name}
              </span>
            </div>
          </motion.button>
        )}

        {onOpenStoryHub && (
          <motion.button
            type="button"
            data-hall-story-hub="true"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenStoryHub(unreadLettersCount > 0 ? 'letters' : 'stories');
            }}
            title="Відкрити Книгу Історій, Поштову скриньку та Щоденник днів"
            className={`relative flex items-center gap-1.5 rounded-xl border-[1.5px] px-2.5 py-1 text-left shadow-[0_3px_10px_rgba(48,28,14,0.22)] backdrop-blur-[2px] ${
              unreadLettersCount > 0
                ? 'border-[#D87E9C] bg-[#FFF2F6]/92 text-[#7A2843]'
                : recipeMystery?.status === 'active'
                  ? 'border-[#CFA044] bg-[#FFF6DA]/92 text-[#5D3507]'
                  : 'border-[#C8A170] bg-[#FAF0DC]/90 text-[#5A3E32]'
            }`}
          >
            <span className="text-sm leading-none" aria-hidden="true">
              {unreadLettersCount > 0
                ? '💌'
                : recipeMystery?.status === 'active'
                  ? '🔍'
                  : puhBirthday?.status === 'active'
                    ? '🎂'
                    : '📖'}
            </span>
            <div className="leading-tight">
              <span className="block text-[8.5px] font-bold uppercase tracking-wider opacity-80">
                {unreadLettersCount > 0
                  ? `Пошта: +${unreadLettersCount} нових`
                  : recipeMystery?.status === 'active'
                    ? `Глава 2 • День ${recipeMystery.stageDay}/3`
                    : puhBirthday?.status === 'active'
                      ? `Глава 1 • День ${puhBirthday.stageDay}/3`
                      : 'Історії та пошта'}
              </span>
              <span className="block text-[10.5px] font-bold leading-none mt-0.5">
                {unreadLettersCount > 0
                  ? 'Прочитати листи →'
                  : recipeMystery?.status === 'active'
                    ? `Підказки: ${recipeMystery.discoveredClues.length}/3`
                    : puhBirthday?.status === 'active'
                      ? 'Свято Пуха'
                      : 'Книга Історій →'}
              </span>
            </div>
          </motion.button>
        )}

        {canOfferMysteryInvite && onOpenMysteryModal && (
          <motion.button
            type="button"
            data-hall-mystery-invite="true"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenMysteryModal('intro');
            }}
            className="flex items-center gap-1.5 rounded-xl border-2 border-[#C88E35] bg-gradient-to-r from-[#FFF4CC] to-[#FCE4A6] px-2.5 py-1 text-left text-[10.5px] font-bold text-[#5A3407] shadow-sm"
          >
            <span aria-hidden="true">🔍</span>
            <span>Марсель знайшов загадку!</span>
          </motion.button>
        )}
      </div>

      {/* Best-Friend Souvenirs Shelf (compact top-right wooden ledge on sm+) */}
      {unlockedFriendSouvenirs.length > 0 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenFriendshipAlbum();
          }}
          title="Сувеніри від найкращих друзів! Натисни, щоб відкрити Альбом дружби."
          className="hidden sm:flex absolute right-2.5 top-2 z-20 flex-col items-center rounded-xl border-[1.5px] border-[#B6824C]/85 bg-[#FAF0DE]/84 backdrop-blur-[2px] px-2 py-0.5 shadow-[0_3px_10px_rgba(62,36,18,0.2)] hover:brightness-102"
        >
          <span className="text-[8px] font-bold uppercase tracking-wider text-[#8C5D34] leading-none mb-0.5">
            💖 Поличка друзів
          </span>
          <div className="flex items-end gap-0.5">
            {unlockedFriendSouvenirs.map((friendId) => (
              <span
                key={friendId}
                title={`${GUESTS[friendId].name}: ${GUESTS[friendId].souvenirName}`}
                className="inline-flex"
              >
                <SouvenirSvg souvenirId={friendId} className="h-6 w-6" />
              </span>
            ))}
          </div>
        </motion.button>
      )}

      {/* Celebratory Toast Banner (New Best Friend / Traveler Rare Sticker!) */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            key={celebration.id}
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className={`pointer-events-none absolute left-1/2 top-2.5 -translate-x-1/2 z-30 flex items-center gap-2 rounded-2xl border-2 px-3.5 py-1.5 shadow-lg max-w-[92%] ${
              celebration.tone === 'friend'
                ? 'border-[#DF8AA4] bg-gradient-to-r from-[#FFF3F7] via-[#FFFBF0] to-[#FFF3F7] text-[#7D2B46]'
                : 'border-[#DCA142] bg-gradient-to-r from-[#FFF9E4] via-[#FFFDF6] to-[#F0F8EE] text-[#5F3C10]'
            }`}
          >
            <span className="text-xl shrink-0" aria-hidden="true">
              {celebration.icon}
            </span>
            <div className="leading-tight">
              <p className="font-handwriting text-lg sm:text-xl leading-none font-bold">
                {celebration.title}
              </p>
              <p className="text-[10px] sm:text-[11px] font-bold opacity-85">
                {celebration.subtitle}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Dimensional Honey-Oak Cafe Counter with wood grain, bevel highlight & unlockable counter items */}
      <div
        className={`landscape-compact-counter pointer-events-none absolute inset-x-0 bottom-0 z-[15] transition-[height] duration-200 ${
          isMobileOpenCafe
            ? 'h-[88px] [@media(min-height:760px)]:h-[164px] sm:h-11 lg:h-12'
            : 'h-9 sm:h-11 lg:h-12'
        }`}
        aria-hidden="true"
      >
        {/* Top horizontal wooden countertop slab */}
        <div
          className="relative h-3.5 sm:h-4 w-full border-t-[2.5px] border-b-2 border-[#5A3E32]/85 bg-gradient-to-b from-[#F4D5A1] via-[#E4B574] to-[#CE9450]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 68px, rgba(138, 86, 40, 0.1) 69px, transparent 71px), linear-gradient(to bottom, #F4D5A1, #E4B574 55%, #CE9450)',
            boxShadow:
              'inset 0 2px 0 rgba(255, 250, 236, 0.7), 0 4px 10px rgba(68, 38, 18, 0.34)',
          }}
        />
        {/* Vertical wooden front wainscoting paneling beneath counter lip — 100% opaque warm oak */}
        <div
          className="h-[calc(100%-14px)] sm:h-[calc(100%-16px)] w-full bg-[#A86B36]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 58px, rgba(72, 41, 18, 0.28) 59px, rgba(244, 202, 144, 0.16) 61px, transparent 62px), linear-gradient(to bottom, rgba(72, 40, 16, 0.36) 0%, rgba(168, 107, 54, 0) 45%, rgba(112, 66, 28, 0.35) 100%)',
          }}
        />

        {/* Unlockable Counter Decor & Souvenirs sitting cleanly on top of the wooden counter */}
        <div className="hidden md:flex absolute -top-10 left-[13.5%] xl:left-[14.5%] z-20 items-end gap-1.5">
          {hasDaisyVase && (
            <DaisyVaseSvg className="h-12 w-10 drop-shadow-[0_3px_4px_rgba(70,40,18,0.28)]" />
          )}
          {hasLuckyPinecone && (
            <SouvenirSvg
              souvenirId="pinecone"
              className="h-8 w-8 drop-shadow-[0_3px_4px_rgba(70,40,18,0.26)]"
            />
          )}
        </div>
      </div>

      {/* Clickable Chapter 2 Trophy: Golden Recipe Book & Magnifier resting cleanly on the right counter */}
      {showGoldenBookSouvenir && (
        <motion.button
          type="button"
          data-golden-book-souvenir="true"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenMysteryModal?.('solved');
          }}
          aria-label="Золота книга рецептів «Мур-Лате»"
          title="Золота книга рецептів «Мур-Лате» — натисни, щоб переглянути пам’ятну картку!"
          className="hidden sm:flex absolute bottom-7 lg:bottom-8 right-[27%] xl:right-[25.5%] z-20 items-center justify-center rounded-xl focus:outline-none"
        >
          <GoldenRecipeBookCounterSvg className="h-10 w-12 drop-shadow-[0_3px_5px_rgba(70,40,18,0.32)]" />
        </motion.button>
      )}

      {/* Clickable Music Box resting on the counter when purchased & enabled */}
      {hasMusicBox && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMusicBox();
          }}
          title={
            musicBoxPlaying && !muted
              ? 'Музична скринька грає! Натисни, щоб поставити на паузу.'
              : 'Музична скринька на паузі. Натисни, щоб увімкнути затишну мелодію!'
          }
          className="hidden sm:flex absolute bottom-7 lg:bottom-8 right-[21%] xl:right-[20%] z-20 items-center justify-center rounded-xl focus:outline-none"
        >
          <MusicBoxCounterSvg
            isPlaying={musicBoxPlaying && !muted}
            className="h-10 w-12 drop-shadow-[0_3px_4px_rgba(70,40,18,0.3)]"
          />
        </motion.button>
      )}

      {/* PORTRAIT PHONE (<640px) Top Row: Speech Bubble + compact Story Invite chip when Chapter 2 awaits */}
      <div className="relative z-20 w-full max-w-[368px] mx-auto sm:hidden space-y-1">
        {speechBubbleContent}
        {isMobileOpenCafe && canOfferMysteryInvite && onOpenMysteryModal && (
          <button
            type="button"
            data-mobile-mystery-invite="true"
            onClick={(e) => {
              e.stopPropagation();
              onOpenMysteryModal('intro');
            }}
            className="mx-auto flex items-center gap-1.5 rounded-full border-2 border-[#C88E35] bg-gradient-to-r from-[#FFF5CF] to-[#FADFA0] px-3 py-0.5 text-[10.5px] font-bold text-[#5A3407] shadow-xs"
          >
            <span aria-hidden="true">🔍</span>
            <span>Нова пригода: загадка Марселя! →</span>
          </button>
        )}
      </div>

      {/* Portrait Mobile Large Guest Standing Behind Wooden Counter (3D depth: behind z-15 bar while Marzipan & Tray sit on front z-20 bar!) */}
      {isMobileOpenCafe && (
        <div
          data-mobile-guest-stage="true"
          className="sm:hidden pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[74px] [@media(min-height:760px)]:bottom-[150px] z-[10] flex flex-col items-center"
        >
          <GuestCard
            orderId={order.id}
            guestId={order.guestId}
            emotion={emotion}
            lastReward={lastReward}
            isBestFriend={guestIsBestFriend}
            largeMobile={true}
          />
        </div>
      )}

      {/* Bottom Counter Row (mobile) / Full Single Horizontal Row (sm+) */}
      <div
        className={`flex w-full items-end justify-between gap-1.5 sm:gap-3 lg:gap-4 min-w-0 ${
          isMobileOpenCafe
            ? 'mb-[34px] [@media(min-height:760px)]:mb-[98px] sm:mb-0'
            : ''
        }`}
      >
        {/* Left Edge on Counter: Sleeping Helper Cat Marzipan with Wardrobe Accessories */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-20 flex shrink-0 items-end pb-0.5"
        >
          <MarzipanHelper
            isPurring={marzipanPurring}
            petsCount={marzipanPetsCount}
            guestHappy={isHappy}
            weather={weather}
            isWarmLampMode={isLateAfternoon || isDayComplete}
            equippedAccessories={equippedAccessories}
            largeMobile={isMobileOpenCafe}
            onPet={onPetMarzipan}
            onOpenCare={onOpenMarzipanCare}
          />
        </div>

        {/* Center: Guest standing cleanly behind counter + Speech Bubble (sm+) */}
        <div className="flex flex-1 items-end justify-center gap-2 md:gap-3 lg:gap-3.5 min-w-0">
          {/* Guest portrait tucked behind z-[15] counter, nameplate on counter at z-20 */}
          <div className="relative flex shrink-0 flex-col items-center">
            <div
              className={`relative z-[10] translate-y-2 ${
                isMobileOpenCafe ? 'hidden sm:block' : ''
              }`}
            >
              <GuestCard
                orderId={order.id}
                guestId={order.guestId}
                emotion={emotion}
                lastReward={lastReward}
                isBestFriend={guestIsBestFriend}
              />
            </div>
            <div
              className={`relative z-20 ${
                isMobileOpenCafe ? 'mb-1 sm:-mt-5 sm:mb-0' : '-mt-4 sm:-mt-5'
              } flex items-center gap-1 rounded-full border-2 px-2.5 sm:px-3.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#5A3E32] shadow-sm whitespace-nowrap`}
              style={{
                backgroundColor: guest.accentBg,
                borderColor: guest.accentBorder,
              }}
            >
              {isTraveler && <span aria-hidden="true">🎒</span>}
              {guestIsBestFriend && <span aria-hidden="true">💖</span>}
              <span>{guest.name}</span>
            </div>
          </div>

          {/* Lighter Speech Bubble beside guest on sm+ — keeps the sunlit window wide open */}
          <div
            className={`hidden sm:block flex-1 min-w-[175px] max-w-[235px] md:max-w-[285px] lg:max-w-[345px] xl:max-w-[385px] transition-all ${
              isWorkbenchOpen ? 'mb-3 md:mb-4' : 'mb-6 md:mb-10'
            }`}
          >
            {speechBubbleContent}
          </div>
        </div>

        {/* Right Side on Counter: Flat Wooden Serving Board */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-20 shrink-0 pb-0.5"
        >
          <ServingTray
            trayDrink={trayDrink}
            trayPastry={trayPastry}
            isHappy={isHappy}
            highlightServe={Boolean(hintsActive && guidedHint?.highlightServe)}
            onServe={onServe}
            onClearTray={onClearTray}
            onClearTrayDrink={onClearTrayDrink}
            onClearTrayPastry={onClearTrayPastry}
          />
        </div>
      </div>
    </section>
  );
});
