package com.example.microservice_inventory.repository;


import com.example.microservice_inventory.model.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {

    Optional<ProductEntity> findBySku(String sku);

    Page<ProductEntity> findByCategory(String category, Pageable pageable);

    @Query("SELECT p FROM ProductEntity p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ProductEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM ProductEntity p WHERE p.stock <= p.minStock AND p.status = 'ACTIVE'")
    Page<ProductEntity> findLowStockProducts(Pageable pageable);
}