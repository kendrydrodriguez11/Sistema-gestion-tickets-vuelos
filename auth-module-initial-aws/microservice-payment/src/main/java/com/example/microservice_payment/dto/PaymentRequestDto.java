package com.example.microservice_payment.dto;

import com.example.microservice_payment.model.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {

    @NotNull(message = "Booking ID is required")
    private UUID bookingId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String currency; // Default USD

    @NotNull(message = "Payment method is required")
    private PaymentMethod method;

    private String returnUrl; // Para redirección después de PayPal
    private String cancelUrl; // Para cancelación en PayPal
}