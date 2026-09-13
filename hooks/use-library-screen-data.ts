import { useIsFocused } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import { ActiveRoutineRepository, TemplateRepository } from '@/db/repositories';
import type { WorkoutTemplateListItem } from '@/db/repositories/template-repository';
import type { ActiveRoutine } from '@/types/domain';

type LibraryScreenDataState = {
  activeRoutine: ActiveRoutine | null;
  customTemplates: WorkoutTemplateListItem[];
  error: Error | null;
  isLoading: boolean;
  pausedTemplateIds: string[];
  prebuiltTemplates: WorkoutTemplateListItem[];
};

export function useLibraryScreenData(): LibraryScreenDataState {
  const isFocused = useIsFocused();
  const [activeRoutine, setActiveRoutine] = useState<ActiveRoutine | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<WorkoutTemplateListItem[]>([]);
  const [pausedTemplateIds, setPausedTemplateIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    async function loadLibraryScreenData(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const database = await bootstrapDatabase();
        const templateRepository = new TemplateRepository(database);
        const activeRoutineRepository = new ActiveRoutineRepository(database);

        const [templateItems, currentActiveRoutine, pausedRoutines] = await Promise.all([
          templateRepository.listWorkoutTemplateItems(),
          activeRoutineRepository.getActiveRoutine(),
          activeRoutineRepository.listPausedRoutines(),
        ]);

        if (!isMounted) {
          return;
        }

        setTemplates(templateItems);
        setActiveRoutine(currentActiveRoutine);
        setPausedTemplateIds(pausedRoutines.map((routine) => routine.templateId));
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error ? loadError : new Error('Unable to load the Library screen.')
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadLibraryScreenData();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const prebuiltTemplates = useMemo(
    () => templates.filter((template) => template.sourceType === 'prebuilt'),
    [templates]
  );

  const customTemplates = useMemo(
    () => templates.filter((template) => template.sourceType === 'custom'),
    [templates]
  );

  return {
    activeRoutine,
    customTemplates,
    error,
    isLoading,
    pausedTemplateIds,
    prebuiltTemplates,
  };
}
