package com.example.microservice_inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAlertDto {
    private UUID productId;
    private String productName;
    private String sku;
    private Integer currentStock;
    private Integer minStock;
    private BigDecimal price;
    private LocalDateTime alertTime;
}