package com.hospital.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SmsNotificationService {

    /**
     * Mocks sending an SMS message by printing a beautifully formatted block to the console.
     * In a production environment, this would call the Twilio SDK or a similar SMS Gateway API.
     * 
     * @param phoneNumber The patient's phone number
     * @param message The text message to send
     */
    public void sendSms(String phoneNumber, String message) {
        System.out.println("==================================================");
        System.out.println("📱 [MOCK SMS GATEWAY] - Outbound Message");
        System.out.println("--------------------------------------------------");
        System.out.println("Timestamp : " + LocalDateTime.now());
        System.out.println("To        : " + (phoneNumber != null ? phoneNumber : "+91-XXXXXXXXXX (No phone provided)"));
        System.out.println("From      : Disha Hospital");
        System.out.println("Message   : " + message);
        System.out.println("Status    : DELIVERED (Mock)");
        System.out.println("==================================================");
    }
}
