import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);
  username = new FormControl('');

  private webSocketService = inject(WebsocketService);

  toChat() {
    if (!this.username.value) return;
    this.webSocketService.connect(this.username.value);
    this.router.navigate(['/chat']);
  }
}
