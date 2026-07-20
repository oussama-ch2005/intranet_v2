package com.ingecys.intranet_v2.DTO;

import lombok.Data;

@Data
public class ConversationRequest {
    private String typeObject;//demande ou tache
    private Long idObject;
}
