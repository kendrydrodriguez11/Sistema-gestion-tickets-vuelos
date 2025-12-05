package com.example.microservice_notifications.service;
import com.example.microservice_notifications.dto.NotificationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface NotificationService {
    NotificationDto createNotification(NotificationDto dto);
    Page<NotificationDto> getAllNotifications(Pageable pageable);
    Page<NotificationDto> getUnreadNotifications(Pageable pageable);
    void markAsRead(UUID id);
    void markAllAsRead();
    Long getUnreadCount();
}