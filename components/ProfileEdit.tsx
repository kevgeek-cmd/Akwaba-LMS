
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';
import { Save, User as UserIcon, MapPin, Phone, Mail, Info, Image as ImageIcon } from 'lucide-react';

const ProfileEdit: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const u = storage.getUsers().find(x => x.id === userId);
    if (u) {
      setUser(u);
      setFormData(u);
    }
  }, [userId]);

  const handleSave = () => {
    if (!formData.name || !formData.firstName) return alert("Le nom et le prénom sont requis.");
    
    // Validation basique du téléphone international
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      return alert("Format de téléphone invalide. Utilisez le format international (ex: +225 0700000000)");
    }

    const all = storage.getUsers();
    const updated = all.map(u => u.id === userId ? { ...u, ...formData } : u);
    storage.saveUsers(updated);
    
    // Mise à jour de la session
    const session = localStorage.getItem('akwaba_session');
    if (session) {
      const sessionUser = JSON.parse(session);
      if (sessionUser.id === userId) {
        localStorage.setItem('akwaba_session', JSON.stringify({ ...sessionUser, ...formData }));
      }
    }
    
    alert("Profil mis à jour avec succès !");
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-500 pb-20">
      <div className="bg-white rounded-[56px] p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ivoryGreen/5 rounded-full -mr-32 -mt-32"></div>
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="relative group">
            <img src={formData.avatar} className="w-48 h-48 rounded-[48px] object-cover border-8 border-white shadow-2xl" />
            <div className="absolute -bottom-4 -right-4 bg-ivoryOrange text-white p-4 rounded-2xl shadow-xl">
              <ImageIcon size={24} />
            </div>
          </div>
          <div className="flex-grow space-y-2 text-center md:text-left">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
              {formData.firstName} {formData.name}
            </h2>
            <p className="text-xl font-bold text-ivoryGreen flex items-center justify-center md:justify-start gap-2 uppercase tracking-widest text-xs">
              <UserIcon size={16}/> {user.role} • Membre Actif
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[48px] shadow-xl border border-gray-100 space-y-8">
          <h3 className="text-2xl font-black flex items-center gap-3 text-ivoryOrange"><Info/> Identité & Visuel</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                <input 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                <input 
                  value={formData.firstName || ''} 
                  onChange={e => setFormData({...formData, firstName: e.target.value})} 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lien Photo de Profil (URL)</label>
              <input 
                value={formData.avatar || ''} 
                onChange={e => setFormData({...formData, avatar: e.target.value})} 
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none transition-all" 
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio / Slogan</label>
              <textarea 
                value={formData.bio || ''} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                rows={3} 
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none transition-all" 
                placeholder="Décrivez votre parcours..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] shadow-xl border border-gray-100 space-y-8">
          <h3 className="text-2xl font-black flex items-center gap-3 text-ivoryOrange"><Phone/> Contact & Localisation</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone (International)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  value={formData.phone || ''} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  placeholder="+225 07 00 00 00 00" 
                  className="w-full pl-12 p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ville</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  value={formData.city || ''} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                  placeholder="Abidjan, Yamoussoukro..." 
                  className="w-full pl-12 p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                <input 
                  value={user.email} 
                  disabled
                  className="w-full pl-12 p-4 rounded-2xl bg-gray-100 border-2 border-transparent text-gray-400 font-bold outline-none" 
                />
              </div>
            </div>
            <button onClick={handleSave} className="w-full py-5 bg-ivoryGreen text-white rounded-3xl font-black text-xl shadow-xl shadow-green-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mt-6"><Save size={24}/> ENREGISTRER MON PROFIL</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
