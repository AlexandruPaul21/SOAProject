package com.ticketflash.inventoryservice;

import com.ticketflash.inventoryservice.domain.Item;
import com.ticketflash.inventoryservice.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(ItemRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Item(null, "Coldplay Concert", "Live in London", 150.00, 100));
                repository.save(new Item(null, "Champions League Final", "Wembley Stadium", 300.00, 50));
                repository.save(new Item(null, "Super Bowl Final", "The most watched from USA", 3000.00, 200));
            }
        };
    }
}
