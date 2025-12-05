package com.example.microservice_booking.listener;

import com.example.microservice_booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Component
public class PaymentEventListener {

    private final BookingService bookingService;

    @RabbitListener(queues = "payment.events.queue")
    public void handlePaymentEvent(Map<String, Object> event) {
        String eventType = (String) event.get("eventType");
        String bookingIdStr = (String) event.get("bookingId");
        String paymentIdStr = (String) event.get("paymentId");

        log.info("📩 Received payment event: {} for booking: {}", eventType, bookingIdStr);

        if (bookingIdStr == null || paymentIdStr == null) {
            log.error("Invalid payment event - missing IDs");
            return;
        }

        UUID bookingId = UUID.fromString(bookingIdStr);
        UUID paymentId = UUID.fromString(paymentIdStr);

        try {
            switch (eventType) {
                case "PAYMENT_COMPLETED":
                    log.info("Payment completed - Confirming booking: {}", bookingId);
                    bookingService.confirmBooking(bookingId, paymentId);
                    break;

                case "PAYMENT_FAILED":
                case "PAYMENT_CANCELLED":
                    log.warn("Payment failed/cancelled - Cancelling booking: {}", bookingId);
                    bookingService.cancelBooking(bookingId);
                    break;

                default:
                    log.debug("Ignoring payment event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Error processing payment event: {}", e.getMessage(), e);
        }
    }
}