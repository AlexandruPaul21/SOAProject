package com.ticketflash.functionservice.controller;

import com.ticketflash.functionservice.function.TicketFunction;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @GetMapping
    public List<String> listTickets() {
        File folder = new File(TicketFunction.STORAGE_DIR);
        File[] files = folder.listFiles((dir, name) -> name.endsWith(".pdf"));

        if (files == null) return List.of("No tickets generated yet");

        return Arrays.stream(files)
                .map(File::getName)
                .collect(Collectors.toList());
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> downloadTicket(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(TicketFunction.STORAGE_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
