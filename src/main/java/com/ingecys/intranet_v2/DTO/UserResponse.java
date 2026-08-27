package com.ingecys.intranet_v2.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private LocalDateTime dateCreation;
    private boolean active;
    //private LocalDateTime lastLogin;
}
