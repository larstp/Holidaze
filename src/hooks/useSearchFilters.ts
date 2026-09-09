import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const amenity = searchParams.get('amenity');
  const city = searchParams.get('city');
  const country = searchParams.get('country');
  const dateFrom = searchParams.get('dateFrom') ?? '';
  const dateTo = searchParams.get('dateTo') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const resetPage = (params: URLSearchParams) => {
    params.delete('page');
  };

  const submitQuery = () => {
    const nextParams = new URLSearchParams(searchParams);
    resetPage(nextParams);
    const trimmedQuery = query.trim();

    if (trimmedQuery) nextParams.set('q', trimmedQuery);
    else nextParams.delete('q');

    setSearchParams(nextParams);
  };

  const toggleAmenity = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    resetPage(nextParams);

    if (nextParams.get('amenity') === value) {
      nextParams.delete('amenity');
    } else {
      nextParams.set('amenity', value);
    }

    setSearchParams(nextParams);
  };

  const updateDateRange = (nextDateFrom: string, nextDateTo: string) => {
    const nextParams = new URLSearchParams(searchParams);
    resetPage(nextParams);

    if (nextDateFrom) nextParams.set('dateFrom', nextDateFrom);
    else nextParams.delete('dateFrom');

    if (nextDateTo) nextParams.set('dateTo', nextDateTo);
    else nextParams.delete('dateTo');

    setSearchParams(nextParams);
  };

  return {
    amenity,
    city,
    country,
    dateFrom,
    dateTo,
    page,
    query,
    setQuery,
    submitQuery,
    toggleAmenity,
    updateDateRange,
    setPage: (nextPage: number) => {
      const nextParams = new URLSearchParams(searchParams);
      if (nextPage <= 1) nextParams.delete('page');
      else nextParams.set('page', String(nextPage));
      setSearchParams(nextParams);
    },
  };
}
