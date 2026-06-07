import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import {
  ActiveRoutineRepository,
  ExerciseDefinitionsRepository,
  type CreateCustomExerciseDefinitionInput,
  TemplateRepository,
} from '@/db/repositories';
import type {
  AddCustomExercisePrescriptionInput,
  AddCustomTemplateDayInput,
  UpdateCustomTemplateMetadataInput,
  UpdateCustomExercisePrescriptionInput,
  UpdateCustomTemplateDayInput,
  WorkoutTemplateDetail,
} from '@/db/repositories/template-repository';
import type { ActiveRoutine, ExerciseDefinition, WorkoutTemplate } from '@/types/domain';

type TemplateDetailScreenDataState = {
  activeRoutine: ActiveRoutine | null;
  addExercisePrescription: (
    templateDayId: string,
    input: AddCustomExercisePrescriptionInput
  ) => Promise<WorkoutTemplateDetail>;
  addTemplateDay: (input: AddCustomTemplateDayInput) => Promise<WorkoutTemplateDetail>;
  createCustomExerciseDefinition: (
    input: CreateCustomExerciseDefinitionInput
  ) => Promise<ExerciseDefinition>;
  deleteExercisePrescription: (prescriptionId: string) => Promise<WorkoutTemplateDetail>;
  deleteTemplateDay: (templateDayId: string) => Promise<WorkoutTemplateDetail>;
  duplicateTemplate: () => Promise<WorkoutTemplate>;
  error: Error | null;
  exerciseDefinitions: ExerciseDefinition[];
  isDuplicating: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isSettingActive: boolean;
  mutationError: Error | null;
  moveExercisePrescription: (
    prescriptionId: string,
    direction: -1 | 1
  ) => Promise<WorkoutTemplateDetail>;
  moveTemplateDay: (templateDayId: string, direction: -1 | 1) => Promise<WorkoutTemplateDetail>;
  reload: () => Promise<void>;
  saveExercisePrescription: (
    prescriptionId: string,
    input: UpdateCustomExercisePrescriptionInput
  ) => Promise<WorkoutTemplateDetail>;
  saveTemplateDay: (
    templateDayId: string,
    input: UpdateCustomTemplateDayInput
  ) => Promise<WorkoutTemplateDetail>;
  saveTemplateMetadata: (input: UpdateCustomTemplateMetadataInput) => Promise<WorkoutTemplateDetail>;
  setTemplateAsActive: () => Promise<ActiveRoutine>;
  template: WorkoutTemplateDetail | null;
};

