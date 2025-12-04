package com.example.microservice_search.dto;

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
    private String originAirport;
    private String destinationAirport;
    private String originCity;
    private String destinationCity;
    private String originCountry;
    private String destinationCountry;
    private Integer distanceKm;
    private Integer estimatedDurationMinutes;
}