import { useCallback, useState } from 'react';

import {
  exportWorkoutHistoryToCsvFile,
  exportWorkoutDataToJsonFile,
  type WorkoutCsvExportResult,
  type WorkoutJsonExportResult,
} from '@/lib/export/workout-json-export';

type WorkoutJsonExportStatus = 'idle' | 'exporting' | 'success' | 'error';

type WorkoutJsonExportState = {
  csvError: Error | null;
  csvResult: WorkoutCsvExportResult | null;
  csvStatus: WorkoutJsonExportStatus;
  exportJsonBackup: () => Promise<void>;
  exportWorkoutCsv: () => Promise<void>;
  isExportingCsv: boolean;
  isExportingJson: boolean;
  jsonError: Error | null;
  jsonResult: WorkoutJsonExportResult | null;
  jsonStatus: WorkoutJsonExportStatus;
};

export function useWorkoutJsonExport(): WorkoutJsonExportState {
  const [jsonStatus, setJsonStatus] = useState<WorkoutJsonExportStatus>('idle');
  const [jsonError, setJsonError] = useState<Error | null>(null);
  const [jsonResult, setJsonResult] = useState<WorkoutJsonExportResult | null>(null);
  const [csvStatus, setCsvStatus] = useState<WorkoutJsonExportStatus>('idle');
  const [csvError, setCsvError] = useState<Error | null>(null);
  const [csvResult, setCsvResult] = useState<WorkoutCsvExportResult | null>(null);

  const exportJsonBackup = useCallback(async () => {
    try {
      setJsonStatus('exporting');
      setJsonError(null);
      setJsonResult(null);

      const exportResult = await exportWorkoutDataToJsonFile();

      setJsonResult(exportResult);
      setJsonStatus('success');
    } catch (exportError) {
      setJsonError(
        exportError instanceof Error
          ? exportError
          : new Error('Unable to export workout data.')
      );
      setJsonStatus('error');
    }
  }, []);

  const exportWorkoutCsv = useCallback(async () => {
    try {
      setCsvStatus('exporting');
      setCsvError(null);
      setCsvResult(null);

      const exportResult = await exportWorkoutHistoryToCsvFile();

      setCsvResult(exportResult);
      setCsvStatus('success');
    } catch (exportError) {
      setCsvError(
        exportError instanceof Error
          ? exportError
          : new Error('Unable to export workout history CSV.')
      );
      setCsvStatus('error');
    }
  }, []);

  return {
    csvStatus,
    csvError,
    csvResult,
    isExportingCsv: csvStatus === 'exporting',
    isExportingJson: jsonStatus === 'exporting',
    exportJsonBackup,
    exportWorkoutCsv,
    jsonStatus,
    jsonError,
    jsonResult,
  };
}
