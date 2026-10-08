import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  Award, 
  DollarSign, 
  AlertCircle, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('PATIENT');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    // Doctor fields
    specialization: 'General Physician',
    hospital: '',
    experience_years: 5,
    consultation_fee: 500,
    bio: '',
    // Patient fields
    age: '',
    gender: 'Male',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const specializationsList = [
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'Orthopedic',
    'General Physician',
    'Gynecologist',
    'Psychiatrist',
    'Ophthalmologist',
    'Dentist'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        role,
        age: formData.age ? parseInt(formData.age, 10) : null,
        experience_years: parseInt(formData.experience_years, 10) || 1,
        consultation_fee: parseFloat(formData.consultation_fee) || 500.00,
      };

      const user = await register(payload);
      if (user.role === 'DOCTOR') {
        navigate('/doctor/appointments');
      } else {
        navigate('/patient/appointments');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify the information entered.');
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
        maxWidth: '680px',
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        background: '#ffffff'
      }}>
        {/* Header */}
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
            Join MediConnect
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Choose your account role to get started
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button
            type="button"
            onClick={() => setRole('PATIENT')}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: role === 'PATIENT' ? '2px solid #0284c7' : '1.5px solid var(--border-color)',
              background: role === 'PATIENT' ? '#f0f9ff' : '#ffffff',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            {role === 'PATIENT' && (
              <CheckCircle2 size={18} color="#0284c7" style={{ position: 'absolute', top: '12px', right: '12px' }} />
            )}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: role === 'PATIENT' ? '#0284c7' : '#f1f5f9',
              color: role === 'PATIENT' ? 'white' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}>
              <User size={20} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: role === 'PATIENT' ? '#0284c7' : 'var(--text-main)' }}>
              I am a Patient
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Find doctors & book appointments
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('DOCTOR')}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: role === 'DOCTOR' ? '2px solid #0284c7' : '1.5px solid var(--border-color)',
              background: role === 'DOCTOR' ? '#f0f9ff' : '#ffffff',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            {role === 'DOCTOR' && (
              <CheckCircle2 size={18} color="#0284c7" style={{ position: 'absolute', top: '12px', right: '12px' }} />
            )}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: role === 'DOCTOR' ? '#0284c7' : '#f1f5f9',
              color: role === 'DOCTOR' ? 'white' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}>
              <Stethoscope size={20} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: role === 'DOCTOR' ? '#0284c7' : 'var(--text-main)' }}>
              I am a Doctor
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Manage schedule & write prescriptions
            </div>
          </button>
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
            marginBottom: '1.5rem',
            whiteSpace: 'pre-line'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                required
                className="form-input"
                name="first_name"
                placeholder="Alex"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                required
                className="form-input"
                name="last_name"
                placeholder="Johnson"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="form-input"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="form-input"
                name="confirm_password"
                placeholder="Repeat password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Role-Specific Fields: DOCTOR */}
          {role === 'DOCTOR' && (
            <div style={{
              background: '#f8fafc',
              border: '1.5px dashed #bae6fd',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Stethoscope size={18} />
                Doctor Medical Credentials
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Medical Specialization</label>
                  <select
                    className="form-select"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                  >
                    {specializationsList.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Hospital / Clinic Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    name="hospital"
                    placeholder="e.g. Metro Health Center"
                    value={formData.hospital}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    className="form-input"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Fee ($)</label>
                  <input
                    type="number"
                    min={10}
                    step={10}
                    className="form-input"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Doctor Bio / Clinical Focus</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  name="bio"
                  placeholder="Share a brief overview of your medical training, background, and patient care philosophy..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Role-Specific Fields: PATIENT */}
          {role === 'PATIENT' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  className="form-input"
                  name="age"
                  placeholder="e.g. 28"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'DOCTOR' ? 'Doctor' : 'Patient'}`}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Link to Login */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0284c7', fontWeight: 700 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
