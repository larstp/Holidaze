import { API_ENDPOINTS } from '@/lib/constants/api';
import { apiRequest } from '@/lib/services/apiClient';
import type {
  Booking,
  Profile,
  UpdateProfileRequest,
  Venue,
} from '@/types/api';

export function getProfile(name: string, query = '', token: string) {
  return apiRequest<Profile>(`${API_ENDPOINTS.profiles}/${name}${query}`, {
    token,
  });
}

export function getProfileBookings(name: string, query = '', token: string) {
  return apiRequest<Booking[]>(
    `${API_ENDPOINTS.profiles}/${name}/bookings${query}`,
    { token }
  );
}

export function getProfileVenues(name: string, query = '', token: string) {
  return apiRequest<Venue[]>(
    `${API_ENDPOINTS.profiles}/${name}/venues${query}`,
    { token }
  );
}

export function updateProfile(
  name: string,
  payload: UpdateProfileRequest,
  token: string
) {
  return apiRequest<Profile>(`${API_ENDPOINTS.profiles}/${name}`, {
    method: 'PUT',
    body: payload,
    token,
  });
}
