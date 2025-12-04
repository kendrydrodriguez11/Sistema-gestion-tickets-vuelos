package com.example.microservice_pricing.service;

import com.example.microservice_pricing.dto.FlightPriceDto;
import com.example.microservice_pricing.model.PriceHistoryEntity;
import com.example.microservice_pricing.repository.PriceHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class PricingServiceImpl implements PricingService {

    private final PriceHistoryRepository priceHistoryRepository;

    @Value("${pricing.calculation.base-multiplier:1.0}")
    private Double baseMultiplier;

    @Value("${pricing.calculation.occupancy-high-threshold:0.7}")
    private Double occupancyHighThreshold;

    @Value("${pricing.calculation.occupancy-medium-threshold:0.5}")
    private Double occupancyMediumThreshold;

    @Value("${pricing.calculation.days-before-high-price:7}")
    private Integer daysBeforeHighPrice;

    @Value("${pricing.calculation.days-before-medium-price:30}")
    private Integer daysBeforeMediumPrice;

    @Override
    @Transactional
    public FlightPriceDto calculatePrice(
            UUID flightId,
            BigDecimal basePrice,
            Double occupancyRate,
            LocalDateTime departureTime) {

        log.debug("Calculating price for flight: {}", flightId);

        int daysUntilDeparture = (int) Duration.between(LocalDateTime.now(), departureTime).toDays();

        double multiplier = baseMultiplier;

        // Factor por ocupación
        if (occupancyRate >= occupancyHighThreshold) {
            multiplier += 0.5; // +50%
        } else if (occupancyRate >= occupancyMediumThreshold) {
            multiplier += 0.25; // +25%
        }

        // Factor por tiempo hasta salida
        if (daysUntilDeparture <= daysBeforeHighPrice) {
            multiplier += 0.4; // +40%
        } else if (daysUntilDeparture <= daysBeforeMediumPrice) {
            multiplier += 0.2; // +20%
        }

        BigDecimal calculatedPrice = basePrice.multiply(BigDecimal.valueOf(multiplier))
                .setScale(2, RoundingMode.HALF_UP);

        // Guardar en historial
        PriceHistoryEntity history = PriceHistoryEntity.builder()
                .flightId(flightId)
                .basePrice(basePrice)
                .calculatedPrice(calculatedPrice)
                .occupancyRate(occupancyRate)
                .daysUntilDeparture(daysUntilDeparture)
                .build();

        priceHistoryRepository.save(history);

        String priceLevel = determinePriceLevel(multiplier);

        return FlightPriceDto.builder()
                .flightId(flightId)
                .basePrice(basePrice)
                .currentPrice(calculatedPrice)
                .occupancyRate(occupancyRate)
                .daysUntilDeparture(daysUntilDeparture)
                .priceLevel(priceLevel)
                .build();
    }

    @Override
    public void recalculateAllFlightPrices() {
        log.info("Recalculating all flight prices...");
        // Implementación que recorre todos los vuelos activos
        // y llama a calculatePrice para cada uno
    }

    private String determinePriceLevel(double multiplier) {
        if (multiplier >= 1.5) return "HIGH";
        if (multiplier >= 1.2) return "MEDIUM";
        return "LOW";
    }
}