package com.ticketflash.analyticsservice.kafka.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic viewTopic() {
        return TopicBuilder.name("event_views")
                .partitions(3) // parallel processing
                .replicas(1)
                .build();
    }
}
