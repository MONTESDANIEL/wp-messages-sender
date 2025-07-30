package com.whatsapp.wp_messages_queue.entities;

import lombok.Data;

@Data
public class TextMessageDTO {
    private Long id; // Unique identifier for the message
    private String number; // Phone number of the recipient
    private String instance; // Phone number of the sender
    private String text; // Message text
    private String status; // Status of the message
}
