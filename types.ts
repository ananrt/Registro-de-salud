
export enum ReadingType {
  BloodPressure = 'BLOOD_PRESSURE',
  BloodSugar = 'BLOOD_SUGAR',
}

export enum BloodSugarContext {
  FASTING = 'En ayunas',
  BEFORE_MEAL = 'Antes de comer',
  AFTER_MEAL = 'Después de comer',
  OTHER = 'Otro',
}

export interface BloodPressureReading {
  id: string;
  type: ReadingType.BloodPressure;
  timestamp: number;
  systolic: number;
  diastolic: number;
  pulse: number;
}

export interface BloodSugarReading {
  id: string;
  type: ReadingType.BloodSugar;
  timestamp: number;
  glucose: number;
  context: BloodSugarContext;
}

export type HealthReading = BloodPressureReading | BloodSugarReading;

export interface UserProfile {
  id: string;
  name: string;
  readings: HealthReading[];
}