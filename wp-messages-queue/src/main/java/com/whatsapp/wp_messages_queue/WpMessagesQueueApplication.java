package com.whatsapp.wp_messages_queue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.whatsapp.wp_messages_queue.repositories")
@EntityScan(basePackages = "com.whatsapp.wp_messages_queue.entities")
public class WpMessagesQueueApplication {

	public static void main(String[] args) {
		SpringApplication.run(WpMessagesQueueApplication.class, args);
	}
}
