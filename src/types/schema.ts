// Tipos de roles disponibles en la plataforma
export type Role = 'admin' | 'trainer' | 'client';

// Interfaz para el perfil de usuario global (Almacenado en la colección 'users')
export interface UserProfile {
  id: string; // UID generado por Firebase Auth
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dob?: string; // Fecha de nacimiento
  gender?: string;
  address?: string;
  superAdmin?: boolean; // Booleano que define si el usuario es dueño del SaaS
  roles: Record<string, Role>; // Mapa de roles por gimnasio: { "gym_id": "client" }
}

// Interfaz para la configuración de cada Gimnasio (Tenant)
export interface Gym {
  id: string;
  name: string;
  branding: {
    primaryColor: string; // Color principal de la marca (Hex)
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string; // URL del logotipo subido a Firebase Storage
    theme: 'dark' | 'light'; // Tema visual por defecto
  };
  status: 'active' | 'suspended'; // Estado de la suscripción del gimnasio al SaaS
  createdAt: number; // Timestamp de creación
}

// Interfaz extendida para la información médica y física de un Cliente
export interface ClientInfo {
  id: string;
  gymId: string; // Gimnasio al que pertenece
  userId: string; // Referencia al UserProfile
  trainerId?: string; // Entrenador asignado (opcional)
  emergencyInfo?: {
    contactName: string;
    contactPhone: string;
  };
  physicalInfo?: {
    height: number; // Altura en cm
    weight: number; // Peso en kg
    bmi: number; // Índice de Masa Corporal
    bodyFat: number; // Porcentaje de grasa
    muscleMass: number; // Porcentaje de masa muscular
  };
  healthInfo?: {
    injuries: string[]; // Historial de lesiones
    conditions: string[]; // Condiciones médicas
    medications: string[]; // Medicamentos
  };
  goals: string[]; // Objetivos (ej. "Perder peso", "Ganar fuerza")
  category?: string; // Categoría asignada por la IA
}

// Repositorio global de ejercicios
export interface Exercise {
  id: string;
  isGlobal: boolean; // Si es true, está disponible para todos los gimnasios
  gymId?: string; // Si no es global, pertenece a un gimnasio específico
  name: string;
  description: string; // Instrucciones de ejecución
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  muscleGroups: string[]; // Músculos involucrados
  equipment: string[]; // Equipamiento necesario (mancuernas, barras, etc.)
  media?: {
    imageUrl?: string; // Imagen generada por IA o subida
    videoTutorialUrl?: string; // Enlace a video tutorial
  };
}

// Estructura de una Rutina de Entrenamiento
export interface Routine {
  id: string;
  gymId: string;
  clientId: string;
  trainerId: string;
  generatedByAI: boolean; // Indica si fue creada por Gemini
  name: string; // Nombre de la rutina (ej. "Fuerza - Lunes")
  schedule: {
    startDate: number; // Timestamp de inicio
    endDate?: number;
    weeklyDays: number[]; // Días de la semana que se entrena (0 = Domingo, 1 = Lunes)
  };
  exercises: {
    exerciseId: string; // Referencia al ID del Ejercicio
    sets: number; // Cantidad de series
    reps: string; // Cantidad de repeticiones (texto libre para permitir "Al fallo")
    restTime: number; // Tiempo de descanso en segundos
    targetWeight?: number; // Peso objetivo sugerido
  }[];
}
