
import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { User, UserRole, Course, Enrollment, ChatMessage } from '../types';
import { Search, UserPlus, X, Edit2, Trash2, Save, Filter, BookOpen, MessageSquare, Send, Paperclip, AlertTriangle } from 'lucide-react';
import InstructorSpace from './InstructorSpace'; // Reuse for global course edit
import ChatWindow from '../components/ChatWindow';

const AdminPanel: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const [activeTab, setActiveTab] = useState<'staff' | 'students' | 'courses' | 'messages'>('staff');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  
  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCourseDeleteConfirm, setShowCourseDeleteConfirm] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Toutes');
  const [instFilter, setInstFilter] = useState('Tous');

  // Form States
  const [userFormData, setUserFormData] = useState<Partial<User>>({});
  const [enrollFormData, setEnrollFormData] = useState({ userId: '', courseId: '' });
  const [globalMessage, setGlobalMessage] = useState('');

  const loadAll = () => {
    setUsers(storage.getUsers());
    setCourses(storage.getCourses());
    setEnrollments(storage.getEnrollments());
  };

  useEffect(() => {
    loadAll();
    window.addEventListener('storage_update', loadAll);
    return () => window.removeEventListener('storage_update', loadAll);
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
        avatar: `https://i.pravatar.cc/150?u=${userFormData.email}`,
        createdAt: new Date().toISOString(),
        ...userFormData
      };
      updated = [newUser, ...all];
    }
    storage.saveUsers(updated);
    setShowUserModal(false);
    alert("Utilisateur mis à jour !");
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
  };

  const handleReassign = () => {
    if (!enrollFormData.userId || !enrollFormData.courseId) return;
    const all = storage.getEnrollments();
    const filtered = all.filter(e => e.userId !== enrollFormData.userId);
    const updated = [...filtered, { 
      userId: enrollFormData.userId, 
      courseId: enrollFormData.courseId, 
      enrolledAt: new Date().toISOString(), 
      progress: 0 
    }];
    storage.saveEnrollments(updated);
    setShowEnrollModal(false);
    alert("Étudiant réaffecté avec succès !");
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
    alert("Message envoyé à toute la plateforme !");
  };

  // Filter Logic
  const filteredUsers = users.filter(u => {
    const isRoleMatch = activeTab === 'staff' ? u.role !== UserRole.STUDENT : u.role === UserRole.STUDENT;
    const searchMatch = (u.name + u.firstName + u.email).toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'students') {
      const userEnroll = enrollments.find(e => e.userId === u.id);
      const course = courses.find(c => c.id === userEnroll?.courseId);
      const categoryMatch = catFilter === 'Toutes' || course?.category === catFilter;
      const instructorMatch = instFilter === 'Tous' || course?.instructorId === instFilter;
      return isRoleMatch && searchMatch && categoryMatch && instructorMatch;
    }
    
    return isRoleMatch && searchMatch;
  });

  if (editingCourseId) {
    return (
      <div className="p-8">
        <button onClick={() => setEditingCourseId(null)} className="mb-6 flex items-center gap-2 text-ivoryGreen font-black uppercase text-xs hover:gap-3 transition-all">
          <Filter size={16}/> Retour supervision
        </button>
        <InstructorSpace userRole={UserRole.ADMIN} currentUserId={currentUserId} forceEditId={editingCourseId} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Supervision Centrale</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Plateforme Akwaba Administration</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          {(['staff', 'students', 'courses', 'messages'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all uppercase ${activeTab === tab ? 'bg-ivoryGreen text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 bg-white p-10 rounded-[40px] shadow-xl border border-gray-50 h-fit">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-ivoryOrange"><MessageSquare/> Diffusion Globale</h2>
            <textarea value={globalMessage} onChange={e => setGlobalMessage(e.target.value)} rows={6} className="w-full p-6 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-ivoryOrange focus:bg-white outline-none font-bold text-gray-900 mb-6" placeholder="Message global..."></textarea>
            <button onClick={handleSendGlobal} className="w-full py-4 bg-ivoryGreen text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-all"><Send size={20}/> ENVOYER À TOUS</button>
          </div>
          <div className="lg:col-span-2">
             <ChatWindow currentUser={storage.getUsers().find(u => u.id === currentUserId)!} />
          </div>
        </div>
      ) : activeTab === 'courses' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {courses.map(c => (
             <div key={c.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm group">
               <img src={c.thumbnail} className="w-full h-40 object-cover" />
               <div className="p-8">
                 <h3 className="font-black text-xl mb-4 text-gray-900">{c.title}</h3>
                 <div className="flex gap-2">
                    <button onClick={() => setEditingCourseId(c.id)} className="flex-1 py-3 bg-ivoryOrange text-white rounded-xl font-black text-xs uppercase">Éditer</button>
                    <button onClick={() => setShowCourseDeleteConfirm(c.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                 </div>
               </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden">
          <div className="p-8 bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between border-b">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher utilisateur..." className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-white focus:border-ivoryOrange outline-none font-bold text-gray-900 shadow-sm" />
            </div>
            
            {activeTab === 'students' && (
              <div className="flex gap-2">
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="p-4 bg-white rounded-2xl border border-gray-100 text-xs font-black uppercase outline-none">
                  <option>Toutes</option>
                  {Array.from(new Set(courses.map(c => c.category))).map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <button onClick={() => setShowEnrollModal(true)} className="px-6 bg-ivoryOrange text-white rounded-2xl font-black text-xs flex items-center gap-2"><BookOpen size={16}/> RÉAFFECTER</button>
              </div>
            )}
            
            <button onClick={() => { setEditingUser(null); setUserFormData({role: activeTab === 'staff' ? UserRole.INSTRUCTOR : UserRole.STUDENT}); setShowUserModal(true); }} className="px-8 py-4 bg-ivoryGreen text-white rounded-2xl font-black flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg"><UserPlus size={18} /> AJOUTER</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-100">
                <tr>
                  <th className="px-10 py-6">Profil</th>
                  <th className="px-10 py-6">{activeTab === 'students' ? 'Formation' : 'Rôle'}</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-ivoryGreen/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <img src={u.avatar} className="w-14 h-14 rounded-2xl object-cover border-4 border-white shadow-lg" />
                        <div>
                          <p className="font-black text-gray-900 text-lg leading-none mb-1">{u.firstName} {u.name}</p>
                          <p className="text-xs font-bold text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      {activeTab === 'students' ? (
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-ivoryOrange rounded-full"></span>
                           <span className="text-sm font-black text-gray-600 uppercase">
                             {courses.find(c => c.id === enrollments.find(e => e.userId === u.id)?.courseId)?.title || "Aucun"}
                           </span>
                        </div>
                      ) : (
                        <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-400">{u.role}</span>
                      )}
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingUser(u); setUserFormData(u); setShowUserModal(true); }} className="p-3 text-ivoryGreen hover:bg-ivoryGreen/10 rounded-xl transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => setShowDeleteConfirm(u.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Popups de confirmation de suppression */}
      {(showDeleteConfirm || showCourseDeleteConfirm) && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white p-12 rounded-[48px] max-w-md w-full text-center space-y-8 animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border-8 border-white shadow-xl">
               <AlertTriangle size={48} />
            </div>
            <h3 className="text-3xl font-black text-gray-900">Valider suppression ?</h3>
            <p className="text-gray-400 font-bold">Cette action est définitive. Les données seront effacées du système Akwaba.</p>
            <div className="flex gap-4">
              <button onClick={() => { setShowDeleteConfirm(null); setShowCourseDeleteConfirm(null); }} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-400 hover:bg-gray-200 transition-all">ANNULER</button>
              <button onClick={() => showDeleteConfirm ? confirmDelete(showDeleteConfirm) : confirmCourseDelete(showCourseDeleteConfirm!)} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-xl hover:bg-red-600 transition-all uppercase tracking-widest text-xs">CONFIRMER</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reassign */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[48px] max-w-md w-full space-y-8 animate-in slide-in-from-bottom-10 duration-500 shadow-2xl">
            <h3 className="text-3xl font-black text-ivoryOrange tracking-tighter">Réaffecter Élève</h3>
            <div className="space-y-4">
              <select onChange={e => setEnrollFormData({...enrollFormData, userId: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white outline-none font-bold text-gray-900">
                <option value="">Sélectionner Apprenant</option>
                {users.filter(u => u.role === UserRole.STUDENT).map(u => <option key={u.id} value={u.id}>{u.firstName} {u.name}</option>)}
              </select>
              <select onChange={e => setEnrollFormData({...enrollFormData, courseId: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white outline-none font-bold text-gray-900">
                <option value="">Sélectionner Nouveau Cours</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowEnrollModal(false)} className="flex-1 py-4 text-gray-400 font-black text-xs uppercase">Annuler</button>
              <button onClick={handleReassign} className="flex-1 py-4 bg-ivoryGreen text-white rounded-2xl font-black shadow-lg">RE-AFFECTER</button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveUser} className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl">
            <div className="bg-ivoryOrange p-8 text-white flex justify-between items-center">
              <h3 className="text-3xl font-black">{editingUser ? 'Éditer Profil' : 'Nouveau Profil'}</h3>
              <button type="button" onClick={() => setShowUserModal(false)} className="bg-white/10 p-2 rounded-full"><X size={24}/></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <input required value={userFormData.name || ''} onChange={e => setUserFormData({...userFormData, name: e.target.value})} placeholder="Nom" className="p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none" />
                 <input required value={userFormData.firstName || ''} onChange={e => setUserFormData({...userFormData, firstName: e.target.value})} placeholder="Prénom" className="p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none" />
              </div>
              <input required type="email" value={userFormData.email || ''} onChange={e => setUserFormData({...userFormData, email: e.target.value})} placeholder="Email" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none" />
              <select value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value as UserRole})} className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white text-gray-900 font-bold outline-none appearance-none">
                {Object.values(UserRole).map(role => <option key={role} value={role}>{role.toUpperCase()}</option>)}
              </select>
              <button type="submit" className="w-full py-5 bg-ivoryGreen text-white rounded-2xl font-black text-xl shadow-xl uppercase">Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
