import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  BIRTHDAY_FINALE_BONUS_COINS,
  BIRTHDAY_THEMES,
  BIRTHDAY_THEME_ORDER,
} from '../../data/birthdayStory';
import type {
  BirthdayThemeId,
  PuhBirthdayStoryState,
} from '../../types/game';

export type BirthdayModalMode = 'choose_theme' | 'postcard';

interface BirthdayStoryModalProps {
  isOpen: boolean;
  mode: BirthdayModalMode;
  story: PuhBirthdayStoryState;
  initialPostcardTheme?: BirthdayThemeId | null;
  onSelectThemeAndStart: (theme: BirthdayThemeId) => void;
  onToggleKeepDecor: () => void;
  onSwitchToChooser: () => void;
  onClose: () => void;
}

const INK = '#5A3E32';

/** Handcrafted watercolor commemorative Birthday Postcard illustration for each of the 3 themes */
const BirthdayPostcardIllustrationSvg: React.FC<{ theme: BirthdayThemeId }> = ({
  theme,
}) => {
  const skyBg =
    theme === 'strawberry'
      ? 'url(#pc-sky-berry)'
      : theme === 'space'
        ? 'url(#pc-sky-space)'
        : 'url(#pc-sky-forest)';

  return (
    <svg
      viewBox="0 0 420 190"
      className="w-full h-auto rounded-2xl border-2 border-[#C89D70] shadow-inner"
      role="img"
      aria-label={`Пам’ятна листівка: ${BIRTHDAY_THEMES[theme].postcardTitle}`}
    >
      <defs>
        <linearGradient id="pc-sky-berry" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF2F6" />
          <stop offset="55%" stopColor="#FCE0EA" />
          <stop offset="100%" stopColor="#FFF5E1" />
        </linearGradient>
        <linearGradient id="pc-sky-space" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B356B" />
          <stop offset="60%" stopColor="#5B4D8C" />
          <stop offset="100%" stopColor="#856EA8" />
        </linearGradient>
        <linearGradient id="pc-sky-forest" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EDF8EE" />
          <stop offset="55%" stopColor="#D7EEDB" />
          <stop offset="100%" stopColor="#F9F0D8" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="420" height="190" fill={skyBg} />

      {/* Background atmosphere per theme */}
      {theme === 'space' && (
        <g>
          {[
            [42, 34, 2.6],
            [92, 62, 2],
            [156, 28, 3],
            [268, 32, 2.5],
            [328, 58, 2],
            [376, 36, 3.2],
            [68, 118, 2.2],
            [355, 112, 2.4],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#FFE891" opacity="0.9" />
          ))}
          {/* Ringed Saturn */}
          <g transform="translate(88, 72)">
            <ellipse cx="0" cy="0" rx="26" ry="7" transform="rotate(-16)" fill="none" stroke="#FAD978" strokeWidth="3.2" />
            <circle cx="0" cy="0" r="13" fill="#F29E74" stroke={INK} strokeWidth="2" />
          </g>
          {/* Cute watercolor rocket */}
          <g transform="translate(335, 76) rotate(24)">
            <path d="M0 -18 C8 -10 8 6 0 13 C-8 6 -8 -10 0 -18 Z" fill="#FFF8EC" stroke={INK} strokeWidth="2" />
            <circle cx="0" cy="-3" r="4.5" fill="#92D1EB" stroke={INK} strokeWidth="1.5" />
            <path d="M-5 11 L0 21 L5 11 Z" fill="#F6A24E" />
          </g>
        </g>
      )}

      {theme === 'strawberry' && (
        <g opacity="0.9">
          {/* Floating berry balloons */}
          <g transform="translate(76, 86)">
            <line x1="0" y1="22" x2="8" y2="54" stroke="#B68068" strokeWidth="1.6" />
            <ellipse cx="0" cy="0" rx="18" ry="22" fill="#F58CA9" stroke={INK} strokeWidth="2" />
            <circle cx="-5" cy="-7" r="3" fill="#FFF8F9" opacity="0.65" />
          </g>
          <g transform="translate(344, 82)">
            <line x1="0" y1="22" x2="-8" y2="54" stroke="#B68068" strokeWidth="1.6" />
            <ellipse cx="0" cy="0" rx="18" ry="22" fill="#FFE08C" stroke={INK} strokeWidth="2" />
            <circle cx="-5" cy="-7" r="3" fill="#FFFDF8" opacity="0.7" />
          </g>
        </g>
      )}

      {theme === 'forest' && (
        <g>
          {/* Soft woodland trees & mushrooms */}
          <circle cx="62" cy="118" r="28" fill="#88C293" stroke="#4D855A" strokeWidth="2" />
          <circle cx="94" cy="128" r="22" fill="#A1D4A8" stroke="#4D855A" strokeWidth="2" />
          <circle cx="358" cy="118" r="28" fill="#88C293" stroke="#4D855A" strokeWidth="2" />
          <circle cx="326" cy="128" r="22" fill="#A1D4A8" stroke="#4D855A" strokeWidth="2" />
          {/* Cute forest toadstool */}
          <g transform="translate(86, 146)">
            <rect x="-4" y="0" width="8" height="12" rx="3" fill="#FFF7E8" stroke={INK} strokeWidth="1.8" />
            <path d="M-13 2 C-13 -11 13 -11 13 2 Z" fill="#E3626C" stroke={INK} strokeWidth="2" />
            <circle cx="-4" cy="-3" r="2.2" fill="#FFFDF8" />
            <circle cx="4.5" cy="-2" r="2" fill="#FFFDF8" />
          </g>
        </g>
      )}

      {/* Festive bunting garland across top of postcard */}
      <path d="M12 14 Q210 42 408 14" fill="none" stroke={theme === 'space' ? '#F6D97A' : '#8C6242'} strokeWidth="2.4" />
      {[70, 130, 190, 250, 310, 360].map((x, idx) => (
        <path
          key={x}
          d={`M${x - 14} ${20 + (idx === 2 || idx === 3 ? 6 : 2)} L${x + 14} ${20 + (idx === 2 || idx === 3 ? 6 : 2)} L${x} ${42 + (idx === 2 || idx === 3 ? 6 : 2)} Z`}
          fill={
            theme === 'strawberry'
              ? idx % 2 === 0
                ? '#F38AA8'
                : '#FFF7E8'
              : theme === 'space'
                ? idx % 2 === 0
                  ? '#F8D87A'
                  : '#BFAEE6'
                : idx % 2 === 0
                  ? '#7AB887'
                  : '#FBE5A2'
          }
          stroke={INK}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ))}

      {/* Cozy honey-wood cafe table */}
      <rect x="0" y="148" width="420" height="42" fill="#D9A368" stroke={INK} strokeWidth="2.4" />
      <rect x="0" y="148" width="420" height="10" fill="#F2CE98" />

      {/* Happy Kitten Puff center-stage! */}
      <g transform="translate(210, 114)">
        {/* Fluffy white ears */}
        <path d="M-30 -20 L-35 -48 L-10 -34 Z" fill="#FFFDF9" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M30 -20 L35 -48 L10 -34 Z" fill="#FFFDF9" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M-26 -24 L-29 -41 L-15 -33 Z" fill="#F8C4D3" />
        <path d="M26 -24 L29 -41 L15 -33 Z" fill="#F8C4D3" />
        {/* Round fluffy white head & shoulders */}
        <ellipse cx="0" cy="30" rx="34" ry="20" fill="#FFFDF9" stroke={INK} strokeWidth="2.5" />
        <ellipse cx="0" cy="-6" rx="38" ry="31" fill="#FFFDF9" stroke={INK} strokeWidth="2.6" />
        {/* Pink bell collar */}
        <path d="M-22 20 Q0 29 22 20" fill="none" stroke="#F4A5BC" strokeWidth="6" strokeLinecap="round" />
        <circle cx="0" cy="27" r="5" fill="#F5CA5C" stroke={INK} strokeWidth="1.6" />
        {/* Joyful happy closed-arc eyes & blush */}
        <path d="M-19 -8 Q-13 -15 -7 -8" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M7 -8 Q13 -15 19 -8" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        <ellipse cx="-22" cy="1" rx="6" ry="3.5" fill="#F7B3C5" opacity="0.8" />
        <ellipse cx="22" cy="1" rx="6" ry="3.5" fill="#F7B3C5" opacity="0.8" />
        <path d="M-4 3 Q0 8 4 3" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="0" cy="-1" r="2.2" fill="#E88CA5" />

        {/* THEME-SPECIFIC PARTY HAT ON PUFF! */}
        {theme === 'strawberry' && (
          <g transform="translate(0, -37)">
            <path d="M-16 6 L0 -22 L16 6 Z" fill="#F38AA8" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            <circle cx="0" cy="-23" r="5" fill="#FFF8EC" stroke={INK} strokeWidth="1.6" />
            <circle cx="-4" cy="-5" r="2.5" fill="#FFF8EC" />
            <circle cx="5" cy="0" r="2.5" fill="#FFE08C" />
          </g>
        )}
        {theme === 'space' && (
          <g transform="translate(0, -37)">
            <path d="M-16 6 L0 -22 L16 6 Z" fill="#5D5596" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            <path d="M0 -17 L2.5 -10 L9 -9.5 L4 -5 L5.5 1 L0 -2.5 L-5.5 1 L-4 -5 L-9 -9.5 L-2.5 -10 Z" fill="#FFE17D" />
          </g>
        )}
        {theme === 'forest' && (
          <g transform="translate(0, -34)">
            <ellipse cx="-14" cy="2" rx="9" ry="4.5" transform="rotate(-18 -14 2)" fill="#6FB37E" stroke="#3B7349" strokeWidth="1.6" />
            <ellipse cx="14" cy="2" rx="9" ry="4.5" transform="rotate(18 14 2)" fill="#6FB37E" stroke="#3B7349" strokeWidth="1.6" />
            <circle cx="0" cy="-2" r="6" fill="#FFFDF8" stroke={INK} strokeWidth="1.4" />
            <circle cx="0" cy="-2" r="2.8" fill="#F5CA5C" />
          </g>
        )}
      </g>

      {/* Festive Birthday Cake on the table */}
      <g transform="translate(292, 134)">
        <ellipse cx="0" cy="20" rx="24" ry="5" fill="#FFFDF8" stroke={INK} strokeWidth="2" />
        <rect x="-18" y="0" width="36" height="19" rx="5" fill={theme === 'space' ? '#C7B6EC' : theme === 'forest' ? '#F3D09A' : '#FAD0DE'} stroke={INK} strokeWidth="2" />
        <path d="M-18 4 Q-9 10 0 4 Q9 10 18 4 L18 0 L-18 0 Z" fill="#FFFDF8" stroke={INK} strokeWidth="1.5" />
        <rect x="-2" y="-12" width="4" height="12" rx="1.5" fill="#FFE49E" stroke={INK} strokeWidth="1.4" />
        <path d="M0 -21 C3.5 -17 3.5 -13 0 -12 C-3.5 -13 -3.5 -17 0 -21 Z" fill="#FFA93E" stroke="#C86319" strokeWidth="1.2" />
      </g>
    </svg>
  );
};

