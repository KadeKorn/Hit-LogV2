export type TemplateSource = 'prebuilt' | 'custom';

export type ActiveRoutineStatus = 'active' | 'paused' | 'completed' | 'archived';

export type ProgressionMethod =
  | 'double_progression'
  | 'top_set_progression'
  | 'rep_progression'
  | 'manual'
  | 'none';

export type WorkoutTemplate = {
  code: string;
  createdAt: string;
  description: string | null;
  goal: string | null;
  id: string;
  isActive: boolean;
  isEditable: boolean;
  name: string;
  orderIndex: number;
  originTemplateId: string | null;
  sourceType: TemplateSource;
  splitType: string | null;
  updatedAt: string;
};

export type TemplateDay = {
  createdAt: string;
  dayOrder: number;
  focus: string | null;
  id: string;
  name: string;
  templateId: string;
  updatedAt: string;
};

export type ExerciseDefinition = {
  category: string | null;
  createdAt: string;
  defaultLoadIncrement: number | null;
  defaultProgressionMethod: ProgressionMethod | null;
  defaultRepMax: number | null;
  defaultRepMin: number | null;
  defaultRestSeconds: number | null;
  id: string;
  name: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroups: string[] | null;
  updatedAt: string;
};

export type ProgressionPolicy = {
  allowDeloadFlag: boolean;
  createdAt: string;
  id: string;
  loadIncrement: number | null;
  method: ProgressionMethod;
  notes: string | null;
  requireAllSetsAtTop: boolean;
  targetRepMax: number | null;
  targetRepMin: number | null;
  updatedAt: string;
};

export type ExercisePrescription = {
  createdAt: string;
  exerciseDefinitionId: string;
  exerciseOrder: number;
  id: string;
  loadIncrement: number | null;
  muscleGroup: string;
  notes: string | null;
  progressionPolicyId: string | null;
  repRangeMax: number;
  repRangeMin: number;
  restSeconds: number | null;
  sets: number;
  templateDayId: string;
  updatedAt: string;
};

export type ActiveRoutine = {
  createdAt: string;
  currentDayIndex: number;
  currentTemplateDayId: string | null;
  id: string;
  lastWorkoutSessionId: string | null;
  startedAt: string;
  status: ActiveRoutineStatus;
  templateId: string;
  updatedAt: string;
};

export type WorkoutTemplateWithDays = WorkoutTemplate & {
  days: TemplateDay[];
};
