package com.example.microservice_payment.dto;

import com.example.microservice_payment.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEventDto {

    public enum EventType {
        PAYMENT_INITIATED,
        PAYMENT_COMPLETED,
        PAYMENT_FAILED,
        PAYMENT_CANCELLED,
        PAYMENT_REFUNDED
    }

    private EventType eventType;
    private UUID paymentId;
    private UUID bookingId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String paypalOrderId;
    private String failureReason;
    private LocalDateTime timestamp;
}