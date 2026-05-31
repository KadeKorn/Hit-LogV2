import { PlaceholderScreen } from '@/components/navigation-shell/placeholder-screen';

export default function ProgressScreen() {
  return (
    <PlaceholderScreen
      eyebrow="Progress"
      title="Progress Views"
      intro="Charts stay deferred until templates, active routines, history comparison, and progression are working."
      sections={[
        {
          title: 'Exercise Strength Trend',
          body: 'Future chart for strength movement over time.',
        },
        {
          title: 'Volume Trend',
          body: 'Future chart for training volume across completed sessions.',
        },
        {
          title: 'Muscle-Group Weekly Sets',
          body: 'Future chart for weekly set totals by muscle group.',
        },
        {
          title: 'Consistency',
          body: 'Future chart for workout completion rhythm.',
        },
      ]}
    />
  );
}
