package com.ticketflash.analyticsservice.kafka.consumer;

import com.ticketflash.analyticsservice.model.ViewEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AnalyticsConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(AnalyticsConsumer.class);

    // In-memory store for demo purposes, can be replaced by DB store, cache
    private final Map<String, Integer> pageViewCounts = new ConcurrentHashMap<>();

    @KafkaListener(topics = "event_views", groupId = "analytics_group")
    public void consume(ViewEvent event) {
        LOGGER.info(String.format("Consuming Event -> %s", event.toString()));
        pageViewCounts.merge(event.getEventName(), 1, Integer::sum);
        LOGGER.info("Current Views for " + event.getEventName() + ": " + pageViewCounts.get(event.getEventName()));
    }

    public Map<String, Integer> getStats() {
        return pageViewCounts;
    }
}
