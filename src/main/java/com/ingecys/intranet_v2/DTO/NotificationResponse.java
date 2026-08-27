package com.ingecys.intranet_v2.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String type;
    private boolean lu;
    private String titreObjet;
    private String mentionParPrenom;
    private String mentionParNom;
    private Long objetId;
    private LocalDateTime dateNotif;
    private Long messageId;
    private Long conversationId;
}
