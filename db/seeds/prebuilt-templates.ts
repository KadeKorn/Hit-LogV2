export const PREBUILT_TEMPLATE_IDS = {
  fullBodyHypertrophy3x: 'prebuilt-template-full-body-hypertrophy-3x',
  pushPullLegs: 'prebuilt-template-push-pull-legs',
  hitInspiredLowVolume: 'prebuilt-template-hit-inspired-low-volume',
} as const;

export const PREBUILT_TEMPLATE_DAY_IDS = {
  fullBodyDayA: 'prebuilt-day-full-body-a',
  fullBodyDayB: 'prebuilt-day-full-body-b',
  fullBodyDayC: 'prebuilt-day-full-body-c',
  pushDay: 'prebuilt-day-push',
  pullDay: 'prebuilt-day-pull',
  legsDay: 'prebuilt-day-legs',
  hitDayA: 'prebuilt-day-hit-a',
  hitDayB: 'prebuilt-day-hit-b',
} as const;

const PREBUILT_TEMPLATE_TIMESTAMP = '2026-05-31T00:00:00.000Z';

export type SeedPrebuiltTemplateRecord = {
  code: string;
  createdAt: string;
  description: string;
  goal: string;
  id: string;
  isActive: boolean;
  isEditable: boolean;
  name: string;
  orderIndex: number;
  sourceType: 'prebuilt';
  splitType: string;
  updatedAt: string;
};

export type SeedTemplateDayRecord = {
  createdAt: string;
  dayOrder: number;
  focus: string;
  id: string;
  name: string;
  templateId: string;
  updatedAt: string;
};

export const prebuiltTemplateSeeds: readonly SeedPrebuiltTemplateRecord[] = [
  {
    id: PREBUILT_TEMPLATE_IDS.fullBodyHypertrophy3x,
    code: 'prebuilt-full-body-hypertrophy-3x',
    name: 'Full Body Hypertrophy 3x/week',
    description: 'Skeletal Phase 2C foundation for a three-day full-body hypertrophy template.',
    goal: 'hypertrophy',
    splitType: 'full_body_3x',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 100,
    isActive: false,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_IDS.pushPullLegs,
    code: 'prebuilt-push-pull-legs',
    name: 'Push / Pull / Legs',
    description: 'Skeletal Phase 2C foundation for a push, pull, legs hypertrophy template.',
    goal: 'hypertrophy',
    splitType: 'push_pull_legs',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 101,
    isActive: false,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_IDS.hitInspiredLowVolume,
    code: 'prebuilt-hit-inspired-low-volume',
    name: 'HIT-Inspired Low-Volume Routine',
    description: 'Skeletal Phase 2C foundation for a low-volume hypertrophy template.',
    goal: 'hypertrophy',
    splitType: 'hit_low_volume',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 102,
    isActive: false,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
] as const;

export const prebuiltTemplateDaySeeds: readonly SeedTemplateDayRecord[] = [
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayA,
    templateId: PREBUILT_TEMPLATE_IDS.fullBodyHypertrophy3x,
    name: 'Full Body A',
    dayOrder: 1,
    focus: 'full_body',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayB,
    templateId: PREBUILT_TEMPLATE_IDS.fullBodyHypertrophy3x,
    name: 'Full Body B',
    dayOrder: 2,
    focus: 'full_body',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayC,
    templateId: PREBUILT_TEMPLATE_IDS.fullBodyHypertrophy3x,
    name: 'Full Body C',
    dayOrder: 3,
    focus: 'full_body',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.pushDay,
    templateId: PREBUILT_TEMPLATE_IDS.pushPullLegs,
    name: 'Push',
    dayOrder: 1,
    focus: 'chest_shoulders_triceps',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.pullDay,
    templateId: PREBUILT_TEMPLATE_IDS.pushPullLegs,
    name: 'Pull',
    dayOrder: 2,
    focus: 'back_biceps',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.legsDay,
    templateId: PREBUILT_TEMPLATE_IDS.pushPullLegs,
    name: 'Legs',
    dayOrder: 3,
    focus: 'legs',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.hitDayA,
    templateId: PREBUILT_TEMPLATE_IDS.hitInspiredLowVolume,
    name: 'HIT A',
    dayOrder: 1,
    focus: 'full_body_low_volume',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.hitDayB,
    templateId: PREBUILT_TEMPLATE_IDS.hitInspiredLowVolume,
    name: 'HIT B',
    dayOrder: 2,
    focus: 'full_body_low_volume',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
] as const;
