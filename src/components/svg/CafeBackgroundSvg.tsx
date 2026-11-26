import React, { useId } from 'react';
import type { WeatherType } from '../../types/game';

interface CafeBackgroundSvgProps {
  weather: WeatherType;
}

const RAIN_DROPS = [
  { x: 34, delay: '0s', dur: '1.1s', len: 18 },
  { x: 56, delay: '0.4s', dur: '1.3s', len: 22 },
  { x: 78, delay: '0.15s', dur: '1.05s', len: 16 },
  { x: 102, delay: '0.65s', dur: '1.25s', len: 20 },
  { x: 124, delay: '0.25s', dur: '1.15s', len: 18 },
  { x: 146, delay: '0.8s', dur: '1.35s', len: 22 },
  { x: 166, delay: '0.5s', dur: '1.1s', len: 16 },
  { x: 64, delay: '0.95s', dur: '1.2s', len: 19 },
  { x: 136, delay: '0.05s', dur: '1.28s', len: 17 },
];

const SNOW_FLAKES = [
  { x: 32, r: 3.4, delay: '0s', dur: '4.1s' },
  { x: 54, r: 2.6, delay: '1.2s', dur: '4.8s' },
  { x: 76, r: 4.0, delay: '0.6s', dur: '3.9s' },
  { x: 98, r: 2.8, delay: '2.1s', dur: '4.5s' },
  { x: 120, r: 3.6, delay: '0.9s', dur: '4.3s' },
  { x: 142, r: 2.5, delay: '1.8s', dur: '5.0s' },
  { x: 162, r: 3.8, delay: '0.3s', dur: '4.0s' },
  { x: 46, r: 2.4, delay: '2.8s', dur: '4.6s' },
  { x: 112, r: 3.2, delay: '3.1s', dur: '4.2s' },
  { x: 152, r: 2.8, delay: '2.4s', dur: '4.7s' },
];

