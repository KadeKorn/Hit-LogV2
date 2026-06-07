import { router, useLocalSearchParams } from 'expo-router';

import { V2CompletedSessionScreenContent } from '@/components/history/v2-completed-session-screen-content';
import { useV2CompletedSessionScreen } from '@/hooks/use-v2-completed-session-screen';

function getSessionIdParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export default function CompletedSessionScreen() {
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const sessionId = getSessionIdParam(params.sessionId);
  const { error, isLoading, session } = useV2CompletedSessionScreen(sessionId);

  return (
    <V2CompletedSessionScreenContent
      error={error}
      isLoading={isLoading}
      onBack={() => router.back()}
      session={session}
    />
  );
}
