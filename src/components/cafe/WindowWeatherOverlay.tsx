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

/**
 * Adds warm amber pendant-lamp glow and crisp dimensional weather effects
 * strictly aligned to the central wooden window of our panoramic `bg-cafe.png`
 * without ever washing out the rich watercolor interior colors.
 */
export const WindowWeatherOverlay: React.FC<WindowWeatherOverlayProps> = ({
  weather,
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      aria-hidden="true"
    >
      {/* Warm golden amber glow from the 3 overhead pendant lamps & fairy lights */}
      <div
        className="animate-sun-shimmer absolute inset-x-0 top-0 h-[48%]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 30% 65% at 50% 18%, rgba(255, 208, 102, 0.28) 0%, rgba(255, 190, 86, 0.08) 55%, transparent 100%), radial-gradient(ellipse 20% 45% at 24% 8%, rgba(255, 218, 132, 0.16) 0%, transparent 100%), radial-gradient(ellipse 20% 45% at 76% 8%, rgba(255, 218, 132, 0.16) 0%, transparent 100%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Focused window weather atmosphere (sunbeams / cozy rainy blue glow / snowy frost) */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="ghibli-sunbeam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFEFA8" stopOpacity="0.42" />
            <stop offset="60%" stopColor="#FFE082" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FFEFA8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rain-window-tint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F779B" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#7DA2BE" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="snow-window-tint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8EB4D6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#DCEAF7" stopOpacity="0.22" />
          </linearGradient>
          {/* Matches the central wooden window panes of the 21:9 panoramic bg-cafe.png */}
          <clipPath id="panoramic-window-clip">
            <rect x="38.8" y="10" width="22.4" height="69" rx="1.5" />
          </clipPath>
        </defs>

        {weather === 'sunny' && (
          <g className="animate-sun-shimmer">
            <polygon points="43,12 56,12 72,96 52,96" fill="url(#ghibli-sunbeam)" />
            <polygon points="39,18 46,18 55,96 41,96" fill="url(#ghibli-sunbeam)" />
          </g>
        )}

        {weather === 'rainy' && (
          <g clipPath="url(#panoramic-window-clip)">
            <rect x="38.8" y="10" width="22.4" height="69" fill="url(#rain-window-tint)" />
            <g stroke="#E3F2FD" strokeWidth="0.42" strokeLinecap="round">
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
            <g fill="#EEF7FF" opacity="0.82">
              <circle cx="42" cy="40" r="0.5" />
              <circle cx="47.5" cy="56" r="0.56" />
              <circle cx="54.5" cy="36" r="0.46" />
              <circle cx="57.5" cy="60" r="0.52" />
              <circle cx="44.5" cy="68" r="0.45" />
              <circle cx="52" cy="48" r="0.42" />
            </g>
          </g>
        )}

        {weather === 'snowy' && (
          <g clipPath="url(#panoramic-window-clip)">
            <rect x="38.8" y="10" width="22.4" height="69" fill="url(#snow-window-tint)" />
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
