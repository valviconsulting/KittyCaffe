import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../../services/sound';
import type { WallArtState, WallFrameStyle } from '../../types/game';

interface WallArtModalProps {
  isOpen: boolean;
  wallArt: WallArtState;
  onSave: (next: WallArtState) => void;
  onClose: () => void;
}

const CANVAS_W = 360;
const CANVAS_H = 270;
const EXPORT_W = 240;
const EXPORT_H = 180;

const PALETTE: Array<{ id: string; hex: string; label: string }> = [
  { id: 'berry', hex: '#E66B8F', label: 'Полуничний' },
  { id: 'honey', hex: '#F0B64A', label: 'Медовий' },
  { id: 'mint', hex: '#5DAE7B', label: 'Смарагдовий' },
  { id: 'sky', hex: '#63A8D8', label: 'Небесний' },
  { id: 'lavender', hex: '#9A78C9', label: 'Лавандовий' },
  { id: 'peach', hex: '#EE8B62', label: 'Персиковий' },
  { id: 'cocoa', hex: '#6B4229', label: 'Шоколадний' },
  { id: 'cream', hex: '#FFFDF8', label: 'Білий' },
];

const STAMPS: Array<{ id: string; emoji: string; label: string }> = [
  { id: 'paw', emoji: '🐾', label: 'Лапка' },
  { id: 'flower', emoji: '🌸', label: 'Квіточка' },
  { id: 'star', emoji: '⭐', label: 'Зірочка' },
  { id: 'heart', emoji: '❤️', label: 'Сердечко' },
];

const FRAME_OPTIONS: Array<{ id: WallFrameStyle; label: string; icon: string }> = [
  { id: 'honey_wood', label: 'Медова', icon: '🪵' },
  { id: 'blush_ribbon', label: 'Зі стрічкою', icon: '🎀' },
  { id: 'golden_stars', label: 'Золота', icon: '✨' },
];

