package com.example.microservice_flight.controller;

import com.example.microservice_flight.dto.RouteDto;
import com.example.microservice_flight.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    @PostMapping
    public ResponseEntity<RouteDto> createRoute(@Valid @RequestBody RouteDto dto) {
        return ResponseEntity.ok(routeService.createRoute(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RouteDto> updateRoute(
            @PathVariable UUID id,
            @Valid @RequestBody RouteDto dto) {
        return ResponseEntity.ok(routeService.updateRoute(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteDto> getRoute(@PathVariable UUID id) {
        return ResponseEntity.ok(routeService.getRoute(id));
    }

    @GetMapping
    public ResponseEntity<Page<RouteDto>> getAllRoutes(Pageable pageable) {
        return ResponseEntity.ok(routeService.getAllRoutes(pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable UUID id) {
        routeService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }
}