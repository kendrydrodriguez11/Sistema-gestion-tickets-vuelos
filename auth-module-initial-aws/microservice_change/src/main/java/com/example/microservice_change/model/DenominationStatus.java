package com.example.microservice_change.model;

/**
 * Estado del inventario de una denominación.
 */
public enum DenominationStatus {
    ACTIVE,         // Disponible para uso normal
    LOW_STOCK,      // Stock bajo (por debajo del mínimo)
    OUT_OF_STOCK,   // Sin stock
    INACTIVE        // Deshabilitada temporalmente
}