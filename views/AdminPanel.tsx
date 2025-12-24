
import React, { useState } from 'react';
import { Users, Shield, ShieldAlert, MoreVertical, Edit2, Trash2, CheckCircle, Plus, X, UserPlus, Star } from 'lucide-react';
import { APP_PERMISSIONS, MOCK_USERS } from '../constants';
import { UserRole, User } from '../types';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'moderation'>('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [staffList, setStaffList] = useState<User[]>(MOCK_USERS);

  const [newUser, setNewUser] = useState({
    name: '',
    firstName: '',
    email: '',
    role: UserRole.INSTRUCTOR
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: Math.random().toString(),
      ...newUser,
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
    };
    setStaffList([created, ...staffList]);
    setShowAddModal(false);
    setNewUser({ name: '', firstName: '', email: '', role: UserRole.INSTRUCTOR });
  };

  const inputClass = "w-full p-3 border rounded-xl outline-none focus:border-ivoryOrange text-gray-900 font-semibold placeholder:text-gray-400";

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Espace Super-Admin</h1>
          <p className="text-gray-500 font-medium">Contrôle total des accès et de la qualité du contenu.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border">
          <button onClick={() => setActiveTab('users')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-ivoryOrange text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>Utilisateurs</button>
          <button onClick={() => setActiveTab('permissions')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'permissions' ? 'bg-ivoryOrange text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>Droits</button>
          <button onClick={() => setActiveTab('moderation')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'moderation' ? 'bg-ivoryOrange text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>Contrôle</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'users' && (
          <div>
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Membres du personnel & Étudiants</h2>
                <p className="text-sm text-gray-400">Total: {staffList.length} membres actifs</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-ivoryGreen text-white rounded-2xl font-bold hover:bg-green-800 transition-all flex items-center gap-2 shadow-lg shadow-green-100"
              >
                <UserPlus size={18} /> Ajouter un Staff
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4">Utilisateur</th>
                    <th className="px-8 py-4">Rôle</th>
                    <th className="px-8 py-4">Statut</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staffList.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-100" />
                          <div>
                            <p className="font-bold text-gray-900">{user.firstName} {user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          user.role === UserRole.ADMIN ? 'bg-red-100 text-red-600' : 
                          user.role === UserRole.EDITOR ? 'bg-blue-100 text-blue-600' :
                          user.role === UserRole.INSTRUCTOR ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div> Actif
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><MoreVertical size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-ivoryGreen text-white">
              <h3 className="text-xl font-bold">Nouveau membre Staff</h3>
              <button onClick={() => setShowAddModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Nom" className={inputClass} value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                <input required placeholder="Prénom" className={inputClass} value={newUser.firstName} onChange={e => setNewUser({...newUser, firstName: e.target.value})} />
              </div>
              <input required type="email" placeholder="Email professionnel" className={inputClass} value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              <select 
                className="w-full p-3 border rounded-xl outline-none focus:border-ivoryOrange bg-white font-bold text-gray-900"
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
              >
                <option value={UserRole.INSTRUCTOR}>Formateur / Professeur</option>
                <option value={UserRole.EDITOR}>Éditeur de contenu</option>
                <option value={UserRole.ADMIN}>Administrateur système</option>
              </select>
              <button type="submit" className="w-full py-4 bg-ivoryOrange text-white rounded-2xl font-bold shadow-lg hover:bg-orange-600">
                Créer l'accès personnel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
