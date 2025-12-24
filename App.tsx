
import React, { useState } from 'react';
import { UserRole, User } from './types';
import { MOCK_USERS } from './constants';
import Navbar from './components/Navbar';
import Home from './views/Home';
import StudentDashboard from './views/StudentDashboard';
import InstructorSpace from './views/InstructorSpace';
import AdminPanel from './views/AdminPanel';
import AuthView from './views/AuthView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'auth'>('home');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const renderContent = () => {
    if (currentView === 'auth') {
      return <AuthView onLogin={handleLogin} />;
    }
    
    if (currentView === 'home') {
      return <Home onSelectCourse={() => currentUser ? setCurrentView('dashboard') : setCurrentView('auth')} />;
    }

    if (!currentUser) return <AuthView onLogin={handleLogin} />;

    switch (currentUser.role) {
      case UserRole.ADMIN:
        return <AdminPanel />;
      case UserRole.INSTRUCTOR:
      case UserRole.EDITOR:
        return <InstructorSpace userRole={currentUser.role} />;
      case UserRole.STUDENT:
        return <StudentDashboard />;
      default:
        return <Home onSelectCourse={() => setCurrentView('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout}
        onGoHome={() => setCurrentView('home')}
        onGoDashboard={() => setCurrentView('dashboard')}
        onGoAuth={() => setCurrentView('auth')}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-white border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Akwaba LMS. Inscription Étudiants libre. Staff créé par l'Admin.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
