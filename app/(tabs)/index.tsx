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
      onLibraryPress={() => router.push('/library')}
      onStartWorkout={() => {
        void startOrResumeWorkout().then((session) => {
          router.push({
            pathname: '/workout/[sessionId]',
            params: { sessionId: session.id },
          });
        });
      }}
    />
  );
}
