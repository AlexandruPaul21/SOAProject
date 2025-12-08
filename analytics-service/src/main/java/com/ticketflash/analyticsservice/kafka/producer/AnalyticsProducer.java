package com.ticketflash.analyticsservice.kafka.producer;

import com.ticketflash.analyticsservice.model.ViewEvent;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(AnalyticsProducer.class);
    private final KafkaTemplate<String, ViewEvent> kafkaTemplate;

    public void sendMessage(ViewEvent event) {
        LOGGER.info(String.format("Producing Analytics Event -> %s", event.toString()));

        Message<ViewEvent> message = MessageBuilder
                .withPayload(event)
                .setHeader(KafkaHeaders.TOPIC, "event_views")
                .build();

        kafkaTemplate.send(message);
    }
}
