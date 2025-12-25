
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { storage } from '../utils/storage';
import { Mail, Lock } from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allUsers = storage.getUsers();
    const existing = allUsers.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    
    if (existing) {
      onLogin(existing);
    } else {
      if (isLogin) {
        alert("Ce compte n'est pas enregistré localement.");
      } else {
        const newUser: User = {
          id: `u-${Date.now()}`,
          name: 'Utilisateur',
          firstName: 'Nouveau',
          email: email,
          role: UserRole.STUDENT,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
          createdAt: new Date().toISOString()
        };
        const updatedUsers = [...allUsers, newUser];
        storage.saveUsers(updatedUsers);
        onLogin(newUser);
      }
    }
  };

  const fillTestAccount = (testEmail: string) => {
    setEmail(testEmail);
    setIsLogin(true);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-50">
        <div className="bg-ivoryGreen md:w-2/5 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-ivoryOrange rounded-3xl flex items-center justify-center shadow-2xl mb-10">
              <span className="text-white font-black text-4xl">A</span>
            </div>
            <h2 className="text-5xl font-black mb-6 leading-tight tracking-tighter">Bienvenue.</h2>
            <p className="text-green-100 text-lg font-medium opacity-80 leading-relaxed">Accédez à votre espace d'apprentissage local 100% ivoirien.</p>
          </div>
          
          <div className="mt-12 pt-10 border-t border-white/10 relative z-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ivoryOrange mb-6">Accès Rapides</h4>
            <div className="space-y-3">
              <button onClick={() => fillTestAccount('admin@akwaba.ci')} className="w-full text-left px-4 py-3 bg-white/5 rounded-2xl text-xs font-bold border border-white/5 hover:bg-white/10 flex justify-between items-center transition-all">
                <span>ADMIN</span>
                <span className="opacity-40">admin@akwaba.ci</span>
              </button>
              <button onClick={() => fillTestAccount('amani@akwaba.ci')} className="w-full text-left px-4 py-3 bg-white/5 rounded-2xl text-xs font-bold border border-white/5 hover:bg-white/10 flex justify-between items-center transition-all">
                <span>FORMATEUR</span>
                <span className="opacity-40">amani@akwaba.ci</span>
              </button>
              <button onClick={() => fillTestAccount('jean@akwaba.ci')} className="w-full text-left px-4 py-4 bg-ivoryOrange/20 rounded-2xl text-xs font-black border border-ivoryOrange/30 hover:bg-ivoryOrange/40 flex justify-between items-center text-ivoryOrange transition-all shadow-lg">
                <span>TEST ÉTUDIANT</span>
                <span className="opacity-60">jean@akwaba.ci</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-16 md:w-3/5">
          <h1 className="text-4xl font-black text-gray-900 mb-10">{isLogin ? 'Connexion' : 'Inscription'}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <input 
                  required 
                  type="email" 
                  placeholder="votre@email.ci" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-ivoryOrange outline-none font-bold text-gray-900 text-lg shadow-sm transition-all" 
                />
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative">
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-ivoryOrange outline-none font-bold text-gray-900 text-lg shadow-sm transition-all" 
                />
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              </div>
            </div>
            <button type="submit" className="w-full py-6 bg-ivoryOrange text-white rounded-3xl font-black text-xl shadow-2xl shadow-orange-100 hover:bg-orange-600 hover:-translate-y-1 active:translate-y-0 transition-all mt-8">
              {isLogin ? 'Accéder à mon espace' : "Créer mon profil"}
            </button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-10 text-sm font-black text-ivoryGreen hover:text-green-700 transition-colors">
            {isLogin ? "PAS ENCORE DE COMPTE ? S'INSCRIRE" : "DÉJÀ UN COMPTE ? SE CONNECTER"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
