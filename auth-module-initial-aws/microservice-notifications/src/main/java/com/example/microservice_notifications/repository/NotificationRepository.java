package com.example.microservice_notifications.repository;

import com.example.microservice_notifications.model.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {
    Page<NotificationEntity> findByReadFalse(Pageable pageable);
    Long countByReadFalse();
}