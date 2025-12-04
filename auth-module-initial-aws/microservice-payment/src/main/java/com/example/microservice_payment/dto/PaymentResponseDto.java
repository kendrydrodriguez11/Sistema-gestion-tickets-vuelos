package com.example.microservice_payment.dto;

import com.example.microservice_payment.model.PaymentMethod;
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
public class PaymentResponseDto {
    private UUID id;
    private UUID bookingId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private PaymentMethod method;
    private String paypalOrderId;
    private String approvalUrl; // URL para aprobar pago en PayPal
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}