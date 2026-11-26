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
import type {
  CafeDecorId,
  GuestEmotion,
  GuestId,
  MarzipanEquipped,
  Order,
  PreparedDrink,
  PreparedPastry,
  RareStickerId,
  SecretDrinkRecipe,
  WeatherType,
} from '../../types/game';
import { AssetIllustration } from '../common/AssetIllustration';
import { CafeBackgroundSvg } from '../svg/CafeBackgroundSvg';
import {
  CatWallClockSvg,
  DaisyVaseSvg,
  MusicBoxCounterSvg,
  SouvenirSvg,
  TwinkleStarsGarlandSvg,
} from '../svg/CafeDecorAndSouvenirsSvg';
import { GuestCard } from './GuestCard';
import { MarzipanHelper } from './MarzipanHelper';
import { ServingTray } from './ServingTray';
import { WindowWeatherOverlay } from './WindowWeatherOverlay';

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
  equippedAccessories: MarzipanEquipped;
  enabledDecor: CafeDecorId[];
  musicBoxPlaying: boolean;
  muted: boolean;
  friendship: Partial<Record<GuestId, number>>;
  unlockedRareStickers: RareStickerId[];
  secretDrink: SecretDrinkRecipe | null;
  lastReward: number | null;
  celebration: CelebrationBanner | null;
  onPetMarzipan: () => void;
  onToggleMusicBox: () => void;
  onOpenSecretCreator: () => void;
  onOpenFriendshipAlbum: () => void;
  onServe: () => void;
  onClearTray: () => void;
  onClearTrayDrink: () => void;
  onClearTrayPastry: () => void;
  onNextGuest: () => void;
}

