import { router } from 'expo-router';

import { LibraryScreenContent } from '@/components/library/library-screen-content';
import { useLibraryScreenData } from '@/hooks/use-library-screen-data';

export default function LibraryScreen() {
  const { activeRoutine, customTemplates, error, isLoading, prebuiltTemplates } =
    useLibraryScreenData();

  return (
    <LibraryScreenContent
      activeRoutine={activeRoutine}
      customTemplates={customTemplates}
      error={error}
      isLoading={isLoading}
      onTemplatePress={(templateId) =>
        router.push({
          pathname: '/library/[templateId]',
          params: { templateId },
        })
      }
      prebuiltTemplates={prebuiltTemplates}
    />
  );
}
