import { motion } from 'framer-motion';
import React from 'react';
import { DAY_THEMES } from '../../data/days';
import type { DayProgressState, StationTab } from '../../types/game';

interface StationTabsProps {
  activeTab: StationTab;
  dayProgress: DayProgressState;
  onSelectTab: (tab: StationTab) => void;
  onOpenDayJournal: () => void;
}

const TABS: Array<{
  id: StationTab;
  icon: string;
  shortLabel: string;
  label: string;
  dotColor: string;
}> = [
  {
    id: 'hot',
    icon: '☕',
    shortLabel: 'Кава/какао',
    label: 'Кава та какао',
    dotColor: '#C5844A',
  },
  {
    id: 'cold',
    icon: '🍹',
    shortLabel: 'Коктейлі',
    label: 'Дитячі коктейлі',
    dotColor: '#69A87E',
  },
  {
    id: 'pastry',
    icon: '🥐',
    shortLabel: 'Випічка',
    label: 'Випічка',
    dotColor: '#D67F98',
  },
];

export const StationTabs: React.FC<StationTabsProps> = ({
  activeTab,
  dayProgress,
  onSelectTab,
  onOpenDayJournal,
}) => {
  const dayTheme = DAY_THEMES[dayProgress.themeId];
  const servedToday = dayProgress.guestsServedToday.length;

  return (
    <nav
      className="flex shrink-0 items-end justify-between gap-1 sm:gap-2 px-0.5 sm:px-1"
      aria-label="Станції приготування"
    >
      <div className="flex flex-1 sm:flex-none items-end gap-1 sm:gap-2 min-w-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex min-h-[38px] sm:min-h-[38px] flex-1 sm:flex-none items-center justify-center gap-1 sm:gap-1.5 rounded-t-2xl border-2 border-b-0 px-1.5 sm:px-4 md:px-5 py-1.5 text-[10.5px] sm:text-xs md:text-[13px] font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'z-10 -mb-[2px] border-[#8C6248] bg-gradient-to-b from-[#FBF2E2] via-[#F2E2C9] to-[#EAD7BE] pb-2 text-[#4A2E1D] shadow-[0_-3px_10px_rgba(90,56,32,0.12),inset_0_1px_0_rgba(255,252,245,0.9)]'
                  : 'border-[#7A523B]/80 bg-gradient-to-b from-[#DFC19C] to-[#CEAA81] text-[#5B3C28] shadow-[inset_0_-2px_5px_rgba(90,56,32,0.14)] hover:from-[#E7CCA9] hover:to-[#D8B68E]'
              }`}
            >
              <span aria-hidden="true" className="text-xs sm:text-sm leading-none">
                {tab.icon}
              </span>
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {isActive && (
                <span
                  className="hidden min-[400px]:inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full shrink-0"
                  style={{ backgroundColor: tab.dotColor }}
                  aria-hidden="true"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Diegetic Day Progress Pill — clickable to open Living Café Diary (zero TopBar bloat!) */}
      <motion.button
        type="button"
        data-day-pill="true"
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpenDayJournal}
        title={`День ${dayProgress.dayNumber}: ${dayTheme.title} (${servedToday}/${dayProgress.guestsTarget} гостей). Натисни, щоб відкрити Щоденник спогадів!`}
        aria-label={`День ${dayProgress.dayNumber}, ${dayTheme.title}, обслужено ${servedToday} з ${dayProgress.guestsTarget} гостей. Відкрити щоденник.`}
        className="mb-1 flex min-h-[34px] sm:min-h-[32px] shrink-0 items-center gap-1 sm:gap-2 rounded-full border-2 px-2 sm:px-3 py-0.5 text-[10px] sm:text-[11px] font-bold shadow-xs transition-all hover:brightness-98 whitespace-nowrap"
        style={{
          backgroundColor: dayTheme.pillBg,
          borderColor: dayTheme.pillBorder,
          color: dayTheme.pillText,
        }}
      >
        <span aria-hidden="true" className="text-xs sm:text-sm leading-none">
          {dayTheme.icon}
        </span>
        <span className="sm:hidden tabular-nums">
          Д{dayProgress.dayNumber}·{servedToday}/{dayProgress.guestsTarget}
        </span>
        <span className="hidden sm:inline">День {dayProgress.dayNumber}</span>
        <span className="hidden lg:inline opacity-80">• {dayTheme.title}</span>
        <span
          className="hidden sm:inline-flex items-center gap-0.5"
          aria-hidden="true"
        >
          {Array.from({ length: dayProgress.guestsTarget }).map((_, idx) => (
            <span
              key={idx}
              className={`h-2 w-2 rounded-full border transition-colors ${
                idx < servedToday
                  ? 'border-[#3E7A56] bg-[#69B886]'
                  : 'border-current/45 bg-white/75'
              }`}
            />
          ))}
        </span>
        <span className="hidden sm:inline text-[10px] opacity-80 tabular-nums">
          {servedToday}/{dayProgress.guestsTarget}
        </span>
      </motion.button>
    </nav>
  );
};
