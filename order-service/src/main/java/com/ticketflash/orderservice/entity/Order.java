package com.ticketflash.orderservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Order {
    private String orderId;
    private Long itemId;
    private int quantity;
    private String userId;
    private LocalDateTime orderTime;
    private String status; // PENDING, CONFIRMED
}
