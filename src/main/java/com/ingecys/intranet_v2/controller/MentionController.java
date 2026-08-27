package com.ingecys.intranet_v2.controller;

import com.ingecys.intranet_v2.DTO.MentionResponse;
import com.ingecys.intranet_v2.service.MentionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/mentions")
@RequiredArgsConstructor
public class MentionController {

    private final MentionService mentionService;

    // GET /api/mentions/mes-mentions
    @GetMapping("/mes-mentions")
    public ResponseEntity<List<MentionResponse>> mesMentions(Authentication auth) {
        return ResponseEntity.ok(mentionService.mesMentions(auth.getName()));
    }
}