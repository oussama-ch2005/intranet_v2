package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.PieceJointe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PieceJointRepository extends JpaRepository<PieceJointe, Long> {
    List<PieceJointe> findByMessageId(Long messageId);
}
