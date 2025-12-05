package com.example.microservice_flight.service;

import com.example.microservice_flight.dto.AircraftDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AircraftService {
    AircraftDto createAircraft(AircraftDto dto);
    AircraftDto updateAircraft(UUID id, AircraftDto dto);
    AircraftDto getAircraft(UUID id);
    Page<AircraftDto> getAllAircraft(Pageable pageable);
    void deleteAircraft(UUID id);
}