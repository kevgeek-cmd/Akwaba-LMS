
export enum UserRole {
  STUDENT = 'Étudiant',
  INSTRUCTOR = 'Formateur',
  EDITOR = 'Éditeur',
  ADMIN = 'Administrateur'
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: UserRole;
  avatar: string;
  // Champs spécifiques étudiant
  age?: number;
  gradeLevel?: string;
  phone?: string;
  country?: string;
  city?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Module {
  id: string;
  title: string;
  videoUrl: string;
  videoType: 'file' | 'url';
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
  quiz?: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  category: string;
  modules: Module[];
  description: string;
}

export interface Permission {
  id: string;
  label: string;
  description: string;
}
