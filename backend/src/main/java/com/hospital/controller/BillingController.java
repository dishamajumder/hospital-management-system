package com.hospital.controller;

import com.hospital.model.Billing;
import com.hospital.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * BillingController
 * ---------------------------------
 * API Endpoints:
 *   GET  /api/billing                     → All bills
 *   GET  /api/billing/patient/{id}        → Bills for patient
 *   GET  /api/billing/pending             → Pending bills
 *   POST /api/billing                     → Generate new bill
 *   PUT  /api/billing/{id}/pay            → Mark as Paid
 */
@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "http://localhost:3000")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @GetMapping
    public ResponseEntity<List<Billing>> getAllBills() {
        return ResponseEntity.ok(billingService.getAllBills());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Billing>> getBillsByPatient(@PathVariable Integer patientId) {
        return ResponseEntity.ok(billingService.getBillsByPatient(patientId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Billing>> getPendingBills() {
        return ResponseEntity.ok(billingService.getPendingBills());
    }

    /**
     * POST /api/billing
     * Body: { "patientId": 1, "amount": 1500.00, "paymentStatus": "Pending", "billDate": "2024-06-15" }
     */
    @PostMapping
    public ResponseEntity<?> generateBill(@RequestBody Billing billing) {
        try {
            Billing saved = billingService.generateBill(billing);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * PUT /api/billing/{id}/pay
     * Marks a bill as 'Paid'
     */
    @PutMapping("/{id}/pay")
    public ResponseEntity<?> markAsPaid(@PathVariable Integer id) {
        try {
            Billing updated = billingService.markAsPaid(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
