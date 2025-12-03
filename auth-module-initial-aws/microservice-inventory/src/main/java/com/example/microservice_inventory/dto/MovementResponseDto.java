package com.example.microservice_inventory.dto;


import com.example.microservice_inventory.model.MovementType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class MovementResponseDto {
    private UUID id;
    private UUID productId;
    private String productName;
    private MovementType type;
    private Integer quantity;
    private String reason;
    private LocalDateTime createdAt;
}