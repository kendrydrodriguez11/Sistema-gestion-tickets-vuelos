package com.example.microservice_change.controller;

import com.example.microservice_change.dto.DenominationDto;
import com.example.microservice_change.service.DenominationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/changes/inventory")
public class DenominationController {

    private final DenominationService denominationService;

    @PostMapping
    public ResponseEntity<DenominationDto> createDenomination(
            @Valid @RequestBody DenominationDto dto) {
        log.info("Creating denomination: {} {}", dto.getValue(), dto.getType());
        return ResponseEntity.ok(denominationService.createDenomination(dto));
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<DenominationDto> updateQuantity(
            @PathVariable UUID id,
            @RequestParam Integer newQuantity) {
        log.info("Updating denomination {} quantity to: {}", id, newQuantity);
        return ResponseEntity.ok(denominationService.updateQuantity(id, newQuantity));
    }

    @GetMapping
    public ResponseEntity<Page<DenominationDto>> getAllDenominations(Pageable pageable) {
        return ResponseEntity.ok(denominationService.getAllDenominations(pageable));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<DenominationDto>> getLowStockDenominations() {
        return ResponseEntity.ok(denominationService.getLowStockDenominations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DenominationDto> getDenomination(@PathVariable UUID id) {
        return ResponseEntity.ok(denominationService.getDenomination(id));
    }
}
