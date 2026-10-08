import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorsList from './pages/DoctorsList';
import DoctorDetails from './pages/DoctorDetails';
import PatientAppointments from './pages/PatientAppointments';
import DoctorAppointments from './pages/DoctorAppointments';
import PrescriptionPage from './pages/PrescriptionPage';

// Route guard: requires login
function PrivateRoute({ children, requiredRole }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: '#0284c7', fontWeight: 600 }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />

          {/* Patient Protected Routes */}
          <Route path="/patient/appointments" element={
            <PrivateRoute requiredRole="PATIENT">
              <PatientAppointments />
            </PrivateRoute>
          } />

          {/* Doctor Protected Routes */}
          <Route path="/doctor/appointments" element={
            <PrivateRoute requiredRole="DOCTOR">
              <DoctorAppointments />
            </PrivateRoute>
          } />
          <Route path="/doctor/appointments/:appointmentId/prescription" element={
            <PrivateRoute requiredRole="DOCTOR">
              <PrescriptionPage />
            </PrivateRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
