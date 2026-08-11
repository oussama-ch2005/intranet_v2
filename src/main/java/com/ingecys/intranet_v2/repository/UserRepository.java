package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);//pour returner null au lieu de exception
    boolean existsByEmail(String email);
    Optional<List<User>> findByEmailContaining(String email);


}
