import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { sound } from '../../services/sound';

type BrushType = 'cinnamon' | 'chocolate' | 'pink';
type BrushSize = 'thin' | 'medium';
type StencilType = 'heart' | 'paw' | 'cat' | 'star';

interface LatteArtModalProps {
  isOpen: boolean;
  initialDataUrl?: string;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

const CANVAS_SIZE = 300;

function drawFoamBase(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Subtle caramel espresso crema rim around edge
  const bg = ctx.createRadialGradient(
    CANVAS_SIZE / 2,
    CANVAS_SIZE / 2,
    20,
    CANVAS_SIZE / 2,
    CANVAS_SIZE / 2,
    CANVAS_SIZE / 2
  );
  bg.addColorStop(0, '#FFFDF7');
  bg.addColorStop(0.72, '#FBF0DC');
  bg.addColorStop(0.9, '#E9C699');
  bg.addColorStop(1, '#C58D56');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Delicate foam micro-bubbles for tactile watercolor warmth
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  const bubbles = [
    [76, 90, 5],
    [224, 96, 4],
    [94, 212, 4.5],
    [210, 206, 5],
    [152, 66, 3.5],
    [146, 232, 4],
  ];
  for (const [bx, by, br] of bubbles) {
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
}

function dustCinnamonDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colorA: string,
  colorB: string
) {
  // Soft powdery watercolor center
  ctx.fillStyle = colorA;
  ctx.globalAlpha = 0.34;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Scattered fine spice/powder speckles
  const grains = Math.max(8, Math.round(radius * 2.2));
  for (let i = 0; i < grains; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius * 1.15;
    const gx = x + Math.cos(angle) * dist;
    const gy = y + Math.sin(angle) * dist;
    const gr = 0.8 + Math.random() * 1.4;
    ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
    ctx.globalAlpha = 0.45 + Math.random() * 0.45;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawCinnamonStencil(ctx: CanvasRenderingContext2D, stencil: StencilType) {
  ctx.save();
  ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);

  const stampPathPoints = (pts: Array<[number, number]>, r = 4.6) => {
    for (let i = 0; i < pts.length; i++) {
      const [px, py] = pts[i];
      dustCinnamonDot(ctx, px, py, r, '#B06224', '#CD8142');
    }
  };

  if (stencil === 'heart') {
    const pts: Array<[number, number]> = [];
    for (let t = 0; t <= Math.PI * 2; t += 0.08) {
      const x = 16 * Math.pow(Math.sin(t), 3) * 4.2;
      const y =
        -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        ) * 4.2;
      pts.push([x, y]);
    }
    stampPathPoints(pts, 5.2);
  } else if (stencil === 'paw') {
    // Center pad
    for (let a = 0; a < Math.PI * 2; a += 0.25) {
      for (let rad = 0; rad <= 26; rad += 7) {
        dustCinnamonDot(
          ctx,
          Math.cos(a) * rad * 1.15,
          24 + Math.sin(a) * rad * 0.85,
          4.4,
          '#B06224',
          '#CD8142'
        );
      }
    }
    // 4 cute toes
    const toes: Array<[number, number]> = [
      [-46, -16],
      [-17, -38],
      [17, -38],
      [46, -16],
    ];
    for (const [tx, ty] of toes) {
      for (let a = 0; a < Math.PI * 2; a += 0.45) {
        dustCinnamonDot(
          ctx,
          tx + Math.cos(a) * 10,
          ty + Math.sin(a) * 12,
          4.5,
          '#B06224',
          '#CD8142'
        );
      }
      dustCinnamonDot(ctx, tx, ty, 6.5, '#B06224', '#CD8142');
    }
  } else if (stencil === 'cat') {
    const pts: Array<[number, number]> = [];
    // Head circle
    for (let a = 0; a < Math.PI * 2; a += 0.1) {
      pts.push([Math.cos(a) * 58, Math.sin(a) * 50 + 10]);
    }
    // Left & right cat ears
    for (let t = 0; t <= 1; t += 0.1) {
      pts.push([-48 + t * 4, -22 - t * 44]);
      pts.push([-44 + t * 30, -66 + t * 30]);
      pts.push([48 - t * 4, -22 - t * 44]);
      pts.push([44 - t * 30, -66 + t * 30]);
    }
    // Whiskers
    for (let t = 0; t <= 1; t += 0.2) {
      pts.push([-42 - t * 28, 12 - t * 4]);
      pts.push([-42 - t * 28, 22 + t * 4]);
      pts.push([42 + t * 28, 12 - t * 4]);
      pts.push([42 + t * 28, 22 + t * 4]);
    }
    stampPathPoints(pts, 4.4);
    // Cute eyes, nose & w-mouth
    dustCinnamonDot(ctx, -20, 4, 6.2, '#6E3818', '#995324');
    dustCinnamonDot(ctx, 20, 4, 6.2, '#6E3818', '#995324');
    dustCinnamonDot(ctx, 0, 16, 4.5, '#B06224', '#CD8142');
    stampPathPoints(
      [
        [-12, 24],
        [-6, 28],
        [0, 23],
        [6, 28],
        [12, 24],
      ],
      3.5
    );
  } else if (stencil === 'star') {
    const verts: Array<[number, number]> = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 74 : 32;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      verts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < verts.length; i++) {
      const [x1, y1] = verts[i];
      const [x2, y2] = verts[(i + 1) % verts.length];
      for (let t = 0; t <= 1; t += 0.14) {
        pts.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
      }
    }
    stampPathPoints(pts, 5);
  }

