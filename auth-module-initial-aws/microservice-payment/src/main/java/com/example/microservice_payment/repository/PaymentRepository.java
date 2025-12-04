package com.example.microservice_payment.repository;

import com.example.microservice_payment.model.PaymentEntity;
import com.example.microservice_payment.model.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<PaymentEntity, UUID> {

    Optional<PaymentEntity> findByBookingId(UUID bookingId);

    Optional<PaymentEntity> findByPaypalOrderId(String paypalOrderId);

    Page<PaymentEntity> findByStatus(PaymentStatus status, Pageable pageable);

    Page<PaymentEntity> findByUserId(UUID userId, Pageable pageable);
}