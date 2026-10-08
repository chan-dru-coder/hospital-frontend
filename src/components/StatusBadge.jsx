import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Check } from 'lucide-react';

export default function StatusBadge({ status }) {
  const normalized = (status || 'PENDING').toUpperCase();

  switch (normalized) {
    case 'PENDING':
      return (
        <span className="status-badge status-pending">
          <Clock size={13} />
          Pending Approval
        </span>
      );
    case 'ACCEPTED':
      return (
        <span className="status-badge status-accepted">
          <CheckCircle2 size={13} />
          Accepted
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="status-badge status-completed">
          <Check size={13} strokeWidth={2.5} />
          Completed
        </span>
      );
    case 'REJECTED':
      return (
        <span className="status-badge status-rejected">
          <XCircle size={13} />
          Rejected
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="status-badge status-cancelled">
          <AlertCircle size={13} />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="status-badge status-pending">
          {status}
        </span>
      );
  }
}
