package com.example.microservice_inventory.service;

import com.example.microservice_inventory.client.S3ClientApi;
import com.example.microservice_inventory.config.RabbitMQConfig;
import com.example.microservice_inventory.dto.ProductCreateDto;
import com.example.microservice_inventory.dto.ProductResponseDto;
import com.example.microservice_inventory.dto.ProductUpdateDto;
import com.example.microservice_inventory.dto.StockAlertDto;
import com.example.microservice_inventory.model.ProductEntity;
import com.example.microservice_inventory.model.ProductStatus;
import com.example.microservice_inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final S3ClientApi s3ClientApi;
    private final CacheService cacheService;
    private final RabbitTemplate rabbitTemplate;

    @Override
    @Transactional
    public ProductResponseDto createProduct(ProductCreateDto dto, UUID userId, String bucketName) {
        String uploadUrl = null;
        String imageKey = null;

        if (bucketName != null && !bucketName.isEmpty()) {
            imageKey = "products/" + UUID.randomUUID();
            uploadUrl = s3ClientApi.getPresignedPutUrl(bucketName, imageKey);
        }

        ProductEntity product = ProductEntity.builder()
                .sku(dto.getSku())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .minStock(dto.getMinStock())
                .category(dto.getCategory())
                .imageUrl(imageKey)
                .createdBy(userId)
                .status(ProductStatus.ACTIVE)
                .build();

        ProductEntity saved = productRepository.save(product);
        cacheService.save("product:" + saved.getId(), saved, Duration.ofHours(1));
        checkAndSendLowStockAlert(saved);

        ProductResponseDto response = mapToDto(saved);
        response.setUploadUrl(uploadUrl);
        return response;
    }

    @Override
    @Transactional
    public ProductResponseDto updateProduct(UUID id, ProductUpdateDto dto, UUID userId) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getMinStock() != null) product.setMinStock(dto.getMinStock());
        if (dto.getCategory() != null) product.setCategory(dto.getCategory());
        if (dto.getStatus() != null) product.setStatus(dto.getStatus());

        ProductEntity updated = productRepository.save(product);

        cacheService.delete("product:" + id);
        cacheService.save("product:" + updated.getId(), updated, Duration.ofHours(1));

        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(UUID id) {
        return cacheService.get("product:" + id, ProductEntity.class)
                .map(this::mapToDto)
                .orElseGet(() -> {
                    ProductEntity product = productRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Product not found"));
                    cacheService.save("product:" + id, product, Duration.ofHours(1));
                    return mapToDto(product);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategory(category, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchByKeyword(keyword, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus(ProductStatus.DISCONTINUED);
        productRepository.save(product);
        cacheService.delete("product:" + id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> getLowStockProducts(Pageable pageable) {
        return productRepository.findLowStockProducts(pageable).map(this::mapToDto);
    }

    private void checkAndSendLowStockAlert(ProductEntity product) {
        if (product.getStock() <= product.getMinStock()) {
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

    private ProductResponseDto mapToDto(ProductEntity entity) {
        String imageUrl = null;
        if (entity.getImageUrl() != null) {
            imageUrl = s3ClientApi.getPresignedGetUrl("my-inventory-bucketken", entity.getImageUrl());
        }

        return ProductResponseDto.builder()
                .id(entity.getId())
                .sku(entity.getSku())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .stock(entity.getStock())
                .minStock(entity.getMinStock())
                .category(entity.getCategory())
                .imageUrl(imageUrl)
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}