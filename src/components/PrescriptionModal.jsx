import React from 'react';
import { Stethoscope, Printer, X, Calendar, User, FileText, Pill } from 'lucide-react';

export default function PrescriptionModal({ prescription, isOpen, onClose }) {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const medicines = prescription.medicines || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px' }}
      >
        {/* Modal Top Bar */}
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#0284c7" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Medical Prescription Record
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              title="Print Prescription"
            >
              <Printer size={16} />
              Print / Save PDF
            </button>
            <button 
              onClick={onClose}
              style={{ color: 'var(--text-muted)', padding: '0.25rem' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Prescription Paper Body (Styled like real medical prescription) */}
        <div className="modal-body" style={{ padding: '2rem' }}>
          {/* Clinic / Platform Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            borderBottom: '2px solid #0284c7', 
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#0284c7',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Stethoscope size={16} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>
                  MediConnect
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Official Healthcare & E-Prescription Network
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                {prescription.doctor_name || 'Dr. Specialist'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
                {prescription.doctor_specialization}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {prescription.doctor_hospital}
              </div>
            </div>
          </div>

          {/* Patient Details strip */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.88rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Patient Name</span>
              <strong style={{ color: 'var(--text-main)' }}>{prescription.patient_name}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Age / Gender</span>
              <strong style={{ color: 'var(--text-main)' }}>
                {prescription.patient_age ? `${prescription.patient_age} yrs` : 'N/A'} / {prescription.patient_gender}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Date Issued</span>
              <strong style={{ color: 'var(--text-main)' }}>
                {new Date(prescription.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Prescription ID</span>
              <strong style={{ color: '#0284c7' }}>#RX-{prescription.id}</strong>
            </div>
          </div>

          {/* Diagnosis Box */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 700 }}>
              Clinical Diagnosis
            </h4>
            <div style={{ 
              background: '#eff6ff', 
              borderLeft: '4px solid #0284c7', 
              padding: '0.75rem 1rem', 
              borderRadius: '0 8px 8px 0',
              fontWeight: 600,
              color: '#1e3a8a',
              fontSize: '0.95rem'
            }}>
              {prescription.diagnosis}
            </div>
          </div>

          {/* Rx Symbol & Medication Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7', fontFamily: 'serif' }}>
                ℞
              </span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Prescribed Medications
              </h4>
            </div>

            {medicines.length > 0 ? (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>#</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Medicine Name</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Dosage</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Frequency</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Duration</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < medicines.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>{idx + 1}</td>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#0f172a' }}>{med.name}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: '#0284c7', fontWeight: 600 }}>{med.dosage}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{med.frequency}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{med.duration}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>{med.notes || 'As prescribed'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No oral medications prescribed.
              </p>
            )}
          </div>

          {/* Medical Notes & Advice */}
          {(prescription.medical_notes || prescription.advice) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {prescription.medical_notes && (
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Clinical Observations
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {prescription.medical_notes}
                  </p>
                </div>
              )}
              {prescription.advice && (
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Doctor's Advice & Diet
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {prescription.advice}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Follow-up & Doctor Signature block */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end',
            paddingTop: '1.25rem',
            borderTop: '1px dashed #cbd5e1'
          }}>
            <div>
              {prescription.follow_up_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.88rem', fontWeight: 600 }}>
                  <Calendar size={16} />
                  <span>Follow-up Review: {prescription.follow_up_date}</span>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontStyle: 'italic', fontFamily: 'cursive', fontSize: '1.1rem', color: '#0369a1', marginBottom: '0.2rem' }}>
                {prescription.doctor_name}
              </div>
              <div style={{ borderTop: '1px solid #94a3b8', width: '160px', paddingTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Authorized Medical Signature
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer no-print">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} />
            Print Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
