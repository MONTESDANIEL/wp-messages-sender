package com.whatsapp.wp_messages_queue.entities;

import lombok.Data;

@Data
public class TextMessage {
    private String number; // Número de teléfono del destinatario
    private String instance; // Instancia del remitente
    private String text; // Texto del mensaje
}
