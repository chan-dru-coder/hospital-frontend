import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import { Search, Filter, Stethoscope, RefreshCw, AlertCircle } from 'lucide-react';

export default function DoctorsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const activeSpecialty = searchParams.get('specialization') || 'all';

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const specs = await api.get('/specializations/');
        setSpecializations(['All', ...specs]);
      } catch (err) {
        console.error('Error fetching specializations:', err);
      }
    };
    fetchSpecializations();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeSpecialty && activeSpecialty.toLowerCase() !== 'all') {
        params.append('specialization', activeSpecialty);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const res = await api.get(`/doctors/?${params.toString()}`);
      setDoctors(res.results || res || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [activeSpecialty, searchParams]);

  const handleSpecialtyClick = (spec) => {
    const newParams = new URLSearchParams(searchParams);
    if (spec.toLowerCase() === 'all') {
      newParams.delete('specialization');
    } else {
      newParams.set('specialization', spec);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Page Title & Subtitle */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Available Specialists
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Book Top Verified Doctors
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem' }}>
            Browse through our verified medical specialists and reserve an immediate appointment.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '2rem'
        }}>
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search by doctor name, specialization, or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search
                size={18}
                color="#0284c7"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {/* Specialization Filter Pills */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Filter size={15} color="#0284c7" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Filter By Specialization:
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {specializations.map((spec) => {
                const isActive = activeSpecialty.toLowerCase() === spec.toLowerCase();
                return (
                  <button
                    key={spec}
                    onClick={() => handleSpecialtyClick(spec)}
                    style={{
                      padding: '0.4rem 0.95rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: isActive ? '1.5px solid #0284c7' : '1px solid var(--border-color)',
                      background: isActive ? '#0284c7' : '#f8fafc',
                      color: isActive ? '#ffffff' : 'var(--text-main)',
                      boxShadow: isActive ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
                    }}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Doctor Results Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#0284c7', fontWeight: 600, fontSize: '1.1rem' }}>
              <RefreshCw size={24} className="spin-animate" />
              Loading verified doctors...
            </div>
          </div>
        ) : doctors.length > 0 ? (
          <div>
            <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {doctors.length} qualified {doctors.length === 1 ? 'doctor' : 'doctors'}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.75rem'
            }}>
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.doctor_id || doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#ffffff' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              marginBottom: '1rem'
            }}>
              <Stethoscope size={32} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
              No doctors found
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 1.5rem', fontSize: '0.95rem' }}>
              We couldn't find any doctors matching "{searchQuery || activeSpecialty}". Try resetting filters or using a different keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
