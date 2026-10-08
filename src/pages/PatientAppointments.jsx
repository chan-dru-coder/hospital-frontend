import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PrescriptionModal from '../components/PrescriptionModal';
import { 
  Calendar, 
  Clock, 
  Building2, 
  FileText, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Search,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Cancel action state
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetAppointment, setTargetAppointment] = useState(null);
  const [actionError, setActionError] = useState('');

  // Prescription modal state
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [loadingPrescription, setLoadingPrescription] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setActionError('');
    try {
      const url = activeTab === 'ALL' 
        ? '/patient/my-appointments/' 
        : `/patient/my-appointments/?status=${activeTab}`;
      const res = await api.get(url);
      setAppointments(res.results || res || []);
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
      setActionError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const handleOpenCancel = (appt) => {
    setTargetAppointment(appt);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetAppointment) return;
    setCancellingId(targetAppointment.id);
    setActionError('');

    try {
      await api.post(`/patient/appointments/${targetAppointment.id}/cancel/`);
      setCancelModalOpen(false);
      setTargetAppointment(null);
      // Refresh list
      fetchAppointments();
    } catch (err) {
      setActionError(err.message || 'Could not cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewPrescription = async (apptId) => {
    setLoadingPrescription(true);
    try {
      const rx = await api.get(`/appointments/${apptId}/prescription/view/`);
      setSelectedPrescription(rx);
      setPrescriptionModalOpen(true);
    } catch (err) {
      alert(err.message || 'Prescription not available for this appointment yet.');
    } finally {
      setLoadingPrescription(false);
    }
  };

  const tabs = [
    { key: 'ALL', label: 'All Appointments' },
    { key: 'PENDING', label: 'Pending Approval' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  const fallbackPhoto = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=450';

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Patient Portal
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              My Appointments
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Track consultation schedules, cancellation options, and view prescribed medications.
            </p>
          </div>

          <Link to="/doctors" className="btn btn-primary">
            <Search size={16} /> Book New Appointment
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {actionError && (
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
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{actionError}</span>
          </div>
        )}

        {/* Appointments List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#0284c7' }}>
            <RefreshCw size={24} className="spin-animate" />
            <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>Loading your appointments...</div>
          </div>
        ) : appointments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {appointments.map((appt) => {
              const canCancel = ['PENDING', 'ACCEPTED'].includes(appt.status);

              return (
                <div key={appt.id} className="card card-hover-up" style={{ padding: '1.5rem', background: '#ffffff' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                  }}>
                    {/* Doctor Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '280px' }}>
                      <img
                        src={appt.doctor_photo || fallbackPhoto}
                        alt={appt.doctor_name}
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: 'var(--radius-lg)',
                          objectFit: 'cover',
                          border: '2px solid #e2e8f0'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackPhoto;
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {appt.doctor_name}
                          </h3>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0284c7', marginBottom: '0.25rem' }}>
                          {appt.doctor_specialization}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          <Building2 size={14} />
                          <span>{appt.doctor_hospital}</span>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Time */}
                    <div style={{
                      background: '#f8fafc',
                      padding: '0.75rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #e2e8f0',
                      minWidth: '220px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                        <Calendar size={15} color="#0284c7" />
                        <span>{appt.appointment_date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <Clock size={14} color="#0284c7" />
                        <span>{appt.time_slot}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <StatusBadge status={appt.status} />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                      {appt.has_prescription && (
                        <button
                          type="button"
                          onClick={() => handleViewPrescription(appt.id)}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <FileText size={15} />
                          View Prescription
                        </button>
                      )}

                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => handleOpenCancel(appt)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                        >
                          <XCircle size={15} />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reason for visit note if any */}
                  {appt.reason_for_visit && (
                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Reason: </span>
                      <span style={{ color: 'var(--text-main)' }}>{appt.reason_for_visit}</span>
                    </div>
                  )}
                </div>
              );
            })}
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
              <Calendar size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              No {activeTab.toLowerCase()} appointments found
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0.5rem auto 1.5rem', fontSize: '0.92rem' }}>
              You don't have any appointments in this status category right now.
            </p>
            <Link to="/doctors" className="btn btn-primary">
              Find and Book a Doctor
            </Link>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && targetAppointment && (
        <div className="modal-overlay" onClick={() => !cancellingId && setCancelModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#b91c1c' }}>
                Cancel Appointment
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                Are you sure you want to cancel your appointment with <strong>{targetAppointment.doctor_name}</strong> on <strong>{targetAppointment.appointment_date}</strong> at <strong>{targetAppointment.time_slot}</strong>?
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                This time slot will immediately be made available for other patients.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCancelModalOpen(false)}
                disabled={cancellingId}
              >
                No, Keep It
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmCancel}
                disabled={cancellingId}
              >
                {cancellingId ? 'Cancelling...' : 'Yes, Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Viewer Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
      />
    </div>
  );
}
