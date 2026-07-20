package com.ingecys.intranet_v2.controller;

import com.ingecys.intranet_v2.DTO.ConversationResponse;
import com.ingecys.intranet_v2.service.ConversationService;
import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {
    private final ConversationService conversationService;
    @GetMapping
    public ResponseEntity<ConversationResponse> obtenirouCreer(
            @RequestParam Long objectId,
             Authentication auth
    ) {
        return ResponseEntity.ok(
                conversationService.obtenirConversation(objectId,auth.getName())
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<ConversationResponse> obtenirParId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(conversationService.obtenirConversationById(id));
    }



}
