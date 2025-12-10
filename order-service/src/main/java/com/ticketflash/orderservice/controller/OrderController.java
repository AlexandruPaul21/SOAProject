package com.ticketflash.orderservice.controller;

import com.ticketflash.orderservice.dto.OrderEvent;
import com.ticketflash.orderservice.entity.Order;
import com.ticketflash.orderservice.rabbitmq.producer.OrderProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderProducer orderProducer;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public String placeOrder(@RequestBody Order order) {
        order.setOrderId(UUID.randomUUID().toString());
        order.setStatus("PENDING");

        OrderEvent event = new OrderEvent();
        event.setStatus("PENDING");
        event.setMessage("Order committed, please update stock");
        event.setItemId(order.getItemId());
        event.setQuantity(order.getQuantity());

        orderProducer.sendMessage(event);
        String notification = "New Ticket Sold! Item ID: " + order.getItemId();
        messagingTemplate.convertAndSend("/topic/orders", notification);

        return "Order Placed Successfully!";
    }
}
