import { useEffect, useState } from 'react';
import { getVenues } from '@/lib/services/venueService';
import type { Venue } from '@/types/api';

type UseVenuesResult = {
  venues: Venue[];
  venueCount: number;
  pageCount: number;
  currentPage: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useVenues(
  query = '',
  includeBookings = false,
  page = 1,
  limit = 15
): UseVenuesResult {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueCount, setVenueCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    const params = new URLSearchParams(query.replace(/^\?/, ''));
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (includeBookings) params.set('_bookings', 'true');

    getVenues(`?${params.toString()}`)
      .then((response) => {
        if (isCurrentRequest) {
          setVenues(response?.data ?? []);
          setVenueCount(
            response?.meta.totalCount ?? response?.data.length ?? 0
          );
          setPageCount(response?.meta.pageCount ?? 1);
          setCurrentPage(response?.meta.currentPage ?? page);
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
  }, [query, includeBookings, page, limit, reloadKey]);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((currentKey) => currentKey + 1);
  };

  return {
    venues,
    venueCount,
    pageCount,
    currentPage,
    isLoading,
    error,
    refetch,
  };
}
