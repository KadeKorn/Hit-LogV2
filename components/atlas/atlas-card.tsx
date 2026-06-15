import { type ReactNode } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { useAtlasTheme } from '@/hooks/use-atlas-theme';

export type AtlasCardProps = {
  children: ReactNode;
  variant?: 'default' | 'raised' | 'field';
  /** Highlight as the active / forward item with a gold hairline. */
  active?: boolean;
  padded?: boolean;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function AtlasCard({
  children,
  variant = 'default',
  active = false,
  padded = true,
  style,
  onPress,
  accessibilityLabel,
}: AtlasCardProps) {
  const { c, radius, spacing } = useAtlasTheme();

  const bg =
    variant === 'field' ? c.field : variant === 'raised' ? c.surfaceRaised : c.surface;

  const base: ViewStyle = {
    backgroundColor: bg,
    borderRadius: variant === 'field' ? radius.sm : radius.card,
    borderWidth: 1,
    borderColor: active ? c.goldBorder : c.cardBorder,
    padding: padded ? spacing.cardPad : 0,
    overflow: 'hidden',
  };

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [base, pressed && { opacity: 0.85 }, style as ViewStyle]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[base, style as ViewStyle]}>{children}</View>;
}
