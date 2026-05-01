package com.hospital.model;

import jakarta.persistence.*;

/**
 * MedicalRecord Entity
 * ---------------------------------
 * Maps to the 'Medical_Records' table in MySQL.
 * Each record is tied to one appointment (one-to-one via appointment_id UNIQUE).
 */
@Entity
@Table(name = "Medical_Records")
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Integer recordId;

    // Foreign Key → Appointments table (UNIQUE: one record per appointment)
    @Column(name = "appointment_id", nullable = false, unique = true)
    private Integer appointmentId;

    @Column(name = "diagnosis", nullable = false, columnDefinition = "TEXT")
    private String diagnosis;

    // Nullable: prescription may not always be given
    @Column(name = "prescription", columnDefinition = "TEXT")
    private String prescription;

    // Nullable: additional doctor notes
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public MedicalRecord() {
    }

    public MedicalRecord(Integer recordId, Integer appointmentId, String diagnosis, String prescription, String notes) {
        this.recordId = recordId;
        this.appointmentId = appointmentId;
        this.diagnosis = diagnosis;
        this.prescription = prescription;
        this.notes = notes;
    }

    public Integer getRecordId() {
        return recordId;
    }

    public void setRecordId(Integer recordId) {
        this.recordId = recordId;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getPrescription() {
        return prescription;
    }

    public void setPrescription(String prescription) {
        this.prescription = prescription;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
