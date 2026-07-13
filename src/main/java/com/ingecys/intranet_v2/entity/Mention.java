package com.ingecys.intranet_v2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="mentions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Mention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //zdtha labr7
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_mentionner",nullable = false)
    private User mentionner;

    @ManyToOne (fetch = FetchType.EAGER)
    @JoinColumn(name = "id_mentioned",nullable = false)
    private User user;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="id_message",nullable = false)
    private Message message;




}
