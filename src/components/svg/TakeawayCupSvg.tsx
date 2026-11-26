import { motion } from 'framer-motion';
import React, { useId } from 'react';
import type {
  PlacedSticker,
  PreparedDrink,
  StickerId,
  TakeawayDecoration,
} from '../../types/game';

export const StickerIconSvg: React.FC<{
  stickerId: StickerId;
  className?: string;
}> = ({ stickerId, className = 'w-8 h-8' }) => {
  const isRare =
    stickerId === 'mushroom' ||
    stickerId === 'moon_cat' ||
    stickerId === 'clover' ||
    stickerId === 'butterfly' ||
    stickerId === 'pinecone';

  return (
    <svg
      viewBox="0 0 48 48"
      className={`${className} drop-shadow-[0_2px_3px_rgba(90,62,50,0.22)]`}
      aria-hidden="true"
    >
      {/* Cute white vinyl watercolor sticker backing (golden rim for rare Traveler stickers!) */}
      <circle
        cx="24"
        cy="24"
        r="21"
        fill={isRare ? '#FFFBEF' : '#FFFDF8'}
        stroke={isRare ? '#DFA53A' : '#E5D1BA'}
        strokeWidth={isRare ? '2.8' : '2'}
      />

      {stickerId === 'paw' && (
        <g fill="#EF8CA5" stroke="#5A3E32" strokeWidth="1.6">
          <ellipse cx="24" cy="29" rx="9" ry="7" />
          <circle cx="13.5" cy="19.5" r="3.6" />
          <circle cx="20.5" cy="15" r="3.8" />
          <circle cx="27.5" cy="15" r="3.8" />
          <circle cx="34.5" cy="19.5" r="3.6" />
        </g>
      )}

      {stickerId === 'heart' && (
        <path
          d="M24 36 C24 36 10 27 10 18.5 C10 13.8 13.8 10.5 18 10.5 C21 10.5 23 12.2 24 14.3 C25 12.2 27 10.5 30 10.5 C34.2 10.5 38 13.8 38 18.5 C38 27 24 36 24 36 Z"
          fill="#F27E9B"
          stroke="#5A3E32"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      )}

      {stickerId === 'crown' && (
        <g>
          <path
            d="M10 33 L12 16 L19 23 L24 13 L29 23 L36 16 L38 33 Z"
            fill="#F4CA5E"
            stroke="#5A3E32"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="26" r="2.6" fill="#F27E9B" />
          <circle cx="16.5" cy="27" r="2" fill="#8BC9A3" />
          <circle cx="31.5" cy="27" r="2" fill="#8BC9A3" />
        </g>
      )}

      {stickerId === 'star' && (
        <path
          d="M24 9 L28.4 18.2 L38.5 19.6 L31.2 26.7 L33 36.8 L24 32 L15 36.8 L16.8 26.7 L9.5 19.6 L19.6 18.2 Z"
          fill="#F7D366"
          stroke="#5A3E32"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      )}

      {stickerId === 'cat' && (
        <g>
          <path d="M13 21 L12 11 L20 16 Z" fill="#F5B87B" stroke="#5A3E32" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M35 21 L36 11 L28 16 Z" fill="#F5B87B" stroke="#5A3E32" strokeWidth="1.7" strokeLinejoin="round" />
          <ellipse cx="24" cy="26" rx="13" ry="11" fill="#F7C792" stroke="#5A3E32" strokeWidth="1.8" />
          <circle cx="19.5" cy="25" r="2" fill="#5A3E32" />
          <circle cx="28.5" cy="25" r="2" fill="#5A3E32" />
          <ellipse cx="16" cy="28" rx="2.4" ry="1.5" fill="#F294AA" />
          <ellipse cx="32" cy="28" rx="2.4" ry="1.5" fill="#F294AA" />
          <path d="M21 29 Q24 31.5 27 29" fill="none" stroke="#5A3E32" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}

      {stickerId === 'flower' && (
        <g>
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx="24"
              cy="15"
              rx="4.8"
              ry="7"
              transform={`rotate(${deg} 24 24)`}
              fill="#F8BDD0"
              stroke="#5A3E32"
              strokeWidth="1.4"
            />
          ))}
          <circle cx="24" cy="24" r="5.5" fill="#F5CE62" stroke="#5A3E32" strokeWidth="1.6" />
        </g>
      )}

      {stickerId === 'rainbow' && (
        <g fill="none" strokeLinecap="round">
          <path d="M11 31 A13 13 0 0 1 37 31" stroke="#F0839E" strokeWidth="3.6" />
          <path d="M14.5 31 A9.5 9.5 0 0 1 33.5 31" stroke="#F5C95F" strokeWidth="3.4" />
          <path d="M18 31 A6 6 0 0 1 30 31" stroke="#85C9A3" strokeWidth="3.4" />
          <circle cx="12" cy="32" r="3.6" fill="#FFFDF8" stroke="#9EB4C2" strokeWidth="1.4" />
          <circle cx="36" cy="32" r="3.6" fill="#FFFDF8" stroke="#9EB4C2" strokeWidth="1.4" />
        </g>
      )}

      {/* RARE STICKER 1: 🍄 Lucky Mushroom */}
      {stickerId === 'mushroom' && (
        <g>
          <path d="M19 25 L29 25 L31 36 Q24 38 17 36 Z" fill="#FAF0DF" stroke="#5A3E32" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10 26 C10 13 38 13 38 26 Z" fill="#E6695C" stroke="#5A3E32" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="18" cy="20" r="2.6" fill="#FFFDF8" />
          <circle cx="27" cy="18" r="3" fill="#FFFDF8" />
          <circle cx="32" cy="23" r="1.9" fill="#FFFDF8" />
        </g>
      )}

      {/* RARE STICKER 2: 🌙 Moon Cat */}
      {stickerId === 'moon_cat' && (
        <g>
          <path
            d="M27 11 A13 13 0 1 0 36 33 A10 10 0 1 1 27 11 Z"
            fill="#F6D569"
            stroke="#5A3E32"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <g transform="translate(26, 25) scale(0.55)">
            <path d="M-8 -4 L-9 -14 L-1 -9 Z" fill="#6F5B84" stroke="#5A3E32" strokeWidth="2.4" />
            <path d="M8 -4 L9 -14 L1 -9 Z" fill="#6F5B84" stroke="#5A3E32" strokeWidth="2.4" />
            <circle cx="0" cy="2" r="11" fill="#7D6894" stroke="#5A3E32" strokeWidth="2.4" />
            <circle cx="-4" cy="1" r="1.8" fill="#FCE283" />
            <circle cx="4" cy="1" r="1.8" fill="#FCE283" />
          </g>
        </g>
      )}

      {/* RARE STICKER 3: 🍀 Four-Leaf Clover */}
      {stickerId === 'clover' && (
        <g>
          <path d="M24 25 Q24 34 20 38" fill="none" stroke="#418A56" strokeWidth="2.2" strokeLinecap="round" />
          {[0, 90, 180, 270].map((deg) => (
            <ellipse
              key={deg}
              cx="24"
              cy="16.5"
              rx="5.2"
              ry="7"
              transform={`rotate(${deg} 24 23)`}
              fill="#72C488"
              stroke="#3B7A4D"
              strokeWidth="1.5"
            />
          ))}
          <circle cx="24" cy="23" r="2.2" fill="#DDF5E2" />
        </g>
      )}

      {/* RARE STICKER 4: 🦋 Magical Butterfly */}
      {stickerId === 'butterfly' && (
        <g>
          <ellipse cx="16" cy="20" rx="7.5" ry="6" transform="rotate(-20 16 20)" fill="#9AD0EE" stroke="#5A3E32" strokeWidth="1.6" />
          <ellipse cx="32" cy="20" rx="7.5" ry="6" transform="rotate(20 32 20)" fill="#9AD0EE" stroke="#5A3E32" strokeWidth="1.6" />
          <ellipse cx="18" cy="29" rx="5.5" ry="4.5" transform="rotate(15 18 29)" fill="#F3B2CA" stroke="#5A3E32" strokeWidth="1.6" />
          <ellipse cx="30" cy="29" rx="5.5" ry="4.5" transform="rotate(-15 30 29)" fill="#F3B2CA" stroke="#5A3E32" strokeWidth="1.6" />
          <rect x="22.4" y="15" width="3.2" height="17" rx="1.6" fill="#5A3E32" />
          <path d="M23 15 Q19 10 17 12 M25 15 Q29 10 31 12" fill="none" stroke="#5A3E32" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      )}

      {/* RARE STICKER 5: 🌰 Lucky Pinecone */}
      {stickerId === 'pinecone' && (
        <g>
          <path
            d="M24 12 C32 14 34 25 30 34 C27 37 21 37 18 34 C14 25 16 14 24 12 Z"
            fill="#A86E43"
            stroke="#5A3E32"
            strokeWidth="1.8"
          />
          <path
            d="M18 21 Q24 24 30 21 M17 27 Q24 30 31 27 M19 32 Q24 35 29 32"
            fill="none"
            stroke="#6C3E1E"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M24 13 L18 9 L19 15 Z M24 13 L30 9 L29 15 Z" fill="#E36379" stroke="#5A3E32" strokeWidth="1.3" />
        </g>
      )}
    </svg>
  );
};

