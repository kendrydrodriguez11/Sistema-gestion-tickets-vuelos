package com.example.microservice_flight.service;

import com.example.microservice_flight.dto.RouteDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface RouteService {
    RouteDto createRoute(RouteDto dto);
    RouteDto updateRoute(UUID id, RouteDto dto);
    RouteDto getRoute(UUID id);
    Page<RouteDto> getAllRoutes(Pageable pageable);
    void deleteRoute(UUID id);
}