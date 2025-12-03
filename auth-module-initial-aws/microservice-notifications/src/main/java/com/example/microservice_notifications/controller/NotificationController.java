package com.example.microservice_notifications.controller;

import com.example.microservice_notifications.dto.NotificationDto;
import com.example.microservice_notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationDto>> getAllNotifications(Pageable pageable) {
        return ResponseEntity.ok(notificationService.getAllNotifications(pageable));
    }

    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationDto>> getUnreadNotifications(Pageable pageable) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(pageable));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(notificationService.getUnreadCount());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.noContent().build();
    }
}