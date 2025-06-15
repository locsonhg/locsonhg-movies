import { useState, useEffect } from "react";
import type { LoadingState } from "@/types";

interface UseAsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

/**
 * Custom hook for handling async operations
 */
export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): UseAsyncState<T> => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: "idle",
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    setState((prev) => ({ ...prev, loading: "loading", error: null }));

    asyncFunction()
      .then((data) => {
        if (isMounted) {
          setState({ data, loading: "success", error: null });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            loading: "error",
            error: error.message || "An error occurred",
          }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
};
