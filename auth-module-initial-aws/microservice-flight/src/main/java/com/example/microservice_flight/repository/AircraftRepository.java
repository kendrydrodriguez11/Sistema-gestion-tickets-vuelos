package com.example.microservice_flight.repository;

import com.example.microservice_flight.model.AircraftEntity;
import com.example.microservice_flight.model.AircraftStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AircraftRepository extends JpaRepository<AircraftEntity, UUID> {
    Optional<AircraftEntity> findByRegistrationNumber(String registrationNumber);
    List<AircraftEntity> findByStatus(AircraftStatus status);
    List<AircraftEntity> findByModel(String model);
}