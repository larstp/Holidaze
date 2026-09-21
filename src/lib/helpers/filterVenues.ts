import type { Venue } from '@/types/api';

export type VenueFilters = {
  amenity: string[];
  city: string | null;
  country: string | null;
  dateFrom?: string;
  dateTo?: string;
};

export function filterVenues(venues: Venue[], filters: VenueFilters): Venue[] {
  return venues.filter((venue) => {
    const normalize = (value: string) => value.trim().toLowerCase();
    const matchesAmenity = filters.amenity.every(
      (amenity) => venue.meta[amenity as keyof Venue['meta']] === true
    );
    const matchesCity = filters.city
      ? normalize(venue.location.city ?? '') === normalize(filters.city)
      : true;
    const matchesCountry = filters.country
      ? normalize(venue.location.country ?? '') === normalize(filters.country)
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
