import React, { useState } from 'react';

interface AssetIllustrationProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback: React.ReactNode;
}

/**
 * Renders the external watercolor illustration via `<picture>` (WebP first for fast mobile loads,
 * PNG fallback automatically). Falls back to built-in watercolor SVG if loading fails.
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

  const webpSrc = src.endsWith('.png') ? src.replace(/\.png$/, '.webp') : null;

  return (
    <div className={className}>
      <picture className="block h-full w-full">
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img
          src={src}
          alt={alt}
          className={imgClassName}
          draggable={false}
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      </picture>
    </div>
  );
};
