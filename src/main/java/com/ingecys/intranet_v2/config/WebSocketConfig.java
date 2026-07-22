package com.ingecys.intranet_v2.config;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig  implements WebSocketMessageBrokerConfigurer {
    @Override
    public  void configureMessageBroker(MessageBrokerRegistry registry) {
        // Préfixe des canaux auxquels le client s'abonne
        // ex: /topic/conversation/1
        registry.enableSimpleBroker("/topic");
        // Préfixe des messages envoyés par le client vers le serveur
        // ex: /app/message
        registry.setApplicationDestinationPrefixes("/app");
    }
    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
                //.withSockJS(); // SockJS = fallback si WebSocket non supporte
    }



}


