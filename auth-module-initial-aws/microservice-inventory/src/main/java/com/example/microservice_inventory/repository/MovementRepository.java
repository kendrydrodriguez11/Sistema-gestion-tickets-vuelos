package com.example.microservice_inventory.repository;

import com.example.microservice_inventory.model.MovementEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface MovementRepository extends JpaRepository<MovementEntity, UUID> {
    Page<MovementEntity> findByProductId(UUID productId, Pageable pageable);
}