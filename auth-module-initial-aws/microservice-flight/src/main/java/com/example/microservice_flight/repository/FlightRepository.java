package com.example.microservice_flight.repository;

import com.example.microservice_flight.model.FlightEntity;
import com.example.microservice_flight.model.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FlightRepository extends JpaRepository<FlightEntity, UUID> {
    Optional<FlightEntity> findByFlightNumber(String flightNumber);

    List<FlightEntity> findByStatus(FlightStatus status);

    @Query("SELECT f FROM FlightEntity f WHERE f.route.originAirport = :origin " +
            "AND f.route.destinationAirport = :destination " +
            "AND f.departureTime >= :startDate " +
            "AND f.departureTime <= :endDate " +
            "AND f.status = 'SCHEDULED'")
    List<FlightEntity> searchFlights(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT f FROM FlightEntity f WHERE f.departureTime BETWEEN :start AND :end")
    List<FlightEntity> findByDepartureTimeBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}