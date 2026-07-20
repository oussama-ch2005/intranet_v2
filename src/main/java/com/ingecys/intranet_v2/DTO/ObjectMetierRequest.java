package com.ingecys.intranet_v2.DTO;

import lombok.Data;

@Data
public class ObjectMetierRequest {
    private String typeObject;
    private String title;
    private String description;
    private String priority;
}
