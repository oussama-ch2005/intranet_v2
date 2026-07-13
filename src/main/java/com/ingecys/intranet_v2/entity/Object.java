package com.ingecys.intranet_v2.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="objects")
@Data

public class Object {

    @Id
    @GeneratedValue
   private Long id;
   private String TypeObject ;



}
