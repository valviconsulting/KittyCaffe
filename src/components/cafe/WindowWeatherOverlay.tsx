import React from 'react';
import type { WeatherType } from '../../types/game';
import { resolveCafeLightingMood } from '../../utils/atmosphere';

interface WindowWeatherOverlayProps {
  weather: WeatherType;
  servedToday?: number;
  guestsTarget?: number;
  isLateAfternoon?: boolean;
  isDayComplete?: boolean;
}

const RAIN_STREAKS = [
  { x: 56.5, delay: '0s', dur: '1.05s' },
  { x: 60.5, delay: '0.35s', dur: '1.22s' },
  { x: 64.5, delay: '0.15s', dur: '1.08s' },
  { x: 68.5, delay: '0.6s', dur: '1.18s' },
  { x: 72.5, delay: '0.25s', dur: '1.14s' },
  { x: 76.5, delay: '0.75s', dur: '1.28s' },
  { x: 80.5, delay: '0.45s', dur: '1.06s' },
  { x: 84.5, delay: '0.88s', dur: '1.2s' },
  { x: 88.5, delay: '0.52s', dur: '1.12s' },
  { x: 92.2, delay: '0.92s', dur: '1.16s' },
  { x: 78.5, delay: '0.08s', dur: '1.25s' },
];

const SNOWFLAKES = [
  { x: 57.0, size: 5.2, delay: '0s', dur: '4.1s' },
  { x: 61.2, size: 3.8, delay: '1.2s', dur: '4.7s' },
  { x: 65.5, size: 5.8, delay: '0.5s', dur: '3.9s' },
  { x: 69.8, size: 4.3, delay: '2.1s', dur: '4.4s' },
  { x: 74.0, size: 5.4, delay: '0.9s', dur: '4.2s' },
  { x: 78.2, size: 3.9, delay: '1.7s', dur: '4.9s' },
  { x: 82.5, size: 5.5, delay: '0.3s', dur: '4.0s' },
  { x: 86.8, size: 4.6, delay: '2.5s', dur: '4.5s' },
  { x: 91.2, size: 4.0, delay: '1.5s', dur: '4.3s' },
  { x: 67.5, size: 3.8, delay: '3.0s', dur: '4.6s' },
  { x: 80.5, size: 4.8, delay: '2.7s', dur: '4.3s' },
];

const GOLDEN_MOTES = [
  { cx: 68, cy: 36, r: 0.52, delay: '0s', dur: '5.2s' },
  { cx: 79, cy: 46, r: 0.62, delay: '1.1s', dur: '6.0s' },
  { cx: 73, cy: 58, r: 0.46, delay: '2.3s', dur: '4.8s' },
  { cx: 88, cy: 54, r: 0.56, delay: '0.7s', dur: '5.8s' },
  { cx: 64, cy: 52, r: 0.44, delay: '3.1s', dur: '5.5s' },
  { cx: 94, cy: 65, r: 0.5, delay: '1.8s', dur: '6.2s' },
  { cx: 56, cy: 42, r: 0.42, delay: '2.6s', dur: '5.6s' },
  { cx: 108, cy: 44, r: 0.46, delay: '0.4s', dur: '6.4s' },
];

/** Warm fairy-light sparkle points locked 1:1 to painted ceiling bulbs in bg-cafe.webp (168×93.8) */
const FAIRY_GLINTS = [
  { cx: 36.2, cy: 7.4, delay: '0s' },
  { cx: 48.8, cy: 8.6, delay: '0.8s' },
  { cx: 73.0, cy: 7.2, delay: '1.5s' },
  { cx: 86.2, cy: 8.2, delay: '0.4s' },
  { cx: 108.5, cy: 7.6, delay: '1.1s' },
  { cx: 124.2, cy: 8.0, delay: '1.9s' },
];

/**
 * Wave C Atmosphere & Lighting Director (60 FPS pure-alpha, zero mix-blend-mode):
 * - 5 cozy day-arc & weather lighting moods: morning_fresh, afternoon_golden,
 *   evening_amber, rainy_sanctuary, snowy_hearth.
 * - Lamp halos & fairy-light glints locked 1:1 to bg-cafe.webp (168×93.8 xMidYMid slice)
 *   so light stays anchored on the actual painted lamps across every phone & desktop aspect ratio!
 */
