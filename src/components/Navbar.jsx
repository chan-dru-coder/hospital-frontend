import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  User, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  ShieldCheck,
  ClipboardList
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isDoctor, isPatient, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container nav-inner">
        {/* Brand */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Stethoscope size={22} strokeWidth={2.5} />
          </div>
          <span>Medi<span style={{ color: '#2563eb' }}>Connect</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/doctors" 
            className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}
          >
            <Search size={16} />
            Find Doctors
          </Link>

          {isPatient && (
            <Link 
              to="/patient/appointments" 
              className={`nav-link ${isActive('/patient/appointments') ? 'active' : ''}`}
            >
              <Calendar size={16} />
              My Appointments
            </Link>
          )}

          {isDoctor && (
            <Link 
              to="/doctor/appointments" 
              className={`nav-link ${isActive('/doctor/appointments') ? 'active' : ''}`}
            >
              <ClipboardList size={16} />
              Doctor Portal
            </Link>
          )}
        </nav>

        {/* Action Buttons / Auth */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="user-pill">
                <User size={15} />
                <span>{user.first_name || user.full_name || 'User'}</span>
                <span className="user-role-badge">
                  {user.role}
                </span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '0.45rem 0.75rem' }}
              >
                <LogOut size={16} />
                <span style={{ display: 'none', md: 'inline' }}>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              display: 'none',
              padding: '0.5rem',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="nav-links mobile-open" onClick={() => setMobileMenuOpen(false)}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/doctors" className="nav-link">Find Doctors</Link>
          {isPatient && (
            <Link to="/patient/appointments" className="nav-link">My Appointments</Link>
          )}
          {isDoctor && (
            <Link to="/doctor/appointments" className="nav-link">Doctor Portal</Link>
          )}
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
