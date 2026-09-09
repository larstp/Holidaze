import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import PageLoader from '../../components/PageLoader/PageLoader';
import VenueCard from '../../components/VenueCard/VenueCard';
import { useSearchVenues } from '../../hooks/useSearchVenues';
import { useSearchFilters } from '../../hooks/useSearchFilters';
import { useVenues } from '../../hooks/useVenues';
import { filterVenues } from '../../lib/helpers/filterVenues';
import styles from './Search.module.css';

const amenityOptions = [
  ['wifi', 'Wi-Fi'],
  ['parking', 'Parking'],
  ['breakfast', 'Breakfast'],
  ['pets', 'Pet friendly'],
] as const;

function Search() {
  const {
    amenity,
    city,
    country,
    dateFrom,
    dateTo,
    query,
    setQuery,
    submitQuery,
    toggleAmenity,
    updateDateRange,
  } = useSearchFilters();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLElement>(null);
  const searchResult = useSearchVenues(query);
  const venueResult = useVenues('', true);
  const sourceVenues = query ? searchResult.venues : venueResult.venues;
  const isLoading = query ? searchResult.isLoading : venueResult.isLoading;
  const error = query ? searchResult.error : venueResult.error;
  const today = new Date().toISOString().split('T')[0];
  const dateRangeError = dateFrom && dateTo && dateTo < dateFrom;
  const filteredVenues = filterVenues(sourceVenues, {
    amenity,
    city,
    country,
    dateFrom,
    dateTo,
  });

  useEffect(() => {
    if (!isFiltersOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setIsFiltersOpen(false);
      }
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
        {isFiltersOpen && (
          <button
            className={styles.filterBackdrop}
            type="button"
            aria-label="Close filters"
            onClick={() => setIsFiltersOpen(false)}
          />
        )}
        <aside
          ref={filtersRef}
          className={`${styles.filters} ${isFiltersOpen ? styles.filtersOpen : ''}`}
        >
          <div className={styles.filterHeader}>
            <h2>Filters</h2>
            <Button
              type="button"
              variant="light"
              size="small"
              onClick={() => setIsFiltersOpen(false)}
            >
              Close
            </Button>
          </div>
          <fieldset>
            <legend>Dates</legend>
            <div className={styles.dateFilters}>
              <label className={styles.dateField}>
                Check-in
                <input
                  type="date"
                  value={dateFrom}
                  min={today}
                  onChange={(event) =>
                    updateDateRange(event.target.value, dateTo)
                  }
                />
              </label>
              <label className={styles.dateField}>
                Check-out
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || today}
                  onChange={(event) =>
                    updateDateRange(dateFrom, event.target.value)
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
                  checked={amenity === value}
                  onChange={() => toggleAmenity(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>
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
                {city || country || amenity || query || 'Explore stays'}
              </h1>
            </div>
            <Button
              className={styles.filterButton}
              variant="light"
              size="small"
              icon={<SlidersHorizontal size={16} aria-hidden="true" />}
              type="button"
              onClick={() => setIsFiltersOpen(true)}
            >
              Filters
            </Button>
          </div>

          {isLoading && <PageLoader label="Finding your next destination" />}
          {error && (
            <div className={styles.status} role="alert">
              <p>We could not load these stays.</p>
              <Button
                className={styles.statusButton}
                variant="secondary"
                size="small"
                type="button"
                onClick={query ? searchResult.refetch : venueResult.refetch}
              >
                Try again
              </Button>
            </div>
          )}
          {!isLoading && !error && filteredVenues.length === 0 && (
            <p className={styles.status}>No venues match these filters.</p>
          )}
          {!isLoading && !error && filteredVenues.length > 0 && (
            <div className={styles.grid}>
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Search;
