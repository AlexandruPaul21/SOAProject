package com.ticketflash.inventoryservice.rabbitmq.consumer;

import com.ticketflash.inventoryservice.domain.Item;
import com.ticketflash.inventoryservice.rabbitmq.dto.OrderEvent;
import com.ticketflash.inventoryservice.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(InventoryConsumer.class);
    private final ItemRepository itemRepository;

    @RabbitListener(queues = "stock_queue")
    public void consume(OrderEvent event) {
        LOGGER.info(String.format("Received message -> %s", event.toString()));

        // Logic: Find item and reduce stock
        Item item = itemRepository.findById(event.getItemId()).orElse(null);

        if (item != null) {
            int newQuantity = item.getQuantity() - event.getQuantity();
            if (newQuantity >= 0) {
                item.setQuantity(newQuantity);
                itemRepository.save(item);
                LOGGER.info("Stock updated for Item ID: " + event.getItemId());
            } else {
                LOGGER.warn("Insufficient stock for Item ID: " + event.getItemId());
                // In a real app, you would send a "OrderFailedEvent" back to a different queue
            }
        }
    }
}
