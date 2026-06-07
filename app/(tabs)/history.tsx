import { router } from 'expo-router';
import { useCallback } from 'react';

import { V2HistoryScreenContent } from '@/components/history/v2-history-screen-content';
import { useV2HistoryScreen } from '@/hooks/use-v2-history-screen';

export default function HistoryScreen() {
  const {
    completedSessions,
    error,
    exerciseHistoryLookup,
    exerciseHistoryPerformances,
    isLoading,
    loadedExerciseHistoryKey,
    selectedExerciseHistoryKey,
    setSelectedExerciseHistoryKey,
  } = useV2HistoryScreen();
  const openSession = useCallback((sessionId: string) => {
    router.push(`/history/session/${sessionId}`);
  }, []);

  return (
    <V2HistoryScreenContent
      completedSessions={completedSessions}
      error={error}
      exerciseHistoryLookup={exerciseHistoryLookup}
      exerciseHistoryPerformances={exerciseHistoryPerformances}
      isLoading={isLoading}
      loadedExerciseHistoryKey={loadedExerciseHistoryKey}
      onOpenSession={openSession}
      onSelectExercise={setSelectedExerciseHistoryKey}
      selectedExerciseHistoryKey={selectedExerciseHistoryKey}
    />
  );
}
