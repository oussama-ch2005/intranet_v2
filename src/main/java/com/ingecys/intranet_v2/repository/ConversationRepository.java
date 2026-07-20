package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.Conversation;

import com.ingecys.intranet_v2.entity.StatusConverstion;
import com.ingecys.intranet_v2.entity.TypeObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE c.typeObject = :typeObject AND c.idObjet = :idObjet")
    Optional<Conversation> findByTypeObjectAndIdObjet(
            @Param("typeObject") TypeObject typeObject,
            @Param("idObjet") Long idObjet);

    @Query("SELECT c FROM Conversation c WHERE c.typeObject = :typeObject")
    List<Conversation> findByTypeObject(@Param("typeObject") TypeObject typeObject);

    @Query("SELECT c FROM Conversation c WHERE c.statut = :statut")
    List<Conversation> findByStatus(@Param("status") StatusConverstion statut);
    }
