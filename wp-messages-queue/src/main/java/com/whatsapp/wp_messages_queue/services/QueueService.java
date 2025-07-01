package com.whatsapp.wp_messages_queue.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.whatsapp.wp_messages_queue.entities.*;
import com.whatsapp.wp_messages_queue.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Text;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.print.attribute.standard.Media;

@Service
public class QueueService {

    @Autowired
    private JedisPool jedisPool;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private TextMessageRepository textMessageRepository;

    @Autowired
    private MediaMessageRepository mediaMessageRepository;

    private static final String TEXT_QUEUE_PREFIX = "queue:text:";
    private static final String MEDIA_QUEUE_PREFIX = "queue:media:";

    /**
     * Enqueues a message (text or media) to the Redis queue and saves it to the
     * database.
     */
    public <T> void enqueueMessage(T message, String instance, Class<T> type) throws JsonProcessingException {
        Queue queue = getOrCreateQueue(instance);

        if (type == TextMessage.class) {
            TextMessage textMessage = (TextMessage) message;
            textMessage.setQueueId(queue.getId());
            textMessage.setStatus("pending");
            textMessageRepository.save(textMessage);

            TextMessageDTO textMessageDTO = new TextMessageDTO();
            textMessageDTO.setNumber(textMessage.getNumber());
            textMessageDTO.setInstance(instance);
            textMessageDTO.setText(textMessage.getText());
            System.out.println("Preparing to enqueue text message: " + textMessageDTO);

            enqueueToRedis(TEXT_QUEUE_PREFIX + instance, textMessageDTO);
        } else if (type == MediaMessage.class) {
            MediaMessage mediaMessage = (MediaMessage) message;
            mediaMessage.setQueueId(queue.getId());
            mediaMessage.setStatus("pending");
            mediaMessageRepository.save(mediaMessage);

            MediaMessageDTO mediaMessageDTO = new MediaMessageDTO();
            mediaMessageDTO.setNumber(mediaMessage.getNumber());
            mediaMessageDTO.setInstance(instance);
            mediaMessageDTO.setMediatype(mediaMessage.getMediatype());
            mediaMessageDTO.setCaption(mediaMessage.getCaption());
            mediaMessageDTO.setMedia(mediaMessage.getMedia());
            System.out.println("Preparing to enqueue media message: " + mediaMessageDTO);

            enqueueToRedis(MEDIA_QUEUE_PREFIX + instance, mediaMessageDTO);
        }
    }

    /**
     * Retrieves messages from the Redis queue for the specified instance.
     */
    public <T> List<T> getMessagesFromQueue(String instance, Class<T> type) {
        String key = (type == TextMessage.class) ? TEXT_QUEUE_PREFIX + instance : MEDIA_QUEUE_PREFIX + instance;
        return getMessagesFromRedis(key, type);
    }

    /**
     * Retrieves or creates a queue for the given instance.
     */
    private Queue getOrCreateQueue(String instance) {
        Queue queue = queueRepository.findByInstance(instance);
        if (queue == null) {
            queue = new Queue();
            queue.setInstance(instance);
            queue = queueRepository.save(queue);
        }
        return queue;
    }

    /**
     * Pushes a message to the Redis queue.
     */
    private <T> void enqueueToRedis(String queueKey, T message) throws JsonProcessingException {
        String messageJson = objectMapper.writeValueAsString(message);
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.rpush(queueKey, messageJson);
        } catch (Exception e) {
            throw new RuntimeException("Failed to enqueue message to Redis: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieves messages from Redis for the specified key and deserializes them
     * into the specified type.
     */
    private <T> List<T> getMessagesFromRedis(String key, Class<T> clazz) {
        try (Jedis jedis = jedisPool.getResource()) {
            if (jedis.exists(key)) {
                List<String> messages = jedis.lrange(key, 0, -1);
                return messages.stream()
                        .map(message -> deserialize(message, clazz))
                        .collect(Collectors.toList());
            }
            return Collections.emptyList();
        }
    }

    /**
     * Deserializes a message from JSON into the specified type.
     */
    private <T> T deserialize(String message, Class<T> clazz) {
        try {
            return objectMapper.readValue(message, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Error deserializing message: " + e.getMessage(), e);
        }
    }

}
