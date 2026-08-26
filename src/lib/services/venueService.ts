import { API_ENDPOINTS } from '@/lib/constants/api';
import { apiRequest } from '@/lib/services/apiClient';
import type {
  CreateVenueRequest,
  UpdateVenueRequest,
  Venue,
} from '@/types/api';

export function getVenues(query = '') {
  return apiRequest<Venue[]>(`${API_ENDPOINTS.venues}${query}`);
}

export function searchVenues(query: string) {
  return apiRequest<Venue[]>(
    `${API_ENDPOINTS.venueSearch}?q=${encodeURIComponent(query)}`
  );
}

export function getVenue(id: string, query = '') {
  return apiRequest<Venue>(`${API_ENDPOINTS.venues}/${id}${query}`);
}

export function createVenue(payload: CreateVenueRequest, token: string) {
  return apiRequest<Venue>(API_ENDPOINTS.venues, {
    method: 'POST',
    body: payload,
    token,
  });
}

export function updateVenue(
  id: string,
  payload: UpdateVenueRequest,
  token: string
) {
  return apiRequest<Venue>(`${API_ENDPOINTS.venues}/${id}`, {
    method: 'PUT',
    body: payload,
    token,
  });
}

export function deleteVenue(id: string, token: string) {
  return apiRequest<never>(`${API_ENDPOINTS.venues}/${id}`, {
    method: 'DELETE',
    token,
  });
}
