package com.ticketflash.functionservice.function;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.ticketflash.functionservice.dto.OrderEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;
import java.util.function.Consumer;

@Configuration
@Slf4j
public class TicketFunction {

    // Define a constant folder for storage
    public static final String STORAGE_DIR = "generated-tickets";

    @Bean
    public Consumer<OrderEvent> generateTicket() {
        return this::createPdf;
    }

    private void createPdf(OrderEvent event) {
        Document document = new Document();
        try {
            // Ensure directory exists
            File directory = new File(STORAGE_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Create File Path: generated-tickets/ticket_123_abc.pdf
            String fileName = "ticket_" + event.getItemId() + "_" + UUID.randomUUID().toString().substring(0, 8) + ".pdf";
            File file = new File(directory, fileName);

            PdfWriter.getInstance(document, new FileOutputStream(file));

            document.open();

            // Fancy Header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, new java.awt.Color(128, 0, 128));
            Paragraph title = new Paragraph("TicketFlash Official Ticket", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("\n"));

            // Ticket Details
            Font contentFont = FontFactory.getFont(FontFactory.COURIER, 16);
            document.add(new Paragraph("Event ID:   " + event.getItemId(), contentFont));
            document.add(new Paragraph("Admit:      " + event.getQuantity(), contentFont));
            document.add(new Paragraph("Issue Date: " + new java.util.Date(), contentFont));
            document.add(new Paragraph("Signature:  " + UUID.randomUUID(), contentFont));

            document.add(new Paragraph("\n--------------------------------------------------\n"));
            document.add(new Paragraph("Valid for one entry only."));

            document.close();
            log.info("PDF Generated: {}", file.getAbsolutePath());

        } catch (DocumentException | IOException e) {
            log.error("FaaS Error", e);
        }
    }
}
