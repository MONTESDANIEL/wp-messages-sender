package com.whatsapp.wp_messages_queue.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whatsapp.wp_messages_queue.entities.MediaMessage;

public interface MediaMessageRepository extends JpaRepository<MediaMessage, Long> {

}
