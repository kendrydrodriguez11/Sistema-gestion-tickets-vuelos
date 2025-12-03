package com.example.microservice_inventory.service;

import com.example.microservice_inventory.dto.ProductCreateDto;
import com.example.microservice_inventory.dto.ProductResponseDto;
import com.example.microservice_inventory.dto.ProductUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

public interface ProductService {
    ProductResponseDto createProduct(ProductCreateDto dto, UUID userId, String bucketName);
    ProductResponseDto updateProduct(UUID id, ProductUpdateDto dto, UUID userId);
    ProductResponseDto getProductById(UUID id);
    Page<ProductResponseDto> getAllProducts(Pageable pageable);
    Page<ProductResponseDto> getProductsByCategory(String category, Pageable pageable);
    Page<ProductResponseDto> searchProducts(String keyword, Pageable pageable);
    void deleteProduct(UUID id);
    Page<ProductResponseDto> getLowStockProducts(Pageable pageable);
}