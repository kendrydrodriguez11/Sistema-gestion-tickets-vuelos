package com.example.microservice_flight.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "flights")
public class FlightEntity {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String flightNumber; // AA1234

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aircraft_id", nullable = false)
    private AircraftEntity aircraft;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private RouteEntity route;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime departureTime;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime arrivalTime;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @NotNull
    @Column(nullable = false)
    private Integer availableSeats;

    @NotNull
    @Column(nullable = false)
    private Integer bookedSeats;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlightStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = FlightStatus.SCHEDULED;
        }
        if (bookedSeats == null) {
            bookedSeats = 0;
        }
        if (availableSeats == null && aircraft != null) {
            availableSeats = aircraft.getTotalSeats();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public double getOccupancyRate() {
        if (availableSeats == 0) return 0.0;
        return (double) bookedSeats / (bookedSeats + availableSeats);
    }
}