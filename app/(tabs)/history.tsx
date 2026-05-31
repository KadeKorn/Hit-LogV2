import { PlaceholderScreen } from '@/components/navigation-shell/placeholder-screen';

export default function HistoryScreen() {
  return (
    <PlaceholderScreen
      eyebrow="History"
      title="Workout History"
      intro="Completed workout sessions and exercise lookup will be collected here."
      sections={[
        {
          title: 'Completed Sessions',
          body: 'Saved workouts will become the main history list in a later phase.',
        },
        {
          title: 'Exercise History',
          body: 'Exercise-level history remains available from the workout logger where prior performance is needed.',
        },
      ]}
    />
  );
}
