package com.example.microservice_pricing.repository;

import com.example.microservice_pricing.model.PriceHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface PriceHistoryRepository extends JpaRepository<PriceHistoryEntity, UUID> {

    List<PriceHistoryEntity> findByFlightIdOrderByCreatedAtDesc(UUID flightId);

    @Query("SELECT p FROM PriceHistoryEntity p WHERE p.flightId = :flightId " +
            "AND p.createdAt >= :startDate ORDER BY p.createdAt DESC")
    List<PriceHistoryEntity> findRecentPrices(
            @Param("flightId") UUID flightId,
            @Param("startDate") LocalDateTime startDate
    );
}