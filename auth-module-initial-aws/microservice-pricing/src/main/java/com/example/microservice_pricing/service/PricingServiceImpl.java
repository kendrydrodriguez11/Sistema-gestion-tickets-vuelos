package com.example.microservice_pricing.service;

import com.example.microservice_pricing.dto.FlightPriceDto;
import com.example.microservice_pricing.model.PriceHistoryEntity;
import com.example.microservice_pricing.repository.PriceHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
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
    private final RedisTemplate<String, Object> redisTemplate;

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

    private static final Duration PRICE_CACHE_TTL = Duration.ofMinutes(10);

    @Override
    @Transactional
    public FlightPriceDto calculatePrice(
            UUID flightId,
            BigDecimal basePrice,
            Double occupancyRate,
            LocalDateTime departureTime) {

        String cacheKey = "price:flight:" + flightId;
        FlightPriceDto cached = (FlightPriceDto) redisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            log.debug("Price cache hit for flight: {}", flightId);
            return cached;
        }

        log.debug("Calculating price for flight: {}", flightId);

        int daysUntilDeparture = (int) Duration.between(LocalDateTime.now(), departureTime).toDays();

        if (daysUntilDeparture < 0) {
            log.warn("Flight {} has already departed", flightId);
            daysUntilDeparture = 0;
        }

        double multiplier = baseMultiplier;

        if (occupancyRate >= occupancyHighThreshold) {
            multiplier += 0.5;
            log.debug("High occupancy factor applied: {}", occupancyRate);
        } else if (occupancyRate >= occupancyMediumThreshold) {
            multiplier += 0.25;
            log.debug("Medium occupancy factor applied: {}", occupancyRate);
        }

        if (daysUntilDeparture <= daysBeforeHighPrice) {
            multiplier += 0.4;
            log.debug("Last minute booking factor applied: {} days", daysUntilDeparture);
        } else if (daysUntilDeparture <= daysBeforeMediumPrice) {
            multiplier += 0.2;
            log.debug("Near departure factor applied: {} days", daysUntilDeparture);
        }

        BigDecimal calculatedPrice = basePrice.multiply(BigDecimal.valueOf(multiplier))
                .setScale(2, RoundingMode.HALF_UP);

        PriceHistoryEntity history = PriceHistoryEntity.builder()
                .flightId(flightId)
                .basePrice(basePrice)
                .calculatedPrice(calculatedPrice)
                .occupancyRate(occupancyRate)
                .daysUntilDeparture(daysUntilDeparture)
                .build();

        priceHistoryRepository.save(history);

        String priceLevel = determinePriceLevel(multiplier);

        FlightPriceDto result = FlightPriceDto.builder()
                .flightId(flightId)
                .basePrice(basePrice)
                .currentPrice(calculatedPrice)
                .occupancyRate(occupancyRate)
                .daysUntilDeparture(daysUntilDeparture)
                .priceLevel(priceLevel)
                .build();

        redisTemplate.opsForValue().set(cacheKey, result, PRICE_CACHE_TTL);
        log.info("Price calculated and cached for flight {}: {} ({})", flightId, calculatedPrice, priceLevel);

        return result;
    }

    @Override
    public void recalculateAllFlightPrices() {
        log.info("Starting recalculation of all flight prices...");
        redisTemplate.keys("price:flight:*").forEach(key -> redisTemplate.delete(key));
        log.info("Price cache cleared - prices will be recalculated on next request");
    }

    private String determinePriceLevel(double multiplier) {
        if (multiplier >= 1.5) return "HIGH";
        if (multiplier >= 1.2) return "MEDIUM";
        return "LOW";
    }
}
