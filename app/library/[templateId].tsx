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
    duplicateTemplate,
    error,
    isDuplicating,
    isLoading,
    isSaving,
    isSettingActive,
    saveTemplateMetadata,
    setTemplateAsActive,
    template,
  } = useTemplateDetailScreenData(templateId);

  return (
    <TemplateDetailScreenContent
      activeRoutine={activeRoutine}
      error={error}
      isDuplicating={isDuplicating}
      isLoading={isLoading}
      isSaving={isSaving}
      isSettingActive={isSettingActive}
      onBack={() => router.back()}
      onDuplicate={() => {
        void duplicateTemplate().then((duplicatedTemplate) => {
          router.replace({
            pathname: '/library/[templateId]',
            params: { templateId: duplicatedTemplate.id },
          });
        });
      }}
      onSetActive={() => {
        void setTemplateAsActive();
      }}
      onUpdateMetadata={async (input) => {
        await saveTemplateMetadata(input);
      }}
      template={template}
    />
  );
}
