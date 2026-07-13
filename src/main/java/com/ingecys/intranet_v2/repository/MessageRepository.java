package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdAndEstSupprimeFalseOrderByDateEnvoiAsc(Long conversationId);

}
