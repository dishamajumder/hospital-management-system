package com.hospital.service;

import com.hospital.model.Doctor;
import com.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * DoctorService - Business logic for Doctor operations
 */
@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    /** Get all doctors → SELECT * FROM Doctors */
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    /** Get doctor by ID */
    public Optional<Doctor> getDoctorById(Integer id) {
        return doctorRepository.findById(id);
    }

    /** Get doctors by specialization */
    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    /** Add a new doctor → INSERT INTO Doctors */
    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    /** Delete a doctor */
    public void deleteDoctor(Integer id) {
        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found with ID: " + id);
        }
        doctorRepository.deleteById(id);
    }
}
