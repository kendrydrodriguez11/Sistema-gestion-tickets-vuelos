package com.example.microservice_flight.dto;

import com.example.microservice_flight.model.RouteStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteDto {
    private UUID id;

    @NotBlank
    private String originAirport;

    @NotBlank
    private String destinationAirport;

    @NotBlank
    private String originCity;

    @NotBlank
    private String destinationCity;

    @NotBlank
    private String originCountry;

    @NotBlank
    private String destinationCountry;

    @Positive
    private Integer distanceKm;

    @Positive
    private Integer estimatedDurationMinutes;

    private RouteStatus status;
}
