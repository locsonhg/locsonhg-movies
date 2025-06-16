import { useState } from "react";
import { ImageService } from "@/services";

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const SimpleImage = ({
  src,
  alt,
  className = "",
  fallbackSrc,
}: SimpleImageProps) => {
  const [imageSrc, setImageSrc] = useState(() => {
    const normalizedSrc = ImageService.normalizeUrl(src);
    return normalizedSrc || fallbackSrc || ImageService.getFallbackUrl();
  });

  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      const fallback = fallbackSrc || ImageService.getFallbackUrl();
      setImageSrc(fallback);
      setHasError(true);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    const normalizedSrc = ImageService.normalizeUrl(src);
    setImageSrc(normalizedSrc || fallbackSrc || ImageService.getFallbackUrl());
  };

  return (
    <div className="relative">
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${hasError ? "opacity-75" : ""}`}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />

      {/* Retry button for errors */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
          <button
            onClick={handleRetry}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
          >
            ↻
          </button>
        </div>
      )}
    </div>
  );
};
