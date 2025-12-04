package com.example.microservice_flight.dto;

import com.example.microservice_flight.model.AircraftStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AircraftDto {
    private UUID id;

    @NotBlank
    private String registrationNumber;

    @NotBlank
    private String model;

    @NotBlank
    private String manufacturer;

    @Positive
    private Integer totalSeats;

    @Positive
    private Integer economySeats;

    @Positive
    private Integer businessSeats;

    @Positive
    private Integer firstClassSeats;

    private AircraftStatus status;
    private Integer yearManufactured;
    private LocalDateTime createdAt;
}