package com.example.microservice_change.repository;

import com.example.microservice_change.model.DenominationEntity;
import com.example.microservice_change.model.DenominationStatus;
import com.example.microservice_change.model.DenominationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DenominationRepository extends JpaRepository<DenominationEntity, UUID> {

    Optional<DenominationEntity> findByValue(BigDecimal value);

    List<DenominationEntity> findByType(DenominationType type);

    List<DenominationEntity> findByStatus(DenominationStatus status);

    @Query("SELECT d FROM DenominationEntity d WHERE d.status = 'ACTIVE' ORDER BY d.value DESC")
    List<DenominationEntity> findActiveOrderedByValue();

    @Query("SELECT d FROM DenominationEntity d WHERE d.quantity <= d.minQuantity AND d.status = 'ACTIVE'")
    List<DenominationEntity> findLowStockDenominations();
}