export interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  cancel: () => void;
}

/**
 * Creates a debounced version of a function that delays invoking the function
 * until after `wait` milliseconds have elapsed since the last time it was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the function with a cancel method
 */
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): DebouncedFunction<Args> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Args): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };

  debounced.cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

export default debounce;
