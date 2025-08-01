package com.whatsapp.wp_messages_sender.entities;

import lombok.Data;

@Data
public class MediaMessage {
    private Long id; // Unique identifier for the media message
    private String number; // Phone number of the recipient
    private String instance; // Phone number of the sender
    private String mediatype; // Type of media (e.g., image, video, document)
    private String caption; // Caption for the media
    private String media; // Base64 encoded media content or URL
    private String status; // Status of the message (e.g., pending, sent, failed)
}