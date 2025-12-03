package com.example.auth.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/activity")
    @SendTo("/topic/activity")
    public Map<String, Object> handleActivity(Map<String, Object> activity) {
        activity.put("timestamp", LocalDateTime.now());
        log.info("Activity received: {}", activity);
        return activity;
    }

    public void sendUserNotification(String username, String message) {
        messagingTemplate.convertAndSendToUser(
                username,
                "/queue/notifications",
                Map.of("message", message, "timestamp", LocalDateTime.now())
        );
    }

    public void broadcastActivity(String action, String username) {
        messagingTemplate.convertAndSend(
                "/topic/activity",
                Map.of("action", action, "username", username, "timestamp", LocalDateTime.now())
        );
    }
}