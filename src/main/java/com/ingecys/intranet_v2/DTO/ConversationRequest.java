package com.ingecys.intranet_v2.DTO;

import lombok.Data;

@Data
public class ConversationRequest {
    private String typeObjet;//demande ou tache
    private Long idObjet;
}
