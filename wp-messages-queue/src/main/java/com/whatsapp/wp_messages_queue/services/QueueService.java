package com.whatsapp.wp_messages_queue.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.whatsapp.wp_messages_queue.entities.MediaMessage;
import com.whatsapp.wp_messages_queue.entities.TextMessage;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Service
public class QueueService {

    @Autowired
    private JedisPool jedisPool;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String TEXT_QUEUE_PREFIX = "queue:text:";
    private static final String MEDIA_QUEUE_PREFIX = "queue:media:";

    public void enqueueTextMessage(TextMessage message) throws JsonProcessingException {
        String queueKey = TEXT_QUEUE_PREFIX + message.getInstance();
        String messageJson = objectMapper.writeValueAsString(message);
        System.out.println("Enqueuing TextMessage to queue: " + queueKey + " | Message: " + messageJson);
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.rpush(queueKey, messageJson);
            System.out.println("TextMessage successfully enqueued to " + queueKey);
        } catch (Exception e) {
            System.err.println("Failed to enqueue TextMessage to " + queueKey + ": " + e.getMessage());
            throw e;
        }
    }

    public void enqueueMediaMessage(MediaMessage message) throws JsonProcessingException {
        try (Jedis jedis = jedisPool.getResource()) {
            String queueKey = MEDIA_QUEUE_PREFIX + message.getInstance();
            jedis.rpush(queueKey, objectMapper.writeValueAsString(message));
        }
    }

    public List<TextMessage> getMessagesForText(String instance) {
        try (Jedis jedis = jedisPool.getResource()) {
            String key = "queue:text:" + instance;
            if (jedis.exists(key)) {
                List<String> messages = jedis.lrange(key, 0, -1);
                return messages.stream()
                        .map(message -> deserialize(message, TextMessage.class))
                        .collect(Collectors.toList());
            }
            return Collections.emptyList();
        }
    }

    public List<MediaMessage> getMessagesForMedia(String instance) {
        try (Jedis jedis = jedisPool.getResource()) {
            String key = "queue:media:" + instance;
            if (jedis.exists(key)) {
                List<String> messages = jedis.lrange(key, 0, -1);
                return messages.stream()
                        .map(message -> deserialize(message, MediaMessage.class))
                        .collect(Collectors.toList());
            }
            return Collections.emptyList();
        }
    }

    private <T> T deserialize(String message, Class<T> clazz) {
        try {
            return objectMapper.readValue(message, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Error deserializing message: " + e.getMessage(), e);
        }
    }
}