function fillPaperCanvas(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#FFFDF7';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  // Subtle warm watercolor wash in corners
  const grad = ctx.createRadialGradient(60, 40, 10, 180, 135, 240);
  grad.addColorStop(0, 'rgba(255, 236, 204, 0.25)');
  grad.addColorStop(1, 'rgba(250, 244, 232, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

export const WallArtModal: React.FC<WallArtModalProps> = ({
  isOpen,
  wallArt,
  onSave,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [brushColor, setBrushColor] = useState<string>(PALETTE[0].hex);
  const [brushSize, setBrushSize] = useState<number>(8);
  const [activeStamp, setActiveStamp] = useState<string | null>(null);
  const [frameStyle, setFrameStyle] = useState<WallFrameStyle>(
    wallArt.frameStyle
  );
  const [title, setTitle] = useState<string>(wallArt.title);
  const [hasStroke, setHasStroke] = useState<boolean>(Boolean(wallArt.dataUrl));

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Initialize canvas with paper wash + existing child painting if present
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    fillPaperCanvas(ctx);
    if (wallArt.dataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
      };
      img.src = wallArt.dataUrl;
    }
  }, [isOpen, wallArt.dataUrl]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic pointer events may not support capture
    }

    const pt = getCanvasPoint(e);
    setHasStroke(true);

    if (activeStamp) {
      ctx.save();
      ctx.font = `${Math.max(24, brushSize * 2.4)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeStamp, pt.x, pt.y);
      ctx.restore();
      sound.playStickerPop();
      return;
    }

    drawingRef.current = true;
    lastPointRef.current = pt;

    ctx.save();
    ctx.fillStyle = brushColor;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    sound.playLatteBrush();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || activeStamp) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !lastPointRef.current) return;

    const pt = getCanvasPoint(e);
    ctx.save();
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();
    lastPointRef.current = pt;
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleClearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    fillPaperCanvas(ctx);
    setHasStroke(false);
    sound.playPop();
  };

  const handleSavePainting = () => {
    const srcCanvas = canvasRef.current;
    if (!srcCanvas) return;

    // Export cleanly to a lightweight 240×180 WebP (falls back to PNG) to keep localStorage tiny!
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = EXPORT_W;
    exportCanvas.height = EXPORT_H;
    const exCtx = exportCanvas.getContext('2d');
    if (!exCtx) return;
    exCtx.drawImage(srcCanvas, 0, 0, EXPORT_W, EXPORT_H);

    let dataUrl = exportCanvas.toDataURL('image/webp', 0.82);
    if (!dataUrl.startsWith('data:image/webp;base64,')) {
      dataUrl = exportCanvas.toDataURL('image/png');
    }

    onSave({
      dataUrl,
      title: title.trim().slice(0, 32),
      frameStyle,
      visible: true,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3C281C]/52 p-3 sm:p-4 sm:backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Мольберт: власна картина на стіну кав’ярні"
            data-wall-art-modal="true"
            className="watercolor-card relative flex max-h-[92dvh] w-full max-w-[540px] flex-col overflow-hidden rounded-3xl border-[3px] border-[#B68356] bg-[#FAF4E8] shadow-[0_22px_52px_rgba(48,26,12,0.4)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E3C8A6] bg-gradient-to-r from-[#FDF1DC] via-[#FFF6E8] to-[#FCEEF3] px-4 py-2.5 sm:px-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C5E39]">
                  Творча майстерня «Мур-Лате»
                </p>
                <h2 className="font-handwriting text-2xl sm:text-3xl leading-tight font-bold text-[#5A3E32]">
                  🎨 Моя картина на стіні кав’ярні
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити мольберт"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#D4AE84] bg-[#FFFDF8] text-sm font-bold text-[#6E4932] hover:bg-[#F5E4C8]"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="cozy-scroll flex-1 overflow-y-auto px-4 py-3 sm:px-5 space-y-3">
              {/* Interactive Easel Canvas */}
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-2xl border-4 p-1.5 shadow-md ${
                    frameStyle === 'blush_ribbon'
                      ? 'border-[#C66B88] bg-[#F8C8D7]'
                      : frameStyle === 'golden_stars'
                        ? 'border-[#BA892C] bg-[#FBE08C]'
                        : 'border-[#8C5A34] bg-[#D9A166]'
                  }`}
                >
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_W}
                    height={CANVAS_H}
                    data-wall-art-canvas="true"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className="block w-[290px] sm:w-[360px] aspect-[4/3] rounded-lg bg-[#FFFDF7] touch-none cursor-crosshair shadow-inner"
                  />
                </div>
              </div>

              {/* Colors & Stamps Row */}
              <div className="rounded-2xl border-2 border-[#E2C6A4] bg-[#FFFDF8] p-2.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {PALETTE.map((c) => {
                      const active = !activeStamp && brushColor === c.hex;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          aria-label={`Колір: ${c.label}`}
                          title={c.label}
                          onClick={() => {
                            setActiveStamp(null);
                            setBrushColor(c.hex);
                            sound.playPop();
                          }}
                          className={`h-7 w-7 rounded-full border-2 transition-transform ${
                            active
                              ? 'scale-115 border-[#5A3E32] ring-2 ring-[#E8B15E]'
                              : 'border-[#B69476] hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}
                  </div>

                  {/* Brush Sizes */}
                  <div className="flex items-center gap-1">
                    {[
                      { size: 4, label: 'Тонкий пензлик' },
                      { size: 9, label: 'Середній пензлик' },
                      { size: 16, label: 'Пухнастий пензлик' },
                    ].map((b) => (
                      <button
                        key={b.size}
                        type="button"
                        aria-label={b.label}
                        title={b.label}
                        onClick={() => {
                          setActiveStamp(null);
                          setBrushSize(b.size);
                          sound.playPop();
                        }}
                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                          !activeStamp && brushSize === b.size
                            ? 'border-[#6E4932] bg-[#F6E2C4]'
                            : 'border-[#DEC3A2] bg-[#FAF4E8]'
                        }`}
                      >
                        <span
                          className="rounded-full bg-[#5A3E32]"
                          style={{
                            width: Math.max(5, b.size * 0.75),
                            height: Math.max(5, b.size * 0.75),
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stamps + Clear */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-[#EFE1CE] pt-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10.5px] font-bold text-[#7C573C] mr-0.5">
                      Штампики:
                    </span>
                    {STAMPS.map((st) => {
                      const active = activeStamp === st.emoji;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setActiveStamp(active ? null : st.emoji);
                            sound.playPop();
                          }}
                          className={`rounded-full border px-2 py-0.5 text-xs font-bold transition-all ${
                            active
                              ? 'border-[#B65D78] bg-[#FCE8EF] text-[#7D2B46] scale-105'
                              : 'border-[#DEC3A2] bg-[#FAF3E6] text-[#5A3E32]'
                          }`}
                        >
                          {st.emoji}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="rounded-full border border-[#DFB3BF] bg-[#FDF1F4] px-2.5 py-0.5 text-[11px] font-bold text-[#8E3C52] hover:bg-[#F7D7DF]"
                  >
                    Очистити
                  </button>
                </div>
              </div>

              {/* Frame Selector + Optional Painting Title (stacked cleanly — zero overlap) */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {FRAME_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      data-frame-style={f.id}
                      onClick={() => {
                        setFrameStyle(f.id);
                        sound.playPop();
                      }}
                      className={`rounded-xl border-2 px-2 py-1.5 text-[11px] font-bold transition-all whitespace-nowrap ${
                        frameStyle === f.id
                          ? 'border-[#8C5B36] bg-[#F8E7CB] text-[#4E2F18]'
                          : 'border-[#DFC4A1] bg-[#FFFDF8] text-[#7A573F]'
                      }`}
                    >
                      {f.icon} {f.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  maxLength={32}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Назва картини (напр., Мій котик)"
                  aria-label="Назва картини"
                  className="w-full rounded-xl border-2 border-[#D7B994] bg-[#FFFDF8] px-3 py-1.5 text-xs font-bold text-[#5A3E32] placeholder:text-[#A88A71] focus:border-[#B67E4A] focus:outline-none"
                />
              </div>

              {/* Save / Hide Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  data-wall-art-action="save"
                  disabled={!hasStroke}
                  onClick={handleSavePainting}
                  className={`flex-1 min-h-[44px] rounded-2xl border-2 border-b-4 px-4 py-2 text-sm font-bold transition-all ${
                    hasStroke
                      ? 'border-[#3E7A56] bg-gradient-to-b from-[#94D3AA] to-[#6CB889] text-[#143D24] shadow-[0_5px_14px_rgba(78,150,104,0.34)] hover:brightness-105 active:translate-y-[2px]'
                      : 'border-[#CBB49B] bg-[#ECE0CF] text-[#9E8772] cursor-not-allowed'
                  }`}
                >
                  🖼️ Повісити картину в кав’ярні!
                </button>

                {wallArt.dataUrl && wallArt.visible && (
                  <button
                    type="button"
                    onClick={() =>
                      onSave({ ...wallArt, visible: false })
                    }
                    className="min-h-[44px] rounded-2xl border-2 border-[#D4B696] bg-[#F6E9D6] px-3 py-2 text-xs font-bold text-[#6E4932] hover:bg-[#EFE0C7]"
                  >
                    Зняти зі стіни
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
