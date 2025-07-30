package com.whatsapp.wp_messages_queue.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.whatsapp.wp_messages_queue.entities.*;
import com.whatsapp.wp_messages_queue.repositories.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPubSub;

import jakarta.annotation.PostConstruct;

@Service
public class QueueMessagesService {

    @Autowired
    private JedisPool jedisPool;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TextMessageRepository textMessageRepository;

    @Autowired
    private MediaMessageRepository mediaMessageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private static final String TEXT_QUEUE_PREFIX = "queue:text:";
    private static final String MEDIA_QUEUE_PREFIX = "queue:media:";
    private static final String STATUS_CHANNEL = "message_status_channel";

    @PostConstruct
    public void initialize() {
        System.out.println("Suscripción inicializada al canal de estados.");
        subscribeToStatusUpdates();
    }

    public <T> void enqueueMessage(T message, String instance, Class<T> type) throws JsonProcessingException {

        if (type == TextMessage.class) {
            TextMessage textMessage = (TextMessage) message;
            textMessage.setStatus("pending");
            textMessageRepository.save(textMessage);

            TextMessageDTO textMessageDTO = new TextMessageDTO();
            textMessageDTO.setId(textMessage.getId());
            textMessageDTO.setNumber(textMessage.getNumber());
            textMessageDTO.setInstance(instance);
            textMessageDTO.setText(textMessage.getText());
            textMessageDTO.setStatus(textMessage.getStatus());
            enqueueToRedis(TEXT_QUEUE_PREFIX + instance, textMessageDTO);

            publishMessageStatus(textMessageDTO);
        } else if (type == MediaMessage.class) {
            MediaMessage mediaMessage = (MediaMessage) message;
            mediaMessage.setStatus("pending");
            mediaMessageRepository.save(mediaMessage);

            MediaMessageDTO mediaMessageDTO = new MediaMessageDTO();
            mediaMessageDTO.setId(mediaMessage.getId());
            mediaMessageDTO.setNumber(mediaMessage.getNumber());
            mediaMessageDTO.setInstance(instance);
            mediaMessageDTO.setMediatype(mediaMessage.getMediatype());
            mediaMessageDTO.setCaption(mediaMessage.getCaption());
            mediaMessageDTO.setMedia(mediaMessage.getMedia());
            mediaMessageDTO.setStatus(mediaMessage.getStatus());
            enqueueToRedis(MEDIA_QUEUE_PREFIX + instance, mediaMessageDTO);

            publishMessageStatus(mediaMessageDTO);
        }
    }

    private <T> void publishMessageStatus(T message) throws JsonProcessingException {
        try (Jedis jedis = jedisPool.getResource()) {
            String messageJson = objectMapper.writeValueAsString(message);
            jedis.publish(STATUS_CHANNEL, messageJson);
        } catch (Exception e) {
            System.err.println("Error publicando el mensaje: " + e.getMessage());
        }
    }

    public void subscribeToStatusUpdates() {
        new Thread(() -> {
            try (Jedis jedis = jedisPool.getResource()) {
                jedis.subscribe(new JedisPubSub() {
                    @Override
                    public void onMessage(String channel, String message) {
                        if (STATUS_CHANNEL.equals(channel)) {
                            processStatusUpdate(message);
                        }
                    }
                }, STATUS_CHANNEL);
            } catch (Exception e) {
                throw new RuntimeException("Error subscribing to Redis channel: " + e.getMessage(), e);
            }
        }).start();
    }

    private void processStatusUpdate(String message) {
        try {
            if (message.contains("text")) {
                TextMessageDTO statusUpdate = objectMapper.readValue(message, TextMessageDTO.class);
                textMessageRepository.findById(statusUpdate.getId()).ifPresentOrElse(
                        textMessage -> {
                            textMessage.setStatus(statusUpdate.getStatus());
                            textMessageRepository.save(textMessage);
                            messagingTemplate.convertAndSend("/topic/queue-updates", statusUpdate);
                        },
                        () -> System.err.println("No se encontró TextMessage con ID: " + statusUpdate.getId()));
            } else if (message.contains("media")) {
                MediaMessageDTO statusUpdate = objectMapper.readValue(message, MediaMessageDTO.class);
                mediaMessageRepository.findById(statusUpdate.getId()).ifPresentOrElse(
                        mediaMessage -> {
                            mediaMessage.setStatus(statusUpdate.getStatus());
                            mediaMessageRepository.save(mediaMessage);
                            messagingTemplate.convertAndSend("/topic/queue-updates", statusUpdate);
                        },
                        () -> System.err.println("No se encontró MediaMessage con ID: " + statusUpdate.getId()));
            }
        } catch (Exception e) {
            System.err.println("Error procesando el mensaje de estado: " + e.getMessage());
        }
    }

    public List<TextMessage> getAllTextMessages(String instance) {
        return textMessageRepository.findAllByInstance(instance);
    }

    public List<MediaMessage> getAllMediaMessages(String instance) {
        return mediaMessageRepository.findAllByInstance(instance);
    }

    private <T> void enqueueToRedis(String queueKey, T message) throws JsonProcessingException {
        String messageJson = objectMapper.writeValueAsString(message);
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.rpush(queueKey, messageJson);
        } catch (Exception e) {
            throw new RuntimeException("Failed to enqueue message to Redis: " + e.getMessage(), e);
        }
    }

}
