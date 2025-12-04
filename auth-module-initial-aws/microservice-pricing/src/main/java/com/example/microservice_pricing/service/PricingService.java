package com.example.microservice_pricing.service;

import com.example.microservice_pricing.dto.FlightPriceDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public interface PricingService {
    FlightPriceDto calculatePrice(
            UUID flightId,
            BigDecimal basePrice,
            Double occupancyRate,
            LocalDateTime departureTime
    );

    void recalculateAllFlightPrices();
}