import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import { bootstrapDatabase } from '@/db/bootstrap';
import { ProgressRepository } from '@/db/repositories/progress-repository';
import { analyzeProgress, type ProgressDashboard } from '@/lib/progress-analysis';

type UseProgressScreenResult = {
  dashboard: ProgressDashboard | null;
  error: Error | null;
  isLoading: boolean;
};

export function useProgressScreen(): UseProgressScreenResult {
  const isFocused = useIsFocused();
  const [dashboard, setDashboard] = useState<ProgressDashboard | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    async function loadProgress(): Promise<void> {
      try {
        setError(null);
        setIsLoading(true);

        const database = await bootstrapDatabase();
        const repository = new ProgressRepository(database);
        const rawData = await repository.getProgressRawData();
        const nextDashboard = analyzeProgress(rawData);

        if (!isMounted) {
          return;
        }

        setDashboard(nextDashboard);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setDashboard(null);
        setError(loadError instanceof Error ? loadError : new Error('Unable to load progress.'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProgress();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  return {
    dashboard,
    error,
    isLoading,
  };
}

