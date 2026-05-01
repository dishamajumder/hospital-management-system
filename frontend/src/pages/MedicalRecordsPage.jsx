// pages/MedicalRecordsPage.jsx
import React, { useState, useEffect } from 'react';
import { medicalRecordAPI, appointmentAPI, patientAPI } from '../services/api';

function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ appointmentId: '', diagnosis: '', prescription: '', notes: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [recRes, apptRes, patRes] = await Promise.all([
        medicalRecordAPI.getAll(),
        appointmentAPI.getAll(),
        patientAPI.getAll()
      ]);
      setRecords(recRes.data);
      // Only show completed appointments (medical records are for completed visits)
      setAppointments(apptRes.data.filter(a => a.status === 'Completed'));
      setPatients(patRes.data);
    } catch { showMsg('Failed to load data', 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.appointmentId || !form.diagnosis) {
      showMsg('Appointment ID and diagnosis are required!', 'error'); return;
    }
    try {
      await medicalRecordAPI.add({ ...form, appointmentId: parseInt(form.appointmentId) });
      showMsg('✅ Medical record added!', 'success');
      setForm({ appointmentId: '', diagnosis: '', prescription: '', notes: '' });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.error || 'Failed to add record'), 'error');
    }
  };

  const showMsg = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage(null), 4000); };

  const getPatientForAppointment = (apptId) => {
    const appt = appointments.find(a => a.appointmentId === apptId) || { patientId: apptId };
    const patient = patients.find(p => p.patientId === appt.patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : `Appt #${apptId}`;
  };

  return (
    <div>
      <h1 className="page-title">📋 Medical Records</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{records.length}</div>
          <div className="stat-label">Total Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{appointments.length}</div>
          <div className="stat-label">Completed Visits</div>
        </div>
      </div>

      {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? '20px' : '0' }}>
          <div className="card-title">➕ Add Medical Record</div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Record'}</button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit}>
            <div className="alert alert-info">ℹ️ Medical records can only be added for <strong>Completed</strong> appointments.</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Appointment (Completed) *</label>
                <select value={form.appointmentId} onChange={e => setForm({...form, appointmentId: e.target.value})} required>
                  <option value="">-- Select Completed Appointment --</option>
                  {appointments.map(a => (
                    <option key={a.appointmentId} value={a.appointmentId}>
                      Appt #{a.appointmentId} — {a.appointmentDate?.split('T')[0]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Diagnosis *</label>
                <input value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} placeholder="e.g. Hypertension" required />
              </div>
              <div className="form-group">
                <label>Prescription</label>
                <input value={form.prescription} onChange={e => setForm({...form, prescription: e.target.value})} placeholder="e.g. Amlodipine 5mg daily" />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows="3" placeholder="Additional doctor notes..." style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '8px', width: '100%' }} />
            </div>
            <button type="submit" className="btn btn-success">💾 Save Record</button>
          </form>
        )}
      </div>

      <div className="card">
        <div className="card-title">📋 All Medical Records</div>
        {loading ? <div className="loading">Loading...</div> : records.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><p>No medical records found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Record ID</th><th>Appointment</th><th>Patient</th><th>Diagnosis</th><th>Prescription</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.recordId}>
                    <td><strong>#{r.recordId}</strong></td>
                    <td>Appt #{r.appointmentId}</td>
                    <td>{getPatientForAppointment(r.appointmentId)}</td>
                    <td><span className="badge badge-danger">{r.diagnosis}</span></td>
                    <td>{r.prescription || '—'}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalRecordsPage;
