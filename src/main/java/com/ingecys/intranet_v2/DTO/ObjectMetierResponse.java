package com.ingecys.intranet_v2.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ObjectMetierResponse {
    private Long id;
    private String typeObject;
    private String description;
    private String status;
    private String priority;
    private String title;
    private LocalDateTime createdAt;
    private Long conversationId;
    private String creepar;
}
