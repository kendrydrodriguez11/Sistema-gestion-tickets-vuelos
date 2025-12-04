package com.example.microservice_payment.model;

public enum PaymentStatus {
    PENDING,      // Pago iniciado
    PROCESSING,   // En proceso con PayPal
    COMPLETED,    // Pago completado
    FAILED,       // Pago fallido
    CANCELLED,    // Pago cancelado
    REFUNDED      // Pago reembolsado
}