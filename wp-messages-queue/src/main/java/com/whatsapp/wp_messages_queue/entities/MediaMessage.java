package com.whatsapp.wp_messages_queue.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "MediaMessage")
public class MediaMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Clave primaria autogenerada
    private Long id;

    @Column(name = "queue_id", nullable = false)
    private Long queueId;

    @Column(nullable = false)
    private String number;

    @Column(nullable = false)
    private String mediatype;

    @Column(nullable = false)
    private String media;

    private String caption;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
