import { Pressable, View, type ViewStyle } from 'react-native';

import { AtlasText } from '@/components/atlas/atlas-text';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';

export type AtlasPillProps = {
  label: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  /** Filter-chip style: selected = solid gold. Status style: see `tone`. */
  selected?: boolean;
  onPress?: () => void;
  /** Status dot + tint. */
  tone?: 'gold' | 'steel' | 'success' | 'warning' | 'neutral';
  dot?: boolean;
  style?: ViewStyle;
};

export function AtlasPill({
  label,
  accessibilityLabel,
  disabled,
  selected,
  onPress,
  tone = 'neutral',
  dot = false,
  style,
}: AtlasPillProps) {
  const { c, radius } = useAtlasTheme();

  const toneColor =
    tone === 'gold'
      ? c.gold
      : tone === 'steel'
        ? c.steel
        : tone === 'success'
          ? c.success
          : tone === 'warning'
            ? c.warning
            : c.muted;

  // Selected (filter chip): solid gold fill with dark text.
  const selectedStyle: ViewStyle = {
    backgroundColor: c.gold,
    borderColor: c.gold,
  };
  const idleStyle: ViewStyle = {
    backgroundColor: tone === 'neutral' ? 'transparent' : c.goldTint,
    borderColor: c.cardBorder,
  };

  const base: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    ...(selected ? selectedStyle : idleStyle),
  };

  const content = (
    <>
      {dot ? (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: selected ? c.onGold : toneColor,
          }}
        />
      ) : null}
      <AtlasText
        variant="label"
        style={{ color: selected ? c.onGold : tone === 'neutral' ? c.muted : toneColor }}>
        {label}
      </AtlasText>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ selected: !!selected, disabled: !!disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [base, disabled && { opacity: 0.5 }, pressed && { opacity: 0.8 }, style]}>
        {content}
      </Pressable>
    );
  }

  return <View style={[base, style]}>{content}</View>;
}
