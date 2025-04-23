import { Component, OnInit } from '@angular/core';
import { ChatService } from '../servei-chatting/chat.service'; // Importamos el servicio de chat
import { Observable } from 'rxjs';
import { ServeiAutenticarService } from '../servei-autenticar.service'; // Importamos el servicio de autenticación

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages$: Observable<any[]> = new Observable();  // Mensajes en tiempo real
  messageText: string = '';
  userId: string = '';
  userName: string = 'Anónimo';

  constructor(
    private chatService: ChatService,
    private authService: ServeiAutenticarService  // Inyectamos el servicio de autenticación
  ) {}

  ngOnInit() {
    // Obtener los mensajes en tiempo real desde la base de datos
    this.messages$ = this.chatService.getMessages();

    // Obtener los detalles del usuario loggeado
    this.authService.getuser().subscribe(user => {
      if (user) {
        this.userId = user.uid;  // ID del usuario loggeado
        this.userName = user.displayName || 'Anónimo';  // Nombre del usuario
      }
    });
  }

  // Método para enviar el mensaje
  sendMessage() {
    if (this.messageText.trim()) {
      this.chatService.sendMessage(this.userId, this.userName, this.messageText);
      this.messageText = ''; // Limpiar el input después de enviar el mensaje
    }
  }
}
