package com.ticketflash.orderservice.rabbitmq.producer;

import com.ticketflash.orderservice.dto.OrderEvent;
import com.ticketflash.orderservice.rabbitmq.config.RabbitMqConfig;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderProducer.class);
    private final RabbitTemplate rabbitTemplate;

    public void sendMessage(OrderEvent event) {
        LOGGER.info(String.format("Order placed -> Sending message to RabbitMQ: %s", event.toString()));

        rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.ROUTING_KEY, event);
    }
}
