import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { bootstrapDatabase, resetDatabaseForFieldTestRecovery } from '@/db/bootstrap';
import { getDatabaseClient } from '@/db/client';
import { ExerciseLogRepository } from '@/db/repositories/exercise-log-repository';
import { TemplateRepository } from '@/db/repositories/template-repository';
import { WorkoutLogRepository } from '@/db/repositories/workout-log-repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDatabaseBootstrap } from '@/hooks/use-database-bootstrap';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { error, isReady } = useDatabaseBootstrap();
  const [isRecovering, setIsRecovering] = useState(false);
  const colorScheme = useColorScheme();
  const navigationTheme =
    colorScheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: Colors.dark.background,
            border: '#262C33',
            card: '#11151A',
            notification: Colors.dark.tint,
            primary: Colors.dark.tint,
            text: Colors.dark.text,
          },
        }
      : DefaultTheme;

  useEffect(() => {
    if (!isReady || error) return;

    (async () => {
      try {
        const db = await getDatabaseClient();

        const workoutRepo = new WorkoutLogRepository(db);
        const templateRepo = new TemplateRepository(db);
        const exerciseRepo = new ExerciseLogRepository(db);

        const latestOverall = await workoutRepo.getLatestCompletedWorkoutOverall();
        const latestPerTemplate = await workoutRepo.getLatestCompletedWorkoutsPerTemplate();
        const nextWorkout = await templateRepo.getNextRecommendedWorkoutDay();

        console.log('🔥 LATEST OVERALL:', latestOverall);
        console.log('🔥 LATEST PER TEMPLATE:', latestPerTemplate);
        console.log('🔥 NEXT WORKOUT:', nextWorkout);

        // Optional later:
        // const history = await exerciseRepo.getExerciseHistoryByTemplateExerciseId('seed-exercise-day1-chest-press');
        // console.log('🔥 HISTORY:', history);

        void exerciseRepo;
      } catch (err) {
        console.error('❌ DEBUG ERROR:', err);
      }
    })();
  }, [isReady, error]);

  async function handleResetLocalDatabase(): Promise<void> {
    Alert.alert(
      'Reset local data?',
      'This field-test recovery action deletes the local SQLite database and recreates it. Export a backup first if the app can still launch elsewhere.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          style: 'destructive',
          text: 'Reset local data',
          onPress: () => {
            setIsRecovering(true);
            resetDatabaseForFieldTestRecovery()
              .then(() => bootstrapDatabase())
              .then(() => {
                Alert.alert('Database reset complete', 'Close and relaunch the app.');
              })
              .catch((resetError) => {
                console.error('[db-startup] field-test reset failed', resetError);
                Alert.alert('Reset failed', 'Close and relaunch the app, then try again.');
              })
              .finally(() => {
                setIsRecovering(false);
              });
          },
        },
      ]
    );
  }

  if (error) {
    return (
      <View style={styles.startupErrorScreen}>
        <Text style={styles.startupErrorTitle}>Database initialization failed.</Text>
        <Text style={styles.startupErrorBody}>
          Export a backup if possible, then reset local data. Startup logs include the failing
          migration, seed, or foreign-key check step.
        </Text>
        <Text style={styles.startupErrorDetail}>{error.message}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={isRecovering}
          onPress={handleResetLocalDatabase}
          style={({ pressed }) => [
            styles.recoveryButton,
            (pressed || isRecovering) && styles.recoveryButtonPressed,
          ]}>
          <Text style={styles.recoveryButtonText}>
            {isRecovering ? 'Resetting...' : 'Field-test reset local database'}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="library/[templateId]" options={{ headerShown: false }} />
        <Stack.Screen name="workout/[sessionId]" options={{ headerShown: false }} />
        <Stack.Screen name="history/session/[sessionId]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  recoveryButton: {
    alignItems: 'center',
    backgroundColor: Colors.dark.tint,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  recoveryButtonPressed: {
    opacity: 0.72,
  },
  recoveryButtonText: {
    color: '#07111A',
    fontSize: 15,
    fontWeight: '800',
  },
  startupErrorBody: {
    color: '#B7C0CA',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 340,
    textAlign: 'center',
  },
  startupErrorDetail: {
    color: '#FFB4A8',
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 340,
    textAlign: 'center',
  },
  startupErrorScreen: {
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  startupErrorTitle: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
});
