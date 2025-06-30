package com.whatsapp.wp_messages_queue.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.whatsapp.wp_messages_queue.entities.MediaMessage;
import com.whatsapp.wp_messages_queue.entities.TextMessage;
import com.whatsapp.wp_messages_queue.services.QueueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages-queue")
public class MessageController {

    @Autowired
    private QueueService queueService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/addMessages")
    public ResponseEntity<String> sendMessages(@RequestBody List<Object> messages) {
        for (Object message : messages) {
            try {
                if (message.toString().contains("media")) {
                    MediaMessage mediaMessage = objectMapper.convertValue(message, MediaMessage.class);
                    queueService.enqueueMediaMessage(mediaMessage);
                } else {
                    TextMessage textMessage = objectMapper.convertValue(message, TextMessage.class);
                    queueService.enqueueTextMessage(textMessage);
                }
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body("Error processing message: " + e.getMessage());
            }
        }
        return ResponseEntity.ok("Messages enqueued successfully.");
    }
}
