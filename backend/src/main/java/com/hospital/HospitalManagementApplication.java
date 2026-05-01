package com.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * HospitalManagementApplication
 * ---------------------------------
 * Entry point for the Spring Boot application.
 * @SpringBootApplication enables:
 *   - @Configuration (Spring config)
 *   - @EnableAutoConfiguration (auto setup)
 *   - @ComponentScan (scans all classes in this package)
 */
@SpringBootApplication
public class HospitalManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementApplication.class, args);
        System.out.println("✅ Hospital Management System Backend Started!");
        System.out.println("📡 API running at: http://localhost:8080/api");
    }
}
