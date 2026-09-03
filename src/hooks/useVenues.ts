import { useEffect, useState } from 'react';
import { getVenues } from '@/lib/services/venueService';
import type { Venue } from '@/types/api';

type UseVenuesResult = {
  venues: Venue[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useVenues(query = ''): UseVenuesResult {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    getVenues(query)
      .then((response) => {
        if (isCurrentRequest) {
          setVenues(response?.data ?? []);
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrentRequest) {
          setError(
            requestError instanceof Error
              ? requestError
              : new Error('Unable to load venues.')
          );
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [query, reloadKey]);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((currentKey) => currentKey + 1);
  };

  return {
    venues,
    isLoading,
    error,
    refetch,
  };
}
