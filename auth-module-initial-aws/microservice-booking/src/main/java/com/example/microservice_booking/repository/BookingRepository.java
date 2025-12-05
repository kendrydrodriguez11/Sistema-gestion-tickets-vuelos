package com.example.microservice_booking.repository;

import com.example.microservice_booking.model.BookingEntity;
import com.example.microservice_booking.model.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<BookingEntity, UUID> {

    Optional<BookingEntity> findByBookingReference(String bookingReference);

    Page<BookingEntity> findByUserId(UUID userId, Pageable pageable);

    List<BookingEntity> findByFlightId(UUID flightId);

    List<BookingEntity> findByStatus(BookingStatus status);

    @Query("SELECT b FROM BookingEntity b WHERE b.status = 'PENDING' AND b.expiresAt < :now")
    List<BookingEntity> findExpiredBookings(@Param("now") LocalDateTime now);
}