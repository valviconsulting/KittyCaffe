import React from 'react';
import type { WeatherType } from '../../types/game';

interface WindowWeatherOverlayProps {
  weather: WeatherType;
  isLateAfternoon?: boolean;
}

const RAIN_STREAKS = [
  { x: 61, delay: '0s', dur: '1.05s' },
  { x: 66, delay: '0.35s', dur: '1.22s' },
  { x: 71, delay: '0.15s', dur: '1.08s' },
  { x: 76, delay: '0.6s', dur: '1.18s' },
  { x: 81.5, delay: '0.25s', dur: '1.14s' },
  { x: 87, delay: '0.75s', dur: '1.28s' },
  { x: 92, delay: '0.45s', dur: '1.06s' },
  { x: 97.5, delay: '0.88s', dur: '1.2s' },
  { x: 103, delay: '0.52s', dur: '1.12s' },
  { x: 73.5, delay: '0.92s', dur: '1.16s' },
  { x: 89.5, delay: '0.08s', dur: '1.25s' },
];

const SNOWFLAKES = [
  { x: 61.5, size: 5.5, delay: '0s', dur: '4.1s' },
  { x: 66.5, size: 4, delay: '1.2s', dur: '4.7s' },
  { x: 72, size: 6, delay: '0.5s', dur: '3.9s' },
  { x: 77, size: 4.5, delay: '2.1s', dur: '4.4s' },
  { x: 82.5, size: 5.5, delay: '0.9s', dur: '4.2s' },
  { x: 88, size: 4, delay: '1.7s', dur: '4.9s' },
  { x: 93.5, size: 5.8, delay: '0.3s', dur: '4.0s' },
  { x: 99, size: 4.8, delay: '2.5s', dur: '4.5s' },
  { x: 103.5, size: 4.2, delay: '1.5s', dur: '4.3s' },
  { x: 74.5, size: 4, delay: '3.0s', dur: '4.6s' },
  { x: 90.5, size: 5, delay: '2.7s', dur: '4.3s' },
];

const GOLDEN_MOTES = [
  { cx: 76, cy: 36, r: 0.55, delay: '0s', dur: '5.2s' },
  { cx: 88, cy: 46, r: 0.65, delay: '1.1s', dur: '6.0s' },
  { cx: 81, cy: 58, r: 0.48, delay: '2.3s', dur: '4.8s' },
  { cx: 96, cy: 54, r: 0.58, delay: '0.7s', dur: '5.8s' },
  { cx: 72, cy: 52, r: 0.46, delay: '3.1s', dur: '5.5s' },
  { cx: 102, cy: 65, r: 0.52, delay: '1.8s', dur: '6.2s' },
  { cx: 58, cy: 42, r: 0.44, delay: '2.6s', dur: '5.6s' },
  { cx: 114, cy: 44, r: 0.48, delay: '0.4s', dur: '6.4s' },
];

/**
 * Adds lush Studio Ghibli atmospheric depth:
 * - Warm honey-amber pools from overhead pendant lamps (extra snug when rainy/snowy!)
 * - Soft storybook golden edge vignette framing the interior naturally
 * - Sunbeams + lazy drifting golden dust motes when sunny, crisp rain/snow outside the window
 */
