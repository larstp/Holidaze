import { API_ENDPOINTS } from '@/lib/constants/api';
import { apiRequest } from '@/lib/services/apiClient';
import type {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
} from '@/types/api';

export function getBookings(query = '', token: string) {
  return apiRequest<Booking[]>(`${API_ENDPOINTS.bookings}${query}`, { token });
}

export function getBooking(id: string, query = '', token: string) {
  return apiRequest<Booking>(`${API_ENDPOINTS.bookings}/${id}${query}`, {
    token,
  });
}

export function createBooking(payload: CreateBookingRequest, token: string) {
  return apiRequest<Booking>(API_ENDPOINTS.bookings, {
    method: 'POST',
    body: payload,
    token,
  });
}

export function updateBooking(
  id: string,
  payload: UpdateBookingRequest,
  token: string
) {
  return apiRequest<Booking>(`${API_ENDPOINTS.bookings}/${id}`, {
    method: 'PUT',
    body: payload,
    token,
  });
}

export function deleteBooking(id: string, token: string) {
  return apiRequest<never>(`${API_ENDPOINTS.bookings}/${id}`, {
    method: 'DELETE',
    token,
  });
}
