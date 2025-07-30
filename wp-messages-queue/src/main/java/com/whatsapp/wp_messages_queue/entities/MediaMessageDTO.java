package com.whatsapp.wp_messages_queue.entities;

import lombok.Data;

@Data
public class MediaMessageDTO {
    private Long id; // Unique identifier for the message
    private String number; // Phone number of the recipient
    private String instance; // Phone number of the sender
    private String mediatype; // Type of media
    private String caption; // Caption for the media
    private String media; // Media URL or Base64
    private String status; // Status of the message
}
