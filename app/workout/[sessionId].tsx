import { router, useLocalSearchParams } from 'expo-router';

import { WorkoutSessionScreenContent } from '@/components/workout-session/workout-session-screen-content';
import { useWorkoutSessionScreen } from '@/hooks/use-workout-session-screen';

function getSessionIdParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export default function WorkoutSessionScreen() {
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const sessionId = getSessionIdParam(params.sessionId);
  const {
    completeWorkout,
    error,
    historyComparisons,
    historyError,
    isCompleting,
    isHistoryLoading,
    isLoading,
    isProgressionLoading,
    progressionError,
    progressionRecommendations,
    saveError,
    saveWorkoutDraft,
    savedAt,
    session,
  } =
    useWorkoutSessionScreen(sessionId);

  return (
    <WorkoutSessionScreenContent
      error={error}
      historyComparisons={historyComparisons}
      historyError={historyError}
      isCompleting={isCompleting}
      isHistoryLoading={isHistoryLoading}
      isLoading={isLoading}
      isProgressionLoading={isProgressionLoading}
      onBack={() => router.replace('/')}
      onComplete={(input) => {
        void completeWorkout(input).catch(() => undefined);
      }}
      onSaveDraft={(input) => {
        void saveWorkoutDraft(input).catch(() => undefined);
      }}
      progressionError={progressionError}
      progressionRecommendations={progressionRecommendations}
      saveError={saveError}
      savedAt={savedAt}
      session={session}
    />
  );
}
