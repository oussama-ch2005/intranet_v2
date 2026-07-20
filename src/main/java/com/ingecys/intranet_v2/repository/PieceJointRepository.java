package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.PieceJointe;

import java.util.List;

public interface PieceJointRepository {
    List<PieceJointe> findByMessageId(Long id);
}