export const BirthdayStoryModal: React.FC<BirthdayStoryModalProps> = ({
  isOpen,
  mode,
  story,
  initialPostcardTheme,
  onSelectThemeAndStart,
  onToggleKeepDecor,
  onSwitchToChooser,
  onClose,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<BirthdayThemeId>(
    story.theme ?? 'strawberry'
  );
  const [viewedPostcard, setViewedPostcard] = useState<BirthdayThemeId>(
    initialPostcardTheme ??
      story.theme ??
      story.completedThemes[0] ??
      'strawberry'
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const activePostcardTheme: BirthdayThemeId =
    story.completedThemes.includes(viewedPostcard)
      ? viewedPostcard
      : (story.completedThemes[story.completedThemes.length - 1] ??
        story.theme ??
        'strawberry');

  const postcardMeta = BIRTHDAY_THEMES[activePostcardTheme];
  const uncompletedThemes = BIRTHDAY_THEME_ORDER.filter(
    (t) => !story.completedThemes.includes(t)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3C281C]/52 p-3 sm:p-4 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={
              mode === 'choose_theme'
                ? 'Сюжетна глава: День народження Пуха'
                : 'Пам’ятна листівка: День народження Пуха'
            }
            data-birthday-modal={mode}
            className="watercolor-card relative flex max-h-[90dvh] w-full max-w-[580px] flex-col overflow-hidden rounded-3xl border-[3px] border-[#C2869A] bg-[#FAF4E8] shadow-[0_22px_52px_rgba(48,26,12,0.4)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E7C8D3] bg-gradient-to-r from-[#FFF0F5] via-[#FFF6E5] to-[#EFF8F1] px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#9A4E67]">
                  {mode === 'choose_theme'
                    ? 'Сюжетна глава • 3 ігрові дні'
                    : `Колекція листівок • ${story.completedThemes.length}/3`}
                </p>
                <h2 className="font-handwriting text-2xl sm:text-3xl leading-tight font-bold text-[#5A3E32]">
                  {mode === 'choose_theme'
                    ? '🎂 Сюрприз: День народження Пуха!'
                    : postcardMeta.postcardTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити вікно свята"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#DFAEC0] bg-[#FFFDF8] text-sm font-bold text-[#8A3B54] hover:bg-[#FCE8EF]"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="cozy-scroll flex-1 overflow-y-auto px-4 py-3.5 sm:px-5 sm:py-4 space-y-3.5">
              {mode === 'choose_theme' ? (
                <>
                  <div className="rounded-2xl border-2 border-[#E3C6A6] bg-[#FFFDF8] p-3 text-xs sm:text-[13px] font-semibold leading-relaxed text-[#5A3E32]">
                    🤫 <strong className="font-bold">Тссс, секрет від Луни та Мії!</strong>{' '}
                    Через 2 дні у Кошеняти Пуха день народження! Обери тему свята —
                    вона <strong className="font-bold">реально прикрасить залу кав’ярні</strong>,
                    підбере особливі частування на 3 дні й подарує пам’ятну листівку
                    та <strong className="font-bold">+{BIRTHDAY_FINALE_BONUS_COINS} 🐟</strong>!
                  </div>

                  {/* 3 Interactive Theme Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {BIRTHDAY_THEME_ORDER.map((tid) => {
                      const meta = BIRTHDAY_THEMES[tid];
                      const isSelected = selectedTheme === tid;
                      const alreadyDone = story.completedThemes.includes(tid);

                      return (
                        <button
                          key={tid}
                          type="button"
                          data-birthday-theme-choice={tid}
                          onClick={() => setSelectedTheme(tid)}
                          className={`barista-tile relative flex flex-col items-start gap-1.5 rounded-2xl p-3 text-left transition-all ${
                            isSelected
                              ? 'ring-[3px] ring-[#C96B84] ring-offset-2 ring-offset-[#FAF4E8] scale-[1.01]'
                              : 'opacity-92 hover:opacity-100'
                          }`}
                          style={{
                            backgroundImage: meta.cardBg,
                            borderColor: isSelected ? '#9F425D' : meta.cardBorder,
                          }}
                        >
                          <div className="flex w-full items-center justify-between gap-1">
                            <span className="text-2xl leading-none">{meta.icon}</span>
                            {alreadyDone ? (
                              <span className="rounded-full bg-[#E3F5E8] border border-[#5B9B70] px-1.5 py-0.5 text-[9.5px] font-bold text-[#1D5632]">
                                ✓ Листівка є
                              </span>
                            ) : isSelected ? (
                              <span className="rounded-full bg-[#FFFDF8] px-1.5 py-0.5 text-[9.5px] font-bold text-[#8A3B54]">
                                Обрано ✨
                              </span>
                            ) : null}
                          </div>

                          <h3 className="font-handwriting text-xl leading-none font-bold text-[#4F3323]">
                            {meta.title}
                          </h3>
                          <p className="text-[10.5px] font-semibold leading-snug text-[#684733]">
                            {meta.tagline}
                          </p>
                          <div className="mt-auto pt-1 text-[10px] font-bold text-[#7C5338] border-t border-[#8C6242]/15 w-full">
                            ☕ {meta.treatSummary}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Theme Decor Preview Note */}
                  <div className="rounded-2xl border border-[#DFC19E] bg-[#FDF5E7] px-3 py-2 text-[11px] font-semibold text-[#6F4C34]">
                    🎨 <strong className="font-bold">Декор у кав’ярні:</strong>{' '}
                    {BIRTHDAY_THEMES[selectedTheme].decorDescription}.
                  </div>

                  <button
                    type="button"
                    data-birthday-action="confirm-theme"
                    onClick={() => onSelectThemeAndStart(selectedTheme)}
                    className="w-full min-h-[46px] rounded-2xl border-2 border-[#3E7A56] border-b-4 bg-gradient-to-b from-[#94D3AA] to-[#6CB889] px-4 py-2.5 text-sm sm:text-base font-bold text-[#143D24] shadow-[0_6px_16px_rgba(78,150,104,0.34)] transition-all hover:brightness-105 active:translate-y-[2px] active:border-b-2"
                  >
                    🎉 Почати підготовку: {BIRTHDAY_THEMES[selectedTheme].title}!
                  </button>
                </>
              ) : (
                <>
                  {/* Theme switcher pills when player collected 2+ postcards */}
                  {story.completedThemes.length > 1 && (
                    <div className="flex flex-wrap gap-1.5">
                      {story.completedThemes.map((tid) => {
                        const m = BIRTHDAY_THEMES[tid];
                        const active = tid === activePostcardTheme;
                        return (
                          <button
                            key={tid}
                            type="button"
                            onClick={() => setViewedPostcard(tid)}
                            className={`rounded-full border-2 px-3 py-1 text-xs font-bold transition-all ${
                              active
                                ? 'border-[#A6516C] bg-[#FCE8EF] text-[#7D2B46]'
                                : 'border-[#D8BFA2] bg-[#FFFDF8] text-[#6E4D37]'
                            }`}
                          >
                            {m.icon} {m.shortTitle}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Full Illustrated Watercolor Postcard */}
                  <BirthdayPostcardIllustrationSvg theme={activePostcardTheme} />

                  <div className="rounded-2xl border-2 border-[#DFC19E] bg-[#FFFDF8] p-3.5 text-center space-y-1.5">
                    <p className="font-handwriting text-2xl leading-snug font-bold text-[#5A3E32]">
                      «{postcardMeta.postcardMessage}»
                    </p>
                    <p className="text-[11px] font-bold text-[#8A6142]">
                      🐾 З любов’ю від Кошеняти Пуха, Марципана та всіх друзів «Мур-Лате»
                    </p>
                  </div>

                  {/* Keep Decor Toggle + Replay Another Theme */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={onToggleKeepDecor}
                      className={`min-h-[40px] flex-1 rounded-2xl border-2 px-3 py-1.5 text-xs font-bold transition-all ${
                        story.keepDecorEnabled
                          ? 'border-[#64A378] bg-[#E5F6EB] text-[#1D5632]'
                          : 'border-[#D3B796] bg-[#FAF1E2] text-[#6E4D36]'
                      }`}
                    >
                      {story.keepDecorEnabled
                        ? '🎀 Святковий декор у залі: Увімкнено'
                        : '🎀 Святковий декор у залі: Сховано'}
                    </button>

                    {uncompletedThemes.length > 0 && story.status !== 'active' && (
                      <button
                        type="button"
                        onClick={onSwitchToChooser}
                        className="min-h-[40px] rounded-2xl border-2 border-[#C7859B] bg-[#FCEAF0] px-3.5 py-1.5 text-xs font-bold text-[#822E49] hover:brightness-98"
                      >
                        ✨ Зібрати іншу тему ({story.completedThemes.length}/3)
                      </button>
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
