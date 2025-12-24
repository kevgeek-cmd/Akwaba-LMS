
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { Mail, Lock, User as UserIcon, Phone, MapPin, GraduationCap, ArrowRight } from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation simple : si l'email existe dans MOCK_USERS, on connecte, sinon on crée un étudiant
    const existing = MOCK_USERS.find(u => u.email === email);
    if (existing) {
      onLogin(existing);
    } else {
      // Simulation création étudiant
      onLogin({
        id: Math.random().toString(),
        name: 'Nouvel',
        firstName: 'Étudiant',
        email: email,
        role: UserRole.STUDENT,
        avatar: 'https://i.pravatar.cc/150'
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="bg-ivoryGreen md:w-1/3 p-8 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Akwaba!</h2>
          <p className="text-green-100 text-sm">
            {isLogin 
              ? "Heureux de vous revoir. Connectez-vous pour continuer votre apprentissage." 
              : "Rejoignez la plus grande communauté d'apprentissage en Côte d'Ivoire."}
          </p>
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-xs uppercase font-bold tracking-widest opacity-60">Info Staff</p>
            <p className="text-[10px] mt-2 leading-tight">Les comptes Formateurs, Éditeurs et Admins sont créés manuellement par la direction.</p>
          </div>
        </div>

        <div className="p-8 md:w-2/3">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{isLogin ? 'Connexion' : 'Inscription Étudiant'}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input required placeholder="Nom" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none text-sm" />
                  <UserIcon className="absolute left-3 top-3.5 text-gray-400" size={16} />
                </div>
                <div className="relative">
                  <input required placeholder="Prénom" className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none text-sm" />
                </div>
              </div>
            )}

            <div className="relative">
              <input 
                required 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none text-sm" 
              />
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={16} />
            </div>

            <div className="relative">
              <input required type="password" placeholder="Mot de passe" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none text-sm" />
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={16} />
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Âge" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none text-sm" />
                  <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none text-sm bg-white">
                    <option value="">Niveau scolaire</option>
                    <option>Primaire</option>
                    <option>Collège</option>
                    <option>Lycée</option>
                    <option>Université</option>
                    <option>Professionnel</option>
                  </select>
                </div>
                <div className="relative">
                  <input required placeholder="Téléphone" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none text-sm" />
                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={16} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Pays" defaultValue="Côte d'Ivoire" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none text-sm" />
                  <input required placeholder="Ville" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none text-sm" />
                </div>
              </>
            )}

            <button type="submit" className="w-full py-4 bg-ivoryOrange text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center gap-2">
              {isLogin ? 'Se connecter' : "S'inscrire"} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-sm font-semibold text-ivoryGreen hover:underline"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà inscrit ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
