package com.hospital.service;

import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * PatientService
 * ---------------------------------
 * Contains business logic for Patient operations.
 * The Controller calls Service, Service calls Repository.
 *
 * Flow: Controller → Service → Repository → MySQL DB
 *
 * @Service marks this class as a Spring service component.
 */
@Service
public class PatientService {

    // @Autowired injects PatientRepository automatically (Dependency Injection)
    @Autowired
    private PatientRepository patientRepository;

    /**
     * Get all patients from the database
     * SQL equivalent: SELECT * FROM Patients;
     */
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    /**
     * Get a single patient by their ID
     * SQL equivalent: SELECT * FROM Patients WHERE patient_id = ?;
     */
    public Optional<Patient> getPatientById(Integer id) {
        return patientRepository.findById(id);
    }

    /**
     * Add a new patient to the database
     * SQL equivalent: INSERT INTO Patients (...) VALUES (...);
     *
     * @param patient - Patient object from the request body (JSON)
     * @return saved Patient with auto-generated patient_id
     */
    public Patient addPatient(Patient patient) {
        // Business rule: check if phone already exists
        Patient existing = patientRepository.findByPhone(patient.getPhone());
        if (existing != null) {
            throw new RuntimeException("A patient with this phone number already exists!");
        }
        return patientRepository.save(patient);
    }

    /**
     * Update an existing patient's details
     */
    public Patient updatePatient(Integer id, Patient updatedPatient) {
        // First, find the existing patient
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + id));

        // Update only the fields provided
        patient.setFirstName(updatedPatient.getFirstName());
        patient.setLastName(updatedPatient.getLastName());
        patient.setDob(updatedPatient.getDob());
        patient.setGender(updatedPatient.getGender());
        patient.setPhone(updatedPatient.getPhone());
        patient.setAddress(updatedPatient.getAddress());

        return patientRepository.save(patient);
    }

    /**
     * Delete a patient by ID
     * SQL equivalent: DELETE FROM Patients WHERE patient_id = ?;
     * (CASCADE will also delete their Appointments and Billing)
     */
    public void deletePatient(Integer id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found with ID: " + id);
        }
        patientRepository.deleteById(id);
    }
}
