package com.ingecys.intranet_v2.DTO;

import lombok.Data;

import java.util.List;

@Data

public class MessageRequest {
    private String content;
    private List<Long> id_mentiones;
}

