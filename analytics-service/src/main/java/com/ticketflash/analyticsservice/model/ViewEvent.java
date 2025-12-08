package com.ticketflash.analyticsservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViewEvent {
    private String eventName;
    private String userId;
    private long timestamp;
}
