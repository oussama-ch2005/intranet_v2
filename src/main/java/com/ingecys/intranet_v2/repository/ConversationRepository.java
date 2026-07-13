package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.Conversation;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {



    // Trouver la conversation d'un objet métier précis
    Optional<Conversation> findByTypeObjetAndIdObjet(String typeObjet, Long idObjet);

    // Lister toutes les conversations d'un type d'objet
    List<Conversation> findByTypeObjet(String typeObjet);
}
