import React from 'react';
import type { PreparedPastry } from '../../types/game';

interface PastrySvgProps {
  pastry: PreparedPastry;
  showPlate?: boolean;
  className?: string;
}

export const PastrySvg: React.FC<PastrySvgProps> = ({
  pastry,
  showPlate = true,
  className = 'w-28 h-24',
}) => {
  return (
    <svg viewBox="0 0 150 120" className={className} aria-label="Десерт">
      {/* Unified cozy lace napkin + pastel porcelain dessert plate */}
      {showPlate && (
        <g>
          <ellipse
            cx="75"
            cy="95"
            rx="68"
            ry="20"
            fill="#F9E5EC"
            stroke="#D9A8B8"
            strokeWidth="1.6"
            strokeDasharray="4 3"
          />
          <ellipse cx="75" cy="92" rx="58" ry="16" fill="#FFFDF9" stroke="#DEC0A4" strokeWidth="2.8" />
          <ellipse cx="75" cy="90" rx="42" ry="10" fill="#FFF3E7" stroke="#F1D7BE" strokeWidth="1.5" />
        </g>
      )}

      {/* CROISSANT (cold or warm golden-brown with steam!) */}
      {pastry.type === 'croissant' && (
        <g>
          {pastry.warmed && (
            <>
              <ellipse cx="75" cy="70" rx="46" ry="26" fill="#FFD38C" opacity="0.32" />
              <g fill="none" stroke="#E09D65" strokeWidth="2.8" strokeLinecap="round">
                <path className="animate-steam-1" d="M55 38 Q50 28 56 18" />
                <path className="animate-steam-2" d="M75 34 Q81 24 74 14" />
                <path className="animate-steam-3" d="M95 38 Q90 28 96 18" />
              </g>
            </>
          )}
          <g transform="translate(0, 6)">
            {/* Crescent ends */}
            <path
              d="M32 76 Q25 56 44 46 L55 72 Q42 82 32 76 Z"
              fill={pastry.warmed ? '#C9782C' : '#E8BA7A'}
              stroke={pastry.warmed ? '#8D4D14' : '#B98443'}
              strokeWidth="2.4"
            />
            <path
              d="M118 76 Q125 56 106 46 L95 72 Q108 82 118 76 Z"
              fill={pastry.warmed ? '#C9782C' : '#E8BA7A'}
              stroke={pastry.warmed ? '#8D4D14' : '#B98443'}
              strokeWidth="2.4"
            />
            {/* Side segments */}
            <ellipse
              cx="53"
              cy="61"
              rx="18"
              ry="16"
              transform="rotate(-22 53 61)"
              fill={pastry.warmed ? '#D9893B' : '#F2C98A'}
              stroke={pastry.warmed ? '#8D4D14' : '#B98443'}
              strokeWidth="2.4"
            />
            <ellipse
              cx="97"
              cy="61"
              rx="18"
              ry="16"
              transform="rotate(22 97 61)"
              fill={pastry.warmed ? '#D9893B' : '#F2C98A'}
              stroke={pastry.warmed ? '#8D4D14' : '#B98443'}
              strokeWidth="2.4"
            />
            {/* Center plump segment */}
            <ellipse
              cx="75"
              cy="56"
              rx="22"
              ry="20"
              fill={pastry.warmed ? '#E49844' : '#F9D89F'}
              stroke={pastry.warmed ? '#8D4D14' : '#B98443'}
              strokeWidth="2.6"
            />
            {/* Glossy highlight */}
            <path
              d="M64 46 Q75 41 86 46"
              fill="none"
              stroke="#FFF2D6"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.75"
            />
          </g>
        </g>
      )}

      {/* CHOCOLATE CHIP COOKIE */}
      {pastry.type === 'cookie' && (
        <g transform="translate(0, 6)">
          <ellipse cx="75" cy="70" rx="38" ry="24" fill="#D59553" stroke="#9A5F28" strokeWidth="2.8" />
          <ellipse cx="75" cy="65" rx="36" ry="21" fill="#E7AE6E" stroke="#9A5F28" strokeWidth="2.4" />
          {/* Chocolate chips */}
          <ellipse cx="56" cy="60" rx="5.5" ry="4" fill="#5D3219" />
          <ellipse cx="74" cy="54" rx="5" ry="3.8" fill="#5D3219" />
          <ellipse cx="94" cy="61" rx="5.5" ry="4" fill="#5D3219" />
          <ellipse cx="66" cy="72" rx="5.5" ry="4.2" fill="#4E2914" />
          <ellipse cx="86" cy="73" rx="5" ry="3.8" fill="#5D3219" />
          <circle cx="82" cy="61" r="3.4" fill="#6B3A1E" />
          <circle cx="52" cy="71" r="3" fill="#5D3219" />
          {/* Cute tiny shine dots */}
          <circle cx="55" cy="59" r="1.2" fill="#A87454" />
          <circle cx="73" cy="53" r="1.2" fill="#A87454" />
          <circle cx="93" cy="60" r="1.2" fill="#A87454" />
        </g>
      )}

      {/* DONUT (with optional pink/chocolate glaze & colorful sprinkles!) */}
      {pastry.type === 'donut' && (
        <g transform="translate(0, 4)">
          {/* Soft golden dough ring */}
          <ellipse cx="75" cy="68" rx="40" ry="26" fill="#E8AE69" stroke="#A66B2F" strokeWidth="2.8" />
          <ellipse cx="75" cy="64" rx="39" ry="24" fill="#F4C585" stroke="#A66B2F" strokeWidth="2.4" />

          {/* Glaze Layer */}
          {pastry.glaze !== 'none' && (
            <path
              d="M38 62 C38 44 56 38 75 38 C94 38 112 44 112 62 C112 72 104 75 98 70 C92 65 89 77 81 76 C73 75 72 67 66 74 C60 80 51 75 48 69 C45 64 38 71 38 62 Z"
              fill={pastry.glaze === 'pink' ? '#FA9EB8' : '#6F3D22'}
              stroke={pastry.glaze === 'pink' ? '#D16988' : '#4A2612'}
              strokeWidth="2.2"
            />
          )}

          {/* Glaze glossy highlight */}
          {pastry.glaze !== 'none' && (
            <path
              d="M52 49 Q64 43 79 44"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity={pastry.glaze === 'pink' ? '0.6' : '0.32'}
            />
          )}

          {/* Donut Center Hole */}
          <ellipse
            cx="75"
            cy="60"
            rx="13"
            ry="8"
            fill={showPlate ? '#FFF3E7' : '#FFF8F0'}
            stroke="#A66B2F"
            strokeWidth="2.4"
          />

          {/* Colorful Rainbow Sprinkles */}
          {pastry.sprinkles && (
            <g strokeLinecap="round" strokeWidth="3.4">
              <line x1="48" y1="54" x2="53" y2="57" stroke="#FFE45E" />
              <line x1="59" y1="45" x2="65" y2="46" stroke="#7AE0B8" />
              <line x1="83" y1="44" x2="89" y2="47" stroke="#FF7FA6" />
              <line x1="97" y1="53" x2="102" y2="57" stroke="#85D2F2" />
              <line x1="92" y1="67" x2="98" y2="65" stroke="#FFE45E" />
              <line x1="56" y1="68" x2="61" y2="71" stroke="#85D2F2" />
              <line x1="74" y1="73" x2="80" y2="73" stroke="#7AE0B8" />
              <line x1="46" y1="63" x2="50" y2="61" stroke="#FFFFFF" />
              <line x1="100" y1="61" x2="104" y2="59" stroke="#FFF8F0" />
            </g>
          )}
        </g>
      )}

      {/* CARROT CAKE MUFFIN WITH CREAM FROSTING & MINI FONDANT CARROT */}
      {pastry.type === 'carrot_cake' && (
        <g transform="translate(0, 5)">
          {/* Kraft fluted cupcake liner */}
          <path
            d="M44 58 L106 58 L98 86 Q96 90 90 90 L60 90 Q54 90 52 86 Z"
            fill="#F4D3A5"
            stroke="#9C6938"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <g stroke="#CFA16A" strokeWidth="1.8" strokeLinecap="round">
            <line x1="58" y1="60" x2="61" y2="87" />
            <line x1="75" y1="60" x2="75" y2="88" />
            <line x1="92" y1="60" x2="89" y2="87" />
          </g>
          {/* Spiced carrot muffin dome */}
          <path
            d="M41 59 C40 42 54 34 75 34 C96 34 110 42 109 59 Z"
            fill="#DE8A42"
            stroke="#8F4C19"
            strokeWidth="2.4"
          />
          {/* Subtle cinnamon & carrot flecks */}
          <circle cx="56" cy="50" r="2" fill="#B65B1C" />
          <circle cx="94" cy="51" r="2" fill="#B65B1C" />
          <circle cx="66" cy="54" r="1.8" fill="#F2B165" />
          {/* Lush cream-cheese frosting swirl */}
          <ellipse cx="75" cy="40" rx="34" ry="12" fill="#FFFDF8" stroke="#CEB59F" strokeWidth="2.2" />
          <ellipse cx="75" cy="31" rx="24" ry="10" fill="#FFFDF8" stroke="#CEB59F" strokeWidth="2" />
          <path d="M62 24 Q75 12 88 24 Q75 29 62 24 Z" fill="#FFFDF8" stroke="#CEB59F" strokeWidth="1.8" />
          {/* Adorable miniature fondant carrot on frosting crown */}
          <g transform="translate(76, 22) rotate(-18)">
            <path d="M-8 0 L-14 -4 M-8 0 L-15 1 M-8 0 L-13 5" stroke="#539D64" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M-9 -5 Q4 -4 14 0 Q4 5 -9 5 Z" fill="#F48A36" stroke="#9C4D14" strokeWidth="1.8" strokeLinejoin="round" />
          </g>
        </g>
      )}
    </svg>
  );
};

