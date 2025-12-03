package com.example.microservice_notifications.listener;


import com.example.microservice_notifications.dto.NotificationDto;
import com.example.microservice_notifications.dto.StockAlertDto;
import com.example.microservice_notifications.model.NotificationType;
import com.example.microservice_notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class StockAlertListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = "low.stock.queue")
    public void handleLowStockAlert(StockAlertDto alert) {
        log.info("Received low stock alert for product: {}", alert.getProductName());

        NotificationDto notification = NotificationDto.builder()
                .type(NotificationType.LOW_STOCK)
                .title("Alerta de Stock Bajo")
                .message(String.format(
                        "El producto '%s' (SKU: %s) tiene stock bajo. Stock actual: %d, Mínimo: %d",
                        alert.getProductName(),
                        alert.getSku(),
                        alert.getCurrentStock(),
                        alert.getMinStock()
                ))
                .build();

        notificationService.createNotification(notification);
    }
}