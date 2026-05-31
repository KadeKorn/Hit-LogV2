import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import { ActiveRoutineRepository, TemplateRepository } from '@/db/repositories';
import type { WorkoutTemplateDetail } from '@/db/repositories/template-repository';
import type { ActiveRoutine, WorkoutTemplate } from '@/types/domain';

type TemplateDetailScreenDataState = {
  activeRoutine: ActiveRoutine | null;
  duplicateTemplate: () => Promise<WorkoutTemplate>;
  error: Error | null;
  isDuplicating: boolean;
  isLoading: boolean;
  isSettingActive: boolean;
  reload: () => Promise<void>;
  setTemplateAsActive: () => Promise<ActiveRoutine>;
  template: WorkoutTemplateDetail | null;
};

export function useTemplateDetailScreenData(templateId: string): TemplateDetailScreenDataState {
  const isFocused = useIsFocused();
  const [activeRoutine, setActiveRoutine] = useState<ActiveRoutine | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingActive, setIsSettingActive] = useState(false);
  const [template, setTemplate] = useState<WorkoutTemplateDetail | null>(null);

  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const database = await bootstrapDatabase();
      const templateRepository = new TemplateRepository(database);
      const activeRoutineRepository = new ActiveRoutineRepository(database);

      const [templateDetail, currentActiveRoutine] = await Promise.all([
        templateRepository.getWorkoutTemplateDetail(templateId),
        activeRoutineRepository.getActiveRoutine(),
      ]);

      setTemplate(templateDetail);
      setActiveRoutine(currentActiveRoutine);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError : new Error('Unable to load template details.')
      );
    } finally {
      setIsLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    async function loadTemplateDetail(): Promise<void> {
      try {
        await reload();
      } finally {
        if (!isMounted) {
          return;
        }
      }
    }

    void loadTemplateDetail();

    return () => {
      isMounted = false;
    };
  }, [isFocused, reload]);

  const duplicateTemplate = useCallback(async () => {
    try {
      setIsDuplicating(true);
      setError(null);

      const database = await bootstrapDatabase();
      const templateRepository = new TemplateRepository(database);
      return await templateRepository.duplicateTemplateToCustom(templateId);
    } catch (duplicateError) {
      const nextError =
        duplicateError instanceof Error
          ? duplicateError
          : new Error('Unable to duplicate this template.');

      setError(nextError);
      throw nextError;
    } finally {
      setIsDuplicating(false);
    }
  }, [templateId]);

  const setTemplateAsActive = useCallback(async () => {
    try {
      setIsSettingActive(true);
      setError(null);

      const database = await bootstrapDatabase();
      const activeRoutineRepository = new ActiveRoutineRepository(database);
      const nextActiveRoutine = await activeRoutineRepository.setActiveRoutine(templateId);

      setActiveRoutine(nextActiveRoutine);
      return nextActiveRoutine;
    } catch (setActiveError) {
      const nextError =
        setActiveError instanceof Error
          ? setActiveError
          : new Error('Unable to set this template as active.');

      setError(nextError);
      throw nextError;
    } finally {
      setIsSettingActive(false);
    }
  }, [templateId]);

  return {
    activeRoutine,
    duplicateTemplate,
    error,
    isDuplicating,
    isLoading,
    isSettingActive,
    reload,
    setTemplateAsActive,
    template,
  };
}
