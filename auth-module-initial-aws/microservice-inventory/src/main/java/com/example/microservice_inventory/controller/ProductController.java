package com.example.microservice_inventory.controller;


import com.example.microservice_inventory.dto.ProductCreateDto;
import com.example.microservice_inventory.dto.ProductResponseDto;
import com.example.microservice_inventory.dto.ProductUpdateDto;
import com.example.microservice_inventory.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/inventory/products")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponseDto> createProduct(
            @Valid @RequestBody ProductCreateDto dto,
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam(required = false) String bucketName) {
        ProductResponseDto response = productService.createProduct(dto, userId, bucketName);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductUpdateDto dto,
            @RequestHeader("X-User-Id") UUID userId) {
        ProductResponseDto response = productService.updateProduct(id, dto, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProduct(@PathVariable UUID id) {
        ProductResponseDto response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponseDto>> getAllProducts(Pageable pageable) {
        Page<ProductResponseDto> response = productService.getAllProducts(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<ProductResponseDto>> getProductsByCategory(
            @PathVariable String category,
            Pageable pageable) {
        Page<ProductResponseDto> response = productService.getProductsByCategory(category, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponseDto>> searchProducts(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<ProductResponseDto> response = productService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<Page<ProductResponseDto>> getLowStockProducts(Pageable pageable) {
        Page<ProductResponseDto> response = productService.getLowStockProducts(pageable);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}