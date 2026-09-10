import { createContext } from 'react';

type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (accessToken: string | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
