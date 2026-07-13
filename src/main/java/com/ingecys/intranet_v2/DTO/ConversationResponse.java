package com.ingecys.intranet_v2.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
@Data
@Builder
public class ConversationResponse {

    private Long id;
    private String typeObjet;
    private Long idObjet;
    private String status;
    private LocalDateTime dateCreation;
    private List<MessageResponde> messages;

}
