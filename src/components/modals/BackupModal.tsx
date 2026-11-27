import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../../services/sound';
import {
  exportSaveJson,
  getLastSaveError,
  importSaveJson,
} from '../../services/storage';
import type { CafeSaveState } from '../../types/game';

interface BackupModalProps {
  isOpen: boolean;
  saveState: CafeSaveState;
  storageWarning: string | null;
  onClose: () => void;
  onImportSave: (state: CafeSaveState) => void;
  onResetSave: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = (props) => (
  <AnimatePresence>
    {props.isOpen && <BackupModalInner {...props} />}
  </AnimatePresence>
);

const BackupModalInner: React.FC<BackupModalProps> = ({
  saveState,
  storageWarning,
  onClose,
  onImportSave,
  onResetSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'ok' | 'error';
    text: string;
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const lastWriteError = getLastSaveError();
  const effectiveWarning =
    storageWarning ??
    (lastWriteError === 'quota'
      ? 'У браузері закінчилося місце для автозбереження. Збережи резервний файл (.json) прямо зараз!'
      : null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleDownloadBackup = () => {
    const json = exportSaveJson(saveState);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mur-late-save-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    sound.playSuccess();
    setFeedback({
      type: 'ok',
      text: 'Резервну копію збереження завантажено! Тепер прогрес легко перенести на телефон чи інший браузер.',
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const result = importSaveJson(text);
      if (!result.ok) {
        sound.playGentleOops();
        setFeedback({ type: 'error', text: result.error });
        return;
      }
      sound.playSecretSaved();
      onImportSave(result.state);
      setFeedback({
        type: 'ok',
        text: `Прогрес успішно відновлено! (${result.state.coins} 🐟, гостей: ${result.state.servedCount})`,
      });
    } catch {
      sound.playGentleOops();
      setFeedback({
        type: 'error',
        text: 'Не вдалося прочитати файл. Поточний прогрес збережено без змін.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5A3E32]/50 sm:backdrop-blur-[2px] p-3"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Збереження та перенесення прогресу"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="watercolor-card flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border-4 border-[#C29463] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E6D1B8] bg-[#FAF1E2] px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl" aria-hidden="true">
              💾
            </span>
            <div>
              <h2 className="font-handwriting text-2xl leading-none font-bold text-[#5A3E32]">
                Збереження прогресу
              </h2>
              <p className="text-[10.5px] font-semibold text-[#8A644B]">
                Перенось свою кав’ярню між комп’ютером і телефоном
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити вікно збереження"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#E0ACBC] bg-[#FDF0F4] text-base font-bold text-[#914059] hover:bg-[#F7D7E0]"
          >
            ✕
          </button>
        </div>

        <div className="cozy-scroll flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {effectiveWarning && (
            <div className="rounded-2xl border-2 border-[#E3A65B] bg-[#FFF4DE] px-3 py-2 text-xs font-bold text-[#7A4B14]">
              ⚠️ {effectiveWarning}
            </div>
          )}

          {/* Current Progress Summary */}
          <div className="barista-linen-mat rounded-2xl border-2 border-[#C89F72] p-3 text-xs text-[#5A3E32]">
            <p className="font-bold mb-1">У цьому збереженні зараз:</p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
              <span className="rounded-full bg-[#FDF5DC] border border-[#E3BE73] px-2.5 py-0.5">
                🐟 {saveState.coins} рибок
              </span>
              <span className="rounded-full bg-[#FFF5DF] border border-[#DEB36B] px-2.5 py-0.5">
                ☀️ День {saveState.dayProgress.dayNumber}
              </span>
              <span className="rounded-full bg-[#FDF1F4] border border-[#E9B8C5] px-2.5 py-0.5">
                🐾 Гостей: {saveState.servedCount}
              </span>
              <span className="rounded-full bg-[#EFF9F2] border border-[#96C3A4] px-2.5 py-0.5">
                🛍️ Покупок: {saveState.ownedAccessories.length + saveState.ownedDecor.length + saveState.unlockedRecipes.length}
              </span>
              <span className="rounded-full bg-[#FFF6DC] border border-[#DFA946] px-2.5 py-0.5">
                ⭐ Рідкісних стікерів: {saveState.unlockedRareStickers.length}/5
              </span>
            </div>
          </div>

          {/* Export / Import Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="barista-tile flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold text-[#194A2D]"
              style={{
                backgroundImage:
                  'linear-gradient(155deg, #E8F8ED 0%, #BFE4CB 100%)',
                borderColor: '#418058',
              }}
            >
              <span>⬇️ Зберегти файл (.json)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="barista-tile flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold text-[#5A3E32]"
              style={{
                backgroundImage:
                  'linear-gradient(155deg, #FFF8E6 0%, #F4DCA8 100%)',
                borderColor: '#A97834',
              }}
            >
              <span>⬆️ Завантажити файл (.json)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <p className="text-[10.5px] leading-snug text-[#856248]">
            💡 Примітка: тимчасовий малюнок лате-арту на поточній чашці у файл не записується — експортуються всі монетки, покупки, гардероб Марципана, декор, рецепти, дружба, сувеніри, рідкісні стікери та «Напій дня».
          </p>

          {feedback && (
            <div
              className={`rounded-2xl border-2 px-3 py-2 text-xs font-bold ${
                feedback.type === 'ok'
                  ? 'border-[#73AE87] bg-[#E5F6EB] text-[#1D5633]'
                  : 'border-[#DF94A8] bg-[#FDF0F4] text-[#8E354E]'
              }`}
            >
              {feedback.type === 'ok' ? '✨ ' : '⚠️ '}
              {feedback.text}
            </div>
          )}

          {/* Safe Two-Step Reset */}
          <div className="mt-1 border-t border-[#E6D1B8] pt-3">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setConfirmReset(true);
                }}
                className="min-h-[40px] rounded-xl border border-[#DFB5C0] bg-[#FDF2F5] px-3 py-1.5 text-[11px] font-bold text-[#8E3C55] hover:bg-[#F8DCE4]"
              >
                Почати кав’ярню спочатку…
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#DF94A8] bg-[#FDF0F4] p-2.5">
                <span className="text-[11px] font-bold text-[#8E354E]">
                  Точно скинути весь прогрес? Спершу можна зберегти файл вище!
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="min-h-[38px] rounded-xl border border-[#C9B097] bg-[#FFFDF8] px-3 py-1 text-[11px] font-bold text-[#5A3E32]"
                  >
                    Скасувати
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetSave();
                      setConfirmReset(false);
                      setFeedback({
                        type: 'ok',
                        text: 'Кав’ярню почато з чистого аркуша!',
                      });
                    }}
                    className="min-h-[38px] rounded-xl border-2 border-[#B34A66] bg-[#E3718F] px-3 py-1 text-[11px] font-bold text-white"
                  >
                    Так, скинути
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
