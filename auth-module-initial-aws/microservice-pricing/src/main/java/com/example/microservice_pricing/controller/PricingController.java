package com.example.microservice_pricing.controller;

import com.example.microservice_pricing.dto.FlightPriceDto;
import com.example.microservice_pricing.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/pricing")
public class PricingController {

    private final PricingService pricingService;

    @GetMapping("/calculate")
    public ResponseEntity<FlightPriceDto> calculatePrice(
            @RequestParam UUID flightId,
            @RequestParam BigDecimal basePrice,
            @RequestParam Double occupancyRate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime) {

        return ResponseEntity.ok(pricingService.calculatePrice(
                flightId, basePrice, occupancyRate, departureTime));
    }

    @PostMapping("/recalculate-all")
    public ResponseEntity<Void> recalculateAll() {
        pricingService.recalculateAllFlightPrices();
        return ResponseEntity.ok().build();
    }
}