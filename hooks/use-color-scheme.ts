import { useAppearance } from '@/hooks/use-appearance';

/**
 * App-wide color scheme. Resolves the user's Appearance preference
 * (System / Dark Atlas / Light Atlas); `system` follows the device.
 */
export function useColorScheme(): 'light' | 'dark' {
  return useAppearance().scheme;
}
