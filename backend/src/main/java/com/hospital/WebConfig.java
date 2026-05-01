package com.hospital;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebConfig - CORS Configuration
 * ---------------------------------
 * Allows the React frontend (running on port 3000) to communicate
 * with the Spring Boot backend (running on port 8080).
 * Without this, the browser will block all API calls!
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")           // Apply to all /api/* endpoints
                .allowedOrigins("http://localhost:3000")  // React dev server
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
