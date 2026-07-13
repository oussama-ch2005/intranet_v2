package com.ingecys.intranet_v2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="piece_jointe")
@Data
@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PieceJointe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_message",nullable=false)
    private Message message;

    @Column(name="nom_fichier")
    private String nomFichier;

    private String url;

    @Column(name="type_fichier")
    private String typeFichier;

    @Column(name="taille")
    private Integer tailleKo;


}
