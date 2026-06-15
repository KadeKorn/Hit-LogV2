import { ExportBackupCard } from '@/components/explore/export-backup-card';
import { AppearanceSection } from '@/components/settings/appearance-section';

export default function SettingsScreen() {
  return (
    <ExportBackupCard eyebrow="Lift Atlas" title="Settings">
      <AppearanceSection />
    </ExportBackupCard>
  );
}
