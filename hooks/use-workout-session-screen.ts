import { useCallback, useEffect, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import {
  HistoryComparisonRepository,
  type ExerciseHistoryComparison,
} from '@/db/repositories/history-comparison-repository';
import {
  type CompleteWorkoutSessionInput,
  type WorkoutSessionDetail,
  WorkoutSessionRepository,
} from '@/db/repositories/workout-session-repository';

type WorkoutSessionScreenState = {
  completeWorkout: (input: CompleteWorkoutSessionInput) => Promise<WorkoutSessionDetail>;
  error: Error | null;
  historyComparisons: Record<string, ExerciseHistoryComparison>;
  historyError: Error | null;
  isCompleting: boolean;
  isHistoryLoading: boolean;
  isLoading: boolean;
  reload: () => Promise<void>;
  session: WorkoutSessionDetail | null;
};

export function useWorkoutSessionScreen(sessionId: string): WorkoutSessionScreenState {
  const [error, setError] = useState<Error | null>(null);
  const [historyComparisons, setHistoryComparisons] = useState<Record<string, ExerciseHistoryComparison>>({});
  const [historyError, setHistoryError] = useState<Error | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<WorkoutSessionDetail | null>(null);

  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const database = await bootstrapDatabase();
      const repository = new WorkoutSessionRepository(database);
      const nextSession = await repository.getWorkoutSessionById(sessionId);
      setSession(nextSession);
      setIsLoading(false);

      if (!nextSession) {
        setHistoryComparisons({});
        return;
      }

      const exerciseDefinitionIds = nextSession.exercises
        .map((exercise) => exercise.exerciseDefinitionId)
        .filter((exerciseDefinitionId): exerciseDefinitionId is string => Boolean(exerciseDefinitionId));

      if (exerciseDefinitionIds.length === 0) {
        setHistoryComparisons({});
        return;
      }

      try {
        setIsHistoryLoading(true);
        setHistoryError(null);

        const historyRepository = new HistoryComparisonRepository(database);
        setHistoryComparisons(
          await historyRepository.getExerciseHistoryComparisons({
            currentWorkoutSessionId: sessionId,
            exerciseDefinitionIds,
          })
        );
      } catch (loadHistoryError) {
        setHistoryComparisons({});
        setHistoryError(
          loadHistoryError instanceof Error
            ? loadHistoryError
            : new Error('Unable to load exercise history.')
        );
      } finally {
        setIsHistoryLoading(false);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError : new Error('Unable to load workout session.')
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const completeWorkout = useCallback(
    async (input: CompleteWorkoutSessionInput) => {
      try {
        setIsCompleting(true);
        setError(null);

        const database = await bootstrapDatabase();
        const repository = new WorkoutSessionRepository(database);
        const completedSession = await repository.completeWorkoutSession(sessionId, input);
        setSession(completedSession);
        return completedSession;
      } catch (completeError) {
        const nextError =
          completeError instanceof Error
            ? completeError
            : new Error('Unable to complete workout session.');

        setError(nextError);
        throw nextError;
      } finally {
        setIsCompleting(false);
      }
    },
    [sessionId]
  );

  return {
    completeWorkout,
    error,
    historyComparisons,
    historyError,
    isCompleting,
    isHistoryLoading,
    isLoading,
    reload,
    session,
  };
}
