package com.example.microservice_payment.service;

import com.example.microservice_payment.dto.PayPalOrderDto;
import com.example.microservice_payment.dto.PaymentEventDto;
import com.example.microservice_payment.dto.PaymentRequestDto;
import com.example.microservice_payment.dto.PaymentResponseDto;
import com.example.microservice_payment.model.PaymentEntity;
import com.example.microservice_payment.model.PaymentMethod;
import com.example.microservice_payment.model.PaymentStatus;
import com.example.microservice_payment.repository.PaymentRepository;
import com.paypal.orders.Order;
import com.paypal.orders.Payer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PayPalService payPalService;
    private final RabbitTemplate rabbitTemplate;

    private static final String PAYMENT_EXCHANGE = "payment.exchange";
    private static final String PAYMENT_ROUTING_KEY = "payment.events";

    @Override
    @Transactional
    public PaymentResponseDto initiatePayment(PaymentRequestDto dto, UUID userId) {
        log.info("Initiating payment for booking: {}", dto.getBookingId());

        // Verificar idempotencia
        PaymentEntity existingPayment = paymentRepository
                .findByBookingId(dto.getBookingId())
                .orElse(null);


        if (existingPayment != null) {
            log.info("Payment already exists for booking: {}", dto.getBookingId());
            return mapToDto(existingPayment);
        }

        // Crear entidad de pago
        PaymentEntity payment = PaymentEntity.builder()
                .bookingId(dto.getBookingId())
                .amount(dto.getAmount())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : "USD")
                .status(PaymentStatus.PENDING)
                .method(dto.getMethod())
                .userId(userId)
                .build();

        payment = paymentRepository.save(payment);

        // Si es PayPal, crear orden
        if (dto.getMethod() == PaymentMethod.PAYPAL) {
            try {
                PayPalOrderDto paypalOrder = payPalService.createOrder(
                        dto.getAmount(),
                        payment.getCurrency(),
                        dto.getReturnUrl(),
                        dto.getCancelUrl()
                );

                payment.setPaypalOrderId(paypalOrder.getId());
                payment.setStatus(PaymentStatus.PROCESSING);
                payment = paymentRepository.save(payment);

                publishEvent(payment, PaymentEventDto.EventType.PAYMENT_INITIATED);

                PaymentResponseDto response = mapToDto(payment);
                response.setApprovalUrl(paypalOrder.getApprovalUrl());
                return response;

            } catch (Exception e) {
                log.error("Error creating PayPal order: {}", e.getMessage());
                payment.markAsFailed("Failed to create PayPal order: " + e.getMessage());
                paymentRepository.save(payment);
                publishEvent(payment, PaymentEventDto.EventType.PAYMENT_FAILED);
                throw new RuntimeException("Failed to initiate payment", e);
            }
        }

        return mapToDto(payment);
    }

    @Override
    @Transactional
    public PaymentResponseDto capturePayment(String paypalOrderId) {
        log.info("Capturing payment for PayPal order: {}", paypalOrderId);

        PaymentEntity payment = paymentRepository.findByPaypalOrderId(paypalOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for PayPal order"));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            log.warn("Payment already completed for order: {}", paypalOrderId);
            return mapToDto(payment);
        }

        try {
            Order order = payPalService.captureOrder(paypalOrderId);

            if ("COMPLETED".equals(order.status())) {
                Payer payer = order.payer();

                String payerEmail = (payer != null && payer.email() != null)
                        ? payer.email()
                        : "unknown";

                String payerId = (payer != null && payer.payerId() != null)
                        ? payer.payerId()
                        : null;


                // Obtener capture ID
                String captureId = order.purchaseUnits().get(0)
                        .payments()
                        .captures()
                        .get(0)
                        .id();

                payment.markAsCompleted(captureId, payerEmail, payerId);
                paymentRepository.save(payment);

                publishEvent(payment, PaymentEventDto.EventType.PAYMENT_COMPLETED);

                log.info("Payment completed successfully: {}", payment.getId());
            } else {
                payment.markAsFailed("PayPal order status: " + order.status());
                paymentRepository.save(payment);
                publishEvent(payment, PaymentEventDto.EventType.PAYMENT_FAILED);
            }

        } catch (Exception e) {
            log.error("Error capturing PayPal payment: {}", e.getMessage());
            payment.markAsFailed("Capture failed: " + e.getMessage());
            paymentRepository.save(payment);
            publishEvent(payment, PaymentEventDto.EventType.PAYMENT_FAILED);
            throw new RuntimeException("Failed to capture payment", e);
        }

        return mapToDto(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDto getPayment(UUID paymentId) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapToDto(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDto getPaymentByBooking(UUID bookingId) {
        PaymentEntity payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking"));
        return mapToDto(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponseDto> getUserPayments(UUID userId, Pageable pageable) {
        return paymentRepository.findByUserId(userId, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional
    public void cancelPayment(UUID paymentId) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel completed payment");
        }

        payment.markAsCancelled();
        paymentRepository.save(payment);

        publishEvent(payment, PaymentEventDto.EventType.PAYMENT_CANCELLED);

        log.info("Payment cancelled: {}", paymentId);
    }

    private void publishEvent(PaymentEntity payment, PaymentEventDto.EventType eventType) {
        PaymentEventDto event = PaymentEventDto.builder()
                .eventType(eventType)
                .paymentId(payment.getId())
                .bookingId(payment.getBookingId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .paypalOrderId(payment.getPaypalOrderId())
                .failureReason(payment.getFailureReason())
                .timestamp(LocalDateTime.now())
                .build();

        try {
            // Convertir a Map para compatibilidad con el listener
            Map<String, Object> eventMap = new HashMap<>();
            eventMap.put("eventType", event.getEventType().toString());
            eventMap.put("paymentId", event.getPaymentId().toString());
            eventMap.put("bookingId", event.getBookingId().toString());
            eventMap.put("amount", event.getAmount());
            eventMap.put("currency", event.getCurrency());
            eventMap.put("status", event.getStatus().toString());
            eventMap.put("paypalOrderId", event.getPaypalOrderId());
            eventMap.put("timestamp", event.getTimestamp().toString());

            rabbitTemplate.convertAndSend(PAYMENT_EXCHANGE, PAYMENT_ROUTING_KEY, eventMap);
            log.info("Published payment event: {} for payment: {}", eventType, payment.getId());
        } catch (Exception e) {
            log.error("Failed to publish payment event: {}", e.getMessage());
        }
    }


    private PaymentResponseDto mapToDto(PaymentEntity entity) {
        return PaymentResponseDto.builder()
                .id(entity.getId())
                .bookingId(entity.getBookingId())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .status(entity.getStatus())
                .method(entity.getMethod())
                .paypalOrderId(entity.getPaypalOrderId())
                .failureReason(entity.getFailureReason())
                .createdAt(entity.getCreatedAt())
                .completedAt(entity.getCompletedAt())
                .build();
    }
}