import { useFetcher as useFetcherRemix } from "@remix-run/react";
import { useEffect, useRef } from "react";

// wrapper around Remix's useFetcher hook so it can be used in useEffect
export function useFetcher<TLoader extends unknown>(
  ...args: Parameters<typeof useFetcherRemix>
) {
  const fetcher = useFetcherRemix<TLoader>(...args);

  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  return [fetcherRef.current, fetcher];
}
