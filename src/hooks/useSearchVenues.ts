import { useEffect, useState } from 'react';
import { searchVenues } from '@/lib/services/venueService';
import type { Venue } from '@/types/api';

type UseSearchVenuesResult = {
  venues: Venue[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useSearchVenues(query: string): UseSearchVenuesResult {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(query));
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!query) return;

    let isCurrentRequest = true;

    searchVenues(query)
      .then((response) => {
        if (isCurrentRequest) setVenues(response?.data ?? []);
      })
      .catch((requestError: unknown) => {
        if (isCurrentRequest) {
          setError(
            requestError instanceof Error
              ? requestError
              : new Error('Unable to search venues.')
          );
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [query, reloadKey]);

  return {
    venues,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setReloadKey((currentKey) => currentKey + 1);
    },
  };
}
