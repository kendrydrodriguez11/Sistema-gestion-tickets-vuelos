package com.example.microservice_notifications.model;

/**
 * Tipos de notificación actualizados para el sistema de vuelto.
 */
public enum NotificationType {
    CHANGE_RESERVED,
    CHANGE_DISPENSED,
    CHANGE_FAILED,

    LOW_DENOMINATION_STOCK,
    OUT_OF_DENOMINATION,

    SYSTEM_ALERT,
    OPERATIONAL_ERROR
}