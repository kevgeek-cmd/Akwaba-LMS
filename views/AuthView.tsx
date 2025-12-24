
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, Info } from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      onLogin(existing);
    } else {
      onLogin({
        id: Math.random().toString(),
        name: 'Utilisateur',
        firstName: 'Nouveau',
        email: email,
        role: UserRole.STUDENT,
        avatar: `https://i.pravatar.cc/150?u=${email}`
      });
    }
  };

  const fillTestAccount = (testEmail: string) => {
    setEmail(testEmail);
    setIsLogin(true);
  };

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-ivoryOrange outline-none text-base text-gray-900 font-semibold transition-all placeholder:text-gray-400";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 gap-8">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        {/* Left Side: Brand & Info */}
        <div className="bg-ivoryGreen md:w-2/5 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-ivoryOrange rounded-2xl flex items-center justify-center shadow-2xl mb-8">
              <span className="text-white font-black text-3xl">A</span>
            </div>
            <h2 className="text-4xl font-black mb-4 leading-tight">Bienvenue sur Akwaba.</h2>
            <p className="text-green-100 text-sm leading-relaxed opacity-80">
              {isLogin 
                ? "Accédez à votre espace personnel pour reprendre vos cours là où vous les avez laissés." 
                : "Créez votre compte étudiant et commencez à apprendre dès aujourd'hui."}
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <h4 className="text-xs font-black uppercase tracking-widest text-ivoryOrange mb-4 flex items-center gap-2">
              <Info size={14} /> Accès Rapides (Test)
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => fillTestAccount('admin@akwaba.ci')} className="text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] transition-colors border border-white/5">
                <span className="font-bold text-ivoryOrange">ADMIN :</span> admin@akwaba.ci
              </button>
              <button onClick={() => fillTestAccount('amani@akwaba.ci')} className="text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] transition-colors border border-white/5">
                <span className="font-bold text-ivoryOrange">PROF :</span> amani@akwaba.ci
              </button>
              <button onClick={() => fillTestAccount('sali@akwaba.ci')} className="text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] transition-colors border border-white/5">
                <span className="font-bold text-ivoryOrange">ÉDITEUR :</span> sali@akwaba.ci
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-10 md:w-3/5">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900 mb-2">{isLogin ? 'Connexion' : 'Nouvel Étudiant'}</h1>
            <p className="text-gray-500 text-sm">{isLogin ? 'Entrez vos accès pour continuer' : 'Remplissez les informations ci-dessous'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input required placeholder="Nom" className={inputClass} />
                  <UserIcon className={iconClass} size={20} />
                </div>
                <div className="relative">
                  <input required placeholder="Prénom" className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-ivoryOrange outline-none text-base text-gray-900 font-semibold transition-all placeholder:text-gray-400" />
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
                className={inputClass} 
              />
              <Mail className={iconClass} size={20} />
            </div>

            <div className="relative">
              <input required type="password" placeholder="Mot de passe" className={inputClass} />
              <Lock className={iconClass} size={20} />
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Âge" className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-ivoryOrange outline-none text-base text-gray-900 font-semibold transition-all placeholder:text-gray-400" />
                  <select required className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-ivoryOrange outline-none text-base text-gray-900 font-semibold transition-all">
                    <option value="">Niveau scolaire</option>
                    <option>Primaire</option>
                    <option>Collège</option>
                    <option>Lycée</option>
                    <option>Université</option>
                    <option>Professionnel</option>
                  </select>
                </div>
                <div className="relative">
                  <input required placeholder="Téléphone (+225)" className={inputClass} />
                  <Phone className={iconClass} size={20} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Ville (ex: Abidjan)" className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-ivoryOrange outline-none text-base text-gray-900 font-semibold transition-all placeholder:text-gray-400" />
                  <input required placeholder="Quartier" className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-ivoryOrange outline-none text-base text-gray-900 font-semibold transition-all placeholder:text-gray-400" />
                </div>
              </>
            )}

            <button type="submit" className="w-full py-5 bg-ivoryOrange text-white rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95">
              {isLogin ? 'Accéder à mon espace' : "Confirmer mon inscription"} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-sm font-bold text-ivoryGreen hover:text-ivoryOrange transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isLogin ? "Nouveau ici ? Créer un compte Étudiant" : "Déjà un compte ? Connectez-vous ici"}
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">
        Propulsé par Akwaba Technologies Côte d'Ivoire
      </p>
    </div>
  );
};

export default AuthView;
