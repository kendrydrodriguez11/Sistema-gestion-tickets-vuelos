package com.example.microservice_notifications.service;


import com.example.microservice_notifications.dto.NotificationDto;
import com.example.microservice_notifications.model.NotificationEntity;
import com.example.microservice_notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final WebSocketService webSocketService;

    @Override
    @Transactional
    public NotificationDto createNotification(NotificationDto dto) {
        NotificationEntity notification = NotificationEntity.builder()
                .type(dto.getType())
                .title(dto.getTitle())
                .message(dto.getMessage())
                .read(false)
                .build();

        NotificationEntity saved = notificationRepository.save(notification);
        NotificationDto response = mapToDto(saved);

        webSocketService.sendNotification(response);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDto> getAllNotifications(Pageable pageable) {
        return notificationRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDto> getUnreadNotifications(Pageable pageable) {
        return notificationRepository.findByReadFalse(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional
    public void markAsRead(UUID id) {
        NotificationEntity notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        notificationRepository.findAll().forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUnreadCount() {
        return notificationRepository.countByReadFalse();
    }

    private NotificationDto mapToDto(NotificationEntity entity) {
        return NotificationDto.builder()
                .id(entity.getId())
                .type(entity.getType())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .read(entity.getRead())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}