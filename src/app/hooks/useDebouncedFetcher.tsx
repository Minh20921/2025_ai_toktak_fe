import { useRef, useState } from 'react';

export function useDebouncedFetcher<T>(fetcher: (query: string) => Promise<T>, delay = 1000) {
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDebounced = (query: string, onResult: (data: T) => void) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setLoading(true);

      fetcher(query)
        .then((data) => onResult(data))
        .catch((err) => console.error('[Debounce Fetch Error]', err))
        .finally(() => setLoading(false));
    }, delay);
  };

  return {
    fetchDebounced,
    loading,
  };
}
