package com.ingecys.intranet_v2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_conversation",nullable=false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_auteur",nullable=false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "id_receiver")
    private User receiver;


    @Column(nullable = false,columnDefinition = "text")
    private String content;

    @Column(name = "date_envoie")
    private LocalDateTime dateEnvoi;

    @Column (name="date_modification")
    private LocalDateTime dateModification;

    @Column (name="est_supprime")
    private boolean estSupprime;

    @Column(name="is_read")
    private boolean read;

    @OneToMany(mappedBy ="message",cascade = CascadeType.ALL)//pour utiliser save 1 fois et ausi et fusion de persist,merge,rmove,refresh,detach
    private List<PieceJointe> pieceJointes;

    @OneToMany(mappedBy = "message",cascade = CascadeType.ALL)
    private List<Mention> mentions;

    @PrePersist
    public void prePersist1(){
        dateEnvoi=LocalDateTime.now();
        dateModification=LocalDateTime.now();

    }








}
