package com.hospital.controller;

import com.hospital.model.MedicalRecord;
import com.hospital.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * MedicalRecordController
 * ---------------------------------
 * API Endpoints:
 *   GET  /api/medical-records                        → All records
 *   GET  /api/medical-records/appointment/{id}       → By appointment ID
 *   POST /api/medical-records                        → Add record
 */
@RestController
@RequestMapping("/api/medical-records")

public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @GetMapping
    public ResponseEntity<List<MedicalRecord>> getAllRecords() {
        return ResponseEntity.ok(medicalRecordService.getAllRecords());
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getByAppointment(@PathVariable Integer appointmentId) {
        try {
            MedicalRecord record = medicalRecordService.getRecordByAppointment(appointmentId);
            return ResponseEntity.ok(record);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/medical-records
     * Body: { "appointmentId": 1, "diagnosis": "Hypertension", "prescription": "Amlodipine 5mg", "notes": "..." }
     */
    @PostMapping
    public ResponseEntity<?> addMedicalRecord(@RequestBody MedicalRecord record) {
        try {
            MedicalRecord saved = medicalRecordService.addMedicalRecord(record);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
