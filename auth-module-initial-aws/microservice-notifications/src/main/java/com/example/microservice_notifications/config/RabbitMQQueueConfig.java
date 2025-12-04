package com.example.microservice_notifications.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQQueueConfig {

    public static final String BOOKING_EVENTS_QUEUE = "booking.events.queue";
    public static final String BOOKING_EXCHANGE = "booking.exchange";

    @Bean
    public Queue bookingEventsQueue() {
        return QueueBuilder.durable(BOOKING_EVENTS_QUEUE).build();
    }

    @Bean
    public Exchange bookingExchange() {
        return ExchangeBuilder.topicExchange(BOOKING_EXCHANGE).durable(true).build();
    }

    @Bean
    public Binding bookingBinding() {
        return BindingBuilder
                .bind(bookingEventsQueue())
                .to(bookingExchange())
                .with("booking.*")
                .noargs();
    }
}