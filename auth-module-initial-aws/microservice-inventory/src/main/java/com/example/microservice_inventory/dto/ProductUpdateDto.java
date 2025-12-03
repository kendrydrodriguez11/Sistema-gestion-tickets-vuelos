package com.example.microservice_inventory.dto;


import com.example.microservice_inventory.model.ProductStatus;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductUpdateDto {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer minStock;
    private String category;
    private ProductStatus status;
}
