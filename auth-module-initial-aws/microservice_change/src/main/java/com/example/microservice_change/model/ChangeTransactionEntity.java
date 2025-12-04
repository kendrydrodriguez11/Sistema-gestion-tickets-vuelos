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
 * Detalle de denominaciones utilizadas en una solicitud de vuelto.
 * Relación: ChangeRequest -> [ChangeTransaction] -> Denomination
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "change_transactions")
public class ChangeTransactionEntity {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "change_request_id", nullable = false)
    private ChangeRequestEntity changeRequest;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "denomination_id", nullable = false)
    private DenominationEntity denomination;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantityDispensed; // Cantidad de esta denominación entregada

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal; // value * quantityDispensed

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (subtotal == null && denomination != null) {
            subtotal = denomination.getValue().multiply(BigDecimal.valueOf(quantityDispensed));
        }
    }
}