package com.ingecys.intranet_v2.service;

import com.ingecys.intranet_v2.DTO.NotificationResponse;
import com.ingecys.intranet_v2.entity.User;
import com.ingecys.intranet_v2.repository.NotificationRepository;
import com.ingecys.intranet_v2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import  com.ingecys.intranet_v2.entity.Notification;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> obtenirNonLues(String email) {
        User user=userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("User not found"));
        return notificationRepository
                .findByUserIdAndLuFalseOrderByDateNotifDesc(user.getId())
                .stream()
                .map(this::mapper)
                .collect(Collectors.toList());
    }


    public void marqueComeLue(Long notifId) {
        Notification notif = notificationRepository.findById(notifId)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));

        notif.setLu(true);
        notificationRepository.save(notif);

        System.out.println("Notification marquée comme lue : " + notifId);
    }







    public NotificationResponse mapper(Notification n) {
        var builder = NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .lu(n.isLu())
                .dateNotif(n.getDateNotif());

        if (n.getMessage() != null) {
            var message = n.getMessage();

            builder
                    .messageId(message.getId())
                    .mentionParPrenom(message.getSender().getPrenom())
                    .mentionParNom(message.getSender().getNom());

            if (message.getConversation() != null) {
                var conversation = message.getConversation();

                builder.conversationId(conversation.getId());

                if (conversation.getObjetMetier() != null) {
                    builder
                            .titreObjet(conversation.getObjetMetier().getTitle())
                            .objetId(conversation.getObjetMetier().getId());
                }
            }
        }

        return builder.build();
    }
}
