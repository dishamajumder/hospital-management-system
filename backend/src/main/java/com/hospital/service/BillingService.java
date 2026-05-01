package com.hospital.service;

import com.hospital.model.Billing;
import com.hospital.repository.BillingRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * BillingService - Business logic for billing operations
 */
@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private PatientRepository patientRepository;

    /** Get all bills */
    public List<Billing> getAllBills() {
        return billingRepository.findAll();
    }

    /** Get bills for a specific patient */
    public List<Billing> getBillsByPatient(Integer patientId) {
        return billingRepository.findByPatientId(patientId);
    }

    /** Get pending bills */
    public List<Billing> getPendingBills() {
        return billingRepository.findByPaymentStatus("Pending");
    }

    /**
     * Generate a new bill for a patient
     * Business rules:
     *   1. Patient must exist
     *   2. Amount must be non-negative (also enforced by DB trigger)
     *   3. Default bill_date is today
     */
    public Billing generateBill(Billing billing) {
        // Validate patient exists
        if (!patientRepository.existsById(billing.getPatientId())) {
            throw new RuntimeException("Patient not found with ID: " + billing.getPatientId());
        }

        // Business rule: amount cannot be negative
        if (billing.getAmount() == null || billing.getAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Billing amount cannot be negative!");
        }

        // Set default values if not provided
        if (billing.getPaymentStatus() == null || billing.getPaymentStatus().isEmpty()) {
            billing.setPaymentStatus("Pending");
        }
        if (billing.getBillDate() == null || billing.getBillDate().isEmpty()) {
            billing.setBillDate(LocalDate.now().toString()); // Today's date
        }

        return billingRepository.save(billing);
    }

    /**
     * Mark a bill as Paid
     */
    public Billing markAsPaid(Integer billId) {
        Billing bill = billingRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found with ID: " + billId));
        bill.setPaymentStatus("Paid");
        return billingRepository.save(bill);
    }
}
