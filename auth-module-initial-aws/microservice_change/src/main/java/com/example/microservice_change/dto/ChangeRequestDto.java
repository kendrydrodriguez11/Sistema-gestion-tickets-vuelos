package com.example.microservice_change.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO de entrada para solicitar cálculo y reserva de vuelto.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeRequestDto {

    @NotNull(message = "Transaction ID is required")
    private UUID transactionId; // ID único de la venta (idempotencia)

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    private BigDecimal totalAmount;

    @NotNull(message = "Amount paid is required")
    @Positive(message = "Amount paid must be positive")
    private BigDecimal amountPaid;

    private String paymentMethod; // Opcional: "cash", "card"
}