package com.example.microservice_change.service;

import com.example.microservice_change.dto.DenominationDetailDto;
import com.example.microservice_change.model.DenominationEntity;
import com.example.microservice_change.repository.DenominationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Servicio de cálculo de vuelto usando algoritmo greedy.
 * Selecciona denominaciones de mayor a menor valor hasta completar el monto.
 */
@Slf4j
@RequiredArgsConstructor
@Service
public class ChangeCalculationService {

    private final DenominationRepository denominationRepository;

    /**
     * Calcula la combinación de denominaciones para el vuelto.
     * @param changeAmount Monto de vuelto a calcular
     * @return Lista de denominaciones con cantidad, o null si no es posible
     */
    public List<DenominationDetailDto> calculateChange(BigDecimal changeAmount) {
        log.info("Calculating change for amount: {}", changeAmount);

        if (changeAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return new ArrayList<>();
        }

        List<DenominationEntity> denominations = denominationRepository.findActiveOrderedByValue();
        List<DenominationDetailDto> result = new ArrayList<>();

        BigDecimal remaining = changeAmount;

        for (DenominationEntity denom : denominations) {
            if (remaining.compareTo(BigDecimal.ZERO) == 0) {
                break;
            }

            if (denom.getValue().compareTo(remaining) <= 0 && denom.getQuantity() > 0) {
                // Calcular cuántas unidades de esta denominación usar
                int maxUnits = remaining.divide(denom.getValue(), 0, BigDecimal.ROUND_DOWN).intValue();
                int availableUnits = Math.min(maxUnits, denom.getQuantity());

                if (availableUnits > 0) {
                    BigDecimal subtotal = denom.getValue().multiply(BigDecimal.valueOf(availableUnits));

                    result.add(DenominationDetailDto.builder()
                            .denominationId(denom.getId())
                            .value(denom.getValue())
                            .type(denom.getType())
                            .quantity(availableUnits)
                            .subtotal(subtotal)
                            .build());

                    remaining = remaining.subtract(subtotal);
                }
            }
        }

        // Verificar si se pudo completar el vuelto exacto
        if (remaining.compareTo(BigDecimal.ZERO) != 0) {
            log.warn("Unable to provide exact change. Remaining: {}", remaining);
            return null; // No se puede dar el vuelto exacto
        }

        log.info("Change calculated successfully with {} denominations", result.size());
        return result;
    }
}