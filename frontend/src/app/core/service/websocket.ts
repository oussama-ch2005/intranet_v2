// src/app/core/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsocketService {

  private client!: Client;

  // Observables pour recevoir les messages
  messageRecu$ = new Subject<any>();
  notificationRecue$ = new Subject<string>();

  connecter(email: string) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        console.log('WebSocket connecté');

        // S'abonner aux notifications privées
        this.client.subscribe(`/user/queue/notifications`, (msg) => {
          this.notificationRecue$.next(msg.body);
        });
      }
    });

    this.client.activate();
  }

  // S'abonner à une conversation
  abonnerConversation(conversationId: number) {
    this.client.subscribe(
      `/topic/conversation/${conversationId}`,
      (msg) => {
        const message = JSON.parse(msg.body);
        this.messageRecu$.next(message);
      }
    );
  }

  deconnecter() {
    if (this.client) this.client.deactivate();
  }
}