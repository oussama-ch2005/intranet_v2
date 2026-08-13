package com.ingecys.intranet_v2.service;

import com.ingecys.intranet_v2.DTO.ObjectMetierRequest;
import com.ingecys.intranet_v2.DTO.ObjectMetierResponse;


import com.ingecys.intranet_v2.entity.*;

import com.ingecys.intranet_v2.repository.ObjectMetierRepository;

import com.ingecys.intranet_v2.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ObjectMetierService {
    private final ObjectMetierRepository objectMetierRepository;
    private final UserRepository userRepository;


    @Transactional
    public ObjectMetierResponse creer(ObjectMetierRequest request, String emailUtilisateur) {

        User user = userRepository.findByEmail(emailUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        TypeObject type;
        PrioriteObject priorite;

        try {
            type = TypeObject.valueOf(request.getTypeObject().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("typeObject invalide : " + request.getTypeObject()
                    + " → TICKET, DEMANDE, TACHE, INTERVENTION, MATERIAL");
        }

        try {
            priorite = PrioriteObject.valueOf(request.getPriority().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("priority invalide : " + request.getPriority()
                    + " → FAIBLE, NORMALE, HAUT, URGENTE");
        }

        // Creer l objet metier without conversation
        ObjectMetier objet = ObjectMetier.builder()
                .typeObject(type)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(priorite)
                .createdBy(user)
                .build();

        //  sauvegarder l objet pour obtenir son id
        ObjectMetier saved = objectMetierRepository.save(objet);

        // Créer la conversation avec l id_object maintenant connu
        Conversation conversation = Conversation.builder()
                .typeObject(type)
                .idObjet(saved.getId())   // ← id disponible maintenant
                .creePar(user)
                .build();

        //  Lier la conversation à l'objet et sauvegarder
        saved.setConversation(conversation);
        saved = objectMetierRepository.save(saved);   // cascade sauvegarde la conversation

        return mapper(saved);
    }

    public ObjectMetierResponse obtenirParId(Long id){
        ObjectMetier objectMetier= (ObjectMetier) objectMetierRepository.findById(id)// kayna wa7d confusion bin la calss parent object et entiter obect donc on fait un cast
                .orElseThrow(()->new RuntimeException("Object introuvable"));
        return mapper(objectMetier);

    }
    public ObjectMetierResponse changerStatus(Long id, String nouveauStatus){
        ObjectMetier object= (ObjectMetier) objectMetierRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Onject introuvable" ));
        try {
            object.setStatus(StatusObject.valueOf(nouveauStatus.toUpperCase()));

        }catch (IllegalArgumentException e){
            throw new RuntimeException(STR."Status invalid : \{nouveauStatus}.valeurs:OUVERT,EN_COURS,RESOLU,FERME");

        }
        return mapper(objectMetierRepository.save(object));

    }
    public List<ObjectMetierResponse> ListerParType(String typeObject){
        TypeObject type=TypeObject.valueOf(typeObject.toUpperCase());
        return objectMetierRepository.findByTypeObject(type)
                .stream()
                .map(this::mapper)
                .collect(Collectors.toList());
    }
    public List<ObjectMetierResponse> ListerParUtilisateur(String email){
        User user=userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return objectMetierRepository.findByCreatedById(user.getId())
                .stream()
                .map(this::mapper)
                .collect(Collectors.toList());
    }




    private ObjectMetierResponse mapper(ObjectMetier objectMetier) {
        return ObjectMetierResponse.builder()

                .id(objectMetier.getId())

                .typeObject(objectMetier.getTypeObject()!=null ? objectMetier.getTypeObject().name() : null)

                .title(objectMetier.getTitle())

                .description(objectMetier.getDescription())

                .status(objectMetier.getStatus()!=null ? objectMetier.getStatus().name() : null)

                .priority(objectMetier.getPriority()!=null ? objectMetier.getPriority().name() : null)

                .created(objectMetier.getCreatedAt())

                .conversationId(objectMetier.getConversation() != null
                        ? objectMetier.getConversation().getId() : null)

                .creepar(objectMetier.getCreatedBy()!=null? objectMetier.getCreatedBy().getNom()+" "
                        +objectMetier.getCreatedBy().getPrenom():null)

                .build();
    }








}
