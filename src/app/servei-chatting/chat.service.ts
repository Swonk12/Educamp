import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private db: AngularFireDatabase) {}

  // Obtener mensajes en tiempo real
  getMessages(): Observable<ChatMessage[]> {
    return this.db.list<ChatMessage>('chat', ref => ref.orderByChild('timestamp'))
      .valueChanges();
  }

  // Enviar un nuevo mensaje
  sendMessage(userId: string, userName: string, message: string) {
    const timestamp = new Date().getTime();
    this.db.list('chat').push({ userId, userName, message, timestamp });
  }
}