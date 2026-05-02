// pages/DoctorsPage.jsx
import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../services/api';
import { Users, UserPlus, X, Plus, Save, ClipboardList, UserSearch, Trash2 } from 'lucide-react';

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', specialization: '', email: '', phone: '' });

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorAPI.getAll();
      setDoctors(res.data);
    } catch {
      showMsg('Failed to load doctors', 'error');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.specialization || !form.email || !form.phone) {
      showMsg('All fields are required!', 'error');
      return;
    }
    try {
      await doctorAPI.add(form);
      showMsg('Doctor added successfully!', 'success');
      setForm({ name: '', specialization: '', email: '', phone: '' });
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      showMsg((err.response?.data?.error || 'Failed to add doctor'), 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove Dr. ${name}?`)) return;
    try {
      await doctorAPI.delete(id);
      showMsg('Doctor removed', 'success');
      fetchDoctors();
    } catch { showMsg('Failed to delete', 'error'); }
  };

  const showMsg = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage(null), 4000); };

  // Get unique specializations for stats
  const specializations = [...new Set(doctors.map(d => d.specialization))];

  return (
    <div>
      <h1 className="page-title"><Users size={28} /> Doctor Management</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{doctors.length}</div>
          <div className="stat-label">Total Doctors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{specializations.length}</div>
          <div className="stat-label">Specializations</div>
        </div>
      </div>

      {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? '20px' : '0' }}>
          <div className="card-title"><UserPlus size={20} /> {showForm ? 'Add New Doctor' : 'Register a Doctor'}</div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add Doctor</>}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Dr. Anita Desai" required />
              </div>
              <div className="form-group">
                <label>Specialization *</label>
                <input name="specialization" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} placeholder="e.g. Cardiologist" required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="doctor@hospital.com" required />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input name="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="10-digit number" required />
              </div>
            </div>
            <button type="submit" className="btn btn-success"><Save size={18} /> Save Doctor</button>
          </form>
        )}
      </div>

      <div className="card">
        <div className="card-title"><ClipboardList size={20} /> Registered Doctors</div>
        {loading ? <div className="loading">Loading...</div> : doctors.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><UserSearch size={48} /></div><p>No doctors registered yet.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Specialization</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d.doctorId}>
                    <td><strong>#{d.doctorId}</strong></td>
                    <td>{d.name}</td>
                    <td><span className="badge badge-info">{d.specialization}</span></td>
                    <td>{d.email}</td>
                    <td>{d.phone}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.doctorId, d.name)}><Trash2 size={16} /> Delete</button></td>
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

export default DoctorsPage;
