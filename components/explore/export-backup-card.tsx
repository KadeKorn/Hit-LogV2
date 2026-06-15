import { Ionicons } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AtlasButton, AtlasCard, AtlasText, TopoBackground } from '@/components/atlas';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';
import { useWorkoutJsonExport } from '@/hooks/use-workout-json-export';

type ExportBackupCardProps = {
  children?: ReactNode;
  eyebrow?: string;
  title?: string;
};

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function IconBadge({ name, tone = 'gold' }: { name: IoniconName; tone?: 'gold' | 'warning' }) {
  const { c } = useAtlasTheme();
  const color = tone === 'warning' ? c.warning : c.gold;

  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tone === 'warning' ? c.field : c.goldTint,
        borderWidth: 1,
        borderColor: tone === 'warning' ? c.cardBorder : c.goldBorder,
      }}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

function StatusPanel({ children }: { children: ReactNode }) {
  const { c, radius } = useAtlasTheme();

  return (
    <View
      style={{
        backgroundColor: c.field,
        borderColor: c.cardBorder,
        borderWidth: 1,
        borderRadius: radius.sm,
        padding: 13,
        gap: 8,
      }}>
      {children}
    </View>
  );
}

export function ExportBackupCard({
  children,
  eyebrow = 'Explore',
  title = 'Backup',
}: ExportBackupCardProps) {
  const { c, spacing } = useAtlasTheme();
  const {
    csvError,
    csvResult,
    csvStatus,
    exportJsonBackup,
    exportWorkoutCsv,
    isExportingCsv,
    isExportingJson,
    jsonError,
    jsonResult,
    jsonStatus,
  } = useWorkoutJsonExport();

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <TopoBackground />
      <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.screenX,
            paddingTop: 8,
            paddingBottom: 36,
            gap: 16,
          }}>
          <View style={{ gap: 4, marginBottom: 4 }}>
            <AtlasText variant="micro" tone="gold">
              {eyebrow}
            </AtlasText>
            <AtlasText variant="h1" tone="strong">
              {title}
            </AtlasText>
          </View>

          {children}

          <AtlasText variant="micro" tone="gold" style={{ marginTop: 6 }}>
            Data Tools
          </AtlasText>

          {/* JSON export */}
          <AtlasCard style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconBadge name="share-outline" />
              <View style={{ flex: 1 }}>
                <AtlasText variant="cardTitle" tone="strong">
                  Export JSON backup
                </AtlasText>
                <AtlasText variant="label" tone="muted" style={{ marginTop: 2 }}>
                  Templates, custom exercises, active routine state, and completed V2 history.
                </AtlasText>
              </View>
            </View>

            <AtlasButton
              label={isExportingJson ? 'Exporting…' : 'Export JSON Backup'}
              onPress={exportJsonBackup}
              disabled={isExportingJson}
              accessibilityLabel="Export workout data as JSON"
              leftIcon={
                isExportingJson ? (
                  <ActivityIndicator color={c.onGold} />
                ) : (
                  <Ionicons name="share-outline" size={20} color={c.onGold} />
                )
              }
            />

            {jsonStatus === 'success' && jsonResult ? (
              <StatusPanel>
                <AtlasText variant="cardTitle" tone="strong">
                  Export ready
                </AtlasText>
                <AtlasText variant="label" tone="muted">
                  {jsonResult.fileName}
                </AtlasText>
                <View style={{ gap: 4 }}>
                  <AtlasText variant="body" tone="default">
                    Export version: {jsonResult.counts.exportVersion}
                  </AtlasText>
                  <AtlasText variant="body" tone="default">
                    Schema version: {jsonResult.counts.schemaVersion}
                  </AtlasText>
                  <AtlasText variant="body" tone="default">
                    Templates: {jsonResult.counts.templateCount}
                  </AtlasText>
                  <AtlasText variant="body" tone="default">
                    Custom templates: {jsonResult.counts.customTemplateCount}
                  </AtlasText>
                  <AtlasText variant="body" tone="default">
                    Exercise definitions: {jsonResult.counts.exerciseDefinitionCount}
                  </AtlasText>
                  <AtlasText variant="body" tone="default">
                    Custom exercises: {jsonResult.counts.customExerciseCount}
                  </AtlasText>
                  <AtlasText variant="body" tone="default">
                    Completed workouts: {jsonResult.counts.completedWorkoutCount}
                  </AtlasText>
                  <AtlasText variant="body" tone="default">
                    Set logs: {jsonResult.counts.setLogCount}
                  </AtlasText>
                  <AtlasText variant="body" tone="default">
                    Active routine present: {jsonResult.counts.activeRoutinePresent ? 'yes' : 'no'}
                  </AtlasText>
                </View>
              </StatusPanel>
            ) : null}

            {jsonStatus === 'error' && jsonError ? (
              <StatusPanel>
                <AtlasText variant="cardTitle" tone="warning">
                  Export failed
                </AtlasText>
                <AtlasText variant="body" tone="muted">
                  {jsonError.message}
                </AtlasText>
              </StatusPanel>
            ) : null}
          </AtlasCard>

          {/* CSV export */}
          <AtlasCard style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconBadge name="document-text-outline" />
              <View style={{ flex: 1 }}>
                <AtlasText variant="cardTitle" tone="strong">
                  Export workout CSV
                </AtlasText>
                <AtlasText variant="label" tone="muted" style={{ marginTop: 2 }}>
                  Readable completed workout rows for review outside the app.
                </AtlasText>
              </View>
            </View>

            <AtlasButton
              variant="ghost"
              label={isExportingCsv ? 'Exporting…' : 'Export CSV'}
              onPress={exportWorkoutCsv}
              disabled={isExportingCsv}
              accessibilityLabel="Export completed workout history as CSV"
              leftIcon={
                isExportingCsv ? (
                  <ActivityIndicator color={c.goldSoft} />
                ) : (
                  <Ionicons name="document-text-outline" size={18} color={c.goldSoft} />
                )
              }
            />

            {csvStatus === 'success' && csvResult ? (
              <StatusPanel>
                <AtlasText variant="cardTitle" tone="strong">
                  CSV ready
                </AtlasText>
                <AtlasText variant="label" tone="muted">
                  {csvResult.fileName}
                </AtlasText>
                <AtlasText variant="body" tone="default">
                  Rows: {csvResult.rowCount}
                </AtlasText>
              </StatusPanel>
            ) : null}

            {csvStatus === 'error' && csvError ? (
              <StatusPanel>
                <AtlasText variant="cardTitle" tone="warning">
                  CSV export failed
                </AtlasText>
                <AtlasText variant="body" tone="muted">
                  {csvError.message}
                </AtlasText>
              </StatusPanel>
            ) : null}
          </AtlasCard>

          {/* Import — intentionally disabled */}
          <AtlasCard style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconBadge name="lock-closed-outline" tone="warning" />
              <View style={{ flex: 1 }}>
                <AtlasText variant="cardTitle" tone="strong">
                  Import JSON backup
                </AtlasText>
                <AtlasText variant="label" tone="muted" style={{ marginTop: 2 }}>
                  Restore is deferred until a transaction-safe full replacement flow is added.
                </AtlasText>
              </View>
            </View>

            <StatusPanel>
              <AtlasText variant="cardTitle" tone="warning">
                Import disabled for field-test safety
              </AtlasText>
              <AtlasText variant="body" tone="muted">
                JSON backups can be exported and inspected now. Destructive restore is intentionally
                unavailable in this phase.
              </AtlasText>
            </StatusPanel>
          </AtlasCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
