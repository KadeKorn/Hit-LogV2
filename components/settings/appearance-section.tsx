import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type ComponentProps } from 'react';
import { Pressable, View } from 'react-native';

import { AtlasCard, AtlasText } from '@/components/atlas';
import { useAppearance, type AppearancePreference } from '@/hooks/use-appearance';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type AppearanceOption = {
  key: AppearancePreference;
  label: string;
  description: string;
  icon: IconName;
};

const OPTIONS: AppearanceOption[] = [
  { key: 'system', label: 'System', description: 'Match your device setting', icon: 'cellphone' },
  { key: 'dark', label: 'Dark Atlas', description: 'Graphite & gold', icon: 'weather-night' },
  { key: 'light', label: 'Light Atlas', description: 'Parchment map', icon: 'white-balance-sunny' },
];

export function AppearanceSection() {
  const { c, radius } = useAtlasTheme();
  const { preference, setPreference } = useAppearance();

  function handleSelect(next: AppearancePreference) {
    if (next === preference) return;
    void Haptics.selectionAsync().catch(() => {});
    setPreference(next);
  }

  return (
    <AtlasCard>
      <AtlasText variant="micro" tone="gold">
        Appearance
      </AtlasText>
      <AtlasText variant="body" tone="muted" style={{ marginTop: 6, marginBottom: 14 }}>
        Choose how Lift Atlas looks. System follows your device.
      </AtlasText>

      <View style={{ gap: 10 }}>
        {OPTIONS.map((option) => {
          const selected = preference === option.key;
          return (
            <Pressable
              key={option.key}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              onPress={() => handleSelect(option.key)}
              style={({ pressed }) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 13,
                  padding: 13,
                  borderRadius: radius.field,
                  borderWidth: 1,
                  borderColor: selected ? c.goldBorder : c.cardBorder,
                  backgroundColor: selected ? c.goldTint : c.field,
                },
                pressed && { opacity: 0.85 },
              ]}>
              <MaterialCommunityIcons
                name={option.icon}
                size={22}
                color={selected ? c.gold : c.muted}
              />
              <View style={{ flex: 1 }}>
                <AtlasText variant="cardTitle" tone={selected ? 'strong' : 'default'}>
                  {option.label}
                </AtlasText>
                <AtlasText variant="label" tone="muted" style={{ marginTop: 1 }}>
                  {option.description}
                </AtlasText>
              </View>
              {selected ? (
                <MaterialCommunityIcons name="check-circle" size={22} color={c.gold} />
              ) : (
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 1.5,
                    borderColor: c.dotEmptyBorder,
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </AtlasCard>
  );
}
