package com.ingecys.intranet_v2.DTO;

import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.parameters.P;

import java.util.List;

@Data

public class MessageRequest {
    private String content;
    private List<Long> id_mentiones;
    private List<PieceJointeRequest> pieceJointeRequests;
    @Data
    public static class PieceJointeRequest {
        private String nomFichier;
        private String url;
        private String typeFichier;
        private Integer tailleKo;
    }
}

