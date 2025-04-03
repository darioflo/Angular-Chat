import { Routes } from '@angular/router';
import { LoginComponent } from './routes/login/login.component';
import { ChatComponent } from './routes/chat/chat.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chat', component: ChatComponent },
];
