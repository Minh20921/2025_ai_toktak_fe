import { useRef, useState } from 'react';

type FetchCallback<T> = (data: T) => void;

export function useMultiDebouncedFetcher<T>(fetcher: (url: string) => Promise<T>, delay = 500) {
  const timeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const fetchDebounced = (id: string, url: string, cb: FetchCallback<T>) => {
    // Clear old timeout
    if (timeoutRef.current[id]) clearTimeout(timeoutRef.current[id]);

    // Set loading = true
    setLoadingMap((prev) => ({ ...prev, [id]: true }));

    // Create new timeout
    timeoutRef.current[id] = setTimeout(async () => {
      try {
        const res = await fetcher(url);
        cb(res);
      } catch (e) {
        console.error(`Error fetching for id: ${id}`, e);
      } finally {
        setLoadingMap((prev) => ({ ...prev, [id]: false }));
      }
    }, delay);
  };

  return {
    fetchDebounced,
    loadingMap,
  };
}
