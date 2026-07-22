package com.ingecys.intranet_v2.controller;

import com.ingecys.intranet_v2.DTO.ConversationResponse;
import com.ingecys.intranet_v2.DTO.MessageRequest;
import com.ingecys.intranet_v2.DTO.MessageResponde;
import com.ingecys.intranet_v2.service.ConversationService;
import com.ingecys.intranet_v2.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor

public class MessageController {

    private final MessageService messageService;
    // Post /api/messages/conversation/1
    @PostMapping("/conversation/{conversationId}")
    public ResponseEntity<MessageResponde> envoyer(
            @PathVariable Long conversationId,
            @RequestBody MessageRequest request,
            Authentication auth
    ){  System.out.println("entrer en message controller conversation");
        return ResponseEntity.ok(

                messageService.envoiMessage(conversationId,request,auth.getName())

        );

    }

    // DELETE /api/message/1
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> supprimer(
            @PathVariable Long messageId,
            Authentication auth
    ){
        messageService.supprimerMessage(messageId,auth.getName());
        return ResponseEntity.noContent().build();
    }
}
