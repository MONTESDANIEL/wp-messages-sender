package com.whatsapp.wp_messages_sender.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.whatsapp.wp_messages_sender.entities.Instance;
import com.whatsapp.wp_messages_sender.entities.MediaMessage;
import com.whatsapp.wp_messages_sender.entities.TextMessage;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final WebClient.Builder webClientBuilder;

    @Value("${evolution.api.apikey}")
    private String apiKey;

    @Value("${evolution.api.baseurl}")
    private String baseUrl;

    public Mono<String> sendMediaToExternalApi(MediaMessage message) {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();
        return webClient.post()
                .uri("/message/sendMedia/{instance}", message.getInstance())
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .header("apikey", apiKey)
                .bodyValue(buildMediaJsonBody(message))
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(error -> System.err
                        .println("Error al enviar mensaje: " + message + ". Error: " + error.getMessage()));
    }

    public Mono<String> sendTextToExternalApi(TextMessage message) {
        System.out.println("Enviando mensaje de texto: " + buildTextJsonBody(message));
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();
        return webClient.post()
                .uri("/message/sendText/{instance}", message.getInstance())
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .header("apikey", apiKey)
                .bodyValue(buildTextJsonBody(message))
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(error -> System.err
                        .println("Error al enviar mensaje: " + message + ". Error: " + error.getMessage()));
    }

    private Map<String, Object> buildTextJsonBody(TextMessage message) {
        return Map.of(
                "number", message.getNumberRecipient(),
                "text", message.getCaption());
    }

    private Map<String, Object> buildMediaJsonBody(MediaMessage message) {
        return Map.of(
                "number", message.getNumberRecipient(),
                "mediatype", message.getMediatype(),
                "caption", message.getCaption(),
                "media", message.getMedia());
    }

    public Mono<List<Instance>> fetchAllInstances() {
        WebClient webClient = webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("apikey", apiKey)
                .build();

        return webClient.get()
                .uri("/instance/fetchInstances")
                .retrieve()
                .bodyToFlux(Instance.class)
                .collectList()
                .doOnError(error -> System.err.println("Error fetching instances: " + error.getMessage()))
                .onErrorResume(e -> {
                    System.err.println("Returning empty list due to error: " + e.getMessage());
                    return Mono.just(List.of());
                });
    }

}
