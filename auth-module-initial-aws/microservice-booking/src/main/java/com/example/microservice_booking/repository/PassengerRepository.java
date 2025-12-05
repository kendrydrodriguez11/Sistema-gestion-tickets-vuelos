package com.example.microservice_booking.repository;

import com.example.microservice_booking.model.PassengerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PassengerRepository extends JpaRepository<PassengerEntity, UUID> {
    List<PassengerEntity> findByBookingId(UUID bookingId);
}