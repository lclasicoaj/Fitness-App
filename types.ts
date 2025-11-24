export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  unit: 'kg' | 'lbs';
  completed: boolean;
}

export interface ExerciseLog {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  startTime: number;
  endTime?: number;
  name: string;
  exercises: ExerciseLog[];
}

export interface RoutineExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

export interface Routine {
  id: string;
  name: string;
  lastPerformed?: number;
  exercises: RoutineExercise[];
}

export enum AppScreen {
  DASHBOARD = 'DASHBOARD',
  LOGGING = 'LOGGING',
  ROUTINES = 'ROUTINES',
  PROFILE = 'PROFILE'
}

export interface AIParseResult {
  exercises: {
    name: string;
    sets: {
      reps: number;
      weight: number;
      unit: string;
    }[];
  }[];
}