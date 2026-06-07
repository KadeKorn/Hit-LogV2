import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import { bootstrapDatabase } from '@/db/bootstrap';
import {
  type CompletedSessionSummary,
  type ExerciseHistoryLookupItem,
  type ExerciseHistoryPerformance,
  V2HistoryRepository,
} from '@/db/repositories/v2-history-repository';

type UseV2HistoryScreenResult = {
  completedSessions: CompletedSessionSummary[];
  error: Error | null;
  exerciseHistoryLookup: ExerciseHistoryLookupItem[];
  exerciseHistoryPerformances: ExerciseHistoryPerformance[];
  isLoading: boolean;
  selectedExerciseHistoryKey: string | null;
  setSelectedExerciseHistoryKey: (exerciseHistoryKey: string) => void;
};

export function useV2HistoryScreen(): UseV2HistoryScreenResult {
  const isFocused = useIsFocused();
  const [completedSessions, setCompletedSessions] = useState<CompletedSessionSummary[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [exerciseHistoryLookup, setExerciseHistoryLookup] = useState<ExerciseHistoryLookupItem[]>([]);
  const [exerciseHistoryPerformances, setExerciseHistoryPerformances] = useState<
    ExerciseHistoryPerformance[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExerciseHistoryKey, setSelectedExerciseHistoryKeyState] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    async function loadHistory(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const database = await bootstrapDatabase();
        const repository = new V2HistoryRepository(database);
        const [sessions, lookup] = await Promise.all([
          repository.getCompletedSessions(),
          repository.getExerciseHistoryLookup(),
        ]);
        const nextSelectedKey =
          selectedExerciseHistoryKey &&
          lookup.some((item) => item.exerciseHistoryKey === selectedExerciseHistoryKey)
            ? selectedExerciseHistoryKey
            : lookup[0]?.exerciseHistoryKey ?? null;
        const performances = nextSelectedKey
          ? await repository.getExerciseHistoryPerformances(nextSelectedKey)
          : [];

        if (!isMounted) {
          return;
        }

        setCompletedSessions(sessions);
        setExerciseHistoryLookup(lookup);
        setSelectedExerciseHistoryKeyState(nextSelectedKey);
        setExerciseHistoryPerformances(performances);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setCompletedSessions([]);
        setExerciseHistoryLookup([]);
        setExerciseHistoryPerformances([]);
        setError(loadError instanceof Error ? loadError : new Error('Unable to load history.'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, [isFocused, selectedExerciseHistoryKey]);

  return {
    completedSessions,
    error,
    exerciseHistoryLookup,
    exerciseHistoryPerformances,
    isLoading,
    selectedExerciseHistoryKey,
    setSelectedExerciseHistoryKey: setSelectedExerciseHistoryKeyState,
  };
}
