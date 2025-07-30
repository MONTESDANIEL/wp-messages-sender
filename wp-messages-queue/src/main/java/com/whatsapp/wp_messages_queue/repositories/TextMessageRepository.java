package com.whatsapp.wp_messages_queue.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whatsapp.wp_messages_queue.entities.TextMessage;

public interface TextMessageRepository extends JpaRepository<TextMessage, Long> {
    List<TextMessage> findAllByInstance(String instance);
}