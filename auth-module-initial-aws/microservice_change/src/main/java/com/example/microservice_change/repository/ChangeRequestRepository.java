package com.example.microservice_change.repository;

import com.example.microservice_change.model.ChangeRequestEntity;
import com.example.microservice_change.model.ChangeRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface ChangeRequestRepository extends JpaRepository<ChangeRequestEntity, UUID> {

    Optional<ChangeRequestEntity> findByTransactionId(UUID transactionId);

    Page<ChangeRequestEntity> findByStatus(ChangeRequestStatus status, Pageable pageable);

    @Query("SELECT cr FROM ChangeRequestEntity cr WHERE cr.status = 'RESERVED' AND cr.reservedAt < :timeout")
    Page<ChangeRequestEntity> findExpiredReservations(LocalDateTime timeout, Pageable pageable);
}