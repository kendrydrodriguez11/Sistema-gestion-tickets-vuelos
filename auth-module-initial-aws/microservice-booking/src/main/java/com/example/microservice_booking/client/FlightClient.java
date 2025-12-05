package com.example.microservice_booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(
        name = "microservice-flight",
        configuration = com.example.microservice_booking.config.FeignConfig.class
)

public interface FlightClient {

    @PostMapping("/api/flights/{flightId}/seats/{seatNumber}/reserve")
    Boolean reserveSeat(
            @PathVariable UUID flightId,
            @PathVariable String seatNumber,
            @RequestParam UUID bookingId
    );

    @PostMapping("/api/flights/{flightId}/seats/{seatNumber}/release")
    void releaseSeat(
            @PathVariable UUID flightId,
            @PathVariable String seatNumber
    );
}