package com.example.microservice_change.config;

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

    public static final String CHANGE_EXCHANGE = "change.exchange";
    public static final String CHANGE_EVENTS_QUEUE = "change.events.queue";
    public static final String LOW_DENOMINATION_QUEUE = "low.denomination.queue";

    public static final String CHANGE_EVENTS_ROUTING_KEY = "change.events";
    public static final String LOW_DENOMINATION_ROUTING_KEY = "denomination.low_stock";

    @Bean
    public Exchange changeExchange() {
        return ExchangeBuilder.topicExchange(CHANGE_EXCHANGE).durable(true).build();
    }

    @Bean
    public Queue changeEventsQueue() {
        return QueueBuilder.durable(CHANGE_EVENTS_QUEUE).build();
    }

    @Bean
    public Queue lowDenominationQueue() {
        return QueueBuilder.durable(LOW_DENOMINATION_QUEUE).build();
    }

    @Bean
    public Binding changeEventsBinding() {
        return BindingBuilder
                .bind(changeEventsQueue())
                .to(changeExchange())
                .with(CHANGE_EVENTS_ROUTING_KEY)
                .noargs();
    }

    @Bean
    public Binding lowDenominationBinding() {
        return BindingBuilder
                .bind(lowDenominationQueue())
                .to(changeExchange())
                .with(LOW_DENOMINATION_ROUTING_KEY)
                .noargs();
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        ObjectMapper mapper = JsonMapper.builder()
                .addModule(new JavaTimeModule())
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