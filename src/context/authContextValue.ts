import { createContext } from 'react';
import type { Profile } from '@/types/api';

type AuthContextValue = {
  accessToken: string | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  setAccessToken: (accessToken: string | null, rememberMe?: boolean) => void;
  setProfile: (profile: Profile | null, rememberMe?: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
