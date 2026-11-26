import { motion } from 'framer-motion';
import React from 'react';
import { WEATHER_CONFIG } from '../../data/weather';
import type { SecretDrinkRecipe, WeatherType } from '../../types/game';
import { FishCoinSvg, LogoCatCupSvg, PawBadgeSvg } from '../svg/UiIconsSvg';

interface TopBarProps {
  coins: number;
  servedCount: number;
  weather: WeatherType;
  muted: boolean;
  secretDrink: SecretDrinkRecipe | null;
  bestFriendsCount: number;
  hasNewBestFriend?: boolean;
  onCycleWeather: () => void;
  onToggleMute: () => void;
  onOpenRecipeBook: () => void;
  onOpenSecretCreator: () => void;
  onOpenShop: () => void;
  onOpenFriendshipAlbum: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  coins,
  servedCount,
  weather,
  muted,
  secretDrink,
  bestFriendsCount,
  hasNewBestFriend = false,
  onCycleWeather,
  onToggleMute,
  onOpenRecipeBook,
  onOpenSecretCreator,
  onOpenShop,
  onOpenFriendshipAlbum,
}) => {
  const weatherMeta = WEATHER_CONFIG[weather];

  return (
    <header className="landscape-compact-topbar relative z-30 flex min-h-[50px] sm:min-h-[52px] shrink-0 items-center justify-between gap-1 sm:gap-1.5 border-b-2 border-[#E2CEB4] bg-[#FCF7EC] px-1.5 sm:px-3.5 md:px-4 py-1 shadow-[0_2px_10px_rgba(90,62,50,0.08)]">
      {/* Brand Logo */}
      <div className="flex items-center gap-0.5 min-[390px]:gap-1 sm:gap-2 min-w-0 shrink-0">
        <LogoCatCupSvg className="h-6 w-6 min-[420px]:h-7 min-[420px]:w-7 sm:h-8.5 sm:w-8.5 shrink-0 drop-shadow-xs" />
        <div className="leading-none">
          <h1 className="font-handwriting text-[15.5px] min-[400px]:text-[18px] sm:text-[24px] md:text-[26px] font-bold tracking-wide text-[#5A3E32] whitespace-nowrap">
            Мур-Лате
          </h1>
          <p className="hidden xl:block text-[9.5px] font-semibold text-[#8F6B56] -mt-0.5">
            Акварельна кав’ярня для тваринок
          </p>
        </div>
      </div>

      {/* Right Counters & Controls — strictly 1 clean compact row across 375px..1920px with comfortable mobile tap targets */}
      <div className="flex items-center gap-[2px] min-[390px]:gap-[3px] min-[420px]:gap-1 sm:gap-1.5 min-w-0 shrink-0">
        {/* Live Weather Switcher */}
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCycleWeather}
          title={`${weatherMeta.label}: ${weatherMeta.shortHint}. Натисни, щоб змінити погоду!`}
          aria-label={`Поточна погода: ${weatherMeta.label}. Натисни, щоб перемкнути погоду.`}
          className="flex h-10 w-[31px] min-[390px]:w-[33px] min-[420px]:w-9 sm:h-9 sm:w-auto sm:min-w-[36px] items-center justify-center gap-1 rounded-full border-2 px-0.5 sm:px-2.5 py-0.5 text-[11px] font-bold shadow-xs transition-colors whitespace-nowrap"
          style={{
            backgroundColor: weatherMeta.pillBg,
            borderColor: weatherMeta.pillBorder,
            color: weatherMeta.pillText,
          }}
        >
          <span aria-hidden="true" className="text-[13px] sm:text-sm leading-none">
            {weatherMeta.icon}
          </span>
          <span className="hidden lg:inline">{weatherMeta.label}</span>
          <span className="hidden xl:inline text-[10px] opacity-70">↻</span>
        </motion.button>

        {/* Fish Coins Counter */}
        <motion.div
          key={coins}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 18 }}
          className="flex h-10 sm:h-9 items-center gap-0.5 sm:gap-1 rounded-full border-2 border-[#E3BE73] bg-[#FDF5DC] px-1.5 sm:px-2.5 py-0.5 shadow-xs whitespace-nowrap"
          title="Монетки-рибки"
        >
          <FishCoinSvg className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#7B5218] tabular-nums">
            {coins}
          </span>
          <span className="hidden 2xl:inline text-[10.5px] font-semibold text-[#976C2B]">
            рибок
          </span>
        </motion.div>

        {/* Served Guests Counter (desktop only to keep tablet/phone super spacious) */}
        <div
          className="hidden xl:flex h-9 items-center gap-1 rounded-full border-2 border-[#E9B8C5] bg-[#FDF1F4] px-2.5 py-0.5 shadow-xs whitespace-nowrap"
          title="Обслужені гості"
        >
          <PawBadgeSvg className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[10.5px] font-semibold text-[#9A5368]">
            Гостей:
          </span>
          <span className="text-xs font-bold text-[#8B3E56] tabular-nums">
            {servedCount}
          </span>
        </div>

        {/* Secret Drink of the Day */}
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSecretCreator}
          aria-label="Секретний напій дня"
          title={
            secretDrink
              ? `Напій дня: ${secretDrink.name}`
              : 'Створити «Напій дня»!'
          }
          className={`flex h-10 w-[31px] min-[390px]:w-[33px] min-[420px]:w-9 sm:h-9 sm:w-auto sm:min-w-[36px] items-center justify-center gap-1 rounded-full border-2 px-0.5 sm:px-2.5 py-0.5 text-[11px] font-bold transition-all whitespace-nowrap ${
            secretDrink
              ? 'border-[#D49D43] bg-gradient-to-b from-[#FFF6D6] to-[#FAE2A3] text-[#6A410E] shadow-xs hover:brightness-105'
              : 'border-[#E0A33F] bg-gradient-to-b from-[#FFF7D9] to-[#F7D782] text-[#6B400B] shadow-[0_0_10px_rgba(235,180,68,0.55)] hover:brightness-105'
          }`}
        >
          <span
            aria-hidden="true"
            className={!secretDrink ? 'animate-pulse text-[13px] sm:text-sm leading-none' : 'text-[13px] sm:text-sm leading-none'}
          >
            {secretDrink ? secretDrink.icon : '✨'}
          </span>
          <span className="hidden md:inline">Напій дня</span>
        </motion.button>

        {/* Shop & Marzipan Wardrobe Button */}
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenShop}
          aria-label="Відкрити Магазин і Гардероб Марципана"
          title="Магазин і Гардероб Марципана"
          className="flex h-10 w-[31px] min-[390px]:w-[33px] min-[420px]:w-9 sm:h-9 sm:w-auto sm:min-w-[36px] items-center justify-center gap-1 rounded-full border-2 border-[#C88EA4] bg-gradient-to-b from-[#FFF1F5] to-[#F8D6E1] px-0.5 sm:px-2.5 py-0.5 text-[11px] font-bold text-[#7C324B] shadow-xs hover:brightness-98 whitespace-nowrap"
        >
          <span aria-hidden="true" className="text-[13px] sm:text-sm leading-none">
            🛍️
          </span>
          <span className="hidden md:inline">Магазин</span>
        </motion.button>

        {/* Friendship Album Button */}
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenFriendshipAlbum}
          aria-label="Відкрити Альбом дружби"
          title={`Альбом дружби (${bestFriendsCount}/6 найкращих друзів)`}
          className="relative flex h-10 w-[31px] min-[390px]:w-[33px] min-[420px]:w-9 sm:h-9 sm:w-auto sm:min-w-[36px] items-center justify-center gap-1 rounded-full border-2 border-[#94BE9F] bg-gradient-to-b from-[#EFF9F2] to-[#D4ECDC] px-0.5 sm:px-2.5 py-0.5 text-[11px] font-bold text-[#245A38] shadow-xs hover:brightness-98 whitespace-nowrap"
        >
          <span aria-hidden="true" className="text-[13px] sm:text-sm leading-none">
            📸
          </span>
          <span className="hidden md:inline">Друзі</span>
          {bestFriendsCount > 0 && (
            <span className="hidden lg:inline rounded-full bg-[#FFFDF8]/90 px-1.5 py-0.2 text-[9.5px] font-bold text-[#2A633E]">
              {bestFriendsCount}/6
            </span>
          )}
          {hasNewBestFriend && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#E85C84] ring-2 ring-[#FCF7EC] animate-pulse" />
          )}
        </motion.button>

        {/* Recipe Book Button */}
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenRecipeBook}
          aria-label="Відкрити Книгу рецептів"
          title="Книга рецептів"
          className="flex h-10 w-[31px] min-[390px]:w-[33px] min-[420px]:w-9 sm:h-9 sm:w-auto sm:min-w-[36px] items-center justify-center gap-1 rounded-full border-2 border-[#D4A36C] bg-[#FBEBD4] px-0.5 sm:px-2.5 py-0.5 text-[11px] font-bold text-[#5A3E32] shadow-xs hover:bg-[#F7DFBE] whitespace-nowrap"
        >
          <span aria-hidden="true" className="text-[13px] sm:text-sm leading-none">
            📖
          </span>
          <span className="hidden md:inline">Рецепти</span>
        </motion.button>

        {/* Sound Toggle Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleMute}
          aria-label={muted ? 'Увімкнути звук' : 'Вимкнути звук'}
          title={muted ? 'Увімкнути звук' : 'Вимкнути звук'}
          className={`flex h-10 w-[31px] min-[390px]:w-[33px] min-[420px]:w-9 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            muted
              ? 'border-[#D4C3B4] bg-[#F2EAE1] text-[#8E7767]'
              : 'border-[#96C3A4] bg-[#E5F2E8] text-[#356947]'
          }`}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </motion.button>
      </div>
    </header>
  );
};
