package com.example.microservice_change.repository;

import com.example.microservice_change.model.ChangeTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChangeTransactionRepository extends JpaRepository<ChangeTransactionEntity, UUID> {

    List<ChangeTransactionEntity> findByChangeRequestId(UUID changeRequestId);

    List<ChangeTransactionEntity> findByDenominationId(UUID denominationId);
}