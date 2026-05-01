package com.hospital.repository;

import com.hospital.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * AppointmentRepository - CRUD + custom queries for Appointments
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    // Find all appointments for a specific patient
    List<Appointment> findByPatientId(Integer patientId);

    // Find all appointments for a specific doctor
    List<Appointment> findByDoctorId(Integer doctorId);

    // Find appointments by status (e.g., 'Scheduled', 'Completed')
    List<Appointment> findByStatus(String status);
}
