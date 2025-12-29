/**
 * Formats a price value with appropriate decimal places
 * @param value - The price value to format
 * @returns Formatted price string (e.g., "$1,234.56" or "$0.000123")
 */
export const formatPrice = (value: number): string => {
  if (value >= 1) {
    return `$${value.toFixed(2)}`;
  }
  return `$${value.toFixed(6)}`;
};

/**
 * Formats large numbers with appropriate suffixes (K, M, B, T)
 * @param value - The number value as a string
 * @returns Formatted number string (e.g., "$1.23B", "$456.78M")
 */
export const formatLargeNumber = (value: string): string => {
  const num = parseFloat(value);
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
};

/**
 * Extracts the file extension from a URL
 * @param url - The URL to extract extension from
 * @returns The file extension in lowercase (e.g., "svg", "png", "jpg")
 */
export const getFileExtension = (url: string): string => {
  if (!url) return "";
  const match = url.match(/\.([^.?#]+)(\?|#|$)/);
  return match ? match[1].toLowerCase() : "";
};

/**
 * Converts SVG URLs to PNG URLs for better compatibility
 * @param url - The image URL (may be SVG)
 * @returns The URL with .svg replaced by .png
 */
export const getImageUrl = (url: string): string => {
  if (!url) return "";
  return url.replace(/\.svg$/i, ".png");
};

