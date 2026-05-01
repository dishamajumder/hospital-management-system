// pages/PatientsPage.jsx
// Full CRUD page for managing patients
import React, { useState, useEffect } from 'react';
import { patientAPI } from '../services/api';

function PatientsPage() {
  // ---- STATE MANAGEMENT ----
  const [patients, setPatients] = useState([]);       // List of all patients
  const [loading, setLoading] = useState(false);      // Loading indicator
  const [message, setMessage] = useState(null);       // Success/error message
  const [showForm, setShowForm] = useState(false);    // Toggle form visibility

  // Form fields - match exactly with Patient model in Spring Boot
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    phone: '',
    address: '',
  });

  // ---- FETCH ALL PATIENTS on component mount ----
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // GET /api/patients → returns array of patient objects
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (err) {
      showMessage('Failed to load patients. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ---- HANDLE FORM SUBMIT (Add Patient) ----
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Basic validation
    if (!form.firstName || !form.lastName || !form.phone || !form.dob) {
      showMessage('Please fill all required fields!', 'error');
      return;
    }

    try {
      // POST /api/patients → sends form data as JSON to Spring Boot
      await patientAPI.add(form);
      showMessage('✅ Patient added successfully!', 'success');
      resetForm();
      setShowForm(false);
      fetchPatients(); // Refresh the list
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add patient';
      showMessage('❌ ' + errorMsg, 'error');
    }
  };

  // ---- DELETE PATIENT ----
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete patient ${name}? This will also delete their appointments and bills.`)) return;
    try {
      await patientAPI.delete(id);
      showMessage('✅ Patient deleted', 'success');
      fetchPatients();
    } catch (err) {
      showMessage('❌ Failed to delete patient', 'error');
    }
  };

  // ---- HELPER FUNCTIONS ----
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => setForm({ firstName: '', lastName: '', dob: '', gender: 'Male', phone: '', address: '' });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000); // Auto-hide after 4s
  };

  // ---- CALCULATE AGE from DOB ----
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    return today.getFullYear() - birthDate.getFullYear();
  };

  return (
    <div>
      <h1 className="page-title">👤 Patient Management</h1>

      {/* ---- STATS ---- */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{patients.length}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{patients.filter(p => p.gender === 'Male').length}</div>
          <div className="stat-label">Male Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{patients.filter(p => p.gender === 'Female').length}</div>
          <div className="stat-label">Female Patients</div>
        </div>
      </div>

      {/* ---- ALERT MESSAGE ---- */}
      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* ---- ADD PATIENT CARD ---- */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? '20px' : '0' }}>
          <div className="card-title">➕ {showForm ? 'Add New Patient' : 'Register a New Patient'}</div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Patient'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="e.g. Aarav" required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="e.g. Patel" required />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" maxLength="15" required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="City, State" />
              </div>
            </div>
            <button type="submit" className="btn btn-success">💾 Save Patient</button>
          </form>
        )}
      </div>

      {/* ---- PATIENTS TABLE ---- */}
      <div className="card">
        <div className="card-title">📋 Registered Patients</div>
        {loading ? (
          <div className="loading">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <p>No patients registered yet. Add one above!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.patientId}>
                    <td><strong>#{p.patientId}</strong></td>
                    <td>{p.firstName} {p.lastName}</td>
                    <td>{calculateAge(p.dob)} yrs</td>
                    <td>
                      <span className={`badge ${p.gender === 'Male' ? 'badge-info' : p.gender === 'Female' ? 'badge-warning' : 'badge-success'}`}>
                        {p.gender}
                      </span>
                    </td>
                    <td>{p.phone}</td>
                    <td>{p.address || '—'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.patientId, p.firstName)}>
                        🗑 Delete
                      </button>
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

export default PatientsPage;
