package com.example.microservice_payment.service;

import com.example.microservice_payment.dto.PaymentRequestDto;
import com.example.microservice_payment.dto.PaymentResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PaymentService {
    PaymentResponseDto initiatePayment(PaymentRequestDto dto, UUID userId);
    PaymentResponseDto capturePayment(String paypalOrderId);
    PaymentResponseDto getPayment(UUID paymentId);
    PaymentResponseDto getPaymentByBooking(UUID bookingId);
    Page<PaymentResponseDto> getUserPayments(UUID userId, Pageable pageable);
    void cancelPayment(UUID paymentId);
}