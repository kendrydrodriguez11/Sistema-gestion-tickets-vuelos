package com.example.microservice_search.dto;

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
public class FlightSearchResultDto {
    private UUID id;
    private String flightNumber;
    private UUID aircraftId;
    private UUID routeId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal basePrice;
    private Integer availableSeats;
    private Integer bookedSeats;
    private String status;
    private Double occupancyRate;

    // Aircraft info
    private AircraftDto aircraft;

    // Route info
    private RouteDto route;
}