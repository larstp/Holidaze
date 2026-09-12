import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Profile } from '@/types/api';
import { getProfile } from '@/lib/services/profileService';
import { AuthContext } from './authContextValue';

export { AuthContext } from './authContextValue';
const ACCESS_TOKEN_KEY = 'holidaze-access-token';
const PROFILE_KEY = 'holidaze-profile';

function readStoredProfile(): Profile | null {
  const storedProfile =
    localStorage.getItem(PROFILE_KEY) ?? sessionStorage.getItem(PROFILE_KEY);
  if (!storedProfile) return null;

  try {
    return JSON.parse(storedProfile) as Profile;
  } catch {
    return null;
  }
}

function getTokenProfileName(accessToken: string): string | null {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    ) as { name?: unknown };

    return typeof decodedPayload.name === 'string' ? decodedPayload.name : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setToken] = useState<string | null>(
    () =>
      localStorage.getItem(ACCESS_TOKEN_KEY) ??
      sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [profile, setProfileState] = useState<Profile | null>(
    readStoredProfile
  );

  const setAccessToken = (nextToken: string | null, rememberMe = true) => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    if (nextToken) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(ACCESS_TOKEN_KEY, nextToken);
    }
    setToken(nextToken);
  };

  const setProfile = (nextProfile: Profile | null, rememberMe = true) => {
    localStorage.removeItem(PROFILE_KEY);
    sessionStorage.removeItem(PROFILE_KEY);
    if (nextProfile) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
    }
    setProfileState(nextProfile);
  };

  useEffect(() => {
    if (!accessToken || profile) return;

    const profileName = getTokenProfileName(accessToken);
    if (!profileName) return;

    let isCurrentRequest = true;
    const rememberMe = Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));

    getProfile(profileName, '', accessToken)
      .then((response) => {
        if (isCurrentRequest && response?.data) {
          setProfile(response.data, rememberMe);
        }
      })
      .catch(() => undefined);

    return () => {
      isCurrentRequest = false;
    };
  }, [accessToken, profile]);

  const value = useMemo(
    () => ({
      accessToken,
      profile,
      isAuthenticated: Boolean(accessToken),
      setAccessToken,
      setProfile,
      logout: () => {
        setAccessToken(null);
        setProfile(null);
      },
    }),
    [accessToken, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
