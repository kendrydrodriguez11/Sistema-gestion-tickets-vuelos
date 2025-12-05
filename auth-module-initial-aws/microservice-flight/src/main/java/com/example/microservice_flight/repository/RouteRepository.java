package com.example.microservice_flight.repository;

import com.example.microservice_flight.model.RouteEntity;
import com.example.microservice_flight.model.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RouteRepository extends JpaRepository<RouteEntity, UUID> {
    List<RouteEntity> findByOriginAirport(String originAirport);
    List<RouteEntity> findByDestinationAirport(String destinationAirport);
    List<RouteEntity> findByStatus(RouteStatus status);

    Optional<RouteEntity> findByOriginAirportAndDestinationAirport(
            String originAirport,
            String destinationAirport
    );
}