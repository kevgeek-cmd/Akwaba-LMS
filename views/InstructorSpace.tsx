
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Plus, Video, FileText, CheckSquare, Save, Trash2, Link as LinkIcon, Upload, HelpCircle, Eye } from 'lucide-react';

interface InstructorSpaceProps {
  userRole: UserRole;
}

const InstructorSpace: React.FC<InstructorSpaceProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'quiz' | 'submissions'>('create');
  const [videoSource, setVideoSource] = useState<'file' | 'url'>('url');
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Espace {userRole}</h1>
          <p className="text-gray-500">Concevez des parcours pédagogiques d'excellence.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border">
          <button onClick={() => setActiveTab('create')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'create' ? 'bg-ivoryGreen text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Nouveau Cours</button>
          <button onClick={() => setActiveTab('quiz')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'quiz' ? 'bg-ivoryGreen text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Quiz Builder</button>
          <button onClick={() => setActiveTab('submissions')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'submissions' ? 'bg-ivoryGreen text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Évaluations</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'create' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Video className="text-ivoryOrange" /> Configuration du Module
              </h2>
              
              <div className="space-y-6">
                <input placeholder="Titre du module" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none" />
                
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Source de la vidéo</label>
                  <div className="flex gap-4 mb-4">
                    <button onClick={() => setVideoSource('url')} className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${videoSource === 'url' ? 'border-ivoryOrange bg-white text-ivoryOrange' : 'border-gray-200 bg-transparent text-gray-400'}`}>
                      <LinkIcon size={18} /> URL Vidéo
                    </button>
                    <button onClick={() => setVideoSource('file')} className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${videoSource === 'file' ? 'border-ivoryOrange bg-white text-ivoryOrange' : 'border-gray-200 bg-transparent text-gray-400'}`}>
                      <Upload size={18} /> Fichier Local
                    </button>
                  </div>

                  {videoSource === 'url' ? (
                    <div className="relative">
                      <input placeholder="Coller l'URL (YouTube, Vimeo...)" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none" />
                      <LinkIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
                      <p className="text-sm font-medium text-gray-400">Cliquez pour téléverser (.mp4, .mov)</p>
                    </div>
                  )}
                </div>

                <textarea rows={3} placeholder="Description et instructions..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ivoryOrange outline-none"></textarea>
                
                <button className="w-full py-4 bg-ivoryOrange text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 shadow-lg">
                  <Save size={20} /> Enregistrer ce module
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckSquare className="text-ivoryGreen" /> Quiz Builder V2
                </h2>
                
                <div className="p-6 bg-ivoryGreen/5 border-2 border-ivoryGreen/20 rounded-2xl mb-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 bg-ivoryGreen text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div className="flex-grow">
                      <input placeholder="Intitulé de la question..." className="w-full bg-transparent border-b-2 border-ivoryGreen/30 py-2 text-lg font-bold outline-none focus:border-ivoryGreen" />
                      <div className="mt-6 space-y-3">
                        {[0,1,2].map(i => (
                          <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 group shadow-sm">
                            <input type="radio" name="correct" className="text-ivoryGreen w-5 h-5" />
                            <input placeholder={`Réponse ${i+1}`} className="flex-grow bg-transparent outline-none text-sm" />
                            <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button className="text-xs font-bold text-ivoryGreen flex items-center gap-1 hover:underline ml-2">
                          <Plus size={14} /> Ajouter une option
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-grow py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-ivoryGreen hover:text-ivoryGreen transition-all flex items-center justify-center gap-2">
                    <Plus size={20} /> Nouvelle Question
                  </button>
                  <button className="px-8 py-4 bg-ivoryGreen text-white rounded-2xl font-bold shadow-lg hover:bg-green-800 transition-all">
                    Publier le Quiz
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4">Prévisualisation Rapide</h3>
                <div className="border border-gray-100 rounded-xl p-4 opacity-50">
                  <p className="text-sm font-bold">Question exemple apparaîtra ici...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-ivoryGreen" /> Évaluations en attente</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {[1, 2].map(i => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-ivoryGreen font-bold">K</div>
                        <div>
                          <p className="font-bold text-gray-900">Kouassi Ibrahim</p>
                          <p className="text-xs text-gray-500">Module: Marketing Digital • Score Quiz: 90%</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-ivoryGreen text-white rounded-lg text-sm font-bold flex items-center gap-2">
                        <Eye size={16} /> Voir Travail
                      </button>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-ivoryGreen text-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Tableau de Bord</h3>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-2xl font-bold">28</p>
                <p className="text-xs opacity-70">Étudiants ce mois</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-2xl font-bold">4.9/5</p>
                <p className="text-xs opacity-70">Note pédagogique</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSpace;
