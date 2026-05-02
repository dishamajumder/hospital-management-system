package com.hospital.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Appointment Entity
 * ---------------------------------
 * Maps to the 'Appointments' table in MySQL.
 * Links Patients and Doctors via foreign keys.
 */
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Integer appointmentId;

    // Foreign Key → Patients table
    // We store just the ID (not the full Patient object) to keep it simple
    @Column(name = "patient_id", nullable = false)
    private Integer patientId;

    // Foreign Key → Doctors table (nullable: doctor may be unassigned)
    @Column(name = "doctor_id")
    private Integer doctorId;

    // Stored in MySQL as DATETIME
    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    // ENUM in MySQL: 'Scheduled', 'Completed', 'Cancelled'
    // Default value is 'Scheduled'
    @Column(name = "status")
    private String status = "Scheduled";

    public Appointment() {
    }

    public Appointment(Integer appointmentId, Integer patientId, Integer doctorId, LocalDateTime appointmentDate, String status) {
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
        this.status = status;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
