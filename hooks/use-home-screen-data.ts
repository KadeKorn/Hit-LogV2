import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import { ActiveRoutineRepository, TemplateRepository, WorkoutLogRepository } from '@/db/repositories';
import type { NextRecommendedWorkoutDay } from '@/db/repositories/template-repository';
import type { TemplateLatestCompletedWorkout } from '@/db/repositories/workout-log-repository';
import type { ActiveRoutine, TemplateDay, WorkoutTemplateWithDays } from '@/types/domain';

type HomeScreenDataState = {
  activeRoutine: ActiveRoutine | null;
  activeRoutineTemplate: WorkoutTemplateWithDays | null;
  currentTemplateDay: TemplateDay | null;
  error: Error | null;
  isLoading: boolean;
  latestPerTemplate: TemplateLatestCompletedWorkout[];
  nextWorkout: NextRecommendedWorkoutDay | null;
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
  const [currentTemplateDay, setCurrentTemplateDay] = useState<TemplateDay | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

        const [currentActiveRoutine, recommendedWorkout, latestCompletedPerTemplate] =
          await Promise.all([
            activeRoutineRepository.getActiveRoutine(),
            templateRepository.getNextRecommendedWorkoutDay(),
            workoutLogRepository.getLatestCompletedWorkoutsPerTemplate(),
          ]);

        const currentActiveTemplate = currentActiveRoutine
          ? await templateRepository.getTemplateWithDays(currentActiveRoutine.templateId)
          : null;

        if (!isMounted) {
          return;
        }

        setActiveRoutine(currentActiveRoutine);
        setActiveRoutineTemplate(currentActiveTemplate);
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

  return {
    activeRoutine,
    activeRoutineTemplate,
    currentTemplateDay,
    error,
    isLoading,
    latestPerTemplate,
    nextWorkout,
  };
}
