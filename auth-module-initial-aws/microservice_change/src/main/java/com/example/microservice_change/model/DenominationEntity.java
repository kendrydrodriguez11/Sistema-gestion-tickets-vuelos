package com.example.microservice_change.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad que representa un tipo de billete o moneda en el inventario.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "denominations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"value", "type"})
})
public class DenominationEntity {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal value; // Valor facial (ej: 0.25, 1.00, 5.00, 10.00)

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private DenominationType type; // BILL o COIN

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Integer quantity; // Cantidad disponible

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Integer minQuantity; // Stock mínimo antes de alerta

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DenominationStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = DenominationStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isLowStock() {
        return quantity <= minQuantity;
    }

    public boolean isOutOfStock() {
        return quantity == 0;
    }
}