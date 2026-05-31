import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import {
  ActiveRoutineRepository,
  TemplateRepository,
  WorkoutLogRepository,
  WorkoutSessionRepository,
} from '@/db/repositories';
import type { NextRecommendedWorkoutDay } from '@/db/repositories/template-repository';
import type { TemplateLatestCompletedWorkout } from '@/db/repositories/workout-log-repository';
import type { ActiveRoutine, TemplateDay, WorkoutSession, WorkoutTemplateWithDays } from '@/types/domain';

type HomeScreenDataState = {
  activeRoutine: ActiveRoutine | null;
  activeRoutineTemplate: WorkoutTemplateWithDays | null;
  activeWorkoutSession: WorkoutSession | null;
  currentTemplateDay: TemplateDay | null;
  error: Error | null;
  isLoading: boolean;
  isStartingWorkout: boolean;
  latestPerTemplate: TemplateLatestCompletedWorkout[];
  nextWorkout: NextRecommendedWorkoutDay | null;
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
  const [latestPerTemplate, setLatestPerTemplate] = useState<TemplateLatestCompletedWorkout[]>([]);
  const [nextWorkout, setNextWorkout] = useState<NextRecommendedWorkoutDay | null>(null);

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
        const workoutLogRepository = new WorkoutLogRepository(database);
        const workoutSessionRepository = new WorkoutSessionRepository(database);

        const [currentActiveRoutine, recommendedWorkout, latestCompletedPerTemplate] =
          await Promise.all([
            activeRoutineRepository.getActiveRoutine(),
            templateRepository.getNextRecommendedWorkoutDay(),
            workoutLogRepository.getLatestCompletedWorkoutsPerTemplate(),
          ]);

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
        setLatestPerTemplate(latestCompletedPerTemplate);
        setNextWorkout(recommendedWorkout);
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
    latestPerTemplate,
    nextWorkout,
    startOrResumeWorkout,
  };
}
