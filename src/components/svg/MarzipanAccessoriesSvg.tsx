import React from 'react';
import type { MarzipanAccessoryId, MarzipanEquipped } from '../../types/game';

const INK = '#5A3E32';

/**
 * Overlaid directly inside an `aspect-[8/7]` wrapper matching `cat-marzipan.png` (640x560).
 * Because both the PNG and this SVG share the exact 640x560 coordinate box,
 * accessories stay locked to Marzipan's head, eyes, and neck at every viewport size.
 */
export const MarzipanAccessoriesOverlaySvg: React.FC<{
  equipped: MarzipanEquipped;
  className?: string;
}> = ({ equipped, className = 'pointer-events-none absolute inset-0 h-full w-full overflow-visible' }) => {
  if (!equipped.head && !equipped.eyes && !equipped.neck) {
    return null;
  }

  return (
    <svg
      viewBox="0 0 640 560"
      className={className}
      aria-hidden="true"
    >
      {/* NECK SLOT: Knitted Scarf OR Velvet Red Bow-Tie */}
      {equipped.neck === 'knit_scarf' && (
        <g transform="translate(232, 354) rotate(-26) scale(0.70)">
          {/* Soft contact shadow under scarf */}
          <ellipse cx="0" cy="14" rx="108" ry="26" fill="#4A2A14" opacity="0.2" />
          {/* Trailing fringed tail draped cozily down right side */}
          <g transform="translate(64, 10) rotate(22)">
            <rect
              x="-24"
              y="0"
              width="52"
              height="88"
              rx="14"
              fill="#9FD1B1"
              stroke={INK}
              strokeWidth="7"
            />
            <rect x="-20" y="20" width="44" height="14" fill="#FAF2E1" />
            <rect x="-20" y="48" width="44" height="14" fill="#F2B8C7" />
            {/* Cozy knitted fringe */}
            <g stroke={INK} strokeWidth="5.5" strokeLinecap="round">
              <line x1="-14" y1="88" x2="-16" y2="104" />
              <line x1="-2" y1="88" x2="-3" y2="106" />
              <line x1="10" y1="88" x2="10" y2="106" />
              <line x1="22" y1="88" x2="24" y2="104" />
            </g>
          </g>
          {/* Main cozy wrapped neck loop */}
          <path
            d="M-108 -10 Q0 28 106 -12 Q118 14 102 36 Q0 70 -104 34 Q-118 12 -108 -10 Z"
            fill="#A6D7B8"
            stroke={INK}
            strokeWidth="7.5"
            strokeLinejoin="round"
          />
          {/* Stripes & soft knit texture */}
          <path
            d="M-66 4 Q-64 26 -58 42 M-22 14 Q-20 34 -16 50 M24 14 Q26 34 22 50 M68 2 Q70 22 64 38"
            fill="none"
            stroke="#FAF2E1"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M-44 9 Q-42 29 -38 46 M46 9 Q48 29 44 45"
            fill="none"
            stroke="#F2A9BC"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {equipped.neck === 'red_bowtie' && (
        <g transform="translate(232, 358) rotate(-26) scale(0.68)">
          <ellipse cx="0" cy="14" rx="52" ry="18" fill="#4A2A14" opacity="0.22" />
          {/* Left & Right velvet ribbon wings */}
          <path
            d="M-58 -24 C-66 -4 -66 12 -56 26 L-8 8 L-8 -8 Z"
            fill="#E35D74"
            stroke={INK}
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <path
            d="M58 -24 C66 -4 66 12 56 26 L8 8 L8 -8 Z"
            fill="#E35D74"
            stroke={INK}
            strokeWidth="7"
            strokeLinejoin="round"
          />
          {/* Subtle highlight folds */}
          <path d="M-42 -8 L-18 -2 M-42 10 L-18 5" stroke="#FAD0D8" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M42 -8 L18 -2 M42 10 L18 5" stroke="#FAD0D8" strokeWidth="4.5" strokeLinecap="round" />
          {/* Center knot */}
          <rect
            x="-15"
            y="-15"
            width="30"
            height="30"
            rx="10"
            fill="#C9445B"
            stroke={INK}
            strokeWidth="7"
          />
        </g>
      )}

      {/* EYES SLOT: Pink Heart-Shaped Watercolor Sunglasses */}
      {equipped.eyes === 'heart_glasses' && (
        <g transform="translate(193, 294) rotate(-24) scale(0.72)">
          {/* Center bridge & side temples */}
          <path
            d="M-112 -14 L-88 -8 M88 -8 L110 -14"
            stroke="#C94C72"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M-16 -6 Q0 -18 16 -6"
            fill="none"
            stroke="#C94C72"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          {/* Left Heart Lens */}
          <g transform="translate(-52, 0)">
            <path
              d="M0 32 C0 32 -38 8 -38 -12 C-38 -28 -25 -36 -13 -34 C-5 -33 0 -25 0 -20 C0 -25 5 -33 13 -34 C25 -36 38 -28 38 -12 C38 8 0 32 0 32 Z"
              fill="#F89CB8"
              fillOpacity="0.82"
              stroke="#B43E63"
              strokeWidth="7.5"
              strokeLinejoin="round"
            />
            <path
              d="M-24 -16 Q-20 -24 -10 -22"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
          {/* Right Heart Lens */}
          <g transform="translate(52, 0)">
            <path
              d="M0 32 C0 32 -38 8 -38 -12 C-38 -28 -25 -36 -13 -34 C-5 -33 0 -25 0 -20 C0 -25 5 -33 13 -34 C25 -36 38 -28 38 -12 C38 8 0 32 0 32 Z"
              fill="#F89CB8"
              fillOpacity="0.82"
              stroke="#B43E63"
              strokeWidth="7.5"
              strokeLinejoin="round"
            />
            <path
              d="M-24 -16 Q-20 -24 -10 -22"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
        </g>
      )}

      {/* HEAD SLOT: Chef Hat OR Golden Crown */}
      {equipped.head === 'chef_hat' && (
        <g transform="translate(154, 174) rotate(-24) scale(0.72)">
          {/* Soft shadow on forehead */}
          <ellipse cx="0" cy="24" rx="70" ry="14" fill="#5A3E32" opacity="0.16" />
          {/* Fluffy triple-cloud toque top */}
          <path
            d="M-66 -4 C-92 -12 -96 -62 -62 -76 C-56 -112 -18 -122 0 -108 C18 -122 56 -112 62 -76 C96 -62 92 -12 66 -4 Z"
            fill="#FFFDF9"
            stroke={INK}
            strokeWidth="7.5"
            strokeLinejoin="round"
          />
          {/* Subtle watercolor pleats */}
          <path
            d="M-30 -16 Q-34 -56 -22 -76 M0 -16 Q0 -60 0 -86 M30 -16 Q34 -56 22 -76"
            fill="none"
            stroke="#DFD0BE"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Hat headband */}
          <path
            d="M-66 -12 Q0 2 66 -12 L62 24 Q0 36 -62 24 Z"
            fill="#F9EFE0"
            stroke={INK}
            strokeWidth="7.5"
            strokeLinejoin="round"
          />
          <path
            d="M-58 8 Q0 20 58 8"
            fill="none"
            stroke="#E598AE"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      )}

      {equipped.head === 'gold_crown' && (
        <g transform="translate(154, 178) rotate(-24) scale(0.70)">
          <ellipse cx="0" cy="22" rx="64" ry="13" fill="#5A3E32" opacity="0.18" />
          <path
            d="M-62 18 L-72 -44 L-28 -10 L0 -64 L28 -10 L72 -44 L62 18 Q0 30 -62 18 Z"
            fill="#F8CF58"
            stroke={INK}
            strokeWidth="7.5"
            strokeLinejoin="round"
          />
          {/* Glossy golden wash */}
          <path
            d="M-54 8 Q0 18 54 8"
            fill="none"
            stroke="#FFF2B8"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Top crown pearls */}
          <circle cx="-72" cy="-50" r="9" fill="#FFF7D4" stroke={INK} strokeWidth="5.5" />
          <circle cx="0" cy="-70" r="11" fill="#FFF7D4" stroke={INK} strokeWidth="5.5" />
          <circle cx="72" cy="-50" r="9" fill="#FFF7D4" stroke={INK} strokeWidth="5.5" />
          {/* Jewels */}
          <circle cx="0" cy="-6" r="11" fill="#EC6F90" stroke={INK} strokeWidth="5" />
          <circle cx="-36" cy="2" r="8" fill="#7AC89D" stroke={INK} strokeWidth="4.5" />
          <circle cx="36" cy="2" r="8" fill="#7AC89D" stroke={INK} strokeWidth="4.5" />
        </g>
      )}
    </svg>
  );
};

