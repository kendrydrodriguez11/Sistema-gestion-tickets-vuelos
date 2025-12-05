package com.example.microservice_search.client;

import com.example.microservice_search.dto.FlightPriceDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@FeignClient(
        name = "microservice-pricing",
        url = "http://localhost:8087",
        configuration = com.example.microservice_search.config.FeignConfig.class // seguridad agregada
)
public interface PricingClient {

    @GetMapping("/api/pricing/calculate")
    FlightPriceDto calculatePrice(
            @RequestParam UUID flightId,
            @RequestParam BigDecimal basePrice,
            @RequestParam Double occupancyRate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime
    );
}
