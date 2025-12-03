package com.example.microservice_inventory.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String STOCK_EXCHANGE = "stock.exchange";
    public static final String LOW_STOCK_QUEUE = "low.stock.queue";
    public static final String LOW_STOCK_ROUTING_KEY = "stock.low";

    @Bean
    public Exchange stockExchange() {
        return ExchangeBuilder.topicExchange(STOCK_EXCHANGE).durable(true).build();
    }

    @Bean
    public Queue lowStockQueue() {
        return QueueBuilder.durable(LOW_STOCK_QUEUE).build();
    }

    @Bean
    public Binding lowStockBinding() {
        return BindingBuilder
                .bind(lowStockQueue())
                .to(stockExchange())
                .with(LOW_STOCK_ROUTING_KEY)
                .noargs();
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        ObjectMapper mapper = JsonMapper.builder()
                .addModule(new JavaTimeModule()) // Soporte LocalDate, LocalDateTime
                .build();
        return new Jackson2JsonMessageConverter(mapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
