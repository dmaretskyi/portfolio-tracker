import { useCallback, useEffect, useState } from "react";

export function useAsync<T>(asyncFunction: () => Promise<T>, deps: readonly any[] = []) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setValue(undefined);
    setError(undefined);
    asyncFunction()
      .then(
        (response) => {
        setValue(response);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
  }, deps);
  return { value, loading, error };
};