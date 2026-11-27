import React, { useId } from 'react';
import type { GuestEmotion, GuestId } from '../../types/game';

interface GuestCharacterSvgProps {
  guestId: GuestId;
  emotion: GuestEmotion;
  className?: string;
}

const INK = '#5A3E32';

const SurprisedAccent: React.FC = () => (
  <g>
    <text
      x="156"
      y="44"
      fontSize="26"
      fontWeight="700"
      fill="#D8824B"
      style={{ fontFamily: "'Caveat', cursive" }}
    >
      ?
    </text>
    <path d="M40 36 Q45 43 40 48 Q35 43 40 36 Z" fill="#9CCFE3" />
  </g>
);

const NoCoffeeAccent: React.FC = () => (
  <g>
    <path
      d="M24 58 Q30 50 26 42"
      fill="none"
      stroke="#E27994"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M176 58 Q170 50 174 42"
      fill="none"
      stroke="#E27994"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <text
      x="155"
      y="40"
      fontSize="24"
      fontWeight="700"
      fill="#DE6884"
      style={{ fontFamily: "'Caveat', cursive" }}
    >
      !
    </text>
  </g>
);

const CatEyes: React.FC<{
  emotion: GuestEmotion;
  irisColor?: string;
  outlineColor?: string;
}> = ({ emotion, irisColor = INK, outlineColor = INK }) => {
  if (emotion === 'happy') {
    return (
      <g fill="none" stroke={outlineColor} strokeWidth="3.6" strokeLinecap="round">
        <path d="M68 101 Q76 91 84 101" />
        <path d="M116 101 Q124 91 132 101" />
      </g>
    );
  }
  if (emotion === 'no_coffee') {
    return (
      <g
        fill="none"
        stroke={outlineColor}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M68 95 L82 101 L68 107" />
        <path d="M132 95 L118 101 L132 107" />
      </g>
    );
  }
  if (emotion === 'surprised') {
    return (
      <g>
        <circle cx="76" cy="99" r="9" fill="#FFFDF9" stroke={outlineColor} strokeWidth="2.3" />
        <circle cx="76" cy="99" r="4.5" fill={irisColor} />
        <circle cx="74" cy="97" r="1.8" fill="#FFFFFF" />
        <circle cx="124" cy="99" r="9" fill="#FFFDF9" stroke={outlineColor} strokeWidth="2.3" />
        <circle cx="124" cy="99" r="4.5" fill={irisColor} />
        <circle cx="122" cy="97" r="1.8" fill="#FFFFFF" />
      </g>
    );
  }
  return (
    <g>
      <circle cx="76" cy="99" r="8.5" fill={irisColor} />
      <circle cx="73" cy="96" r="3" fill="#FFFDF9" />
      <circle cx="79" cy="102" r="1.5" fill="#FFFDF9" />
      <circle cx="124" cy="99" r="8.5" fill={irisColor} />
      <circle cx="121" cy="96" r="3" fill="#FFFDF9" />
      <circle cx="127" cy="102" r="1.5" fill="#FFFDF9" />
    </g>
  );
};

const CatMouth: React.FC<{
  emotion: GuestEmotion;
  strokeColor?: string;
  noseColor?: string;
}> = ({ emotion, strokeColor = INK, noseColor = '#EC92A6' }) => (
  <g>
    <path d="M95 109 Q100 107 105 109 L100 114 Z" fill={noseColor} />
    {emotion === 'happy' ? (
      <g>
        <path
          d="M91 116 Q96 122 100 116 Q104 122 109 116"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M95 119 Q100 128 105 119 Z" fill="#F08DA5" />
      </g>
    ) : emotion === 'no_coffee' ? (
      <path
        d="M90 120 Q95 115 100 120 Q105 115 110 120"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    ) : emotion === 'surprised' ? (
      <ellipse
        cx="100"
        cy="121"
        rx="5.2"
        ry="6.2"
        fill="#F08DA5"
        stroke={strokeColor}
        strokeWidth="2.1"
      />
    ) : (
      <path
        d="M91 116 Q96 121 100 115 Q104 121 109 116"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    )}
  </g>
);

