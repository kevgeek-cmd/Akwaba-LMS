
import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { User, UserRole, Course, Enrollment, ChatMessage } from '../types';
import { Search, UserPlus, X, Edit2, Trash2, Save, Filter, BookOpen, MessageSquare, Send, Paperclip, AlertTriangle } from 'lucide-react';
import InstructorSpace from './InstructorSpace';
import ChatWindow from '../components/ChatWindow';

const AdminPanel: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const [activeTab, setActiveTab] = useState<'staff' | 'students' | 'courses' | 'messages'>('staff');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  
  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCourseDeleteConfirm, setShowCourseDeleteConfirm] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [userFormData, setUserFormData] = useState<Partial<User>>({});
  const [globalMessage, setGlobalMessage] = useState('');

  const loadAll = () => {
    setUsers(storage.getUsers());
    setCourses(storage.getCourses());
    setEnrollments(storage.getEnrollments());
  };

  useEffect(() => {
    loadAll();
    const handleUpdate = () => loadAll();
    window.addEventListener('storage_update', handleUpdate);
    return () => window.removeEventListener('storage_update', handleUpdate);
  }, []);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const all = storage.getUsers();
    let updated;
    if (editingUser) {
      updated = all.map(u => u.id === editingUser.id ? { ...u, ...userFormData } : u);
    } else {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: userFormData.name || '',
        firstName: userFormData.firstName || '',
        email: userFormData.email || '',
        role: userFormData.role || UserRole.STUDENT,
        avatar: userFormData.avatar || `https://i.pravatar.cc/150?u=${userFormData.email}`,
        createdAt: new Date().toISOString()
      };
      updated = [newUser, ...all];
    }
    storage.saveUsers(updated);
    setShowUserModal(false);
    alert("Données enregistrées !");
  };

  const confirmDelete = (id: string) => {
    const updated = storage.getUsers().filter(u => u.id !== id);
    storage.saveUsers(updated);
    setShowDeleteConfirm(null);
  };

  const confirmCourseDelete = (id: string) => {
    const updated = storage.getCourses().filter(c => c.id !== id);
    storage.saveCourses(updated);
    setShowCourseDeleteConfirm(null);
    alert("Le cours a été supprimé.");
  };

  const handleSendGlobal = () => {
    if (!globalMessage.trim()) return;
    const msgs = storage.getMessages();
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      fromId: currentUserId,
      toId: 'global',
      text: globalMessage,
      createdAt: new Date().toISOString()
    };
    storage.saveMessages([...msgs, newMessage]);
    setGlobalMessage('');
    alert("Message global envoyé.");
  };

  const filteredUsers = users.filter(u => {
    const isRoleMatch = activeTab === 'staff' ? u.role !== UserRole.STUDENT : u.role === UserRole.STUDENT;
    const searchMatch = (u.name + u.firstName + u.email).toLowerCase().includes(search.toLowerCase());
    return isRoleMatch && searchMatch;
  });

  const currentUserObj = users.find(u => u.id === currentUserId);

  if (editingCourseId) {
    return (
      <div className="p-8">
        <button onClick={() => setEditingCourseId(null)} className="mb-6 flex items-center gap-2 text-ivoryGreen font-black uppercase text-xs">
          <Filter size={16}/> Retour Administration
        </button>
        <InstructorSpace userRole={UserRole.ADMIN} currentUserId={currentUserId} forceEditId={editingCourseId} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Panel de Contrôle</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Supervision Akwaba</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          {(['staff', 'students', 'courses', 'messages'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl font-black text-[10px] transition-all uppercase ${activeTab === tab ? 'bg-ivoryGreen text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>
              {tab === 'staff' ? 'Équipe' : tab === 'students' ? 'Élèves' : tab === 'courses' ? 'Cours' : 'Messages'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 bg-white p-10 rounded-[48px] shadow-xl border border-gray-50 h-fit">
            <h2 className="text-2xl font-black mb-6 text-gray-900">Message Global</h2>
            <textarea value={globalMessage} onChange={e => setGlobalMessage(e.target.value)} rows={5} className="w-full p-6 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-ivoryOrange outline-none font-bold mb-6" placeholder="Annonce importante..."></textarea>
            <button onClick={handleSendGlobal} className="w-full py-4 bg-ivoryGreen text-white rounded-2xl font-black flex items-center justify-center gap-3"><Send size={20}/> ENVOYER À TOUS</button>
          </div>
          <div className="lg:col-span-2">
             {currentUserObj && <ChatWindow currentUser={currentUserObj} />}
          </div>
        </div>
      ) : activeTab === 'courses' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
           {courses.map(c => (
             <div key={c.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm group">
               <img src={c.thumbnail} className="w-full h-44 object-cover" />
               <div className="p-8">
                 <h3 className="font-black text-xl mb-6 text-gray-900 line-clamp-1">{c.title}</h3>
                 <div className="flex gap-2">
                    <button onClick={() => setEditingCourseId(c.id)} className="flex-1 py-3 bg-ivoryOrange text-white rounded-xl font-black text-[10px] uppercase">Modifier</button>
                    <button onClick={() => setShowCourseDeleteConfirm(c.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                 </div>
               </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="bg-white rounded-[48px] shadow-2xl border border-gray-50 overflow-hidden">
          <div className="p-8 bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between border-b">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Chercher un membre..." className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-white focus:border-ivoryOrange outline-none font-bold text-gray-900 shadow-sm" />
            </div>
            <button onClick={() => { setEditingUser(null); setUserFormData({role: activeTab === 'staff' ? UserRole.INSTRUCTOR : UserRole.STUDENT}); setShowUserModal(true); }} className="px-8 py-4 bg-ivoryGreen text-white rounded-2xl font-black flex items-center gap-2 shadow-lg"><UserPlus size={18} /> AJOUTER</button>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
              <tr>
                <th className="px-10 py-6">Utilisateur</th>
                <th className="px-10 py-6">Rôle</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="group hover:bg-gray-50/50">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <img src={u.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md" />
                      <div>
                        <p className="font-black text-gray-900">{u.firstName} {u.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase text-ivoryGreen">{u.role}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingUser(u); setUserFormData(u); setShowUserModal(true); }} className="p-2.5 text-ivoryGreen hover:bg-ivoryGreen/10 rounded-xl transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => setShowDeleteConfirm(u.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popups de confirmation */}
      {(showDeleteConfirm || showCourseDeleteConfirm) && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-[1000] flex items-center justify-center p-6">
          <div className="bg-white p-12 rounded-[56px] max-w-md w-full text-center space-y-8 animate-in zoom-in duration-300 shadow-2xl">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
               <AlertTriangle size={40} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Validation requise</h3>
              <p className="text-gray-400 font-bold mt-2">Voulez-vous vraiment supprimer cet élément ? Cette action est irréversible.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setShowDeleteConfirm(null); setShowCourseDeleteConfirm(null); }} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-400">ANNULER</button>
              <button onClick={() => showDeleteConfirm ? confirmDelete(showDeleteConfirm) : confirmCourseDelete(showCourseDeleteConfirm!)} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-xl">CONFIRMER</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Utilisateur */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-md z-[500] flex items-center justify-center p-4">
          <form onSubmit={handleSaveUser} className="bg-white w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-ivoryOrange p-10 text-white flex justify-between items-center">
              <h3 className="text-3xl font-black">{editingUser ? 'Éditer Membre' : 'Nouveau Membre'}</h3>
              <button type="button" onClick={() => setShowUserModal(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X size={24}/></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <input required value={userFormData.name || ''} onChange={e => setUserFormData({...userFormData, name: e.target.value})} placeholder="Nom" className="p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange outline-none font-bold" />
                 <input required value={userFormData.firstName || ''} onChange={e => setUserFormData({...userFormData, firstName: e.target.value})} placeholder="Prénom" className="p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange outline-none font-bold" />
              </div>
              <input required type="email" value={userFormData.email || ''} onChange={e => setUserFormData({...userFormData, email: e.target.value})} placeholder="Email professionnel" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange outline-none font-bold" />
              <select value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value as UserRole})} className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange outline-none font-black appearance-none">
                {Object.values(UserRole).map(role => <option key={role} value={role}>{role.toUpperCase()}</option>)}
              </select>
              <button type="submit" className="w-full py-5 bg-ivoryGreen text-white rounded-2xl font-black text-xl shadow-xl uppercase mt-4">Enregistrer Profil</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
