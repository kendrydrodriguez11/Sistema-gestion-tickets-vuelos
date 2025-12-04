package com.example.microservice_change.service;

import com.example.microservice_change.dto.DenominationDto;
import com.example.microservice_change.model.DenominationEntity;
import com.example.microservice_change.model.DenominationStatus;
import com.example.microservice_change.repository.DenominationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Slf4j
@RequiredArgsConstructor
@Service
public class DenominationService {

    private final DenominationRepository denominationRepository;

    @Transactional
    public DenominationDto createDenomination(DenominationDto dto) {
        if (denominationRepository.findByValue(dto.getValue()).isPresent()) {
            throw new IllegalArgumentException("Denomination with this value already exists");
        }

        DenominationEntity entity = DenominationEntity.builder()
                .value(dto.getValue())
                .type(dto.getType())
                .quantity(dto.getQuantity())
                .minQuantity(dto.getMinQuantity())
                .status(DenominationStatus.ACTIVE)
                .build();

        DenominationEntity saved = denominationRepository.save(entity);
        log.info("Created denomination: {} {}", saved.getValue(), saved.getType());

        return mapToDto(saved);
    }

    @Transactional
    public DenominationDto updateQuantity(UUID id, Integer newQuantity) {
        DenominationEntity denom = denominationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Denomination not found"));

        denom.setQuantity(newQuantity);

        if (newQuantity == 0) {
            denom.setStatus(DenominationStatus.OUT_OF_STOCK);
        } else if (newQuantity <= denom.getMinQuantity()) {
            denom.setStatus(DenominationStatus.LOW_STOCK);
        } else {
            denom.setStatus(DenominationStatus.ACTIVE);
        }

        DenominationEntity updated = denominationRepository.save(denom);
        log.info("Updated denomination {} quantity to: {}", denom.getValue(), newQuantity);

        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public Page<DenominationDto> getAllDenominations(Pageable pageable) {
        return denominationRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public List<DenominationDto> getLowStockDenominations() {
        return denominationRepository.findLowStockDenominations()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DenominationDto getDenomination(UUID id) {
        DenominationEntity denom = denominationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Denomination not found"));
        return mapToDto(denom);
    }

    private DenominationDto mapToDto(DenominationEntity entity) {
        return DenominationDto.builder()
                .id(entity.getId())
                .value(entity.getValue())
                .type(entity.getType())
                .quantity(entity.getQuantity())
                .minQuantity(entity.getMinQuantity())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}