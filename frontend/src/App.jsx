import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Workspace } from './pages/Workspace';
import { History } from './pages/History';
import { Feedback } from './pages/Feedback';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'workspace':
        return <Workspace />;
      case 'history':
        return <History />;
      case 'feedback':
        return <Feedback />;
      case 'admin':
        return <Admin />;
      case 'about':
        return <About />;
      case 'login':
        return <Login onNavigate={setActiveTab} />;
      case 'register':
        return <Register onNavigate={setActiveTab} />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main style={{ flex: 1 }}>
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
