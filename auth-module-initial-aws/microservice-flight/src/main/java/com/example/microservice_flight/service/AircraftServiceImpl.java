package com.example.microservice_flight.service;

import com.example.microservice_flight.dto.AircraftDto;
import com.example.microservice_flight.model.AircraftEntity;
import com.example.microservice_flight.repository.AircraftRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class AircraftServiceImpl implements AircraftService {

    private final AircraftRepository aircraftRepository;

    @Override
    @Transactional
    public AircraftDto createAircraft(AircraftDto dto) {
        log.info("Creating aircraft: {}", dto.getRegistrationNumber());

        AircraftEntity aircraft = AircraftEntity.builder()
                .registrationNumber(dto.getRegistrationNumber())
                .model(dto.getModel())
                .manufacturer(dto.getManufacturer())
                .totalSeats(dto.getTotalSeats())
                .economySeats(dto.getEconomySeats())
                .businessSeats(dto.getBusinessSeats())
                .firstClassSeats(dto.getFirstClassSeats())
                .status(dto.getStatus())
                .yearManufactured(dto.getYearManufactured())
                .build();

        AircraftEntity saved = aircraftRepository.save(aircraft);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public AircraftDto updateAircraft(UUID id, AircraftDto dto) {
        AircraftEntity aircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));

        if (dto.getStatus() != null) {
            aircraft.setStatus(dto.getStatus());
        }

        AircraftEntity updated = aircraftRepository.save(aircraft);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public AircraftDto getAircraft(UUID id) {
        AircraftEntity aircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));
        return mapToDto(aircraft);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AircraftDto> getAllAircraft(Pageable pageable) {
        return aircraftRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional
    public void deleteAircraft(UUID id) {
        aircraftRepository.deleteById(id);
    }

    private AircraftDto mapToDto(AircraftEntity entity) {
        return AircraftDto.builder()
                .id(entity.getId())
                .registrationNumber(entity.getRegistrationNumber())
                .model(entity.getModel())
                .manufacturer(entity.getManufacturer())
                .totalSeats(entity.getTotalSeats())
                .economySeats(entity.getEconomySeats())
                .businessSeats(entity.getBusinessSeats())
                .firstClassSeats(entity.getFirstClassSeats())
                .status(entity.getStatus())
                .yearManufactured(entity.getYearManufactured())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}