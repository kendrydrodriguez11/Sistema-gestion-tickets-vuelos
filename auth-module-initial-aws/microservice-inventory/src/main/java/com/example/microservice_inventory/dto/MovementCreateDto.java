package com.example.microservice_inventory.dto;


import com.example.microservice_inventory.model.MovementType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.util.UUID;

@Data
public class MovementCreateDto {
    @NotNull
    private UUID productId;

    @NotNull
    private MovementType type;

    @NotNull
    @Positive
    private Integer quantity;

    private String reason;
}