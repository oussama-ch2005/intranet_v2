package com.ingecys.intranet_v2.DTO;

import com.ingecys.intranet_v2.entity.PieceJointe;
import jdk.dynalink.linker.LinkerServices;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MessageResponde {

    private Long id;
    private String content;
    private LocalDateTime sent_date;
    private boolean deleted;
    private AuteurDto auteur;
    private List<PieceJointeDto> pieceJointes;
    private List<String> mentionsPrenoms;


    @Builder
    @Data
    public static class AuteurDto{
        private Long id;
        private String nom;
        private String prenom;
    }
    @Builder
    @Data
    public static class PieceJointeDto{
        private Long id;
        private String nomFichier ;
        private String url;
        private String TypeFichier;

    }


}
