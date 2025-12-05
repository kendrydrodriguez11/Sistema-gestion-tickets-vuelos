package com.example.microservice_flight.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightSearchDto {
    private UUID id;
    private String flightNumber;
    private String originAirport;
    private String destinationAirport;
    private String originCity;
    private String destinationCity;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal basePrice;
    private BigDecimal currentPrice; // Precio dinámico
    private Integer availableSeats;
    private Integer totalSeats;
    private Double occupancyRate;
    private String aircraftModel;
    private Integer durationMinutes;
}