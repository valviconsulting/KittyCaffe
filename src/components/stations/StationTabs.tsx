import { motion } from 'framer-motion';
import React from 'react';
import { DAY_THEMES } from '../../data/days';
import type {
  DayProgressState,
  PuhBirthdayStoryState,
  RecipeMysteryStoryState,
  StationTab,
} from '../../types/game';
import type { DayJournalTab } from '../modals/DayJournalModal';

interface StationTabsProps {
  activeTab: StationTab;
  isOpen: boolean;
  suggestedTabs?: StationTab[];
  highlightTab?: StationTab | null;
  dayProgress: DayProgressState;
  puhBirthday?: PuhBirthdayStoryState;
  recipeMystery?: RecipeMysteryStoryState;
  unreadLettersCount?: number;
  onSelectTab: (tab: StationTab) => void;
  onToggleOpen: () => void;
  onOpenDayJournal: (tab?: DayJournalTab) => void;
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
    shortLabel: 'Кава',
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
  isOpen,
  suggestedTabs = [],
  highlightTab = null,
  dayProgress,
  puhBirthday,
  recipeMystery,
  unreadLettersCount = 0,
  onSelectTab,
  onToggleOpen,
  onOpenDayJournal,
}) => {
  const dayTheme = DAY_THEMES[dayProgress.themeId];
  const servedToday = dayProgress.guestsServedToday.length;
  const isBirthdayActive = puhBirthday?.status === 'active';
  const isMysteryActive = recipeMystery?.status === 'active';

  return (
    <nav
      className="flex shrink-0 items-end justify-between gap-1 sm:gap-2 px-0.5 sm:px-1"
      aria-label="Станції приготування"
    >
      <div className="flex flex-1 sm:flex-none items-end gap-1 sm:gap-2 min-w-0">
        {TABS.map((tab) => {
          const isActive = isOpen && activeTab === tab.id;
          const isSuggested = !isOpen && suggestedTabs.includes(tab.id);
          const isGuidedTarget = highlightTab === tab.id && !isActive;

          return (
            <motion.button
              key={tab.id}
              type="button"
              data-station-tab={tab.id}
              aria-expanded={isActive}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex min-h-[38px] sm:min-h-[38px] min-w-0 flex-1 sm:flex-none items-center justify-center gap-0.5 sm:gap-1.5 px-0.5 sm:px-4 md:px-5 py-1.5 text-[9.5px] min-[400px]:text-[10px] sm:text-xs md:text-[13px] font-bold transition-all whitespace-nowrap ${
                isOpen
                  ? isActive
                    ? 'z-10 -mb-[2px] rounded-t-2xl border-2 border-b-0 border-[#8C6248] bg-gradient-to-b from-[#FBF2E2] via-[#F2E2C9] to-[#EAD7BE] pb-2 text-[#4A2E1D] shadow-[0_-3px_10px_rgba(90,56,32,0.12),inset_0_1px_0_rgba(255,252,245,0.9)]'
                    : isGuidedTarget
                      ? 'rounded-t-2xl border-2 border-b-0 border-[#C9892B] bg-gradient-to-b from-[#FFF7DE] to-[#F5D99B] text-[#532E08] ring-2 ring-[#F2C464]/80'
                      : 'rounded-t-2xl border-2 border-b-0 border-[#7A523B]/80 bg-gradient-to-b from-[#DFC19C] to-[#CEAA81] text-[#5B3C28] shadow-[inset_0_-2px_5px_rgba(90,56,32,0.14)] hover:from-[#E7CCA9] hover:to-[#D8B68E]'
                  : isGuidedTarget
                    ? 'rounded-2xl border-2 border-b-[3px] border-[#C27D24] bg-gradient-to-b from-[#FFFBEB] to-[#F9DC96] text-[#4C2A07] shadow-[0_4px_14px_rgba(222,150,42,0.48)] ring-2 ring-[#F2BA49]'
                    : isSuggested
                      ? 'rounded-2xl border-2 border-b-[3px] border-[#B47A38] bg-gradient-to-b from-[#FFF9EA] to-[#F7E0B5] text-[#4F2F18] shadow-[0_3px_12px_rgba(216,154,60,0.34)] ring-2 ring-[#F2C464]/65 hover:brightness-103'
                      : 'rounded-2xl border-2 border-b-[3px] border-[#8A5F42] bg-gradient-to-b from-[#FBF1DF] to-[#EBD3B1] text-[#553623] shadow-xs hover:brightness-102'
              }`}
            >
              {isGuidedTarget && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-[#C98828] bg-[#FFF8DB] px-1.5 text-[10px] leading-tight shadow-xs animate-bounce"
                >
                  👇
                </span>
              )}
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
              {isSuggested && !isGuidedTarget && (
                <span
                  className="hidden sm:inline text-[9.5px] leading-none text-[#B47024] animate-bounce"
                  aria-hidden="true"
                >
                  ▲
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Right Controls: Collapse Workbench Button (when open) + Diegetic Day Progress Pill */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
        {isOpen && (
          <motion.button
            type="button"
            data-workbench-toggle="close"
            whileTap={{ scale: 0.94 }}
            onClick={onToggleOpen}
            title="Сховати панель приготування і помилуватися кав’ярнею"
            aria-label="Сховати панель приготування"
            className="flex h-[34px] sm:h-[32px] w-8 sm:w-auto items-center justify-center gap-1 rounded-full border-2 border-[#A67D58] bg-[#FCF4E4] px-1.5 sm:px-2.5 text-[10.5px] sm:text-[11px] font-bold text-[#6B452B] shadow-2xs hover:bg-[#F6E5C8] whitespace-nowrap"
          >
            <span aria-hidden="true" className="text-[10px] leading-none">
              ▼
            </span>
            <span className="hidden md:inline">Сховати</span>
          </motion.button>
        )}

        <motion.button
          type="button"
          data-day-pill="true"
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() =>
            onOpenDayJournal(
              unreadLettersCount > 0
                ? 'letters'
                : isMysteryActive || isBirthdayActive
                  ? 'stories'
                  : 'stories'
            )
          }
          title={`Історії, Пошта та День ${dayProgress.dayNumber}: ${dayTheme.title} (${servedToday}/${dayProgress.guestsTarget} гостей)${unreadLettersCount > 0 ? ` • Нових листів: ${unreadLettersCount}` : ''}. Натисни, щоб відкрити Книгу Історій і пошту!`}
          aria-label={`Книга Історій і День ${dayProgress.dayNumber}, обслужено ${servedToday} з ${dayProgress.guestsTarget} гостей. Відкрити історії, пошту та щоденник.`}
          className={`relative ${
            isOpen ? 'hidden sm:flex' : 'flex'
          } min-h-[36px] sm:min-h-[34px] shrink-0 items-center gap-0.5 sm:gap-2 rounded-full border-2 border-b-[3px] px-1.5 sm:px-3 py-0.5 text-[9px] min-[400px]:text-[9.5px] sm:text-[11px] font-bold shadow-xs transition-all hover:brightness-98 whitespace-nowrap`}
          style={{
            backgroundColor: dayTheme.pillBg,
            borderColor: dayTheme.pillBorder,
            color: dayTheme.pillText,
          }}
        >
          {unreadLettersCount > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E85C84] px-1 text-[9px] font-bold text-white ring-2 ring-[#E5CEAB] animate-pulse"
            >
              💌
            </span>
          ) : isMysteryActive ? (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#D99326] px-1 text-[9px] font-bold text-white ring-2 ring-[#E5CEAB]"
            >
              🔍
            </span>
          ) : null}
          <span aria-hidden="true" className="text-xs sm:text-sm leading-none">
            {isMysteryActive ? '🔍' : isBirthdayActive ? '🎂' : '📖'}
          </span>
          <span className="sm:hidden tabular-nums">
            Д{dayProgress.dayNumber}·{servedToday}/{dayProgress.guestsTarget}
          </span>
          <span className="hidden sm:inline">
            Історії • День {dayProgress.dayNumber}
          </span>
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
      </div>
    </nav>
  );
};
