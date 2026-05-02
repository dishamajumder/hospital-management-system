// App.js - Main application with navigation and routing
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { 
  Users, Calendar, Activity, CreditCard, LogOut, 
  LayoutDashboard, Hospital, Moon, Sun, Menu, X 
} from 'lucide-react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import BillingPage from './pages/BillingPage';
import './App.css';

// Protected Route component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.some(r => r.toUpperCase() === user?.role?.toUpperCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Check roles helper (case-insensitive)
  const isRole = (roles) => user && roles.some(r => r.toUpperCase() === user?.role?.toUpperCase());

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              {/* ---- SIDEBAR ---- */}
              <aside className="sidebar">
                <div className="sidebar-brand">
                  <Hospital className="nav-icon" size={28} />
                  <span>Disha Hospital</span>
                  <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
                
                <nav className={`sidebar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                  <NavLink to="/" end className="nav-link" onClick={closeMenu}><LayoutDashboard /> Dashboard</NavLink>
                  
                  {isRole(['Admin', 'Receptionist', 'Doctor', 'Billing']) && (
                    <NavLink to="/patients" className="nav-link" onClick={closeMenu}><Users /> Patients</NavLink>
                  )}
                  
                  {isRole(['Admin', 'Receptionist', 'Doctor']) && (
                    <NavLink to="/appointments" className="nav-link" onClick={closeMenu}><Calendar /> Appointments</NavLink>
                  )}
                  
                  {isRole(['Admin']) && (
                    <NavLink to="/doctors" className="nav-link" onClick={closeMenu}><Users /> Doctors</NavLink>
                  )}
                  
                  {isRole(['Admin', 'Doctor', 'Receptionist']) && (
                    <NavLink to="/medical-records" className="nav-link" onClick={closeMenu}><Activity /> Records</NavLink>
                  )}
                  
                  {isRole(['Admin', 'Receptionist', 'Billing']) && (
                    <NavLink to="/billing" className="nav-link" onClick={closeMenu}><CreditCard /> Billing</NavLink>
                  )}

                  <div className="mobile-logout">
                    <button className="logout-btn" onClick={() => { logout(); closeMenu(); }}>
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </nav>

                <div className="sidebar-footer desktop-logout">
                  <button className="logout-btn" onClick={logout}>
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </aside>

              {/* ---- MAIN WRAPPER ---- */}
              <div className="main-wrapper">
                <header className="top-header">
                  <div className="header-search"></div>
                  <div className="header-user-info">
                    <span>{user?.username} ({user?.role})</span>
                    <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark Mode">
                      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                  </div>
                </header>

                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    
                    <Route path="/patients" element={
                      <ProtectedRoute allowedRoles={['Admin', 'Receptionist', 'Doctor', 'Billing']}>
                        <PatientsPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/doctors" element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <DoctorsPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/appointments" element={
                      <ProtectedRoute allowedRoles={['Admin', 'Receptionist', 'Doctor']}>
                        <AppointmentsPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/medical-records" element={
                      <ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Receptionist']}>
                        <MedicalRecordsPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/billing" element={
                      <ProtectedRoute allowedRoles={['Admin', 'Receptionist', 'Billing']}>
                        <BillingPage />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
