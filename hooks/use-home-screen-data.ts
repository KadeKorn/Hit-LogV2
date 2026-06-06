import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import {
  ActiveRoutineRepository,
  TemplateRepository,
  WorkoutSessionRepository,
} from '@/db/repositories';
import type { ActiveRoutine, TemplateDay, WorkoutSession, WorkoutTemplateWithDays } from '@/types/domain';

type HomeScreenDataState = {
  activeRoutine: ActiveRoutine | null;
  activeRoutineTemplate: WorkoutTemplateWithDays | null;
  activeWorkoutSession: WorkoutSession | null;
  currentTemplateDay: TemplateDay | null;
  error: Error | null;
  isLoading: boolean;
  isStartingWorkout: boolean;
  startOrResumeWorkout: () => Promise<WorkoutSession>;
};

function resolveCurrentTemplateDay(
  activeRoutine: ActiveRoutine | null,
  template: WorkoutTemplateWithDays | null
): TemplateDay | null {
  if (!activeRoutine || !template) {
    return null;
  }

  return (
    template.days.find((day) => day.id === activeRoutine.currentTemplateDayId) ??
    template.days[0] ??
    null
  );
}

export function useHomeScreenData(): HomeScreenDataState {
  const isFocused = useIsFocused();
  const [activeRoutine, setActiveRoutine] = useState<ActiveRoutine | null>(null);
  const [activeRoutineTemplate, setActiveRoutineTemplate] =
    useState<WorkoutTemplateWithDays | null>(null);
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<WorkoutSession | null>(null);
  const [currentTemplateDay, setCurrentTemplateDay] = useState<TemplateDay | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingWorkout, setIsStartingWorkout] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    async function loadHomeScreenData(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const database = await bootstrapDatabase();
        const activeRoutineRepository = new ActiveRoutineRepository(database);
        const templateRepository = new TemplateRepository(database);
        const workoutSessionRepository = new WorkoutSessionRepository(database);

        const currentActiveRoutine = await activeRoutineRepository.getActiveRoutine();

        const currentActiveTemplate = currentActiveRoutine
          ? await templateRepository.getTemplateWithDays(currentActiveRoutine.templateId)
          : null;
        const currentWorkoutSession = currentActiveRoutine
          ? await workoutSessionRepository.getActiveWorkoutSession(currentActiveRoutine.id)
          : null;

        if (!isMounted) {
          return;
        }

        setActiveRoutine(currentActiveRoutine);
        setActiveRoutineTemplate(currentActiveTemplate);
        setActiveWorkoutSession(currentWorkoutSession);
        setCurrentTemplateDay(resolveCurrentTemplateDay(currentActiveRoutine, currentActiveTemplate));
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error ? loadError : new Error('Unable to load the Home screen.')
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadHomeScreenData();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const startOrResumeWorkout = useCallback(async (): Promise<WorkoutSession> => {
    try {
      setIsStartingWorkout(true);
      setError(null);

      const database = await bootstrapDatabase();
      const workoutSessionRepository = new WorkoutSessionRepository(database);
      const session = await workoutSessionRepository.createWorkoutSessionFromActiveRoutine();

      setActiveWorkoutSession(session);
      return session;
    } catch (startError) {
      const nextError =
        startError instanceof Error ? startError : new Error('Unable to start workout.');

      setError(nextError);
      throw nextError;
    } finally {
      setIsStartingWorkout(false);
    }
  }, []);

  return {
    activeRoutine,
    activeRoutineTemplate,
    activeWorkoutSession,
    currentTemplateDay,
    error,
    isLoading,
    isStartingWorkout,
    startOrResumeWorkout,
  };
}
