import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './authContextValue';

export { AuthContext } from './authContextValue';
const ACCESS_TOKEN_KEY = 'holidaze-access-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  const setAccessToken = (nextToken: string | null) => {
    if (nextToken) localStorage.setItem(ACCESS_TOKEN_KEY, nextToken);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
    setToken(nextToken);
  };

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      setAccessToken,
      logout: () => setAccessToken(null),
    }),
    [accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