export const CafeHallScene: React.FC<CafeHallSceneProps> = ({
  order,
  weather,
  emotion,
  speechText,
  trayDrink,
  trayPastry,
  marzipanPurring,
  equippedAccessories,
  enabledDecor,
  musicBoxPlaying,
  muted,
  friendship,
  unlockedRareStickers,
  secretDrink,
  lastReward,
  celebration,
  onPetMarzipan,
  onToggleMusicBox,
  onOpenSecretCreator,
  onOpenFriendshipAlbum,
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

  const unlockedFriendSouvenirs = REGULAR_GUEST_IDS.filter(
    (id) => (friendship[id] ?? 0) >= BEST_FRIEND_THRESHOLD
  );

  const speechBubbleContent = (
    <motion.div
      key={`${order.id}-${speechText}`}
      initial={{ opacity: 0.72, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22 }}
      className={`watercolor-card landscape-compact-bubble relative z-20 rounded-2xl sm:rounded-3xl border-2 px-3 py-1.5 sm:px-3.5 sm:py-2.5 transition-colors ${
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
        className={`hidden sm:block absolute -left-2.5 bottom-6 h-4 w-4 rotate-45 border-b-2 border-l-2 bg-[#FFFDF8] ${
          isHappy
            ? 'border-[#96C7A6]'
            : isTraveler
              ? 'border-[#D9A24B]'
              : emotion === 'no_coffee' || emotion === 'surprised'
                ? 'border-[#E69CB0]'
                : 'border-[#DFC2A0]'
        }`}
      />

      <p className="relative z-10 text-[11px] sm:text-xs font-bold leading-snug text-[#5A3E32]">
        {speechText}
      </p>

      {!isHappy ? (
        <div className="relative z-10 mt-1.5 flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {isTraveler ? (
              <>
                <span className="inline-flex items-center gap-1 rounded-xl border border-[#C98E35] bg-[#FFF4D2] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#6E420A]">
                  🎒 Особливий гість
                </span>
                <span className="inline-flex items-center gap-1 rounded-xl border border-[#8EB898] bg-[#ECF7EF] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#215936]">
                  💛 {drinkName} (або будь-яке частування!)
                </span>
              </>
            ) : (
              <>
                {order.serviceMode === 'takeaway' && (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-[#DFB257] bg-[#FFF4D1] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#7A4E14]">
                    🏃 Із собою
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1 rounded-xl border px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10.5px] sm:text-[11px] font-bold ${
                    isSecretOrder
                      ? 'border-[#D9A143] bg-[#FFF4D6] text-[#6C420C]'
                      : 'border-[#DFBE97] bg-[#FBF0DE] text-[#664128]'
                  }`}
                >
                  <span aria-hidden="true">
                    {isSecretOrder
                      ? (order.secretDrink?.icon ?? '⭐')
                      : drinkTab === 'hot'
                        ? '☕'
                        : '🍹'}
                  </span>
                  <span>{drinkName}</span>
                </span>

                {pastryRecipe && (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-[#EAB5C4] bg-[#FDF0F4] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10.5px] sm:text-[11px] font-bold text-[#883C54]">
                    <span aria-hidden="true">🥐</span>
                    <span>{pastryRecipe.name}</span>
                  </span>
                )}

                {order.wantsLatteArt && (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-[#D49EB0] bg-[#FDF0F5] px-2 py-0.5 text-[10px] font-bold text-[#8B3A54]">
                    🎨 +Лате-арт
                  </span>
                )}
              </>
            )}
          </div>

          <div className="hidden sm:flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] leading-tight font-semibold text-[#8E6950]">
            {isTraveler ? (
              <span className="text-[#7C4E12]">
                🎁 Подарунок за доброту: рідкісний золотий стікер!
              </span>
            ) : (
              <span>
                {isSecretOrder
                  ? `Напій дня (+${order.isCombo ? 40 : 25} 🐟)`
                  : order.isCombo
                    ? 'Комбо (+30 🐟)'
                    : 'Замовлення (+15 🐟)'}
                {order.serviceMode === 'takeaway' ? ' • +5 🐟 за стікер' : ''}
                {order.wantsLatteArt ? ' • +5 🐟 за лате-арт' : ''}
                {guestIsBestFriend ? ' • +5 🐟 від друга 💖' : ''}
              </span>
            )}
          </div>
        </div>
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
            className="min-h-[34px] rounded-full border-2 border-[#84BC96] bg-[#B7DEC3] px-3 py-0.5 text-[11px] font-bold text-[#235436] shadow-xs hover:bg-[#A3D2B1]"
          >
            Наступний гість →
          </motion.button>
        </div>
      )}
    </motion.div>
  );

  return (
    <section
      className="landscape-compact-scene relative flex h-[38%] sm:h-[42%] lg:h-auto lg:flex-1 min-h-[240px] shrink-0 w-full flex-col justify-between sm:flex-row sm:items-end overflow-hidden border-b-4 border-[#6B4223] px-2 sm:px-4 lg:px-6 pb-1.5 sm:pb-2 pt-1.5 sm:pt-2"
      aria-label="Зала кав’ярні та вікно з погодою"
    >
      {/* Background: Rich vibrant 21:9 panoramic `/assets/bg-cafe.png` */}
      <AssetIllustration
        src={CAFE_ASSETS.background}
        alt="Акварельний інтер’єр кав’ярні Мур-Лате"
        className="absolute inset-0 h-full w-full pointer-events-none"
        imgClassName="h-full w-full object-cover object-[50%_54%] xl:object-[50%_48%]"
        fallback={<CafeBackgroundSvg weather={weather} />}
      />

      {/* Warm amber lamp glow + live weather effects over central window */}
      <WindowWeatherOverlay weather={weather} />

      {/* Shop Decor: Twinkling Golden Stars along Top Garland */}
      {hasTwinkleStars && <TwinkleStarsGarlandSvg />}

      {/* Shop Decor: Wooden Cat Wall Clock on cozy wooden pillar beside window */}
      {hasCatClock && (
        <div
          title="Настінний годинник-котик"
          className="pointer-events-none hidden sm:block absolute left-[63.5%] xl:left-[64.5%] top-2.5 z-[13] drop-shadow-[0_4px_6px_rgba(68,38,18,0.3)]"
        >
          <CatWallClockSvg className="h-14 w-10 lg:h-16 lg:w-12" />
        </div>
      )}

      {/* Cozy In-Cafe Chalkboard Plaque displaying current Secret Drink of the Day */}
      {secretDrink && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenSecretCreator}
          title="Натисни, щоб змінити «Секретний напій дня»"
          className="hidden sm:flex absolute left-3 top-2.5 z-20 items-center gap-1.5 rounded-2xl border-2 border-[#C89A67] bg-[#4C3629]/92 px-3 py-1 text-left shadow-[0_4px_12px_rgba(48,28,14,0.34)]"
        >
          <span className="text-base leading-none">{secretDrink.icon}</span>
          <div className="leading-tight">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-[#F4D8A8]">
              Напій дня
            </span>
            <span className="font-handwriting block text-base leading-none font-bold text-[#FFF9EE]">
              {secretDrink.name}
            </span>
          </div>
        </motion.button>
      )}

      {/* Best-Friend Souvenirs Shelf (top-right wooden ledge on sm+, clickable to open Friendship Album) */}
      {unlockedFriendSouvenirs.length > 0 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onOpenFriendshipAlbum}
          title="Сувеніри від найкращих друзів! Натисни, щоб відкрити Альбом дружби."
          className="hidden sm:flex absolute right-3 top-2.5 z-20 flex-col items-center rounded-2xl border-2 border-[#B6824C] bg-[#FAF0DE]/92 px-2.5 py-1 shadow-[0_4px_12px_rgba(62,36,18,0.24)] hover:brightness-102"
        >
          <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#8C5D34] leading-none mb-0.5">
            💖 Поличка друзів
          </span>
          <div className="flex items-end gap-1">
            {unlockedFriendSouvenirs.map((friendId) => (
              <span
                key={friendId}
                title={`${GUESTS[friendId].name}: ${GUESTS[friendId].souvenirName}`}
                className="inline-flex"
              >
                <SouvenirSvg souvenirId={friendId} className="h-7 w-7" />
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
        className="landscape-compact-counter pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-9 sm:h-11 lg:h-12"
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

      {/* Clickable Music Box resting on the counter when purchased & enabled */}
      {hasMusicBox && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleMusicBox}
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

      {/* PORTRAIT PHONE (<640px) Top Row: Speech Bubble cleanly positioned at top */}
      <div className="relative z-20 w-full max-w-[368px] mx-auto sm:hidden">
        {speechBubbleContent}
      </div>

      {/* Bottom Counter Row (mobile) / Full Single Horizontal Row (sm+) */}
      <div className="flex w-full items-end justify-between gap-1.5 sm:gap-3 lg:gap-4 min-w-0">
        {/* Left Edge on Counter: Sleeping Helper Cat Marzipan with Wardrobe Accessories */}
        <div className="relative z-20 flex shrink-0 items-end pb-0.5">
          <MarzipanHelper
            isPurring={marzipanPurring}
            equippedAccessories={equippedAccessories}
            onPet={onPetMarzipan}
          />
        </div>

        {/* Center: Guest standing cleanly behind counter + Speech Bubble (sm+) */}
        <div className="flex flex-1 items-end justify-center gap-2 md:gap-3.5 lg:gap-4 min-w-0">
          {/* Guest portrait tucked behind z-[15] counter, nameplate on counter at z-20 */}
          <div className="relative flex shrink-0 flex-col items-center">
            <div className="relative z-[10] translate-y-2">
              <GuestCard
                orderId={order.id}
                guestId={order.guestId}
                emotion={emotion}
                lastReward={lastReward}
                isBestFriend={guestIsBestFriend}
              />
            </div>
            <div
              className="relative z-20 -mt-4 sm:-mt-5 flex items-center gap-1 rounded-full border-2 px-2.5 sm:px-3.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#5A3E32] shadow-sm whitespace-nowrap"
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

          {/* Speech Bubble beside guest on sm+ */}
          <div className="hidden sm:block mb-5 md:mb-7 flex-1 min-w-[180px] max-w-[240px] md:max-w-[300px] lg:max-w-[380px] xl:max-w-[430px]">
            {speechBubbleContent}
          </div>
        </div>

        {/* Right Side on Counter: Serving Tray */}
        <div className="relative z-20 shrink-0 pb-0.5">
          <ServingTray
            trayDrink={trayDrink}
            trayPastry={trayPastry}
            isHappy={isHappy}
            onServe={onServe}
            onClearTray={onClearTray}
            onClearTrayDrink={onClearTrayDrink}
            onClearTrayPastry={onClearTrayPastry}
          />
        </div>
      </div>
    </section>
  );
};