export function useTemplateDetailScreenData(templateId: string): TemplateDetailScreenDataState {
  const isFocused = useIsFocused();
  const [activeRoutine, setActiveRoutine] = useState<ActiveRoutine | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [exerciseDefinitions, setExerciseDefinitions] = useState<ExerciseDefinition[]>([]);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSettingActive, setIsSettingActive] = useState(false);
  const [mutationError, setMutationError] = useState<Error | null>(null);
  const [template, setTemplate] = useState<WorkoutTemplateDetail | null>(null);

  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMutationError(null);

      const database = await bootstrapDatabase();
      const templateRepository = new TemplateRepository(database);
      const activeRoutineRepository = new ActiveRoutineRepository(database);
      const exerciseDefinitionsRepository = new ExerciseDefinitionsRepository(database);

      const [templateDetail, currentActiveRoutine, definitions] = await Promise.all([
        templateRepository.getWorkoutTemplateDetail(templateId),
        activeRoutineRepository.getActiveRoutine(),
        exerciseDefinitionsRepository.listExerciseDefinitions(),
      ]);

      setTemplate(templateDetail);
      setActiveRoutine(currentActiveRoutine);
      setExerciseDefinitions(definitions);
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
      setMutationError(null);

      const database = await bootstrapDatabase();
      const templateRepository = new TemplateRepository(database);
      return await templateRepository.duplicateTemplateToCustom(templateId);
    } catch (duplicateError) {
      const nextError =
        duplicateError instanceof Error
          ? duplicateError
          : new Error('Unable to duplicate this template.');

      setMutationError(nextError);
      throw nextError;
    } finally {
      setIsDuplicating(false);
    }
  }, [templateId]);

  const setTemplateAsActive = useCallback(async () => {
    try {
      setIsSettingActive(true);
      setMutationError(null);

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

      setMutationError(nextError);
      throw nextError;
    } finally {
      setIsSettingActive(false);
    }
  }, [templateId]);

  const saveTemplateMetadata = useCallback(
    async (input: UpdateCustomTemplateMetadataInput): Promise<WorkoutTemplateDetail> => {
      try {
        setIsSaving(true);
        setMutationError(null);

        const database = await bootstrapDatabase();
        const templateRepository = new TemplateRepository(database);
        await templateRepository.updateCustomTemplateMetadata(templateId, input);

        const updatedTemplate = await templateRepository.getWorkoutTemplateDetail(templateId);

        if (!updatedTemplate) {
          throw new Error('Unable to reload updated template.');
        }

        setTemplate(updatedTemplate);
        return updatedTemplate;
      } catch (saveError) {
        const nextError =
          saveError instanceof Error ? saveError : new Error('Unable to save this template.');

        setMutationError(nextError);
        throw nextError;
      } finally {
        setIsSaving(false);
      }
    },
    [templateId]
  );

  const reloadUpdatedTemplate = useCallback(
    async (templateRepository: TemplateRepository): Promise<WorkoutTemplateDetail> => {
      const updatedTemplate = await templateRepository.getWorkoutTemplateDetail(templateId);

      if (!updatedTemplate) {
        throw new Error('Unable to reload updated template.');
      }

      setTemplate(updatedTemplate);
      return updatedTemplate;
    },
    [templateId]
  );

  const runTemplateMutation = useCallback(
    async (
      mutation: (templateRepository: TemplateRepository) => Promise<void>
    ): Promise<WorkoutTemplateDetail> => {
      try {
        setIsSaving(true);
        setMutationError(null);

        const database = await bootstrapDatabase();
        const templateRepository = new TemplateRepository(database);
        await mutation(templateRepository);
        return await reloadUpdatedTemplate(templateRepository);
      } catch (mutationError) {
        const nextError =
          mutationError instanceof Error
            ? mutationError
            : new Error('Unable to save this template change.');

        setMutationError(nextError);
        throw nextError;
      } finally {
        setIsSaving(false);
      }
    },
    [reloadUpdatedTemplate]
  );

  const addTemplateDay = useCallback(
    async (input: AddCustomTemplateDayInput) =>
      runTemplateMutation(async (templateRepository) => {
        await templateRepository.addCustomTemplateDay(templateId, input);
      }),
    [runTemplateMutation, templateId]
  );

  const saveTemplateDay = useCallback(
    async (templateDayId: string, input: UpdateCustomTemplateDayInput) =>
      runTemplateMutation(async (templateRepository) => {
        await templateRepository.updateCustomTemplateDay(templateDayId, input);
      }),
    [runTemplateMutation]
  );

  const deleteTemplateDay = useCallback(
    async (templateDayId: string) =>
      runTemplateMutation(async (templateRepository) => {
        await templateRepository.deleteCustomTemplateDay(templateDayId);
      }),
    [runTemplateMutation]
  );

  const moveTemplateDay = useCallback(
    async (templateDayId: string, direction: -1 | 1) =>
      runTemplateMutation(async (templateRepository) => {
        await templateRepository.moveCustomTemplateDay(templateDayId, direction);
      }),
    [runTemplateMutation]
  );

  const addExercisePrescription = useCallback(
    async (templateDayId: string, input: AddCustomExercisePrescriptionInput) =>
      runTemplateMutation(async (templateRepository) => {
        await templateRepository.addCustomExercisePrescription(templateDayId, input);
      }),
    [runTemplateMutation]
  );

  const saveExercisePrescription = useCallback(
    async (prescriptionId: string, input: UpdateCustomExercisePrescriptionInput) =>
      runTemplateMutation(async (templateRepository) => {
        await templateRepository.updateCustomExercisePrescription(prescriptionId, input);
      }),
    [runTemplateMutation]
  );

  const deleteExercisePrescription = useCallback(
    async (prescriptionId: string) =>
      runTemplateMutation(async (templateRepository) => {
        await templateRepository.deleteCustomExercisePrescription(prescriptionId);
      }),
    [runTemplateMutation]
  );

  const moveExercisePrescription = useCallback(
    async (prescriptionId: string, direction: -1 | 1) =>
      runTemplateMutation(async (templateRepository) => {
        await templateRepository.moveCustomExercisePrescription(prescriptionId, direction);
      }),
    [runTemplateMutation]
  );

  const createCustomExerciseDefinition = useCallback(
    async (input: CreateCustomExerciseDefinitionInput): Promise<ExerciseDefinition> => {
      try {
        setIsSaving(true);
        setMutationError(null);

        const database = await bootstrapDatabase();
        const exerciseDefinitionsRepository = new ExerciseDefinitionsRepository(database);
        const exerciseDefinition =
          await exerciseDefinitionsRepository.createCustomExerciseDefinition(input);
        const definitions = await exerciseDefinitionsRepository.listExerciseDefinitions();

        setExerciseDefinitions(definitions);
        return exerciseDefinition;
      } catch (createError) {
        const nextError =
          createError instanceof Error
            ? createError
            : new Error('Unable to create this exercise.');

        setMutationError(nextError);
        throw nextError;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  return {
    activeRoutine,
    addExercisePrescription,
    addTemplateDay,
    createCustomExerciseDefinition,
    deleteExercisePrescription,
    deleteTemplateDay,
    duplicateTemplate,
    error,
    exerciseDefinitions,
    isDuplicating,
    isLoading,
    isSaving,
    isSettingActive,
    mutationError,
    moveExercisePrescription,
    moveTemplateDay,
    reload,
    saveExercisePrescription,
    saveTemplateDay,
    saveTemplateMetadata,
    setTemplateAsActive,
    template,
  };
}
