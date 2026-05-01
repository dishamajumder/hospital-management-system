// services/api.js
// ============================================================
// CENTRALIZED API SERVICE
// All Axios calls to the Spring Boot backend go through here.
// Base URL: http://localhost:8080/api
// ============================================================

import axios from 'axios';

// Create Axios instance with base URL
// This means every call automatically prepends http://127.0.0.1:8080/api
const API = axios.create({
  baseURL: 'http://127.0.0.1:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---- AUTH APIs ----
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  logout: () => API.post('/auth/logout'),
};

// ---- PATIENT APIs ----
export const patientAPI = {
  // GET /api/patients → fetch all patients
  getAll: () => API.get('/patients'),

  // GET /api/patients/:id → fetch one patient
  getById: (id) => API.get(`/patients/${id}`),

  // POST /api/patients → add new patient
  add: (patientData) => API.post('/patients', patientData),

  // PUT /api/patients/:id → update patient
  update: (id, patientData) => API.put(`/patients/${id}`, patientData),

  // DELETE /api/patients/:id → delete patient
  delete: (id) => API.delete(`/patients/${id}`),
};

// ---- DOCTOR APIs ----
export const doctorAPI = {
  getAll: () => API.get('/doctors'),
  getById: (id) => API.get(`/doctors/${id}`),
  add: (doctorData) => API.post('/doctors', doctorData),
  delete: (id) => API.delete(`/doctors/${id}`),
};

// ---- APPOINTMENT APIs ----
export const appointmentAPI = {
  getAll: () => API.get('/appointments'),
  getByPatient: (patientId) => API.get(`/appointments/patient/${patientId}`),
  book: (appointmentData) => API.post('/appointments', appointmentData),
  updateStatus: (id, status) => API.put(`/appointments/${id}/status`, { status }),
};

// ---- MEDICAL RECORD APIs ----
export const medicalRecordAPI = {
  getAll: () => API.get('/medical-records'),
  add: (recordData) => API.post('/medical-records', recordData),
};

// ---- BILLING APIs ----
export const billingAPI = {
  getAll: () => API.get('/billing'),
  getByPatient: (patientId) => API.get(`/billing/patient/${patientId}`),
  getPending: () => API.get('/billing/pending'),
  generate: (billingData) => API.post('/billing', billingData),
  markPaid: (id) => API.put(`/billing/${id}/pay`),
};

export default API;
