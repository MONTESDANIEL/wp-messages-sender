package com.whatsapp.wp_messages_sender.entities;

import lombok.Data;

@Data
public class TextMessage {
    private Long id; // Unique identifier for the text message
    private String number; // Phone number of the recipient
    private String instance; // Phone number of the sender
    private String text; // Caption for the media
    private String status; // Status of the message (e.g., pending, sent, failed)
}
