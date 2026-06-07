import { useCallback, useEffect, useRef, useState } from 'react';
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
  loadedExerciseHistoryKey: string | null;
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
  const [loadedExerciseHistoryKey, setLoadedExerciseHistoryKey] = useState<string | null>(null);
  const [selectedExerciseHistoryKey, setSelectedExerciseHistoryKeyState] = useState<string | null>(
    null
  );
  const hasLoadedHistoryShellRef = useRef(false);

  const setSelectedExerciseHistoryKey = useCallback((exerciseHistoryKey: string) => {
    setSelectedExerciseHistoryKeyState((currentKey) =>
      currentKey === exerciseHistoryKey ? currentKey : exerciseHistoryKey
    );
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    async function loadHistory(): Promise<void> {
      try {
        setIsLoading(!hasLoadedHistoryShellRef.current);
        setError(null);

        const database = await bootstrapDatabase();
        const repository = new V2HistoryRepository(database);
        const [sessions, lookup] = await Promise.all([
          repository.getCompletedSessions(),
          repository.getExerciseHistoryLookup(),
        ]);
        const fallbackSelectedKey = lookup[0]?.exerciseHistoryKey ?? null;

        if (!isMounted) {
          return;
        }

        hasLoadedHistoryShellRef.current = true;
        setCompletedSessions(sessions);
        setExerciseHistoryLookup(lookup);
        setSelectedExerciseHistoryKeyState((currentKey) =>
          currentKey && lookup.some((item) => item.exerciseHistoryKey === currentKey)
            ? currentKey
            : fallbackSelectedKey
        );
        setExerciseHistoryPerformances((currentPerformances) =>
          fallbackSelectedKey ? currentPerformances : []
        );
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setCompletedSessions([]);
        setExerciseHistoryLookup([]);
        setExerciseHistoryPerformances([]);
        setLoadedExerciseHistoryKey(null);
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
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused || !selectedExerciseHistoryKey) {
      return;
    }

    let isMounted = true;
    const exerciseHistoryKey = selectedExerciseHistoryKey;

    async function loadExerciseHistory(): Promise<void> {
      try {
        setError(null);

        const database = await bootstrapDatabase();
        const repository = new V2HistoryRepository(database);
        const performances = await repository.getExerciseHistoryPerformances(exerciseHistoryKey);

        if (!isMounted) {
          return;
        }

        setExerciseHistoryPerformances(performances);
        setLoadedExerciseHistoryKey(exerciseHistoryKey);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setExerciseHistoryPerformances([]);
        setLoadedExerciseHistoryKey(exerciseHistoryKey);
        setError(loadError instanceof Error ? loadError : new Error('Unable to load history.'));
      }
    }

    void loadExerciseHistory();

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
    loadedExerciseHistoryKey,
    selectedExerciseHistoryKey,
    setSelectedExerciseHistoryKey,
  };
}
