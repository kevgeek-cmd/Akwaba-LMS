
import { Course, Permission, UserRole, User } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Marketing Digital pour PME Ivoiriennes',
    instructor: 'Amani Konan',
    thumbnail: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800',
    category: 'Business',
    description: 'Apprenez à digitaliser votre commerce local avec les outils modernes.',
    modules: [
      {
        id: 'm1',
        title: 'Introduction au Web',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoType: 'file',
        description: 'Les bases de la visibilité en ligne.',
        isLocked: false,
        isCompleted: true,
      },
      {
        id: 'm2',
        title: 'Réseaux Sociaux et Vente',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoType: 'url',
        description: 'Comment transformer vos likes en ventes.',
        isLocked: false,
        isCompleted: false,
        quiz: [
          {
            id: 'q1',
            text: 'Quelle est la couleur dominante du drapeau de la Côte d\'Ivoire ?',
            options: ['Bleu, Blanc, Rouge', 'Orange, Blanc, Vert', 'Jaune, Vert, Rouge'],
            correctIndex: 1,
          },
          {
            id: 'q2',
            text: 'Quel réseau social est le plus utilisé pour le commerce de proximité ?',
            options: ['LinkedIn', 'WhatsApp Business', 'Twitter'],
            correctIndex: 1,
          }
        ]
      }
    ]
  }
];

export const APP_PERMISSIONS: Permission[] = [
  { id: 'edit_course', label: 'Modifier les cours', description: 'Autorise la modification du contenu' },
  { id: 'delete_user', label: 'Supprimer utilisateur', description: 'Permet de retirer un utilisateur' },
  { id: 'create_staff', label: 'Créer staff', description: 'Peut créer des profils profs/éditeurs' },
  { id: 'moderate', label: 'Modérer', description: 'Peut modifier tout contenu posté' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Bakayoko', firstName: 'Jean-Marc', email: 'jean@akwaba.ci', role: UserRole.STUDENT, avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Konan', firstName: 'Amani', email: 'amani@akwaba.ci', role: UserRole.INSTRUCTOR, avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Admin', firstName: 'Akwaba', email: 'admin@akwaba.ci', role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Ouattara', firstName: 'Sali', email: 'sali@akwaba.ci', role: UserRole.EDITOR, avatar: 'https://i.pravatar.cc/150?u=u4' },
];
