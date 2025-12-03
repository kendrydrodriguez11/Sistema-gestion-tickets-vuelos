package com.example.microservice_inventory.service;


import com.example.microservice_inventory.dto.MovementCreateDto;
import com.example.microservice_inventory.dto.MovementResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

public interface MovementService {
    MovementResponseDto createMovement(MovementCreateDto dto, UUID userId);
    Page<MovementResponseDto> getMovementsByProduct(UUID productId, Pageable pageable);
    Page<MovementResponseDto> getAllMovements(Pageable pageable);
}