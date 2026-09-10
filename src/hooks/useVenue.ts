import { useEffect, useState } from 'react';
import { getVenue } from '@/lib/services/venueService';
import type { Venue } from '@/types/api';

type UseVenueResult = {
  venue: Venue | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useVenue(id: string | undefined): UseVenueResult {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    let isCurrentRequest = true;

    getVenue(id, '?_owner=true&_bookings=true')
      .then((response) => {
        if (isCurrentRequest) setVenue(response?.data ?? null);
      })
      .catch((requestError: unknown) => {
        if (isCurrentRequest) {
          setError(
            requestError instanceof Error
              ? requestError
              : new Error('Unable to load this venue.')
          );
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [id, reloadKey]);

  return {
    venue,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      setReloadKey((currentKey) => currentKey + 1);
    },
  };
}
