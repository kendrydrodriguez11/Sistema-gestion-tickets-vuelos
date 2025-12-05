package com.example.microservice_notifications.model;

public enum NotificationType {
    // Reservas
    BOOKING_CREATED,
    BOOKING_CONFIRMED,
    BOOKING_CANCELLED,
    BOOKING_EXPIRED,

    // Pagos
    PAYMENT_INITIATED,
    PAYMENT_COMPLETED,
    PAYMENT_FAILED,

    // Stock/Asientos
    LOW_SEAT_AVAILABILITY,
    FLIGHT_FULL,
    LOW_STOCK,

    // Sistema
    SYSTEM_ALERT,
    PRICE_CHANGE
}