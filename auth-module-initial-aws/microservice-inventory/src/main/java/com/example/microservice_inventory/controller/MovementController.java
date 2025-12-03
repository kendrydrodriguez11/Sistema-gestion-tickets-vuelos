package com.example.microservice_inventory.controller;


import com.example.microservice_inventory.dto.MovementCreateDto;
import com.example.microservice_inventory.dto.MovementResponseDto;
import com.example.microservice_inventory.service.MovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/inventory/movements")
public class MovementController {

    private final MovementService movementService;

    @PostMapping
    public ResponseEntity<MovementResponseDto> createMovement(
            @Valid @RequestBody MovementCreateDto dto,
            @RequestHeader("X-User-Id") UUID userId) {
        MovementResponseDto response = movementService.createMovement(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<MovementResponseDto>> getAllMovements(Pageable pageable) {
        Page<MovementResponseDto> response = movementService.getAllMovements(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<MovementResponseDto>> getMovementsByProduct(
            @PathVariable UUID productId,
            Pageable pageable) {
        Page<MovementResponseDto> response = movementService.getMovementsByProduct(productId, pageable);
        return ResponseEntity.ok(response);
    }
}