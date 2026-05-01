package com.hospital.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Billing Entity
 * ---------------------------------
 * Maps to the 'Billing' table in MySQL.
 * Handles financial records for patients.
 */
@Entity
@Table(name = "Billing")
public class Billing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Integer billId;

    // Foreign Key → Patients table
    @Column(name = "patient_id", nullable = false)
    private Integer patientId;

    // DECIMAL(10,2) → supports amounts like 1500.00
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // ENUM: 'Pending' or 'Paid' — defaults to 'Pending'
    @Column(name = "payment_status")
    private String paymentStatus = "Pending";

    // Date of billing (format: YYYY-MM-DD)
    @Column(name = "bill_date")
    private String billDate;

    public Billing() {
    }

    public Billing(Integer billId, Integer patientId, BigDecimal amount, String paymentStatus, String billDate) {
        this.billId = billId;
        this.patientId = patientId;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.billDate = billDate;
    }

    public Integer getBillId() {
        return billId;
    }

    public void setBillId(Integer billId) {
        this.billId = billId;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getBillDate() {
        return billDate;
    }

    public void setBillDate(String billDate) {
        this.billDate = billDate;
    }
}
