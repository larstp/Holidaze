import type { Venue } from '@/types/api';

export type VenueFilters = {
  amenity: string | null;
  city: string | null;
  country: string | null;
  dateFrom?: string;
  dateTo?: string;
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
    const hasCompleteDateRange = Boolean(filters.dateFrom && filters.dateTo);
    const matchesAvailability = hasCompleteDateRange
      ? !(venue.bookings ?? []).some(
          (booking) =>
            booking.dateFrom < filters.dateTo! &&
            booking.dateTo > filters.dateFrom!
        )
      : true;

    return (
      matchesAmenity && matchesCity && matchesCountry && matchesAvailability
    );
  });
}
