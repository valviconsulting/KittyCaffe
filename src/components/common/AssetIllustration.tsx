import React, { useState } from 'react';

interface AssetIllustrationProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback: React.ReactNode;
}

/**
 * Renders the external watercolor PNG illustration directly as an <img>.
 * Automatically falls back to the built-in watercolor SVG only if the file fails to load.
 */
export const AssetIllustration: React.FC<AssetIllustrationProps> = ({
  src,
  alt,
  className = '',
  imgClassName = 'h-full w-full object-contain',
  fallback,
}) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasFailed = failedSrc === src;

  if (hasFailed) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        draggable={false}
        onError={() => setFailedSrc(src)}
      />
    </div>
  );
};
