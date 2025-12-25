
import { User, Course, Enrollment, ChatMessage } from '../types';
import { MOCK_USERS, MOCK_COURSES } from '../constants';
import { createClient } from '@supabase/supabase-js';

const USERS_KEY = 'akwaba_db_users_v4';
const COURSES_KEY = 'akwaba_db_courses_v4';
const ENROLLMENTS_KEY = 'akwaba_db_enrollments_v4';
const MESSAGES_KEY = 'akwaba_db_messages_v4';

// Fonction sécurisée pour récupérer les variables d'env
const getEnvVar = (key: string): string => {
  try {
    // Tentative via import.meta.env (Vite)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key] || '';
    }
    // Tentative via process.env (Node/Vercel)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
  } catch (e) {
    console.warn(`Erreur lors de la lecture de ${key}:`, e);
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const storage = {
  getUsers: (): User[] => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : MOCK_USERS;
    } catch { return MOCK_USERS; }
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('storage_update'));
  },
  getCourses: (): Course[] => {
    try {
      const stored = localStorage.getItem(COURSES_KEY);
      return stored ? JSON.parse(stored) : MOCK_COURSES;
    } catch { return MOCK_COURSES; }
  },
  saveCourses: (courses: Course[]) => {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
    window.dispatchEvent(new Event('storage_update'));
  },
  getEnrollments: (): Enrollment[] => {
    try {
      const stored = localStorage.getItem(ENROLLMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  },
  saveEnrollments: (enrolls: Enrollment[]) => {
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrolls));
    window.dispatchEvent(new Event('storage_update'));
  },
  getMessages: (): ChatMessage[] => {
    try {
      const stored = localStorage.getItem(MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  },
  saveMessages: (msgs: ChatMessage[]) => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
    window.dispatchEvent(new Event('storage_update'));
  },
  init: () => {
    if (!localStorage.getItem(USERS_KEY)) storage.saveUsers(MOCK_USERS);
    if (!localStorage.getItem(COURSES_KEY)) storage.saveCourses(MOCK_COURSES);
    if (!localStorage.getItem(ENROLLMENTS_KEY)) {
      const mockEnrolls: Enrollment[] = [
        { userId: 'u1', courseId: 'c1', enrolledAt: new Date().toISOString(), progress: 0 }
      ];
      storage.saveEnrollments(mockEnrolls);
    }
  }
};
