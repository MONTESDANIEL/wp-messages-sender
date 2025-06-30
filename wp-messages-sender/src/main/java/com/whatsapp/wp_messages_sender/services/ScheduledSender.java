package com.whatsapp.wp_messages_sender.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.whatsapp.wp_messages_sender.entities.MediaMessage;
import com.whatsapp.wp_messages_sender.entities.TextMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Service
public class ScheduledSender {

    private final JedisPool jedisPool;
    private final ObjectMapper objectMapper;
    private final WebClient webClient;

    @Value("${evolution.api.apikey}")
    private String apiKey;

    private static final String TEXT_QUEUE_PREFIX = "queue:text:";
    private static final String MEDIA_QUEUE_PREFIX = "queue:media:";
    private static final long TEXT_DELAY = 2000; // 2 segundos
    private static final long MEDIA_DELAY = 3000; // 3 segundos

    public ScheduledSender(JedisPool jedisPool, ObjectMapper objectMapper, WebClient.Builder webClientBuilder,
            @Value("${evolution.api.baseurl}") String baseUrl) {
        this.jedisPool = jedisPool;
        this.objectMapper = objectMapper;
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    @Scheduled(fixedDelay = 5000) // Intervalo de 5 segundos entre ejecuciones
    public void processQueue() {
        try (Jedis jedis = jedisPool.getResource()) {
            processTextMessages(jedis);
            processMediaMessages(jedis);
        } catch (Exception e) {
            System.err.println("Error al procesar las colas: " + e.getMessage());
        }
    }

    private void processTextMessages(Jedis jedis) throws Exception {
        String textMessageJson = jedis.lpop(TEXT_QUEUE_PREFIX + "WP_DANIEL");
        if (textMessageJson != null) {
            TextMessage textMessage = objectMapper.readValue(textMessageJson, TextMessage.class);
            sendTextMessage(textMessage);
            Thread.sleep(TEXT_DELAY);
        }
    }

    private void processMediaMessages(Jedis jedis) throws Exception {
        String mediaMessageJson = jedis.lpop(MEDIA_QUEUE_PREFIX + "WP_DANIEL");
        if (mediaMessageJson != null) {
            MediaMessage mediaMessage = objectMapper.readValue(mediaMessageJson, MediaMessage.class);
            sendMediaMessage(mediaMessage);
            Thread.sleep(MEDIA_DELAY);
        }
    }

    private void sendTextMessage(TextMessage message) {
        try {
            webClient.post()
                    .uri("/message/sendText/{instance}", message.getInstance())
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .header("apikey", apiKey)
                    .bodyValue(message)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnError(error -> logError("Texto", message, error))
                    .block();
            System.out.println("Texto enviado a: " + message.getNumber());
        } catch (Exception e) {
            logError("Texto", message, e);
        }
    }

    private void sendMediaMessage(MediaMessage message) {
        try {
            webClient.post()
                    .uri("/message/sendMedia/{instance}", message.getInstance())
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .header("apikey", apiKey)
                    .bodyValue(message)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnError(error -> logError("Media", message, error))
                    .block();
            System.out.println("Media enviada a: " + message.getNumber());
        } catch (Exception e) {
            logError("Media", message, e);
        }
    }

    private void logError(String type, Object message, Throwable error) {
        System.err.println("Error al enviar " + type + " - Mensaje: " + message + ". Error: " + error.getMessage());
    }

}
