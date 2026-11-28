import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { CAFE_ASSETS } from '../../config/assets';
import {
  BEST_FRIEND_THRESHOLD,
  GUESTS,
  REGULAR_GUEST_IDS,
} from '../../data/guests';
import {
  FRIENDSHIP_MOMENTS,
  FRIENDSHIP_MOMENT_ORDER,
} from '../../data/livingFriendship';
import { RARE_STICKER_CATALOG } from '../../data/stickers';
import type {
  GuestId,
  LivingFriendshipState,
  RareStickerId,
} from '../../types/game';
import { AssetIllustration } from '../common/AssetIllustration';
import { SouvenirSvg } from '../svg/CafeDecorAndSouvenirsSvg';
import { GuestCharacterSvg } from '../svg/GuestCharacterSvg';
import { StickerIconSvg } from '../svg/TakeawayCupSvg';

interface FriendshipAlbumModalProps {
  isOpen: boolean;
  friendship: Partial<Record<GuestId, number>>;
  unlockedRareStickers: RareStickerId[];
  travelerVisits: number;
  livingFriendship?: LivingFriendshipState;
  onClose: () => void;
}

export const FriendshipAlbumModal: React.FC<FriendshipAlbumModalProps> = ({
  isOpen,
  friendship,
  unlockedRareStickers,
  travelerVisits,
  livingFriendship,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <FriendshipAlbumInner
          friendship={friendship}
          unlockedRareStickers={unlockedRareStickers}
          travelerVisits={travelerVisits}
          livingFriendship={livingFriendship}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
};

const FriendshipAlbumInner: React.FC<{
  friendship: Partial<Record<GuestId, number>>;
  unlockedRareStickers: RareStickerId[];
  travelerVisits: number;
  livingFriendship?: LivingFriendshipState;
  onClose: () => void;
}> = ({
  friendship,
  unlockedRareStickers,
  travelerVisits,
  livingFriendship,
  onClose,
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const bestFriendsCount = REGULAR_GUEST_IDS.filter(
    (id) => (friendship[id] ?? 0) >= BEST_FRIEND_THRESHOLD
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5A3E32]/48 sm:backdrop-blur-[2px] p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Альбом дружби Мур-Лате"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="watercolor-notebook relative flex h-[94dvh] sm:h-auto sm:max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl sm:rounded-[2rem] border-4 border-[#CFA982] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E6D1B8] bg-gradient-to-r from-[#FDF1F5] via-[#FAF2E5] to-[#EEF7F0] px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl sm:text-2xl shrink-0" aria-hidden="true">
              📸
            </span>
            <div className="min-w-0">
              <h2 className="font-handwriting text-2xl sm:text-3xl leading-none font-bold text-[#5A3E32]">
                Альбом дружби «Мур-Лате»
              </h2>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#8A644B] mt-0.5">
                Набери 3/3 ❤️ з гостем — отримай секретний факт, сувенір у кав’ярню та +5 🐟 чайових назавжди!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border-2 border-[#E6A6B8] bg-[#FDF0F4] px-3 py-1 text-xs font-bold text-[#8E3C55]">
              💖 Друзів: {bestFriendsCount} / {REGULAR_GUEST_IDS.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрити альбом дружби"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E0ACBC] bg-[#FDF0F4] text-base font-bold text-[#914059] hover:bg-[#F7D7E0]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Polaroid Album Pages */}
        <div className="cozy-scroll flex-1 overflow-y-auto p-3.5 sm:p-5">
          {/* 6 Regular Guest Polaroids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {REGULAR_GUEST_IDS.map((guestId, index) => {
              const guest = GUESTS[guestId];
              const count = friendship[guestId] ?? 0;
              const hearts = Math.min(BEST_FRIEND_THRESHOLD, count);
              const isBest = count >= BEST_FRIEND_THRESHOLD;
              const remaining = Math.max(0, BEST_FRIEND_THRESHOLD - count);

              return (
                <div
                  key={guestId}
                  className={`relative flex flex-col rounded-2xl border-2 bg-[#FFFDF9] p-3 shadow-[0_6px_16px_-6px_rgba(90,62,50,0.2)] transition-transform hover:-translate-y-0.5 ${
                    isBest ? 'border-[#DDA747]' : 'border-[#DFC6AA]'
                  }`}
                >
                  {/* Decorative pastel masking tape on top of polaroid */}
                  <div
                    className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 h-3.5 w-14 rounded-xs opacity-75"
                    style={{
                      backgroundColor:
                        index % 3 === 0
                          ? '#F5C4D2'
                          : index % 3 === 1
                            ? '#C5E0CD'
                            : '#F4DA9D',
                      transform: `translateX(-50%) rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                    }}
                  />

                  {/* Golden Paw Seal when 3/3 Best Friend! */}
                  {isBest && (
                    <div
                      title="Найкращий друг! +5 🐟 чайових до кожного замовлення"
                      className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full border-2 border-[#D4972C] bg-gradient-to-b from-[#FFF3C4] to-[#F3CA63] px-2 py-0.5 text-[10px] font-bold text-[#5A3408] shadow-sm"
                    >
                      <span>🐾</span>
                      <span>Друг!</span>
                    </div>
                  )}

                  {/* Polaroid Photo Box */}
                  <div
                    className="relative flex h-32 items-end justify-center overflow-hidden rounded-xl border"
                    style={{
                      backgroundColor: guest.accentBg,
                      borderColor: guest.accentBorder,
                    }}
                  >
                    <AssetIllustration
                      src={CAFE_ASSETS.guests[guestId]}
                      alt={guest.name}
                      className="h-28 w-28"
                      imgClassName="h-full w-full object-contain object-bottom"
                      fallback={
                        <GuestCharacterSvg
                          guestId={guestId}
                          emotion={isBest ? 'happy' : 'waiting'}
                          className="h-full w-full"
                        />
                      }
                    />
                  </div>

                  {/* Polaroid Caption & Hearts */}
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-handwriting text-xl leading-none font-bold text-[#5A3E32]">
                        {guest.name}
                      </h3>
                      <p className="text-[10px] font-semibold text-[#8E6A52]">
                        {guest.subtitle}
                      </p>
                    </div>

                    {/* 3 Heart Meter */}
                    <div
                      className="flex items-center gap-0.5 rounded-full border border-[#EBC1CE] bg-[#FDF2F5] px-2 py-0.5"
                      title={`Дружба: ${hearts} / ${BEST_FRIEND_THRESHOLD}`}
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`text-xs leading-none ${
                            i < hearts ? 'opacity-100' : 'opacity-25 grayscale'
                          }`}
                        >
                          ❤️
                        </span>
                      ))}
                      <span className="ml-1 text-[10px] font-bold text-[#8E3C55]">
                        {hearts}/3
                      </span>
                    </div>
                  </div>

                  {/* Unlocked Secret Fact & Souvenir OR Mystery Teaser */}
                  {isBest ? (
                    <div className="mt-2.5 flex flex-1 flex-col justify-between gap-2 rounded-xl border border-[#E7C98A] bg-[#FFF9EB] p-2.5">
                      <p className="text-[10.5px] leading-snug text-[#634329]">
                        <strong className="text-[#8E5616]">Секрет:</strong>{' '}
                        {guest.secretFact}
                      </p>
                      <p className="text-[10px] font-bold text-[#7C522B]">
                        ⭐ Улюблене комбо: {guest.favoriteComboLabel}
                      </p>
                      <div className="flex items-center justify-between gap-2 rounded-lg bg-[#FFFDF8] border border-[#E8D0A7] px-2 py-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <SouvenirSvg souvenirId={guestId} className="h-6 w-6 shrink-0" />
                          <span className="truncate text-[10px] font-bold text-[#5A3E32]">
                            {guest.souvenirName}
                          </span>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#E3F4E7] px-1.5 py-0.5 text-[9.5px] font-bold text-[#1F5E38]">
                          +5 🐟
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#D8BFA3] bg-[#FAF2E5]/75 p-2.5 text-center">
                      <span className="text-base opacity-70" aria-hidden="true">
                        🎁
                      </span>
                      <p className="text-[10.5px] font-semibold text-[#846046] leading-snug">
                        Почастуй ще <strong>{remaining}</strong>{' '}
                        {remaining === 1 ? 'раз' : 'рази'}, щоб відкрити секрет і отримати сувенір «{guest.souvenirEmoji} {guest.souvenirName}»!
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 7th Special Polaroid Card: Traveler Cat & Rare Stickers Collection */}
          <div className="mt-4 rounded-3xl border-2 border-[#D9A24B] bg-gradient-to-r from-[#FFF8E4] via-[#FCF2D9] to-[#F4F8EC] p-4 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Traveler Polaroid Portrait */}
              <div className="relative flex h-36 w-36 shrink-0 flex-col items-center justify-end overflow-hidden rounded-2xl border-4 border-[#FFFDF8] bg-[#FBEFD8] shadow-md">
                <span className="absolute left-1.5 top-1.5 rounded-full bg-[#6B4318]/90 px-2 py-0.5 text-[9.5px] font-bold text-[#FFF6DC]">
                  🎒 Особливий
                </span>
                <AssetIllustration
                  src={CAFE_ASSETS.guests.mandrivnyk}
                  alt="Котик-мандрівник"
                  className="h-30 w-30"
                  imgClassName="h-full w-full object-contain object-bottom"
                  fallback={
                    <GuestCharacterSvg
                      guestId="mandrivnyk"
                      emotion="happy"
                      className="h-full w-full"
                    />
                  }
                />
              </div>

              <div className="flex flex-1 flex-col gap-2 min-w-0 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                  <div>
                    <h3 className="font-handwriting text-2xl leading-none font-bold text-[#5A3912]">
                      🎒 Котик-мандрівник
                    </h3>
                    <p className="text-[11px] font-semibold text-[#855B2A] mt-0.5">
                      Заходить у гості раз на 6–7 відвідувачів. Пригости його будь-чим від щирого серця — отримаєш рідкісний стікер!
                    </p>
                  </div>
                  <span className="rounded-full border border-[#D49F4A] bg-[#FFFDF8] px-3 py-0.5 text-[11px] font-bold text-[#6E4410]">
                    Візитів: {travelerVisits} • Стікерів: {unlockedRareStickers.length} / 5
                  </span>
                </div>

                {/* 5 Rare Exclusive Stickers Showcase */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {RARE_STICKER_CATALOG.map((st) => {
                    const unlocked = unlockedRareStickers.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        title={
                          unlocked
                            ? `${st.label}: ${st.description}`
                            : 'Ще не відкрито — пригости Котика-мандрівника!'
                        }
                        className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1.5 py-2 text-center ${
                          unlocked
                            ? 'border-[#DFA53A] bg-[#FFFDF6] shadow-xs'
                            : 'border-dashed border-[#D3BE9E] bg-[#F5EBDC]/60 opacity-65'
                        }`}
                      >
                        {unlocked ? (
                          <StickerIconSvg stickerId={st.id} className="h-9 w-9" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-[#C7AE8D] bg-[#FAF2E5] text-sm font-bold text-[#A5896B]">
                            ?
                          </div>
                        )}
                        <span className="text-[9.5px] sm:text-[10px] font-bold leading-tight text-[#5A3E32]">
                          {unlocked ? st.label : 'Таємний стікер'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* Living Friendship Moments Strip: Cross-Guest Secret Surprises & Mood Riddles */}
          {livingFriendship && (
            <div
              data-living-friendship-section="true"
              className="mt-4 rounded-3xl border-2 border-[#DFA7BB] bg-gradient-to-br from-[#FFF4F8] via-[#FFFDF8] to-[#F3FAF5] p-4 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-handwriting text-2xl leading-none font-bold text-[#7C2B47]">
                    💌 Теплі моменти між друзями (
                    {livingFriendship.completedMoments.length} /{' '}
                    {FRIENDSHIP_MOMENT_ORDER.length})
                  </h3>
                  <p className="text-[11px] font-semibold text-[#7A5448] mt-0.5">
                    Друзі інколи передають сюрпризи одне одному через твою кав’ярню та загадують загадки настрою!
                  </p>
                </div>
                <span className="rounded-full border border-[#B597DC] bg-[#F5EEFC] px-3 py-0.5 text-[11px] font-bold text-[#4D2E75]">
                  🤔 Загадок розгадано: {livingFriendship.moodRiddlesSolved}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FRIENDSHIP_MOMENT_ORDER.map((momentId) => {
                  const meta = FRIENDSHIP_MOMENTS[momentId];
                  const unlocked =
                    livingFriendship.completedMoments.includes(momentId);
                  return (
                    <div
                      key={momentId}
                      data-friendship-moment={momentId}
                      data-moment-unlocked={unlocked ? 'true' : 'false'}
                      className={`rounded-2xl border-2 p-3 transition-all ${
                        unlocked
                          ? 'border-[#DF9EB4] bg-[#FFFDF9] shadow-2xs'
                          : 'border-dashed border-[#D8BFA8] bg-[#FAF2E7]/75 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#5A3E32]">
                          {unlocked ? `${meta.emoji} ${meta.title}` : '🔒 Таємний сюрприз друзів'}
                        </span>
                        <span className="rounded-full bg-[#F9ECF0] px-2 py-0.5 text-[9.5px] font-bold text-[#883854]">
                          {GUESTS[meta.fromGuestId].name.split(' ')[1]} →{' '}
                          {GUESTS[meta.toGuestId].name.split(' ')[1]}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] font-semibold leading-snug text-[#6E4D3A]">
                        {unlocked
                          ? meta.albumMemory
                          : 'Грай далі — незабаром ці друзі передадуть теплий сюрприз одне одному через твою стійку!'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
