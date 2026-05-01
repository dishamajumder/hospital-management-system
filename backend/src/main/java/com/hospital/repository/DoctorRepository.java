package com.hospital.repository;

import com.hospital.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * DoctorRepository - inherits all standard CRUD operations from JpaRepository
 */
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    // Find doctors by their specialization (e.g., "Cardiologist")
    java.util.List<Doctor> findBySpecialization(String specialization);
}
