package com.whatsapp.wp_messages_sender.entities;

import lombok.Data;

@Data
public class TextMessage {
    private String id; // Unique identifier for the message
    private String numberRecipient; // Phone number of the recipient
    private String instance; // Phone number of the sender
    private String caption; // Caption for the media
}
