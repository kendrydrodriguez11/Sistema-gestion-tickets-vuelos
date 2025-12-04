package com.example.microservice_booking.dto;

import com.example.microservice_booking.model.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private UUID id;
    private String bookingReference;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID flightId;

    @NotNull
    private BigDecimal totalPrice;

    private BookingStatus status;
    private List<PassengerDto> passengers;
    private UUID paymentId;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
}