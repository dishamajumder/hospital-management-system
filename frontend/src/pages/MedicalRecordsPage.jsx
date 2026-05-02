// pages/MedicalRecordsPage.jsx
import React, { useState, useEffect } from 'react';
import { medicalRecordAPI, appointmentAPI, patientAPI } from '../services/api';
import { FileText, Plus, X, Info, Save, FileSearch, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
      showMsg('Medical record added!', 'success');
      setForm({ appointmentId: '', diagnosis: '', prescription: '', notes: '' });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      showMsg((err.response?.data?.error || 'Failed to add record'), 'error');
    }
  };

  const showMsg = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage(null), 4000); };

  const getPatientForAppointment = (apptId) => {
    const appt = appointments.find(a => a.appointmentId === apptId) || { patientId: apptId };
    const patient = patients.find(p => p.patientId === appt.patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : `Appt #${apptId}`;
  };

  const generatePrescriptionPDF = (record) => {
    const doc = new jsPDF();
    const patientName = getPatientForAppointment(record.appointmentId);
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // Indigo color
    doc.text("Disha Hospital", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Official Prescription & Medical Report", 105, 30, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Record Details
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Record ID: #${record.recordId}`, 20, 50);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 140, 50);
    
    doc.text(`Patient Name: ${patientName}`, 20, 60);
    doc.text(`Appointment: #${record.appointmentId}`, 140, 60);

    // Medical Info
    doc.setFontSize(14);
    doc.setTextColor(99, 102, 241);
    doc.text("Diagnosis:", 20, 80);
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(record.diagnosis, 20, 90);

    doc.setFontSize(14);
    doc.setTextColor(99, 102, 241);
    doc.text("Prescription (Rx):", 20, 110);
    doc.setTextColor(0);
    doc.setFontSize(12);
    // Split text to handle long prescriptions
    const splitPrescription = doc.splitTextToSize(record.prescription || "No prescription given.", 170);
    doc.text(splitPrescription, 20, 120);

    const notesY = 120 + (splitPrescription.length * 7) + 10;
    doc.setFontSize(14);
    doc.setTextColor(99, 102, 241);
    doc.text("Doctor's Notes:", 20, notesY);
    doc.setTextColor(0);
    doc.setFontSize(12);
    const splitNotes = doc.splitTextToSize(record.notes || "No additional notes.", 170);
    doc.text(splitNotes, 20, notesY + 10);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Authorized Signature: _______________________", 140, 260);
    doc.text("Wishing you a speedy recovery - Disha Hospital.", 105, 280, { align: "center" });
    
    // Open PDF in a new tab instead of forcing a download
    // This bypasses browser download manager issues and provides a better UX
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
  };

  return (
    <div>
      <h1 className="page-title"><FileText size={28} /> Medical Records</h1>

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
          <div className="card-title"><FileText size={20} /> Add Medical Record</div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add Record</>}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit}>
            <div className="alert alert-info"><Info size={18} style={{marginRight: '8px'}}/> Medical records can only be added for <strong>Completed</strong> appointments.</div>
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
            <button type="submit" className="btn btn-success"><Save size={18} /> Save Record</button>
          </form>
        )}
      </div>

      <div className="card">
        <div className="card-title"><FileText size={20} /> All Medical Records</div>
        {loading ? <div className="loading">Loading...</div> : records.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><FileSearch size={48} /></div><p>No medical records found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Record ID</th><th>Appointment</th><th>Patient</th><th>Diagnosis</th><th>Prescription</th><th>Notes</th><th>Actions</th></tr>
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
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => generatePrescriptionPDF(r)}>
                        <Printer size={16} /> Print Rx
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

export default MedicalRecordsPage;
