package com.example.microservice_flight.dto;

import com.example.microservice_flight.model.FlightStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class FlightDto {
    private UUID id;

    @NotBlank
    private String flightNumber;

    @NotNull
    private UUID aircraftId;

    @NotNull
    private UUID routeId;

    @NotNull
    private LocalDateTime departureTime;

    @NotNull
    private LocalDateTime arrivalTime;

    @NotNull
    private BigDecimal basePrice;

    // NUEVO: Precio actual calculado por pricing dinámico
    private BigDecimal currentPrice;

    private Integer availableSeats;
    private Integer bookedSeats;
    private FlightStatus status;
    private Double occupancyRate;

    private AircraftDto aircraft;
    private RouteDto route;
}