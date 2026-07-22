package com.ingecys.intranet_v2.entity;

import com.ingecys.intranet_v2.entity.Message;
import com.ingecys.intranet_v2.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "conversations")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Conversation{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusConverstion statut; // actve desactive

    @Column(name="id_object",nullable = false)
    private Long idObjet;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_object")
    private TypeObject typeObject;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cree_par")
    private User creePar;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private List<Message> messages;


    @OneToOne(mappedBy = "conversation")
    private ObjectMetier objetMetier;





    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
        this.statut = StatusConverstion.ACTIF;
    }
    public Long getCreeParId() {
        return this.creePar.getId()!=null?this.creePar.getId():null;
    }
}