package com.example.microservice_notifications.listener;

import com.example.microservice_notifications.dto.NotificationDto;
import com.example.microservice_notifications.model.NotificationType;
import com.example.microservice_notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
public class BookingEventListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = "booking.events.queue")
    public void handleBookingEvent(Map<String, Object> event) {
        String action = (String) event.get("action");
        String bookingRef = (String) event.get("bookingReference");

        log.info("📩 Received booking event: {} for booking: {}", action, bookingRef);

        NotificationDto notification = null;

        switch (action) {
            case "booking.created":
                notification = NotificationDto.builder()
                        .type(NotificationType.BOOKING_CREATED)
                        .title("Reserva Creada")
                        .message("Reserva " + bookingRef + " creada exitosamente. Complete el pago en 15 minutos.")
                        .build();
                break;

            case "booking.confirmed":
                notification = NotificationDto.builder()
                        .type(NotificationType.BOOKING_CONFIRMED)
                        .title("Reserva Confirmada")
                        .message("¡Reserva " + bookingRef + " confirmada! Su vuelo está listo.")
                        .build();
                break;

            case "booking.cancelled":
                notification = NotificationDto.builder()
                        .type(NotificationType.BOOKING_CANCELLED)
                        .title("Reserva Cancelada")
                        .message("La reserva " + bookingRef + " ha sido cancelada.")
                        .build();
                break;

            case "booking.expired":
                notification = NotificationDto.builder()
                        .type(NotificationType.BOOKING_EXPIRED)
                        .title("Reserva Expirada")
                        .message("La reserva " + bookingRef + " ha expirado. Los asientos han sido liberados.")
                        .build();
                break;
        }

        if (notification != null) {
            notificationService.createNotification(notification);
        }
    }
}