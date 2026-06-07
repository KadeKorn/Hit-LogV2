import { useCallback, useEffect, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import {
  HistoryComparisonRepository,
  type ExerciseHistoryComparison,
} from '@/db/repositories/history-comparison-repository';
import { ProgressionRecommendationRepository } from '@/db/repositories/progression-recommendation-repository';
import {
  type CompleteWorkoutSessionInput,
  type SaveWorkoutSessionDraftInput,
  type WorkoutSessionDetail,
  WorkoutSessionRepository,
} from '@/db/repositories/workout-session-repository';
import type { ProgressionRecommendation } from '@/types/domain';

type WorkoutSessionScreenState = {
  completeWorkout: (input: CompleteWorkoutSessionInput) => Promise<WorkoutSessionDetail>;
  error: Error | null;
  historyComparisons: Record<string, ExerciseHistoryComparison>;
  historyError: Error | null;
  isCompleting: boolean;
  isHistoryLoading: boolean;
  isLoading: boolean;
  isProgressionLoading: boolean;
  progressionError: Error | null;
  progressionRecommendations: Record<string, ProgressionRecommendation>;
  reload: () => Promise<void>;
  saveWorkoutDraft: (input: SaveWorkoutSessionDraftInput) => Promise<WorkoutSessionDetail>;
  saveError: Error | null;
  savedAt: string | null;
  session: WorkoutSessionDetail | null;
};

export function useWorkoutSessionScreen(sessionId: string): WorkoutSessionScreenState {
  const [error, setError] = useState<Error | null>(null);
  const [historyComparisons, setHistoryComparisons] = useState<Record<string, ExerciseHistoryComparison>>({});
  const [historyError, setHistoryError] = useState<Error | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProgressionLoading, setIsProgressionLoading] = useState(false);
  const [progressionError, setProgressionError] = useState<Error | null>(null);
  const [progressionRecommendations, setProgressionRecommendations] = useState<
    Record<string, ProgressionRecommendation>
  >({});
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
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
        setProgressionRecommendations({});
        return;
      }

      try {
        setIsProgressionLoading(true);
        setProgressionError(null);

        const progressionRepository = new ProgressionRecommendationRepository(database);
        setProgressionRecommendations(
          await progressionRepository.getProgressionRecommendationsForWorkoutSession({
            currentWorkoutSessionId: sessionId,
          })
        );
      } catch (loadProgressionError) {
        setProgressionRecommendations({});
        setProgressionError(
          loadProgressionError instanceof Error
            ? loadProgressionError
            : new Error('Unable to load progression recommendations.')
        );
      } finally {
        setIsProgressionLoading(false);
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
        setSavedAt(new Date().toISOString());
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

  const saveWorkoutDraft = useCallback(
    async (input: SaveWorkoutSessionDraftInput) => {
      try {
        setSaveError(null);

        const database = await bootstrapDatabase();
        const repository = new WorkoutSessionRepository(database);
        const savedSession = await repository.saveWorkoutSessionDraft(sessionId, input);
        setSavedAt(new Date().toISOString());
        return savedSession;
      } catch (draftError) {
        const nextError =
          draftError instanceof Error ? draftError : new Error('Unable to save workout draft.');

        setSaveError(nextError);
        throw nextError;
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
    isProgressionLoading,
    progressionError,
    progressionRecommendations,
    reload,
    saveError,
    saveWorkoutDraft,
    savedAt,
    session,
  };
}
