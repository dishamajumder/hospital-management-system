package com.hospital.controller;

import com.hospital.model.Appointment;
import com.hospital.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * AppointmentController
 * ---------------------------------
 * API Endpoints:
 *   GET  /api/appointments               → All appointments
 *   GET  /api/appointments/{id}          → By ID
 *   GET  /api/appointments/patient/{id}  → By patient ID
 *   GET  /api/appointments/status/{s}    → By status
 *   POST /api/appointments               → Book new appointment
 *   PUT  /api/appointments/{id}/status   → Update status
 */
@RestController
@RequestMapping("/api/appointments")

public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Integer id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getByPatient(@PathVariable Integer patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }

    /**
     * POST /api/appointments
     * Body: { "patientId": 1, "doctorId": 2, "appointmentDate": "2024-06-15 10:00:00", "status": "Scheduled" }
     */
    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment booked = appointmentService.bookAppointment(appointment);
            return ResponseEntity.status(HttpStatus.CREATED).body(booked);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * PUT /api/appointments/{id}/status
     * Body: { "status": "Completed" }
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            Appointment updated = appointmentService.updateAppointmentStatus(id, body.get("status"));
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
