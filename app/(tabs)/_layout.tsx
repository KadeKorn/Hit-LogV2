import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { AtlasColors, AtlasFonts } from '@/constants/atlas-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const c = AtlasColors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.gold,
        tabBarInactiveTintColor: c.faint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: c.bgFrame,
          borderTopColor: c.hairline,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: AtlasFonts.bodyMedium,
          fontSize: 11,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'compass' : 'compass-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Atlas',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'map' : 'map-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Trail',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map-marker-path" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'chart-line' : 'chart-line-variant'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'cog' : 'cog-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
