package com.ingecys.intranet_v2.DTO;

import com.ingecys.intranet_v2.entity.StatusConverstion;
import com.ingecys.intranet_v2.entity.TypeObject;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
@Data
@Builder
public class ConversationResponse {

    private Long id;

    private String typeObject;

    private Long idObjet;

    private String status;//active desactive

    private LocalDateTime dateCreation;

    private String creePar;//un nom

    private String objetMetierTitle;//titre



    private List<MessageResponde> messages;

}
