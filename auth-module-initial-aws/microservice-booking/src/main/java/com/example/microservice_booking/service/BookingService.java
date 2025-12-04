package com.example.microservice_booking.service;

import com.example.microservice_booking.dto.BookingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface BookingService {
    BookingDto createBooking(BookingDto dto);
    BookingDto confirmBooking(UUID bookingId, UUID paymentId);
    BookingDto cancelBooking(UUID bookingId);
    BookingDto getBooking(UUID bookingId);
    BookingDto getBookingByReference(String reference);
    Page<BookingDto> getUserBookings(UUID userId, Pageable pageable);
    void processExpiredBookings();
}