import { type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

import { AtlasText, type AtlasTone } from '@/components/atlas/atlas-text';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';

export type StatTileProps = {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  bordered?: boolean;
  align?: 'center' | 'left';
  valueTone?: AtlasTone;
  style?: ViewStyle;
};

export function StatTile({
  label,
  value,
  sub,
  icon,
  bordered = false,
  align = 'left',
  valueTone = 'strong',
  style,
}: StatTileProps) {
  const { c, radius } = useAtlasTheme();

  const container: ViewStyle = {
    flex: 1,
    gap: 5,
    alignItems: align === 'center' ? 'center' : 'flex-start',
    ...(bordered
      ? {
          backgroundColor: c.field,
          borderWidth: 1,
          borderColor: c.cardBorder,
          borderRadius: radius.sm,
          padding: 13,
        }
      : null),
  };

  return (
    <View style={[container, style]}>
      {icon ? <View style={{ marginBottom: 3 }}>{icon}</View> : null}
      <AtlasText variant="micro" tone="faint">
        {label}
      </AtlasText>
      <AtlasText variant="cardTitle" tone={valueTone}>
        {value}
      </AtlasText>
      {sub ? (
        <AtlasText variant="label" tone="muted">
          {sub}
        </AtlasText>
      ) : null}
    </View>
  );
}
