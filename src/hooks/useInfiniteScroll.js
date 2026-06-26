import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(callback, hasMore) {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        callback();
      }
    },
    [callback, hasMore]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  return loadMoreRef;
}
