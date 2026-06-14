export type Role = 'admin' | 'trainer' | 'client';

export interface UserProfile {
  id: string; // Firebase Auth UID
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  superAdmin?: boolean;
  roles: Record<string, Role>; // Map of GymId to Role
}

export interface Gym {
  id: string;
  name: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
    theme: 'dark' | 'light';
  };
  status: 'active' | 'suspended';
  createdAt: number;
}

export interface ClientInfo {
  id: string;
  gymId: string;
  userId: string;
  trainerId?: string;
  emergencyInfo?: {
    contactName: string;
    contactPhone: string;
  };
  physicalInfo?: {
    height: number;
    weight: number;
    bmi: number;
    bodyFat: number;
    muscleMass: number;
  };
  healthInfo?: {
    injuries: string[];
    conditions: string[];
    medications: string[];
  };
  goals: string[];
  category?: string; // AI-assigned: 'Weight Loss', 'Hypertrophy', etc.
}

export interface Exercise {
  id: string;
  isGlobal: boolean;
  gymId?: string; // Null if global
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  muscleGroups: string[];
  equipment: string[];
  media?: {
    imageUrl?: string;
    videoTutorialUrl?: string;
  };
}

export interface Routine {
  id: string;
  gymId: string;
  clientId: string;
  trainerId: string;
  generatedByAI: boolean;
  name: string;
  schedule: {
    startDate: number;
    endDate?: number;
    weeklyDays: number[]; // 0 for Sunday, 1 for Monday, etc.
  };
  exercises: {
    exerciseId: string;
    sets: number;
    reps: string;
    restTime: number; // in seconds
    targetWeight?: number;
  }[];
}
