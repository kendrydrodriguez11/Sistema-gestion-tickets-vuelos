package com.example.microservice_search.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightSearchRequestDto {

    @NotBlank(message = "Origin airport is required")
    private String origin;

    @NotBlank(message = "Destination airport is required")
    private String destination;

    @NotNull(message = "Departure date is required")
    private LocalDate departureDate;

    private LocalDate returnDate; // Opcional para vuelos de ida y vuelta

    @NotNull(message = "Number of passengers is required")
    @Positive(message = "Passengers must be at least 1")
    private Integer passengers;
}