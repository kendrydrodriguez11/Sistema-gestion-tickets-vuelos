package com.example.microservice_flight.service;

import com.example.microservice_flight.dto.RouteDto;
import com.example.microservice_flight.model.RouteEntity;
import com.example.microservice_flight.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;

    @Override
    @Transactional
    public RouteDto createRoute(RouteDto dto) {
        log.info("Creating route: {} to {}", dto.getOriginAirport(), dto.getDestinationAirport());

        RouteEntity route = RouteEntity.builder()
                .originAirport(dto.getOriginAirport())
                .destinationAirport(dto.getDestinationAirport())
                .originCity(dto.getOriginCity())
                .destinationCity(dto.getDestinationCity())
                .originCountry(dto.getOriginCountry())
                .destinationCountry(dto.getDestinationCountry())
                .distanceKm(dto.getDistanceKm())
                .estimatedDurationMinutes(dto.getEstimatedDurationMinutes())
                .status(dto.getStatus())
                .build();

        RouteEntity saved = routeRepository.save(route);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public RouteDto updateRoute(UUID id, RouteDto dto) {
        RouteEntity route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        if (dto.getStatus() != null) {
            route.setStatus(dto.getStatus());
        }

        RouteEntity updated = routeRepository.save(route);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public RouteDto getRoute(UUID id) {
        RouteEntity route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        return mapToDto(route);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RouteDto> getAllRoutes(Pageable pageable) {
        return routeRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional
    public void deleteRoute(UUID id) {
        routeRepository.deleteById(id);
    }

    private RouteDto mapToDto(RouteEntity entity) {
        return RouteDto.builder()
                .id(entity.getId())
                .originAirport(entity.getOriginAirport())
                .destinationAirport(entity.getDestinationAirport())
                .originCity(entity.getOriginCity())
                .destinationCity(entity.getDestinationCity())
                .originCountry(entity.getOriginCountry())
                .destinationCountry(entity.getDestinationCountry())
                .distanceKm(entity.getDistanceKm())
                .estimatedDurationMinutes(entity.getEstimatedDurationMinutes())
                .status(entity.getStatus())
                .build();
    }
}