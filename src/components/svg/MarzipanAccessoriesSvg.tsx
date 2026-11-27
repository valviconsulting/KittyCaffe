import React, { useId } from 'react';
import type { MarzipanAccessoryId, MarzipanEquipped } from '../../types/game';

const INK = '#634333';

/**
 * Overlaid directly inside an `aspect-[8/7]` wrapper matching `cat-marzipan.png` (640x560).
 * Styled with soft gouache gradients, subtle fabric/velvet/gold folds, and slender warm contours
 * so accessories sit naturally on Marzipan's painted fur at every viewport size.
 */
export const MarzipanAccessoriesOverlaySvg: React.FC<{
  equipped: MarzipanEquipped;
  className?: string;
}> = ({
  equipped,
  className = 'pointer-events-none absolute inset-0 h-full w-full overflow-visible',
}) => {
  const uid = useId().replace(/:/g, '');

  if (!equipped.head && !equipped.eyes && !equipped.neck) {
    return null;
  }

  return (
    <svg viewBox="0 0 640 560" className={className} aria-hidden="true">
      <defs>
        {/* Knitted sage wool scarf gradient */}
        <linearGradient id={`ma-scarf-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8E0C5" />
          <stop offset="55%" stopColor="#8EC2A0" />
          <stop offset="100%" stopColor="#6C9E7E" />
        </linearGradient>
        {/* Plush burgundy-rose velvet bow tie gradient */}
        <linearGradient id={`ma-bow-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EC7288" />
          <stop offset="50%" stopColor="#C9465E" />
          <stop offset="100%" stopColor="#942C41" />
        </linearGradient>
        {/* Translucent rose-tinted heart lens gradient */}
        <linearGradient id={`ma-lens-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFC8DA" stopOpacity="0.86" />
          <stop offset="55%" stopColor="#EE82A4" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#C95378" stopOpacity="0.82" />
        </linearGradient>
        {/* Soft starched linen chef toque gradient */}
        <linearGradient id={`ma-chef-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="62%" stopColor="#FAF2E4" />
          <stop offset="100%" stopColor="#E4D2BA" />
        </linearGradient>
        {/* Brushed warm antique-gold crown gradient */}
        <linearGradient id={`ma-gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF0A8" />
          <stop offset="48%" stopColor="#F2C04B" />
          <stop offset="100%" stopColor="#C48924" />
        </linearGradient>
      </defs>

      {/* NECK SLOT: Knitted Wool Scarf OR Velvet Red Bow-Tie */}
      {equipped.neck === 'knit_scarf' && (
        <g transform="translate(232, 354) rotate(-26) scale(0.70)">
          {/* Soft contact shadow on ginger fur */}
          <ellipse cx="0" cy="20" rx="112" ry="26" fill="#4A250E" opacity="0.24" />
          {/* Trailing fringed tail draped cozily down right side */}
          <g transform="translate(64, 10) rotate(22)">
            <rect
              x="-24"
              y="0"
              width="52"
              height="88"
              rx="14"
              fill={`url(#ma-scarf-${uid})`}
              stroke={INK}
              strokeWidth="4.2"
            />
            <rect x="-21" y="20" width="46" height="13" fill="#FAF0DF" opacity="0.92" />
            <rect x="-21" y="48" width="46" height="12" fill="#EEB1C1" opacity="0.92" />
            {/* Knitted rib stitches */}
            <g stroke="#5E8C6F" strokeWidth="3" strokeLinecap="round" opacity="0.55">
              <line x1="-10" y1="6" x2="-10" y2="82" strokeDasharray="6 6" />
              <line x1="2" y1="6" x2="2" y2="82" strokeDasharray="6 6" />
              <line x1="14" y1="6" x2="14" y2="82" strokeDasharray="6 6" />
            </g>
            {/* Cozy knitted fringe */}
            <g stroke={INK} strokeWidth="4.2" strokeLinecap="round">
              <line x1="-14" y1="88" x2="-16" y2="104" />
              <line x1="-2" y1="88" x2="-3" y2="106" />
              <line x1="10" y1="88" x2="10" y2="106" />
              <line x1="22" y1="88" x2="24" y2="104" />
            </g>
          </g>
          {/* Main cozy wrapped neck loop */}
          <path
            d="M-108 -10 Q0 28 106 -12 Q118 14 102 36 Q0 70 -104 34 Q-118 12 -108 -10 Z"
            fill={`url(#ma-scarf-${uid})`}
            stroke={INK}
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Woven wool stripes & knit texture */}
          <path
            d="M-66 4 Q-64 26 -58 42 M-22 14 Q-20 34 -16 50 M24 14 Q26 34 22 50 M68 2 Q70 22 64 38"
            fill="none"
            stroke="#FAF2E1"
            strokeWidth="7.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M-44 9 Q-42 29 -38 46 M46 9 Q48 29 44 45"
            fill="none"
            stroke="#EDA3B7"
            strokeWidth="5.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Subtle top sunlit wool highlight */}
          <path
            d="M-92 -2 Q0 28 92 -4"
            fill="none"
            stroke="#E7F6EC"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.58"
          />
        </g>
      )}

      {equipped.neck === 'red_bowtie' && (
        <g transform="translate(232, 358) rotate(-26) scale(0.68)">
          <ellipse cx="0" cy="18" rx="56" ry="18" fill="#4A250E" opacity="0.26" />
          {/* Left & Right velvet ribbon wings */}
          <path
            d="M-58 -24 C-66 -4 -66 12 -56 26 L-8 8 L-8 -8 Z"
            fill={`url(#ma-bow-${uid})`}
            stroke={INK}
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          <path
            d="M58 -24 C66 -4 66 12 56 26 L8 8 L8 -8 Z"
            fill={`url(#ma-bow-${uid})`}
            stroke={INK}
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          {/* Velvet sheen & inner crease shadows */}
          <path d="M-45 -10 L-16 -3" stroke="#FAD0D8" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
          <path d="M-42 12 L-16 6" stroke="#7E2034" strokeWidth="3.8" strokeLinecap="round" opacity="0.55" />
          <path d="M45 -10 L16 -3" stroke="#FAD0D8" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
          <path d="M42 12 L16 6" stroke="#7E2034" strokeWidth="3.8" strokeLinecap="round" opacity="0.55" />
          {/* Center pinched velvet knot */}
          <rect
            x="-15"
            y="-15"
            width="30"
            height="30"
            rx="10"
            fill="#B53850"
            stroke={INK}
            strokeWidth="4.2"
          />
          <path d="M-6 -9 Q0 -11 6 -9" fill="none" stroke="#F6BAC6" strokeWidth="3.2" strokeLinecap="round" opacity="0.7" />
        </g>
      )}

      {/* EYES SLOT: Rose-Tinted Heart Sunglasses with Glass Specular Glare */}
      {equipped.eyes === 'heart_glasses' && (
        <g transform="translate(193, 294) rotate(-24) scale(0.72)">
          {/* Soft bridge shadow on fur */}
          <ellipse cx="-52" cy="14" rx="34" ry="14" fill="#4A250E" opacity="0.18" />
          <ellipse cx="52" cy="14" rx="34" ry="14" fill="#4A250E" opacity="0.18" />
          {/* Slender rose-gold wire temples & bridge */}
          <path
            d="M-112 -14 L-88 -8 M88 -8 L110 -14"
            stroke="#B6496A"
            strokeWidth="4.8"
            strokeLinecap="round"
          />
          <path
            d="M-16 -6 Q0 -18 16 -6"
            fill="none"
            stroke="#B6496A"
            strokeWidth="5.2"
            strokeLinecap="round"
          />
          {/* Left Heart Lens */}
          <g transform="translate(-52, 0)">
            <path
              d="M0 32 C0 32 -38 8 -38 -12 C-38 -28 -25 -36 -13 -34 C-5 -33 0 -25 0 -20 C0 -25 5 -33 13 -34 C25 -36 38 -28 38 -12 C38 8 0 32 0 32 Z"
              fill={`url(#ma-lens-${uid})`}
              stroke="#9D3556"
              strokeWidth="4.8"
              strokeLinejoin="round"
            />
            <path
              d="M-24 -16 Q-20 -24 -10 -22"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="5.2"
              strokeLinecap="round"
              opacity="0.88"
            />
            <path
              d="M-18 6 L12 -22"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.34"
            />
          </g>
          {/* Right Heart Lens */}
          <g transform="translate(52, 0)">
            <path
              d="M0 32 C0 32 -38 8 -38 -12 C-38 -28 -25 -36 -13 -34 C-5 -33 0 -25 0 -20 C0 -25 5 -33 13 -34 C25 -36 38 -28 38 -12 C38 8 0 32 0 32 Z"
              fill={`url(#ma-lens-${uid})`}
              stroke="#9D3556"
              strokeWidth="4.8"
              strokeLinejoin="round"
            />
            <path
              d="M-24 -16 Q-20 -24 -10 -22"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="5.2"
              strokeLinecap="round"
              opacity="0.88"
            />
            <path
              d="M-18 6 L12 -22"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.34"
            />
          </g>
        </g>
      )}

      {/* HEAD SLOT: Starched Linen Chef Toque OR Brushed-Gold Crown */}
      {equipped.head === 'chef_hat' && (
        <g transform="translate(154, 174) rotate(-24) scale(0.72)">
          {/* Soft warm contact shadow on forehead fur */}
          <ellipse cx="0" cy="26" rx="70" ry="15" fill="#4A250E" opacity="0.22" />
          {/* Fluffy triple-cloud pleated linen toque */}
          <path
            d="M-66 -4 C-92 -12 -96 -62 -62 -76 C-56 -112 -18 -122 0 -108 C18 -122 56 -112 62 -76 C96 -62 92 -12 66 -4 Z"
            fill={`url(#ma-chef-${uid})`}
            stroke={INK}
            strokeWidth="4.4"
            strokeLinejoin="round"
          />
          {/* Soft fabric pleats & sunlit left highlight */}
          <path
            d="M-30 -16 Q-34 -56 -22 -76 M0 -16 Q0 -60 0 -86 M30 -16 Q34 -56 22 -76"
            fill="none"
            stroke="#D6C2AA"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M-60 -60 C-50 -92 -24 -104 -8 -98"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Tailored headband with dusty-rose piping */}
          <path
            d="M-66 -12 Q0 2 66 -12 L62 24 Q0 36 -62 24 Z"
            fill="#F7EBD8"
            stroke={INK}
            strokeWidth="4.4"
            strokeLinejoin="round"
          />
          <path
            d="M-58 8 Q0 20 58 8"
            fill="none"
            stroke="#E28FA6"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {equipped.head === 'gold_crown' && (
        <g transform="translate(154, 178) rotate(-24) scale(0.70)">
          <ellipse cx="0" cy="24" rx="64" ry="14" fill="#4A250E" opacity="0.24" />
          <path
            d="M-62 18 L-72 -44 L-28 -10 L0 -64 L28 -10 L72 -44 L62 18 Q0 30 -62 18 Z"
            fill={`url(#ma-gold-${uid})`}
            stroke={INK}
            strokeWidth="4.4"
            strokeLinejoin="round"
          />
          {/* Brushed gold rim sheen */}
          <path
            d="M-54 8 Q0 18 54 8"
            fill="none"
            stroke="#FFF6CA"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Lustrous crown pearls */}
          <circle cx="-72" cy="-50" r="9" fill="#FFF8DC" stroke={INK} strokeWidth="3.6" />
          <circle cx="0" cy="-70" r="11" fill="#FFF8DC" stroke={INK} strokeWidth="3.6" />
          <circle cx="72" cy="-50" r="9" fill="#FFF8DC" stroke={INK} strokeWidth="3.6" />
          {/* Faceted ruby & emerald cabochon jewels */}
          <circle cx="0" cy="-6" r="11" fill="#E3597E" stroke={INK} strokeWidth="3.4" />
          <circle cx="-3.5" cy="-9.5" r="3" fill="#FFD2DF" opacity="0.85" />
          <circle cx="-36" cy="2" r="8" fill="#6EC093" stroke={INK} strokeWidth="3.2" />
          <circle cx="-38.5" cy="-0.5" r="2.2" fill="#D4F7E2" opacity="0.85" />
          <circle cx="36" cy="2" r="8" fill="#6EC093" stroke={INK} strokeWidth="3.2" />
          <circle cx="33.5" cy="-0.5" r="2.2" fill="#D4F7E2" opacity="0.85" />
        </g>
      )}
    </svg>
  );
};

/** Standalone square icon for Shop wardrobe cards */
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
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M-66 -12 Q0 2 66 -12 L62 24 Q0 36 -62 24 Z"
          fill="#F9EFE0"
          stroke={INK}
          strokeWidth="6"
        />
        <path d="M-56 8 Q0 18 56 8" fill="none" stroke="#E598AE" strokeWidth="6" strokeLinecap="round" />
      </g>
    )}
    {accessoryId === 'heart_glasses' && (
      <g transform="translate(32, 34) scale(0.27)">
        <path d="M-16 -6 Q0 -18 16 -6" fill="none" stroke="#B6496A" strokeWidth="7" strokeLinecap="round" />
        <g transform="translate(-52, 0)">
          <path
            d="M0 32 C0 32 -38 8 -38 -12 C-38 -28 -25 -36 -13 -34 C-5 -33 0 -25 0 -20 C0 -25 5 -33 13 -34 C25 -36 38 -28 38 -12 C38 8 0 32 0 32 Z"
            fill="#F89CB8"
            stroke="#9D3556"
            strokeWidth="7"
          />
        </g>
        <g transform="translate(52, 0)">
          <path
            d="M0 32 C0 32 -38 8 -38 -12 C-38 -28 -25 -36 -13 -34 C-5 -33 0 -25 0 -20 C0 -25 5 -33 13 -34 C25 -36 38 -28 38 -12 C38 8 0 32 0 32 Z"
            fill="#F89CB8"
            stroke="#9D3556"
            strokeWidth="7"
          />
        </g>
      </g>
    )}
    {accessoryId === 'red_bowtie' && (
      <g transform="translate(32, 32) scale(0.38)">
        <path d="M-58 -24 C-66 -4 -66 12 -56 26 L-8 8 L-8 -8 Z" fill="#D9536B" stroke={INK} strokeWidth="5.5" />
        <path d="M58 -24 C66 -4 66 12 56 26 L8 8 L8 -8 Z" fill="#D9536B" stroke={INK} strokeWidth="5.5" />
        <rect x="-15" y="-15" width="30" height="30" rx="10" fill="#B53850" stroke={INK} strokeWidth="5.5" />
      </g>
    )}
    {accessoryId === 'knit_scarf' && (
      <g transform="translate(30, 26) scale(0.24)">
        <g transform="translate(58, 12) rotate(14)">
          <rect x="-24" y="0" width="52" height="86" rx="14" fill="#92C5A4" stroke={INK} strokeWidth="7" />
          <rect x="-20" y="24" width="44" height="16" fill="#FAF2E1" />
          <rect x="-20" y="52" width="44" height="14" fill="#F2B8C7" />
        </g>
        <path
          d="M-98 -10 Q0 28 98 -12 Q110 14 94 36 Q0 70 -94 34 Q-108 12 -98 -10 Z"
          fill="#9FD0B0"
          stroke={INK}
          strokeWidth="7"
        />
      </g>
    )}
    {accessoryId === 'gold_crown' && (
      <g transform="translate(32, 42) scale(0.32)">
        <path
          d="M-62 18 L-72 -44 L-28 -10 L0 -64 L28 -10 L72 -44 L62 18 Q0 30 -62 18 Z"
          fill="#F5C650"
          stroke={INK}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="0" cy="-6" r="12" fill="#E3597E" stroke={INK} strokeWidth="4.5" />
        <circle cx="-36" cy="2" r="9" fill="#6EC093" stroke={INK} strokeWidth="4.2" />
        <circle cx="36" cy="2" r="9" fill="#6EC093" stroke={INK} strokeWidth="4.2" />
      </g>
    )}
  </svg>
);
