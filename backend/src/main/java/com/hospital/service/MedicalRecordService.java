package com.hospital.service;

import com.hospital.model.MedicalRecord;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * MedicalRecordService - Business logic for medical records
 */
@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    /** Get all medical records */
    public List<MedicalRecord> getAllRecords() {
        return medicalRecordRepository.findAll();
    }

    /** Get medical record by appointment ID */
    public MedicalRecord getRecordByAppointment(Integer appointmentId) {
        return medicalRecordRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("No medical record found for appointment ID: " + appointmentId));
    }

    /**
     * Add a new medical record
     * Business rule: The appointment must exist before adding a record
     */
    public MedicalRecord addMedicalRecord(MedicalRecord record) {
        // Validate that the appointment exists
        if (!appointmentRepository.existsById(record.getAppointmentId())) {
            throw new RuntimeException("Appointment not found with ID: " + record.getAppointmentId());
        }

        // Check if a record already exists for this appointment (UNIQUE constraint)
        if (medicalRecordRepository.findByAppointmentId(record.getAppointmentId()).isPresent()) {
            throw new RuntimeException("Medical record already exists for appointment ID: " + record.getAppointmentId());
        }

        return medicalRecordRepository.save(record);
    }
}