  ctx.restore();
}

export const LatteArtModal: React.FC<LatteArtModalProps> = ({
  isOpen,
  initialDataUrl,
  onClose,
  onSave,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <LatteArtModalInner
          initialDataUrl={initialDataUrl}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </AnimatePresence>
  );
};

const LatteArtModalInner: React.FC<{
  initialDataUrl?: string;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}> = ({ initialDataUrl, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastSoundTimeRef = useRef(0);

  const [brush, setBrush] = useState<BrushType>('cinnamon');
  const [size, setSize] = useState<BrushSize>('medium');
  const [hasArt, setHasArt] = useState<boolean>(Boolean(initialDataUrl));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawFoamBase(ctx);

    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      };
      img.src = initialDataUrl;
    }
  }, [initialDataUrl]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const paintSegment = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      from: { x: number; y: number },
      to: { x: number; y: number }
    ) => {
      const radius = size === 'thin' ? 5.5 : 10.5;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy);

      if (brush === 'chocolate') {
        // Rich glossy dark chocolate syrup stroke
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#522914';
        ctx.lineWidth = size === 'thin' ? 6 : 12;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        // Subtle warm glossy sheen inside syrup line
        ctx.strokeStyle = 'rgba(155, 96, 58, 0.45)';
        ctx.lineWidth = size === 'thin' ? 1.8 : 3.4;
        ctx.beginPath();
        ctx.moveTo(from.x - 1, from.y - 1);
        ctx.lineTo(to.x - 1, to.y - 1);
        ctx.stroke();
        ctx.restore();
        return;
      }

      const colorA = brush === 'cinnamon' ? '#B26426' : '#DC6C8F';
      const colorB = brush === 'cinnamon' ? '#D08748' : '#F39CB8';
      const step = Math.max(2, radius * 0.45);
      const steps = Math.max(1, Math.ceil(dist / step));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        dustCinnamonDot(
          ctx,
          from.x + dx * t,
          from.y + dy * t,
          radius,
          colorA,
          colorB
        );
      }
    },
    [brush, size]
  );

  const playThrottledBrushSound = () => {
    const now = performance.now();
    if (now - lastSoundTimeRef.current > 95) {
      lastSoundTimeRef.current = now;
      sound.playLatteBrush();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    const pos = getCanvasPos(e);
    isDrawingRef.current = true;
    lastPosRef.current = pos;
    paintSegment(ctx, pos, { x: pos.x + 0.1, y: pos.y + 0.1 });
    setHasArt(true);
    playThrottledBrushSound();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPos(e);
    paintSegment(ctx, lastPosRef.current, pos);
    lastPosRef.current = pos;
    playThrottledBrushSound();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const handleApplyStencil = (stencil: StencilType) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCinnamonStencil(ctx, stencil);
    setHasArt(true);
    sound.playLatteBrush();
  };

  const handleClearFoam = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawFoamBase(ctx);
    setHasArt(false);
    sound.playPop();
  };

  const handleDone = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasArt) {
      onClose();
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    sound.playTrayPlace();
    onSave(dataUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5A3E32]/50 backdrop-blur-[2px] p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Малюємо на пінці — Лате-арт"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="watercolor-card flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-4 border-[#B88B61] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#E3CCB0] bg-[#FAF0DF] px-4 sm:px-5 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl sm:text-2xl" aria-hidden="true">
              🎨
            </span>
            <div className="min-w-0">
              <h2 className="font-handwriting text-2xl sm:text-3xl leading-none font-bold text-[#5A3E32]">
                Малюємо на пінці!
              </h2>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#8A654A]">
                Намалюй пальчиком чи мишкою або обери трафарет корицею
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити Лате-арт"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#D9A2B3] bg-[#FDF0F4] text-base font-bold text-[#8E3C55] hover:bg-[#F7D7E0]"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="cozy-scroll flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Left/Center: Top-down round cup with interactive Canvas */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center p-3">
                {/* Cup Handle (right side) */}
                <div
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-11 w-9 rounded-r-full border-[6px] border-[#DFC7AC] bg-[#FFFDF8] shadow-sm"
                  aria-hidden="true"
                />
                {/* Porcelain Rim */}
                <div className="relative z-10 rounded-full border-[8px] border-[#FFFDF8] bg-[#E5CEB2] p-1 shadow-[0_10px_24px_rgba(90,56,32,0.22),inset_0_2px_6px_rgba(90,56,32,0.2)] ring-2 ring-[#C59E76]">
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{ touchAction: 'none' }}
                    className="block h-[220px] w-[220px] sm:h-[250px] sm:w-[250px] rounded-full cursor-crosshair select-none"
                    aria-label="Полотно молочної пінки для малювання"
                  />
                </div>
              </div>
              <span className="text-[10.5px] font-semibold text-[#8A654A]">
                ✨ Малюнок принесе бонусні монетки-рибки!
              </span>
            </div>

            {/* Right: Delicious Brushes, Size & Stencils */}
            <div className="md:col-span-6 flex flex-col gap-3">
              {/* 3 Brushes */}
              <div className="barista-tray-recess rounded-2xl border-2 border-[#B9916B] p-2.5">
                <span className="block text-[11px] font-bold text-[#6A452C] mb-1.5">
                  Смачні пензлі:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      {
                        id: 'cinnamon' as const,
                        label: 'Кориця',
                        swatch: '#BD7132',
                        grad: 'linear-gradient(155deg, #FEF4E2 0%, #EFC895 100%)',
                      },
                      {
                        id: 'chocolate' as const,
                        label: 'Шоколад',
                        swatch: '#522914',
                        grad: 'linear-gradient(155deg, #F6E9DC 0%, #DFBCA0 100%)',
                      },
                      {
                        id: 'pink' as const,
                        label: 'Рожева пудра',
                        swatch: '#DF7093',
                        grad: 'linear-gradient(155deg, #FFF4F7 0%, #F6CCD8 100%)',
                      },
                    ] as const
                  ).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setBrush(b.id);
                        sound.playPop();
                      }}
                      className={`barista-tile flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-1.5 text-[10.5px] font-bold text-[#4F3223] ${
                        brush === b.id ? 'ring-2 ring-[#5A3E32] ring-offset-1' : ''
                      }`}
                      style={{ backgroundImage: b.grad }}
                    >
                      <span
                        className="h-4.5 w-4.5 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: b.swatch }}
                      />
                      <span className="leading-tight text-center">{b.label}</span>
                    </button>
                  ))}
                </div>

                {/* Thickness picker */}
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#6A452C]">
                    Товщина:
                  </span>
                  <div className="flex gap-1.5">
                    {(
                      [
                        { id: 'thin' as const, label: 'Тонкий', dot: 'h-2 w-2' },
                        { id: 'medium' as const, label: 'Середній', dot: 'h-3.5 w-3.5' },
                      ] as const
                    ).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSize(s.id);
                          sound.playPop();
                        }}
                        className={`flex min-h-[34px] items-center gap-1.5 rounded-full border-2 px-3 py-0.5 text-[11px] font-bold transition-colors ${
                          size === s.id
                            ? 'border-[#7A523B] bg-[#F6E1BE] text-[#4C2F1E]'
                            : 'border-[#D5BC9F] bg-[#FFFDF8] text-[#84624B]'
                        }`}
                      >
                        <span className={`rounded-full bg-[#5A3E32] ${s.dot}`} />
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4 Quick Stencils */}
              <div className="barista-tray-recess rounded-2xl border-2 border-[#B9916B] p-2.5">
                <span className="block text-[11px] font-bold text-[#6A452C] mb-1.5">
                  Швидкі трафарети корицею (можна домальовувати!):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: 'heart' as const, label: '❤️ Сердечко' },
                      { id: 'paw' as const, label: '🐾 Лапка' },
                      { id: 'cat' as const, label: '🐱 Котик' },
                      { id: 'star' as const, label: '⭐ Зірочка' },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleApplyStencil(st.id)}
                      className="barista-tile min-h-[40px] rounded-xl px-2 py-1 text-xs font-bold text-[#4F3223]"
                      style={{
                        backgroundImage:
                          'linear-gradient(155deg, #FFFDF7 0%, #F5E5C8 100%)',
                      }}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t-2 border-[#E3CCB0] bg-[#FAF0DF] px-4 sm:px-5 py-2.5">
          <button
            type="button"
            onClick={handleClearFoam}
            className="min-h-[42px] rounded-2xl border-2 border-b-[3px] border-[#A85F73] bg-gradient-to-b from-[#FCEEF2] to-[#F4D3DD] px-4 py-1.5 text-xs font-bold text-[#83344A] active:translate-y-[2px]"
          >
            Очистити пінку
          </button>

          <button
            type="button"
            onClick={handleDone}
            className="min-h-[42px] rounded-2xl border-2 border-b-4 border-[#3E7A56] bg-gradient-to-b from-[#94D3AA] to-[#6CB889] px-6 py-1.5 text-xs sm:text-sm font-bold text-[#143D24] shadow-[0_4px_14px_rgba(78,150,104,0.35)] hover:brightness-105 active:translate-y-[2px] active:border-b-2"
          >
            ✓ Готово!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
