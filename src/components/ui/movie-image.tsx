import { LazyImage } from "./lazy-image";

interface MovieImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  showLoadingSkeleton?: boolean;
}

export const MovieImage = ({
  src,
  alt,
  className = "",
  priority = false,
  showLoadingSkeleton = true,
}: MovieImageProps) => {
  // Helper function to get full image URL
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `https://phimimg.com/${url}`;
  };

  return (
    <div className={`relative ${className}`}>
      {showLoadingSkeleton && (
        <div className="absolute inset-0 bg-gray-700 image-loading rounded-lg" />
      )}
      <LazyImage
        src={getImageUrl(src)}
        alt={alt}
        className="w-full h-full object-cover rounded-lg"
        fallbackSrc="https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Image"
        placeholder="https://via.placeholder.com/300x450/374151/9CA3AF?text=Loading..."
        priority={priority}
      />
    </div>
  );
};
