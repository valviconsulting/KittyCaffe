import React from 'react';
import type { BirthdayThemeId } from '../../types/game';

const INK = '#5A3E32';

interface BirthdayDecorOverlaySvgProps {
  theme: BirthdayThemeId;
  /** 1 = top festive garland, 2 = garland + counter centerpiece, 3 = full party + gentle confetti */
  level: 1 | 2 | 3;
}

/**
 * Real themed Studio Ghibli-inspired watercolor birthday decor for Puff's Party!
 * Strictly pointer-events-none so it never blocks clicks or overlaps guest faces/UI.
 */
export const BirthdayDecorOverlaySvg: React.FC<BirthdayDecorOverlaySvgProps> = ({
  theme,
  level,
}) => {
  return (
    <>
      {/* TOP GARLAND BUNTING (Level 1, 2, 3) */}
      <div
        data-birthday-decor={theme}
        className="pointer-events-none absolute inset-x-0 top-0 z-[12] h-14 sm:h-16 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 900 76"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          {/* Warm dark-brown watercolor twine */}
          <path
            d="M0 10 Q225 46 450 16 Q675 46 900 10"
            fill="none"
            stroke={theme === 'forest' ? '#4C8558' : '#7B543A'}
            strokeWidth={theme === 'forest' ? '3.4' : '2.4'}
            strokeLinecap="round"
          />

          {/* THEME 1: STRAWBERRY BUNTING */}
          {theme === 'strawberry' && (
            <g>
              {[
                { x: 92, y: 23, c: '#F8AFC4', berry: true },
                { x: 175, y: 31, c: '#FFF7E8', berry: false },
                { x: 260, y: 31, c: '#F38AA8', berry: true },
                { x: 350, y: 24, c: '#FFF7E8', berry: false },
                { x: 450, y: 17, c: '#F38AA8', berry: true },
                { x: 550, y: 24, c: '#FFF7E8', berry: false },
                { x: 640, y: 31, c: '#F8AFC4', berry: true },
                { x: 725, y: 31, c: '#FFF7E8', berry: false },
                { x: 808, y: 23, c: '#F38AA8', berry: true },
              ].map((flag, idx) => (
                <g key={idx} transform={`translate(${flag.x}, ${flag.y})`}>
                  <path
                    d="M-19 0 L19 0 L0 31 Z"
                    fill={flag.c}
                    stroke={INK}
                    strokeWidth="1.9"
                    strokeLinejoin="round"
                  />
                  {flag.berry ? (
                    <g transform="translate(0, 12)">
                      <path
                        d="M0 -4 C5 -4 6 3 0 8 C-6 3 -5 -4 0 -4 Z"
                        fill="#E84E73"
                        stroke={INK}
                        strokeWidth="1.2"
                      />
                      <path
                        d="M-4 -4 L0 -7 L4 -4"
                        fill="#63A86E"
                        stroke="#3B7246"
                        strokeWidth="1"
                      />
                      <circle cx="-1.5" cy="0" r="0.8" fill="#FFF3C4" />
                      <circle cx="1.8" cy="1.5" r="0.8" fill="#FFF3C4" />
                    </g>
                  ) : (
                    <circle cx="0" cy="11" r="3.4" fill="#F29DB6" />
                  )}
                </g>
              ))}
            </g>
          )}

          {/* THEME 2: SPACE BUNTING */}
          {theme === 'space' && (
            <g>
              {[
                { x: 92, y: 23, c: '#5B5491', icon: 'star' },
                { x: 175, y: 31, c: '#BFAEE6', icon: 'planet' },
                { x: 260, y: 31, c: '#F8D87A', icon: 'moon' },
                { x: 350, y: 24, c: '#5B5491', icon: 'star' },
                { x: 450, y: 17, c: '#6E63A6', icon: 'rocket' },
                { x: 550, y: 24, c: '#5B5491', icon: 'star' },
                { x: 640, y: 31, c: '#F8D87A', icon: 'moon' },
                { x: 725, y: 31, c: '#BFAEE6', icon: 'planet' },
                { x: 808, y: 23, c: '#5B5491', icon: 'star' },
              ].map((flag, idx) => (
                <g key={idx} transform={`translate(${flag.x}, ${flag.y})`}>
                  <path
                    d="M-19 0 L19 0 L0 31 Z"
                    fill={flag.c}
                    stroke={INK}
                    strokeWidth="1.9"
                    strokeLinejoin="round"
                  />
                  {flag.icon === 'star' && (
                    <path
                      d="M0 5 L2.1 10 L7.2 10.6 L3.4 14 L4.4 19 L0 16.4 L-4.4 19 L-3.4 14 L-7.2 10.6 L-2.1 10 Z"
                      fill="#FFE27A"
                    />
                  )}
                  {flag.icon === 'planet' && (
                    <g transform="translate(0, 12)">
                      <ellipse
                        cx="0"
                        cy="0"
                        rx="9"
                        ry="2.6"
                        transform="rotate(-18)"
                        fill="none"
                        stroke="#FBE28A"
                        strokeWidth="1.8"
                      />
                      <circle cx="0" cy="0" r="4.6" fill="#F29E74" stroke={INK} strokeWidth="1.1" />
                    </g>
                  )}
                  {flag.icon === 'moon' && (
                    <path
                      d="M2 6 A5.5 5.5 0 1 0 2 17 A4.2 4.2 0 1 1 2 6 Z"
                      fill="#5A4B8A"
                    />
                  )}
                  {flag.icon === 'rocket' && (
                    <g transform="translate(0, 13)">
                      <path
                        d="M0 -8 C4 -4 4 3 0 6 C-4 3 -4 -4 0 -8 Z"
                        fill="#FFF8EC"
                        stroke={INK}
                        strokeWidth="1.2"
                      />
                      <circle cx="0" cy="-1.5" r="2" fill="#8CCAE8" />
                      <path d="M-2.2 5 L0 9.5 L2.2 5 Z" fill="#F4A04B" />
                    </g>
                  )}
                </g>
              ))}
            </g>
          )}

          {/* THEME 3: FOREST FAIRYTALE BUNTING */}
          {theme === 'forest' && (
            <g>
              {[
                { x: 92, y: 23, c: '#7AB887', icon: 'mushroom' },
                { x: 175, y: 31, c: '#FAF0D6', icon: 'leaf' },
                { x: 260, y: 31, c: '#A3CE9F', icon: 'acorn' },
                { x: 350, y: 24, c: '#FAF0D6', icon: 'mushroom' },
                { x: 450, y: 17, c: '#7AB887', icon: 'leaf' },
                { x: 550, y: 24, c: '#FAF0D6', icon: 'mushroom' },
                { x: 640, y: 31, c: '#A3CE9F', icon: 'acorn' },
                { x: 725, y: 31, c: '#FAF0D6', icon: 'leaf' },
                { x: 808, y: 23, c: '#7AB887', icon: 'mushroom' },
              ].map((flag, idx) => (
                <g key={idx} transform={`translate(${flag.x}, ${flag.y})`}>
                  <path
                    d="M-19 0 L19 0 L0 31 Z"
                    fill={flag.c}
                    stroke={INK}
                    strokeWidth="1.9"
                    strokeLinejoin="round"
                  />
                  {flag.icon === 'mushroom' && (
                    <g transform="translate(0, 12)">
                      <rect x="-2.2" y="0" width="4.4" height="6" rx="1.5" fill="#FFF7E8" stroke={INK} strokeWidth="1" />
                      <path d="M-7 1 C-7 -6 7 -6 7 1 Z" fill="#E3626C" stroke={INK} strokeWidth="1.2" />
                      <circle cx="-2.4" cy="-2" r="1.1" fill="#FFFDF8" />
                      <circle cx="2.5" cy="-1.5" r="1.1" fill="#FFFDF8" />
                    </g>
                  )}
                  {flag.icon === 'leaf' && (
                    <path
                      d="M0 5 C5 8 5 15 0 18 C-5 15 -5 8 0 5 Z"
                      fill="#4B8F5D"
                      stroke="#2E633D"
                      strokeWidth="1"
                    />
                  )}
                  {flag.icon === 'acorn' && (
                    <g transform="translate(0, 12)">
                      <ellipse cx="0" cy="2" rx="4.4" ry="5" fill="#D59A5B" stroke={INK} strokeWidth="1.1" />
                      <path d="M-5.2 -1 Q0 -5 5.2 -1 Z" fill="#8C5932" stroke={INK} strokeWidth="1.1" />
                    </g>
                  )}
                </g>
              ))}
            </g>
          )}

          {/* LEVEL 3 FINALE: GENTLE WATERCOLOR CONFETTI SPARKLES */}
          {level === 3 && (
            <g opacity="0.82">
              {[
                { cx: 56, cy: 48, r: 4, c: theme === 'space' ? '#FBE282' : '#F48CA8' },
                { cx: 145, cy: 56, r: 3.5, c: theme === 'forest' ? '#82C290' : '#F6C868' },
                { cx: 310, cy: 52, r: 3.5, c: theme === 'space' ? '#B8A2E8' : '#96CFA6' },
                { cx: 590, cy: 52, r: 3.5, c: theme === 'forest' ? '#E8737D' : '#F49BB4' },
                { cx: 760, cy: 56, r: 3.5, c: theme === 'space' ? '#8CC8E8' : '#F6CC6E' },
                { cx: 848, cy: 48, r: 4, c: theme === 'forest' ? '#F2CA66' : '#E77B9B' },
              ].map((dot, idx) => (
                <circle
                  key={idx}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={dot.r}
                  fill={dot.c}
                  className="animate-twinkle"
                  style={{ animationDelay: `${idx * 0.35}s` }}
                />
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* STAGE 2 & 3 COUNTER CENTERPIECE (Desktop/Tablet right beside the counter edge — zero overlap!) */}
      {level >= 2 && (
        <div
          className="pointer-events-none hidden md:block absolute bottom-8 lg:bottom-9 left-[20%] xl:left-[20.5%] z-20 drop-shadow-[0_4px_6px_rgba(68,38,18,0.28)]"
          aria-hidden="true"
        >
          {theme === 'strawberry' && (
            <svg viewBox="0 0 56 56" className="h-12 w-12">
              <ellipse cx="28" cy="50" rx="18" ry="4" fill="#4A2B14" opacity="0.25" />
              <path d="M22 48 L34 48 L31 41 L25 41 Z" fill="#FFF8EE" stroke={INK} strokeWidth="2" />
              <ellipse cx="28" cy="40" rx="18" ry="4.5" fill="#FFFDF8" stroke={INK} strokeWidth="2" />
              <rect x="15" y="25" width="26" height="14" rx="4" fill="#FAD2DF" stroke={INK} strokeWidth="2" />
              <path d="M15 28 Q21 33 28 28 Q35 33 41 28 L41 24 L15 24 Z" fill="#FFFDF9" stroke={INK} strokeWidth="1.6" />
              <path d="M28 11 C34 11 35 20 28 24 C21 20 22 11 28 11 Z" fill="#E84E73" stroke={INK} strokeWidth="1.8" />
              <path d="M23 12 L28 8 L33 12" fill="#63A86E" stroke="#3B7246" strokeWidth="1.4" />
            </svg>
          )}

          {theme === 'space' && (
            <svg viewBox="0 0 56 56" className="h-12 w-12">
              <ellipse cx="28" cy="50" rx="15" ry="3.5" fill="#4A2B14" opacity="0.28" />
              <circle cx="28" cy="30" r="17" fill="#FFE89C" opacity="0.32" />
              <rect x="17" y="18" width="22" height="28" rx="7" fill="#4F4987" stroke={INK} strokeWidth="2.2" />
              <path d="M31 23 A8 8 0 1 0 31 39 A6.2 6.2 0 1 1 31 23 Z" fill="#FFE17D" />
              <circle cx="33" cy="27" r="1.6" fill="#FFFDF8" />
              <circle cx="34" cy="35" r="1.3" fill="#FFFDF8" />
              <path d="M21 18 Q28 10 35 18" fill="none" stroke="#C89B4C" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          )}

          {theme === 'forest' && (
            <svg viewBox="0 0 56 56" className="h-12 w-12">
              <ellipse cx="28" cy="50" rx="18" ry="4" fill="#4A2B14" opacity="0.28" />
              <rect x="14" y="32" width="28" height="16" rx="4" fill="#B57E4F" stroke={INK} strokeWidth="2.2" />
              <ellipse cx="28" cy="32" rx="14" ry="4" fill="#E7C69C" stroke={INK} strokeWidth="1.8" />
              {/* Cozy glowing candle on woodland stump */}
              <rect x="24" y="19" width="8" height="13" rx="2" fill="#FFF8E6" stroke={INK} strokeWidth="1.6" />
              <path d="M28 10 C31 14 31 18 28 19 C25 18 25 14 28 10 Z" fill="#FFBE4F" stroke="#C86A1E" strokeWidth="1.2" />
              {/* Tiny cute woodland mushroom beside stump */}
              <rect x="38" y="42" width="4" height="6" rx="1.5" fill="#FFF7E8" stroke={INK} strokeWidth="1.2" />
              <path d="M34 43 C34 36 46 36 46 43 Z" fill="#E3626C" stroke={INK} strokeWidth="1.4" />
            </svg>
          )}
        </div>
      )}
    </>
  );
};
