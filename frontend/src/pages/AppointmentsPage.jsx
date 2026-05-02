// pages/AppointmentsPage.jsx
import React, { useState, useEffect } from 'react';
import { appointmentAPI, patientAPI, doctorAPI } from '../services/api';
import { Calendar, Plus, X, ClipboardList, CheckCircle, CalendarX, CalendarClock } from 'lucide-react';

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', doctorId: '', appointmentDate: '', status: 'Scheduled' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Fetch appointments, patients, and doctors in parallel
      const [apptRes, patRes, docRes] = await Promise.all([
        appointmentAPI.getAll(),
        patientAPI.getAll(),
        doctorAPI.getAll()
      ]);
      setAppointments(apptRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
    } catch { showMsg('Failed to load data', 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.appointmentDate) {
      showMsg('Patient and date are required!', 'error'); return;
    }
    try {
      await appointmentAPI.book({ ...form, patientId: parseInt(form.patientId), doctorId: form.doctorId ? parseInt(form.doctorId) : null });
      showMsg('Appointment booked!', 'success');
      setForm({ patientId: '', doctorId: '', appointmentDate: '', status: 'Scheduled' });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      showMsg((err.response?.data?.error || 'Failed to book'), 'error');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await appointmentAPI.updateStatus(id, newStatus);
      showMsg(`Status updated to ${newStatus}`, 'success');
      fetchAll();
    } catch { showMsg('Failed to update status', 'error'); }
  };

  const showMsg = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage(null), 4000); };

  // Helper to find names from IDs
  const getPatientName = (id) => { const p = patients.find(p => p.patientId === id); return p ? `${p.firstName} ${p.lastName}` : `Patient #${id}`; };
  const getDoctorName = (id) => { const d = doctors.find(d => d.doctorId === id); return d ? d.name : 'Unassigned'; };
  const getStatusBadge = (s) => ({ Scheduled: 'badge-warning', Completed: 'badge-success', Cancelled: 'badge-danger' }[s] || 'badge-info');

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'Scheduled').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  return (
    <div>
      <h1 className="page-title"><Calendar size={28} /> Appointments</h1>

      <div className="stats-grid">
        {[['Total', stats.total, '#1a73e8'], ['Scheduled', stats.scheduled, '#f9a825'], ['Completed', stats.completed, '#34a853'], ['Cancelled', stats.cancelled, '#ea4335']].map(([label, val, color]) => (
          <div key={label} className="stat-card" style={{ borderTopColor: color }}>
            <div className="stat-value" style={{ color }}>{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? '20px' : '0' }}>
          <div className="card-title"><CalendarClock size={20} /> Book Appointment</div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Book</>}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Patient *</label>
                <select value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} required>
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.firstName} {p.lastName} (#{p.patientId})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})}>
                  <option value="">-- Select Doctor --</option>
                  {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>{d.name} ({d.specialization})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Appointment Date & Time *</label>
                <input type="datetime-local" value={form.appointmentDate} onChange={e => setForm({...form, appointmentDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success"><CalendarClock size={18} /> Book Appointment</button>
          </form>
        )}
      </div>

      <div className="card">
        <div className="card-title"><ClipboardList size={20} /> All Appointments</div>
        {loading ? <div className="loading">Loading...</div> : appointments.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><CalendarX size={48} /></div><p>No appointments yet.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.appointmentId}>
                    <td><strong>#{a.appointmentId}</strong></td>
                    <td>{getPatientName(a.patientId)}</td>
                    <td>{getDoctorName(a.doctorId)}</td>
                    <td>{a.appointmentDate?.replace('T', ' ')}</td>
                    <td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                    <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {a.status !== 'Completed' && <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(a.appointmentId, 'Completed')}><CheckCircle size={16} /> Complete</button>}
                      {a.status === 'Scheduled' && <button className="btn btn-danger btn-sm" onClick={() => handleStatusUpdate(a.appointmentId, 'Cancelled')}><X size={16} /> Cancel</button>}
                    </td>
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

export default AppointmentsPage;
