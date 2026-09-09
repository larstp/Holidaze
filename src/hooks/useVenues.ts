import { useEffect, useState } from 'react';
import { getVenues } from '@/lib/services/venueService';
import type { Venue } from '@/types/api';

type UseVenuesResult = {
  venues: Venue[];
  venueCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useVenues(
  query = '',
  includeBookings = false
): UseVenuesResult {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueCount, setVenueCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    const separator = query ? '&' : '?';
    const bookingsQuery = includeBookings ? `${separator}_bookings=true` : '';

    getVenues(`${query}${bookingsQuery}`)
      .then((response) => {
        if (isCurrentRequest) {
          setVenues(response?.data ?? []);
          setVenueCount(
            response?.meta.totalCount ?? response?.data.length ?? 0
          );
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
  }, [query, includeBookings, reloadKey]);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((currentKey) => currentKey + 1);
  };

  return {
    venues,
    venueCount,
    isLoading,
    error,
    refetch,
  };
}