interface MiniOvenSvgProps {
  isWarming: boolean;
  isWarmed: boolean;
  className?: string;
}

export const MiniOvenSvg: React.FC<MiniOvenSvgProps> = ({
  isWarming,
  isWarmed,
  className = 'w-32 h-24',
}) => (
  <svg viewBox="0 0 160 110" className={className} aria-label="Міні-пічка">
    {/* Oven feet */}
    <rect x="22" y="96" width="16" height="8" rx="4" fill="#B67C4D" />
    <rect x="122" y="96" width="16" height="8" rx="4" fill="#B67C4D" />
    {/* Cute cat ears on mini-oven top */}
    <path d="M26 22 L32 6 L46 18 Z" fill="#FADADD" stroke="#C98395" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M134 22 L128 6 L114 18 Z" fill="#FADADD" stroke="#C98395" strokeWidth="2.4" strokeLinejoin="round" />
    {/* Oven body */}
    <rect x="14" y="16" width="132" height="82" rx="14" fill="#FCE6EB" stroke="#C98395" strokeWidth="3" />
    {/* Oven window */}
    <rect
      x="24"
      y="28"
      width="84"
      height="58"
      rx="9"
      fill={isWarming ? '#FFCE8A' : isWarmed ? '#FFF1D2' : '#E9D6C9'}
      stroke="#A87051"
      strokeWidth="2.6"
    />
    {/* Glowing heat bars when warming */}
    {isWarming && (
      <g className="animate-oven-glow">
        <line x1="30" y1="35" x2="102" y2="35" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="79" x2="102" y2="79" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" />
      </g>
    )}
    {/* Baking rack & tiny croissant inside */}
    <line x1="28" y1="71" x2="104" y2="71" stroke="#9B6E52" strokeWidth="2.4" />
    <g transform="translate(44, 48) scale(0.55)">
      <ellipse cx="40" cy="24" rx="22" ry="16" fill={isWarming || isWarmed ? '#DE8C3B' : '#F3CA8B'} stroke="#8D4D14" strokeWidth="3" />
      <ellipse cx="18" cy="30" rx="13" ry="11" fill={isWarming || isWarmed ? '#CE7D2F' : '#EAC080'} stroke="#8D4D14" strokeWidth="3" />
      <ellipse cx="62" cy="30" rx="13" ry="11" fill={isWarming || isWarmed ? '#CE7D2F' : '#EAC080'} stroke="#8D4D14" strokeWidth="3" />
    </g>
    {/* Control knobs on right */}
    <circle cx="127" cy="44" r="9" fill="#FFF8F0" stroke="#C98395" strokeWidth="2.2" />
    <line x1="127" y1="44" x2={isWarming ? 133 : 127} y2={isWarming ? 40 : 37} stroke="#B65B73" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="127" cy="70" r="6" fill={isWarming ? '#FF7D4D' : isWarmed ? '#65C99A' : '#E2C3CB'} />
  </svg>
);
