import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  AtlasColors,
  AtlasFonts,
  AtlasRadius,
  AtlasSpacing,
  type AtlasPalette,
  type AtlasScheme,
} from '@/constants/atlas-theme';

export type AtlasTheme = {
  scheme: AtlasScheme;
  c: AtlasPalette;
  fonts: typeof AtlasFonts;
  radius: typeof AtlasRadius;
  spacing: typeof AtlasSpacing;
};

/**
 * Lift Atlas theme hook. Dark Atlas is the brand default; falls back to the
 * device color scheme. An in-app appearance override (Dark/Light Atlas toggle)
 * is layered in via the Profile screen later.
 */
export function useAtlasTheme(): AtlasTheme {
  const scheme: AtlasScheme = useColorScheme() === 'light' ? 'light' : 'dark';

  return {
    scheme,
    c: AtlasColors[scheme],
    fonts: AtlasFonts,
    radius: AtlasRadius,
    spacing: AtlasSpacing,
  };
}