/** Standalone square watercolor icon for Shop wardrobe cards */
export const AccessoryPreviewSvg: React.FC<{
  accessoryId: MarzipanAccessoryId;
  className?: string;
}> = ({ accessoryId, className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    {accessoryId === 'chef_hat' && (
      <g transform="translate(32, 42) scale(0.32)">
        <path
          d="M-66 -4 C-92 -12 -96 -62 -62 -76 C-56 -112 -18 -122 0 -108 C18 -122 56 -112 62 -76 C96 -62 92 -12 66 -4 Z"
          fill="#FFFDF9"
          stroke={INK}
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path
          d="M-66 -12 Q0 2 66 -12 L62 24 Q0 36 -62 24 Z"
          fill="#F9EFE0"
          stroke={INK}
          strokeWidth="8"
        />
        <path d="M-56 8 Q0 18 56 8" fill="none" stroke="#E598AE" strokeWidth="7" strokeLinecap="round" />
      </g>
    )}
    {accessoryId === 'heart_glasses' && (
      <g transform="translate(32, 34) scale(0.27)">
        <path d="M-16 -6 Q0 -18 16 -6" fill="none" stroke="#C94C72" strokeWidth="9" strokeLinecap="round" />
        <g transform="translate(-52, 0)">
          <path
            d="M0 32 C0 32 -38 8 -38 -12 C-38 -28 -25 -36 -13 -34 C-5 -33 0 -25 0 -20 C0 -25 5 -33 13 -34 C25 -36 38 -28 38 -12 C38 8 0 32 0 32 Z"
            fill="#F89CB8"
            stroke="#B43E63"
            strokeWidth="9"
          />
        </g>
        <g transform="translate(52, 0)">
          <path
            d="M0 32 C0 32 -38 8 -38 -12 C-38 -28 -25 -36 -13 -34 C-5 -33 0 -25 0 -20 C0 -25 5 -33 13 -34 C25 -36 38 -28 38 -12 C38 8 0 32 0 32 Z"
            fill="#F89CB8"
            stroke="#B43E63"
            strokeWidth="9"
          />
        </g>
      </g>
    )}
    {accessoryId === 'red_bowtie' && (
      <g transform="translate(32, 32) scale(0.38)">
        <path d="M-58 -24 C-66 -4 -66 12 -56 26 L-8 8 L-8 -8 Z" fill="#E35D74" stroke={INK} strokeWidth="7" />
        <path d="M58 -24 C66 -4 66 12 56 26 L8 8 L8 -8 Z" fill="#E35D74" stroke={INK} strokeWidth="7" />
        <rect x="-15" y="-15" width="30" height="30" rx="10" fill="#C9445B" stroke={INK} strokeWidth="7" />
      </g>
    )}
    {accessoryId === 'knit_scarf' && (
      <g transform="translate(30, 26) scale(0.24)">
        <g transform="translate(58, 12) rotate(14)">
          <rect x="-24" y="0" width="52" height="86" rx="14" fill="#9FD1B1" stroke={INK} strokeWidth="9" />
          <rect x="-20" y="24" width="44" height="16" fill="#FAF2E1" />
          <rect x="-20" y="52" width="44" height="14" fill="#F2B8C7" />
        </g>
        <path
          d="M-98 -10 Q0 28 98 -12 Q110 14 94 36 Q0 70 -94 34 Q-108 12 -98 -10 Z"
          fill="#A6D7B8"
          stroke={INK}
          strokeWidth="9"
        />
      </g>
    )}
    {accessoryId === 'gold_crown' && (
      <g transform="translate(32, 42) scale(0.32)">
        <path
          d="M-62 18 L-72 -44 L-28 -10 L0 -64 L28 -10 L72 -44 L62 18 Q0 30 -62 18 Z"
          fill="#F8CF58"
          stroke={INK}
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <circle cx="0" cy="-6" r="12" fill="#EC6F90" stroke={INK} strokeWidth="6" />
        <circle cx="-36" cy="2" r="9" fill="#7AC89D" stroke={INK} strokeWidth="5.5" />
        <circle cx="36" cy="2" r="9" fill="#7AC89D" stroke={INK} strokeWidth="5.5" />
      </g>
    )}
  </svg>
);
