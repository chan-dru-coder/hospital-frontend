import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Heart, Shield, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ 
      background: '#0f172a', 
      color: '#f8fafc', 
      padding: '4rem 0 2rem',
      marginTop: 'auto',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Stethoscope size={20} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white' }}>
                Medi<span style={{ color: '#38bdf8' }}>Connect</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Empowering patients with seamless doctor appointment bookings, verified medical specialists, and instant digital prescriptions.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem' }}>
                <Shield size={16} /> HIPAA Compliant & Secure
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: '#94a3b8' }}>
              <li><Link to="/" style={{ color: '#cbd5e1' }}>Home Page</Link></li>
              <li><Link to="/doctors" style={{ color: '#cbd5e1' }}>Find Specialists</Link></li>
              <li><Link to="/login" style={{ color: '#cbd5e1' }}>Patient Portal</Link></li>
              <li><Link to="/login" style={{ color: '#cbd5e1' }}>Doctor Sign In</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem' }}>
              Popular Specialties
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: '#94a3b8' }}>
              <li><Link to="/doctors?specialization=Cardiologist" style={{ color: '#cbd5e1' }}>Cardiology & Heart Care</Link></li>
              <li><Link to="/doctors?specialization=Dermatologist" style={{ color: '#cbd5e1' }}>Dermatology & Skin</Link></li>
              <li><Link to="/doctors?specialization=Neurologist" style={{ color: '#cbd5e1' }}>Neurology & Brain Health</Link></li>
              <li><Link to="/doctors?specialization=Pediatrician" style={{ color: '#cbd5e1' }}>Pediatrics & Child Wellness</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem' }}>
              Emergency & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={18} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: 600, color: 'white' }}>1-800-MEDICONNECT</div>
                  <div style={{ fontSize: '0.8rem' }}>24/7 Patient Assistance</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={18} color="#38bdf8" />
                <span>support@mediconnect.health</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={18} color="#38bdf8" />
                <span>Metro Health District, Suite 500</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>
            &copy; {new Date().getFullYear()} MediConnect Healthcare Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Crafted with medical precision &</span> <Heart size={14} color="#ef4444" fill="#ef4444" />
          </div>
        </div>
      </div>
    </footer>
  );
}
