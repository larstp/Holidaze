export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://v2.api.noroff.dev';

export const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export const API_ENDPOINTS = {
  register: '/auth/register',
  login: '/auth/login',
  venues: '/holidaze/venues',
  venueSearch: '/holidaze/venues/search',
  bookings: '/holidaze/bookings',
  profiles: '/holidaze/profiles',
  profileSearch: '/holidaze/profiles/search',
} as const;