export const CafeBackgroundSvg: React.FC<CafeBackgroundSvgProps> = ({
  weather,
}) => {
  const uid = useId().replace(/:/g, '');

  const skyStops =
    weather === 'sunny'
      ? ['#CBEAF5', '#FAF0DC', '#FDE2BE']
      : weather === 'rainy'
        ? ['#B8C9D8', '#D6DFE7', '#E6E4E1']
        : ['#C7D8EA', '#E3ECF5', '#F6F3F0'];

  const hillColor1 =
    weather === 'snowy' ? '#EEF4F8' : weather === 'rainy' ? '#A8C5B4' : '#B7D8BF';
  const hillColor2 =
    weather === 'snowy' ? '#DCE8F2' : weather === 'rainy' ? '#92B6A2' : '#9EC7AB';

  return (
    <svg
      viewBox="0 0 1200 320"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full pointer-events-none select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`wall-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF3E6" />
          <stop offset="100%" stopColor="#F4E6D2" />
        </linearGradient>
        <radialGradient id={`wash-pink-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5CFD8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#F5CFD8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`wash-sage-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C1DBC6" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#C1DBC6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`wash-honey-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F3D69A" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#F3D69A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyStops[0]} />
          <stop offset="62%" stopColor={skyStops[1]} />
          <stop offset="100%" stopColor={skyStops[2]} />
        </linearGradient>
        <linearGradient id={`counter-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E1BC8E" />
          <stop offset="22%" stopColor="#CFA16E" />
          <stop offset="100%" stopColor="#B48150" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#FFF2B2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`sunbeam-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF4C2" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#FFF4C2" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`win-clip-${uid}`}>
          <path d="M16 192 L16 88 A80 80 0 0 1 176 88 L176 192 Z" />
        </clipPath>
        <pattern
          id={`stripes-${uid}`}
          width="52"
          height="52"
          patternUnits="userSpaceOnUse"
        >
          <rect width="26" height="52" fill="#EBD8C0" fillOpacity="0.22" />
        </pattern>
      </defs>

      {/* Warm Watercolor Paper Wall + Soft Pastel Washes */}
      <rect x="0" y="0" width="1200" height="320" fill={`url(#wall-${uid})`} />
      <rect x="0" y="0" width="1200" height="248" fill={`url(#stripes-${uid})`} />
      <ellipse cx="290" cy="120" rx="220" ry="120" fill={`url(#wash-honey-${uid})`} />
      <ellipse cx="640" cy="110" rx="240" ry="125" fill={`url(#wash-pink-${uid})`} />
      <ellipse cx="960" cy="130" rx="210" ry="115" fill={`url(#wash-sage-${uid})`} />

      {/* Subtle decorative watercolor paw prints on wallpaper */}
      {[120, 465, 695, 1100].map((px, idx) => (
        <g
          key={px}
          transform={`translate(${px}, ${idx % 2 === 0 ? 74 : 114}) rotate(${idx % 2 === 0 ? -12 : 14})`}
          opacity="0.11"
          fill="#9E7454"
        >
          <ellipse cx="0" cy="6" rx="9" ry="7" />
          <circle cx="-10" cy="-4" r="3.8" />
          <circle cx="-3.5" cy="-9" r="4" />
          <circle cx="4" cy="-9" r="4" />
          <circle cx="10.5" cy="-4" r="3.8" />
        </g>
      ))}

      {/* Large Arched Cafe Window with Real-Time Weather */}
      <g transform="translate(52, 22)">
        {/* Window Glass Background */}
        <path
          d="M12 195 L12 88 A84 84 0 0 1 180 88 L180 195 Z"
          fill={`url(#sky-${uid})`}
        />

        {/* Weather Scene inside Window */}
        <g clipPath={`url(#win-clip-${uid})`}>
          {weather === 'sunny' && (
            <g>
              {/* Soft Ghibli glowing sun */}
              <circle cx="136" cy="54" r="24" fill="#FFF0AE" opacity="0.65" />
              <circle cx="136" cy="54" r="14" fill="#FFE082" />
              {/* Diagonal warm sunbeams */}
              <g className="animate-sun-shimmer">
                <polygon points="105,15 162,15 80,196 30,196" fill={`url(#sunbeam-${uid})`} />
                <polygon points="150,45 186,45 132,196 102,196" fill={`url(#sunbeam-${uid})`} />
              </g>
              {/* Fluffy watercolor clouds */}
              <g fill="#FFFDF8" opacity="0.9">
                <ellipse cx="62" cy="70" rx="25" ry="12" />
                <ellipse cx="78" cy="64" rx="18" ry="11" />
                <ellipse cx="134" cy="112" rx="22" ry="10" />
              </g>
            </g>
          )}

          {weather === 'rainy' && (
            <g>
              {/* Cozy rainy clouds */}
              <g fill="#9BB0C2" opacity="0.72">
                <ellipse cx="58" cy="56" rx="34" ry="15" />
                <ellipse cx="122" cy="64" rx="38" ry="16" />
                <ellipse cx="90" cy="48" rx="28" ry="14" />
              </g>
              {/* Animated falling rain streaks */}
              <g stroke="#7FA4C2" strokeWidth="2.1" strokeLinecap="round">
                {RAIN_DROPS.map((drop, i) => (
                  <line
                    key={i}
                    className="animate-rain"
                    style={{
                      animationDelay: drop.delay,
                      animationDuration: drop.dur,
                    }}
                    x1={drop.x}
                    y1={10}
                    x2={drop.x - 5}
                    y2={10 + drop.len}
                  />
                ))}
              </g>
              {/* Delicate condensation droplets resting on window glass */}
              <g fill="#EAF4FC" opacity="0.82">
                <circle cx="42" cy="126" r="2.6" />
                <circle cx="118" cy="134" r="3" />
                <circle cx="152" cy="94" r="2.2" />
                <circle cx="72" cy="154" r="2.5" />
                <circle cx="144" cy="148" r="2.8" />
              </g>
            </g>
          )}

          {weather === 'snowy' && (
            <g>
              {/* Gentle misty winter clouds */}
              <g fill="#F4F8FC" opacity="0.75">
                <ellipse cx="66" cy="54" rx="32" ry="13" />
                <ellipse cx="132" cy="62" rx="30" ry="12" />
              </g>
              {/* Animated gently swaying snowflakes */}
              <g fill="#FFFFFF">
                {SNOW_FLAKES.map((flake, i) => (
                  <circle
                    key={i}
                    className="animate-snow"
                    style={{
                      animationDelay: flake.delay,
                      animationDuration: flake.dur,
                    }}
                    cx={flake.x}
                    cy={8}
                    r={flake.r}
                  />
                ))}
              </g>
            </g>
          )}

          {/* Distant rolling hills (sage green or snow-covered) */}
          <ellipse cx="52" cy="190" rx="44" ry="24" fill={hillColor1} />
          <ellipse cx="134" cy="192" rx="48" ry="26" fill={hillColor2} />

          {/* Frosted watercolor corners when snowy */}
          {weather === 'snowy' && (
            <g fill="#FFFFFF" opacity="0.45">
              <circle cx="22" cy="186" r="18" />
              <circle cx="170" cy="186" r="18" />
            </g>
          )}
        </g>

        {/* Window Frame & Muntins (soft warm dark-brown accents) */}
        <path
          d="M12 195 L12 88 A84 84 0 0 1 180 88 L180 195 Z"
          fill="none"
          stroke="#C2946A"
          strokeWidth="8"
        />
        <line x1="96" y1="6" x2="96" y2="195" stroke="#C2946A" strokeWidth="4.8" />
        <line x1="12" y1="115" x2="180" y2="115" stroke="#C2946A" strokeWidth="4.8" />

        {/* Soft watercolor curtains */}
        <path
          d="M12 66 Q44 85 62 28 Q35 12 12 66 Z"
          fill="#F5CFD8"
          opacity="0.92"
        />
        <path
          d="M180 66 Q148 85 130 28 Q157 12 180 66 Z"
          fill="#F5CFD8"
          opacity="0.92"
        />

        {/* Window sill & herb pot */}
        <rect x="2" y="192" width="188" height="12" rx="6" fill="#BA885B" />
        <path d="M36 192 L41 174 L61 174 L66 192 Z" fill="#E89DAE" stroke="#5A3E32" strokeWidth="1.5" />
        <ellipse cx="51" cy="168" rx="9" ry="7" fill="#82BC95" />
        <ellipse cx="42" cy="171" rx="7" ry="5" fill="#9ACDA9" />
        <ellipse cx="60" cy="171" rx="7" ry="5" fill="#9ACDA9" />
      </g>

      {/* Warm Indoor Sunbeams spilling onto wall when sunny */}
      {weather === 'sunny' && (
        <polygon
          points="190,60 250,60 340,234 215,234"
          fill={`url(#sunbeam-${uid})`}
          className="animate-sun-shimmer"
        />
      )}

      {/* Handwritten Chalkboard Sign (Caveat script!) */}
      <g transform="translate(262, 42)">
        <rect
          x="0"
          y="0"
          width="136"
          height="78"
          rx="14"
          fill="#5A4338"
          stroke="#C89B6E"
          strokeWidth="5"
        />
        <text
          x="68"
          y="33"
          textAnchor="middle"
          fill="#FAF4E8"
          fontSize="24"
          fontWeight="700"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          Мур-Лате
        </text>
        <line
          x1="22"
          y1="42"
          x2="114"
          y2="42"
          stroke="#F4C7D2"
          strokeWidth="1.6"
          strokeDasharray="3 3"
        />
        <text
          x="68"
          y="63"
          textAnchor="middle"
          fill="#F7D9E0"
          fontSize="16"
          fontWeight="600"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          ♥ Кава &amp; Казка ♥
        </text>
      </g>

      {/* Cozy Wooden Wall Shelves (cleanly positioned clear of Serving Tray) */}
      <g transform="translate(736, 30) scale(0.92)">
        <rect x="0" y="54" width="245" height="11" rx="5.5" fill="#BE8D60" />
        <rect x="18" y="65" width="10" height="14" rx="3" fill="#A57348" />
        <rect x="216" y="65" width="10" height="14" rx="3" fill="#A57348" />

        {/* Watercolor blush teapot */}
        <g transform="translate(26, 20)">
          <ellipse cx="22" cy="22" rx="17" ry="14" fill="#F2B8C6" stroke="#5A3E32" strokeWidth="1.8" />
          <path d="M38 18 Q48 16 44 26 Q42 30 37 28" fill="none" stroke="#5A3E32" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M7 22 Q-2 16 2 10" fill="none" stroke="#5A3E32" strokeWidth="2.6" strokeLinecap="round" />
          <ellipse cx="22" cy="9" rx="9" ry="3.5" fill="#FCE5EB" stroke="#5A3E32" strokeWidth="1.6" />
          <circle cx="22" cy="5" r="3" fill="#F4C7D2" stroke="#5A3E32" strokeWidth="1.4" />
        </g>

        {/* Sage cat-ear mug */}
        <g transform="translate(96, 26)">
          <path d="M5 10 L8 2 L14 8 Z" fill="#C2DEC8" stroke="#5A3E32" strokeWidth="1.6" />
          <path d="M27 10 L24 2 L18 8 Z" fill="#C2DEC8" stroke="#5A3E32" strokeWidth="1.6" />
          <rect x="4" y="8" width="24" height="20" rx="7" fill="#D4E9D8" stroke="#5A3E32" strokeWidth="1.6" />
          <path d="M28 13 Q35 13 35 19 Q35 25 28 25" fill="none" stroke="#5A3E32" strokeWidth="2" />
          <circle cx="12" cy="17" r="1.5" fill="#5A3E32" />
          <circle cx="20" cy="17" r="1.5" fill="#5A3E32" />
          <path d="M14 20 Q16 22 18 20" fill="none" stroke="#5A3E32" strokeWidth="1.4" strokeLinecap="round" />
        </g>

        {/* Honey cookie jar */}
        <g transform="translate(152, 16)">
          <rect x="4" y="10" width="32" height="28" rx="8" fill="#FFFDF8" fillOpacity="0.86" stroke="#5A3E32" strokeWidth="1.7" />
          <rect x="8" y="4" width="24" height="7" rx="3" fill="#DFB06E" stroke="#5A3E32" strokeWidth="1.4" />
          <circle cx="16" cy="29" r="5" fill="#D59A5A" />
          <circle cx="25" cy="28" r="5" fill="#C6874A" />
          <circle cx="21" cy="21" r="4.5" fill="#E0AC6E" />
        </g>

        {/* Trailing sage plant */}
        <g transform="translate(202, 24)">
          <path d="M6 30 L9 14 L27 14 L30 30 Z" fill="#E8BF94" stroke="#5A3E32" strokeWidth="1.6" />
          <circle cx="18" cy="10" r="8" fill="#8CC49E" />
          <circle cx="11" cy="14" r="5.5" fill="#A5D5B4" />
          <circle cx="26" cy="15" r="5.5" fill="#77B38B" />
          <path d="M26 19 Q34 32 30 48" fill="none" stroke="#77B38B" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="31" cy="34" r="3.5" fill="#8CC49E" />
          <circle cx="30" cy="46" r="3.5" fill="#A5D5B4" />
        </g>

        {/* Lower shelf */}
        <rect x="20" y="128" width="215" height="10" rx="5" fill="#BE8D60" />
        <rect x="42" y="96" width="26" height="32" rx="5" fill="#F5CFD8" stroke="#5A3E32" strokeWidth="1.5" />
        <rect x="76" y="102" width="24" height="26" rx="5" fill="#CDE3D2" stroke="#5A3E32" strokeWidth="1.5" />
        <rect x="108" y="94" width="28" height="34" rx="5" fill="#F6DFB0" stroke="#5A3E32" strokeWidth="1.5" />
        {/* Framed watercolor paw */}
        <rect x="158" y="88" width="46" height="40" rx="6" fill="#FAF4E8" stroke="#8F6547" strokeWidth="2.6" />
        <g transform="translate(181, 111) scale(0.75)" fill="#E99EB1">
          <ellipse cx="0" cy="5" rx="8" ry="6" />
          <circle cx="-9" cy="-4" r="3.5" />
          <circle cx="-3" cy="-8" r="3.5" />
          <circle cx="3.5" cy="-8" r="3.5" />
          <circle cx="9.5" cy="-4" r="3.5" />
        </g>
      </g>

      {/* Cozy Glowing Fairy Lights Garland (extra warm in rain/snow!) */}
      <g>
        <path
          d="M0 18 Q200 58 400 22 Q600 62 800 22 Q1000 58 1200 18"
          fill="none"
          stroke="#9B7558"
          strokeWidth="2.2"
        />
        {[
          { x: 95, y: 34, c: '#FFE79A' },
          { x: 200, y: 40, c: '#F8C2CF' },
          { x: 305, y: 34, c: '#C6E7D1' },
          { x: 400, y: 24, c: '#FFE79A' },
          { x: 500, y: 38, c: '#F8C2CF' },
          { x: 600, y: 43, c: '#FFE79A' },
          { x: 700, y: 37, c: '#C6E7D1' },
          { x: 800, y: 24, c: '#FFE79A' },
          { x: 900, y: 35, c: '#F8C2CF' },
          { x: 1000, y: 40, c: '#FFE79A' },
          { x: 1105, y: 33, c: '#C6E7D1' },
        ].map((b, i) => (
          <g
            key={b.x}
            className="animate-twinkle"
            style={{ animationDelay: `${i * 0.25}s` }}
          >
            <circle
              cx={b.x}
              cy={b.y + 7}
              r={weather === 'sunny' ? 14 : 18}
              fill={`url(#glow-${uid})`}
            />
            <rect
              x={b.x - 2.5}
              y={b.y - 1}
              width="5"
              height="4"
              rx="1"
              fill="#7A563E"
            />
            <circle
              cx={b.x}
              cy={b.y + 7}
              r="5.8"
              fill={b.c}
              stroke="#B58A5E"
              strokeWidth="1"
            />
          </g>
        ))}
      </g>

      {/* Cozy Honey-Wood Cafe Counter */}
      <g transform="translate(0, 232)">
        <rect x="0" y="0" width="1200" height="22" fill="#EAD0AC" />
        <line x1="0" y1="2" x2="1200" y2="2" stroke="#FCF6EC" strokeWidth="2.5" />
        <line x1="0" y1="22" x2="1200" y2="22" stroke="#9B6E47" strokeWidth="2.8" />
        <rect x="0" y="23" width="1200" height="65" fill={`url(#counter-${uid})`} />
        {Array.from({ length: 16 }).map((_, idx) => (
          <line
            key={idx}
            x1={idx * 80}
            y1="23"
            x2={idx * 80}
            y2="88"
            stroke="#8F5E38"
            strokeWidth="1.5"
            opacity="0.3"
          />
        ))}
      </g>
    </svg>
  );
};
