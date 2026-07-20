package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.ObjectMetier;
import com.ingecys.intranet_v2.entity.TypeObject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObjectMetierRepository extends JpaRepository<ObjectMetier,Long> {
    List<ObjectMetier> findByTypeObject(TypeObject typeObject);
    List<ObjectMetier> findByCreatedById(Long userId);



}
