package com.ingecys.intranet_v2.DTO;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MentionResponse {
    private Long id;
    private Long conversationId;
    private Long messageId;
    private String messageContent;
    private LocalDateTime dateMessage;
    private String mentionneParPrenom;
    private String mentionneParNom;
    private String objetTitle;
    private String typeObjet;
}