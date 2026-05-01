package com.hospital.model;

import jakarta.persistence.*;

/**
 * Patient Entity
 * ---------------------------------
 * Maps to the 'Patients' table in MySQL.
 * @Entity tells JPA this is a database table.
 * @Table(name="Patients") maps to exact table name.
 */
@Entity
@Table(name = "patients")
public class Patient {

    // PRIMARY KEY - auto incremented by MySQL
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Integer patientId;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    // Date of Birth stored as String (format: YYYY-MM-DD)
    @Column(name = "dob", nullable = false)
    private String dob;

    // ENUM in MySQL: 'Male', 'Female', 'Other'
    @Column(name = "gender", nullable = false)
    private String gender;

    @Column(name = "phone", nullable = false, unique = true, length = 15)
    private String phone;

    // Nullable field (patient may not provide address)
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    public Patient() {
    }

    public Patient(Integer patientId, String firstName, String lastName, String dob, String gender, String phone, String address) {
        this.patientId = patientId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.phone = phone;
        this.address = address;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
