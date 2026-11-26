import React from 'react';

export const LogoCatCupSvg: React.FC<{ className?: string }> = ({
  className = 'w-9 h-9',
}) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="#FADADD" stroke="#E094A8" strokeWidth="2.5" />
    <path d="M17 24 L21 12 L29 20 Z" fill="#FFF8F0" stroke="#7A4929" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M45 24 L41 12 L33 20 Z" fill="#FFF8F0" stroke="#7A4929" strokeWidth="2.4" strokeLinejoin="round" />
    <rect x="15" y="21" width="32" height="27" rx="11" fill="#FFF8F0" stroke="#7A4929" strokeWidth="2.5" />
    <path d="M47 27 C54 27 54 39 47 39" fill="none" stroke="#7A4929" strokeWidth="3" strokeLinecap="round" />
    <circle cx="25" cy="34" r="2.2" fill="#5C3A21" />
    <circle cx="37" cy="34" r="2.2" fill="#5C3A21" />
    <path d="M28 38 Q31 41 34 38" fill="none" stroke="#7A4929" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="21" cy="37" rx="2.6" ry="1.5" fill="#F4A5B5" />
    <ellipse cx="41" cy="37" rx="2.6" ry="1.5" fill="#F4A5B5" />
  </svg>
);

export const FishCoinSvg: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
    <circle cx="18" cy="18" r="16" fill="#FFE082" stroke="#D19528" strokeWidth="2.4" />
    <circle cx="18" cy="18" r="12.5" fill="#FFECB3" stroke="#E3AA3E" strokeWidth="1.2" strokeDasharray="2 2" />
    {/* Cute tiny golden fish */}
    <ellipse cx="16" cy="18" rx="7" ry="4.6" fill="#E39324" />
    <path d="M22 18 L27 13.5 L27 22.5 Z" fill="#E39324" />
    <circle cx="13" cy="17" r="1.2" fill="#FFF8E1" />
  </svg>
);

export const PawBadgeSvg: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <ellipse cx="16" cy="20" rx="7" ry="5.5" fill="#EE8CA4" />
    <circle cx="8" cy="12" r="3" fill="#EE8CA4" />
    <circle cx="13.5" cy="8.5" r="3.2" fill="#EE8CA4" />
    <circle cx="19.5" cy="8.5" r="3.2" fill="#EE8CA4" />
    <circle cx="24.5" cy="12" r="3" fill="#EE8CA4" />
  </svg>
);

/** Cozy woven rattan / lace doily coaster placed under cups, tall glasses, and plates */
export const BaristaCoasterSvg: React.FC<{
  tint?: 'cream' | 'sage' | 'blush';
  className?: string;
}> = ({ tint = 'cream', className = 'w-32 h-8' }) => {
  const fillOuter =
    tint === 'sage' ? '#DFEFE3' : tint === 'blush' ? '#FBE5EC' : '#F3DFC1';
  const fillInner =
    tint === 'sage' ? '#EEF7F0' : tint === 'blush' ? '#FFF2F6' : '#FAF0DC';
  const stroke =
    tint === 'sage' ? '#84AE90' : tint === 'blush' ? '#C98A9C' : '#B68A5C';

  return (
    <svg viewBox="0 0 180 44" className={className} aria-hidden="true">
      {/* Soft contact shadow */}
      <ellipse cx="90" cy="28" rx="80" ry="13" fill="#6E4728" opacity="0.16" />
      {/* Scalloped woven doily outer edge */}
      <ellipse
        cx="90"
        cy="23"
        rx="80"
        ry="14"
        fill={fillOuter}
        stroke={stroke}
        strokeWidth="2"
        strokeDasharray="6 3"
      />
      {/* Inner woven ring */}
      <ellipse
        cx="90"
        cy="23"
        rx="68"
        ry="10.5"
        fill={fillInner}
        stroke={stroke}
        strokeWidth="1.4"
        opacity="0.9"
      />
      <ellipse
        cx="90"
        cy="23"
        rx="54"
        ry="7.5"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.65"
      />
    </svg>
  );
};

