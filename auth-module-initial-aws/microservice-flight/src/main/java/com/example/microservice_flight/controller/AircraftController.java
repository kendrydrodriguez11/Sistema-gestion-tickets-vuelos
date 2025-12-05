package com.example.microservice_flight.controller;

import com.example.microservice_flight.dto.AircraftDto;
import com.example.microservice_flight.service.AircraftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    private final AircraftService aircraftService;

    @PostMapping
    public ResponseEntity<AircraftDto> createAircraft(@Valid @RequestBody AircraftDto dto) {
        return ResponseEntity.ok(aircraftService.createAircraft(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AircraftDto> updateAircraft(
            @PathVariable UUID id,
            @Valid @RequestBody AircraftDto dto) {
        return ResponseEntity.ok(aircraftService.updateAircraft(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AircraftDto> getAircraft(@PathVariable UUID id) {
        return ResponseEntity.ok(aircraftService.getAircraft(id));
    }

    @GetMapping
    public ResponseEntity<Page<AircraftDto>> getAllAircraft(Pageable pageable) {
        return ResponseEntity.ok(aircraftService.getAllAircraft(pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAircraft(@PathVariable UUID id) {
        aircraftService.deleteAircraft(id);
        return ResponseEntity.noContent().build();
    }
}