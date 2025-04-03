import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MessageComponent } from '../../components/message/message.component';

@Component({
  selector: 'app-chat',
  imports: [MessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  constructor(private route: Router) {}

  toLogin() {
    this.route.navigate(['']);
  }
}
