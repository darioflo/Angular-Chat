import { Injectable, signal } from '@angular/core';

interface ChatMessage {
  type: 'message' | 'join' | 'send' | 'leave';
  user: string;
  content: string;
  timeStamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  username = signal<string>('');
  messages = signal<ChatMessage[]>([]);

  connect(username: string) {
    this.username.set(username);
    this.socket = new WebSocket('ws://localhost:3000');
    this.socket.onopen = () => {
      this.joinChat();
    };
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as ChatMessage;
      this.messages.update((oldMessages) => [...oldMessages, message]);
    };

    this.socket.onclose = () => {
      this.socket = null;
      console.log('Conection off');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendChatMessage(content: string) {
    const message: ChatMessage = {
      type: 'message',
      user: this.username(),
      content,
      timeStamp: Date.now(),
    };

    this.sendMessage(message);
  }

  private joinChat() {
    const joinMessage: ChatMessage = {
      type: 'join',
      user: this.username(),
      content: `Bienvenido al chat ${this.username()}`,
      timeStamp: Date.now(),
    };

    this.sendMessage(joinMessage);
  }

  private sendMessage(message: ChatMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  logOut() {
    if (this.socket) {
      this.socket.close();
      this.username.set('');
    }
  }
}
