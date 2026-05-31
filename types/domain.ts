export type TemplateSource = 'prebuilt' | 'custom';

export type ActiveRoutineStatus = 'active' | 'paused' | 'completed' | 'archived';
export type WorkoutSessionStatus = 'active' | 'completed' | 'abandoned';
export type EffortRating = 'easy' | 'moderate' | 'hard' | 'failure';

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

export type WorkoutSession = {
  activeRoutineId: string | null;
  completedAt: string | null;
  createdAt: string;
  id: string;
  notes: string | null;
  startedAt: string;
  status: WorkoutSessionStatus;
  templateDayId: string | null;
  templateId: string | null;
  updatedAt: string;
};

export type CompletedExercise = {
  createdAt: string;
  effortRating: EffortRating | null;
  estimatedRir: 0 | 1 | 2 | 3 | null;
  exerciseDefinitionId: string | null;
  exerciseName: string;
  id: string;
  isSubstitution: boolean;
  muscleGroup: string | null;
  notes: string | null;
  orderIndex: number;
  plannedExercisePrescriptionId: string | null;
  plannedRepMax: number | null;
  plannedRepMin: number | null;
  plannedSets: number | null;
  substitutedForExerciseDefinitionId: string | null;
  updatedAt: string;
  workoutSessionId: string;
};

export type SetLog = {
  completedExerciseId: string;
  createdAt: string;
  id: string;
  isWarmup: boolean;
  notes: string | null;
  reps: number | null;
  setNumber: number;
  updatedAt: string;
  weight: number | null;
};
