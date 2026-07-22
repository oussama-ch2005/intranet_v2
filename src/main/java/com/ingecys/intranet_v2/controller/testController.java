package com.ingecys.intranet_v2.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")

public class testController {
    @GetMapping("ping")
    public String ping(){
        return "pong";
    }
    @GetMapping("/protected")
    public ResponseEntity<String> protectedRoute(Authentication auth){
        return ResponseEntity.ok("connecter en tant que :"+auth.getName());
    }

}