interface TakeawayCupSvgProps {
  drink: PreparedDrink;
  decoration?: TakeawayDecoration;
  className?: string;
  interactive?: boolean;
  onRemoveSticker?: (id: string) => void;
}

export const TakeawayCupSvg: React.FC<TakeawayCupSvgProps> = ({
  drink,
  decoration,
  className = 'w-44 h-56',
  interactive = false,
  onRemoveSticker,
}) => {
  const uid = useId().replace(/:/g, '');
  const isHot = drink.category === 'hot';
  const stickers: PlacedSticker[] = decoration?.stickers ?? drink.takeaway?.stickers ?? [];
  const wishText = decoration?.wishText ?? drink.takeaway?.wishText ?? '';

  // Determine cold drink fill gradient / color for clear domed takeaway cup
  let coldFill = '#C5ECDA';
  let isSunrise = false;
  let hasWhippedCream = false;
  if (drink.category === 'milkshake') {
    const hasSyrup = (drink.blenderIngredients.strawberrySyrup ?? 0) > 0;
    coldFill = hasSyrup ? '#F6A7C0' : '#FDF0D5';
    hasWhippedCream = drink.whippedCream;
  } else if (drink.category === 'cocktail') {
    const hasOrange = (drink.ingredients.orangeJuice ?? 0) > 0;
    const hasSyrup = (drink.ingredients.strawberrySyrup ?? 0) > 0;
    isSunrise = hasOrange && hasSyrup;
    if (hasOrange && !hasSyrup) coldFill = '#F6AE49';
    else if (hasSyrup && !hasOrange) coldFill = '#E76887';
    else coldFill = '#C8EEDB';
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 180 230"
        className="h-full w-full drop-shadow-[0_6px_10px_rgba(90,62,50,0.18)]"
        aria-label="Стаканчик із собою"
      >
        <defs>
          <clipPath id={`ta-cup-clip-${uid}`}>
            <path d="M40 66 L140 66 L127 204 Q126 212 114 212 L66 212 Q54 212 53 204 Z" />
          </clipPath>
          <linearGradient id={`ta-sunrise-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBB845" />
            <stop offset="52%" stopColor="#F58D4C" />
            <stop offset="100%" stopColor="#D63F5E" />
          </linearGradient>
        </defs>

        {isHot ? (
          <g>
            {/* Cozy Paper Coffee Cup Body */}
            <path
              d="M40 66 L140 66 L127 204 Q126 212 114 212 L66 212 Q54 212 53 204 Z"
              fill="#FAF1E1"
              stroke="#5A3E32"
              strokeWidth="3.2"
            />
            {/* Soft watercolor blush wash on cup */}
            <g clipPath={`url(#ta-cup-clip-${uid})`}>
              <ellipse cx="90" cy="198" rx="60" ry="26" fill="#F5D3DC" opacity="0.45" />
            </g>
            {/* Kraft Corrugated Protective Sleeve (Манжет) */}
            <path
              d="M43 114 L137 114 L131 168 L49 168 Z"
              fill="#D9A874"
              stroke="#5A3E32"
              strokeWidth="2.8"
            />
            <line x1="46" y1="122" x2="134" y2="122" stroke="#BC8854" strokeWidth="1.6" strokeDasharray="5 4" />
            <line x1="51" y1="160" x2="129" y2="160" stroke="#BC8854" strokeWidth="1.6" strokeDasharray="5 4" />

            {/* Cozy Pastel Sipping Lid */}
            <rect x="33" y="54" width="114" height="14" rx="7" fill="#FFFDF8" stroke="#5A3E32" strokeWidth="3" />
            <path
              d="M44 54 L52 38 L128 38 L136 54 Z"
              fill="#FDF7EC"
              stroke="#5A3E32"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Tiny heart lid plug */}
            <rect x="102" y="31" width="16" height="8" rx="3" fill="#F29EB4" stroke="#5A3E32" strokeWidth="2.2" />
          </g>
        ) : (
          <g>
            {/* Candy-striped straw sticking out of dome lid */}
            <g transform="rotate(10 92 48)">
              <rect x="86" y="4" width="10" height="125" rx="5" fill="#FFFDF9" stroke="#C86D86" strokeWidth="1.8" />
              <g fill="#EE839E">
                <rect x="86.5" y="14" width="9" height="8" />
                <rect x="86.5" y="30" width="9" height="8" />
                <rect x="86.5" y="46" width="9" height="8" />
              </g>
            </g>

            {/* Clear Iced Take-away Cup Body */}
            <path
              d="M40 66 L140 66 L127 204 Q126 212 114 212 L66 212 Q54 212 53 204 Z"
              fill="#FFFFFF"
              fillOpacity="0.65"
              stroke="#5A3E32"
              strokeWidth="3"
            />
            <g clipPath={`url(#ta-cup-clip-${uid})`}>
              <rect
                x="34"
                y="74"
                width="112"
                height="142"
                fill={isSunrise ? `url(#ta-sunrise-${uid})` : coldFill}
              />
              {/* Ice cubes / mint tint inside cold cup */}
              {drink.category === 'cocktail' && (drink.ingredients.ice ?? 0) > 0 && (
                <g fill="#FFFFFF" fillOpacity="0.58" stroke="#A6D9EA" strokeWidth="1.5">
                  <rect x="54" y="84" width="20" height="20" rx="4" transform="rotate(-10 64 94)" />
                  <rect x="92" y="88" width="20" height="20" rx="4" transform="rotate(14 102 98)" />
                </g>
              )}
              {drink.category === 'cocktail' && (drink.ingredients.mint ?? 0) > 0 && (
                <g fill="#57B57E" stroke="#2F754C" strokeWidth="1.3">
                  <ellipse cx="66" cy="186" rx="11" ry="6" transform="rotate(-24 66 186)" />
                  <ellipse cx="108" cy="182" rx="11" ry="6" transform="rotate(20 108 182)" />
                </g>
              )}
            </g>

            {/* Whipped cream inside dome lid for milkshake */}
            {hasWhippedCream && (
              <g>
                <ellipse cx="90" cy="64" rx="34" ry="12" fill="#FFFDFB" stroke="#DFC9BE" strokeWidth="1.6" />
                <ellipse cx="90" cy="54" rx="22" ry="10" fill="#FFFDFB" stroke="#DFC9BE" strokeWidth="1.5" />
                <circle cx="90" cy="43" r="5" fill="#EC6382" />
              </g>
            )}

            {/* Clear Dome Lid */}
            <path
              d="M42 66 A48 40 0 0 1 138 66 Z"
              fill="#FFFFFF"
              fillOpacity="0.45"
              stroke="#5A3E32"
              strokeWidth="2.8"
            />
            <rect x="34" y="60" width="112" height="10" rx="5" fill="#F4F9FB" stroke="#5A3E32" strokeWidth="2.6" />

            {/* Kraft Sleeve Band for Wish & Stickers */}
            <path
              d="M44 120 L136 120 L131 168 L49 168 Z"
              fill="#E2B684"
              fillOpacity="0.94"
              stroke="#5A3E32"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* Handwritten Wish Text on the Kraft Sleeve */}
        {wishText && (
          <text
            x="90"
            y="149"
            textAnchor="middle"
            fill="#4B2E1E"
            fontSize="16"
            fontWeight="700"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            {wishText}
          </text>
        )}

        {/* Glossy Cup Highlight */}
        <path
          d="M52 78 L59 198"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.48"
        />
      </svg>

      {/* Placed Watercolor Stickers overlaid cleanly on the cup */}
      {stickers.map((st) => (
        <motion.div
          key={st.id}
          initial={{ scale: 0.35, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            transform: `translate(-50%, -50%) rotate(${st.rotation}deg)`,
          }}
          className="absolute z-10"
        >
          {interactive && onRemoveSticker ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSticker(st.id);
              }}
              title="Натисни, щоб прибрати стікер"
              className="group relative transition-transform hover:scale-110 active:scale-90"
            >
              <StickerIconSvg stickerId={st.stickerId} className="h-9 w-9 sm:h-10 sm:w-10" />
            </button>
          ) : (
            <StickerIconSvg stickerId={st.stickerId} className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          )}
        </motion.div>
      ))}
    </div>
  );
};
