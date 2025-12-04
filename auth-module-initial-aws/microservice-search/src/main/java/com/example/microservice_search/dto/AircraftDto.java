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
public class AircraftDto {
    private UUID id;
    private String registrationNumber;
    private String model;
    private String manufacturer;
    private Integer totalSeats;
    private Integer economySeats;
    private Integer businessSeats;
    private Integer firstClassSeats;
}