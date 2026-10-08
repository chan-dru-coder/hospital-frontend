import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import { 
  Search, 
  ShieldCheck, 
  CalendarCheck, 
  FileText, 
  ArrowRight, 
  Star, 
  Users, 
  Award, 
  HeartPulse,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specs, docs] = await Promise.all([
          api.get('/specializations/'),
          api.get('/doctors/')
        ]);
        setSpecializations(specs || []);
        // Pick top 3-4 doctors
        setFeaturedDoctors((docs.results || docs || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedSpecialty) params.append('specialization', selectedSpecialty);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ffffff 100%)',
        padding: '5rem 0 4.5rem',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container">
          <div style={{
            maxWidth: '820px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Top pill badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: '#ffffff',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '1.5rem'
            }}>
              <HeartPulse size={16} color="#0284c7" />
              Trusted Healthcare Network
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 800,
              color: 'var(--text-main)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}>
              Your Health, <span style={{ color: '#0284c7' }}>Our Priority</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '680px',
              margin: '0 auto 2.5rem'
            }}>
              Connect with top verified doctors, schedule in-person and digital consultations with real-time slot tracking, and manage your medical prescriptions securely.
            </p>

            {/* Search Box */}
            <form 
              onSubmit={handleSearchSubmit}
              style={{
                background: '#ffffff',
                padding: '0.6rem',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                border: '1.5px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                alignItems: 'center',
                maxWidth: '720px',
                margin: '0 auto 2rem'
              }}
            >
              <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', gap: '0.5rem' }}>
                <Search size={20} color="#0284c7" />
                <input 
                  type="text"
                  placeholder="Doctor name, condition, or hospital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ flex: '1 1 180px', borderLeft: '1px solid var(--border-color)', padding: '0.5rem 1rem' }}>
                <select 
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '0.95rem', color: selectedSpecialty ? 'var(--text-main)' : 'var(--text-light)', cursor: 'pointer' }}
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                Find Doctors
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Specialization Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Popular:</span>
              {['Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'General Physician'].map((item) => (
                <button
                  key={item}
                  onClick={() => navigate(`/doctors?specialization=${item}`)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    padding: '0.3rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0284c7';
                    e.currentTarget.style.color = '#0284c7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Stats Strip */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>15,000+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Patients Treated</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>120+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Verified Medical Specialists</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>99.2%</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Patient Satisfaction Rate</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>24/7</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Online Slot Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Feature Cards Section */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Why Choose MediConnect
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Healthcare Made Effortless & Reliable
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
              We bridge the gap between experienced physicians and patients with cutting-edge medical scheduling.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Card 1 */}
            <div className="card card-hover-up" style={{ padding: '2.25rem 2rem', background: '#ffffff' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                background: '#f0f9ff',
                color: '#0284c7',
                border: '1px solid #bae6fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Verified Specialists
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Every doctor on MediConnect is credential-verified with verified hospital affiliations, medical licenses, and genuine patient ratings.
              </p>
              <ul style={{ marginTop: '1.25rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Board-certified doctors
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Hospital-backed expertise
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="card card-hover-up" style={{ padding: '2.25rem 2rem', background: '#ffffff', borderTop: '4px solid #0284c7' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                background: '#f0fdf4',
                color: '#16a34a',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <CalendarCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Zero Double-Booking
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Our synchronized reservation engine locks time slots atomically so you never have to deal with appointment conflicts or long waiting lines.
              </p>
              <ul style={{ marginTop: '1.25rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Live slot synchronization
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Instant doctor status updates
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="card card-hover-up" style={{ padding: '2.25rem 2rem', background: '#ffffff' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                background: '#faf5ff',
                color: '#9333ea',
                border: '1px solid #e9d5ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <FileText size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Digital Prescriptions
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Receive structured digital prescriptions with exact dosages, frequency, physician advice, and printable PDF records right in your portal.
              </p>
              <ul style={{ marginTop: '1.25rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Complete dosage & instructions
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> One-click printable records
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Doctors Section */}
      <section style={{ padding: '5rem 0', background: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <div>
              <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top Rated Physicians
              </span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>
                Featured Specialists
              </h2>
            </div>
            <Link to="/doctors" className="btn btn-outline-primary">
              View All Doctors
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {featuredDoctors.map((doc) => (
              <DoctorCard key={doc.doctor_id || doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call to Action Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #1e40af 100%)',
        color: '#ffffff',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            Need Medical Attention Today?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#bae6fd', marginBottom: '2rem', lineHeight: '1.6' }}>
            Choose from hundreds of certified doctors across key specialties and book your consultation in less than 2 minutes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              to="/doctors" 
              className="btn btn-lg" 
              style={{ background: '#ffffff', color: '#0284c7', fontWeight: 700 }}
            >
              Book an Appointment Now
            </Link>
            <Link 
              to="/register" 
              className="btn btn-lg" 
              style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.4)' }}
            >
              Join as a Doctor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
