package com.hospital.service;

import com.hospital.model.Appointment;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * AppointmentService - Business logic for booking appointments
 */
@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    /** Get all appointments */
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    /** Get appointments for a specific patient */
    public List<Appointment> getAppointmentsByPatient(Integer patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    /** Get appointments by status */
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    /**
     * Book a new appointment
     * Business rules:
     *   1. Patient must exist
     *   2. Doctor must exist (if provided)
     *   3. Status defaults to 'Scheduled'
     */
    public Appointment bookAppointment(Appointment appointment) {
        // Validate patient exists
        if (!patientRepository.existsById(appointment.getPatientId())) {
            throw new RuntimeException("Patient not found with ID: " + appointment.getPatientId());
        }

        // Validate doctor exists (if doctor_id is provided)
        if (appointment.getDoctorId() != null && !doctorRepository.existsById(appointment.getDoctorId())) {
            throw new RuntimeException("Doctor not found with ID: " + appointment.getDoctorId());
        }

        // Default status to 'Scheduled' if not provided
        if (appointment.getStatus() == null || appointment.getStatus().isEmpty()) {
            appointment.setStatus("Scheduled");
        }

        return appointmentRepository.save(appointment);
    }

    /** Update appointment status (e.g., mark as Completed) */
    public Appointment updateAppointmentStatus(Integer id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    /** Get appointment by ID */
    public Optional<Appointment> getAppointmentById(Integer id) {
        return appointmentRepository.findById(id);
    }
}
