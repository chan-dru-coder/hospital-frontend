import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Briefcase, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft,
  DollarSign,
  HeartPulse,
  User,
  X
} from 'lucide-react';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isPatient, isAuthenticated } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  // Booking state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [slotsData, setSlotsData] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch Doctor profile
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.get(`/doctors/${id}/`);
        setDoctor(res);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
      } finally {
        setLoadingDoctor(false);
      }
    };
    fetchDoc();
  }, [id]);

  // Fetch Available slots for selected date
  const fetchAvailability = async () => {
    if (!id || !selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot('');
    try {
      const res = await api.get(`/doctors/${id}/availability/?date=${selectedDate}`);
      setSlotsData(res.slots || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [id, selectedDate]);

  const handleOpenBooking = () => {
    setBookingError('');
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/doctors/${id}` } } });
      return;
    }
    if (!isPatient) {
      setBookingError('Only patients can book appointments. Please log in with a patient account.');
      return;
    }
    if (!selectedSlot) {
      setBookingError('Please choose an available time slot first.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    setBookingError('');
    setBookingLoading(true);

    try {
      await api.post('/book/', {
        doctor_id: parseInt(id, 10),
        appointment_date: selectedDate,
        time_slot: selectedSlot,
        reason_for_visit: reasonForVisit,
      });

      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 1500);
    } catch (err) {
      setBookingError(err.message || 'Slot booking failed. The slot may have just been reserved.');
      // Refresh slots
      fetchAvailability();
    } finally {
      setBookingLoading(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#0284c7', fontWeight: 600 }}>
        Loading doctor profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Doctor not found</h2>
        <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Doctors
        </Link>
      </div>
    );
  }

  const fallbackPhoto = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=450';

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Back Link */}
        <Link 
          to="/doctors" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} /> Back to Doctor Directory
        </Link>

        {/* Top Doctor Profile Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', background: '#ffffff' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            alignItems: 'center'
          }}>
            {/* Photo */}
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: 'var(--shadow-md)',
              border: '3px solid #ffffff'
            }}>
              <img
                src={doctor.photo_url || fallbackPhoto}
                alt={doctor.full_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackPhoto;
                }}
              />
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {doctor.full_name}
                </h1>
                <span style={{
                  background: '#e0f2fe',
                  color: '#0284c7',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <CheckCircle size={14} /> Verified Specialist
                </span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0284c7', marginBottom: '0.65rem' }}>
                {doctor.specialization}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} color="#0284c7" />
                  <span>{doctor.hospital}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Briefcase size={16} color="#0284c7" />
                  <span>{doctor.experience_years}+ Years Experience</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#eab308', fontWeight: 700 }}>
                  <Star size={16} fill="#eab308" color="#eab308" />
                  <span>{doctor.rating}</span>
                  <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>
                    ({doctor.total_reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Consultation Fee badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f8fafc',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Consultation Fee:</span>
                <strong style={{ fontSize: '1.15rem', color: '#0284c7' }}>
                  ${parseFloat(doctor.consultation_fee || 500).toFixed(0)}
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>/ session</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Columns: Left = Bio & Info, Right = Book Appointment Interactive Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem'
        }}>
          {/* Left Column: Doctor About */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                About Dr. {doctor.user_name || doctor.full_name?.replace('Dr. ', '')}
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                {doctor.bio || `${doctor.full_name} is an experienced medical specialist at ${doctor.hospital} with an exceptional track record of patient recovery, preventive screenings, and patient-first medical treatments.`}
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Patient Care Commitment
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#10b981" />
                  <span>Licensed medical practitioner with certified credentials</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HeartPulse size={18} color="#10b981" />
                  <span>Personalized consultation and preventive care recommendations</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="#10b981" />
                  <span>Instant slot confirmation with zero overbooking</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Book Appointment (Page 4 & 5 feature) */}
          <div className="card" style={{
            padding: '2rem',
            background: '#ffffff',
            border: '2px solid var(--primary-border)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Calendar size={22} color="#0284c7" />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Book Appointment
              </h3>
            </div>

            {bookingError && (
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
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Step 1: Select Date */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>1. Select Consultation Date</span>
                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Step 2: Time Slots */}
            <div className="form-group">
              <label className="form-label">
                2. Choose Available Time Slot
              </label>

              {loadingSlots ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Checking slot availability...
                </div>
              ) : slotsData.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.6rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  padding: '0.25rem'
                }}>
                  {slotsData.map((item) => {
                    const isSelected = selectedSlot === item.slot;
                    const isBooked = item.is_booked;

                    return (
                      <button
                        key={item.slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(item.slot)}
                        style={{
                          padding: '0.65rem 0.5rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          transition: 'all 0.15s ease',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          border: isSelected
                            ? '2px solid #0284c7'
                            : isBooked
                            ? '1px solid #e2e8f0'
                            : '1.5px solid #cbd5e1',
                          background: isSelected
                            ? '#0284c7'
                            : isBooked
                            ? '#f1f5f9'
                            : '#ffffff',
                          color: isSelected
                            ? '#ffffff'
                            : isBooked
                            ? '#94a3b8'
                            : 'var(--text-main)',
                          opacity: isBooked ? 0.6 : 1,
                          boxShadow: isSelected ? '0 4px 10px rgba(2, 132, 199, 0.3)' : 'none'
                        }}
                      >
                        <div>{item.slot}</div>
                        <div style={{ fontSize: '0.7rem', marginTop: '0.2rem', color: isSelected ? '#e0f2fe' : isBooked ? '#ef4444' : '#10b981' }}>
                          {isBooked ? 'Reserved' : 'Available'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  No slots configured for this date.
                </p>
              )}
            </div>

            {/* Step 3: Reason for visit */}
            <div className="form-group">
              <label className="form-label">
                3. Symptoms or Reason for Visit (Optional)
              </label>
              <textarea
                rows={2}
                className="form-textarea"
                placeholder="e.g. Mild headache, fever for 2 days, or routine general checkup..."
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
              />
            </div>

            {/* Live Summary Strip */}
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.88rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Selected Time:</span>
                <strong>{selectedSlot || 'None selected'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Consultation Fee:</span>
                <strong style={{ color: '#0284c7' }}>${parseFloat(doctor.consultation_fee || 500).toFixed(0)}</strong>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              type="button"
              onClick={handleOpenBooking}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
            >
              Continue to Confirm
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (Page 5: Book appointment: select date and time, confirm or cancel) */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => !bookingLoading && setShowConfirmModal(false)}>
          <div 
            className="modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px' }}
          >
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Confirm Appointment Reservation
              </h3>
              <button 
                onClick={() => setShowConfirmModal(false)}
                disabled={bookingLoading}
                style={{ padding: '0.25rem', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <CheckCircle size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803d', marginBottom: '0.5rem' }}>
                    Appointment Confirmed!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Your appointment has been reserved. Redirecting to your appointments...
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                    Please review your appointment details below before confirming.
                  </p>

                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    fontSize: '0.92rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Doctor:</span>
                      <strong>{doctor.full_name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Specialization:</span>
                      <span>{doctor.specialization}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Hospital:</span>
                      <span>{doctor.hospital}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                      <strong style={{ color: '#0284c7' }}>{selectedDate}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Time Slot:</span>
                      <strong style={{ color: '#0284c7' }}>{selectedSlot}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Patient Name:</span>
                      <span>{user?.first_name || user?.full_name || 'Patient'}</span>
                    </div>
                    {reasonForVisit && (
                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.82rem', marginBottom: '0.2rem' }}>Reason for Visit:</span>
                        <p style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>{reasonForVisit}</p>
                      </div>
                    )}
                  </div>

                  {bookingError && (
                    <div style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      fontSize: '0.85rem',
                      marginTop: '1rem'
                    }}>
                      {bookingError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {!bookingSuccess && (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Reserving Slot...' : 'Confirm Appointment'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
