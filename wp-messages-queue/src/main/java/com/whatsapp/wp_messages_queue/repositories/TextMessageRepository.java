package com.whatsapp.wp_messages_queue.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whatsapp.wp_messages_queue.entities.TextMessage;

public interface TextMessageRepository extends JpaRepository<TextMessage, Long> {

}