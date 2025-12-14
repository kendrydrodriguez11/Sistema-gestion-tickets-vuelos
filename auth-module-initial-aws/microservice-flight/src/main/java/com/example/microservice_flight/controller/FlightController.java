package com.example.microservice_flight.controller;

import com.example.microservice_flight.dto.FlightDto;
import com.example.microservice_flight.dto.SeatDto;
import com.example.microservice_flight.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    @PostMapping
    public ResponseEntity<FlightDto> createFlight(@Valid @RequestBody FlightDto dto) {
        log.info("Creating flight: {}", dto.getFlightNumber());
        return ResponseEntity.ok(flightService.createFlight(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlightDto> updateFlight(
            @PathVariable UUID id,
            @Valid @RequestBody FlightDto dto) {
        return ResponseEntity.ok(flightService.updateFlight(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightDto> getFlight(@PathVariable UUID id) {
        return ResponseEntity.ok(flightService.getFlight(id));
    }

    @GetMapping
    public ResponseEntity<Page<FlightDto>> getAllFlights(Pageable pageable) {
        return ResponseEntity.ok(flightService.getAllFlights(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlightDto>> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return ResponseEntity.ok(flightService.searchFlights(origin, destination, date));
    }

    @GetMapping("/{id}/seats/available")
    public ResponseEntity<List<SeatDto>> getAvailableSeats(@PathVariable UUID id) {
        return ResponseEntity.ok(flightService.getAvailableSeats(id));
    }

    @PostMapping("/{flightId}/seats/{seatNumber}/reserve")
    public ResponseEntity<Boolean> reserveSeat(
            @PathVariable UUID flightId,
            @PathVariable String seatNumber,
            @RequestParam UUID bookingId) {
        boolean reserved = flightService.reserveSeat(flightId, seatNumber, bookingId);
        return ResponseEntity.ok(reserved);
    }

    @PostMapping("/{flightId}/seats/{seatNumber}/release")
    public ResponseEntity<Void> releaseSeat(
            @PathVariable UUID flightId,
            @PathVariable String seatNumber) {
        flightService.releaseSeat(flightId, seatNumber);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/with-pricing")
    public ResponseEntity<FlightDto> getFlightWithDynamicPricing(@PathVariable UUID id) {
        System.out.println("entro");
        FlightDto flight = flightService.getFlight(id);
        return ResponseEntity.ok(flight);
    }

}