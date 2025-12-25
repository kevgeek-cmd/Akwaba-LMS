
import { Course, UserRole, User } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Bakayoko', firstName: 'Jean-Marc', email: 'jean@akwaba.ci', role: UserRole.STUDENT, avatar: 'https://i.pravatar.cc/150?u=u1', createdAt: '2023-10-01' },
  { id: 'u2', name: 'Konan', firstName: 'Amani', email: 'amani@akwaba.ci', role: UserRole.INSTRUCTOR, avatar: 'https://i.pravatar.cc/150?u=u2', createdAt: '2023-10-01' },
  { id: 'u3', name: 'Admin', firstName: 'Akwaba', email: 'admin@akwaba.ci', role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=u3', createdAt: '2023-10-01' },
  { id: 'u4', name: 'Ouattara', firstName: 'Sali', email: 'sali@akwaba.ci', role: UserRole.EDITOR, avatar: 'https://i.pravatar.cc/150?u=u4', createdAt: '2023-10-01' },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Marketing Digital pour PME Ivoiriennes',
    instructor: 'Amani Konan',
    instructorId: 'u2',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    category: 'Business',
    description: 'Développez votre visibilité locale.',
    isDraft: false,
    createdAt: '2023-12-01',
    modules: [{
      id: 'm1', title: 'Introduction', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', videoType: 'file', description: 'Les bases.',
      quiz: [{ id: 'q1', text: 'Quelle couleur est l\'orange?', options: ['Fruit', 'Couleur', 'Les deux'], correctIndex: 2 }]
    }]
  },
  {
    id: 'c2',
    title: 'Culture de l\'Anacarde Moderne',
    instructor: 'Dr. Koffi',
    instructorId: 'u2',
    thumbnail: 'https://images.unsplash.com/photo-1599403399049-7f9996616086?auto=format&fit=crop&q=80&w=800',
    category: 'Agriculture',
    description: 'Optimisez vos rendements annuels.',
    isDraft: false,
    createdAt: '2023-12-05',
    modules: []
  },
  {
    id: 'c3',
    title: 'Code React.js : Spécial Startup',
    instructor: 'Yasmine O.',
    instructorId: 'u4',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    category: 'Tech',
    description: 'Créez des apps modernes rapidement.',
    isDraft: false,
    createdAt: '2023-12-10',
    modules: []
  },
  {
    id: 'c4',
    title: 'Gestion de Boutique à Abidjan',
    instructor: 'M. Touré',
    instructorId: 'u2',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    category: 'Commerce',
    description: 'Tenir sa caisse et ses stocks.',
    isDraft: false,
    createdAt: '2023-12-15',
    modules: []
  },
  {
    id: 'c5',
    title: 'Anglais des Affaires (Business English)',
    instructor: 'Mrs. Brown',
    instructorId: 'u4',
    thumbnail: 'https://images.unsplash.com/photo-1543165796-5426273eaab3?auto=format&fit=crop&q=80&w=800',
    category: 'Langues',
    description: 'Communiquez avec vos partenaires internationaux.',
    isDraft: false,
    createdAt: '2023-12-20',
    modules: []
  }
];
