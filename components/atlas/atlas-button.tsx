import * as Haptics from 'expo-haptics';
import { type ReactNode } from 'react';
import { Pressable, type ViewStyle } from 'react-native';

import { AtlasFonts } from '@/constants/atlas-theme';
import { AtlasText } from '@/components/atlas/atlas-text';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';

export type AtlasButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function AtlasButton({
  label,
  onPress,
  variant = 'primary',
  leftIcon,
  rightIcon,
  disabled = false,
  accessibilityLabel,
  style,
}: AtlasButtonProps) {
  const { c, radius } = useAtlasTheme();
  const isPrimary = variant === 'primary';

  function handlePress() {
    void Haptics.impactAsync(
      isPrimary ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
    ).catch(() => {});
    onPress();
  }

  const base: ViewStyle = {
    width: '100%',
    minHeight: isPrimary ? 56 : 48,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 18,
    backgroundColor: isPrimary ? c.gold : 'transparent',
    borderWidth: isPrimary ? 0 : 1,
    borderColor: c.goldBorder,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [base, pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] }, style]}>
      {leftIcon}
      <AtlasText
        tone={isPrimary ? 'onGold' : 'gold'}
        style={{
          fontFamily: AtlasFonts.displaySemi,
          fontSize: isPrimary ? 16 : 14,
          letterSpacing: 0.3,
        }}>
        {label}
      </AtlasText>
      {rightIcon}
    </Pressable>
  );
}
