import React from 'react';
import type { WeatherType } from '../../types/game';

interface WindowWeatherOverlayProps {
  weather: WeatherType;
  isLateAfternoon?: boolean;
}

const RAIN_STREAKS = [
  { x: 36.2, delay: '0s', dur: '1.05s' },
  { x: 39.0, delay: '0.35s', dur: '1.22s' },
  { x: 42.0, delay: '0.15s', dur: '1.08s' },
  { x: 45.2, delay: '0.6s', dur: '1.18s' },
  { x: 48.5, delay: '0.25s', dur: '1.14s' },
  { x: 51.8, delay: '0.75s', dur: '1.28s' },
  { x: 55.0, delay: '0.45s', dur: '1.06s' },
  { x: 58.2, delay: '0.88s', dur: '1.2s' },
  { x: 61.2, delay: '0.52s', dur: '1.12s' },
  { x: 43.6, delay: '0.92s', dur: '1.16s' },
  { x: 53.4, delay: '0.08s', dur: '1.25s' },
];

const SNOWFLAKES = [
  { x: 36.5, size: 5, delay: '0s', dur: '4.1s' },
  { x: 39.5, size: 3.5, delay: '1.2s', dur: '4.7s' },
  { x: 42.8, size: 5.5, delay: '0.5s', dur: '3.9s' },
  { x: 46.0, size: 4, delay: '2.1s', dur: '4.4s' },
  { x: 49.2, size: 5, delay: '0.9s', dur: '4.2s' },
  { x: 52.5, size: 3.5, delay: '1.7s', dur: '4.9s' },
  { x: 55.8, size: 5.2, delay: '0.3s', dur: '4.0s' },
  { x: 59.0, size: 4.2, delay: '2.5s', dur: '4.5s' },
  { x: 61.5, size: 3.8, delay: '1.5s', dur: '4.3s' },
  { x: 44.5, size: 3.5, delay: '3.0s', dur: '4.6s' },
  { x: 54.0, size: 4.5, delay: '2.7s', dur: '4.3s' },
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
  isLateAfternoon = false,
}) => {
  const baseLampStrength = weather === 'sunny' ? 0.32 : 0.44;
  const lampStrength = isLateAfternoon ? baseLampStrength + 0.08 : baseLampStrength;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      aria-hidden="true"
    >
      {/* Gentle late-afternoon golden-peach sunset wash as the final guest of the day arrives */}
      {isLateAfternoon && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(255, 166, 92, 0.16) 0%, rgba(235, 132, 98, 0.1) 55%, rgba(164, 96, 86, 0.08) 100%)',
            mixBlendMode: 'soft-light',
          }}
        />
      )}
      {/* Subtle warm honey vignette grounding corners & framing the sunny center */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 76% 84% at 50% 48%, transparent 56%, rgba(88, 48, 22, 0.16) 100%)',
        }}
      />

      {/* Lush golden-amber light pools aligned with the 3 hanging pendant lamps & warm window bounce */}
      <div
        className="animate-sun-shimmer absolute inset-x-0 top-0 h-[58%]"
        style={{
          backgroundImage: `radial-gradient(ellipse 24% 62% at 67% 20%, rgba(255, 206, 102, ${lampStrength}) 0%, rgba(255, 184, 78, 0.14) 55%, transparent 100%), radial-gradient(ellipse 28% 58% at 48% 30%, rgba(255, 224, 148, 0.18) 0%, transparent 100%)`,
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
          {/* Matches the central wooden window panes of the gouache bg-cafe.webp */}
          <clipPath id="panoramic-window-clip">
            <rect x="34.0" y="13.5" width="29.5" height="64.5" rx="0.8" />
          </clipPath>
        </defs>

        {weather === 'sunny' && (
          <g>
            <g className="animate-sun-shimmer">
              <polygon points="36,14 54,14 72,96 48,96" fill="url(#ghibli-sunbeam)" />
              <polygon points="34,20 43,20 54,96 39,96" fill="url(#ghibli-sunbeam)" />
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
            <rect x="34.0" y="13.5" width="29.5" height="64.5" fill="url(#rain-window-tint)" />
            <g stroke="#E5F3FF" strokeWidth="0.42" strokeLinecap="round">
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
              <circle cx="38.5" cy="40" r="0.52" />
              <circle cx="45.5" cy="56" r="0.58" />
              <circle cx="54.5" cy="36" r="0.46" />
              <circle cx="59.5" cy="60" r="0.54" />
              <circle cx="42.5" cy="68" r="0.45" />
              <circle cx="51" cy="48" r="0.42" />
            </g>
          </g>
        )}

        {weather === 'snowy' && (
          <g clipPath="url(#panoramic-window-clip)">
            <rect x="34.0" y="13.5" width="29.5" height="64.5" fill="url(#snow-window-tint)" />
            {/* Soft frosted snow sill along bottom of panes */}
            <ellipse cx="48.75" cy="77.8" rx="15" ry="2.6" fill="#FFFFFF" opacity="0.58" />
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
