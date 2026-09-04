import type { Venue } from '@/types/api';

export type PopularDestination = {
  city: string;
  country: string;
  count: number;
  image: Venue['media'][number] | undefined;
};

export function selectRandomVenues(venues: Venue[], limit: number): Venue[] {
  const shuffledVenues = [...venues];

  for (let index = shuffledVenues.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledVenues[index], shuffledVenues[randomIndex]] = [
      shuffledVenues[randomIndex],
      shuffledVenues[index],
    ];
  }

  return shuffledVenues.slice(0, limit);
}

export function getPopularDestinations(
  venues: Venue[],
  limit: number
): PopularDestination[] {
  const destinations = new Map<string, PopularDestination>();

  venues.forEach((venue) => {
    const city = venue.location.city?.trim();
    const country = venue.location.country?.trim();

    if (!city || !country) return;

    const key = `${city.toLocaleLowerCase()}|${country.toLocaleLowerCase()}`;
    const current = destinations.get(key);

    if (current) {
      current.count += 1;
      return;
    }

    destinations.set(key, {
      city,
      country,
      count: 1,
      image: venue.media[0],
    });
  });

  return [...destinations.values()]
    .sort((first, second) => second.count - first.count)
    .slice(0, limit);
}
