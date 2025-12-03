package com.example.microservice_inventory.listener;

import com.example.microservice_inventory.model.ProductEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
public class StockNotificationListener {

    private final RabbitTemplate rabbitTemplate;

    @TransactionalEventListener
    public void handleLowStockEvent(ProductEntity product) {
        if (product.getStock() <= product.getMinStock()) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("productId", product.getId().toString());
            alert.put("productName", product.getName());
            alert.put("currentStock", product.getStock());
            alert.put("minStock", product.getMinStock());

            rabbitTemplate.convertAndSend("stock.exchange", "stock.low", alert);
            log.info("Low stock alert sent for product: {}", product.getName());
        }
    }
}