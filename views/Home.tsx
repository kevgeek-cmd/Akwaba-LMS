
import React from 'react';
import { Search, ChevronRight, Star } from 'lucide-react';
import { MOCK_COURSES } from '../constants';

interface HomeProps {
  onSelectCourse: () => void;
}

const Home: React.FC<HomeProps> = ({ onSelectCourse }) => {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-ivoryWhite py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-ivoryOrange opacity-5 -skew-x-12 transform translate-x-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Investissez dans votre <span className="text-ivoryOrange underline decoration-ivoryGreen">avenir</span> avec Akwaba.
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              La plateforme d'apprentissage de référence en Côte d'Ivoire. Des formations certifiantes adaptées au marché local.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="Que veux-tu apprendre aujourd'hui ?" 
                className="w-full pl-12 pr-4 py-5 rounded-2xl border-2 border-gray-100 shadow-xl focus:border-ivoryOrange focus:ring-0 text-lg outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <button className="absolute right-3 top-3 bottom-3 bg-ivoryOrange hover:bg-orange-600 text-white px-8 rounded-xl font-bold transition-colors">
                Chercher
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Cours à la une</h2>
            <div className="h-1.5 w-24 bg-ivoryGreen mt-2 rounded-full"></div>
          </div>
          <button className="text-ivoryOrange font-bold flex items-center hover:underline">
            Voir tout <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_COURSES.map(course => (
            <div 
              key={course.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group cursor-pointer"
              onClick={onSelectCourse}
            >
              <div className="relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-ivoryGreen">
                  {course.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-1 text-yellow-500 mb-2">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs text-gray-400 ml-1">(4.9)</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-ivoryOrange transition-colors">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-sm font-medium text-gray-700">Par {course.instructor}</span>
                  <div className="w-8 h-8 rounded-full bg-ivoryGreen/10 flex items-center justify-center text-ivoryGreen">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-ivoryGreen py-20 text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Pourquoi Akwaba ?</h2>
            <p className="text-green-50 text-lg mb-8 leading-relaxed">
              Nous croyons que le savoir est la clé du développement. Akwaba est conçu pour offrir aux Ivoiriens et aux Ivoiriennes des outils numériques de pointe, accessibles partout, pour se former aux métiers de demain.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">01</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl">Contenu Localisé</h4>
                  <p className="text-green-100 text-sm">Des exemples et des cas concrets ancrés dans la réalité ivoirienne.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">02</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl">Experts Reconnus</h4>
                  <p className="text-green-100 text-sm">Apprenez avec les meilleurs formateurs du pays.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-ivoryOrange rounded-3xl -rotate-3 opacity-20"></div>
            <img 
              src="https://picsum.photos/seed/ivory-coast/600/400" 
              alt="Community" 
              className="rounded-3xl shadow-2xl relative z-10 w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
