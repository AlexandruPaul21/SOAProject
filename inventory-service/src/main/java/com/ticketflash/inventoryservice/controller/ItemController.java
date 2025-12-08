package com.ticketflash.inventoryservice.controller;

import com.ticketflash.inventoryservice.domain.Item;
import com.ticketflash.inventoryservice.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class ItemController {

    private final ItemRepository itemRepository;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Item createItem(@RequestBody Item item) {
        return itemRepository.save(item);
    }

    // Used by Order Service to check stock
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Item getItem(@PathVariable Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }
}
