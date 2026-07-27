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
        // Prefixe des canaux auxquels le client s abonne
        //  /topic/conversation/1

        registry.enableSimpleBroker("/topic", "/queue");
        // Prfixe des messages envoyeee par le client vers le serveur /app/messages

        registry.setApplicationDestinationPrefixes("/app");
        //destiner pour un user precis
        registry.setUserDestinationPrefix("/user");
    }
    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:63342")
                .withSockJS(); // fallback si WebSocket non supporte
    }



}


