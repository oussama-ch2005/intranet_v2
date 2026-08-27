package com.ingecys.intranet_v2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class User {


    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String nom;

    @Column(nullable=false)
    private String prenom;

    @Column(nullable=false,unique = true)
    private String email;

    @Column(nullable=false)
    private String password;

    @Column(nullable=false)
    private String role;

    @Column(name= "date_creation")
    private LocalDateTime dateCreation;

    private boolean Active;



    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
        this.Active=true;
    }




}
