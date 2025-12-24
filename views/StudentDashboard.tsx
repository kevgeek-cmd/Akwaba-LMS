
import React, { useState } from 'react';
import { MOCK_COURSES } from '../constants';
import { CheckCircle, Lock, Play, FileText, Download, Upload, ArrowRight, Star, BrainCircuit } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const course = MOCK_COURSES[0];
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuiz, setShowQuiz] = useState(false);

  const activeModule = course.modules[activeModuleIndex];
  const isLastModule = activeModuleIndex === course.modules.length - 1;

  const handleQuizSubmit = () => {
    if (!activeModule.quiz) return;
    let correct = 0;
    activeModule.quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });
    setQuizScore((correct / activeModule.quiz.length) * 100);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-gray-50">
      <aside className="w-full lg:w-80 bg-white border-r p-6 space-y-6">
        <h2 className="font-extrabold text-xl text-ivoryGreen">{course.title}</h2>
        <div className="space-y-3">
          {course.modules.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => { setActiveModuleIndex(idx); setShowQuiz(false); }}
              className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-3 ${
                activeModuleIndex === idx ? 'bg-ivoryGreen text-white shadow-xl scale-105' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </div>
              <span className="text-sm font-bold truncate">{mod.title}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-grow p-4 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {!showQuiz ? (
            <>
              <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video">
                {activeModule.videoType === 'url' ? (
                  <iframe width="100%" height="100%" src={activeModule.videoUrl} title="Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                ) : (
                  <video controls className="w-full h-full object-cover"><source src={activeModule.videoUrl} /></video>
                )}
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl font-black text-gray-900">{activeModule.title}</h1>
                  <span className="px-4 py-1.5 bg-orange-100 text-ivoryOrange rounded-full text-xs font-black">MODULE {activeModuleIndex + 1}</span>
                </div>
                <p className="text-gray-500 leading-relaxed mb-10">{activeModule.description}</p>
                
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2">
                    <Download size={18} /> Télécharger le cours
                  </button>
                  {activeModule.quiz && (
                    <button 
                      onClick={() => setShowQuiz(true)}
                      className="px-8 py-3 bg-ivoryGreen text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                    >
                      <BrainCircuit size={18} /> Passer l'évaluation
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-ivoryGreen p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black">Évaluation Finale</h2>
                  <p className="opacity-80">Validez vos acquis pour débloquer le certificat.</p>
                </div>
                <button onClick={() => setShowQuiz(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm">Retour au cours</button>
              </div>

              <div className="p-10 space-y-10">
                {activeModule.quiz?.map((q, idx) => (
                  <div key={q.id} className="space-y-5">
                    <p className="text-xl font-bold flex gap-4">
                      <span className="text-ivoryOrange">Q{idx+1}.</span> {q.text}
                    </p>
                    <div className="grid gap-3 ml-10">
                      {q.options.map((opt, oIdx) => (
                        <button 
                          key={oIdx}
                          onClick={() => setSelectedAnswers({...selectedAnswers, [q.id]: oIdx})}
                          className={`p-4 rounded-2xl text-left border-2 font-bold transition-all ${
                            selectedAnswers[q.id] === oIdx ? 'border-ivoryOrange bg-orange-50 text-ivoryOrange' : 'border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {quizScore === null ? (
                  <button 
                    onClick={handleQuizSubmit}
                    className="w-full py-5 bg-ivoryOrange text-white rounded-3xl font-black text-xl shadow-xl hover:bg-orange-600 transition-all"
                  >
                    Soumettre mes réponses
                  </button>
                ) : (
                  <div className={`p-10 rounded-3xl text-center ${quizScore >= 80 ? 'bg-green-100 border-2 border-green-200' : 'bg-red-50 border-2 border-red-100'}`}>
                    <h3 className="text-4xl font-black mb-4">{quizScore}%</h3>
                    <p className="text-lg font-bold mb-6">
                      {quizScore >= 80 ? 'Excellent ! Vous avez validé ce module.' : 'Presque ! Vous devez avoir 80% pour valider.'}
                    </p>
                    <button onClick={() => { setQuizScore(null); setSelectedAnswers({}); }} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold">Recommencer</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
