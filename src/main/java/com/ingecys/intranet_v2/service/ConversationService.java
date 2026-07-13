package com.ingecys.intranet_v2.service;

import com.ingecys.intranet_v2.DTO.ConversationResponse;
import com.ingecys.intranet_v2.DTO.MessageResponde;
import com.ingecys.intranet_v2.entity.Conversation;
import com.ingecys.intranet_v2.entity.Message;
import com.ingecys.intranet_v2.entity.User;
import com.ingecys.intranet_v2.repository.ConversationRepository;
import com.ingecys.intranet_v2.repository.MessageRepository;
import com.ingecys.intranet_v2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.internal.util.logging.Messages;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public ConversationResponse obtenirConversation(String typeObjet,Long idObjet,String emailUser){

        Conversation conv=conversationRepository.findByTypeObjetAndIdObjet(typeObjet,idObjet)

                .orElseGet(()->{User user=userRepository.findByEmail(emailUser)

                        .orElseThrow(()->new RuntimeException("User not found"));

                Conversation newConversation=Conversation.builder()
                        .typeObjet(typeObjet)
                        .idObjet(idObjet)
                        .creePar(user)
                        .build();
                return conversationRepository.save(newConversation);

        });
        return mapperVersResponse(conv);

    }
    private ConversationResponse mapperVersResponse(Conversation conv){

        List<MessageResponde> messages= messageRepository
                .findByConversationIdAndEstSupprimeFalseOrderByDateEnvoiAsc(conv.getId())
                .stream()
                .map(this::mapperMessage)
                .toList();

        return ConversationResponse.builder()
                .id(conv.getId())
                .typeObjet(conv.getTypeObjet())
                .idObjet(conv.getIdObjet())
                .status(conv.getStatut())
                .messages(messages)
                .build();
    }


    private MessageResponde mapperMessage(Message msg){

        return MessageResponde.builder()

                .id(msg.getId())

                .content(msg.getContent())

                .sent_date(msg.getDateEnvoi())

                .deleted(msg.isEstSupprime())

                .auteur(MessageResponde.AuteurDto.builder()

                        .id(msg.getSender().getId())

                        .nom(msg.getSender().getNom())

                        .prenom(msg.getSender().getPrenom())

                        .build())
                .build();

    }
}
