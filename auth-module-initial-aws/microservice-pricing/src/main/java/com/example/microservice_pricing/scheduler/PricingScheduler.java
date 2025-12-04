package com.example.microservice_pricing.scheduler;

import com.example.microservice_pricing.service.PricingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class PricingScheduler {

    private final PricingService pricingService;

    @Scheduled(cron = "0 0 */6 * * *") // Cada 6 horas
    public void recalculatePrices() {
        log.info("Starting scheduled price recalculation...");
        pricingService.recalculateAllFlightPrices();
    }
}