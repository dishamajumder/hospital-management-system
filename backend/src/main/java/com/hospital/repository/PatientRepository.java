package com.hospital.repository;

import com.hospital.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * PatientRepository
 * ---------------------------------
 * Spring Data JPA automatically provides:
 *   - save(patient)        → INSERT / UPDATE
 *   - findAll()            → SELECT * FROM Patients
 *   - findById(id)         → SELECT WHERE patient_id = ?
 *   - deleteById(id)       → DELETE WHERE patient_id = ?
 * No SQL needed! JPA handles it all.
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    // Custom query: find patient by phone number
    Patient findByPhone(String phone);
}
