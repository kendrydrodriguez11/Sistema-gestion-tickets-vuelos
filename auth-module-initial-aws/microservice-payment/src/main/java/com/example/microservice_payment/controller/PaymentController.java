package com.example.microservice_payment.controller;

import com.example.microservice_payment.dto.PaymentRequestDto;
import com.example.microservice_payment.dto.PaymentResponseDto;
import com.example.microservice_payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    /**
     *  Ahora acepta Idempotency-Key en headers
     */
    @PostMapping
    public ResponseEntity<PaymentResponseDto> initiatePayment(
            @Valid @RequestBody PaymentRequestDto dto,
            @RequestHeader("X-User-Id") UUID userId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {

        log.info("Payment initiation request for booking: {} with idempotency key: {}",
                dto.getBookingId(), idempotencyKey);

        // Si hay idempotency key, validar formato UUID
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            try {
                UUID.fromString(idempotencyKey);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        return ResponseEntity.ok(paymentService.initiatePayment(dto, userId));
    }

    @PostMapping("/capture/{paypalOrderId}")
    public ResponseEntity<PaymentResponseDto> capturePayment(
            @PathVariable String paypalOrderId) {
        log.info("Capturing payment for PayPal order: {}", paypalOrderId);
        return ResponseEntity.ok(paymentService.capturePayment(paypalOrderId));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDto> getPayment(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.getPayment(paymentId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponseDto> getPaymentByBooking(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBooking(bookingId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PaymentResponseDto>> getUserPayments(
            @PathVariable UUID userId,
            Pageable pageable) {
        return ResponseEntity.ok(paymentService.getUserPayments(userId, pageable));
    }

    @PutMapping("/{paymentId}/cancel")
    public ResponseEntity<Void> cancelPayment(@PathVariable UUID paymentId) {
        paymentService.cancelPayment(paymentId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para refunds
     */
    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<PaymentResponseDto> refundPayment(
            @PathVariable UUID paymentId,
            @RequestParam(required = false) String reason) {
        log.info("Refund request for payment: {} - Reason: {}", paymentId, reason);
        return ResponseEntity.ok().build();
    }
}