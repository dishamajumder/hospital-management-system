package com.hospital.repository;

import com.hospital.model.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * BillingRepository
 */
@Repository
public interface BillingRepository extends JpaRepository<Billing, Integer> {
    // Find all bills for a specific patient
    List<Billing> findByPatientId(Integer patientId);

    // Find pending bills
    List<Billing> findByPaymentStatus(String paymentStatus);
}
