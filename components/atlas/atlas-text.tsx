import { Text, type TextProps, type TextStyle } from 'react-native';

import { AtlasFonts } from '@/constants/atlas-theme';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';

export type AtlasTextVariant =
  | 'h1' // screen title (Sora bold)
  | 'title' // section / card group title
  | 'cardTitle' // card heading
  | 'body' // default reading text (Inter)
  | 'bodyStrong'
  | 'label' // small UI label
  | 'micro' // uppercase eyebrow
  | 'stat' // numeric value
  | 'statLg' // large numeric value
  | 'condensed'; // Bebas Neue display moment

export type AtlasTone =
  | 'default'
  | 'strong'
  | 'muted'
  | 'faint'
  | 'gold'
  | 'steel'
  | 'success'
  | 'warning'
  | 'onGold';

export type AtlasTextProps = TextProps & {
  variant?: AtlasTextVariant;
  tone?: AtlasTone;
};

const VARIANT_STYLE: Record<AtlasTextVariant, TextStyle> = {
  h1: { fontFamily: AtlasFonts.display, fontSize: 28, lineHeight: 32, letterSpacing: -0.4 },
  title: { fontFamily: AtlasFonts.display, fontSize: 21, lineHeight: 26, letterSpacing: -0.2 },
  cardTitle: { fontFamily: AtlasFonts.displaySemi, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: AtlasFonts.body, fontSize: 15, lineHeight: 21 },
  bodyStrong: { fontFamily: AtlasFonts.bodySemi, fontSize: 15, lineHeight: 21 },
  label: { fontFamily: AtlasFonts.bodyMedium, fontSize: 13, lineHeight: 18 },
  micro: {
    fontFamily: AtlasFonts.bodySemi,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  stat: { fontFamily: AtlasFonts.display, fontSize: 22, lineHeight: 26 },
  statLg: { fontFamily: AtlasFonts.displayExtra, fontSize: 34, lineHeight: 36, letterSpacing: -0.6 },
  condensed: { fontFamily: AtlasFonts.condensed, fontSize: 30, lineHeight: 32, letterSpacing: 0.6 },
};

export function AtlasText({ variant = 'body', tone = 'default', style, ...rest }: AtlasTextProps) {
  const { c } = useAtlasTheme();

  const toneColor: Record<AtlasTone, string> = {
    default: c.text,
    strong: c.textStrong,
    muted: c.muted,
    faint: c.faint,
    gold: c.goldSoft,
    steel: c.steelSoft,
    success: c.success,
    warning: c.warning,
    onGold: c.onGold,
  };

  return <Text style={[VARIANT_STYLE[variant], { color: toneColor[tone] }, style]} {...rest} />;
}
