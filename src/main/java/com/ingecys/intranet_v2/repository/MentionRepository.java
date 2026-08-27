package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.Mention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MentionRepository extends JpaRepository<Mention, Long> {
    List<Mention> findByUserId(Long userId);
    List<Mention> findByMessageId(Long messageId);
    // Toutes les mentions reçues par un utilisateur
    @Query("SELECT m FROM Mention m WHERE m.user.email = :email ORDER BY m.message.dateEnvoi DESC")
    List<Mention> findByUserEmail(@Param("email") String email);

}
