package com.ticketflash.analyticsservice.controller;

import com.ticketflash.analyticsservice.kafka.consumer.AnalyticsConsumer;
import com.ticketflash.analyticsservice.kafka.producer.AnalyticsProducer;
import com.ticketflash.analyticsservice.model.ViewEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsProducer analyticsProducer;
    private final AnalyticsConsumer analyticsConsumer;

    @PostMapping("/view")
    public ResponseEntity<String> recordView(@RequestBody ViewEvent event) {
        event.setTimestamp(System.currentTimeMillis());
        analyticsProducer.sendMessage(event);
        return ResponseEntity.ok("Event Queued for Analytics");
    }

    @GetMapping("/stats")
    public Map<String, Integer> getStats() {
        return analyticsConsumer.getStats();
    }
}
