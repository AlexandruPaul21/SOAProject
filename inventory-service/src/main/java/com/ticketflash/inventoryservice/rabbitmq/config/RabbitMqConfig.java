package com.ticketflash.inventoryservice.rabbitmq.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {
    public static final String QUEUE = "stock_queue";

    // 1. Define the Queue so this service can create it if missing
    @Bean
    public Queue queue() {
        return new Queue(QUEUE);
    }

    // 2. We need the JSON converter to turn the message back into a Java Object
    @Bean
    public MessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }
}
