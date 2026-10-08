import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Mail, Lock, AlertCircle, ArrowRight, UserCheck, Shield } from 'lucide-react';

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If redirected from a protected route
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'DOCTOR') {
        navigate('/doctor/appointments');
      } else {
        navigate(from === '/' ? '/patient/appointments' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await demoLogin(role);
      if (user.role === 'DOCTOR') {
        navigate('/doctor/appointments');
      } else {
        navigate('/patient/appointments');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        background: '#ffffff'
      }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-blue)',
            marginBottom: '1rem'
          }}>
            <Stethoscope size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Sign in to access your MediConnect dashboard
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ⚡ Instant Test Sign-In
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoSignIn('PATIENT')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.82rem', background: '#ffffff', borderColor: '#cbd5e1' }}
              disabled={loading}
            >
              <UserCheck size={14} color="#0284c7" />
              Demo Patient
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('DOCTOR')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.82rem', background: '#ffffff', borderColor: '#cbd5e1' }}
              disabled={loading}
            >
              <Stethoscope size={14} color="#16a34a" />
              Demo Doctor
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail 
                size={18} 
                color="#94a3b8" 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock 
                size={18} 
                color="#94a3b8" 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Link to Register */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#0284c7', fontWeight: 700 }}>
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
}
