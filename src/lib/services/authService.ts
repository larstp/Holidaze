import { API_ENDPOINTS } from '@/lib/constants/api';
import { apiRequest } from '@/lib/services/apiClient';
import type {
  LoginProfile,
  LoginRequest,
  Profile,
  RegisterRequest,
} from '@/types/api';

export function registerUser(payload: RegisterRequest) {
  return apiRequest<Profile>(API_ENDPOINTS.register, {
    method: 'POST',
    body: payload,
  });
}

export function loginUser(payload: LoginRequest) {
  return apiRequest<LoginProfile>(API_ENDPOINTS.login, {
    method: 'POST',
    body: payload,
  });
}
