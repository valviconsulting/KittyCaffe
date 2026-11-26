import React from 'react';
import type { WeatherType } from '../../types/game';

interface WindowWeatherOverlayProps {
  weather: WeatherType;
}

const RAIN_STREAKS = [
  { x: 40.5, delay: '0s', dur: '1.05s' },
  { x: 43, delay: '0.35s', dur: '1.22s' },
  { x: 45.5, delay: '0.15s', dur: '1.08s' },
  { x: 48, delay: '0.6s', dur: '1.18s' },
  { x: 50.5, delay: '0.25s', dur: '1.14s' },
  { x: 53, delay: '0.75s', dur: '1.28s' },
  { x: 55.5, delay: '0.45s', dur: '1.06s' },
  { x: 58, delay: '0.88s', dur: '1.2s' },
  { x: 44.2, delay: '0.92s', dur: '1.16s' },
  { x: 54.2, delay: '0.08s', dur: '1.25s' },
];

const SNOWFLAKES = [
  { x: 40.5, size: 5, delay: '0s', dur: '4.1s' },
  { x: 43, size: 3.5, delay: '1.2s', dur: '4.7s' },
  { x: 45.5, size: 5.5, delay: '0.5s', dur: '3.9s' },
  { x: 48, size: 4, delay: '2.1s', dur: '4.4s' },
  { x: 50.5, size: 5, delay: '0.9s', dur: '4.2s' },
  { x: 53, size: 3.5, delay: '1.7s', dur: '4.9s' },
  { x: 55.5, size: 5.2, delay: '0.3s', dur: '4.0s' },
  { x: 58, size: 4.2, delay: '2.5s', dur: '4.5s' },
  { x: 46.5, size: 3.5, delay: '3.0s', dur: '4.6s' },
  { x: 54, size: 4.5, delay: '2.7s', dur: '4.3s' },
];

const GOLDEN_MOTES = [
  { cx: 45, cy: 36, r: 0.42, delay: '0s', dur: '5.2s' },
  { cx: 52, cy: 48, r: 0.52, delay: '1.1s', dur: '6.0s' },
  { cx: 48.5, cy: 62, r: 0.36, delay: '2.3s', dur: '4.8s' },
  { cx: 57, cy: 58, r: 0.45, delay: '0.7s', dur: '5.8s' },
  { cx: 43, cy: 54, r: 0.35, delay: '3.1s', dur: '5.5s' },
  { cx: 61, cy: 70, r: 0.4, delay: '1.8s', dur: '6.2s' },
  { cx: 34, cy: 42, r: 0.32, delay: '2.6s', dur: '5.6s' },
  { cx: 68, cy: 44, r: 0.34, delay: '0.4s', dur: '6.4s' },
];

/**
 * Adds lush Studio Ghibli atmospheric depth:
 * - Warm honey-amber pools from overhead pendant lamps (extra snug when rainy/snowy!)
 * - Soft storybook golden edge vignette framing the interior naturally
 * - Sunbeams + lazy drifting golden dust motes when sunny, crisp rain/snow outside the window
 */
export const WindowWeatherOverlay: React.FC<WindowWeatherOverlayProps> = ({
  weather,
}) => {
  const lampStrength = weather === 'sunny' ? 0.32 : 0.44;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle warm honey vignette grounding corners & framing the sunny center */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 76% 84% at 50% 48%, transparent 56%, rgba(88, 48, 22, 0.16) 100%)',
        }}
      />

      {/* Lush golden-amber light pools from overhead hanging lamps & warm interior bounce */}
      <div
        className="animate-sun-shimmer absolute inset-x-0 top-0 h-[58%]"
        style={{
          backgroundImage: `radial-gradient(ellipse 34% 72% at 50% 18%, rgba(255, 206, 102, ${lampStrength}) 0%, rgba(255, 184, 78, 0.12) 55%, transparent 100%), radial-gradient(ellipse 24% 52% at 22% 14%, rgba(255, 214, 128, 0.22) 0%, transparent 100%), radial-gradient(ellipse 24% 52% at 78% 14%, rgba(255, 214, 128, 0.22) 0%, transparent 100%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Focused window weather atmosphere + drifting sunlit dust motes */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="ghibli-sunbeam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF1AD" stopOpacity="0.48" />
            <stop offset="55%" stopColor="#FFDE82" stopOpacity="0.18" />
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
          {/* Matches the central wooden window panes of the 21:9 panoramic bg-cafe.png */}
          <clipPath id="panoramic-window-clip">
            <rect x="38.8" y="10" width="22.4" height="69" rx="1.5" />
          </clipPath>
        </defs>

        {weather === 'sunny' && (
          <g>
            <g className="animate-sun-shimmer">
              <polygon points="42.5,12 56.5,12 73,96 52,96" fill="url(#ghibli-sunbeam)" />
              <polygon points="39,18 46.5,18 55.5,96 41,96" fill="url(#ghibli-sunbeam)" />
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
            <rect x="38.8" y="10" width="22.4" height="69" fill="url(#rain-window-tint)" />
            <g stroke="#E5F3FF" strokeWidth="0.44" strokeLinecap="round">
              {RAIN_STREAKS.map((drop, idx) => (
                <line
                  key={idx}
                  className="animate-rain"
                  style={{
                    animationDelay: drop.delay,
                    animationDuration: drop.dur,
                  }}
                  x1={drop.x}
                  y1={12}
                  x2={drop.x - 1.3}
                  y2={22}
                />
              ))}
            </g>
            {/* Shimmering raindrops on window glass */}
            <g fill="#EEF8FF" opacity="0.86">
              <circle cx="42" cy="40" r="0.52" />
              <circle cx="47.5" cy="56" r="0.58" />
              <circle cx="54.5" cy="36" r="0.46" />
              <circle cx="57.5" cy="60" r="0.54" />
              <circle cx="44.5" cy="68" r="0.45" />
              <circle cx="52" cy="48" r="0.42" />
            </g>
          </g>
        )}

        {weather === 'snowy' && (
          <g clipPath="url(#panoramic-window-clip)">
            <rect x="38.8" y="10" width="22.4" height="69" fill="url(#snow-window-tint)" />
            {/* Soft frosted snow sill along bottom of panes */}
            <ellipse cx="50" cy="79" rx="13" ry="3.2" fill="#FFFFFF" opacity="0.58" />
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
                  cy={12}
                  r={flake.size * 0.14}
                />
              ))}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
