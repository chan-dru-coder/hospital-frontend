import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Plus, Trash2, Save, ArrowLeft, AlertCircle, CheckCircle,
  Stethoscope, User, Calendar, FileText, Pill
} from 'lucide-react';

const EMPTY_MED = { name: '', dosage: '', frequency: '', duration: '', notes: '' };

export default function PrescriptionPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([{ ...EMPTY_MED }]);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Fetch appointment details from doctor appointments list
        const res = await api.get(`/doctor/appointments/?status=ALL`);
        const all = res.results || res || [];
        const appt = all.find(a => String(a.id) === String(appointmentId));
        if (appt) {
          setAppointment(appt);
        }
        // Try to load existing prescription if any
        try {
          const rx = await api.get(`/appointments/${appointmentId}/prescription/view/`);
          if (rx) {
            setDiagnosis(rx.diagnosis || '');
            setMedicines(rx.medicines?.length ? rx.medicines : [{ ...EMPTY_MED }]);
            setMedicalNotes(rx.medical_notes || '');
            setAdvice(rx.advice || '');
            setFollowUpDate(rx.follow_up_date || '');
          }
        } catch (_) {
          // No existing prescription yet — that's fine
        }
      } catch (err) {
        setError('Failed to load appointment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  const addMedicine = () => setMedicines(prev => [...prev, { ...EMPTY_MED }]);

  const removeMedicine = (idx) =>
    setMedicines(prev => prev.filter((_, i) => i !== idx));

  const updateMedicine = (idx, field, value) =>
    setMedicines(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));

  const handleSave = async () => {
    setError('');
    if (!diagnosis.trim()) {
      setError('Please enter a diagnosis before saving.');
      return;
    }
    setSaving(true);
    try {
      await api.post(`/appointments/${appointmentId}/prescription/`, {
        diagnosis,
        medicines: medicines.filter(m => m.name.trim()),
        medical_notes: medicalNotes,
        advice,
        follow_up_date: followUpDate || null,
      });
      setSuccess(true);
      setTimeout(() => navigate('/doctor/appointments'), 1800);
    } catch (err) {
      setError(err.message || 'Failed to save prescription.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem 0', color: '#0284c7', fontWeight: 600 }}>
      Loading appointment details...
    </div>
  );

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '860px' }}>

        {/* Back Link */}
        <button
          onClick={() => navigate('/doctor/appointments')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back to Appointments
        </button>

        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Medical Record
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Write Prescription
          </h1>
        </div>

        {/* Patient Info Strip */}
        {appointment && (
          <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', background: '#f0f9ff', border: '1.5px solid #bae6fd' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Patient</div>
                  <strong>{appointment.patient_name}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Appointment</div>
                  <strong>{appointment.appointment_date} · {appointment.time_slot}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age / Gender</div>
                  <strong>{appointment.patient_age ? `${appointment.patient_age} yrs` : 'N/A'} / {appointment.patient_gender}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckCircle size={36} color="#16a34a" />
            </div>
            <h2 style={{ fontWeight: 800, color: '#15803d', marginBottom: '0.5rem' }}>Prescription Saved!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Appointment marked as completed. Redirecting...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Diagnosis */}
            <div className="card" style={{ padding: '1.75rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#0284c7" /> Clinical Diagnosis
              </h3>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Diagnosis <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  placeholder="e.g. Stage 1 Hypertension, Viral Upper Respiratory Infection..."
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                />
              </div>
            </div>

            {/* Medicines */}
            <div className="card" style={{ padding: '1.75rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pill size={20} color="#0284c7" /> Prescribed Medications
                </h3>
                <button type="button" onClick={addMedicine} className="btn btn-outline-primary btn-sm">
                  <Plus size={15} /> Add Medicine
                </button>
              </div>

              {medicines.map((med, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>Medicine #{idx + 1}</span>
                    {medicines.length > 1 && (
                      <button type="button" onClick={() => removeMedicine(idx)} style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label">Medicine Name</label>
                      <input type="text" className="form-input" placeholder="e.g. Amoxicillin" value={med.name} onChange={e => updateMedicine(idx, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Dosage</label>
                      <input type="text" className="form-input" placeholder="e.g. 500mg" value={med.dosage} onChange={e => updateMedicine(idx, 'dosage', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Frequency</label>
                      <input type="text" className="form-input" placeholder="e.g. Twice daily" value={med.frequency} onChange={e => updateMedicine(idx, 'frequency', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Duration</label>
                      <input type="text" className="form-input" placeholder="e.g. 7 days" value={med.duration} onChange={e => updateMedicine(idx, 'duration', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Special Instructions</label>
                      <input type="text" className="form-input" placeholder="e.g. Take after food" value={med.notes} onChange={e => updateMedicine(idx, 'notes', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes, Advice & Follow-up */}
            <div className="card" style={{ padding: '1.75rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                Clinical Observations & Advice
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Clinical Observations / Test Results</label>
                  <textarea rows={3} className="form-textarea" placeholder="e.g. BP: 140/90 mmHg, ECG normal, blood work pending..." value={medicalNotes} onChange={e => setMedicalNotes(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Doctor's Advice & Lifestyle Recommendations</label>
                  <textarea rows={3} className="form-textarea" placeholder="e.g. Drink 2L water daily, 30 min walk, reduce sodium intake..." value={advice} onChange={e => setAdvice(e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0, maxWidth: '280px' }}>
                <label className="form-label">Follow-up Date (Optional)</label>
                <input type="date" className="form-input" min={new Date().toISOString().split('T')[0]} value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
              </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/doctor/appointments')}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
                <Save size={18} />
                {saving ? 'Saving Prescription...' : 'Save & Complete Appointment'}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
