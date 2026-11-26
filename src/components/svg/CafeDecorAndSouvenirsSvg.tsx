import React from 'react';
import type { CafeDecorId, RegularGuestId } from '../../types/game';

const INK = '#5A3E32';

/** Shop Decor 1: Cozy Sage Bud Vase with Chamomile Daisies on Counter */
export const DaisyVaseSvg: React.FC<{ className?: string }> = ({
  className = 'h-12 w-10',
}) => (
  <svg viewBox="0 0 48 62" className={className} aria-hidden="true">
    <ellipse cx="24" cy="56" rx="12" ry="3.2" fill="#4A2B14" opacity="0.32" />
    <path d="M24 35 Q23 22 25 13 M22 35 Q16 25 14 19" fill="none" stroke="#4D8A5A" strokeWidth="2.4" strokeLinecap="round" />
    <ellipse cx="16" cy="27" rx="5.5" ry="2.8" transform="rotate(-28 16 27)" fill="#6FA97B" stroke="#3D6B48" strokeWidth="1.2" />
    <ellipse cx="30" cy="24" rx="5" ry="2.6" transform="rotate(24 30 24)" fill="#7EB88A" stroke="#3D6B48" strokeWidth="1.2" />
    {/* Main chamomile daisy */}
    <g transform="translate(26, 12)">
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle
          key={deg}
          cx="0"
          cy="-5.4"
          r="3.1"
          transform={`rotate(${deg})`}
          fill="#FFFDF8"
          stroke="#8C6B54"
          strokeWidth="0.8"
        />
      ))}
      <circle cx="0" cy="0" r="3.5" fill="#F2C45A" stroke="#A87924" strokeWidth="1" />
    </g>
    {/* Tiny second side daisy */}
    <g transform="translate(13, 18) scale(0.72)">
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle
          key={deg}
          cx="0"
          cy="-5.2"
          r="3"
          transform={`rotate(${deg})`}
          fill="#FFFDF8"
          stroke="#8C6B54"
          strokeWidth="0.9"
        />
      ))}
      <circle cx="0" cy="0" r="3.4" fill="#F2C45A" stroke="#A87924" strokeWidth="1" />
    </g>
    {/* Sage ceramic vase */}
    <path
      d="M18 33 L30 33 L28 38 C34 41 35 51 29 55 L19 55 C13 51 14 41 20 38 Z"
      fill="#A6CEB3"
      stroke={INK}
      strokeWidth="2.1"
      strokeLinejoin="round"
    />
    <ellipse cx="21" cy="46" rx="2.2" ry="4.2" fill="#E3F4E8" opacity="0.65" />
  </svg>
);

/** Shop Decor 2: Twinkling Golden Watercolor Stars along top café garland */
export const TwinkleStarsGarlandSvg: React.FC<{ className?: string }> = ({
  className = 'pointer-events-none absolute inset-x-0 top-0 z-[12] w-full h-14 sm:h-16',
}) => (
  <svg
    viewBox="0 0 900 72"
    preserveAspectRatio="none"
    className={className}
    aria-hidden="true"
  >
    {/* Subtle delicate gold twine swag */}
    <path
      d="M0 8 Q225 46 450 18 Q675 46 900 8"
      fill="none"
      stroke="#C99646"
      strokeWidth="2.2"
      strokeDasharray="4 3"
      opacity="0.72"
    />
    {[
      { x: 110, y: 24, s: 1.0, delay: '0s' },
      { x: 225, y: 36, s: 1.2, delay: '0.5s' },
      { x: 345, y: 26, s: 0.95, delay: '1.1s' },
      { x: 450, y: 24, s: 1.15, delay: '0.3s' },
      { x: 560, y: 28, s: 0.95, delay: '1.4s' },
      { x: 675, y: 36, s: 1.2, delay: '0.7s' },
      { x: 790, y: 24, s: 1.0, delay: '1.2s' },
    ].map((st, idx) => (
      <g
        key={idx}
        transform={`translate(${st.x}, ${st.y}) scale(${st.s})`}
        className="animate-twinkle"
        style={{ animationDelay: st.delay, transformOrigin: `${st.x}px ${st.y}px` }}
      >
        <circle cx="0" cy="0" r="15" fill="#FFE796" opacity="0.34" />
        <path
          d="M0 -11 L3.2 -3.4 L11 -2.4 L5.2 3.1 L6.6 11 L0 7.2 L-6.6 11 L-5.2 3.1 L-11 -2.4 L-3.2 -3.4 Z"
          fill="#FCE07A"
          stroke="#9E6E24"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </g>
    ))}
  </svg>
);

