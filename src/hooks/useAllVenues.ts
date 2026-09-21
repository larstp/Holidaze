import { useEffect, useState } from 'react';
import { getVenues } from '@/lib/services/venueService';
import type { Venue } from '@/types/api';

type UseAllVenuesResult = {
  venues: Venue[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

const PAGE_LIMIT = 100;

export function useAllVenues(includeBookings = false): UseAllVenuesResult {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadAllVenues() {
      try {
        const bookingsQuery = includeBookings ? '&_bookings=true' : '';
        const firstPage = await getVenues(
          `?page=1&limit=${PAGE_LIMIT}${bookingsQuery}`
        );
        const firstVenues = firstPage?.data ?? [];
        const pageCount = firstPage?.meta.pageCount ?? 1;

        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
            getVenues(`?page=${index + 2}&limit=${PAGE_LIMIT}${bookingsQuery}`)
          )
        );

        if (isCurrentRequest) {
          const allVenues = [
            ...firstVenues,
            ...remainingPages.flatMap((response) => response?.data ?? []),
          ].sort((firstVenue, secondVenue) => {
            const firstStartsWithLetter = /^[a-z]/i.test(firstVenue.name);
            const secondStartsWithLetter = /^[a-z]/i.test(secondVenue.name);

            if (firstStartsWithLetter !== secondStartsWithLetter) {
              return firstStartsWithLetter ? -1 : 1;
            }

            return firstVenue.name.localeCompare(secondVenue.name, undefined, {
              numeric: true,
              sensitivity: 'base',
            });
          });
          setVenues(allVenues);
        }
      } catch (requestError: unknown) {
        if (isCurrentRequest) {
          setError(
            requestError instanceof Error
              ? requestError
              : new Error('Unable to load venues.')
          );
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    void loadAllVenues();

    return () => {
      isCurrentRequest = false;
    };
  }, [includeBookings, reloadKey]);

  return {
    venues,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      setReloadKey((currentKey) => currentKey + 1);
    },
  };
}
