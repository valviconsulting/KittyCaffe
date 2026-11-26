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

  const layers: Array<{ color: string; height: number; key: string; stripe?: string }> = [];
  if (espresso > 0) {
    layers.push({ color: '#613823', height: 22, key: 'espresso' });
  }
  if (cocoa > 0) {
    layers.push({ color: '#834D2E', height: 28, key: 'cocoa' });
  }
  if (matcha > 0) {
    layers.push({ color: '#82B96E', height: 30, key: 'matcha', stripe: '#669C54' });
  }
  if (hotWater > 0) {
    layers.push({ color: '#AE7B56', height: 30, key: 'hotWater' });
  }
  if (warmMilk > 0.02) {
    const milk1 = Math.min(1, warmMilk);
    layers.push({ color: '#FDF1DC', height: 24 * milk1, key: 'warmMilk1' });
  }
  if (warmMilk > 1.02) {
    const milk2 = Math.min(1, warmMilk - 1);
    layers.push({
      color: '#FFF9EF',
      height: 24 * milk2,
      key: 'warmMilk2',
      stripe: '#ECD4B2',
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
  const hasAnyLiquid = layers.length > 0 || foam > 0;
  const foamY = Math.max(44, topLiquidY - 12);
  const streamEndY = Math.min(118, Math.max(46, topLiquidY + 2));

  return (
    <svg viewBox="0 0 150 150" className={className} aria-label="Прозора акварельна чашка">
      <defs>
        <clipPath id={`hot-clip-${uid}`}>
          <path d="M30 42 L106 42 L100 112 Q99 124 85 124 L51 124 Q37 124 36 112 Z" />
        </clipPath>
      </defs>

      {/* Animated steam wisps (softly tucked away while pouring so pitcher shines) */}
      {showSteam && hasAnyLiquid && !isPouringMilk && (
        <g fill="none" stroke="#D8B69A" strokeWidth="2.8" strokeLinecap="round">
          <path className="animate-steam-1" d="M52 34 Q46 24 53 15 Q59 8 53 2" />
          <path className="animate-steam-2" d="M68 32 Q74 22 67 13 Q61 6 68 0" />
          <path className="animate-steam-3" d="M84 34 Q79 24 85 15 Q91 8 85 2" />
        </g>
      )}

      {/* Watercolor blush saucer */}
      {showSaucer && (
        <>
          <ellipse cx="68" cy="130" rx="48" ry="9" fill="#F4C7D2" stroke="#8F6358" strokeWidth="2.2" />
          <ellipse cx="68" cy="129" rx="32" ry="4.5" fill="#FCEBF0" />
        </>
      )}

      {/* Glass Handle */}
      <path
        d="M104 54 C126 54 128 96 101 98"
        fill="none"
        stroke="#C5A68E"
        strokeWidth="9.5"
        strokeLinecap="round"
      />
      <path
        d="M104 54 C126 54 128 96 101 98"
        fill="none"
        stroke="#FFFDF9"
        strokeWidth="4.2"
        strokeLinecap="round"
      />

      {/* Transparent glass back */}
      <path
        d="M28 40 L108 40 L102 113 Q101 126 86 126 L50 126 Q35 126 34 113 Z"
        fill="#FFFDF9"
        fillOpacity="0.68"
        stroke="#B69278"
        strokeWidth="2.8"
      />

      {/* Clipped smoothly animated liquid layers */}
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
                  fill={layer.color}
                />
              ) : (
                <motion.rect
                  x="25"
                  width="86"
                  fill={layer.color}
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
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}
            </g>
          );
        })}

        {/* Silky cream splash & ripple where the pouring stream meets the liquid */}
        {isPouringMilk && (
          <g>
            <motion.ellipse
              cx="74"
              cy={streamEndY}
              rx="14"
              ry="3.6"
              fill="#FFFDF8"
              fillOpacity="0.88"
              animate={{ rx: [11, 17, 11], opacity: [0.95, 0.55, 0.95] }}
              transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="63"
              cy={Math.max(46, streamEndY - 5)}
              r="2.4"
              fill="#FFF9EC"
              animate={{ y: [0, -5, 0], opacity: [0.9, 0.35, 0.9] }}
              transition={{ duration: 0.36, repeat: Infinity }}
            />
            <motion.circle
              cx="84"
              cy={Math.max(46, streamEndY - 4)}
              r="2"
              fill="#FFF9EC"
              animate={{ y: [0, -6, 0], opacity: [0.85, 0.3, 0.85] }}
              transition={{ duration: 0.44, repeat: Infinity, delay: 0.12 }}
            />
          </g>
        )}

        {/* Fluffy Milk Foam layer */}
        {foam > 0 && (
          <motion.g
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <rect x="26" y={foamY + 4} width="84" height="16" fill="#FFFDF9" />
            <circle cx="42" cy={foamY + 6} r="11" fill="#FFFDF9" />
            <circle cx="58" cy={foamY + 3} r="13" fill="#FFFDF9" />
            <circle cx="76" cy={foamY + 4} r="13" fill="#FFFDF9" />
            <circle cx="92" cy={foamY + 7} r="10" fill="#FFFDF9" />
          </motion.g>
        )}
      </g>

      {/* Overflowing foam crown */}
      {foam > 0 && (
        <motion.g
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ transformOrigin: '68px 42px' }}
        >
          <ellipse
            cx="68"
            cy={Math.max(41, foamY + 2)}
            rx="34"
            ry="7"
            fill="#FFFDF9"
            stroke="#E5D1C4"
            strokeWidth="1.5"
          />
          <circle cx="52" cy={Math.max(38, foamY)} r="8" fill="#FFFDF9" />
          <circle cx="68" cy={Math.max(36, foamY - 2)} r="10" fill="#FFFDF9" />
          <circle cx="84" cy={Math.max(38, foamY)} r="8" fill="#FFFDF9" />
        </motion.g>
      )}

      {/* Marshmallows bobbing on top */}
      {marshmallow > 0 && (
        <motion.g
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: Math.min(0, topLiquidY - 52), opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 15 }}
        >
          <rect
            x="40"
            y={Math.max(38, topLiquidY - 8)}
            width="14"
            height="11"
            rx="4"
            transform={`rotate(-12 47 ${Math.max(43, topLiquidY - 2)})`}
            fill="#FFFDF9"
            stroke="#DFC0B6"
            strokeWidth="1.6"
          />
          <rect
            x="58"
            y={Math.max(36, topLiquidY - 10)}
            width="15"
            height="11"
            rx="4"
            transform={`rotate(8 65 ${Math.max(41, topLiquidY - 4)})`}
            fill="#F6CFD9"
            stroke="#DB9FB0"
            strokeWidth="1.6"
          />
          <rect
            x="76"
            y={Math.max(38, topLiquidY - 8)}
            width="14"
            height="11"
            rx="4"
            transform={`rotate(-6 83 ${Math.max(43, topLiquidY - 2)})`}
            fill="#FFFDF9"
            stroke="#DFC0B6"
            strokeWidth="1.6"
          />
        </motion.g>
      )}

      {/* Cinnamon sprinkle dots */}
      {cinnamon > 0 && (
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          fill="#AD6229"
        >
          {[
            [50, foam > 0 ? Math.max(37, foamY - 1) : Math.max(46, topLiquidY + 2)],
            [58, foam > 0 ? Math.max(35, foamY - 3) : Math.max(48, topLiquidY + 4)],
            [67, foam > 0 ? Math.max(37, foamY - 1) : Math.max(45, topLiquidY + 1)],
            [74, foam > 0 ? Math.max(34, foamY - 4) : Math.max(47, topLiquidY + 3)],
            [82, foam > 0 ? Math.max(37, foamY - 1) : Math.max(46, topLiquidY + 2)],
            [62, foam > 0 ? Math.max(39, foamY + 1) : Math.max(49, topLiquidY + 5)],
            [72, foam > 0 ? Math.max(39, foamY + 1) : Math.max(49, topLiquidY + 5)],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="2.2" />
          ))}
        </motion.g>
      )}

      {/* Glass Rim & Front Reflection */}
      <ellipse cx="68" cy="41" rx="40" ry="5.5" fill="none" stroke="#B69278" strokeWidth="2.5" />
      <path d="M38 52 L42 112" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.65" />

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

      <g opacity="0.28" transform="translate(68, 92)">
        <circle cx="-7" cy="-2" r="1.8" fill="#5A3E32" />
        <circle cx="7" cy="-2" r="1.8" fill="#5A3E32" />
        <path d="M-4 3 Q0 6 4 3" fill="none" stroke="#5A3E32" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* Tilted watercolor ceramic milk pitcher & silky pouring stream */}
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
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          <motion.path
            d={`M93 24 Q79 ${Math.round((24 + streamEndY) * 0.45)} 74 ${streamEndY}`}
            fill="none"
            stroke="#FFFBF2"
            strokeWidth="4.6"
            strokeLinecap="round"
            animate={{ strokeWidth: [4.2, 5.2, 4.2] }}
            transition={{ duration: 0.38, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Watercolor ceramic pitcher tilted warmly above top-right rim */}
          <g transform="translate(115, 22) rotate(-36)">
            {/* Ceramic handle */}
            <path
              d="M12 -5 C23 -5 23 11 11 11"
              fill="none"
              stroke="#6B4837"
              strokeWidth="4.4"
              strokeLinecap="round"
            />
            <path
              d="M12 -5 C23 -5 23 11 11 11"
              fill="none"
              stroke="#FFF7E8"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            {/* Pitcher body with pouring spout */}
            <path
              d="M-21 -11 L-11 -9 L10 -9 Q14 -9 13 -4 L11 13 Q10 17 5 17 L-8 17 Q-13 17 -14 12 L-15 -3 Z"
              fill="#FFF7E8"
              stroke="#6B4837"
              strokeWidth="2.1"
              strokeLinejoin="round"
            />
            {/* Cozy blush watercolor stripe on pitcher */}
            <path
              d="M-13 2 L12 2 L11 7 L-13 7 Z"
              fill="#F2B8C6"
              opacity="0.85"
            />
            {/* Warm milk peeking near spout */}
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

  const hasShakeSyrup = (milkshakeIngredients.strawberrySyrup ?? 0) > 0;
  const hasShakeCream =
    (milkshakeIngredients.iceCream ?? 0) > 0 ||
    (milkshakeIngredients.coldMilk ?? 0) > 0;
  const shakeColor =
    hasShakeSyrup && hasShakeCream
      ? '#F7A9C1'
      : hasShakeSyrup
        ? '#E76E92'
        : '#FDF1DD';

  return (
    <svg viewBox="0 0 130 170" className={className} aria-label="Високий акварельний келих">
      <defs>
        <clipPath id={`tall-clip-${uid}`}>
          <path d="M32 42 L98 42 L90 144 Q89 152 79 152 L51 152 Q41 152 40 144 Z" />
        </clipPath>
        <linearGradient id={`sunrise-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBB845" />
          <stop offset="48%" stopColor="#F58D4C" />
          <stop offset="82%" stopColor="#EB5D74" />
          <stop offset="100%" stopColor="#D33E5D" />
        </linearGradient>
        <linearGradient id={`mojito-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF9F2" />
          <stop offset="100%" stopColor="#C1E9D4" />
        </linearGradient>
      </defs>

      {/* Candy-Striped Straw */}
      {(hasAnyCocktail || mode === 'milkshake') && (
        <g transform="rotate(11 76 48)">
          <rect x="74" y="10" width="9" height="124" rx="4" fill="#FFFDF9" stroke="#C86D86" strokeWidth="1.6" />
          <g fill="#EE839E">
            <rect x="74.5" y="18" width="8" height="7" />
            <rect x="74.5" y="32" width="8" height="7" />
            <rect x="74.5" y="46" width="8" height="7" />
            <rect x="74.5" y="60" width="8" height="7" />
            <rect x="74.5" y="74" width="8" height="7" />
          </g>
        </g>
      )}

      {/* Lemon wheel on rim */}
      {mode === 'cocktail' && hasLemon && (
        <g transform="translate(96, 44) rotate(18)">
          <circle cx="0" cy="0" r="15" fill="#FCE46D" stroke="#B69428" strokeWidth="2.2" />
          <circle cx="0" cy="0" r="11" fill="#FFF8C0" />
          <g stroke="#F8DB58" strokeWidth="1.6">
            <line x1="-10" y1="0" x2="10" y2="0" />
            <line x1="0" y1="-10" x2="0" y2="10" />
            <line x1="-7" y1="-7" x2="7" y2="7" />
            <line x1="-7" y1="7" x2="7" y2="-7" />
          </g>
        </g>
      )}

      {/* Glass Back */}
      <path
        d="M30 40 L100 40 L92 145 Q91 155 80 155 L50 155 Q39 155 38 145 Z"
        fill="#FFFDF9"
        fillOpacity="0.65"
        stroke="#9CBDC2"
        strokeWidth="2.8"
      />

      {/* Clipped Contents */}
      <g clipPath={`url(#tall-clip-${uid})`}>
        {mode === 'milkshake' ? (
          <motion.g
            initial={{ y: 90, opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
          >
            <rect x="28" y="52" width="74" height="104" fill={shakeColor} />
            <path
              d="M36 95 Q65 86 92 98 L92 112 Q65 100 36 110 Z"
              fill="#FFFFFF"
              opacity="0.22"
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
                    fill="#F7AC45"
                    opacity={hasSoda ? 0.85 : 1}
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
                    fill="#E56280"
                    initial={{ y: 154, height: 0 }}
                    animate={{ y: hasSoda ? 116 : 106, height: 48 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                  />
                )}
              </>
            )}

            {hasIce && (
              <g fill="#FFFFFF" fillOpacity="0.68" stroke="#AEDCEB" strokeWidth="1.6">
                <rect x="40" y="68" width="18" height="18" rx="4" transform="rotate(-14 49 77)" />
                <rect x="66" y="76" width="18" height="18" rx="4" transform="rotate(12 75 85)" />
                <rect x="49" y="100" width="17" height="17" rx="4" transform="rotate(8 57 108)" />
              </g>
            )}

            {hasMint && (
              <g>
                <ellipse cx="52" cy="92" rx="11" ry="6" transform="rotate(-28 52 92)" fill="#5DB682" stroke="#367C54" strokeWidth="1.4" />
                <ellipse cx="76" cy="108" rx="11" ry="6" transform="rotate(24 76 108)" fill="#72C694" stroke="#367C54" strokeWidth="1.4" />
                <ellipse cx="60" cy="126" rx="10" ry="5.5" transform="rotate(-14 60 126)" fill="#5DB682" stroke="#367C54" strokeWidth="1.4" />
              </g>
            )}

            {hasLemon && (
              <circle cx="72" cy="126" r="11" fill="#FCE778" stroke="#C5A02B" strokeWidth="2" opacity="0.9" />
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
      </g>

      {/* Fluffy Whipped Cream Swirl */}
      {mode === 'milkshake' && whippedCream && (
        <motion.g
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ transformOrigin: '65px 46px' }}
        >
          <ellipse cx="65" cy="48" rx="34" ry="11" fill="#FFFDFB" stroke="#DFC9BE" strokeWidth="1.8" />
          <ellipse cx="65" cy="39" rx="26" ry="10" fill="#FFFDFB" stroke="#DFC9BE" strokeWidth="1.6" />
          <ellipse cx="65" cy="31" rx="16" ry="8" fill="#FFFDFB" stroke="#DFC9BE" strokeWidth="1.5" />
          <path d="M62 24 Q68 15 73 25 Z" fill="#FFFDFB" stroke="#DFC9BE" strokeWidth="1.5" />
          <path d="M59 24 Q65 13 71 24 Q65 30 59 24 Z" fill="#EC6382" />
          <circle cx="52" cy="41" r="2" fill="#F290AA" />
          <circle cx="77" cy="40" r="2" fill="#8CC6A3" />
          <circle cx="67" cy="44" r="2" fill="#F5CA63" />
        </motion.g>
      )}

      {/* Glass Rim & Highlight */}
      <ellipse cx="65" cy="40" rx="35" ry="4.8" fill="none" stroke="#92B6BE" strokeWidth="2.3" />
      <path d="M41 54 L47 142" stroke="#FFFFFF" strokeWidth="4.2" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="65" cy="155" rx="25" ry="4" fill="#DCE9EB" />
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
      aria-label="Акварельний блендер для мілкшейку"
    >
      <defs>
        <clipPath id={`blender-clip-${uid}`}>
          <path d="M35 32 L95 32 L86 98 L44 98 Z" />
        </clipPath>
      </defs>

      <path
        d="M93 42 C110 42 110 82 88 84"
        fill="none"
        stroke="#9FC8AC"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M32 30 L98 30 L88 100 L42 100 Z"
        fill="#FFFDF9"
        fillOpacity="0.72"
        stroke="#8BB1B8"
        strokeWidth="2.6"
      />

      <g clipPath={`url(#blender-clip-${uid})`}>
        {isBlending ? (
          <g>
            <rect x="30" y="38" width="70" height="64" fill={hasSyrup ? '#F7A9C1' : '#FDF0D5'} />
            {/* Spinning watercolor vortex */}
            <g className="animate-whirl" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.78">
              <path d="M46 72 A19 19 0 0 1 84 72" />
              <path d="M53 72 A12 12 0 0 0 77 72" />
            </g>
          </g>
        ) : (
          <>
            {hasMilk && <rect x="30" y="64" width="70" height="36" fill="#F0F8FC" />}
            {hasSyrup && <rect x="30" y="84" width="70" height="18" fill="#EB6C8C" />}
            {hasIceCream && (
              <g>
                <circle cx="56" cy="70" r="13" fill="#FDF1CE" stroke="#DCBE82" strokeWidth="1.6" />
                <circle cx="74" cy="74" r="12" fill="#FFF7E2" stroke="#DCBE82" strokeWidth="1.6" />
              </g>
            )}
          </>
        )}
      </g>

      <rect x="30" y="22" width="70" height="10" rx="5" fill="#F3B8C8" stroke="#7A525D" strokeWidth="2" />
      <rect x="55" y="14" width="20" height="10" rx="4" fill="#F9DAE2" stroke="#7A525D" strokeWidth="1.8" />

      {/* Sage Motor Base */}
      <path
        d="M38 100 L92 100 L100 138 Q100 144 92 144 L38 144 Q30 144 30 138 Z"
        fill="#C3DFC9"
        stroke="#5A3E32"
        strokeWidth="2.4"
      />
      <circle cx="65" cy="122" r="11" fill="#FAF4E8" stroke="#5A3E32" strokeWidth="2" />
      <circle cx="65" cy="122" r="5" fill={isBlending ? '#EA7D98' : '#85BC97'} />

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
