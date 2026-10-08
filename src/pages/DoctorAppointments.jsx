import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PrescriptionModal from '../components/PrescriptionModal';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  FileText, 
  AlertCircle, 
  RefreshCw,
  Edit3
} from 'lucide-react';

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Prescription modal state
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    setActionError('');
    try {
      const url = activeTab === 'ALL'
        ? '/doctor/appointments/'
        : `/doctor/appointments/?status=${activeTab}`;
      const res = await api.get(url);
      setAppointments(res.results || res || []);
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
      setActionError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, [activeTab]);

  const handleUpdateStatus = async (apptId, newStatus) => {
    setActionLoadingId(apptId);
    setActionError('');
    try {
      await api.patch(`/doctor/appointments/${apptId}/status/`, {
        status: newStatus,
      });
      // Refresh list
      fetchDoctorAppointments();
    } catch (err) {
      setActionError(err.message || `Failed to update status to ${newStatus}.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleViewPrescription = async (apptId) => {
    try {
      const rx = await api.get(`/appointments/${apptId}/prescription/view/`);
      setSelectedPrescription(rx);
      setPrescriptionModalOpen(true);
    } catch (err) {
      alert(err.message || 'Prescription could not be loaded.');
    }
  };

  const tabs = [
    { key: 'PENDING', label: 'Pending Approval' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'ALL', label: 'All Appointments' },
  ];

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Doctor Practice Portal
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Patient Consultations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Review pending consultation requests, accept or reject slots, and issue medical prescriptions.
          </p>
        </div>

        {/* Status Tabs (Page 7 requirement: tabs: Pending, Accepted, Rejected, Completed) */}
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
            <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>Loading patient requests...</div>
          </div>
        ) : appointments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {appointments.map((appt) => {
              const isPending = appt.status === 'PENDING';
              const isAccepted = appt.status === 'ACCEPTED';
              const isCompleted = appt.status === 'COMPLETED';

              return (
                <div key={appt.id} className="card card-hover-up" style={{ padding: '1.75rem', background: '#ffffff' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    {/* Patient Info */}
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: '#f0f9ff',
                          color: '#0284c7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem'
                        }}>
                          {appt.patient_name ? appt.patient_name.charAt(0) : 'P'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {appt.patient_name}
                          </h3>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Age: {appt.patient_age ? `${appt.patient_age} yrs` : 'N/A'} • Gender: {appt.patient_gender}
                          </div>
                        </div>
                      </div>

                      {/* Contact items */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {appt.patient_phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Phone size={13} color="#0284c7" />
                            <span>{appt.patient_phone}</span>
                          </div>
                        )}
                        {appt.patient_email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Mail size={13} color="#0284c7" />
                            <span>{appt.patient_email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Schedule Time Box */}
                    <div style={{
                      background: '#f8fafc',
                      padding: '0.75rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #e2e8f0',
                      minWidth: '200px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
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
                  </div>

                  {/* Reason for visit */}
                  {appt.reason_for_visit && (
                    <div style={{
                      background: '#f0f9ff',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.88rem',
                      color: '#0369a1',
                      borderLeft: '3px solid #0284c7',
                      marginBottom: '1.25rem'
                    }}>
                      <strong>Patient Stated Symptoms: </strong>
                      {appt.reason_for_visit}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f1f5f9',
                    flexWrap: 'wrap'
                  }}>
                    {/* If PENDING: Show Accept & Reject */}
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                          disabled={actionLoadingId === appt.id}
                        >
                          <XCircle size={15} />
                          Reject Request
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(appt.id, 'ACCEPTED')}
                          className="btn btn-success btn-sm"
                          disabled={actionLoadingId === appt.id}
                        >
                          <CheckCircle size={15} />
                          Accept Appointment
                        </button>
                      </>
                    )}

                    {/* If ACCEPTED: Show Write Prescription */}
                    {isAccepted && (
                      <Link
                        to={`/doctor/appointments/${appt.id}/prescription`}
                        className="btn btn-primary btn-sm"
                      >
                        <Edit3 size={15} />
                        Write Prescription & Complete
                      </Link>
                    )}

                    {/* If COMPLETED: View or Edit Prescription */}
                    {isCompleted && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                        <Link
                          to={`/doctor/appointments/${appt.id}/prescription`}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit3 size={15} />
                          {appt.has_prescription ? 'Edit Prescription' : 'Add Prescription'}
                        </Link>
                      </div>
                    )}
                  </div>
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
              No {activeTab.toLowerCase()} appointments
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 0', fontSize: '0.92rem' }}>
              When patients book consultations in this category, they will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Prescription Viewer Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
      />
    </div>
  );
}
