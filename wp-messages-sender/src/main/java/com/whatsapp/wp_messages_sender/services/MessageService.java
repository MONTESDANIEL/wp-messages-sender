package com.whatsapp.wp_messages_sender.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.whatsapp.wp_messages_sender.entities.Instance;
import com.whatsapp.wp_messages_sender.entities.Message;

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

    public Mono<String> sendMediaToExternalApi(Message message) {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();
        return webClient.post()
                .uri("/message/sendMedia/{instance}", message.getInstance())
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .header("apikey", apiKey)
                .bodyValue(buildJsonBody(message))
                .retrieve()
                .bodyToMono(String.class);
    }

    private Map<String, Object> buildJsonBody(Message message) {
        return Map.of(
                "number", message.getNumberRecipient(),
                "mediatype", message.getMediatype(),
                "mimetype", message.getMimetype(),
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
