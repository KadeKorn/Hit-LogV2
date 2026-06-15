/**
 * Lift Atlas — design tokens (source of truth)
 * ============================================
 * A cartographic training-navigation system: graphite/parchment surfaces,
 * gold as forward motion, steel-blue for secondary routes, topographic
 * contours as texture. Two appearance modes: Dark Atlas + Light Atlas.
 *
 * Palette derives from the Lift Atlas brand boards:
 *   Near Black #0B0D10 · Slate #141A22 · Gold/Amber #D4A24A
 *   Steel Blue #4A6B8C · Success #4C7A6B · Warning #B2604A
 */

export type AtlasScheme = 'light' | 'dark';

export type AtlasPalette = {
  // Surfaces
  bg: string; // deepest — screen background
  bgFrame: string; // device / nav chrome
  surface: string; // elevated card
  surfaceRaised: string; // featured / pressed card
  field: string; // recessed field inside a card
  cardBorder: string; // card hairline
  hairline: string; // internal row divider

  // Text
  text: string; // primary
  textStrong: string; // headlines / max contrast
  muted: string; // secondary
  faint: string; // tertiary / inactive

  // Gold accent (forward motion: active item, next waypoint, primary action)
  gold: string;
  goldBright: string;
  goldSoft: string; // gold-tinted text on the current surface
  goldTint: string; // translucent fill
  goldBorder: string; // translucent border
  onGold: string; // text/icon on a solid gold fill

  // Steel-blue secondary (alternate routes, informational)
  steel: string;
  steelSoft: string;
  steelTint: string;

  // Semantic
  success: string;
  warning: string;
  danger: string;

  // Route + waypoint motif
  routeDone: string;
  routeUpcoming: string;
  track: string;
  dotEmpty: string;
  dotEmptyBorder: string;

  // Topographic contours
  contourNear: string;
  contourFar: string;

  // Misc
  overlay: string;
};

const dark: AtlasPalette = {
  bg: '#0B0D10',
  bgFrame: '#0E1116',
  surface: '#141A22',
  surfaceRaised: '#1A222C',
  field: '#0E1217',
  cardBorder: '#232B35',
  hairline: '#1A2129',

  text: '#F6F4EE',
  textStrong: '#FFFFFF',
  muted: '#9AA1AB',
  faint: '#5F6B78',

  gold: '#D4A24A',
  goldBright: '#E6B65E',
  goldSoft: '#E8C887',
  goldTint: 'rgba(212,162,74,0.14)',
  goldBorder: 'rgba(212,162,74,0.40)',
  onGold: '#1A140A',

  steel: '#5E89B4',
  steelSoft: '#9DBEDD',
  steelTint: 'rgba(94,137,180,0.16)',

  success: '#5E9A82',
  warning: '#C2734F',
  danger: '#C25B4A',

  routeDone: '#D4A24A',
  routeUpcoming: '#3A434E',
  track: '#262C34',
  dotEmpty: '#0B0D10',
  dotEmptyBorder: '#3A424C',

  contourNear: '#233831',
  contourFar: '#18211C',

  overlay: 'rgba(0,0,0,0.55)',
};

const light: AtlasPalette = {
  bg: '#F2EBDB',
  bgFrame: '#E8DEC9',
  surface: '#FAF5EA',
  surfaceRaised: '#FFFFFF',
  field: '#F0E8D7',
  cardBorder: '#E0D5BD',
  hairline: '#E6DCC8',

  text: '#23292E',
  textStrong: '#161B1F',
  muted: '#6E665A',
  faint: '#9C9281',

  gold: '#C18A2E',
  goldBright: '#D4A24A',
  goldSoft: '#9C6E1E',
  goldTint: 'rgba(193,138,46,0.14)',
  goldBorder: 'rgba(193,138,46,0.45)',
  onGold: '#231806',

  steel: '#4A6B8C',
  steelSoft: '#3C5A78',
  steelTint: 'rgba(74,107,140,0.12)',

  success: '#4C7A6B',
  warning: '#B2604A',
  danger: '#B2503A',

  routeDone: '#C18A2E',
  routeUpcoming: '#CFC4AC',
  track: '#E0D5BD',
  dotEmpty: '#FAF5EA',
  dotEmptyBorder: '#C9BC9F',

  contourNear: '#E4D9C0',
  contourFar: '#EBE2CF',

  overlay: 'rgba(40,32,16,0.25)',
};

export const AtlasColors: Record<AtlasScheme, AtlasPalette> = { dark, light };

/**
 * Font families. Names match the @expo-google-fonts exports loaded in
 * app/_layout.tsx. If a face fails to load, RN falls back to the system font.
 */
export const AtlasFonts = {
  /** Sora — display / headings */
  display: 'Sora_700Bold',
  displaySemi: 'Sora_600SemiBold',
  displayExtra: 'Sora_800ExtraBold',
  /** Inter — body / UI */
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  /** Bebas Neue — big condensed eyebrows / numerals */
  condensed: 'BebasNeue_400Regular',
} as const;

export const AtlasRadius = {
  card: 20,
  sm: 16,
  xs: 14,
  field: 10,
  pill: 999,
} as const;

export const AtlasSpacing = {
  screenX: 20,
  gap: 16,
  gapSm: 10,
  cardPad: 18,
} as const;

export function getAtlasPalette(scheme: AtlasScheme | null | undefined): AtlasPalette {
  return AtlasColors[scheme ?? 'dark'];
}
