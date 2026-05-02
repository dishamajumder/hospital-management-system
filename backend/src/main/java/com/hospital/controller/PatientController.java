package com.hospital.controller;

import com.hospital.model.Patient;
import com.hospital.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * PatientController
 * ---------------------------------
 * Exposes REST API endpoints for Patient operations.
 *
 * @RestController = @Controller + @ResponseBody (returns JSON automatically)
 * @RequestMapping("/api/patients") → base URL for all endpoints here
 * @CrossOrigin → allows React (port 3000) to call these APIs
 *
 * API Endpoints:
 *   GET    /api/patients           → Get all patients
 *   GET    /api/patients/{id}      → Get patient by ID
 *   POST   /api/patients           → Add a new patient
 *   PUT    /api/patients/{id}      → Update patient
 *   DELETE /api/patients/{id}      → Delete patient
 */
@RestController
@RequestMapping("/api/patients")

public class PatientController {

    @Autowired
    private PatientService patientService;

    /**
     * GET /api/patients
     * Returns list of all patients as JSON array
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECEPTIONIST') or hasRole('DOCTOR') or hasRole('BILLING')")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients); // 200 OK
    }

    /**
     * GET /api/patients/{id}
     * Returns single patient or 404 if not found
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECEPTIONIST') or hasRole('DOCTOR') or hasRole('BILLING')")
    public ResponseEntity<?> getPatientById(@PathVariable Integer id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok) // 200 OK with patient
                .orElse(ResponseEntity.notFound().build()); // 404 Not Found
    }

    /**
     * POST /api/patients
     * Request Body (JSON):
     * {
     *   "firstName": "Aarav",
     *   "lastName": "Patel",
     *   "dob": "1990-05-15",
     *   "gender": "Male",
     *   "phone": "9876543210",
     *   "address": "Mumbai"
     * }
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECEPTIONIST')")
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        try {
            Patient saved = patientService.addPatient(patient);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved); // 201 Created
        } catch (RuntimeException e) {
            // Return error message if validation fails
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error); // 400 Bad Request
        }
    }

    /**
     * PUT /api/patients/{id}
     * Update existing patient details
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECEPTIONIST')")
    public ResponseEntity<?> updatePatient(@PathVariable Integer id, @RequestBody Patient patient) {
        try {
            Patient updated = patientService.updatePatient(id, patient);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * DELETE /api/patients/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePatient(@PathVariable Integer id) {
        try {
            patientService.deletePatient(id);
            Map<String, String> msg = new HashMap<>();
            msg.put("message", "Patient deleted successfully");
            return ResponseEntity.ok(msg);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
