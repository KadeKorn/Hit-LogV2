import { View } from 'react-native';

import { useAtlasTheme } from '@/hooks/use-atlas-theme';

export type WaypointState = 'done' | 'next' | 'empty';

export type WaypointProps = {
  state?: WaypointState;
  size?: number;
};

/** A single waypoint dot — done (gold), next (gold with ring), or empty (outline). */
export function Waypoint({ state = 'empty', size = 14 }: WaypointProps) {
  const { c } = useAtlasTheme();

  if (state === 'next') {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: c.gold,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: c.gold,
          shadowOpacity: 0.6,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 0 },
        }}>
        <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size, backgroundColor: c.bg }} />
      </View>
    );
  }

  if (state === 'done') {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.gold }} />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: c.dotEmpty,
        borderWidth: 2,
        borderColor: c.dotEmptyBorder,
      }}
    />
  );
}