export const WindowWeatherOverlay: React.FC<WindowWeatherOverlayProps> = React.memo(
  ({
    weather,
    servedToday = 0,
    guestsTarget = 5,
    isLateAfternoon = false,
    isDayComplete = false,
  }) => {
    const lighting = resolveCafeLightingMood({
      weather,
      servedToday,
      guestsTarget,
      isLateAfternoon,
      isDayComplete,
    });

    return (
      <div
        data-lighting-mood={lighting.mood}
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle atmospheric room wash adapting across morning / afternoon / evening / rain / snow */}
        {lighting.roomWashGradient && (
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{ backgroundImage: lighting.roomWashGradient }}
          />
        )}

        {/* Soft cozy vignette framing corners without ever darkening the interior */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(ellipse 76% 84% at 50% 48%, transparent 56%, rgba(88, 48, 22, ${lighting.vignetteOpacity}) 100%)`,
          }}
        />

        {/* Focused 1:1 locked lighting halos, fairy glints, sunbeams & window weather */}
        <svg
          viewBox="0 0 168 93.8"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="ghibli-sunbeam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF2B4" stopOpacity={lighting.sunbeamOpacity} />
              <stop offset="55%" stopColor="#FFDE82" stopOpacity={lighting.sunbeamOpacity * 0.34} />
              <stop offset="100%" stopColor="#FFF1AD" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="window-sunset-tint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFAD6E" stopOpacity={lighting.windowSunsetOpacity} />
              <stop offset="65%" stopColor="#FFCB82" stopOpacity={lighting.windowSunsetOpacity * 0.65} />
              <stop offset="100%" stopColor="#FFE1A8" stopOpacity={lighting.windowSunsetOpacity * 0.35} />
            </linearGradient>
            <linearGradient id="rain-window-tint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#466E94" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#779FBE" stopOpacity="0.24" />
            </linearGradient>
            <linearGradient id="snow-window-tint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#88B0D6" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#DCEBF8" stopOpacity="0.24" />
            </linearGradient>
            <radialGradient id="amber-lamp-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF0B8" stopOpacity="0.65" />
              <stop offset="42%" stopColor="#FFCA6A" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FFB84D" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sconce-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF2C2" stopOpacity="0.62" />
              <stop offset="48%" stopColor="#FFD07A" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#FFC062" stopOpacity="0" />
            </radialGradient>
            {/* Exact multi-pane wooden window glass of detailed bg-cafe.webp (1680×938) */}
            <clipPath id="panoramic-window-clip">
              <rect x="54.2" y="22.0" width="40.6" height="44.6" rx="0.5" />
            </clipPath>
          </defs>

          {/* Warm sunset-apricot sky wash inside window panes on late afternoon / evening */}
          {lighting.windowSunsetOpacity > 0 && (
            <g clipPath="url(#panoramic-window-clip)">
              <rect
                x="54.2"
                y="21.2"
                width="40.6"
                height="45.4"
                fill="url(#window-sunset-tint)"
              />
            </g>
          )}

          {/* Pixel-locked warm glow halos directly over painted pendant lamps & brass wall sconce */}
          <g className="animate-lamp-pulse">
            <circle
              cx="112.5"
              cy="32.2"
              r="18"
              fill="url(#amber-lamp-halo)"
              opacity={lighting.pendantGlow}
            />
            <circle
              cx="119.0"
              cy="19.5"
              r="16"
              fill="url(#amber-lamp-halo)"
              opacity={lighting.pendantGlow * 0.92}
            />
            <circle
              cx="27.2"
              cy="28.2"
              r="11.5"
              fill="url(#sconce-halo)"
              opacity={lighting.sconceGlow}
            />
          </g>

          {/* Subtle warm twinkle glints along painted ceiling fairy lights (brighter at rain/snow/evening) */}
          {lighting.fairyTwinkleOpacity > 0.2 && (
            <g opacity={lighting.fairyTwinkleOpacity}>
              {FAIRY_GLINTS.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="1.15"
                  fill="#FFF6C8"
                  className="animate-twinkle"
                  style={{
                    animationDelay: pt.delay,
                    transformOrigin: `${pt.cx}px ${pt.cy}px`,
                  }}
                />
              ))}
            </g>
          )}

          {weather === 'sunny' && (
            <g>
              <g className="animate-sun-shimmer">
                <polygon points="56,21 86,21 112,93 74,93" fill="url(#ghibli-sunbeam)" />
                <polygon points="54,28 69,28 86,93 62,93" fill="url(#ghibli-sunbeam)" />
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
              <rect x="53.5" y="20.6" width="41.7" height="46.2" fill="url(#rain-window-tint)" />
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
                    y1={19}
                    x2={drop.x - 1.8}
                    y2={28}
                  />
                ))}
              </g>
              {/* Shimmering raindrops on window glass */}
              <g fill="#EEF8FF" opacity="0.86">
                <circle cx="59.5" cy="37" r="0.58" />
                <circle cx="69.5" cy="51" r="0.64" />
                <circle cx="81.5" cy="34" r="0.54" />
                <circle cx="90.5" cy="54" r="0.6" />
                <circle cx="65.5" cy="61" r="0.52" />
                <circle cx="78.0" cy="45" r="0.48" />
              </g>
            </g>
          )}

          {weather === 'snowy' && (
            <g clipPath="url(#panoramic-window-clip)">
              <rect x="53.5" y="20.6" width="41.7" height="46.2" fill="url(#snow-window-tint)" />
              {/* Soft frosted snow sill along bottom of panes */}
              <ellipse cx="74.4" cy="66.5" rx="20.5" ry="2.1" fill="#FFFFFF" opacity="0.56" />
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
  }
);
