package com.ingecys.intranet_v2.controller;

import com.ingecys.intranet_v2.DTO.NotificationResponse;
import com.ingecys.intranet_v2.repository.NotificationRepository;
import com.ingecys.intranet_v2.service.NotificationService;
import jakarta.persistence.Column;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    //get /api/notification/non-lues?userId=1
    @GetMapping("/non-lues")
    public ResponseEntity<List<NotificationResponse>> nonLues(@RequestParam Long userId) {
        return ResponseEntity.ok(notificationService.obtenirNonLues(userId));

    }
    //put /api/notification/1/lue
    @PutMapping("/{id}/lue")
    public ResponseEntity<Void> marquerLue( @RequestParam Long id) {
        notificationService.marqueComeLue(id);
        return ResponseEntity.ok().build();

    }

}
