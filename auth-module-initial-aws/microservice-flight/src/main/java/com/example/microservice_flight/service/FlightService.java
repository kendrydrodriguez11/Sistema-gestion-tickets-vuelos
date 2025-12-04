package com.example.microservice_flight.service;

import com.example.microservice_flight.dto.FlightDto;
import com.example.microservice_flight.dto.SeatDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface FlightService {
    FlightDto createFlight(FlightDto dto);
    FlightDto updateFlight(UUID id, FlightDto dto);
    FlightDto getFlight(UUID id);
    Page<FlightDto> getAllFlights(Pageable pageable);
    List<FlightDto> searchFlights(String origin, String destination, LocalDateTime date);
    void generateSeatsForFlight(UUID flightId);
    List<SeatDto> getAvailableSeats(UUID flightId);
    boolean reserveSeat(UUID flightId, String seatNumber, UUID bookingId);
    void releaseSeat(UUID flightId, String seatNumber);
    void updateFlightOccupancy(UUID flightId);
}