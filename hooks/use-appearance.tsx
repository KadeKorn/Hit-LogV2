import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

import type { AtlasScheme } from '@/constants/atlas-theme';

export type AppearancePreference = 'system' | 'dark' | 'light';

const STORAGE_KEY = 'lift-atlas:appearance-preference';

/** Read the saved appearance preference. Defaults to `system`. */
export async function loadAppearancePreference(): Promise<AppearancePreference> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value === 'dark' || value === 'light' || value === 'system') {
      return value;
    }
  } catch {
    // ignore read errors — fall back to system
  }
  return 'system';
}

type AppearanceContextValue = {
  /** The user's chosen preference. */
  preference: AppearancePreference;
  /** Update + persist the preference. */
  setPreference: (next: AppearancePreference) => void;
  /** The effective scheme after resolving `system` against the device. */
  scheme: AtlasScheme;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({
  initialPreference = 'system',
  children,
}: {
  initialPreference?: AppearancePreference;
  children: ReactNode;
}) {
  const device = useDeviceColorScheme();
  const [preference, setPreferenceState] = useState<AppearancePreference>(initialPreference);

  const setPreference = useCallback((next: AppearancePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // ignore write errors — in-memory selection still applies this session
    });
  }, []);

  const scheme: AtlasScheme =
    preference === 'system' ? (device === 'light' ? 'light' : 'dark') : preference;

  const value = useMemo<AppearanceContextValue>(
    () => ({ preference, setPreference, scheme }),
    [preference, setPreference, scheme]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

/**
 * Access the current appearance. Outside the provider it safely falls back to
 * the device color scheme so system behavior is never broken.
 */
export function useAppearance(): AppearanceContextValue {
  const ctx = useContext(AppearanceContext);
  const device = useDeviceColorScheme();

  if (ctx) {
    return ctx;
  }

  return {
    preference: 'system',
    setPreference: () => {},
    scheme: device === 'light' ? 'light' : 'dark',
  };
}
