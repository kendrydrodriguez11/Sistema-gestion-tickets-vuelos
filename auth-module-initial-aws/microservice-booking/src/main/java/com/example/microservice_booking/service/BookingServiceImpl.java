package com.example.microservice_booking.service;

import java.util.HashMap;
import java.util.Map;
import com.example.microservice_booking.client.FlightClient;
import com.example.microservice_booking.dto.BookingDto;
import com.example.microservice_booking.dto.PassengerDto;
import com.example.microservice_booking.model.BookingEntity;
import com.example.microservice_booking.model.BookingStatus;
import com.example.microservice_booking.model.PassengerEntity;
import com.example.microservice_booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FlightClient flightClient;
    private final RabbitTemplate rabbitTemplate;

    @Override
    @Transactional
    public BookingDto createBooking(BookingDto dto) {
        log.info("Creating booking for flight: {}", dto.getFlightId());

        // Generar referencia única
        String reference = generateBookingReference();

        BookingEntity booking = BookingEntity.builder()
                .bookingReference(reference)
                .userId(dto.getUserId())
                .flightId(dto.getFlightId())
                .totalPrice(dto.getTotalPrice())
                .status(BookingStatus.PENDING)
                .build();

        // Agregar pasajeros
        List<PassengerEntity> passengers = dto.getPassengers().stream()
                .map(p -> PassengerEntity.builder()
                        .booking(booking)
                        .firstName(p.getFirstName())
                        .lastName(p.getLastName())
                        .documentType(p.getDocumentType())
                        .documentNumber(p.getDocumentNumber())
                        .dateOfBirth(p.getDateOfBirth())
                        .seatNumber(p.getSeatNumber())
                        .build())
                .collect(Collectors.toList());

        booking.setPassengers(passengers);

        // Reservar asientos en Flight Service
        for (PassengerDto passenger : dto.getPassengers()) {
            Boolean reserved = flightClient.reserveSeat(
                    dto.getFlightId(),
                    passenger.getSeatNumber(),
                    booking.getId()
            );

            if (!reserved) {
                throw new RuntimeException("Seat " + passenger.getSeatNumber() + " not available");
            }
        }

        BookingEntity saved = bookingRepository.save(booking);
        log.info("Booking created: {}", saved.getBookingReference());

        // Publicar evento
        publishBookingEvent("booking.created", saved);

        return mapToDto(saved);
    }

    @Override
    @Transactional
    public BookingDto confirmBooking(UUID bookingId, UUID paymentId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Booking is not in PENDING status");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentId(paymentId);
        booking.setConfirmedAt(LocalDateTime.now());

        BookingEntity updated = bookingRepository.save(booking);
        log.info("Booking confirmed: {}", updated.getBookingReference());

        publishBookingEvent("booking.confirmed", updated);

        return mapToDto(updated);
    }

    @Override
    @Transactional
    public BookingDto cancelBooking(UUID bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking already cancelled");
        }

        // Liberar asientos
        for (PassengerEntity passenger : booking.getPassengers()) {
            flightClient.releaseSeat(booking.getFlightId(), passenger.getSeatNumber());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        BookingEntity updated = bookingRepository.save(booking);
        log.info("Booking cancelled: {}", updated.getBookingReference());

        publishBookingEvent("booking.cancelled", updated);

        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void processExpiredBookings() {
        List<BookingEntity> expired = bookingRepository.findExpiredBookings(LocalDateTime.now());

        for (BookingEntity booking : expired) {
            log.warn("Processing expired booking: {}", booking.getBookingReference());

            // Liberar asientos
            for (PassengerEntity passenger : booking.getPassengers()) {
                flightClient.releaseSeat(booking.getFlightId(), passenger.getSeatNumber());
            }

            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);

            publishBookingEvent("booking.expired", booking);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BookingDto getBooking(UUID bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToDto(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingDto getBookingByReference(String reference) {
        BookingEntity booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToDto(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingDto> getUserBookings(UUID userId, Pageable pageable) {
        return bookingRepository.findByUserId(userId, pageable)
                .map(this::mapToDto);
    }

    private String generateBookingReference() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder ref = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            ref.append(chars.charAt(random.nextInt(chars.length())));
        }
        return ref.toString();
    }

    private void publishBookingEvent(String routingKey, BookingEntity booking) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("action", routingKey);
            event.put("bookingId", booking.getId().toString());
            event.put("bookingReference", booking.getBookingReference());
            event.put("flightId", booking.getFlightId().toString());
            event.put("userId", booking.getUserId().toString());
            event.put("status", booking.getStatus().toString());
            event.put("timestamp", LocalDateTime.now().toString());

            rabbitTemplate.convertAndSend("booking.exchange", routingKey, event);
            log.info("📤 Published booking event: {} for booking: {}", routingKey, booking.getBookingReference());
        } catch (Exception e) {
            log.error("❌ Failed to publish event: {}", e.getMessage());
        }
    }

    private BookingDto mapToDto(BookingEntity entity) {
        List<PassengerDto> passengers = entity.getPassengers().stream()
                .map(p -> PassengerDto.builder()
                        .id(p.getId())
                        .firstName(p.getFirstName())
                        .lastName(p.getLastName())
                        .documentType(p.getDocumentType())
                        .documentNumber(p.getDocumentNumber())
                        .dateOfBirth(p.getDateOfBirth())
                        .seatNumber(p.getSeatNumber())
                        .build())
                .collect(Collectors.toList());

        return BookingDto.builder()
                .id(entity.getId())
                .bookingReference(entity.getBookingReference())
                .userId(entity.getUserId())
                .flightId(entity.getFlightId())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus())
                .passengers(passengers)
                .paymentId(entity.getPaymentId())
                .expiresAt(entity.getExpiresAt())
                .createdAt(entity.getCreatedAt())
                .confirmedAt(entity.getConfirmedAt())
                .build();
    }
}