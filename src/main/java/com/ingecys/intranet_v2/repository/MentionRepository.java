package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.Mention;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MentionRepository extends JpaRepository<Mention, Long> {
    List<Mention> findByUserId(Long userId);
    List<Mention> findByMessageId(Long messageId);

}
