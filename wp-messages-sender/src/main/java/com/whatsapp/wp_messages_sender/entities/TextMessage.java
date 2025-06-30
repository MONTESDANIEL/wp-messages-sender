package com.whatsapp.wp_messages_sender.entities;

import lombok.Data;

@Data
public class TextMessage {
    private String number; // Phone number of the recipient
    private String instance; // Phone number of the sender
    private String text; // Caption for the media
}
