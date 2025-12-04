package com.example.microservice_booking.scheduler;

import com.example.microservice_booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class BookingExpirationScheduler {

    private final BookingService bookingService;

    @Scheduled(fixedDelay = 60000) // Cada minuto
    public void processExpiredBookings() {
        log.debug("Checking for expired bookings...");
        bookingService.processExpiredBookings();
    }
}