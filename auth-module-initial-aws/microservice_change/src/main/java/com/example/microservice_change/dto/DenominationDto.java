package com.example.microservice_change.dto;

import com.example.microservice_change.model.DenominationStatus;
import com.example.microservice_change.model.DenominationType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para gestión de denominaciones (CRUD).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DenominationDto {

    private UUID id;

    @NotNull(message = "Value is required")
    private BigDecimal value;

    @NotNull(message = "Type is required")
    private DenominationType type;

    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity must be zero or positive")
    private Integer quantity;

    @NotNull(message = "Min quantity is required")
    @PositiveOrZero(message = "Min quantity must be zero or positive")
    private Integer minQuantity;

    private DenominationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}