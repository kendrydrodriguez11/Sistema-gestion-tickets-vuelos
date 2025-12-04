package com.example.microservice_change.service;

import com.example.microservice_change.dto.*;
import com.example.microservice_change.model.*;
import com.example.microservice_change.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;



@Slf4j
@RequiredArgsConstructor
@Service
public class ChangeService {

    private final ChangeRequestRepository changeRequestRepository;
    private final ChangeTransactionRepository changeTransactionRepository;
    private final DenominationRepository denominationRepository;
    private final ChangeCalculationService calculationService;
    private final DenominationLockService lockService;
    private final RabbitTemplate rabbitTemplate;

    private static final String CHANGE_EXCHANGE = "change.exchange";
    private static final String CHANGE_EVENTS_ROUTING_KEY = "change.events";

    /**
     * Procesa una solicitud de vuelto con idempotencia.
     * Si ya existe una solicitud con el mismo transactionId, retorna la existente.
     */
    @Transactional
    public ChangeResponseDto processChangeRequest(ChangeRequestDto dto, UUID userId) {
        log.info("Processing change request for transaction: {}", dto.getTransactionId());

        // Verificar idempotencia
        ChangeRequestEntity existingRequest = changeRequestRepository
                .findByTransactionId(dto.getTransactionId())
                .orElse(null);

        if (existingRequest != null) {
            log.info("Returning existing change request for transaction: {}", dto.getTransactionId());
            return mapToResponseDto(existingRequest);
        }

        // Validar que el pago sea suficiente
        BigDecimal changeAmount = dto.getAmountPaid().subtract(dto.getTotalAmount());

        if (changeAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Insufficient payment");
        }

        // Crear solicitud de vuelto
        ChangeRequestEntity request = ChangeRequestEntity.builder()
                .transactionId(dto.getTransactionId())
                .totalAmount(dto.getTotalAmount())
                .amountPaid(dto.getAmountPaid())
                .changeAmount(changeAmount)
                .status(ChangeRequestStatus.PENDING)
                .userId(userId)
                .paymentMethod(dto.getPaymentMethod())
                .build();

        request = changeRequestRepository.save(request);

        // Si no hay vuelto, completar inmediatamente
        if (changeAmount.compareTo(BigDecimal.ZERO) == 0) {
            request.markAsCompleted();
            changeRequestRepository.save(request);
            publishEvent(request, ChangeEventDto.EventType.CHANGE_DISPENSED, null);
            return mapToResponseDto(request);
        }

        // Calcular combinación de denominaciones
        List<DenominationDetailDto> denominations = calculationService.calculateChange(changeAmount);

        if (denominations == null || denominations.isEmpty()) {
            String reason = "Unable to provide exact change with available denominations";
            request.markAsFailed(reason);
            changeRequestRepository.save(request);
            publishEvent(request, ChangeEventDto.EventType.CHANGE_FAILED, denominations);
            return mapToResponseDto(request);
        }

        // Reservar denominaciones (con bloqueo)
        boolean reserved = reserveDenominations(request, denominations);

        if (!reserved) {
            String reason = "Failed to reserve denominations (concurrency issue)";
            request.markAsFailed(reason);
            changeRequestRepository.save(request);
            publishEvent(request, ChangeEventDto.EventType.CHANGE_FAILED, denominations);
            return mapToResponseDto(request);
        }

        request.markAsReserved();
        changeRequestRepository.save(request);
        publishEvent(request, ChangeEventDto.EventType.CHANGE_RESERVED, denominations);

        log.info("Change request processed successfully: {}", request.getId());
        return mapToResponseDto(request);
    }

    /**
     * Confirma la entrega física del vuelto y actualiza el inventario.
     */
    @Transactional
    public ChangeResponseDto confirmChangeDispensed(UUID requestId) {
        ChangeRequestEntity request = changeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Change request not found"));

        if (request.getStatus() != ChangeRequestStatus.RESERVED) {
            throw new IllegalStateException("Change request is not in RESERVED status");
        }

        // Reducir inventario de denominaciones
        List<ChangeTransactionEntity> transactions = changeTransactionRepository
                .findByChangeRequestId(requestId);

        for (ChangeTransactionEntity tx : transactions) {
            DenominationEntity denom = tx.getDenomination();
            denom.setQuantity(denom.getQuantity() - tx.getQuantityDispensed());

            // Actualizar estado si está en bajo stock
            if (denom.isLowStock()) {
                denom.setStatus(DenominationStatus.LOW_STOCK);
                publishLowStockAlert(denom);
            }

            if (denom.getQuantity() == 0) {
                denom.setStatus(DenominationStatus.OUT_OF_STOCK);
            }

            denominationRepository.save(denom);
        }

        request.markAsCompleted();
        changeRequestRepository.save(request);

        List<DenominationDetailDto> denominations = transactions.stream()
                .map(this::mapTransactionToDetail)
                .collect(Collectors.toList());

        publishEvent(request, ChangeEventDto.EventType.CHANGE_DISPENSED, denominations);

        log.info("Change dispensed successfully for request: {}", requestId);
        return mapToResponseDto(request);
    }