/** Shop Decor 3: Cozy Wooden Cat-Shaped Wall Clock with swinging tail pendulum */
export const CatWallClockSvg: React.FC<{ className?: string }> = ({
  className = 'h-16 w-12',
}) => (
  <svg viewBox="0 0 64 88" className={className} aria-hidden="true">
    {/* Gently swinging cat-tail pendulum */}
    <g
      className="animate-clock-pendulum"
      style={{ transformOrigin: '32px 54px' }}
    >
      <path
        d="M32 54 Q30 70 36 80"
        fill="none"
        stroke="#A46B3D"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="36" cy="81" r="4.5" fill="#F2CA69" stroke={INK} strokeWidth="1.6" />
    </g>
    {/* Cat ears on wooden clock body */}
    <path d="M14 22 L12 7 L26 15 Z" fill="#D99F66" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M50 22 L52 7 L38 15 Z" fill="#D99F66" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M16 19 L15 11 L23 16 Z" fill="#F4C5D0" />
    <path d="M48 19 L49 11 L41 16 Z" fill="#F4C5D0" />
    {/* Clock wooden body */}
    <circle cx="32" cy="36" r="22" fill="#D99F66" stroke={INK} strokeWidth="2.6" />
    {/* Warm cream clock face */}
    <circle cx="32" cy="36" r="16.5" fill="#FFFBF2" stroke="#9B693D" strokeWidth="1.8" />
    {/* Hour dots */}
    <circle cx="32" cy="23" r="1.5" fill={INK} />
    <circle cx="45" cy="36" r="1.5" fill={INK} />
    <circle cx="32" cy="49" r="1.5" fill={INK} />
    <circle cx="19" cy="36" r="1.5" fill={INK} />
    {/* Hands */}
    <line x1="32" y1="36" x2="32" y2="27" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    <line x1="32" y1="36" x2="39" y2="39" stroke="#C8637B" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="36" r="2.2" fill={INK} />
  </svg>
);

/** Shop Decor 4: Cozy Walnut Music Box with floating musical notes when playing */
export const MusicBoxCounterSvg: React.FC<{
  isPlaying?: boolean;
  className?: string;
}> = ({ isPlaying = false, className = 'h-10 w-12' }) => (
  <svg viewBox="0 0 64 54" className={className} aria-hidden="true">
    {/* Soft shadow */}
    <ellipse cx="30" cy="48" rx="22" ry="4" fill="#4A2B14" opacity="0.28" />
    {/* Floating notes when playing */}
    {isPlaying && (
      <g fill="#E97E9E" fontWeight="700" fontSize="13">
        <text x="16" y="13" className="animate-zzz-1">♪</text>
        <text x="36" y="11" className="animate-zzz-2">♫</text>
      </g>
    )}
    {/* Open lid tilted back */}
    <path d="M12 24 L18 12 L46 12 L44 24 Z" fill="#C98A55" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
    {/* Tiny golden spinning star inside box */}
    <circle cx="29" cy="21" r="4" fill="#F8D264" stroke={INK} strokeWidth="1.4" />
    {/* Walnut wooden box body */}
    <rect x="10" y="24" width="38" height="22" rx="5" fill="#B57544" stroke={INK} strokeWidth="2.4" />
    <rect x="15" y="29" width="28" height="12" rx="3" fill="#E8C69B" stroke="#7E4F2C" strokeWidth="1.4" />
    <circle cx="29" cy="35" r="2.4" fill="#E98BA5" />
    {/* Brass winding crank on right */}
    <path d="M48 35 L56 35 L56 28" fill="none" stroke="#E5B74C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="56" cy="27" r="3" fill="#F6D574" stroke={INK} strokeWidth="1.5" />
  </svg>
);

/** Shop Decor card preview dispatcher */
export const DecorPreviewSvg: React.FC<{
  decorId: CafeDecorId;
  className?: string;
}> = ({ decorId, className = 'h-12 w-12' }) => {
  switch (decorId) {
    case 'daisy_vase':
      return <DaisyVaseSvg className={className} />;
    case 'twinkle_stars':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path d="M6 22 Q32 38 58 22" fill="none" stroke="#C99646" strokeWidth="2.4" strokeDasharray="3 3" />
          <path
            d="M32 14 L35.5 23 L45 24 L37.8 30 L39.8 39 L32 34.4 L24.2 39 L26.2 30 L19 24 L28.5 23 Z"
            fill="#FCE07A"
            stroke="#9E6E24"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="26" r="4" fill="#FCE07A" stroke="#9E6E24" strokeWidth="1.6" />
          <circle cx="49" cy="26" r="4" fill="#FCE07A" stroke="#9E6E24" strokeWidth="1.6" />
        </svg>
      );
    case 'cat_clock':
      return <CatWallClockSvg className={className} />;
    case 'music_box':
      return <MusicBoxCounterSvg isPlaying={true} className={className} />;
  }
};

/** Best-Friend & Traveler Cat Cozy Shelf/Counter Souvenirs (watercolor mini-SVGs) */
export type SouvenirKey = RegularGuestId | 'pinecone';

