package com.whatsapp.wp_messages_queue.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.whatsapp.wp_messages_queue.entities.MediaMessage;
import com.whatsapp.wp_messages_queue.entities.TextMessage;
import com.whatsapp.wp_messages_queue.services.QueueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/messages-queue")
public class QueueController {

    @Autowired
    private QueueService queueService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/addMessages")
    public Mono<ResponseEntity<String>> sendMessages(@RequestBody List<Object> messages) {
        return Mono.fromCallable(() -> {
            for (Object message : messages) {
                if (message.toString().contains("media")) {
                    MediaMessage mediaMessage = objectMapper.convertValue(message, MediaMessage.class);
                    queueService.enqueueMediaMessage(mediaMessage);
                } else {
                    TextMessage textMessage = objectMapper.convertValue(message, TextMessage.class);
                    queueService.enqueueTextMessage(textMessage);
                }
            }
            return ResponseEntity.ok("Messages enqueued successfully.");
        }).onErrorResume(
                e -> Mono.just(ResponseEntity.badRequest().body("Error processing message: " + e.getMessage())));
    }

    @GetMapping("/queue/text/{instance}")
    public Mono<ResponseEntity<List<TextMessage>>> getTextQueueByInstance(@PathVariable String instance) {
        List<TextMessage> messages = queueService.getMessagesForText(instance);
        return Mono.just(ResponseEntity.ok(messages));
    }

    @GetMapping("/queue/media/{instance}")
    public Mono<ResponseEntity<List<MediaMessage>>> getMediaQueueByInstance(@PathVariable String instance) {
        List<MediaMessage> messages = queueService.getMessagesForMedia(instance);
        return Mono.just(ResponseEntity.ok(messages));
    }

}
