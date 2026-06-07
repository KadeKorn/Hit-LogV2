import { ProgressScreenContent } from '@/components/progress/progress-screen-content';
import { useProgressScreen } from '@/hooks/use-progress-screen';

export default function ProgressScreen() {
  const progress = useProgressScreen();

  return <ProgressScreenContent {...progress} />;
}
