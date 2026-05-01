// App.js - Main application with navigation and routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
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
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <div>
                {/* ---- NAVIGATION BAR ---- */}
                <nav className="navbar">
                  <div className="nav-brand">
                    <span className="nav-icon">🏥</span>
                    <span>Hospital Management System</span>
                  </div>
                  <div className="nav-links">
                    <NavLink to="/" className="nav-link">Patients</NavLink>
                    <NavLink to="/doctors" className="nav-link">Doctors</NavLink>
                    <NavLink to="/appointments" className="nav-link">Appointments</NavLink>
                    <NavLink to="/medical-records" className="nav-link">Medical Records</NavLink>
                    <NavLink to="/billing" className="nav-link">Billing</NavLink>
                  </div>
                  <div className="nav-user">
                    <span>Welcome, {user?.username} ({user?.role})</span>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                  </div>
                </nav>

                {/* ---- PAGE CONTENT (React Router) ---- */}
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<PatientsPage />} />
                    <Route path="/doctors" element={<DoctorsPage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/medical-records" element={<MedicalRecordsPage />} />
                    <Route path="/billing" element={<BillingPage />} />
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
