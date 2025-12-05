package com.example.microservice_notifications.service;


import com.example.microservice_notifications.dto.NotificationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(NotificationDto notification) {
        try {
            messagingTemplate.convertAndSend("/topic/notifications", notification);
            log.info("Notification sent via WebSocket: {}", notification.getTitle());
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification", e);
        }
    }
}