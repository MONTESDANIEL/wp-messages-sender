package com.whatsapp.wp_messages_queue.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "textMessage") // Nombre de la tabla en la base de datos
public class TextMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Clave primaria autogenerada
    private Long id;

    @Column(name = "queue_id", nullable = false)
    private Long queueId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String number;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String text;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
