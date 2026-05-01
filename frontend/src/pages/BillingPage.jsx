// pages/BillingPage.jsx
import React, { useState, useEffect } from 'react';
import { billingAPI, patientAPI } from '../services/api';

function BillingPage() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', amount: '', paymentStatus: 'Pending', billDate: new Date().toISOString().split('T')[0] });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [billRes, patRes] = await Promise.all([billingAPI.getAll(), patientAPI.getAll()]);
      setBills(billRes.data);
      setPatients(patRes.data);
    } catch { showMsg('Failed to load billing data', 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.amount) { showMsg('Patient and amount are required!', 'error'); return; }
    if (parseFloat(form.amount) < 0) { showMsg('Amount cannot be negative!', 'error'); return; }
    try {
      await billingAPI.generate({ ...form, patientId: parseInt(form.patientId), amount: parseFloat(form.amount) });
      showMsg('✅ Bill generated!', 'success');
      setForm({ patientId: '', amount: '', paymentStatus: 'Pending', billDate: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.error || 'Failed to generate bill'), 'error');
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await billingAPI.markPaid(id);
      showMsg('✅ Bill marked as Paid!', 'success');
      fetchAll();
    } catch { showMsg('❌ Failed to update', 'error'); }
  };

  const showMsg = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage(null), 4000); };
  const getPatientName = (id) => { const p = patients.find(p => p.patientId === id); return p ? `${p.firstName} ${p.lastName}` : `Patient #${id}`; };

  const totalRevenue = bills.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
  const pendingAmount = bills.filter(b => b.paymentStatus === 'Pending').reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

  return (
    <div>
      <h1 className="page-title">💳 Billing & Payments</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{bills.length}</div>
          <div className="stat-label">Total Bills</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#34a853' }}>
          <div className="stat-value" style={{ color: '#34a853' }}>₹{totalRevenue.toFixed(0)}</div>
          <div className="stat-label">Total Collected</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#ea4335' }}>
          <div className="stat-value" style={{ color: '#ea4335' }}>₹{pendingAmount.toFixed(0)}</div>
          <div className="stat-label">Pending Amount</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#fbbc04' }}>
          <div className="stat-value" style={{ color: '#fbbc04' }}>{bills.filter(b => b.paymentStatus === 'Pending').length}</div>
          <div className="stat-label">Unpaid Bills</div>
        </div>
      </div>

      {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? '20px' : '0' }}>
          <div className="card-title">➕ Generate Bill</div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Generate Bill'}</button>
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
                <label>Amount (₹) *</label>
                <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="e.g. 1500.00" required />
              </div>
              <div className="form-group">
                <label>Payment Status</label>
                <select value={form.paymentStatus} onChange={e => setForm({...form, paymentStatus: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bill Date</label>
                <input type="date" value={form.billDate} onChange={e => setForm({...form, billDate: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-success">🧾 Generate Bill</button>
          </form>
        )}
      </div>

      <div className="card">
        <div className="card-title">🧾 All Bills</div>
        {loading ? <div className="loading">Loading...</div> : bills.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">💳</div><p>No bills generated yet.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Bill ID</th><th>Patient</th><th>Amount</th><th>Status</th><th>Bill Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {bills.map(b => (
                  <tr key={b.billId}>
                    <td><strong>#{b.billId}</strong></td>
                    <td>{getPatientName(b.patientId)}</td>
                    <td><strong>₹{parseFloat(b.amount).toFixed(2)}</strong></td>
                    <td>
                      <span className={`badge ${b.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                        {b.paymentStatus === 'Paid' ? '✅ Paid' : '⏳ Pending'}
                      </span>
                    </td>
                    <td>{b.billDate}</td>
                    <td>
                      {b.paymentStatus === 'Pending' && (
                        <button className="btn btn-success btn-sm" onClick={() => handleMarkPaid(b.billId)}>
                          💰 Mark Paid
                        </button>
                      )}
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

export default BillingPage;
