import type { Venue } from '@/types/api';

export type VenueFilters = {
  amenity: string | null;
  city: string | null;
  country: string | null;
};

export function filterVenues(venues: Venue[], filters: VenueFilters): Venue[] {
  return venues.filter((venue) => {
    const matchesAmenity = filters.amenity
      ? venue.meta[filters.amenity as keyof Venue['meta']] === true
      : true;
    const matchesCity = filters.city
      ? venue.location.city?.toLowerCase() === filters.city.toLowerCase()
      : true;
    const matchesCountry = filters.country
      ? venue.location.country?.toLowerCase() === filters.country.toLowerCase()
      : true;

    return matchesAmenity && matchesCity && matchesCountry;
  });
}
