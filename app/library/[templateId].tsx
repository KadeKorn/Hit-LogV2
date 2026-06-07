import { router, useLocalSearchParams } from 'expo-router';

import { TemplateDetailScreenContent } from '@/components/library/template-detail-screen-content';
import { useTemplateDetailScreenData } from '@/hooks/use-template-detail-screen-data';

function getTemplateIdParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export default function TemplateDetailScreen() {
  const params = useLocalSearchParams<{ templateId?: string | string[] }>();
  const templateId = getTemplateIdParam(params.templateId);
  const {
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
    moveExercisePrescription,
    moveTemplateDay,
    mutationError,
    saveExercisePrescription,
    saveTemplateDay,
    saveTemplateMetadata,
    setTemplateAsActive,
    template,
  } = useTemplateDetailScreenData(templateId);

  return (
    <TemplateDetailScreenContent
      activeRoutine={activeRoutine}
      exerciseDefinitions={exerciseDefinitions}
      error={error}
      isDuplicating={isDuplicating}
      isLoading={isLoading}
      isSaving={isSaving}
      isSettingActive={isSettingActive}
      mutationError={mutationError}
      onBack={() => router.back()}
      onAddExercisePrescription={addExercisePrescription}
      onAddTemplateDay={addTemplateDay}
      onCreateCustomExerciseDefinition={createCustomExerciseDefinition}
      onDeleteExercisePrescription={deleteExercisePrescription}
      onDeleteTemplateDay={deleteTemplateDay}
      onDuplicate={() => {
        void duplicateTemplate()
          .then((duplicatedTemplate) => {
            router.replace({
              pathname: '/library/[templateId]',
              params: { templateId: duplicatedTemplate.id },
            });
          })
          .catch(() => undefined);
      }}
      onSetActive={() => {
        void setTemplateAsActive().catch(() => undefined);
      }}
      onMoveExercisePrescription={moveExercisePrescription}
      onMoveTemplateDay={moveTemplateDay}
      onUpdateExercisePrescription={saveExercisePrescription}
      onUpdateTemplateDay={saveTemplateDay}
      onUpdateMetadata={async (input) => {
        await saveTemplateMetadata(input);
      }}
      template={template}
    />
  );
}
