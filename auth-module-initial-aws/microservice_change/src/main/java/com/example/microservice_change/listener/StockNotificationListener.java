package com.example.microservice_change.listener;

import com.example.microservice_change.dto.DenominationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class StockNotificationListener {

    @RabbitListener(queues = "low.denomination.queue")
    public void handleLowDenominationStock(DenominationDto denomination) {
        log.warn("LOW STOCK ALERT: Denomination {} {} - Current: {}, Min: {}",
                denomination.getValue(),
                denomination.getType(),
                denomination.getQuantity(),
                denomination.getMinQuantity());
    }
}
