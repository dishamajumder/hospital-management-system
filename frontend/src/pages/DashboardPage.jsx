// pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { patientAPI, appointmentAPI, billingAPI } from '../services/api';
import { LayoutDashboard, TrendingUp, Users, Calendar, Banknote } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';

function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [patRes, apptRes, billRes] = await Promise.all([
        patientAPI.getAll(),
        appointmentAPI.getAll(),
        billingAPI.getAll()
      ]);
      setPatients(patRes.data);
      setAppointments(apptRes.data);
      setBills(billRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  // ---- DATA PROCESSING FOR CHARTS ----

  // 1. Patient Demographics (Pie Chart)
  const genderData = [
    { name: 'Male', value: patients.filter(p => p.gender === 'Male').length },
    { name: 'Female', value: patients.filter(p => p.gender === 'Female').length },
    { name: 'Other', value: patients.filter(p => p.gender !== 'Male' && p.gender !== 'Female').length }
  ].filter(d => d.value > 0);
  const COLORS = ['#6366f1', '#ec4899', '#f59e0b'];

  // 2. Revenue Status (Bar Chart)
  const paidTotal = bills.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
  const pendingTotal = bills.filter(b => b.paymentStatus === 'Pending').reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
  const revenueData = [
    { name: 'Collected', amount: paidTotal },
    { name: 'Pending', amount: pendingTotal }
  ];

  // 3. Appointments over last 7 days (Line Chart)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };
  
  const last7Days = getLast7Days();
  const appointmentTrends = last7Days.map(day => {
    const count = appointments.filter(a => a.appointmentDate?.startsWith(day)).length;
    // Format date for display (e.g., "May 02")
    const dateObj = new Date(day);
    const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { date: displayDate, appointments: count };
  });

  if (loading) {
    return <div className="loading">Loading Dashboard Analytics...</div>;
  }

  return (
    <div>
      <h1 className="page-title"><LayoutDashboard size={28} /> Hospital Analytics Dashboard</h1>

      {/* ---- TOP STATS CARDS ---- */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderTopColor: '#6366f1' }}>
          <div className="stat-value" style={{ color: '#6366f1' }}>{patients.length}</div>
          <div className="stat-label"><Users size={16} style={{marginRight: '4px', verticalAlign: 'middle'}}/> Total Patients</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#f59e0b' }}>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{appointments.length}</div>
          <div className="stat-label"><Calendar size={16} style={{marginRight: '4px', verticalAlign: 'middle'}}/> Total Appointments</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#10b981' }}>
          <div className="stat-value" style={{ color: '#10b981' }}>₹{paidTotal.toFixed(0)}</div>
          <div className="stat-label"><Banknote size={16} style={{marginRight: '4px', verticalAlign: 'middle'}}/> Revenue Collected</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#ef4444' }}>
          <div className="stat-value" style={{ color: '#ef4444' }}>₹{pendingTotal.toFixed(0)}</div>
          <div className="stat-label"><TrendingUp size={16} style={{marginRight: '4px', verticalAlign: 'middle'}}/> Pending Payments</div>
        </div>
      </div>

      {/* ---- CHARTS AREA ---- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
        
        {/* Appointments Trend Line Chart */}
        <div className="card">
          <div className="card-title">Appointments (Last 7 Days)</div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={appointmentTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis dataKey="date" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis allowDecimals={false} tick={{fill: 'var(--text-secondary)'}} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="appointments" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Demographics Pie Chart */}
        <div className="card">
          <div className="card-title">Patient Demographics</div>
          <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {genderData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No patient data available</p>
            )}
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="card">
          <div className="card-title">Revenue Overview</div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis dataKey="name" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis tick={{fill: 'var(--text-secondary)'}} />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Collected' ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
