package com.example.microservice_booking.controller;

import com.example.microservice_booking.dto.BookingDto;
import com.example.microservice_booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDto> createBooking(@Valid @RequestBody BookingDto dto) {
        log.info("Creating booking for user: {}", dto.getUserId());
        return ResponseEntity.ok(bookingService.createBooking(dto));
    }

    @PutMapping("/{bookingId}/confirm")
    public ResponseEntity<BookingDto> confirmBooking(
            @PathVariable UUID bookingId,
            @RequestParam UUID paymentId) {
        return ResponseEntity.ok(bookingService.confirmBooking(bookingId, paymentId));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingDto> cancelBooking(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDto> getBooking(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(bookingService.getBooking(bookingId));
    }

    @GetMapping("/reference/{reference}")
    public ResponseEntity<BookingDto> getBookingByReference(@PathVariable String reference) {
        return ResponseEntity.ok(bookingService.getBookingByReference(reference));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<BookingDto>> getUserBookings(
            @PathVariable UUID userId,
            Pageable pageable) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId, pageable));
    }
}