import { useEffect, useState } from 'react';
import { searchVenues } from '@/lib/services/venueService';
import type { Venue } from '@/types/api';

type UseSearchVenuesResult = {
  venues: Venue[];
  pageCount: number;
  currentPage: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useSearchVenues(
  query: string,
  page = 1,
  limit = 15
): UseSearchVenuesResult {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [isLoading, setIsLoading] = useState(Boolean(query));
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!query) return;

    let isCurrentRequest = true;

    searchVenues(query, true, page, limit)
      .then((response) => {
        if (isCurrentRequest) {
          setVenues(response?.data ?? []);
          setPageCount(response?.meta.pageCount ?? 1);
          setCurrentPage(response?.meta.currentPage ?? page);
        }
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
  }, [query, page, limit, reloadKey]);

  return {
    venues,
    pageCount,
    currentPage,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setReloadKey((currentKey) => currentKey + 1);
    },
  };
}
