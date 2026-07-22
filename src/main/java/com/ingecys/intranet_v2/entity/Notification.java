package com.ingecys.intranet_v2.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_utilisateur",nullable=false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_message",nullable = false)
    private Message message;

    private String type; //Mention,reponse

    private boolean lu=false;

    @Column(name="date_notif")
    private LocalDateTime dateNotif;


    @PrePersist
    public void prePersist(){
        this.dateNotif = LocalDateTime.now();
    }
}
