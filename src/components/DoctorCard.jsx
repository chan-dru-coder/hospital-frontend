import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Building2, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  const fallbackPhoto = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=450';

  return (
    <div className="card card-hover-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Doctor Image & Header */}
      <div style={{ position: 'relative', height: '220px', background: '#f1f5f9', overflow: 'hidden' }}>
        <img 
          src={doctor.photo_url || fallbackPhoto} 
          alt={doctor.full_name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: 'top center',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackPhoto;
          }}
        />
        {/* Verified pill */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          borderRadius: 'var(--radius-full)',
          padding: '0.25rem 0.65rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#0284c7',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}>
          <CheckCircle size={14} color="#0284c7" fill="#e0f2fe" />
          Verified
        </div>

        {/* Specialization tag */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          borderRadius: 'var(--radius-full)',
          padding: '0.25rem 0.75rem',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: '#ffffff'
        }}>
          {doctor.specialization}
        </div>
      </div>

      {/* Doctor Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.3' }}>
            {doctor.full_name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#eab308', fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
            <Star size={15} fill="#eab308" color="#eab308" />
            <span>{doctor.rating || 4.9}</span>
            <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 500 }}>
              ({doctor.total_reviews || 84})
            </span>
          </div>
        </div>

        {/* Hospital */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.65rem' }}>
          <Building2 size={15} color="#0284c7" />
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {doctor.hospital}
          </span>
        </div>

        {/* Experience & Fee */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <Briefcase size={14} color="#64748b" />
            <span>{doctor.experience_years}+ Years Exp.</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7' }}>
            ${parseFloat(doctor.consultation_fee || 500).toFixed(0)}
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}> / visit</span>
          </div>
        </div>

        {/* View Profile Action */}
        <Link 
          to={`/doctors/${doctor.doctor_id || doctor.id}`}
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '0.9rem' }}
        >
          View Profile & Book
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
