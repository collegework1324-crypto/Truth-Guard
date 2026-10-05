import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RenderWakeupOverlay } from './components/RenderWakeupOverlay';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { Workspace } from './pages/Workspace';
import { History } from './pages/History';
import { Feedback } from './pages/Feedback';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RenderWakeupOverlay>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/detection" element={<Workspace />} />
                <Route path="/workspace" element={<Navigate to="/detection" replace />} />
                <Route path="/history" element={<History />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/register" element={<Navigate to="/auth?tab=register" replace />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </RenderWakeupOverlay>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
