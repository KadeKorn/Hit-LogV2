import { useCallback, useEffect, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import {
  type CompleteWorkoutSessionInput,
  type WorkoutSessionDetail,
  WorkoutSessionRepository,
} from '@/db/repositories/workout-session-repository';

type WorkoutSessionScreenState = {
  completeWorkout: (input: CompleteWorkoutSessionInput) => Promise<WorkoutSessionDetail>;
  error: Error | null;
  isCompleting: boolean;
  isLoading: boolean;
  reload: () => Promise<void>;
  session: WorkoutSessionDetail | null;
};

export function useWorkoutSessionScreen(sessionId: string): WorkoutSessionScreenState {
  const [error, setError] = useState<Error | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<WorkoutSessionDetail | null>(null);

  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const database = await bootstrapDatabase();
      const repository = new WorkoutSessionRepository(database);
      setSession(await repository.getWorkoutSessionById(sessionId));
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
    isCompleting,
    isLoading,
    reload,
    session,
  };
}
