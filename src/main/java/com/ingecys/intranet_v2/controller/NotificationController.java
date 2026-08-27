package com.ingecys.intranet_v2.controller;

import com.ingecys.intranet_v2.DTO.NotificationResponse;
import com.ingecys.intranet_v2.repository.NotificationRepository;
import com.ingecys.intranet_v2.service.NotificationService;
import jakarta.persistence.Column;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    //get /api/notification/non-lues
    @GetMapping("/non-lues")
    public ResponseEntity<List<NotificationResponse>> nonLues( Authentication auth) {
        return ResponseEntity.ok(notificationService.obtenirNonLues(auth.getName()));

    }
    //put /api/notification/1/lue
    @PutMapping("/{id}/lue")
    public ResponseEntity<Void> marquerLue(@PathVariable  Long id) {
        notificationService.marqueComeLue(id);
        return ResponseEntity.ok().build();

    }

}
