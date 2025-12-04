package com.example.microservice_change.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
 * Entidad principal de una solicitud de vuelto.
 * Representa la cabecera de una transacción de cambio.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "change_requests")
public class ChangeRequestEntity {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @NotNull
    @Column(unique = true, nullable = false)
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID transactionId; // ID de la transacción de venta (idempotencia)

    @NotNull
    @Positive
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount; // Monto total de la compra

    @NotNull
    @Positive
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid; // Monto pagado por el cliente

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal changeAmount; // Vuelto a entregar

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChangeRequestStatus status;

    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID userId; // Usuario que procesó la transacción

    @Column(length = 50)
    private String paymentMethod; // Método de pago (cash, card, etc.)

    @Column(columnDefinition = "TEXT")
    private String failureReason; // Razón de falla si status=FAILED

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "reserved_at")
    private LocalDateTime reservedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = ChangeRequestStatus.PENDING;
        }
    }

    public void markAsReserved() {
        this.status = ChangeRequestStatus.RESERVED;
        this.reservedAt = LocalDateTime.now();
    }

    public void markAsCompleted() {
        this.status = ChangeRequestStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    public void markAsFailed(String reason) {
        this.status = ChangeRequestStatus.FAILED;
        this.failureReason = reason;
        this.completedAt = LocalDateTime.now();
    }

    public void markAsCancelled(String reason) {
        this.status = ChangeRequestStatus.CANCELLED;
        this.failureReason = reason;
        this.completedAt = LocalDateTime.now();
    }
}