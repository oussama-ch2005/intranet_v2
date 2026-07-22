package com.ingecys.intranet_v2.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="objects")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class ObjectMetier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Enumerated(EnumType.STRING)
   @Column(name = "type_object",nullable=false)
   private TypeObject typeObject ;// TICKET, DEMANDE, TACHE, INTERVENTION, MATERIEL

    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    private StatusObject status;

    @Enumerated(EnumType.STRING)
    private PrioriteObject priority;

    @ManyToOne
    @JoinColumn(name = "creepar_id")
    private User createdBy;


    @Column(name="date_creation")
    private LocalDateTime createdAt;

    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;

    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
        this.status= StatusObject.OUVERT;
        this.priority= PrioriteObject.NORMALE;
    }





}
