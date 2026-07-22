package com.ingecys.intranet_v2.DTO;

import lombok.Builder;
import lombok.Data;
import lombok.extern.java.Log;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String type;
    private boolean lu;
    private LocalDateTime date_notif;
    private Long messageId;
    private Long conversationId;
}
