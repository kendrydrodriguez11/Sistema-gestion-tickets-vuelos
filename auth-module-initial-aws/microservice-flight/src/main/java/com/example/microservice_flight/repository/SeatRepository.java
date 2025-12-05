package com.example.microservice_flight.repository;

import com.example.microservice_flight.model.SeatEntity;
import com.example.microservice_flight.model.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SeatRepository extends JpaRepository<SeatEntity, UUID> {
    List<SeatEntity> findByFlightId(UUID flightId);

    List<SeatEntity> findByFlightIdAndStatus(UUID flightId, SeatStatus status);

    Optional<SeatEntity> findByFlightIdAndSeatNumber(UUID flightId, String seatNumber);

    @Query("SELECT COUNT(s) FROM SeatEntity s WHERE s.flight.id = :flightId AND s.status = 'AVAILABLE'")
    Integer countAvailableSeats(@Param("flightId") UUID flightId);
}