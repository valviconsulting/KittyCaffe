import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { DAY_EVENING_BONUS_COINS, DAY_THEMES } from '../../data/days';
import { GUESTS } from '../../data/guests';
import { WEATHER_CONFIG } from '../../data/weather';
import type {
  DayMemoryEntry,
  DayProgressState,
  WeatherType,
} from '../../types/game';
import { buildDayMemoryHighlight } from '../../utils/dayDirector';

export type DayJournalMode = 'morning' | 'evening' | 'diary';

interface DayJournalModalProps {
  isOpen: boolean;
  mode: DayJournalMode;
  dayProgress: DayProgressState;
  dayHistory: DayMemoryEntry[];
  weather: WeatherType;
  onStartDay: () => void;
  onAdvanceNextDay: () => void;
  onClose: () => void;
}

export const DayJournalModal: React.FC<DayJournalModalProps> = ({
  isOpen,
  mode,
  dayProgress,
  dayHistory,
  weather,
  onStartDay,
  onAdvanceNextDay,
  onClose,
}) => {
  const [showHistoryInEvening, setShowHistoryInEvening] = useState(false);

  const theme = DAY_THEMES[dayProgress.themeId];
  const weatherMeta = WEATHER_CONFIG[weather];
  const latestEntry = dayHistory.find(
    (entry) => entry.dayNumber === dayProgress.dayNumber
  );
  const eveningHighlight =
    latestEntry?.highlight ?? buildDayMemoryHighlight(dayProgress);

  const canDismissBackdrop = mode === 'diary';

  useEffect(() => {
    if (!isOpen || mode !== 'diary') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, mode, onClose]);

  const headerStyle =
    mode === 'evening'
      ? 'bg-gradient-to-r from-[#3D3148] via-[#4D3B56] to-[#5F4557] text-[#FFF8EC] border-[#8A6D8F]'
      : mode === 'morning'
        ? 'bg-gradient-to-r from-[#FFF1CC] via-[#FCE4B3] to-[#F9D8B0] text-[#5A3E32] border-[#DEB273]'
        : 'bg-gradient-to-r from-[#FAF0DD] via-[#F7E7CA] to-[#FAF0DD] text-[#5A3E32] border-[#DFC49F]';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3C281C]/48 p-3 sm:p-4 backdrop-blur-[2px]"
          onClick={canDismissBackdrop ? onClose : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={
              mode === 'morning'
                ? `Ранок у Мур-Лате — День ${dayProgress.dayNumber}`
                : mode === 'evening'
                  ? `Вечірній щоденник — День ${dayProgress.dayNumber}`
                  : 'Щоденник спогадів кав’ярні'
            }
            data-day-journal-mode={mode}
            className="watercolor-card relative flex max-h-[88dvh] w-full max-w-[540px] flex-col overflow-hidden rounded-3xl border-[3px] border-[#8F6549] bg-[#FAF4E8] shadow-[0_22px_50px_rgba(48,26,12,0.38)]"
          >
            {/* Header */}
            <div
              className={`flex shrink-0 items-center justify-between gap-2 border-b-2 px-4 py-3 sm:px-5 ${headerStyle}`}
            >
              <div className="min-w-0">
                <p
                  className={`text-[10.5px] font-bold uppercase tracking-wider ${
                    mode === 'evening' ? 'text-[#F5D399]' : 'text-[#8B6242]'
                  }`}
                >
                  {mode === 'morning'
                    ? 'Ранок у кав’ярні «Мур-Лате»'
                    : mode === 'evening'
                      ? 'Вечірній щоденник спогадів'
                      : 'Живий щоденник «Мур-Лате»'}
                </p>
                <h2 className="font-handwriting text-2xl sm:text-3xl leading-tight font-bold">
                  {mode === 'morning'
                    ? `${theme.icon} День ${dayProgress.dayNumber}: ${theme.title}`
                    : mode === 'evening'
                      ? `🌙 День ${dayProgress.dayNumber} завершено!`
                      : `📖 Щоденник • День ${dayProgress.dayNumber}`}
                </h2>
              </div>

              {mode === 'diary' && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Закрити щоденник"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#CFA97F] bg-[#FFFDF8] text-sm font-bold text-[#6E4932] hover:bg-[#F5E4C8]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Body */}
            <div className="cozy-scroll flex-1 overflow-y-auto px-4 py-3.5 sm:px-5 sm:py-4 space-y-3.5">
              {/* MODE 1: MORNING CARD */}
              {mode === 'morning' && (
                <>
                  <div className="rounded-2xl border-2 border-[#DFC097] bg-[#FFFDF8] p-3.5 sm:p-4 shadow-2xs space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: theme.pillBg,
                          borderColor: theme.pillBorder,
                          color: theme.pillText,
                        }}
                      >
                        <span>{theme.icon}</span>
                        <span>{theme.title}</span>
                      </span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: weatherMeta.pillBg,
                          borderColor: weatherMeta.pillBorder,
                          color: weatherMeta.pillText,
                        }}
                      >
                        <span>{weatherMeta.icon}</span>
                        <span>{weatherMeta.label}</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold leading-relaxed text-[#5A3E32]">
                      {theme.morningNote}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-[#7C5639]">
                      <span className="rounded-xl border border-[#E6CEAC] bg-[#FDF5E4] px-2.5 py-1">
                        🐾 План дня: {dayProgress.guestsTarget} гостей
                      </span>
                      <span className="rounded-xl border border-[#E5C17A] bg-[#FFF6D8] px-2.5 py-1 text-[#7A4E10]">
                        🎁 Вечірній бонус: +{DAY_EVENING_BONUS_COINS} 🐟
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    data-day-action="start-morning"
                    onClick={onStartDay}
                    className="w-full min-h-[46px] rounded-2xl border-2 border-[#3E7A56] border-b-4 bg-gradient-to-b from-[#94D3AA] to-[#6CB889] px-4 py-2.5 text-sm sm:text-base font-bold text-[#143D24] shadow-[0_6px_16px_rgba(78,150,104,0.34)] transition-all hover:brightness-105 active:translate-y-[2px] active:border-b-2"
                  >
                    ☕ Відкрити кав’ярню!
                  </button>
                </>
              )}

              {/* MODE 2: EVENING SUMMARY */}
              {mode === 'evening' && (
                <>
                  {/* Storybook Highlight Quote */}
                  <div className="rounded-2xl border-2 border-[#D9B88C] bg-gradient-to-br from-[#FFFDF7] to-[#FAF0DC] p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5E36]">
                        ✨ Спогад дня • {theme.icon} {theme.title}
                      </span>
                      <span className="rounded-full border border-[#5E9C74] bg-[#E2F4E8] px-2 py-0.5 text-[10.5px] font-bold text-[#1B5531]">
                        🎁 +{DAY_EVENING_BONUS_COINS} 🐟 бонус
                      </span>
                    </div>
                    <p className="font-handwriting text-xl sm:text-2xl leading-snug font-bold text-[#5A3E32]">
                      «{eveningHighlight}»
                    </p>
                  </div>

                  {/* Guests Visited Today */}
                  <div className="rounded-2xl border-2 border-[#DFC4A1] bg-[#FFFDF8] p-3 space-y-2">
                    <p className="text-[11px] font-bold text-[#7F593D]">
                      🐾 Хто завітав сьогодні ({dayProgress.guestsServedToday.length}/
                      {dayProgress.guestsTarget}):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dayProgress.guestsServedToday.map((guestId, idx) => {
                        const g = GUESTS[guestId];
                        return (
                          <span
                            key={`${guestId}-${idx}`}
                            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold text-[#5A3E32]"
                            style={{
                              backgroundColor: g.accentBg,
                              borderColor: g.accentBorder,
                            }}
                          >
                            <span>{guestId === 'mandrivnyk' ? '🎒' : '🐾'}</span>
                            <span>{g.name}</span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Today's Counters */}
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold">
                      <span className="rounded-xl border border-[#E3BE73] bg-[#FDF5DC] px-2.5 py-1 text-[#7B5218]">
                        🐟 Зароблено: {dayProgress.coinsEarnedToday}
                      </span>
                      {dayProgress.latteArtToday > 0 && (
                        <span className="rounded-xl border border-[#D8A1B4] bg-[#FDF1F5] px-2.5 py-1 text-[#7E314A]">
                          🎨 Лате-артів: {dayProgress.latteArtToday}
                        </span>
                      )}
                      {dayProgress.takeawayToday > 0 && (
                        <span className="rounded-xl border border-[#DFB257] bg-[#FFF5D8] px-2.5 py-1 text-[#7A4E14]">
                          🏃 Із собою: {dayProgress.takeawayToday}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Primary Next-Day Action */}
                  <button
                    type="button"
                    data-day-action="next-day"
                    onClick={() => {
                      setShowHistoryInEvening(false);
                      onAdvanceNextDay();
                    }}
                    className="w-full min-h-[46px] rounded-2xl border-2 border-[#B37524] border-b-4 bg-gradient-to-b from-[#FFE69F] to-[#F3BE5B] px-4 py-2.5 text-sm sm:text-base font-bold text-[#5C3508] shadow-[0_6px_16px_rgba(209,144,44,0.34)] transition-all hover:brightness-105 active:translate-y-[2px] active:border-b-2"
                  >
                    ☀️ Почати День {dayProgress.dayNumber + 1} →
                  </button>

                  {dayHistory.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setShowHistoryInEvening((v) => !v)}
                      className="w-full rounded-xl border border-[#D5B692] bg-[#F7EBD7] px-3 py-1.5 text-xs font-bold text-[#6E492D] hover:bg-[#F2E0C4]"
                    >
                      {showHistoryInEvening
                        ? '▲ Сховати попередні сторінки'
                        : `📖 Переглянути попередні дні (${dayHistory.length - 1})`}
                    </button>
                  )}

                  {showHistoryInEvening && (
                    <div className="space-y-2 pt-1">
                      {dayHistory
                        .filter((e) => e.dayNumber !== dayProgress.dayNumber)
                        .map((entry) => {
                          const entryTheme = DAY_THEMES[entry.themeId];
                          return (
                            <div
                              key={entry.dayNumber}
                              className="rounded-2xl border border-[#DFC4A1] bg-[#FFFDF8] p-2.5 text-xs"
                            >
                              <div className="flex items-center justify-between gap-2 font-bold text-[#5A3E32]">
                                <span>
                                  {entryTheme.icon} День {entry.dayNumber} •{' '}
                                  {entryTheme.title}
                                </span>
                                <span className="text-[#8B5D1C]">
                                  +{entry.coinsEarned} 🐟
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] font-semibold text-[#7A573F]">
                                {entry.highlight}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </>
              )}

              {/* MODE 3: DIARY OPENED MID-DAY */}
              {mode === 'diary' && (
                <>
                  {/* Today's Live Progress Card */}
                  <div className="rounded-2xl border-2 border-[#D7B58A] bg-[#FFFDF8] p-3.5 shadow-2xs space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: theme.pillBg,
                          borderColor: theme.pillBorder,
                          color: theme.pillText,
                        }}
                      >
                        <span>{theme.icon}</span>
                        <span>
                          День {dayProgress.dayNumber}: {theme.title}
                        </span>
                      </span>
                      <span className="text-xs font-bold text-[#7B5218]">
                        🐟 Сьогодні: +{dayProgress.coinsEarnedToday}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#6F4D37]">
                      {theme.morningNote}
                    </p>

                    {/* 5 Guest Progress Slots */}
                    <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                      {Array.from({ length: dayProgress.guestsTarget }).map(
                        (_, idx) => {
                          const servedId = dayProgress.guestsServedToday[idx];
                          const g = servedId ? GUESTS[servedId] : null;
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col items-center justify-center rounded-xl border px-1 py-1.5 text-center ${
                                g
                                  ? 'border-[#84B894] bg-[#EAF7EE]'
                                  : 'border-dashed border-[#D6BA96] bg-[#FAF3E6]'
                              }`}
                            >
                              <span className="text-sm leading-none">
                                {g
                                  ? servedId === 'mandrivnyk'
                                    ? '🎒'
                                    : '🐾'
                                  : '○'}
                              </span>
                              <span className="mt-0.5 w-full truncate text-[9.5px] font-bold text-[#5A3E32]">
                                {g ? g.name.split(' ')[1] ?? g.name : `Гість ${idx + 1}`}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Past Completed Days */}
                  <div className="space-y-2">
                    <h3 className="font-handwriting text-xl font-bold text-[#5A3E32]">
                      ✨ Збережені спогади ({dayHistory.length})
                    </h3>

                    {dayHistory.length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-[#D7BC9A] bg-[#F7ECDA]/70 p-4 text-center text-xs font-semibold text-[#7F5A3E]">
                        Заверши сьогоднішній день ({dayProgress.guestsTarget}{' '}
                        гостей), і тут з’явиться твоя перша сторінка спогадів та
                        вечірній подарунок +{DAY_EVENING_BONUS_COINS} 🐟!
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {dayHistory.map((entry) => {
                          const entryTheme = DAY_THEMES[entry.themeId];
                          const entryWeather = WEATHER_CONFIG[entry.weather];
                          return (
                            <div
                              key={entry.dayNumber}
                              className="rounded-2xl border-2 border-[#DFC4A1] bg-[#FFFDF8] p-3 shadow-2xs"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#5A3E32]">
                                  {entryTheme.icon} День {entry.dayNumber} —{' '}
                                  {entryTheme.title}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10.5px] font-bold">
                                  <span className="rounded-full bg-[#FAF0DC] px-2 py-0.5 text-[#7A5026]">
                                    {entryWeather.icon}
                                  </span>
                                  <span className="rounded-full bg-[#FDF5DC] px-2 py-0.5 text-[#7B5218]">
                                    +{entry.coinsEarned} 🐟
                                  </span>
                                </div>
                              </div>
                              <p className="mt-1.5 text-xs font-semibold leading-snug text-[#6F4D37]">
                                «{entry.highlight}»
                              </p>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {entry.guestsServed.map((gid, i) => (
                                  <span
                                    key={`${gid}-${i}`}
                                    className="rounded-full bg-[#F6EBDC] px-2 py-0.5 text-[10px] font-bold text-[#6F4C34]"
                                  >
                                    {GUESTS[gid].name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
