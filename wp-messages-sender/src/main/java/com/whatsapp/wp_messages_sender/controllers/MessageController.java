package com.whatsapp.wp_messages_sender.controllers;

import com.whatsapp.wp_messages_sender.entities.Instance;
import com.whatsapp.wp_messages_sender.entities.MediaMessage;
import com.whatsapp.wp_messages_sender.entities.TextMessage;
import com.whatsapp.wp_messages_sender.services.MessageService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
        private final MessageService messageService;

        @PostMapping("/bulk-text-messages")
        public Mono<ResponseEntity<Map<String, List<Map<String, Object>>>>> handleTextMasiveRequest(
                        @RequestBody List<TextMessage> messages) {
                return Flux.fromIterable(messages)
                                .flatMap(message -> messageService.sendTextToExternalApi(message)
                                                .map(response -> Map.of("status", "success", "message", message,
                                                                "response", response))
                                                .onErrorResume(error -> Mono
                                                                .just(Map.of("status", "error", "message", message,
                                                                                "error", error.getMessage()))))
                                .collectList()
                                .map(results -> ResponseEntity.ok(Map.of(
                                                "success", results.stream()
                                                                .filter(r -> "success".equals(r.get("status")))
                                                                .toList(),
                                                "errors", results.stream()
                                                                .filter(r -> "error".equals(r.get("status")))
                                                                .toList())))
                                .onErrorResume(error -> Mono.just(ResponseEntity.status(500)
                                                .body(Map.of(
                                                                "success", List.of(),
                                                                "errors", List.of(Map.of(
                                                                                "error",
                                                                                "Error procesando los mensajes",
                                                                                "details", error.getMessage()))))));
        }

        @PostMapping("/bulk-media-messages")
        public Mono<ResponseEntity<Map<String, List<Map<String, Object>>>>> handleRequest(
                        @RequestBody List<MediaMessage> messages) {
                return Flux.fromIterable(messages)
                                .flatMap(message -> messageService.sendMediaToExternalApi(message)
                                                .map(response -> Map.of("status", "success", "message", message,
                                                                "response", response))
                                                .onErrorResume(error -> Mono
                                                                .just(Map.of("status", "error", "message", message,
                                                                                "error", error.getMessage()))))
                                .collectList()
                                .map(results -> ResponseEntity.ok(Map.of(
                                                "success", results.stream()
                                                                .filter(r -> "success".equals(r.get("status")))
                                                                .toList(),
                                                "errors", results.stream()
                                                                .filter(r -> "error".equals(r.get("status")))
                                                                .toList())))
                                .onErrorResume(error -> Mono.just(ResponseEntity.status(500)
                                                .body(Map.of(
                                                                "success", List.of(),
                                                                "errors", List.of(Map.of(
                                                                                "error",
                                                                                "Error procesando los mensajes",
                                                                                "details", error.getMessage()))))));
        }

        @GetMapping("/fetch-instances")
        public Mono<List<Instance>> fetchAllInstances() {
                Mono<List<Instance>> instancesMono = messageService.fetchAllInstances();
                return instancesMono;
        }
}
