import { router } from 'expo-router';

import { HomeScreenContent } from '@/components/home/home-screen-content';
import { useHomeScreenData } from '@/hooks/use-home-screen-data';

export default function HomeScreen() {
  const {
    activeRoutine,
    activeRoutineTemplate,
    currentTemplateDay,
    error,
    isLoading,
    latestPerTemplate,
    nextWorkout,
  } = useHomeScreenData();

  return (
    <HomeScreenContent
      activeRoutine={activeRoutine}
      activeRoutineTemplate={activeRoutineTemplate}
      currentTemplateDay={currentTemplateDay}
      error={error}
      isLoading={isLoading}
      latestPerTemplate={latestPerTemplate}
      nextWorkout={nextWorkout}
      onLibraryPress={() => router.push('/library')}
      onTemplatePress={(templateId) =>
        router.push({
          pathname: '/workout-logger/[templateId]',
          params: { templateId },
        })
      }
    />
  );
}
