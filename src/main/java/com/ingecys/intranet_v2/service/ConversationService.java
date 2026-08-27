package com.ingecys.intranet_v2.service;

import com.ingecys.intranet_v2.DTO.ConversationResponse;
import com.ingecys.intranet_v2.DTO.MessageResponde;
import com.ingecys.intranet_v2.entity.*;
import com.ingecys.intranet_v2.repository.ConversationRepository;
import com.ingecys.intranet_v2.repository.MessageRepository;
import com.ingecys.intranet_v2.repository.ObjectMetierRepository;
import com.ingecys.intranet_v2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final ObjectMetierRepository objectMetierRepository;

    //  cherche par id de l objet directement et mail
    @Transactional
    public ConversationResponse obtenirConversation(Long objectId, String emailUser) {

        ObjectMetier object = objectMetierRepository.findById(objectId)
                .orElseThrow(() -> new RuntimeException("Objet introuvable"));

        // Si l'objet n'a pas encore de conversation, on en crée une
        if (object.getConversation() == null) {
            User user = userRepository.findByEmail(emailUser)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            Conversation newConv = Conversation.builder()
                    .creePar(user)
                    .build();

            object.setConversation(newConv);
            objectMetierRepository.save(object);   // cascade crée la conversation
        }

        return mapperVersResponse(object.getConversation(), object);
    }

    //  conversation par son id
    public ConversationResponse obtenirConversationById(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));
        return mapperVersResponse(conversation,conversation.getObjetMetier());
    }

    public List<ConversationResponse> listerParType(String typeObjectStr) {

        TypeObject type;
        try {
            type = TypeObject.valueOf(typeObjectStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Type invalide : " + typeObjectStr
                    + ". Valeurs : TICKET, DEMANDE, TACHE, INTERVENTION, MATERIEL");
        }

        return conversationRepository
                .findByTypeObject(type)
                .stream()
                .map(conv -> mapperVersResponse(conv, conv.getObjetMetier()))
                .collect(Collectors.toList());
    }

    // Mapper

    private ConversationResponse mapperVersResponse(Conversation conv, ObjectMetier object) {

        List<MessageResponde> messages = messageRepository
                .findByConversationIdAndEstSupprimeFalseOrderByDateEnvoiAsc(conv.getId())
                .stream()
                .map(this::mapperMessage)
                .toList();

        return ConversationResponse.builder()
                .id(conv.getId())
                .typeObject(object != null && object.getTypeObject() != null
                        ? object.getTypeObject().name() : null)   // vient de l'objet

                .idObjet(object != null ? object.getId() : null)   // vient de l'objet

                .status(conv.getStatut() != null
                        ? conv.getStatut().name() : null)
                .dateCreation(conv.getDateCreation())
                .creePar(conv.getCreePar() != null
                        ? conv.getCreePar().getNom() + " " + conv.getCreePar().getPrenom()
                        : null)
                .objetMetierTitle(object != null ? object.getTitle() : null)

                .messages(messages)
                .build();
    }

    private MessageResponde mapperMessage(Message msg) {
        return MessageResponde.builder()
                .id(msg.getId())
                .content(msg.getContent())
                .sent_date(msg.getDateEnvoi())
                .deleted(msg.isEstSupprime())
                .auteur(MessageResponde.AuteurDto.builder()
                        .id(msg.getSender().getId())
                        .nom(msg.getSender().getNom())
                        .prenom(msg.getSender().getPrenom())
                        .email(msg.getSender().getEmail())
                        .build())
                .build();
    }
}