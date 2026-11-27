import { motion } from 'framer-motion';
import React, { useId } from 'react';
import type {
  BlenderIngredientId,
  HotIngredientId,
  PreparedDrink,
  TallGlassIngredientId,
} from '../../types/game';
import { TakeawayCupSvg } from './TakeawayCupSvg';

interface HotCupSvgProps {
  ingredients: Partial<Record<HotIngredientId, number>>;
  className?: string;
  showSteam?: boolean;
  showSaucer?: boolean;
  /** Continuous warm milk level (0..2) for smooth real-time tactile pouring. */
  milkPourLevel?: number;
  /** Shows the tilted watercolor ceramic milk pitcher and creamy stream into the cup. */
  isPouringMilk?: boolean;
}

export const HotCupSvg: React.FC<HotCupSvgProps> = ({
  ingredients,
  className = 'w-32 h-32',
  showSteam = true,
  showSaucer = true,
  milkPourLevel,
  isPouringMilk = false,
}) => {
  const uid = useId().replace(/:/g, '');
  const espresso = ingredients.espresso ?? 0;
  const cocoa = ingredients.cocoa ?? 0;
  const hotWater = ingredients.hotWater ?? 0;
  const warmMilk =
    milkPourLevel !== undefined
      ? Math.max(0, Math.min(2, milkPourLevel))
      : (ingredients.warmMilk ?? 0);
  const foam = ingredients.foam ?? 0;
  const cinnamon = ingredients.cinnamon ?? 0;
  const marshmallow = ingredients.marshmallow ?? 0;
  const matcha = ingredients.matcha ?? 0;

  const layers: Array<{
    fill: string;
    meniscus: string;
    height: number;
    key: string;
    stripe?: string;
  }> = [];
  if (espresso > 0) {
    layers.push({
      fill: `url(#hc-esp-${uid})`,
      meniscus: '#7E4A2D',
      height: 22,
      key: 'espresso',
    });
  }
  if (cocoa > 0) {
    layers.push({
      fill: `url(#hc-coc-${uid})`,
      meniscus: '#9E623C',
      height: 28,
      key: 'cocoa',
    });
  }
  if (matcha > 0) {
    layers.push({
      fill: `url(#hc-mat-${uid})`,
      meniscus: '#9ED188',
      height: 30,
      key: 'matcha',
      stripe: '#5F954E',
    });
  }
  if (hotWater > 0) {
    layers.push({
      fill: `url(#hc-wat-${uid})`,
      meniscus: '#C6956B',
      height: 30,
      key: 'hotWater',
    });
  }
  if (warmMilk > 0.02) {
    const milk1 = Math.min(1, warmMilk);
    layers.push({
      fill: `url(#hc-mlk1-${uid})`,
      meniscus: '#FFF9EE',
      height: 24 * milk1,
      key: 'warmMilk1',
    });
  }
  if (warmMilk > 1.02) {
    const milk2 = Math.min(1, warmMilk - 1);
    layers.push({
      fill: `url(#hc-mlk2-${uid})`,
      meniscus: '#FFFDF8',
      height: 24 * milk2,
      key: 'warmMilk2',
      stripe: '#E8CDA7',
    });
  }

  const rawTotal = layers.reduce((acc, l) => acc + l.height, 0);
  const scale = rawTotal > 68 ? 68 / rawTotal : 1;
  const cupBottom = 122;
  let currentY = cupBottom;

  const positionedLayers = layers.map((l) => {
    const h = l.height * scale;
    currentY -= h;
    return { ...l, y: currentY, h };
  });

  const topLiquidY = layers.length > 0 ? currentY : cupBottom - 8;
  const topMeniscusColor =
    positionedLayers.length > 0
      ? positionedLayers[positionedLayers.length - 1].meniscus
      : '#FFF9EE';
  const hasAnyLiquid = layers.length > 0 || foam > 0;
  const foamY = Math.max(44, topLiquidY - 12);
  const streamEndY = Math.min(118, Math.max(46, topLiquidY + 2));

  return (
    <svg viewBox="0 0 150 150" className={className} aria-label="Прозора скляна чашка">
      <defs>
        <clipPath id={`hot-clip-${uid}`}>
          <path d="M30 42 L106 42 L100 112 Q99 124 85 124 L51 124 Q37 124 36 112 Z" />
        </clipPath>
        {/* Warm rich cylindrical beverage gradients (sunlit left → deeper caramel right) */}
        <linearGradient id={`hc-esp-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7C4A2D" />
          <stop offset="35%" stopColor="#5C331E" />
          <stop offset="85%" stopColor="#462413" />
          <stop offset="100%" stopColor="#633821" />
        </linearGradient>
        <linearGradient id={`hc-coc-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9D603B" />
          <stop offset="40%" stopColor="#7E482A" />
          <stop offset="88%" stopColor="#63351C" />
          <stop offset="100%" stopColor="#7F4A2C" />
        </linearGradient>
        <linearGradient id={`hc-mat-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9FD289" />
          <stop offset="45%" stopColor="#7EB66A" />
          <stop offset="88%" stopColor="#619450" />
          <stop offset="100%" stopColor="#7BB267" />
        </linearGradient>
        <linearGradient id={`hc-wat-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C8956B" />
          <stop offset="45%" stopColor="#AA754F" />
          <stop offset="90%" stopColor="#8B5A38" />
          <stop offset="100%" stopColor="#A9744E" />
        </linearGradient>
        <linearGradient id={`hc-mlk1-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFBF2" />
          <stop offset="55%" stopColor="#FCECD2" />
          <stop offset="92%" stopColor="#EBD2AE" />
          <stop offset="100%" stopColor="#F8E7CB" />
        </linearGradient>
        <linearGradient id={`hc-mlk2-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="60%" stopColor="#FFF5E4" />
          <stop offset="94%" stopColor="#F2DFC2" />
          <stop offset="100%" stopColor="#FFF7EA" />
        </linearGradient>
        <linearGradient id={`hc-glass-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFDF9" stopOpacity="0.56" />
          <stop offset="18%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="78%" stopColor="#F5E5D0" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#D7B796" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={`hc-foam-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="68%" stopColor="#FFF8EE" />
          <stop offset="100%" stopColor="#EAD6C0" />
        </linearGradient>
        <linearGradient id={`hc-saucer-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FADCE4" />
          <stop offset="65%" stopColor="#EEBCC9" />
          <stop offset="100%" stopColor="#D699AA" />
        </linearGradient>
      </defs>

      {/* Animated soft rising steam wisps */}
      {showSteam && hasAnyLiquid && !isPouringMilk && (
        <g fill="none" stroke="#DFC0A4" strokeWidth="2.6" strokeLinecap="round" opacity="0.85">
          <path className="animate-steam-1" d="M52 34 Q46 24 53 15 Q59 8 53 2" />
          <path className="animate-steam-2" d="M68 32 Q74 22 67 13 Q61 6 68 0" />
          <path className="animate-steam-3" d="M84 34 Q79 24 85 15 Q91 8 85 2" />
        </g>
      )}

      {/* Hand-glazed blush ceramic saucer with soft contact shadow */}
      {showSaucer && (
        <g>
          <ellipse cx="68" cy="135" rx="45" ry="7.5" fill="#5A361B" opacity="0.2" />
          <ellipse
            cx="68"
            cy="130"
            rx="48"
            ry="9.5"
            fill={`url(#hc-saucer-${uid})`}
            stroke="#8F6358"
            strokeWidth="1.8"
          />
          <ellipse cx="68" cy="128.5" rx="33" ry="4.8" fill="#FDF0F4" opacity="0.85" />
          <ellipse cx="68" cy="128" rx="23" ry="3.2" fill="#E3B3C0" opacity="0.45" />
        </g>
      )}

      {/* Sculpted Glass Handle */}
      <path
        d="M104 54 C126 54 128 96 101 98"
        fill="none"
        stroke="#B8967C"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M104 54 C126 54 128 96 101 98"
        fill="none"
        stroke="#FFFDF9"
        strokeWidth="4.4"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M107 57 C121 58 122 86 105 93"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Transparent glass cup back + warm glass base thickness */}
      <path
        d="M28 40 L108 40 L102 113 Q101 126 86 126 L50 126 Q35 126 34 113 Z"
        fill="#FFFDF9"
        fillOpacity="0.62"
        stroke="#A9856B"
        strokeWidth="2.2"
      />
      <ellipse cx="68" cy="122" rx="28" ry="4" fill="#DFC7B0" opacity="0.42" />

      {/* Clipped smoothly animated beverage layers */}
      <g clipPath={`url(#hot-clip-${uid})`}>
        {positionedLayers.map((layer) => {
          const isContinuousMilk =
            isPouringMilk &&
            (layer.key === 'warmMilk1' || layer.key === 'warmMilk2');
          return (
            <g key={layer.key}>
              {isContinuousMilk ? (
                <rect
                  x="25"
                  y={layer.y}
                  width="86"
                  height={layer.h + 2}
                  fill={layer.fill}
                />
              ) : (
                <motion.rect
                  x="25"
                  width="86"
                  fill={layer.fill}
                  initial={{ y: cupBottom, height: 0 }}
                  animate={{ y: layer.y, height: layer.h + 2 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                />
              )}
              {layer.stripe && (
                <line
                  x1="28"
                  y1={layer.y + layer.h}
                  x2="108"
                  y2={layer.y + layer.h}
                  stroke={layer.stripe}
                  strokeWidth="1.4"
                  strokeDasharray="4 3"
                  opacity="0.7"
                />
              )}
            </g>
          );
        })}

        {/* Curved sunlit meniscus ellipse on top of beverage */}
        {layers.length > 0 && foam === 0 && (
          <ellipse
            cx="68"
            cy={topLiquidY + 1}
            rx="36"
            ry="3.6"
            fill={topMeniscusColor}
            opacity="0.85"
          />
        )}

        {/* Silky cream splash & ripple where the pouring stream meets the liquid */}
        {isPouringMilk && (
          <g>
            <ellipse
              cx="74"
              cy={streamEndY}
              rx="14"
              ry="3.6"
              fill="#FFFDF8"
              fillOpacity="0.88"
            />
            <circle
              cx="63"
              cy={Math.max(46, streamEndY - 5)}
              r="2.4"
              fill="#FFF9EC"
              opacity="0.85"
            />
            <circle
              cx="84"
              cy={Math.max(46, streamEndY - 4)}
              r="2"
              fill="#FFF9EC"
              opacity="0.8"
            />
          </g>
        )}

        {/* Fluffy shaded Milk Foam layer */}
        {foam > 0 && (
          <motion.g
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <rect x="26" y={foamY + 4} width="84" height="16" fill={`url(#hc-foam-${uid})`} />
            <circle cx="42" cy={foamY + 6} r="11" fill={`url(#hc-foam-${uid})`} />
            <circle cx="58" cy={foamY + 3} r="13" fill={`url(#hc-foam-${uid})`} />
            <circle cx="76" cy={foamY + 4} r="13" fill={`url(#hc-foam-${uid})`} />
            <circle cx="92" cy={foamY + 7} r="10" fill={`url(#hc-foam-${uid})`} />
          </motion.g>
        )}

        {/* Subtle cylindrical glass sheen overlay inside walls */}
        <rect x="28" y="40" width="80" height="86" fill={`url(#hc-glass-${uid})`} />
      </g>

      {/* Overflowing velvety foam crown */}
      {foam > 0 && (
        <motion.g
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ transformOrigin: '68px 42px' }}
        >
          <ellipse
            cx="68"
            cy={Math.max(42, foamY + 3)}
            rx="34"
            ry="7.5"
            fill={`url(#hc-foam-${uid})`}
            stroke="#DFC7B5"
            strokeWidth="1.2"
          />
          <circle cx="52" cy={Math.max(38, foamY)} r="8.2" fill={`url(#hc-foam-${uid})`} />
          <circle cx="68" cy={Math.max(36, foamY - 2)} r="10.2" fill={`url(#hc-foam-${uid})`} />
          <circle cx="84" cy={Math.max(38, foamY)} r="8.2" fill={`url(#hc-foam-${uid})`} />
          {/* Soft glossy top-left light highlight on foam puff */}
          <path
            d={`M56 ${Math.max(33, foamY - 4)} Q65 ${Math.max(29, foamY - 8)} 74 ${Math.max(33, foamY - 4)}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.9"
          />
        </motion.g>
      )}

      {/* Plump pillowy marshmallows bobbing on top */}
      {marshmallow > 0 && (
        <motion.g
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: Math.min(0, topLiquidY - 52), opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 15 }}
        >
          <g transform={`rotate(-12 47 ${Math.max(43, topLiquidY - 2)})`}>
            <rect
              x="40"
              y={Math.max(38, topLiquidY - 8)}
              width="14"
              height="11"
              rx="4.2"
              fill="#FFFDF9"
              stroke="#D8B9AC"
              strokeWidth="1.3"
            />
            <ellipse
              cx="45"
              cy={Math.max(41, topLiquidY - 5)}
              rx="3.5"
              ry="1.6"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
          <g transform={`rotate(8 65 ${Math.max(41, topLiquidY - 4)})`}>
            <rect
              x="58"
              y={Math.max(36, topLiquidY - 10)}
              width="15"
              height="11.5"
              rx="4.2"
              fill="#F8D2DC"
              stroke="#D292A4"
              strokeWidth="1.3"
            />
            <ellipse
              cx="64"
              cy={Math.max(39, topLiquidY - 7)}
              rx="3.8"
              ry="1.6"
              fill="#FFF5F8"
              opacity="0.85"
            />
          </g>
          <g transform={`rotate(-6 83 ${Math.max(43, topLiquidY - 2)})`}>
            <rect
              x="76"
              y={Math.max(38, topLiquidY - 8)}
              width="14"
              height="11"
              rx="4.2"
              fill="#FFF9EE"
              stroke="#D8B9AC"
              strokeWidth="1.3"
            />
            <ellipse
              cx="81"
              cy={Math.max(41, topLiquidY - 5)}
              rx="3.5"
              ry="1.5"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
        </motion.g>
      )}

      {/* Rich dusted cinnamon flecks */}
      {cinnamon > 0 && (
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}>
          {[
            [50, foam > 0 ? Math.max(37, foamY - 1) : Math.max(46, topLiquidY + 2), 2.1, '#9E5420'],
            [58, foam > 0 ? Math.max(35, foamY - 3) : Math.max(48, topLiquidY + 4), 1.8, '#B8692E'],
            [67, foam > 0 ? Math.max(37, foamY - 1) : Math.max(45, topLiquidY + 1), 2.3, '#8F4A1A'],
            [74, foam > 0 ? Math.max(34, foamY - 4) : Math.max(47, topLiquidY + 3), 1.9, '#B5662B'],
            [82, foam > 0 ? Math.max(37, foamY - 1) : Math.max(46, topLiquidY + 2), 2.0, '#9E5420'],
            [62, foam > 0 ? Math.max(39, foamY + 1) : Math.max(49, topLiquidY + 5), 1.6, '#C4773A'],
            [72, foam > 0 ? Math.max(39, foamY + 1) : Math.max(49, topLiquidY + 5), 1.7, '#944D1C'],
            [54, foam > 0 ? Math.max(38, foamY) : Math.max(47, topLiquidY + 3), 1.3, '#C77A3D'],
            [78, foam > 0 ? Math.max(36, foamY - 2) : Math.max(46, topLiquidY + 2), 1.4, '#8A4517'],
          ].map(([cx, cy, r, fill], idx) => (
            <circle key={idx} cx={Number(cx)} cy={Number(cy)} r={Number(r)} fill={String(fill)} />
          ))}
        </motion.g>
      )}

      {/* Glass Rim & Dual Specular Glass Reflections */}
      <ellipse cx="68" cy="41" rx="40" ry="5.5" fill="none" stroke="#B08A6E" strokeWidth="2.1" />
      <path d="M36 49 L40 113" stroke="#FFFFFF" strokeWidth="4.2" strokeLinecap="round" opacity="0.68" />
      <path d="M44 53 L47 104" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
      <path d="M97 54 L93 111" stroke="#FFF6E5" strokeWidth="2.2" strokeLinecap="round" opacity="0.42" />

      {/* Subtle cozy ×1 / ×2 milk gauge marks on glass wall while pouring */}
      {isPouringMilk && (
        <g>
          <line
            x1="92"
            y1="86"
            x2="100"
            y2="86"
            stroke={warmMilk >= 0.98 ? '#4B8B63' : '#B68A60'}
            strokeWidth={warmMilk >= 0.98 ? '2.6' : '1.8'}
            strokeLinecap="round"
          />
          <line
            x1="93"
            y1="62"
            x2="101"
            y2="62"
            stroke={warmMilk >= 1.98 ? '#4B8B63' : '#B68A60'}
            strokeWidth={warmMilk >= 1.98 ? '2.6' : '1.8'}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Subtle etched cat smile on glass */}
      <g opacity="0.22" transform="translate(68, 92)">
        <circle cx="-7" cy="-2" r="1.7" fill="#5A3E32" />
        <circle cx="7" cy="-2" r="1.7" fill="#5A3E32" />
        <path d="M-4 3 Q0 6 4 3" fill="none" stroke="#5A3E32" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Tilted stoneware ceramic milk pitcher & silky pouring stream */}
      {isPouringMilk && (
        <motion.g
          initial={{ opacity: 0, x: 10, y: -6, rotate: 14 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          style={{ transformOrigin: '112px 24px' }}
        >
          {/* Creamy flowing stream from spout directly into liquid */}
          <path
            d={`M93 24 Q79 ${Math.round((24 + streamEndY) * 0.45)} 74 ${streamEndY}`}
            fill="none"
            stroke="#EAD1AF"
            strokeWidth="7.4"
            strokeLinecap="round"
          />
          <path
            d={`M93 24 Q79 ${Math.round((24 + streamEndY) * 0.45)} 74 ${streamEndY}`}
            fill="none"
            stroke="#FFFBF2"
            strokeWidth="4.6"
            strokeLinecap="round"
          />

          {/* Ceramic pitcher tilted warmly above top-right rim */}
          <g transform="translate(115, 22) rotate(-36)">
            <path
              d="M12 -5 C23 -5 23 11 11 11"
              fill="none"
              stroke="#6B4837"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            <path
              d="M12 -5 C23 -5 23 11 11 11"
              fill="none"
              stroke="#FFF7E8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M-21 -11 L-11 -9 L10 -9 Q14 -9 13 -4 L11 13 Q10 17 5 17 L-8 17 Q-13 17 -14 12 L-15 -3 Z"
              fill="#FFF7E8"
              stroke="#6B4837"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            <path d="M-13 2 L12 2 L11 7 L-13 7 Z" fill="#F2B8C6" opacity="0.88" />
            <path
              d="M-19 -9.5 Q-14 -7 -10 -8"
              fill="none"
              stroke="#FFFDF9"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        </motion.g>
      )}
    </svg>
  );
};

interface TallGlassSvgProps {
  mode: 'cocktail' | 'milkshake';
  cocktailIngredients?: Partial<Record<TallGlassIngredientId, number>>;
  milkshakeIngredients?: Partial<Record<BlenderIngredientId, number>>;
  whippedCream?: boolean;
  className?: string;
}

export const TallGlassSvg: React.FC<TallGlassSvgProps> = ({
  mode,
  cocktailIngredients = {},
  milkshakeIngredients = {},
  whippedCream = false,
  className = 'w-28 h-36',
}) => {
  const uid = useId().replace(/:/g, '');

  const hasIce = (cocktailIngredients.ice ?? 0) > 0;
  const hasSoda = (cocktailIngredients.soda ?? 0) > 0;
  const hasOrange = (cocktailIngredients.orangeJuice ?? 0) > 0;
  const hasSyrup = (cocktailIngredients.strawberrySyrup ?? 0) > 0;
  const hasMint = (cocktailIngredients.mint ?? 0) > 0;
  const hasLemon = (cocktailIngredients.lemon ?? 0) > 0;

  const isSunrise = hasOrange && hasSyrup;
  const hasAnyCocktail =
    hasIce || hasSoda || hasOrange || hasSyrup || hasMint || hasLemon;
  const showCondensation = hasAnyCocktail || mode === 'milkshake';

  const hasShakeSyrup = (milkshakeIngredients.strawberrySyrup ?? 0) > 0;
  const hasShakeCream =
    (milkshakeIngredients.iceCream ?? 0) > 0 ||
    (milkshakeIngredients.coldMilk ?? 0) > 0;
  const shakeGradId =
    hasShakeSyrup && hasShakeCream
      ? `shake-berry-${uid}`
      : hasShakeSyrup
        ? `shake-syrup-${uid}`
        : `shake-vanilla-${uid}`;

  return (
    <svg viewBox="0 0 130 170" className={className} aria-label="Високий скляний келих">
      <defs>
        <clipPath id={`tall-clip-${uid}`}>
          <path d="M32 42 L98 42 L90 144 Q89 152 79 152 L51 152 Q41 152 40 144 Z" />
        </clipPath>
        <linearGradient id={`sunrise-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FECA57" />
          <stop offset="44%" stopColor="#F58D4C" />
          <stop offset="78%" stopColor="#EB5D74" />
          <stop offset="100%" stopColor="#C93354" />
        </linearGradient>
        <linearGradient id={`mojito-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2FCF7" />
          <stop offset="50%" stopColor="#D4F2E3" />
          <stop offset="100%" stopColor="#A9DFC4" />
        </linearGradient>
        <linearGradient id={`orange-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFC763" />
          <stop offset="50%" stopColor="#F5A139" />
          <stop offset="100%" stopColor="#DC8124" />
        </linearGradient>
        <linearGradient id={`syrup-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F57A98" />
          <stop offset="50%" stopColor="#DF5274" />
          <stop offset="100%" stopColor="#BD3659" />
        </linearGradient>
        <linearGradient id={`shake-berry-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FCD0DE" />
          <stop offset="45%" stopColor="#F5A1BC" />
          <stop offset="90%" stopColor="#DF7E9D" />
          <stop offset="100%" stopColor="#F29DB8" />
        </linearGradient>
        <linearGradient id={`shake-syrup-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F48AA9" />
          <stop offset="60%" stopColor="#DC5B80" />
          <stop offset="100%" stopColor="#C24168" />
        </linearGradient>
        <linearGradient id={`shake-vanilla-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFBF0" />
          <stop offset="55%" stopColor="#FAEAD0" />
          <stop offset="100%" stopColor="#E6CFA9" />
        </linearGradient>
        <linearGradient id={`tg-glass-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.46" />
          <stop offset="22%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="80%" stopColor="#D7ECEF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8DB4BC" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id={`tg-cream-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="68%" stopColor="#FFF8F0" />
          <stop offset="100%" stopColor="#EAD6C6" />
        </linearGradient>
      </defs>

      {/* Candy-Striped Straw */}
      {showCondensation && (
        <g transform="rotate(11 76 48)">
          <rect x="74" y="10" width="9" height="124" rx="4" fill="#FFFDF9" stroke="#C16780" strokeWidth="1.4" />
          <g fill="#EE839E">
            <rect x="74.5" y="18" width="8" height="7" />
            <rect x="74.5" y="32" width="8" height="7" />
            <rect x="74.5" y="46" width="8" height="7" />
            <rect x="74.5" y="60" width="8" height="7" />
            <rect x="74.5" y="74" width="8" height="7" />
          </g>
        </g>
      )}

      {/* Fresh Lemon Wheel on Rim */}
      {mode === 'cocktail' && hasLemon && (
        <g transform="translate(96, 44) rotate(18)">
          <circle cx="0" cy="0" r="15" fill="#F9DB58" stroke="#AD8A22" strokeWidth="1.9" />
          <circle cx="0" cy="0" r="12" fill="#FFFBE0" />
          <circle cx="0" cy="0" r="10.2" fill="#FBE87E" />
          <g stroke="#FFFCE8" strokeWidth="1.5">
            <line x1="-10" y1="0" x2="10" y2="0" />
            <line x1="0" y1="-10" x2="0" y2="10" />
            <line x1="-7" y1="-7" x2="7" y2="7" />
            <line x1="-7" y1="7" x2="7" y2="-7" />
          </g>
          <circle cx="0" cy="0" r="2" fill="#FFFDF2" />
        </g>
      )}

      {/* Soft contact shadow under heavy glass base */}
      <ellipse cx="65" cy="158" rx="28" ry="4.8" fill="#5A361B" opacity="0.2" />

      {/* Translucent Tall Glass Back */}
      <path
        d="M30 40 L100 40 L92 145 Q91 155 80 155 L50 155 Q39 155 38 145 Z"
        fill="#FFFDF9"
        fillOpacity="0.62"
        stroke="#8FB3BA"
        strokeWidth="2.3"
      />

      {/* Clipped Contents */}
      <g clipPath={`url(#tall-clip-${uid})`}>
        {mode === 'milkshake' ? (
          <motion.g
            initial={{ y: 90, opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
          >
            <rect x="28" y="52" width="74" height="104" fill={`url(#${shakeGradId})`} />
            <path
              d="M34 92 Q65 82 94 95 L94 108 Q65 96 34 106 Z"
              fill="#FFFFFF"
              opacity="0.24"
            />
            <path
              d="M36 120 Q65 112 92 124 L92 132 Q65 121 36 130 Z"
              fill="#FFFFFF"
              opacity="0.16"
            />
          </motion.g>
        ) : (
          <g>
            {isSunrise ? (
              <motion.rect
                x="28"
                width="74"
                fill={`url(#sunrise-${uid})`}
                initial={{ y: 154, height: 0 }}
                animate={{ y: 56, height: 98 }}
                transition={{ type: 'spring', stiffness: 150, damping: 18 }}
              />
            ) : (
              <>
                {hasSoda && (
                  <motion.rect
                    x="28"
                    width="74"
                    fill={`url(#mojito-${uid})`}
                    initial={{ y: 154, height: 0 }}
                    animate={{ y: 56, height: 98 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                  />
                )}
                {hasOrange && (
                  <motion.rect
                    x="28"
                    width="74"
                    fill={`url(#orange-${uid})`}
                    opacity={hasSoda ? 0.88 : 1}
                    initial={{ y: 154, height: 0 }}
                    animate={{
                      y: hasSoda ? 86 : 64,
                      height: hasSoda ? 68 : 90,
                    }}
                    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                  />
                )}
                {hasSyrup && (
                  <motion.rect
                    x="28"
                    width="74"
                    fill={`url(#syrup-${uid})`}
                    initial={{ y: 154, height: 0 }}
                    animate={{ y: hasSoda ? 116 : 106, height: 48 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                  />
                )}
              </>
            )}

            {/* Faceted translucent ice cubes with crisp specular bevels */}
            {hasIce && (
              <g>
                {[
                  { x: 40, y: 68, s: 18, rot: -14 },
                  { x: 66, y: 76, s: 18, rot: 12 },
                  { x: 49, y: 100, s: 17, rot: 8 },
                ].map((c, idx) => (
                  <g key={idx} transform={`rotate(${c.rot} ${c.x + c.s / 2} ${c.y + c.s / 2})`}>
                    <rect
                      x={c.x}
                      y={c.y}
                      width={c.s}
                      height={c.s}
                      rx="4.2"
                      fill="#FFFFFF"
                      fillOpacity="0.62"
                      stroke="#9FD4E6"
                      strokeWidth="1.4"
                    />
                    <path
                      d={`M${c.x + 3.5} ${c.y + 4} L${c.x + c.s - 4} ${c.y + 4} M${c.x + 3.5} ${c.y + 4} L${c.x + 3.5} ${c.y + c.s - 5}`}
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                  </g>
                ))}
              </g>
            )}

            {/* Fresh veined mint leaves */}
            {hasMint && (
              <g>
                {[
                  { cx: 52, cy: 92, rx: 11, ry: 5.8, rot: -28, fill: '#57B27D' },
                  { cx: 76, cy: 108, rx: 11, ry: 5.8, rot: 24, fill: '#6CC490' },
                  { cx: 60, cy: 126, rx: 10, ry: 5.2, rot: -14, fill: '#53AA77' },
                ].map((leaf, idx) => (
                  <g key={idx} transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}>
                    <ellipse
                      cx={leaf.cx}
                      cy={leaf.cy}
                      rx={leaf.rx}
                      ry={leaf.ry}
                      fill={leaf.fill}
                      stroke="#2E6F49"
                      strokeWidth="1.2"
                    />
                    <line
                      x1={leaf.cx - leaf.rx + 3}
                      y1={leaf.cy}
                      x2={leaf.cx + leaf.rx - 2}
                      y2={leaf.cy}
                      stroke="#B8EED0"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      opacity="0.78"
                    />
                  </g>
                ))}
              </g>
            )}

            {hasLemon && (
              <g opacity="0.92">
                <circle cx="72" cy="126" r="11" fill="#FCE778" stroke="#BF9A28" strokeWidth="1.7" />
                <circle cx="72" cy="126" r="8.2" fill="#FFF7C4" />
              </g>
            )}

            {hasSoda && (
              <g fill="#FFFFFF" opacity="0.88">
                <circle className="animate-bubble-1" cx="46" cy="130" r="3" />
                <circle className="animate-bubble-2" cx="64" cy="138" r="2.4" />
                <circle className="animate-bubble-3" cx="79" cy="128" r="3.2" />
                <circle className="animate-bubble-1" cx="56" cy="110" r="2.2" />
                <circle className="animate-bubble-2" cx="73" cy="96" r="2.6" />
              </g>
            )}
          </g>
        )}

        {/* Cylindrical chilled glass depth glaze */}
        <rect x="30" y="40" width="70" height="114" fill={`url(#tg-glass-${uid})`} />
      </g>

      {/* Lush Shaded Whipped Cream Swirl with Glossy Berry Topper */}
      {mode === 'milkshake' && whippedCream && (
        <motion.g
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ transformOrigin: '65px 46px' }}
        >
          <ellipse cx="65" cy="48" rx="34" ry="11" fill={`url(#tg-cream-${uid})`} stroke="#D5BCAC" strokeWidth="1.5" />
          <ellipse cx="65" cy="39" rx="26" ry="10" fill={`url(#tg-cream-${uid})`} stroke="#D5BCAC" strokeWidth="1.4" />
          <ellipse cx="65" cy="31" rx="16" ry="8" fill={`url(#tg-cream-${uid})`} stroke="#D5BCAC" strokeWidth="1.3" />
          <path d="M62 24 Q68 15 73 25 Z" fill="#FFFDFB" stroke="#D5BCAC" strokeWidth="1.2" />
          {/* Glossy strawberry crown */}
          <path d="M58.5 24 Q65 12 71.5 24 Q65 30 58.5 24 Z" fill="#E34B6F" stroke="#9E2A48" strokeWidth="1.1" />
          <ellipse cx="63" cy="21" rx="2" ry="1.1" transform="rotate(-24 63 21)" fill="#FFD5E0" opacity="0.88" />
          <circle cx="52" cy="41" r="2" fill="#F285A2" />
          <circle cx="77" cy="40" r="2" fill="#7AC297" />
          <circle cx="67" cy="44" r="2" fill="#F5C553" />
        </motion.g>
      )}

      {/* Glass Rim, Specular Reflections & Chilled Condensation Droplets */}
      <ellipse cx="65" cy="40" rx="35" ry="4.8" fill="none" stroke="#89AEB6" strokeWidth="2" />
      <path d="M40 52 L46 142" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
      <path d="M48 60 L52 128" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.44" />
      <path d="M90 54 L85 138" stroke="#FFFDF6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {showCondensation && (
        <g>
          {[
            [37, 74, 1.8],
            [42, 96, 1.5],
            [39, 118, 2.0],
            [88, 86, 1.7],
            [86, 114, 1.9],
            [83, 134, 1.4],
          ].map(([cx, cy, r], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" fillOpacity="0.65" stroke="#8EB8C4" strokeWidth="0.6" />
              <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.38} fill="#FFFFFF" />
            </g>
          ))}
        </g>
      )}
      <ellipse cx="65" cy="154" rx="25" ry="3.8" fill="#D4E4E7" opacity="0.82" />
    </svg>
  );
};

interface BlenderSvgProps {
  ingredients: Partial<Record<BlenderIngredientId, number>>;
  isBlending: boolean;
  className?: string;
}

export const BlenderSvg: React.FC<BlenderSvgProps> = ({
  ingredients,
  isBlending,
  className = 'w-28 h-32',
}) => {
  const uid = useId().replace(/:/g, '');
  const hasMilk = (ingredients.coldMilk ?? 0) > 0;
  const hasIceCream = (ingredients.iceCream ?? 0) > 0;
  const hasSyrup = (ingredients.strawberrySyrup ?? 0) > 0;

  return (
    <svg
      viewBox="0 0 130 150"
      className={`${className} ${isBlending ? 'animate-blender-shake' : ''}`}
      aria-label="Блендер для мілкшейку"
    >
      <defs>
        <clipPath id={`blender-clip-${uid}`}>
          <path d="M35 32 L95 32 L86 98 L44 98 Z" />
        </clipPath>
        <linearGradient id={`bl-base-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D7EEDC" />
          <stop offset="45%" stopColor="#B8DAC0" />
          <stop offset="100%" stopColor="#94BE9F" />
        </linearGradient>
        <linearGradient id={`bl-lid-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAD0DC" />
          <stop offset="100%" stopColor="#E69EB3" />
        </linearGradient>
      </defs>

      <path
        d="M93 42 C110 42 110 82 88 84"
        fill="none"
        stroke="#92BF9F"
        strokeWidth="6.8"
        strokeLinecap="round"
      />
      <path
        d="M95 45 C106 46 106 76 90 80"
        fill="none"
        stroke="#E4F5E8"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />

      <path
        d="M32 30 L98 30 L88 100 L42 100 Z"
        fill="#FFFDF9"
        fillOpacity="0.68"
        stroke="#86ACB3"
        strokeWidth="2.2"
      />

      <g clipPath={`url(#blender-clip-${uid})`}>
        {isBlending ? (
          <g>
            <rect x="30" y="38" width="70" height="64" fill={hasSyrup ? '#F6A4BE' : '#FCEFD3'} />
            {/* Spinning vortex */}
            <g className="animate-whirl" fill="none" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" opacity="0.8">
              <path d="M46 72 A19 19 0 0 1 84 72" />
              <path d="M53 72 A12 12 0 0 0 77 72" />
            </g>
          </g>
        ) : (
          <>
            {hasMilk && <rect x="30" y="64" width="70" height="36" fill="#EEF7FC" />}
            {hasSyrup && <rect x="30" y="84" width="70" height="18" fill="#E65F81" />}
            {hasIceCream && (
              <g>
                <circle cx="56" cy="70" r="13" fill="#FDF1CE" stroke="#D4B374" strokeWidth="1.4" />
                <ellipse cx="52" cy="65" rx="4.5" ry="2.2" fill="#FFFFFF" opacity="0.7" />
                <circle cx="74" cy="74" r="12" fill="#FFF7E2" stroke="#D4B374" strokeWidth="1.4" />
                <ellipse cx="70" cy="69" rx="4" ry="2" fill="#FFFFFF" opacity="0.75" />
              </g>
            )}
          </>
        )}
      </g>

      {/* Glass pitcher front sheen */}
      <path d="M40 38 L47 93" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" opacity="0.68" />

      <rect x="30" y="22" width="70" height="10" rx="5" fill={`url(#bl-lid-${uid})`} stroke="#7A525D" strokeWidth="1.8" />
      <rect x="55" y="14" width="20" height="10" rx="4" fill="#FBE0E7" stroke="#7A525D" strokeWidth="1.6" />

      {/* Shaded Sage Motor Base */}
      <path
        d="M38 100 L92 100 L100 138 Q100 144 92 144 L38 144 Q30 144 30 138 Z"
        fill={`url(#bl-base-${uid})`}
        stroke="#5A3E32"
        strokeWidth="2"
      />
      <circle cx="65" cy="122" r="11" fill="#FAF4E8" stroke="#5A3E32" strokeWidth="1.8" />
      <circle cx="65" cy="122" r="5" fill={isBlending ? '#EA7D98' : '#7CB68F'} />

      {isBlending && (
        <g fill="#F08DA6">
          <circle cx="22" cy="52" r="4" />
          <circle cx="110" cy="46" r="3.5" />
          <circle cx="18" cy="82" r="3" />
        </g>
      )}
    </svg>
  );
};

export const DrinkPreviewSvg: React.FC<{
  drink: PreparedDrink;
  className?: string;
}> = ({ drink, className = 'w-16 h-16' }) => {
  if (drink.takeaway) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <TakeawayCupSvg drink={drink} className="h-full w-full" />
        {drink.category === 'hot' && drink.latteArtDataUrl && (
          <img
            src={drink.latteArtDataUrl}
            alt="Мініатюра лате-арту"
            className="absolute -right-1 -top-1 h-6 w-6 rounded-full border-2 border-[#FFFDF8] object-cover shadow-sm ring-1 ring-[#A67D58]"
          />
        )}
      </div>
    );
  }

  if (drink.category === 'hot') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <HotCupSvg
          ingredients={drink.ingredients}
          className="h-full w-full"
          showSteam={true}
        />
        {drink.latteArtDataUrl && (
          <img
            src={drink.latteArtDataUrl}
            alt="Мініатюра лате-арту"
            className="absolute -right-1 -top-1 h-7 w-7 rounded-full border-2 border-[#FFFDF8] object-cover shadow-sm ring-1 ring-[#A67D58]"
          />
        )}
      </div>
    );
  }
  if (drink.category === 'milkshake') {
    return (
      <TallGlassSvg
        mode="milkshake"
        milkshakeIngredients={drink.blenderIngredients}
        whippedCream={drink.whippedCream}
        className={className}
      />
    );
  }
  return (
    <TallGlassSvg
      mode="cocktail"
      cocktailIngredients={drink.ingredients}
      className={className}
    />
  );
};
