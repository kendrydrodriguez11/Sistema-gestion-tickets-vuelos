package com.example.microservice_flight.dto;

import com.example.microservice_flight.model.SeatClass;
import com.example.microservice_flight.model.SeatStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatDto {
    private UUID id;

    @NotNull
    private UUID flightId;

    @NotBlank
    private String seatNumber;

    @NotNull
    private SeatClass seatClass;

    private SeatStatus status;
    private UUID reservedByBookingId;
    private LocalDateTime reservedAt;
}