import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
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
    query,
    setQuery,
    submitQuery,
    toggleAmenity,
  } = useSearchFilters();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchResult = useSearchVenues(query);
  const venueResult = useVenues();
  const sourceVenues = query ? searchResult.venues : venueResult.venues;
  const isLoading = query ? searchResult.isLoading : venueResult.isLoading;
  const error = query ? searchResult.error : venueResult.error;
  const filteredVenues = filterVenues(sourceVenues, {
    amenity,
    city,
    country,
  });

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
          <button type="submit">Update</button>
        </form>
      </section>

      <div className={styles.layout}>
        <aside
          className={`${styles.filters} ${isFiltersOpen ? styles.filtersOpen : ''}`}
        >
          <div className={styles.filterHeader}>
            <h2>Filters</h2>
            <button type="button" onClick={() => setIsFiltersOpen(false)}>
              Close
            </button>
          </div>
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
            <button
              className={styles.filterButton}
              type="button"
              onClick={() => setIsFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filters
            </button>
          </div>

          {isLoading && <p className={styles.status}>Loading stays...</p>}
          {error && (
            <div className={styles.status} role="alert">
              <p>We could not load these stays.</p>
              <button
                type="button"
                onClick={query ? searchResult.refetch : venueResult.refetch}
              >
                Try again
              </button>
            </div>
          )}
          {!isLoading && !error && filteredVenues.length === 0 && (
            <p className={styles.status}>No stays match these filters.</p>
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
