package com.whatsapp.wp_messages_sender.controllers;

import com.whatsapp.wp_messages_sender.entities.Instance;
import com.whatsapp.wp_messages_sender.entities.Message;
import com.whatsapp.wp_messages_sender.services.MessageService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping("/send-media")
    public Mono<ResponseEntity<String>> handleRequest(@RequestBody Message message) {
        try {
            return messageService.sendMediaToExternalApi(message)
                    .map(response -> ResponseEntity.ok("Mensaje enviado correctamente: " + response))
                    .onErrorResume(error -> Mono.just(ResponseEntity.status(500)
                            .body("Error al enviar el mensaje: " + error.getMessage())));
        } catch (Exception e) {
            return Mono.just(ResponseEntity.status(500).body("Error interno: " + e.getMessage()));
        }
    }

    @PostMapping("/send-media-masive")
    public Mono<ResponseEntity<String>> handleRequest(@RequestBody List<Message> messages) {
        return Flux.fromIterable(messages)
                .flatMap(messageService::sendMediaToExternalApi)
                .collectList()
                .map(responses -> ResponseEntity.ok("Mensajes enviados correctamente: " + responses))
                .onErrorResume(error -> Mono.just(ResponseEntity.status(500)
                        .body("Error al enviar los mensajes: " + error.getMessage())));
    }

    @GetMapping("/fetch-instances")
    public Mono<List<Instance>> fetchAllInstances() {
        Mono<List<Instance>> instancesMono = messageService.fetchAllInstances();
        System.out.println("Fetching all instances...");
        instancesMono.subscribe(instances -> {
            System.out.println("Fetched instances: " + instances);
        }, error -> {
            System.err.println("Error fetching instances: " + error.getMessage());
        });
        return instancesMono;
    }
}
