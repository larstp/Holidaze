import { API_BASE_URL, API_KEY } from '@/lib/constants/api';
import type { ApiErrorResponse, ApiResponse } from '@/types/api';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  token?: string;
};

export class ApiError extends Error {
  statusCode: number;
  details: ApiErrorResponse;

  constructor(statusCode: number, details: ApiErrorResponse) {
    super(details.errors?.[0]?.message ?? 'Something went wrong.');
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T> | null> {
  const { body, token, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  requestHeaders.set('Accept', 'application/json');
  if (body !== undefined)
    requestHeaders.set('Content-Type', 'application/json');
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
  if (API_KEY) requestHeaders.set('X-Noroff-API-Key', API_KEY);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return null;

  const responseBody = (await response.json()) as
    ApiResponse<T> | ApiErrorResponse;
  if (!response.ok) {
    throw new ApiError(response.status, responseBody as ApiErrorResponse);
  }

  return responseBody as ApiResponse<T>;
}
