package com.ticketflash.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderEvent {
    private String status; // PENDING, COMPLETED
    private String message;
    private Long itemId;
    private int quantity;
}
