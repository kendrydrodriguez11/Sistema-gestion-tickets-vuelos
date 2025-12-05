package com.example.microservice_flight.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "routes")
public class RouteEntity {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @NotBlank
    @Column(nullable = false)
    private String originAirport; // Código IATA: GYE

    @NotBlank
    @Column(nullable = false)
    private String destinationAirport; // Código IATA: UIO

    @NotBlank
    @Column(nullable = false)
    private String originCity;

    @NotBlank
    @Column(nullable = false)
    private String destinationCity;

    @NotBlank
    @Column(nullable = false)
    private String originCountry;

    @NotBlank
    @Column(nullable = false)
    private String destinationCountry;

    @Positive
    @Column(nullable = false)
    private Integer distanceKm;

    @Positive
    @Column(nullable = false)
    private Integer estimatedDurationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RouteStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = RouteStatus.ACTIVE;
        }
    }
}