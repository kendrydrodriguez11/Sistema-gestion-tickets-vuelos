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
@Table(name = "aircraft")
public class AircraftEntity {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String registrationNumber; // Matrícula del avión

    @NotBlank
    @Column(nullable = false)
    private String model; // Boeing 737, Airbus A320, etc.

    @NotBlank
    @Column(nullable = false)
    private String manufacturer; // Boeing, Airbus

    @Positive
    @Column(nullable = false)
    private Integer totalSeats;

    @Positive
    @Column(nullable = false)
    private Integer economySeats;

    @Positive
    @Column(nullable = false)
    private Integer businessSeats;

    @Positive
    @Column(nullable = false)
    private Integer firstClassSeats;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AircraftStatus status;

    private Integer yearManufactured;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = AircraftStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
