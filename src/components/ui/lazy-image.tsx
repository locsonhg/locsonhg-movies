import { useState, useEffect, useRef } from "react";
import { ImageService } from "@/services";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

export const LazyImage = ({
  src,
  alt,
  className = "",
  fallbackSrc,
  placeholder,
  onLoad,
  onError,
  priority = false,
}: LazyImageProps) => {
  const defaultFallback = fallbackSrc || ImageService.getFallbackUrl();
  const defaultPlaceholder =
    placeholder || ImageService.generateLoadingPlaceholder();

  const [imageSrc, setImageSrc] = useState<string>(defaultPlaceholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const img = imgRef.current;
    if (!img) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.unobserve(img);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observerRef.current.observe(img);

    return () => {
      observerRef.current?.unobserve(img);
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Load image when in view
  useEffect(() => {
    if (!isInView || hasError) return;

    const normalizedSrc = ImageService.normalizeUrl(src);
    if (!normalizedSrc) {
      setImageSrc(defaultFallback);
      setHasError(true);
      onError?.();
      return;
    }

    const img = new Image();

    const handleLoad = () => {
      setImageSrc(normalizedSrc);
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setImageSrc(defaultFallback);
      setHasError(true);
      onError?.();
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = normalizedSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isInView, src, defaultFallback, onLoad, onError, hasError]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoaded(false);
    setIsInView(true);
  };

  return (
    <div className="relative">
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-60"
        } ${className}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />

      {/* Loading indicator */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Retry button for failed loads */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/70 rounded">
          <button
            onClick={handleRetry}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
};
