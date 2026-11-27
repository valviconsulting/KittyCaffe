import React, { useId } from 'react';
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
  const uid = useId().replace(/:/g, '');

  return (
    <svg viewBox="0 0 150 120" className={className} aria-label="Десерт">
      <defs>
        {/* Glazed porcelain plate */}
        <radialGradient id={`pl-glaze-${uid}`} cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="72%" stopColor="#FAF1E4" />
          <stop offset="100%" stopColor="#E7D4BE" />
        </radialGradient>
        {/* Flaky baked croissant crust gradients (cool butter vs warm toasted honey-amber) */}
        <radialGradient id={`cr-warm-${uid}`} cx="38%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#F9C676" />
          <stop offset="48%" stopColor="#DF8B36" />
          <stop offset="100%" stopColor="#A65518" />
        </radialGradient>
        <radialGradient id={`cr-cool-${uid}`} cx="38%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FDE5B3" />
          <stop offset="52%" stopColor="#EEBE78" />
          <stop offset="100%" stopColor="#C48B44" />
        </radialGradient>
        {/* Baked golden-brown cookie dough */}
        <radialGradient id={`ck-dough-${uid}`} cx="40%" cy="34%" r="68%">
          <stop offset="0%" stopColor="#F4C788" />
          <stop offset="65%" stopColor="#DE9D56" />
          <stop offset="100%" stopColor="#B36E30" />
        </radialGradient>
        {/* Soft fried golden donut dough */}
        <radialGradient id={`dn-dough-${uid}`} cx="40%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#FBE0A8" />
          <stop offset="55%" stopColor="#EDB66C" />
          <stop offset="100%" stopColor="#C6803A" />
        </radialGradient>
        {/* Glossy pink & dark-chocolate donut glazes */}
        <linearGradient id={`dn-pink-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB9CE" />
          <stop offset="55%" stopColor="#F489A8" />
          <stop offset="100%" stopColor="#D96588" />
        </linearGradient>
        <linearGradient id={`dn-choc-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8C5331" />
          <stop offset="55%" stopColor="#65361B" />
          <stop offset="100%" stopColor="#46220E" />
        </linearGradient>
        {/* Spiced carrot muffin & cream-cheese swirl */}
        <radialGradient id={`cc-dome-${uid}`} cx="42%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F2A45A" />
          <stop offset="65%" stopColor="#D77B34" />
          <stop offset="100%" stopColor="#A55219" />
        </radialGradient>
        <linearGradient id={`cc-cream-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="68%" stopColor="#FFF7EB" />
          <stop offset="100%" stopColor="#E6D0B8" />
        </linearGradient>
      </defs>

      {/* Cozy lace doily + hand-glazed porcelain dessert plate */}
      {showPlate && (
        <g>
          <ellipse cx="75" cy="99" rx="60" ry="14" fill="#5A361B" opacity="0.18" />
          <ellipse
            cx="75"
            cy="95"
            rx="68"
            ry="20"
            fill="#F9E5EC"
            stroke="#D6A2B3"
            strokeWidth="1.4"
            strokeDasharray="4 3"
          />
          <ellipse
            cx="75"
            cy="92"
            rx="58"
            ry="16"
            fill={`url(#pl-glaze-${uid})`}
            stroke="#CFAF90"
            strokeWidth="2.1"
          />
          <ellipse cx="75" cy="90" rx="42" ry="10" fill="#FBF0E2" stroke="#E8CEB3" strokeWidth="1.2" />
          {/* Soft warm contact shadow directly beneath the pastry */}
          <ellipse cx="75" cy="84" rx="36" ry="9" fill="#7D4C25" opacity="0.22" />
        </g>
      )}

      {/* CROISSANT (flaky layered golden-brown folds + toasted highlights) */}
      {pastry.type === 'croissant' && (
        <g>
          {pastry.warmed && (
            <>
              <ellipse cx="75" cy="68" rx="48" ry="26" fill="#FFD38C" opacity="0.28" />
              <g fill="none" stroke="#DC965B" strokeWidth="2.4" strokeLinecap="round" opacity="0.88">
                <path className="animate-steam-1" d="M55 38 Q50 28 56 18" />
                <path className="animate-steam-2" d="M75 34 Q81 24 74 14" />
                <path className="animate-steam-3" d="M95 38 Q90 28 96 18" />
              </g>
            </>
          )}
          <g transform="translate(0, 6)">
            {/* Crescent ends */}
            <path
              d="M31 76 Q24 55 44 46 L55 72 Q42 82 31 76 Z"
              fill={pastry.warmed ? `url(#cr-warm-${uid})` : `url(#cr-cool-${uid})`}
              stroke={pastry.warmed ? '#7D4111' : '#A87437'}
              strokeWidth="1.9"
            />
            <path
              d="M119 76 Q126 55 106 46 L95 72 Q108 82 119 76 Z"
              fill={pastry.warmed ? `url(#cr-warm-${uid})` : `url(#cr-cool-${uid})`}
              stroke={pastry.warmed ? '#7D4111' : '#A87437'}
              strokeWidth="1.9"
            />
            {/* Side laminated folds */}
            <ellipse
              cx="53"
              cy="61"
              rx="18.5"
              ry="16"
              transform="rotate(-22 53 61)"
              fill={pastry.warmed ? `url(#cr-warm-${uid})` : `url(#cr-cool-${uid})`}
              stroke={pastry.warmed ? '#7D4111' : '#A87437'}
              strokeWidth="1.9"
            />
            <ellipse
              cx="97"
              cy="61"
              rx="18.5"
              ry="16"
              transform="rotate(22 97 61)"
              fill={pastry.warmed ? `url(#cr-warm-${uid})` : `url(#cr-cool-${uid})`}
              stroke={pastry.warmed ? '#7D4111' : '#A87437'}
              strokeWidth="1.9"
            />
            {/* Center plump laminated crown */}
            <ellipse
              cx="75"
              cy="56"
              rx="22.5"
              ry="20"
              fill={pastry.warmed ? `url(#cr-warm-${uid})` : `url(#cr-cool-${uid})`}
              stroke={pastry.warmed ? '#7D4111' : '#A87437'}
              strokeWidth="2"
            />
            {/* Subtle flaky butter-glaze highlights & toasted ridges */}
            <path
              d="M62 44 Q75 39 87 44"
              fill="none"
              stroke="#FFF4DC"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.78"
            />
            <path
              d="M44 54 Q52 48 59 52 M91 52 Q98 48 106 54"
              fill="none"
              stroke="#FFF0D0"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.58"
            />
            {/* Delicate pastry crumbs on plate */}
            {showPlate && (
              <g fill={pastry.warmed ? '#B86924' : '#C99552'} opacity="0.7">
                <circle cx="44" cy="83" r="1.5" />
                <circle cx="51" cy="86" r="1.1" />
                <circle cx="104" cy="84" r="1.4" />
              </g>
            )}
          </g>
        </g>
      )}

      {/* CHOCOLATE CHIP COOKIE (handmade bumpy edge + glossy dark chocolate chunks + crumbs) */}
      {pastry.type === 'cookie' && (
        <g transform="translate(0, 6)">
          {/* Thick baked bottom rim */}
          <path
            d="M37 70 C36 56 53 45 75 45 C97 45 114 56 113 70 C112 83 95 92 75 92 C55 92 38 83 37 70 Z"
            fill="#BD7939"
            stroke="#844E1E"
            strokeWidth="2"
          />
          {/* Handmade organic top cookie surface */}
          <path
            d="M38 65 C37 51 54 41 75 41 C96 41 113 51 112 65 C111 78 94 86 75 86 C56 86 39 78 38 65 Z"
            fill={`url(#ck-dough-${uid})`}
            stroke="#8D5522"
            strokeWidth="1.9"
          />
          {/* Subtle dough dimples & golden top highlight */}
          <path
            d="M52 50 Q72 44 92 49"
            fill="none"
            stroke="#FCE1B0"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* Melted chocolate chunks with glossy shine */}
          {[
            { cx: 56, cy: 60, rx: 5.8, ry: 4.1, fill: '#572D16' },
            { cx: 74, cy: 53, rx: 5.2, ry: 3.9, fill: '#4E2712' },
            { cx: 94, cy: 61, rx: 5.8, ry: 4.1, fill: '#5B3018' },
            { cx: 66, cy: 72, rx: 5.8, ry: 4.3, fill: '#4A2410' },
            { cx: 86, cy: 73, rx: 5.2, ry: 3.8, fill: '#572D16' },
            { cx: 82, cy: 61, rx: 3.6, ry: 3.1, fill: '#67371C' },
            { cx: 51, cy: 71, rx: 3.2, ry: 2.6, fill: '#522914' },
          ].map((ch, idx) => (
            <g key={idx}>
              <ellipse cx={ch.cx} cy={ch.cy + 1} rx={ch.rx} ry={ch.ry} fill="#8C5324" opacity="0.35" />
              <ellipse cx={ch.cx} cy={ch.cy} rx={ch.rx} ry={ch.ry} fill={ch.fill} />
              <ellipse
                cx={ch.cx - ch.rx * 0.28}
                cy={ch.cy - ch.ry * 0.3}
                rx={ch.rx * 0.32}
                ry={ch.ry * 0.25}
                fill="#B88362"
                opacity="0.72"
              />
            </g>
          ))}
          {showPlate && (
            <g fill="#B67335" opacity="0.75">
              <circle cx="42" cy="87" r="1.6" />
              <circle cx="106" cy="85" r="1.4" />
              <circle cx="111" cy="88" r="1.1" />
            </g>
          )}
        </g>
      )}

      {/* DONUT (plump fried ring + glossy drippy glaze + 3D rainbow sprinkles) */}
      {pastry.type === 'donut' && (
        <g transform="translate(0, 4)">
          {/* Soft golden dough lower cushion + pale fry ring */}
          <ellipse cx="75" cy="69" rx="40.5" ry="26" fill="#D5954D" stroke="#965D26" strokeWidth="2" />
          <ellipse cx="75" cy="66" rx="40" ry="24.5" fill="#FBE6BC" opacity="0.55" />
          <ellipse cx="75" cy="64" rx="39" ry="24" fill={`url(#dn-dough-${uid})`} stroke="#965D26" strokeWidth="1.8" />

          {/* Drippy Glossy Glaze Layer with soft underside shadow */}
          {pastry.glaze !== 'none' && (
            <g>
              <path
                d="M38 64 C38 46 56 40 75 40 C94 40 112 46 112 64 C112 74 104 77 98 72 C92 67 89 79 81 78 C73 77 72 69 66 76 C60 82 51 77 48 71 C45 66 38 73 38 64 Z"
                fill="#6E3B18"
                opacity="0.22"
              />
              <path
                d="M38 62 C38 44 56 38 75 38 C94 38 112 44 112 62 C112 72 104 75 98 70 C92 65 89 77 81 76 C73 75 72 67 66 74 C60 80 51 75 48 69 C45 64 38 71 38 62 Z"
                fill={pastry.glaze === 'pink' ? `url(#dn-pink-${uid})` : `url(#dn-choc-${uid})`}
                stroke={pastry.glaze === 'pink' ? '#C05A78' : '#3F1F0E'}
                strokeWidth="1.7"
              />
              {/* Specular glossy glaze highlights */}
              <path
                d="M50 49 Q63 42 80 43.5"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity={pastry.glaze === 'pink' ? '0.68' : '0.38'}
              />
              <path
                d="M92 48 Q99 51 103 57"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.1"
                strokeLinecap="round"
                opacity={pastry.glaze === 'pink' ? '0.52' : '0.26'}
              />
            </g>
          )}

          {/* Donut Center Hole */}
          <ellipse
            cx="75"
            cy="60"
            rx="13"
            ry="8"
            fill={showPlate ? '#F8EADC' : '#FFF8F0'}
            stroke="#965D26"
            strokeWidth="2"
          />

          {/* Colorful Rainbow Sprinkles */}
          {pastry.sprinkles && (
            <g strokeLinecap="round" strokeWidth="3.4">
              <line x1="48" y1="54" x2="53" y2="57" stroke="#FFE45E" />
              <line x1="59" y1="45" x2="65" y2="46" stroke="#78DFB6" />
              <line x1="83" y1="44" x2="89" y2="47" stroke="#FF7CA3" />
              <line x1="97" y1="53" x2="102" y2="57" stroke="#7CCDF0" />
              <line x1="92" y1="67" x2="98" y2="65" stroke="#FFE45E" />
              <line x1="56" y1="68" x2="61" y2="71" stroke="#7CCDF0" />
              <line x1="74" y1="73" x2="80" y2="73" stroke="#78DFB6" />
              <line x1="46" y1="63" x2="50" y2="61" stroke="#FFFFFF" />
              <line x1="100" y1="61" x2="104" y2="59" stroke="#FFF8F0" />
            </g>
          )}
        </g>
      )}

      {/* CARROT CAKE MUFFIN WITH SHADED CREAM FROSTING & GLOSSY FONDANT CARROT */}
      {pastry.type === 'carrot_cake' && (
        <g transform="translate(0, 5)">
          {/* Fluted kraft cupcake liner */}
          <path
            d="M44 58 L106 58 L98 86 Q96 90 90 90 L60 90 Q54 90 52 86 Z"
            fill="#F1CD99"
            stroke="#8F5D30"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <g stroke="#C6945A" strokeWidth="1.7" strokeLinecap="round">
            <line x1="56" y1="60" x2="60" y2="87" />
            <line x1="66" y1="60" x2="68" y2="88" />
            <line x1="75" y1="60" x2="75" y2="88" />
            <line x1="84" y1="60" x2="82" y2="88" />
            <line x1="94" y1="60" x2="90" y2="87" />
          </g>
          {/* Spiced carrot muffin dome */}
          <path
            d="M41 59 C40 42 54 34 75 34 C96 34 110 42 109 59 Z"
            fill={`url(#cc-dome-${uid})`}
            stroke="#844314"
            strokeWidth="1.9"
          />
          <circle cx="56" cy="50" r="2" fill="#A54D14" />
          <circle cx="94" cy="51" r="2" fill="#A54D14" />
          <circle cx="66" cy="54" r="1.8" fill="#F4B86E" />
          <circle cx="84" cy="54" r="1.6" fill="#8C3E10" />
          {/* Lush shaded cream-cheese frosting swirl */}
          <ellipse cx="75" cy="40" rx="34" ry="12" fill={`url(#cc-cream-${uid})`} stroke="#C7AC95" strokeWidth="1.6" />
          <ellipse cx="75" cy="31" rx="24" ry="10" fill={`url(#cc-cream-${uid})`} stroke="#C7AC95" strokeWidth="1.5" />
          <path d="M62 24 Q75 12 88 24 Q75 29 62 24 Z" fill={`url(#cc-cream-${uid})`} stroke="#C7AC95" strokeWidth="1.4" />
          <path d="M56 37 Q70 33 84 36" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
          {/* Adorable glossy fondant carrot */}
          <g transform="translate(76, 22) rotate(-18)">
            <path d="M-8 0 L-14 -4 M-8 0 L-15 1 M-8 0 L-13 5" stroke="#4D945E" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M-9 -5 Q4 -4 14 0 Q4 5 -9 5 Z" fill="#F48A36" stroke="#964912" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M-5 -2 Q2 -2 7 -0.5" fill="none" stroke="#FFD6A6" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
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
}) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 160 110" className={className} aria-label="Міні-пічка">
      <defs>
        <linearGradient id={`ov-body-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF0F3" />
          <stop offset="55%" stopColor="#FADCE3" />
          <stop offset="100%" stopColor="#EABAC7" />
        </linearGradient>
        <radialGradient id={`ov-glow-${uid}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={isWarming ? '#FFE29E' : isWarmed ? '#FFF5DC' : '#F2E4D9'} />
          <stop offset="100%" stopColor={isWarming ? '#F5A552' : isWarmed ? '#EBD3AF' : '#D9C3B4'} />
        </radialGradient>
      </defs>
      {/* Oven feet */}
      <rect x="22" y="96" width="16" height="8" rx="4" fill="#A66D40" />
      <rect x="122" y="96" width="16" height="8" rx="4" fill="#A66D40" />
      {/* Cute cat ears on mini-oven top */}
      <path d="M26 22 L32 6 L46 18 Z" fill="#F9D5DF" stroke="#BC7688" strokeWidth="2" strokeLinejoin="round" />
      <path d="M134 22 L128 6 L114 18 Z" fill="#F9D5DF" stroke="#BC7688" strokeWidth="2" strokeLinejoin="round" />
      {/* Ceramic enamel oven body */}
      <rect x="14" y="16" width="132" height="82" rx="14" fill={`url(#ov-body-${uid})`} stroke="#BC7688" strokeWidth="2.4" />
      {/* Oven glass window */}
      <rect
        x="24"
        y="28"
        width="84"
        height="58"
        rx="9"
        fill={`url(#ov-glow-${uid})`}
        stroke="#9A6547"
        strokeWidth="2.2"
      />
      {/* Glowing heat bars when warming */}
      {isWarming && (
        <g className="animate-oven-glow">
          <line x1="30" y1="35" x2="102" y2="35" stroke="#FF6B35" strokeWidth="3.8" strokeLinecap="round" />
          <line x1="30" y1="79" x2="102" y2="79" stroke="#FF6B35" strokeWidth="3.8" strokeLinecap="round" />
        </g>
      )}
      {/* Baking rack & tiny croissant inside */}
      <line x1="28" y1="71" x2="104" y2="71" stroke="#8C6146" strokeWidth="2.2" />
      <g transform="translate(44, 48) scale(0.55)">
        <ellipse cx="40" cy="24" rx="22" ry="16" fill={isWarming || isWarmed ? '#DE8C3B' : '#F3CA8B'} stroke="#824612" strokeWidth="2.6" />
        <ellipse cx="18" cy="30" rx="13" ry="11" fill={isWarming || isWarmed ? '#CE7D2F' : '#EAC080'} stroke="#824612" strokeWidth="2.6" />
        <ellipse cx="62" cy="30" rx="13" ry="11" fill={isWarming || isWarmed ? '#CE7D2F' : '#EAC080'} stroke="#824612" strokeWidth="2.6" />
      </g>
      {/* Glass door diagonal reflection */}
      <path d="M32 36 L44 36 L32 54 Z" fill="#FFFFFF" opacity="0.34" />
      {/* Control knobs on right */}
      <circle cx="127" cy="44" r="9" fill="#FFF9F0" stroke="#BC7688" strokeWidth="2" />
      <line x1="127" y1="44" x2={isWarming ? 133 : 127} y2={isWarming ? 40 : 37} stroke="#B65B73" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="127" cy="70" r="6" fill={isWarming ? '#FF7D4D' : isWarmed ? '#65C99A' : '#DFBFC8'} />
    </svg>
  );
};
