package com.ticketflash.functionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderEvent {
    private String status;
    private String message;
    private Long itemId;
    private int quantity;
}
