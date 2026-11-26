import { motion } from 'framer-motion';
import React from 'react';
import type { StationTab } from '../../types/game';

interface StationTabsProps {
  activeTab: StationTab;
  onSelectTab: (tab: StationTab) => void;
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
  onSelectTab,
}) => {
  return (
    <nav
      className="flex shrink-0 items-end gap-1.5 sm:gap-2 px-0.5 sm:px-1"
      aria-label="Станції приготування"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex min-h-[40px] sm:min-h-[38px] flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-t-2xl border-2 border-b-0 px-2.5 sm:px-4 md:px-5 py-1.5 text-[11px] sm:text-xs md:text-[13px] font-bold transition-all whitespace-nowrap ${
              isActive
                ? 'z-10 -mb-[2px] border-[#8C6248] bg-gradient-to-b from-[#FBF2E2] via-[#F2E2C9] to-[#EAD7BE] pb-2 text-[#4A2E1D] shadow-[0_-3px_10px_rgba(90,56,32,0.12),inset_0_1px_0_rgba(255,252,245,0.9)]'
                : 'border-[#7A523B]/80 bg-gradient-to-b from-[#DFC19C] to-[#CEAA81] text-[#5B3C28] shadow-[inset_0_-2px_5px_rgba(90,56,32,0.14)] hover:from-[#E7CCA9] hover:to-[#D8B68E]'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">
              {tab.icon}
            </span>
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {isActive && (
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: tab.dotColor }}
                aria-hidden="true"
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};
