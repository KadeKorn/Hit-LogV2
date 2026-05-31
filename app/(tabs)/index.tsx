import { router } from 'expo-router';

import { HomeScreenContent } from '@/components/home/home-screen-content';
import { useHomeScreenData } from '@/hooks/use-home-screen-data';

export default function HomeScreen() {
  const {
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
  } = useHomeScreenData();

  return (
    <HomeScreenContent
      activeRoutine={activeRoutine}
      activeRoutineTemplate={activeRoutineTemplate}
      activeWorkoutSession={activeWorkoutSession}
      currentTemplateDay={currentTemplateDay}
      error={error}
      isLoading={isLoading}
      isStartingWorkout={isStartingWorkout}
      latestPerTemplate={latestPerTemplate}
      nextWorkout={nextWorkout}
      onLibraryPress={() => router.push('/library')}
      onStartWorkout={() => {
        void startOrResumeWorkout().then((session) => {
          router.push({
            pathname: '/workout/[sessionId]',
            params: { sessionId: session.id },
          });
        });
      }}
      onTemplatePress={(templateId) =>
        router.push({
          pathname: '/workout-logger/[templateId]',
          params: { templateId },
        })
      }
    />
  );
}
