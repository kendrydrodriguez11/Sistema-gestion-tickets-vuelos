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
public class FlightSearchResponseDto {

    // Información del vuelo
    private UUID flightId;
    private String flightNumber;

    // Ruta
    private String originAirport;
    private String destinationAirport;
    private String originCity;
    private String destinationCity;

    // Horarios
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Integer durationMinutes;

    // Precios
    private BigDecimal basePrice;
    private BigDecimal currentPrice; // Precio dinámico
    private String priceLevel; // LOW, MEDIUM, HIGH

    // Disponibilidad
    private Integer availableSeats;
    private Integer totalSeats;
    private Double occupancyRate;

    // Aeronave
    private String aircraftModel;
    private String aircraftManufacturer;
}