export const WindowWeatherOverlay: React.FC<WindowWeatherOverlayProps> = React.memo(({
  weather,
  isLateAfternoon = false,
}) => {
  const baseLampStrength = weather === 'sunny' ? 0.24 : 0.34;
  const lampStrength = isLateAfternoon ? baseLampStrength + 0.06 : baseLampStrength;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      aria-hidden="true"
    >
      {/* Gentle late-afternoon golden-peach sunset wash (pure alpha, zero mix-blend GPU cost) */}
      {isLateAfternoon && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(255, 174, 102, 0.14) 0%, rgba(235, 138, 102, 0.09) 55%, rgba(164, 96, 86, 0.06) 100%)',
          }}
        />
      )}
      {/* Subtle warm honey vignette grounding corners & framing the sunny center */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 76% 84% at 50% 48%, transparent 56%, rgba(88, 48, 22, 0.15) 100%)',
        }}
      />

      {/* Warm golden-amber light pools aligned with the 3 hanging pendant lamps (pure alpha glow) */}
      <div
        className="animate-sun-shimmer absolute inset-x-0 top-0 h-[58%]"
        style={{
          backgroundImage: `radial-gradient(ellipse 24% 62% at 67% 20%, rgba(255, 222, 132, ${lampStrength}) 0%, rgba(255, 198, 104, 0.1) 55%, transparent 100%), radial-gradient(ellipse 28% 58% at 48% 30%, rgba(255, 232, 168, 0.14) 0%, transparent 100%)`,
        }}
      />

      {/* Focused window weather atmosphere locked 1:1 to bg-cafe.webp (1680×938) via xMidYMid slice */}
      <svg
        viewBox="0 0 168 93.8"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="ghibli-sunbeam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF1AD" stopOpacity="0.4" />
            <stop offset="55%" stopColor="#FFDE82" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FFF1AD" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rain-window-tint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#466E94" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#779FBE" stopOpacity="0.24" />
          </linearGradient>
          <linearGradient id="snow-window-tint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#88B0D6" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#DCEBF8" stopOpacity="0.24" />
          </linearGradient>
          {/* Exact wooden window inner glass panes of bg-cafe.webp (1680×938) — matches object-cover at EVERY aspect ratio! */}
          <clipPath id="panoramic-window-clip">
            <rect x="57.2" y="20.0" width="49.5" height="51.2" rx="0.8" />
          </clipPath>
        </defs>

        {weather === 'sunny' && (
          <g>
            <g className="animate-sun-shimmer">
              <polygon points="60,20 91,20 120,93 80,93" fill="url(#ghibli-sunbeam)" />
              <polygon points="57,26 73,26 91,93 66,93" fill="url(#ghibli-sunbeam)" />
            </g>
            {/* Cozy golden sunlit dust motes floating lazily in the warm beam */}
            <g fill="#FFF7CC">
              {GOLDEN_MOTES.map((m, idx) => (
                <circle
                  key={idx}
                  cx={m.cx}
                  cy={m.cy}
                  r={m.r}
                  className="animate-mote"
                  style={{ animationDelay: m.delay, animationDuration: m.dur }}
                />
              ))}
            </g>
          </g>
        )}

        {weather === 'rainy' && (
          <g clipPath="url(#panoramic-window-clip)">
            <rect x="57.2" y="20.0" width="49.5" height="51.2" fill="url(#rain-window-tint)" />
            <g stroke="#E5F3FF" strokeWidth="0.52" strokeLinecap="round">
              {RAIN_STREAKS.map((drop, idx) => (
                <line
                  key={idx}
                  className="animate-rain"
                  style={{
                    animationDelay: drop.delay,
                    animationDuration: drop.dur,
                  }}
                  x1={drop.x}
                  y1={18}
                  x2={drop.x - 1.8}
                  y2={27}
                />
              ))}
            </g>
            {/* Shimmering raindrops on window glass */}
            <g fill="#EEF8FF" opacity="0.86">
              <circle cx="64.5" cy="40" r="0.62" />
              <circle cx="76.5" cy="54" r="0.68" />
              <circle cx="91.5" cy="37" r="0.56" />
              <circle cx="100" cy="57" r="0.64" />
              <circle cx="71.5" cy="64" r="0.54" />
              <circle cx="85.5" cy="47" r="0.52" />
            </g>
          </g>
        )}

        {weather === 'snowy' && (
          <g clipPath="url(#panoramic-window-clip)">
            <rect x="57.2" y="20.0" width="49.5" height="51.2" fill="url(#snow-window-tint)" />
            {/* Soft frosted snow sill along bottom of panes */}
            <ellipse cx="82" cy="70.8" rx="25" ry="2.4" fill="#FFFFFF" opacity="0.58" />
            <g fill="#FFFFFF">
              {SNOWFLAKES.map((flake, idx) => (
                <circle
                  key={idx}
                  className="animate-snow"
                  style={{
                    animationDelay: flake.delay,
                    animationDuration: flake.dur,
                  }}
                  cx={flake.x}
                  cy={19}
                  r={flake.size * 0.16}
                />
              ))}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
});
