package com.whatsapp.wp_messages_queue.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.whatsapp.wp_messages_queue.entities.MediaMessage;
import com.whatsapp.wp_messages_queue.entities.TextMessage;
import com.whatsapp.wp_messages_queue.services.QueueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages-queue")
public class QueueController {

    @Autowired
    private QueueService queueService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Endpoint para agregar mensajes a la cola.
     */
    @PostMapping("/addMessages/{instance}")
    public ResponseEntity<String> enqueueMessages(@RequestBody List<Object> messages, @PathVariable String instance) {
        try {
            for (Object rawMessage : messages) {
                // Detectar el tipo de mensaje
                if (rawMessage instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> messageMap = (Map<String, Object>) rawMessage;

                    if (messageMap.containsKey("mediatype")) {
                        MediaMessage mediaMessage = objectMapper.convertValue(messageMap, MediaMessage.class);
                        queueService.enqueueMessage(mediaMessage, instance, MediaMessage.class);
                    } else if (messageMap.containsKey("text")) {
                        TextMessage textMessage = objectMapper.convertValue(messageMap, TextMessage.class);
                        queueService.enqueueMessage(textMessage, instance, TextMessage.class);
                    } else {
                        throw new IllegalArgumentException("Unknown message type: " + messageMap);
                    }
                } else {
                    throw new IllegalArgumentException("Invalid message format: " + rawMessage);
                }
            }
            return ResponseEntity.ok("Messages enqueued successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing message: " + e.getMessage());
        }
    }

    /**
     * Endpoint para obtener mensajes de texto en la cola por instancia.
     */
    @GetMapping("/queue/text/{instance}")
    public ResponseEntity<List<TextMessage>> getTextQueue(@PathVariable String instance) {
        List<TextMessage> messages = queueService.getMessagesFromQueue(instance, TextMessage.class);
        return ResponseEntity.ok(messages);
    }

    /**
     * Endpoint para obtener mensajes multimedia en la cola por instancia.
     */
    @GetMapping("/queue/media/{instance}")
    public ResponseEntity<List<MediaMessage>> getMediaQueue(@PathVariable String instance) {
        List<MediaMessage> messages = queueService.getMessagesFromQueue(instance, MediaMessage.class);
        return ResponseEntity.ok(messages);
    }
}