    /**
     * Reserva las denominaciones necesarias con bloqueo de Redis.
     */
    private boolean reserveDenominations(ChangeRequestEntity request, List<DenominationDetailDto> denominations) {
        String lockOwner = request.getId().toString();

        try {
            // Adquirir bloqueos
            for (DenominationDetailDto dto : denominations) {
                if (!lockService.acquireLock(dto.getDenominationId(), lockOwner)) {
                    // Si falla, liberar los que ya bloqueamos
                    for (DenominationDetailDto acquired : denominations) {
                        if (acquired == dto) break;
                        lockService.releaseLock(acquired.getDenominationId(), lockOwner);
                    }
                    return false;
                }
            }

            // Crear transacciones de cambio
            for (DenominationDetailDto dto : denominations) {
                DenominationEntity denom = denominationRepository.findById(dto.getDenominationId())
                        .orElseThrow(() -> new RuntimeException("Denomination not found"));

                ChangeTransactionEntity transaction = ChangeTransactionEntity.builder()
                        .changeRequest(request)
                        .denomination(denom)
                        .quantityDispensed(dto.getQuantity())
                        .subtotal(dto.getSubtotal())
                        .build();

                changeTransactionRepository.save(transaction);
            }

            // Liberar bloqueos
            for (DenominationDetailDto dto : denominations) {
                lockService.releaseLock(dto.getDenominationId(), lockOwner);
            }

            return true;

        } catch (Exception e) {
            log.error("Error reserving denominations: {}", e.getMessage());
            // Liberar todos los bloqueos en caso de error
            for (DenominationDetailDto dto : denominations) {
                lockService.releaseLock(dto.getDenominationId(), lockOwner);
            }
            return false;
        }
    }

    private void publishEvent(ChangeRequestEntity request, ChangeEventDto.EventType eventType,
                              List<DenominationDetailDto> denominations) {
        ChangeEventDto event = ChangeEventDto.builder()
                .eventType(eventType)
                .requestId(request.getId())
                .transactionId(request.getTransactionId())
                .changeAmount(request.getChangeAmount())
                .denominations(denominations)
                .failureReason(request.getFailureReason())
                .timestamp(LocalDateTime.now())
                .build();

        try {
            rabbitTemplate.convertAndSend(CHANGE_EXCHANGE, CHANGE_EVENTS_ROUTING_KEY, event);
            log.info("Published event: {} for request: {}", eventType, request.getId());
        } catch (Exception e) {
            log.error("Failed to publish event: {}", e.getMessage());
        }
    }

    private void publishLowStockAlert(DenominationEntity denom) {
        // Este evento lo capturará el servicio de notificaciones
        rabbitTemplate.convertAndSend(CHANGE_EXCHANGE, "denomination.low_stock",
                mapDenominationToDto(denom));
    }

    @Transactional(readOnly = true)
    public Page<ChangeResponseDto> getAllChangeRequests(Pageable pageable) {
        return changeRequestRepository.findAll(pageable)
                .map(this::mapToResponseDto);
    }

    @Transactional(readOnly = true)
    public ChangeResponseDto getChangeRequest(UUID requestId) {
        ChangeRequestEntity request = changeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Change request not found"));
        return mapToResponseDto(request);
    }

    private ChangeResponseDto mapToResponseDto(ChangeRequestEntity entity) {
        List<DenominationDetailDto> denominations = changeTransactionRepository
                .findByChangeRequestId(entity.getId())
                .stream()
                .map(this::mapTransactionToDetail)
                .collect(Collectors.toList());

        return ChangeResponseDto.builder()
                .requestId(entity.getId())
                .transactionId(entity.getTransactionId())
                .changeAmount(entity.getChangeAmount())
                .status(entity.getStatus())
                .denominations(denominations)
                .failureReason(entity.getFailureReason())
                .createdAt(entity.getCreatedAt())
                .completedAt(entity.getCompletedAt())
                .build();
    }

    private DenominationDetailDto mapTransactionToDetail(ChangeTransactionEntity tx) {
        return DenominationDetailDto.builder()
                .denominationId(tx.getDenomination().getId())
                .value(tx.getDenomination().getValue())
                .type(tx.getDenomination().getType())
                .quantity(tx.getQuantityDispensed())
                .subtotal(tx.getSubtotal())
                .build();
    }

    private DenominationDto mapDenominationToDto(DenominationEntity entity) {
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