export const GuestCharacterSvg: React.FC<GuestCharacterSvgProps> = ({
  guestId,
  emotion,
  className = 'w-40 h-40',
}) => {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 200 190"
      className={`${className} overflow-visible drop-shadow-[0_8px_12px_rgba(90,62,50,0.14)]`}
      role="img"
      aria-label="Акварельний гість кав’ярні"
    >
      <defs>
        <radialGradient id={`blush-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F29BAE" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#F29BAE" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`puh-fur-${uid}`} cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="100%" stopColor="#F5EBDF" />
        </radialGradient>
        <radialGradient id={`persyk-fur-${uid}`} cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F7BE7C" />
          <stop offset="100%" stopColor="#E69A54" />
        </radialGradient>
        <radialGradient id={`luna-fur-${uid}`} cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#E48A49" />
          <stop offset="100%" stopColor="#B85B2A" />
        </radialGradient>
        <radialGradient id={`marsel-fur-${uid}`} cx="42%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#D9A86C" />
          <stop offset="100%" stopColor="#A97442" />
        </radialGradient>
        <radialGradient id={`sofiya-fur-${uid}`} cx="42%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#C89B73" />
          <stop offset="100%" stopColor="#A67650" />
        </radialGradient>
        <radialGradient id={`miya-fur-${uid}`} cx="42%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFF9EE" />
          <stop offset="100%" stopColor="#EFE0CB" />
        </radialGradient>
      </defs>

      {/* 1. КОШЕНЯ ПУХ — Fluffy White Watercolor Kitten */}
      {guestId === 'puh' && (
        <g>
          <ellipse cx="100" cy="164" rx="46" ry="34" fill={`url(#puh-fur-${uid})`} stroke="#8B6F60" strokeWidth="2.6" />
          <path d="M84 142 Q92 152 100 144 Q108 152 116 142" fill="#FFFDF9" stroke="#C5AF9F" strokeWidth="2" />
          <path d="M55 72 L49 32 L82 54 Z" fill={`url(#puh-fur-${uid})`} stroke="#8B6F60" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M58 65 L55 42 L75 56 Z" fill="#F5CCD4" />
          <path d="M145 72 L151 32 L118 54 Z" fill={`url(#puh-fur-${uid})`} stroke="#8B6F60" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M142 65 L145 42 L125 56 Z" fill="#F5CCD4" />
          <ellipse cx="100" cy="98" rx="54" ry="46" fill={`url(#puh-fur-${uid})`} stroke="#8B6F60" strokeWidth="2.6" />
          <path d="M91 53 Q97 41 103 52 Q110 43 112 54" fill="#FFFDF9" stroke="#8B6F60" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M46 100 Q39 104 47 110" fill="#FFFDF9" stroke="#8B6F60" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M154 100 Q161 104 153 110" fill="#FFFDF9" stroke="#8B6F60" strokeWidth="2.3" strokeLinecap="round" />
          <ellipse cx="62" cy="112" rx="12" ry="8" fill={`url(#blush-${uid})`} />
          <ellipse cx="138" cy="112" rx="12" ry="8" fill={`url(#blush-${uid})`} />
          <g stroke="#9E8272" strokeWidth="1.9" strokeLinecap="round">
            <line x1="36" y1="106" x2="54" y2="108" />
            <line x1="38" y1="115" x2="55" y2="114" />
            <line x1="164" y1="106" x2="146" y2="108" />
            <line x1="162" y1="115" x2="145" y2="114" />
          </g>
          <CatEyes emotion={emotion} />
          <CatMouth emotion={emotion} />
          <path d="M76 143 Q100 154 124 143" fill="none" stroke="#EDA3B5" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="100" cy="152" r="6" fill="#F5DA8D" stroke="#A67E3B" strokeWidth="1.8" />
          <ellipse cx="70" cy="176" rx="14" ry="10" fill="#FFFDF9" stroke="#8B6F60" strokeWidth="2.5" />
          <ellipse cx="130" cy="176" rx="14" ry="10" fill="#FFFDF9" stroke="#8B6F60" strokeWidth="2.5" />
        </g>
      )}

      {/* 2. КІТ ПЕРСИК — Chubby Honey-Ginger Watercolor Cat */}
      {guestId === 'persyk' && (
        <g>
          <ellipse cx="100" cy="164" rx="54" ry="36" fill={`url(#persyk-fur-${uid})`} stroke={INK} strokeWidth="2.6" />
          <ellipse cx="100" cy="168" rx="31" ry="24" fill="#FAF0DE" />
          <path d="M52 72 L46 34 L82 55 Z" fill={`url(#persyk-fur-${uid})`} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M56 66 L53 45 L73 57 Z" fill="#F6C3B8" />
          <path d="M148 72 L154 34 L118 55 Z" fill={`url(#persyk-fur-${uid})`} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M144 66 L147 45 L127 57 Z" fill="#F6C3B8" />
          <ellipse cx="100" cy="99" rx="58" ry="47" fill={`url(#persyk-fur-${uid})`} stroke={INK} strokeWidth="2.6" />
          <ellipse cx="100" cy="117" rx="26" ry="18" fill="#FCF3E4" />
          <g fill="#CC793D" opacity="0.88">
            <rect x="96" y="54" width="8" height="17" rx="4" />
            <rect x="83" y="57" width="7" height="14" rx="3.5" transform="rotate(-12 86 64)" />
            <rect x="110" y="57" width="7" height="14" rx="3.5" transform="rotate(12 114 64)" />
            <rect x="44" y="96" width="14" height="5" rx="2.5" />
            <rect x="45" y="106" width="12" height="5" rx="2.5" />
            <rect x="142" y="96" width="14" height="5" rx="2.5" />
            <rect x="143" y="106" width="12" height="5" rx="2.5" />
          </g>
          <ellipse cx="62" cy="113" rx="12" ry="7.5" fill={`url(#blush-${uid})`} />
          <ellipse cx="138" cy="113" rx="12" ry="7.5" fill={`url(#blush-${uid})`} />
          <g stroke="#7C4E2E" strokeWidth="1.9" strokeLinecap="round">
            <line x1="34" y1="112" x2="54" y2="113" />
            <line x1="36" y1="120" x2="55" y2="119" />
            <line x1="166" y1="112" x2="146" y2="113" />
            <line x1="164" y1="120" x2="145" y2="119" />
          </g>
          <CatEyes emotion={emotion} />
          <CatMouth emotion={emotion} noseColor="#DF7B6E" />
          <ellipse cx="66" cy="176" rx="15" ry="10" fill="#FAF0DE" stroke={INK} strokeWidth="2.5" />
          <ellipse cx="134" cy="176" rx="15" ry="10" fill="#FAF0DE" stroke={INK} strokeWidth="2.5" />
        </g>
      )}

      {/* 3. ЛИСИЧКА ЛУНА — Dreamy Russet-Auburn Woodland Fox with Pink Bow & Moon Pendant */}
      {guestId === 'luna' && (
        <g>
          <ellipse cx="100" cy="166" rx="44" ry="34" fill={`url(#luna-fur-${uid})`} stroke={INK} strokeWidth="2.5" />
          <ellipse cx="100" cy="168" rx="24" ry="24" fill="#FCF3E4" />
          <path d="M77 143 Q100 153 123 143" fill="none" stroke="#ECA2B7" strokeWidth="5" strokeLinecap="round" />
          <path d="M102 149 A5.5 5.5 0 1 0 102 159 A4.2 4.2 0 1 1 102 149 Z" fill="#F8D87B" stroke="#9E6E24" strokeWidth="1" />
          {/* Tall pointed fox ears with dark espresso tips */}
          <path d="M56 76 L46 22 L85 55 Z" fill={`url(#luna-fur-${uid})`} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M51 39 L46 22 L62 36 Z" fill="#462C1E" />
          <path d="M60 68 L54 38 L76 57 Z" fill="#FBF0DF" />
          <path d="M144 76 L154 22 L115 55 Z" fill={`url(#luna-fur-${uid})`} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M149 39 L154 22 L138 36 Z" fill="#462C1E" />
          <path d="M140 68 L146 38 L124 57 Z" fill="#FBF0DF" />
          {/* Fox head + fluffy cream cheeks */}
          <ellipse cx="100" cy="99" rx="51" ry="44" fill={`url(#luna-fur-${uid})`} stroke={INK} strokeWidth="2.5" />
          <path d="M50 106 Q72 98 100 118 Q128 98 150 106 Q142 138 100 142 Q58 138 50 106 Z" fill="#FCF3E4" />
          {/* Dusty-pink ribbon bow */}
          <g transform="translate(65, 64) rotate(-18)">
            <ellipse cx="-10" cy="0" rx="10" ry="7" fill="#F2A4B9" stroke="#8C4E62" strokeWidth="1.8" />
            <ellipse cx="10" cy="0" rx="10" ry="7" fill="#F2A4B9" stroke="#8C4E62" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="4.5" fill="#FCE0E7" stroke="#8C4E62" strokeWidth="1.6" />
          </g>
          <ellipse cx="64" cy="113" rx="11" ry="6.5" fill={`url(#blush-${uid})`} />
          <ellipse cx="136" cy="113" rx="11" ry="6.5" fill={`url(#blush-${uid})`} />
          {emotion === 'waiting' ? (
            <g>
              <circle cx="76" cy="98" r="9" fill="#E8A93E" stroke={INK} strokeWidth="1.4" />
              <circle cx="76" cy="98" r="4.8" fill={INK} />
              <circle cx="73" cy="95" r="2.4" fill="#FFFDF9" />
              <circle cx="124" cy="98" r="9" fill="#E8A93E" stroke={INK} strokeWidth="1.4" />
              <circle cx="124" cy="98" r="4.8" fill={INK} />
              <circle cx="121" cy="95" r="2.4" fill="#FFFDF9" />
            </g>
          ) : (
            <CatEyes emotion={emotion} />
          )}
          <CatMouth emotion={emotion} strokeColor={INK} noseColor="#5A3524" />
          <ellipse cx="72" cy="176" rx="13" ry="9.5" fill="#C46A34" stroke={INK} strokeWidth="2.4" />
          <ellipse cx="128" cy="176" rx="13" ry="9.5" fill="#C46A34" stroke={INK} strokeWidth="2.4" />
        </g>
      )}

      {/* 4. ВЕДМЕДИК МАРСЕЛЬ — Dignified Honey-Brown Bear Gentleman in Burgundy Velvet Bow-Tie */}
      {guestId === 'marsel' && (
        <g>
          <ellipse cx="100" cy="166" rx="56" ry="36" fill={`url(#marsel-fur-${uid})`} stroke={INK} strokeWidth="2.6" />
          {/* Rounded fuzzy bear ears */}
          <circle cx="56" cy="56" r="18" fill={`url(#marsel-fur-${uid})`} stroke={INK} strokeWidth="2.5" />
          <circle cx="56" cy="57" r="9.5" fill="#E6C39B" />
          <circle cx="144" cy="56" r="18" fill={`url(#marsel-fur-${uid})`} stroke={INK} strokeWidth="2.5" />
          <circle cx="144" cy="57" r="9.5" fill="#E6C39B" />
          {/* Bear head & warm cream muzzle */}
          <ellipse cx="100" cy="98" rx="56" ry="47" fill={`url(#marsel-fur-${uid})`} stroke={INK} strokeWidth="2.6" />
          <ellipse cx="100" cy="116" rx="26" ry="19" fill="#F4E2C8" />
          <ellipse cx="60" cy="113" rx="11" ry="7" fill={`url(#blush-${uid})`} />
          <ellipse cx="140" cy="113" rx="11" ry="7" fill={`url(#blush-${uid})`} />
          {emotion === 'waiting' ? (
            <g>
              <circle cx="76" cy="95" r="8.5" fill="#C46722" stroke={INK} strokeWidth="1.4" />
              <circle cx="76" cy="95" r="4.5" fill={INK} />
              <circle cx="73" cy="92" r="2.2" fill="#FFFDF9" />
              <circle cx="124" cy="95" r="8.5" fill="#C46722" stroke={INK} strokeWidth="1.4" />
              <circle cx="124" cy="95" r="4.5" fill={INK} />
              <circle cx="121" cy="92" r="2.2" fill="#FFFDF9" />
            </g>
          ) : (
            <CatEyes emotion={emotion} />
          )}
          <ellipse cx="100" cy="109" rx="9" ry="6" fill="#5A3A2B" />
          <path d="M90 120 Q100 127 110 120" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          {/* Burgundy Velvet Bow-Tie */}
          <g transform="translate(100, 150)">
            <path d="M-24 -11 L0 0 L-24 11 Q-28 0 -24 -11 Z" fill="#9E2D45" stroke={INK} strokeWidth="2" />
            <path d="M24 -11 L0 0 L24 11 Q28 0 24 -11 Z" fill="#9E2D45" stroke={INK} strokeWidth="2" />
            <rect x="-6" y="-6" width="12" height="12" rx="3.5" fill="#7D2034" stroke={INK} strokeWidth="1.8" />
          </g>
          <ellipse cx="64" cy="176" rx="15" ry="10" fill="#B8824E" stroke={INK} strokeWidth="2.5" />
          <ellipse cx="136" cy="176" rx="15" ry="10" fill="#B8824E" stroke={INK} strokeWidth="2.5" />
        </g>
      )}

      {/* 5. СОВА СОФІЯ — Sleepy Librarian Owl */}
      {guestId === 'sofiya' && (
        <g>
          <ellipse cx="100" cy="144" rx="54" ry="48" fill={`url(#sofiya-fur-${uid})`} stroke={INK} strokeWidth="2.6" />
          <ellipse cx="100" cy="154" rx="36" ry="34" fill="#FAF0DF" />
          <g fill="none" stroke="#CCA784" strokeWidth="2.1" strokeLinecap="round">
            <path d="M84 146 Q90 152 96 146" />
            <path d="M104 146 Q110 152 116 146" />
            <path d="M92 158 Q100 164 108 158" />
          </g>
          <ellipse cx="50" cy="150" rx="15" ry="26" transform="rotate(14 50 150)" fill="#9D724E" stroke={INK} strokeWidth="2.4" />
          <ellipse cx="150" cy="150" rx="15" ry="26" transform="rotate(-14 150 150)" fill="#9D724E" stroke={INK} strokeWidth="2.4" />
          <path d="M55 64 L44 36 L76 52 Z" fill="#9D724E" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M145 64 L156 36 L124 52 Z" fill="#9D724E" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="100" cy="92" rx="52" ry="44" fill={`url(#sofiya-fur-${uid})`} stroke={INK} strokeWidth="2.6" />
          <circle cx="77" cy="94" r="24" fill="#FCF0DC" />
          <circle cx="123" cy="94" r="24" fill="#FCF0DC" />
          <path d="M62 129 Q100 144 138 129" fill="none" stroke="#A6CEB3" strokeWidth="11" strokeLinecap="round" />
          <rect x="115" y="132" width="14" height="24" rx="5" fill="#8EBC9E" stroke={INK} strokeWidth="1.8" />

          {emotion === 'happy' ? (
            <g>
              <circle cx="77" cy="93" r="13.5" fill="#FFFDF9" stroke={INK} strokeWidth="2.2" />
              <circle cx="77" cy="93" r="8.2" fill={INK} />
              <circle cx="73.5" cy="89" r="3.4" fill="#FFFFFF" />
              <circle cx="81" cy="96" r="1.8" fill="#FFFFFF" />
              <circle cx="123" cy="93" r="13.5" fill="#FFFDF9" stroke={INK} strokeWidth="2.2" />
              <circle cx="123" cy="93" r="8.2" fill={INK} />
              <circle cx="119.5" cy="89" r="3.4" fill="#FFFFFF" />
              <circle cx="127" cy="96" r="1.8" fill="#FFFFFF" />
              <path d="M40 72 L43 79 L50 82 L43 85 L40 92 L37 85 L30 82 L37 79 Z" fill="#F2C85B" />
              <path d="M160 72 L163 79 L170 82 L163 85 L160 92 L157 85 L150 82 L157 79 Z" fill="#F2C85B" />
            </g>
          ) : emotion === 'surprised' ? (
            <g>
              <circle cx="77" cy="93" r="12" fill="#FFFDF9" stroke={INK} strokeWidth="2" />
              <circle cx="77" cy="94" r="5.5" fill={INK} />
              <circle cx="75" cy="91" r="2" fill="#FFFFFF" />
              <path d="M64 87 Q77 83 90 87" fill="#CCA37E" stroke={INK} strokeWidth="2" />
              <circle cx="123" cy="93" r="12" fill="#FFFDF9" stroke={INK} strokeWidth="2" />
              <circle cx="123" cy="94" r="5.5" fill={INK} />
              <circle cx="121" cy="91" r="2" fill="#FFFFFF" />
            </g>
          ) : (
            <g>
              <circle cx="77" cy="94" r="12" fill="#FFFDF9" stroke={INK} strokeWidth="1.8" />
              <circle cx="77" cy="97" r="6.5" fill={INK} />
              <circle cx="75" cy="95" r="1.8" fill="#FFFFFF" />
              <path d="M64 94 A13 13 0 0 1 90 94 Z" fill="#C49A74" stroke={INK} strokeWidth="2" />
              <circle cx="123" cy="94" r="12" fill="#FFFDF9" stroke={INK} strokeWidth="1.8" />
              <circle cx="123" cy="97" r="6.5" fill={INK} />
              <circle cx="121" cy="95" r="1.8" fill="#FFFFFF" />
              <path d="M110 94 A13 13 0 0 1 136 94 Z" fill="#C49A74" stroke={INK} strokeWidth="2" />
              <text x="155" y="64" fontSize="17" fontWeight="700" fill="#9E7654" className="animate-zzz-1" style={{ fontFamily: "'Caveat', cursive" }}>
                z
              </text>
            </g>
          )}

          <g fill="none" stroke="#BC6B79" strokeWidth="3.1">
            <circle cx="77" cy="94" r="17" />
            <circle cx="123" cy="94" r="17" />
            <line x1="94" y1="94" x2="106" y2="94" />
          </g>
          <path d="M93 106 L107 106 L100 118 Z" fill="#EAA855" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          <ellipse cx="62" cy="110" rx="9" ry="6" fill={`url(#blush-${uid})`} />
          <ellipse cx="138" cy="110" rx="9" ry="6" fill={`url(#blush-${uid})`} />
        </g>
      )}

      {/* 6. КРОЛИЦЯ МІЯ — Creamy Watercolor Bunny */}
      {guestId === 'miya' && (
        <g>
          <g transform="translate(76, 36) rotate(-10)">
            <ellipse cx="0" cy="0" rx="14" ry="38" fill={`url(#miya-fur-${uid})`} stroke="#9C7A60" strokeWidth="2.6" />
            <ellipse cx="0" cy="4" rx="7.5" ry="26" fill="#F5C7D2" />
          </g>
          <g transform="translate(125, 38) rotate(14)">
            <ellipse cx="0" cy="0" rx="14" ry="37" fill={`url(#miya-fur-${uid})`} stroke="#9C7A60" strokeWidth="2.6" />
            <ellipse cx="0" cy="4" rx="7.5" ry="25" fill="#F5C7D2" />
          </g>
          <ellipse cx="100" cy="166" rx="46" ry="34" fill={`url(#miya-fur-${uid})`} stroke="#9C7A60" strokeWidth="2.6" />
          <path d="M75 144 Q100 155 125 144" fill="none" stroke="#A6CEB3" strokeWidth="6" strokeLinecap="round" />
          <circle cx="100" cy="152" r="5" fill="#F5DA82" stroke="#9A743B" strokeWidth="1.5" />
          <ellipse cx="100" cy="105" rx="52" ry="43" fill={`url(#miya-fur-${uid})`} stroke="#9C7A60" strokeWidth="2.6" />
          <ellipse cx="64" cy="116" rx="12" ry="7.5" fill={`url(#blush-${uid})`} />
          <ellipse cx="136" cy="116" rx="12" ry="7.5" fill={`url(#blush-${uid})`} />
          <g transform="translate(0, 4)">
            <CatEyes emotion={emotion} />
          </g>
          <g transform="translate(0, 4)">
            <ellipse cx="100" cy="110" rx="5.4" ry="3.8" fill="#EC92A6" />
            {emotion === 'happy' ? (
              <path d="M92 117 Q96 123 100 116 Q104 123 108 117" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
            ) : emotion === 'surprised' ? (
              <circle cx="100" cy="121" r="5" fill="#F08DA5" stroke={INK} strokeWidth="2" />
            ) : (
              <path d="M93 117 Q96.5 121 100 116 Q103.5 121 107 117" fill="none" stroke={INK} strokeWidth="2.3" strokeLinecap="round" />
            )}
          </g>
          <ellipse cx="72" cy="176" rx="13" ry="9.5" fill="#FAF0E2" stroke="#9C7A60" strokeWidth="2.5" />
          <ellipse cx="128" cy="176" rx="13" ry="9.5" fill="#FAF0E2" stroke="#9C7A60" strokeWidth="2.5" />
        </g>
      )}

      {/* 7. КОТИК-МАНДРІВНИК — Fallback Traveler Cat */}
      {guestId === 'mandrivnyk' && (
        <g>
          {/* Backpack behind shoulders */}
          <rect x="44" y="128" width="112" height="52" rx="16" fill="#B68356" stroke={INK} strokeWidth="2.6" />
          <ellipse cx="100" cy="164" rx="48" ry="34" fill="#F8E2BF" stroke={INK} strokeWidth="2.6" />
          {/* Ears */}
          <path d="M54 74 L48 34 L82 56 Z" fill="#F3D19E" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M146 74 L152 34 L118 56 Z" fill="#F3D19E" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          {/* Tiny Explorer Hat */}
          <ellipse cx="100" cy="54" rx="34" ry="9" fill="#D5AD74" stroke={INK} strokeWidth="2.4" />
          <path d="M76 52 Q100 22 124 52 Z" fill="#E3BC85" stroke={INK} strokeWidth="2.4" />
          <ellipse cx="100" cy="100" rx="54" ry="44" fill="#FAF0DE" stroke={INK} strokeWidth="2.6" />
          <ellipse cx="64" cy="113" rx="11" ry="7" fill={`url(#blush-${uid})`} />
          <ellipse cx="136" cy="113" rx="11" ry="7" fill={`url(#blush-${uid})`} />
          <CatEyes emotion={emotion} />
          <CatMouth emotion={emotion} />
          {/* Plaid Scarf */}
          <path d="M62 138 Q100 156 138 138 L134 156 Q100 170 66 156 Z" fill="#DF786C" stroke={INK} strokeWidth="2.4" />
        </g>
      )}

      {emotion === 'surprised' && <SurprisedAccent />}
      {emotion === 'no_coffee' && <NoCoffeeAccent />}
    </svg>
  );
};
