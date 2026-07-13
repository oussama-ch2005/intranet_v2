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

    @Column(name = "type_objet", nullable = false)
    private String typeObjet; // DEMANDE, TACHE, TICKET, INTERVENTION, MATERIEL

    @Column(name = "id_objet", nullable = false)
    private Long idObjet;

    private String statut; // ACTIF, FERME

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cree_par")
    private User creePar;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private List<Message> messages;



    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
        this.statut = "ACTIF";
    }
    public Long getCreeParId() {
        return this.creePar.getId();
    }
}