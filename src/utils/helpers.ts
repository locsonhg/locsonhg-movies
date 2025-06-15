/**
 * Utility function to combine CSS classes
 */
export const cn = (
  ...classes: (string | undefined | null | boolean)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Utility function to debounce function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Utility function to generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
