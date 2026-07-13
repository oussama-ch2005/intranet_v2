package com.ingecys.intranet_v2.service;

import com.ingecys.intranet_v2.DTO.AuthRequest;
import com.ingecys.intranet_v2.DTO.AuthResponse;
import com.ingecys.intranet_v2.Security.JwtProvider;
import com.ingecys.intranet_v2.entity.User;
import com.ingecys.intranet_v2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthResponse connecter(AuthRequest request) {
        System.out.println(">>> EMAIL REÇU : " + request.getEmail());
        System.out.println(">>> MOT DE PASSE REÇU : " + request.getPassword());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println(">>> UTILISATEUR NON TROUVÉ");
                    return new RuntimeException("Utilisateur introuvable");
                });

        System.out.println(">>> UTILISATEUR TROUVÉ : " + user.getEmail());
        System.out.println(">>> HASH EN BASE : " + user.getPassword());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println(">>> MOT DE PASSE INCORRECT");
            throw new RuntimeException("Mot de passe incorrect");
        }

        System.out.println(">>> CONNEXION OK");
        String token = jwtProvider.genererToken(user.getEmail(), user.getRole());
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

}
