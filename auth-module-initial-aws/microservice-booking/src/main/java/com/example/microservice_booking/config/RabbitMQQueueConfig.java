package com.example.microservice_booking.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQQueueConfig {

    public static final String PAYMENT_EVENTS_QUEUE = "payment.events.queue";
    public static final String PAYMENT_EXCHANGE = "payment.exchange";
    public static final String PAYMENT_ROUTING_KEY = "payment.events";

    @Bean
    public Queue paymentEventsQueue() {
        return QueueBuilder.durable(PAYMENT_EVENTS_QUEUE).build();
    }

    @Bean
    public Exchange paymentExchange() {
        return ExchangeBuilder.topicExchange(PAYMENT_EXCHANGE).durable(true).build();
    }

    @Bean
    public Binding paymentBinding() {
        return BindingBuilder
                .bind(paymentEventsQueue())
                .to(paymentExchange())
                .with(PAYMENT_ROUTING_KEY)
                .noargs();
    }
}