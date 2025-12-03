package com.example.microservice_inventory.service;


import com.example.microservice_inventory.dto.MovementCreateDto;
import com.example.microservice_inventory.dto.MovementResponseDto;
import com.example.microservice_inventory.model.MovementEntity;
import com.example.microservice_inventory.model.MovementType;
import com.example.microservice_inventory.model.ProductEntity;
import com.example.microservice_inventory.model.ProductStatus;
import com.example.microservice_inventory.repository.MovementRepository;
import com.example.microservice_inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.example.microservice_inventory.config.RabbitMQConfig;
import com.example.microservice_inventory.dto.StockAlertDto;

@Slf4j
@RequiredArgsConstructor
@Service
public class MovementServiceImpl implements MovementService {

    private final MovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final RabbitTemplate rabbitTemplate;

    @Override
    @Transactional
    public MovementResponseDto createMovement(MovementCreateDto dto, UUID userId) {
        ProductEntity product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int newStock = calculateNewStock(product.getStock(), dto.getType(), dto.getQuantity());

        if (newStock < 0) {
            throw new RuntimeException("Insufficient stock");
        }
        if (newStock <= product.getMinStock()) {
            checkAndSendLowStockAlert(product);
        }

        product.setStock(newStock);

        if (newStock == 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        } else if (newStock <= product.getMinStock()) {
            log.warn("Product {} is below minimum stock level", product.getSku());
        } else if (product.getStatus() == ProductStatus.OUT_OF_STOCK) {
            product.setStatus(ProductStatus.ACTIVE);
        }

        productRepository.save(product);

        MovementEntity movement = MovementEntity.builder()
                .product(product)
                .type(dto.getType())
                .quantity(dto.getQuantity())
                .reason(dto.getReason())
                .userId(userId)
                .build();

        MovementEntity saved = movementRepository.save(movement);

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovementResponseDto> getMovementsByProduct(UUID productId, Pageable pageable) {
        return movementRepository.findByProductId(productId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovementResponseDto> getAllMovements(Pageable pageable) {
        return movementRepository.findAll(pageable).map(this::mapToDto);
    }

    private int calculateNewStock(int currentStock, MovementType type, int quantity) {
        return switch (type) {
            case ENTRY -> currentStock + quantity;
            case EXIT -> currentStock - quantity;
            case ADJUSTMENT -> quantity;
        };
    }

    private MovementResponseDto mapToDto(MovementEntity entity) {
        return MovementResponseDto.builder()
                .id(entity.getId())
                .productId(entity.getProduct().getId())
                .productName(entity.getProduct().getName())
                .type(entity.getType())
                .quantity(entity.getQuantity())
                .reason(entity.getReason())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private void checkAndSendLowStockAlert(ProductEntity product) {
        StockAlertDto alert = StockAlertDto.builder()
                .productId(product.getId())
                .productName(product.getName())
                .sku(product.getSku())
                .currentStock(product.getStock())
                .minStock(product.getMinStock())
                .price(product.getPrice())
                .alertTime(LocalDateTime.now())
                .build();

        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.STOCK_EXCHANGE,
                    RabbitMQConfig.LOW_STOCK_ROUTING_KEY,
                    alert
            );
            log.info("Low stock alert sent for product: {}", product.getSku());
        } catch (Exception e) {
            log.error("Failed to send low stock alert", e);
        }
    }
}