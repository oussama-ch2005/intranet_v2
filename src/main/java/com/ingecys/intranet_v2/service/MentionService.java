package com.ingecys.intranet_v2.service;

import com.ingecys.intranet_v2.DTO.MentionResponse;
import com.ingecys.intranet_v2.entity.Mention;
import com.ingecys.intranet_v2.repository.MentionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentionService {

    private final MentionRepository mentionRepository;

    //  Conversations où l'utilisateur a été mentionné
    public List<MentionResponse> mesMentions(String email) {
        return mentionRepository.findByUserEmail(email)
                .stream()
                .map(this::mapper)
                .collect(Collectors.toList());
    }

    private MentionResponse mapper(Mention m) {
        // Récupérer le titre de l'objet via la conversation
        String objetTitle = null;
        String typeObjet  = null;

        if (m.getMessage().getConversation().getObjetMetier() != null) {
            objetTitle = m.getMessage().getConversation().getObjetMetier().getTitle();
            typeObjet  = m.getMessage().getConversation()
                    .getObjetMetier().getTypeObject().name();
        }

        return MentionResponse.builder()
                .id(m.getId())
                .conversationId(m.getMessage().getConversation().getId())
                .messageId(m.getMessage().getId())
                .messageContent(m.getMessage().getContent())
                .dateMessage(m.getMessage().getDateEnvoi())
                .mentionneParPrenom(m.getMentionner().getPrenom())
                .mentionneParNom(m.getMentionner().getNom())
                .objetTitle(objetTitle)
                .typeObjet(typeObjet)
                .build();
    }
}