export const IngredientIconSvg: React.FC<{
  type: string;
  className?: string;
}> = ({ type, className = 'w-6 h-6 shrink-0' }) => {
  switch (type) {
    case 'espresso':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <rect x="6" y="10" width="16" height="15" rx="4" fill="#6B3E26" stroke="#4A2714" strokeWidth="2" />
          <path d="M22 13 C27 13 27 21 22 21" fill="none" stroke="#4A2714" strokeWidth="2.2" />
          <path d="M11 6 Q13 3 15 6" fill="none" stroke="#B68562" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'hotWater':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <path d="M16 5 C16 5 8 15 8 21 A8 8 0 0 0 24 21 C24 15 16 5 16 5 Z" fill="#9EDCF0" stroke="#4E96B0" strokeWidth="2" />
          <path d="M13 20 A3 3 0 0 0 16 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'warmMilk':
    case 'coldMilk':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <path d="M11 6 L21 6 L24 12 L24 27 L8 27 L8 12 Z" fill="#FFFDF8" stroke="#9AB8CB" strokeWidth="2" strokeLinejoin="round" />
          <rect x="8" y="15" width="16" height="6" fill={type === 'coldMilk' ? '#B9E5F7' : '#F8DFC0'} />
        </svg>
      );
    case 'foam':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <path d="M7 22 A5 5 0 0 1 9 12 A6 6 0 0 1 21 11 A5 5 0 0 1 24 22 Z" fill="#FFFDFB" stroke="#D9A4B4" strokeWidth="2" />
        </svg>
      );
    case 'cocoa':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <ellipse cx="16" cy="17" rx="10" ry="7" fill="#8B5434" stroke="#5D331B" strokeWidth="2" />
          <path d="M8 17 Q16 14 24 17" fill="none" stroke="#C88D68" strokeWidth="1.8" />
        </svg>
      );
    case 'cinnamon':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <rect x="6" y="13" width="20" height="6" rx="3" transform="rotate(-24 16 16)" fill="#C9783B" stroke="#8C4B1B" strokeWidth="1.8" />
          <rect x="6" y="13" width="20" height="6" rx="3" transform="rotate(24 16 16)" fill="#D98B4C" stroke="#8C4B1B" strokeWidth="1.8" />
        </svg>
      );
    case 'marshmallow':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <rect x="5" y="13" width="12" height="11" rx="4" fill="#FFFDF9" stroke="#D9B6B0" strokeWidth="2" />
          <rect x="15" y="9" width="12" height="11" rx="4" fill="#FADADD" stroke="#D998AA" strokeWidth="2" />
        </svg>
      );
    case 'matcha':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          {/* Cozy matcha tea bowl + vibrant green tea */}
          <path d="M5 13 L27 13 C26 22 22 26 16 26 C10 26 6 22 5 13 Z" fill="#FFFDF8" stroke="#5A3E32" strokeWidth="2" />
          <ellipse cx="16" cy="13" rx="11" ry="4" fill="#88BC72" stroke="#467A3A" strokeWidth="1.8" />
          <ellipse cx="14" cy="12.5" rx="4.5" ry="1.6" fill="#C9E9BA" opacity="0.85" />
          <path d="M20 9 Q24 5 27 7 Q25 11 20 9 Z" fill="#6AA856" stroke="#3E6E32" strokeWidth="1.3" />
        </svg>
      );
    case 'ice':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <rect x="6" y="12" width="12" height="12" rx="3" fill="#D5F4FE" stroke="#6BBAD4" strokeWidth="2" />
          <rect x="14" y="7" width="12" height="12" rx="3" fill="#E8FAFF" stroke="#6BBAD4" strokeWidth="2" />
        </svg>
      );
    case 'soda':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="12" cy="21" r="5" fill="#CCF5E7" stroke="#5FB99A" strokeWidth="2" />
          <circle cx="21" cy="14" r="4" fill="#E2FAF1" stroke="#5FB99A" strokeWidth="2" />
          <circle cx="14" cy="9" r="2.8" fill="#CCF5E7" stroke="#5FB99A" strokeWidth="1.8" />
        </svg>
      );
    case 'orangeJuice':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="10.5" fill="#FFA93A" stroke="#D47A14" strokeWidth="2" />
          <circle cx="16" cy="16" r="7" fill="#FFD17A" />
        </svg>
      );
    case 'strawberrySyrup':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <path d="M16 26 C9 22 7 15 10 11 C13 8 19 8 22 11 C25 15 23 22 16 26 Z" fill="#F26082" stroke="#B63455" strokeWidth="2" />
          <path d="M12 9 L16 12 L20 9" fill="none" stroke="#52B67B" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'mint':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <ellipse cx="13" cy="18" rx="7.5" ry="4.5" transform="rotate(-35 13 18)" fill="#58C487" stroke="#2F8E59" strokeWidth="1.8" />
          <ellipse cx="20" cy="14" rx="7.5" ry="4.5" transform="rotate(28 20 14)" fill="#75D8A0" stroke="#2F8E59" strokeWidth="1.8" />
        </svg>
      );
    case 'lemon':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="10.5" fill="#FFE659" stroke="#D1B024" strokeWidth="2" />
          <circle cx="16" cy="16" r="7" fill="#FFF8B8" />
        </svg>
      );
    case 'iceCream':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="13" r="8" fill="#FFF0C4" stroke="#D6A957" strokeWidth="2" />
          <path d="M10 18 L16 28 L22 18 Z" fill="#E3AA6B" stroke="#B0773B" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'whippedCream':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <ellipse cx="16" cy="22" rx="10" ry="4.5" fill="#FFFDFB" stroke="#D6B5A7" strokeWidth="1.8" />
          <ellipse cx="16" cy="16" rx="7.5" ry="4" fill="#FFFDFB" stroke="#D6B5A7" strokeWidth="1.8" />
          <path d="M13 13 Q16 5 19 13 Z" fill="#FFFDFB" stroke="#D6B5A7" strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="8" fill="#FADADD" />
        </svg>
      );
  }
};
