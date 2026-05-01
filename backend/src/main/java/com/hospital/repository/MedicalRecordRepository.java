package com.hospital.repository;

import com.hospital.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * MedicalRecordRepository
 */
@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {
    // Each appointment has at most ONE medical record (appointment_id is UNIQUE)
    Optional<MedicalRecord> findByAppointmentId(Integer appointmentId);
}
