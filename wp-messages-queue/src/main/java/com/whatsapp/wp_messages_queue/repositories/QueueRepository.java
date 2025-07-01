package com.whatsapp.wp_messages_queue.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.whatsapp.wp_messages_queue.entities.Queue;

public interface QueueRepository extends JpaRepository<Queue, Long> {

    Queue findByInstance(String instance);

}
