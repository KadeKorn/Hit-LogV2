import { useEffect, useState } from 'react';

import { bootstrapDatabase } from '@/db/bootstrap';
import {
  type CompletedSessionDetail,
  V2HistoryRepository,
} from '@/db/repositories/v2-history-repository';

type UseV2CompletedSessionScreenResult = {
  error: Error | null;
  isLoading: boolean;
  session: CompletedSessionDetail | null;
};

export function useV2CompletedSessionScreen(
  sessionId: string
): UseV2CompletedSessionScreenResult {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<CompletedSessionDetail | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSession(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const database = await bootstrapDatabase();
        const repository = new V2HistoryRepository(database);
        const completedSession = sessionId
          ? await repository.getCompletedSessionDetail(sessionId)
          : null;

        if (!isMounted) {
          return;
        }

        setSession(completedSession);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setSession(null);
        setError(
          loadError instanceof Error
            ? loadError
            : new Error('Unable to load completed workout.')
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  return {
    error,
    isLoading,
    session,
  };
}
