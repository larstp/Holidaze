import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import PageLoader from '../../components/PageLoader/PageLoader';
import VenueCard from '../../components/VenueCard/VenueCard';
import { useSearchVenues } from '../../hooks/useSearchVenues';
import { useAllVenues } from '../../hooks/useAllVenues';
import { useSearchFilters } from '../../hooks/useSearchFilters';
import { filterVenues } from '../../lib/helpers/filterVenues';
import { getNextDate, getToday } from '../../lib/helpers/dateHelpers';
import styles from './Search.module.css';

const amenityOptions = [
  ['wifi', 'Wi-Fi'],
  ['parking', 'Parking'],
  ['breakfast', 'Breakfast'],
  ['pets', 'Pet friendly'],
] as const;

const getAmenityLabels = (selectedAmenities: string[]) =>
  selectedAmenities
    .map(
      (value) =>
        amenityOptions.find(([optionValue]) => optionValue === value)?.[1] ??
        value
    )
    .join(', ');

function Search() {
  const {
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
    page,
    query,
    setQuery,
    submitQuery,
    toggleAmenity,
    updateDateRange,
    applyFilters,
    clearFilters,
    setDraftCity,
    setDraftCountry,
    setPage,
  } = useSearchFilters();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const filtersRef = useRef<HTMLElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const searchResult = useSearchVenues(query, page);
  const allVenueResult = useAllVenues(true);
  const sourceVenues = query ? searchResult.venues : allVenueResult.venues;
  const isLoading = query ? searchResult.isLoading : allVenueResult.isLoading;
  const error = query ? searchResult.error : allVenueResult.error;
  const filteredVenues = filterVenues(sourceVenues, {
    amenity,
    city,
    country,
    dateFrom,
    dateTo,
  });
  const pageCount = query
    ? searchResult.pageCount
    : Math.max(1, Math.ceil(filteredVenues.length / 15));
  const currentPage = query ? searchResult.currentPage : page;
  const today = getToday();
  const amenityHeading = getAmenityLabels(amenity);
  const dateRangeError =
    draftDateFrom && draftDateTo && draftDateTo < draftDateFrom;

  const closeFilters = () => setIsFiltersOpen(false);
  const openFilters = () => {
    setIsFiltersVisible(true);
    setIsFiltersOpen(true);
  };
  const displayedVenues = useMemo(
    () =>
      query ? filteredVenues : filteredVenues.slice((page - 1) * 15, page * 15),
    [filteredVenues, page, query]
  );

  useEffect(() => {
    if (isFiltersOpen) return;

    const timeoutId = window.setTimeout(() => setIsFiltersVisible(false), 220);
    return () => window.clearTimeout(timeoutId);
  }, [isFiltersOpen]);

  useEffect(() => {
    if (!isFiltersOpen) return;

    closeButtonRef.current?.focus();

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        filtersRef.current?.contains(target) ||
        filterTriggerRef.current?.contains(target)
      ) {
        return;
      }

      closeFilters();
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFiltersOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isFiltersOpen]);

  useEffect(() => {
    if (!isFiltersOpen) filterTriggerRef.current?.focus();
  }, [isFiltersOpen]);

  useEffect(() => {
    if (currentPage > 1) {
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [currentPage]);

  return (
    <main className={styles.page}>
      <section className={styles.searchBarSection}>
        <form
          className={styles.searchBar}
          onSubmit={(event) => {
            event.preventDefault();
            submitQuery();
          }}
        >
          <SearchIcon aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Where are you going?"
            aria-label="Search destinations"
          />
          <Button type="submit" variant="primary" size="small">
            Update
          </Button>
        </form>
      </section>

      <div className={styles.layout}>
        {isFiltersVisible && (
          <button
            className={styles.filterBackdrop}
            type="button"
            aria-label="Close filters"
            onClick={closeFilters}
          />
        )}
        <aside
          ref={filtersRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filters-heading"
          className={`${styles.filters} ${isFiltersOpen ? styles.filtersOpen : ''} ${isFiltersVisible && !isFiltersOpen ? styles.filtersClosing : ''}`}
        >
          <div className={styles.filterHeader}>
            <h2 id="filters-heading">Filters</h2>
            <Button
              ref={closeButtonRef}
              type="button"
              variant="tertiary"
              size="small"
              onClick={closeFilters}
            >
              Close
            </Button>
          </div>
          <Button
            className={styles.clearFiltersButton}
            type="button"
            variant="secondary"
            size="small"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
          <fieldset>
            <legend>Location</legend>
            <label className={styles.locationField}>
              City
              <input
                type="text"
                value={draftCity}
                onChange={(event) => setDraftCity(event.target.value)}
                placeholder="Cape Town"
              />
            </label>
            <label className={styles.locationField}>
              Country
              <input
                type="text"
                value={draftCountry}
                onChange={(event) => setDraftCountry(event.target.value)}
                placeholder="South Africa"
              />
            </label>
          </fieldset>
          <fieldset>
            <legend>Dates</legend>
            <div className={styles.dateFilters}>
              <label className={styles.dateField}>
                Check-in
                <input
                  type="date"
                  value={draftDateFrom}
                  min={today}
                  onChange={(event) =>
                    updateDateRange(event.target.value, draftDateTo)
                  }
                />
              </label>
              <label className={styles.dateField}>
                Check-out
                <input
                  type="date"
                  value={draftDateTo}
                  min={draftDateFrom ? getNextDate(draftDateFrom) : today}
                  onChange={(event) =>
                    updateDateRange(draftDateFrom, event.target.value)
                  }
                />
              </label>
            </div>
            {dateRangeError && (
              <p className={styles.dateError} role="alert">
                Check-out must be after check-in.
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>Amenities</legend>
            {amenityOptions.map(([value, label]) => (
              <label key={value}>
                <input
                  type="checkbox"
                  checked={draftAmenity.includes(value)}
                  onChange={() => toggleAmenity(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <Button
            className={styles.applyFiltersButton}
            type="button"
            variant="primary"
            size="small"
            disabled={Boolean(dateRangeError)}
            onClick={() => {
              applyFilters();
              closeFilters();
            }}
          >
            Update
          </Button>
        </aside>

        <section className={styles.results} aria-labelledby="results-heading">
          <div className={styles.resultsHeader}>
            <div>
              <p className={styles.resultCount}>
                {isLoading
                  ? 'Finding stays...'
                  : `${filteredVenues.length} venues`}
              </p>
              <h1 id="results-heading">
                {city || country || amenityHeading || query || 'Explore stays'}
              </h1>
            </div>
            <Button
              ref={filterTriggerRef}
              className={styles.filterButton}
              variant="tertiary"
              size="small"
              icon={<SlidersHorizontal size={16} aria-hidden="true" />}
              type="button"
              onClick={openFilters}
            >
              Filters
            </Button>
          </div>

          {isLoading && (
            <PageLoader label="Finding your next destination" overlay />
          )}
          {error && (
            <div className={styles.status} role="alert">
              <p>We could not load these stays.</p>
              <Button
                className={styles.statusButton}
                variant="secondary"
                size="small"
                type="button"
                onClick={query ? searchResult.refetch : allVenueResult.refetch}
              >
                Try again
              </Button>
            </div>
          )}
          {!isLoading && !error && filteredVenues.length === 0 && (
            <p className={styles.status}>No venues match these filters.</p>
          )}
          {!isLoading && !error && displayedVenues.length > 0 && (
            <div className={styles.grid}>
              {displayedVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
          {!isLoading && !error && pageCount > 1 && (
            <nav
              className={styles.pagination}
              aria-label="Search results pages"
            >
              <Button
                variant="secondary"
                size="small"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {pageCount}
              </span>
              <Button
                variant="secondary"
                size="small"
                disabled={currentPage >= pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}

export default Search;
