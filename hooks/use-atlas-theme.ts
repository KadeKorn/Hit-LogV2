import {
  AtlasColors,
  AtlasFonts,
  AtlasRadius,
  AtlasSpacing,
  type AtlasPalette,
  type AtlasScheme,
} from '@/constants/atlas-theme';
import { useAppearance } from '@/hooks/use-appearance';

export type AtlasTheme = {
  scheme: AtlasScheme;
  c: AtlasPalette;
  fonts: typeof AtlasFonts;
  radius: typeof AtlasRadius;
  spacing: typeof AtlasSpacing;
};

/**
 * Lift Atlas theme hook. The effective scheme comes from the Appearance
 * preference (System / Dark Atlas / Light Atlas) so theme changes apply
 * everywhere immediately.
 */
export function useAtlasTheme(): AtlasTheme {
  const { scheme } = useAppearance();

  return {
    scheme,
    c: AtlasColors[scheme],
    fonts: AtlasFonts,
    radius: AtlasRadius,
    spacing: AtlasSpacing,
  };
}
