package com.ingecys.intranet_v2.controller;

import com.ingecys.intranet_v2.DTO.AuthRequest;
import com.ingecys.intranet_v2.DTO.AuthResponse;
import com.ingecys.intranet_v2.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/connexion")
  public ResponseEntity<AuthResponse> connecter(@RequestBody AuthRequest authRequest){
      return ResponseEntity.ok(authService.connecter(authRequest));
    }

}
