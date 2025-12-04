package com.example.microservice_booking.model;

public enum BookingStatus {
    PENDING,      // Reserva creada, esperando pago
    CONFIRMED,    // Pago confirmado
    CANCELLED,    // Cancelada por usuario o sistema
    EXPIRED       // Expiró el tiempo de reserva
}