package com.hospital;

import com.hospital.model.Role;
import com.hospital.model.User;
import com.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataInitializer to create default users on startup
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", "admin123", Role.ADMIN, "System", "Administrator", "admin@hospital.com", "9999999999");
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
            userRepository.save(admin);
            System.out.println("Default admin user created: username=admin, password=admin123");
        }

        // Create default receptionist
        if (userRepository.findByUsername("reception").isEmpty()) {
            User receptionist = new User("reception", "reception123", Role.RECEPTIONIST, "Reception", "Staff", "reception@hospital.com", "8888888888");
            receptionist.setPassword(passwordEncoder.encode(receptionist.getPassword()));
            userRepository.save(receptionist);
            System.out.println("Default receptionist user created: username=reception, password=reception123");
        }

        // Create default doctor
        if (userRepository.findByUsername("doctor").isEmpty()) {
            User doctor = new User("doctor", "doctor123", Role.DOCTOR, "Dr.", "Smith", "doctor@hospital.com", "7777777777");
            doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
            userRepository.save(doctor);
            System.out.println("Default doctor user created: username=doctor, password=doctor123");
        }

        // Create default billing
        if (userRepository.findByUsername("billing").isEmpty()) {
            User billing = new User("billing", "billing123", Role.BILLING, "Billing", "Staff", "billing@hospital.com", "6666666666");
            billing.setPassword(passwordEncoder.encode(billing.getPassword()));
            userRepository.save(billing);
            System.out.println("Default billing user created: username=billing, password=billing123");
        }
    }
}