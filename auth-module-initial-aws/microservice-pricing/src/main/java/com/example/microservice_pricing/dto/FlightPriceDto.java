package com.example.microservice_pricing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightPriceDto {
    private UUID flightId;
    private BigDecimal basePrice;
    private BigDecimal currentPrice;
    private Double occupancyRate;
    private Integer daysUntilDeparture;
    private String priceLevel; // LOW, MEDIUM, HIGH
}