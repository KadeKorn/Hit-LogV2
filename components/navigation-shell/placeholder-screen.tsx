import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PlaceholderSection = {
  body: string;
  title: string;
};

type PlaceholderScreenProps = {
  eyebrow: string;
  intro: string;
  sections: PlaceholderSection[];
  title: string;
};

type PlaceholderPalette = {
  accent: string;
  border: string;
  muted: string;
  surface: string;
};

function getPalette(colorScheme: 'light' | 'dark'): PlaceholderPalette {
  if (colorScheme === 'light') {
    return {
      surface: '#F3F5F7',
      border: '#D5DDE5',
      muted: '#5E6A75',
      accent: '#0A7EA4',
    };
  }

  return {
    surface: '#171B20',
    border: '#2A3138',
    muted: '#93A0AB',
    accent: '#D7F75B',
  };
}

export function PlaceholderScreen({
  eyebrow,
  intro,
  sections,
  title,
}: PlaceholderScreenProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const palette = getPalette(colorScheme);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={[styles.eyebrow, { color: palette.accent }]}>
            {eyebrow}
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText style={[styles.intro, { color: palette.muted }]}>{intro}</ThemedText>
        </View>

        <View style={styles.sectionList}>
          {sections.map((section) => (
            <View
              key={section.title}
              style={[
                styles.sectionCard,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
              ]}>
              <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: theme.text }]}>
                {section.title}
              </ThemedText>
              <ThemedText style={[styles.sectionBody, { color: palette.muted }]}>
                {section.body}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.9,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  header: {
    gap: 6,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
  },
  screen: {
    flex: 1,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  sectionList: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
  },
});
