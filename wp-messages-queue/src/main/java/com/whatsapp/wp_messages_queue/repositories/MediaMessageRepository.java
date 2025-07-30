package com.whatsapp.wp_messages_queue.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whatsapp.wp_messages_queue.entities.MediaMessage;

public interface MediaMessageRepository extends JpaRepository<MediaMessage, Long> {
    List<MediaMessage> findAllByInstance(String instance);
}
