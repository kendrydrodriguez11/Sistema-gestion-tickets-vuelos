package com.example.microservice_change.controller;

import com.example.microservice_change.dto.ChangeRequestDto;
import com.example.microservice_change.dto.ChangeResponseDto;
import com.example.microservice_change.service.ChangeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/changes")
public class ChangeController {

    private final ChangeService changeService;

    @PostMapping("/request")
    public ResponseEntity<ChangeResponseDto> requestChange(
            @Valid @RequestBody ChangeRequestDto dto,
            @RequestHeader("X-User-Id") UUID userId) {

        log.info("Change request received for transaction: {}", dto.getTransactionId());
        ChangeResponseDto response = changeService.processChangeRequest(dto, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{requestId}/confirm")
    public ResponseEntity<ChangeResponseDto> confirmDispensed(@PathVariable UUID requestId) {
        log.info("Confirming change dispensed for request: {}", requestId);
        ChangeResponseDto response = changeService.confirmChangeDispensed(requestId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<ChangeResponseDto>> getAllChangeRequests(Pageable pageable) {
        return ResponseEntity.ok(changeService.getAllChangeRequests(pageable));
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<ChangeResponseDto> getChangeRequest(@PathVariable UUID requestId) {
        return ResponseEntity.ok(changeService.getChangeRequest(requestId));
    }
}
