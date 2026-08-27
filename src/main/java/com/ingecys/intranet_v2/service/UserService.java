package com.ingecys.intranet_v2.service;

import com.ingecys.intranet_v2.DTO.UserResponse;
import com.ingecys.intranet_v2.entity.User;
import com.ingecys.intranet_v2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<UserResponse> findAll(){
        return  userRepository.findAll()
                .stream()
                .map(this::mapper)
                .collect(Collectors.toList());

    }

    public UserResponse findById(Long id){
        User user =userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Utilisateur Introuvable"));
        return mapper(user);
    }

    public UserResponse changerActive(Long id, boolean active){
        User user=userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Utilisateur Introuvable"));
        user.setActive(active);
        return mapper(userRepository.save(user));
    }


    private UserResponse mapper(User user){
        return UserResponse.builder()
                .id(user.getId())
                .nom(user.getNom())
                .email(user.getEmail())
                .prenom(user.getPrenom())
                .role(user.getRole())
                .dateCreation(user.getDateCreation())
                .active(user.isActive())
                .build();
    }


}
