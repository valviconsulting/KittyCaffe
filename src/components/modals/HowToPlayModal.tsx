import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { LogoCatCupSvg } from '../svg/UiIconsSvg';

interface HowToPlayModalProps {
  isOpen: boolean;
  isFirstVisit?: boolean;
  onClose: () => void;
  onStartWithHints?: () => void;
}

const STEPS = [
  {
    num: '1',
    icon: '💬',
    title: 'Подивись замовлення гостя',
    text: 'У хмаринці біля гостя написано, який напій чи десерт він хоче. Можна натиснути прямо на назву замовлення!',
    bg: 'bg-[#FFF8EC] border-[#E4C59B]',
  },
  {
    num: '2',
    icon: '☕',
    title: 'Приготуй і постав на тацю',
    text: 'Відкрий потрібну станцію внизу («Кава», «Коктейлі» або «Випічка»), додай інгредієнти й натисни зелену кнопку «✓ На тацю».',
    bg: 'bg-[#EFF8F2] border-[#A7D2B5]',
  },
  {
    num: '3',
    icon: '🛎️',
    title: 'Подай і збирай рибки!',
    text: 'Натисни рожеву кнопку «🛎️ Подати!». Заробляй монетки-рибки 🐟, дружи з тваринками та прикрашай кав’ярню!',
    bg: 'bg-[#FDF1F5] border-[#E8B6C5]',
  },
];

/**
 * Warm, visual 3-step guide for young players (auto-shown once on a brand-new save,
 * and re-openable anytime from the «❓» help button).
 */
export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  isFirstVisit = false,
  onClose,
  onStartWithHints,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E2414]/45 p-3 sm:p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Як грати в Мур-Лате"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="watercolor-card relative flex max-h-[90dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-3xl border-[3px] border-[#C99F72] shadow-[0_20px_50px_rgba(62,36,20,0.34)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E9D6BC] bg-gradient-to-r from-[#FFF6E5] via-[#FFFBF2] to-[#FDF1F5] px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <LogoCatCupSvg className="h-9 w-9 shrink-0 drop-shadow-xs" />
                <div className="min-w-0">
                  <h2 className="font-handwriting text-2xl sm:text-[26px] leading-none font-bold text-[#5A3E32]">
                    {isFirstVisit
                      ? 'Вітаємо в «Мур-Лате»! 🐾'
                      : 'Як грати в «Мур-Лате» 🐾'}
                  </h2>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#8A654E]">
                    Усе дуже просто — тут неможливо програти!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити підказку"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#D9B996] bg-[#FFFDF8] text-sm font-bold text-[#6E4932] hover:bg-[#F8E9D4]"
              >
                ✕
              </button>
            </div>

            {/* 3 Visual Steps */}
            <div className="cozy-scroll flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className={`flex items-start gap-2.5 rounded-2xl border-2 p-2.5 shadow-2xs ${step.bg}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D4B188] bg-[#FFFDF8] text-lg shadow-2xs">
                    <span aria-hidden="true">{step.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-[13px] font-bold text-[#523526]">
                      {step.num}. {step.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug font-semibold text-[#775642]">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 rounded-2xl border border-dashed border-[#D3AD7B] bg-[#FFFDF6] px-3 py-2 text-[11px] font-semibold text-[#6F4D35]">
                <span className="text-base shrink-0" aria-hidden="true">
                  💡
                </span>
                <span>
                  Якщо забудеш рецепт — натисни <strong>«💡 Підказка»</strong> біля замовлення або відкрий <strong>«📖 Рецепти»</strong> угорі!
                </span>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex shrink-0 items-center justify-center gap-2 border-t-2 border-[#E9D6BC] bg-[#FCF4E6] px-4 py-3">
              <button
                type="button"
                data-howtoplay-start="true"
                onClick={() => {
                  if (onStartWithHints) {
                    onStartWithHints();
                  } else {
                    onClose();
                  }
                }}
                className="min-h-[44px] w-full rounded-2xl border-2 border-[#3E7A56] border-b-4 bg-gradient-to-b from-[#94D3AA] to-[#6CB889] px-5 py-2 text-sm font-bold text-[#143D24] shadow-[0_6px_16px_rgba(78,150,104,0.34)] transition-all hover:brightness-105 active:translate-y-[2px] active:border-b-2"
              >
                {isFirstVisit ? 'Почати готувати! ☕' : 'Зрозуміло, до роботи! ☕'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
