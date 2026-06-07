import { router } from 'expo-router';

import { V2HistoryScreenContent } from '@/components/history/v2-history-screen-content';
import { useV2HistoryScreen } from '@/hooks/use-v2-history-screen';

export default function HistoryScreen() {
  const {
    completedSessions,
    error,
    exerciseHistoryLookup,
    exerciseHistoryPerformances,
    isLoading,
    selectedExerciseHistoryKey,
    setSelectedExerciseHistoryKey,
  } = useV2HistoryScreen();

  return (
    <V2HistoryScreenContent
      completedSessions={completedSessions}
      error={error}
      exerciseHistoryLookup={exerciseHistoryLookup}
      exerciseHistoryPerformances={exerciseHistoryPerformances}
      isLoading={isLoading}
      onOpenSession={(sessionId) => router.push(`/history/session/${sessionId}`)}
      onSelectExercise={setSelectedExerciseHistoryKey}
      selectedExerciseHistoryKey={selectedExerciseHistoryKey}
    />
  );
}
