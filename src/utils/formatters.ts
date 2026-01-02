/**
 * Formats a price value with appropriate decimal places
 * @param value - The price value to format
 * @returns Formatted price string (e.g., "$1,234.56" or "$0.000123")
 */
export const formatPrice = (value: number): string => {
  // Handle invalid numbers (NaN, Infinity, etc.)
  if (!isFinite(value) || isNaN(value)) {
    return "$0.00";
  }
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
  // Handle invalid or empty values
  if (!value || value.trim() === "" || value.toLowerCase() === "n/a") {
    return "$0.00";
  }
  const num = parseFloat(value);
  // Handle invalid numbers (NaN, Infinity, etc.)
  if (!isFinite(num) || isNaN(num)) {
    return "$0.00";
  }
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
