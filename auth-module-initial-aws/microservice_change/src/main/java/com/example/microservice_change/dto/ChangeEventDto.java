package com.example.microservice_change.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO para eventos de vuelto publicados en RabbitMQ.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeEventDto {

    public enum EventType {
        CHANGE_RESERVED,
        CHANGE_DISPENSED,
        CHANGE_FAILED,
        CHANGE_CANCELLED
    }

    private EventType eventType;
    private UUID requestId;
    private UUID transactionId;
    private BigDecimal changeAmount;
    private List<DenominationDetailDto> denominations;
    private String failureReason;
    private LocalDateTime timestamp;
}