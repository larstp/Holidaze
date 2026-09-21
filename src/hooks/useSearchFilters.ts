import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const amenity = searchParams
    .getAll('amenity')
    .flatMap((value) => value.split(',').filter(Boolean));
  const city = searchParams.get('city');
  const country = searchParams.get('country');
  const dateFrom = searchParams.get('dateFrom') ?? '';
  const dateTo = searchParams.get('dateTo') ?? '';
  const page = Number(searchParams.get('page') ?? '1');
  const [draftAmenity, setDraftAmenity] = useState(amenity);
  const [draftCity, setDraftCity] = useState(city ?? '');
  const [draftCountry, setDraftCountry] = useState(country ?? '');
  const [draftDateFrom, setDraftDateFrom] = useState(dateFrom);
  const [draftDateTo, setDraftDateTo] = useState(dateTo);

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
    setDraftAmenity((currentAmenities) =>
      currentAmenities.includes(value)
        ? currentAmenities.filter((amenityValue) => amenityValue !== value)
        : [...currentAmenities, value]
    );
  };

  const updateDateRange = (nextDateFrom: string, nextDateTo: string) => {
    setDraftDateFrom(nextDateFrom);
    setDraftDateTo(
      nextDateFrom && nextDateTo && nextDateTo <= nextDateFrom ? '' : nextDateTo
    );
  };

  const applyFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    resetPage(nextParams);
    const trimmedCity = draftCity.trim();
    const trimmedCountry = draftCountry.trim();

    if (trimmedCity) nextParams.set('city', trimmedCity);
    else nextParams.delete('city');

    if (trimmedCountry) nextParams.set('country', trimmedCountry);
    else nextParams.delete('country');

    if (draftAmenity.length > 0)
      nextParams.set('amenity', draftAmenity.join(','));
    else nextParams.delete('amenity');

    if (draftDateFrom) nextParams.set('dateFrom', draftDateFrom);
    else nextParams.delete('dateFrom');

    if (draftDateTo) nextParams.set('dateTo', draftDateTo);
    else nextParams.delete('dateTo');

    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    ['q', 'amenity', 'city', 'country', 'dateFrom', 'dateTo', 'page'].forEach(
      (key) => nextParams.delete(key)
    );
    setQuery('');
    setDraftAmenity([]);
    setDraftCity('');
    setDraftCountry('');
    setDraftDateFrom('');
    setDraftDateTo('');
    setSearchParams(nextParams);
  };

  return {
    amenity,
    city,
    country,
    dateFrom,
    dateTo,
    draftAmenity,
    draftCity,
    draftCountry,
    draftDateFrom,
    draftDateTo,
    setDraftCity,
    setDraftCountry,
    page,
    query,
    setQuery,
    submitQuery,
    toggleAmenity,
    updateDateRange,
    applyFilters,
    clearFilters,
    setPage: (nextPage: number) => {
      const nextParams = new URLSearchParams(searchParams);
      if (nextPage <= 1) nextParams.delete('page');
      else nextParams.set('page', String(nextPage));
      setSearchParams(nextParams);
    },
  };
}
