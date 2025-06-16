// Image service to handle image URLs and fallbacks
export class ImageService {
  private static baseUrl = "https://phimimg.com";

  // Generate SVG placeholder
  static generatePlaceholder(
    width = 300,
    height = 450,
    text = "No Image",
    bgColor = "#1f2937",
    textColor = "#ffffff"
  ): string {
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${bgColor}"/>
        <text x="${width / 2}" y="${
      height / 2
    }" fill="${textColor}" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="16">${text}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Generate loading placeholder
  static generateLoadingPlaceholder(width = 300, height = 450): string {
    return this.generatePlaceholder(
      width,
      height,
      "Loading...",
      "#374151",
      "#9ca3af"
    );
  }

  // Normalize image URL
  static normalizeUrl(url: string): string {
    if (!url) return this.generatePlaceholder();
    if (url.startsWith("http")) return url;
    if (url.startsWith("data:")) return url;
    return `${this.baseUrl}/${url}`;
  }

  // Get fallback image
  static getFallbackUrl(width = 300, height = 450): string {
    return this.generatePlaceholder(width, height);
  }

  // Check if URL is valid image
  static async validateImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;

      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  }

  // Get optimized image URL (for different sizes)
  static getOptimizedUrl(url: string): string {
    const normalizedUrl = this.normalizeUrl(url);

    // If it's our placeholder, return as is
    if (normalizedUrl.startsWith("data:")) return normalizedUrl;

    // For external URLs, just return the normalized URL
    // In the future, we could add image optimization service integration here
    return normalizedUrl;
  }

  // Generate blur data URL for smooth loading
  static generateBlurDataUrl(width = 10, height = 15): string {
    return this.generatePlaceholder(width, height, "", "#374151", "#374151");
  }
}
