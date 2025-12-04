package com.example.microservice_change.model;

/**
 * Estados del ciclo de vida de una solicitud de vuelto.
 */
public enum ChangeRequestStatus {
    PENDING,      // Solicitud creada, calculando denominaciones
    RESERVED,     // Denominaciones reservadas, esperando confirmación física
    COMPLETED,    // Vuelto dispensado exitosamente
    FAILED,       // No se pudo completar (falta de denominaciones, error)
    CANCELLED     // Cancelada por el usuario/sistema
}