export const SouvenirSvg: React.FC<{
  souvenirId: SouvenirKey;
  className?: string;
}> = ({ souvenirId, className = 'h-8 w-8' }) => {
  switch (souvenirId) {
    case 'puh':
      // 🧶 Pink Yarn Ball
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <ellipse cx="22" cy="38" rx="12" ry="3" fill="#4A2B14" opacity="0.22" />
          <path d="M32 34 Q40 36 41 30" fill="none" stroke="#E57B98" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="21" cy="23" r="13.5" fill="#F6AFC3" stroke={INK} strokeWidth="2.1" />
          <path d="M11 17 Q22 23 31 15 M9 25 Q22 29 34 22 M14 33 Q24 27 32 31" fill="none" stroke="#D16886" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'persyk':
      // 🍂 Framed Golden Autumn Leaf
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <rect x="7" y="6" width="30" height="33" rx="4" fill="#C98D56" stroke={INK} strokeWidth="2.2" />
          <rect x="11" y="10" width="22" height="25" rx="2" fill="#FFF9EE" stroke="#9B6739" strokeWidth="1.3" />
          <path
            d="M22 14 L25 19 L30 18 L27 23 L30 26 L23 26 L22 31 L21 26 L14 26 L17 23 L14 18 L19 19 Z"
            fill="#E99A44"
            stroke="#9B5518"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'luna':
      // 🔮 Lavender Crystal Star Charm
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <line x1="22" y1="2" x2="22" y2="11" stroke="#C89B4C" strokeWidth="2" />
          <circle cx="22" cy="24" r="12" fill="#DEC7F4" fillOpacity="0.65" stroke="#855EAB" strokeWidth="1.8" />
          <path
            d="M22 14 L24.6 20.4 L31.5 21.2 L26.2 25.8 L27.8 32.5 L22 29 L16.2 32.5 L17.8 25.8 L12.5 21.2 L19.4 20.4 Z"
            fill="#FCE283"
            stroke="#9C6E22"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'marsel':
      // ☕ Vintage Porcelain Teacup
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <ellipse cx="21" cy="35" rx="15" ry="4" fill="#FFFDF8" stroke="#9E8272" strokeWidth="1.8" />
          <path d="M31 19 C38 19 38 29 30 29" fill="none" stroke="#C9A258" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M10 17 L32 17 L29 31 Q28 34 21 34 Q14 34 13 31 Z" fill="#FFFDF8" stroke={INK} strokeWidth="2" />
          <path d="M12 22 Q21 25 30 22" fill="none" stroke="#89B99B" strokeWidth="2" />
          <circle cx="21" cy="26" r="2.2" fill="#E991A8" />
        </svg>
      );
    case 'sofiya':
      // 📚 Stack of Mini Storybooks
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <rect x="7" y="29" width="30" height="8" rx="2" fill="#8BB99B" stroke={INK} strokeWidth="1.9" />
          <rect x="9" y="21" width="27" height="8" rx="2" fill="#E79EB2" stroke={INK} strokeWidth="1.9" />
          <rect x="11" y="13" width="25" height="8" rx="2" fill="#F0C674" stroke={INK} strokeWidth="1.9" />
          <line x1="12" y1="33" x2="32" y2="33" stroke="#FFFDF8" strokeWidth="1.6" />
          <line x1="14" y1="25" x2="31" y2="25" stroke="#FFFDF8" strokeWidth="1.6" />
        </svg>
      );
    case 'miya':
      // 🥕 Ceramic Carrot Jar
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <path d="M22 14 L17 6 M22 14 L22 5 M22 14 L27 6" stroke="#539D64" strokeWidth="2.6" strokeLinecap="round" />
          <path
            d="M14 16 Q22 12 30 16 L26 36 Q22 39 18 36 Z"
            fill="#F49A48"
            stroke={INK}
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          <line x1="17" y1="22" x2="24" y2="22" stroke="#D16F22" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="19" y1="28" x2="26" y2="28" stroke="#D16F22" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'pinecone':
      // 🌰 Traveler Cat's Lucky Pinecone with Tiny Red Bow
      return (
        <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
          <ellipse cx="22" cy="39" rx="11" ry="3" fill="#4A2B14" opacity="0.28" />
          <path
            d="M22 10 C31 12 34 24 29 34 C26 38 18 38 15 34 C10 24 13 12 22 10 Z"
            fill="#A66D42"
            stroke={INK}
            strokeWidth="2.1"
          />
          {/* Pinecone scale chevrons */}
          <path
            d="M16 19 Q22 23 28 19 M14 25 Q22 29 30 25 M16 31 Q22 34 28 31"
            fill="none"
            stroke="#6C3E1E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Little festive red bow on top */}
          <path d="M22 11 L15 7 L17 13 Z M22 11 L29 7 L27 13 Z" fill="#E36379" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="22" cy="11" r="2.2" fill="#C9455C" />
        </svg>
      );
  }
};
