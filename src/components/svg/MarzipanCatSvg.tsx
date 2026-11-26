import React, { useId } from 'react';

interface MarzipanCatSvgProps {
  isPurring: boolean;
  className?: string;
}

export const MarzipanCatSvg: React.FC<MarzipanCatSvgProps> = ({
  isPurring,
  className = 'w-28 h-20 md:w-32 md:h-22',
}) => {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 140 92"
      className={`${className} overflow-visible drop-shadow-[0_4px_6px_rgba(90,62,50,0.16)]`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`mz-body-${uid}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FDF0DA" />
          <stop offset="100%" stopColor="#F2D7B4" />
        </radialGradient>
        <radialGradient id={`mz-patch-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E4AE77" />
          <stop offset="100%" stopColor="#CF9058" />
        </radialGradient>
      </defs>

      {/* Sage watercolor cushion */}
      <ellipse cx="70" cy="76" rx="54" ry="12" fill="#C2DEC8" stroke="#5A3E32" strokeWidth="2.1" />
      <ellipse cx="70" cy="74" rx="43" ry="6.5" fill="#D8ECDC" />

      <g>
        {/* Swishing caramel tail */}
        <path
          d={
            isPurring
              ? 'M100 66 Q126 60 128 45 Q129 37 119 40'
              : 'M100 66 Q124 64 125 50 Q126 42 117 44'
          }
          fill="none"
          stroke="#D59A62"
          strokeWidth="9"
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        {/* Curled body */}
        <ellipse cx="73" cy="60" rx="36" ry="20" fill={`url(#mz-body-${uid})`} stroke="#5A3E32" strokeWidth="2.3" />
        <ellipse cx="86" cy="52" rx="14" ry="8" fill={`url(#mz-patch-${uid})`} />
        <ellipse cx="66" cy="48" rx="9" ry="5" fill={`url(#mz-patch-${uid})`} />

        {/* Ears */}
        <g
          className="transition-transform duration-300"
          style={{
            transform: isPurring ? 'translateY(-2px)' : 'translateY(0px)',
          }}
        >
          <path d="M35 44 L31 24 L48 36 Z" fill="#DDA36B" stroke="#5A3E32" strokeWidth="2.1" strokeLinejoin="round" />
          <path d="M36 40 L34 29 L44 36 Z" fill="#F4C7D2" />
          <path d="M62 41 L66 23 L49 35 Z" fill="#F8E4C8" stroke="#5A3E32" strokeWidth="2.1" strokeLinejoin="round" />
          <path d="M60 39 L62 29 L53 36 Z" fill="#F4C7D2" />
        </g>

        {/* Head */}
        <ellipse cx="48" cy="54" rx="22" ry="18" fill={`url(#mz-body-${uid})`} stroke="#5A3E32" strokeWidth="2.3" />
        <path d="M32 45 Q41 37 47 45 Q40 50 32 45 Z" fill="#DDA36B" />

        {/* Eyes */}
        {isPurring ? (
          <g fill="none" stroke="#5A3E32" strokeWidth="2.3" strokeLinecap="round">
            <path d="M37 54 Q41 49 45 54" />
            <path d="M51 54 Q55 49 59 54" />
          </g>
        ) : (
          <g fill="none" stroke="#5A3E32" strokeWidth="2.1" strokeLinecap="round">
            <path d="M37 54 Q41 58 45 54" />
            <path d="M51 54 Q55 58 59 54" />
          </g>
        )}

        {/* Blush, nose, smile */}
        <ellipse cx="35" cy="59" rx="4.2" ry="2.6" fill="#F09FB3" opacity="0.68" />
        <ellipse cx="61" cy="59" rx="4.2" ry="2.6" fill="#F09FB3" opacity="0.68" />
        <path d="M46 58 L50 58 L48 61 Z" fill="#EC90A5" />
        <path d="M44 62 Q48 65 52 62" fill="none" stroke="#5A3E32" strokeWidth="1.8" strokeLinecap="round" />

        {/* Little front paw */}
        <ellipse cx="45" cy="70" rx="8" ry="5" fill="#FFF8EC" stroke="#5A3E32" strokeWidth="1.9" />
      </g>

      {/* Handwritten sleepy Zzz when resting */}
      {!isPurring && (
        <g fill="#9A7458" fontWeight="700" style={{ fontFamily: "'Caveat', cursive" }}>
          <text x="82" y="34" fontSize="15" className="animate-zzz-1">
            z
          </text>
          <text x="95" y="23" fontSize="19" className="animate-zzz-2">
            Z
          </text>
        </g>
      )}
    </svg>
  );
};
