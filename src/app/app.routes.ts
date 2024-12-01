import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo: '/chats', pathMatch: 'full',
    },
    {
        path: 'chats',
        loadComponent: () => import('./test/chat-display/chat-display.component').then(x => x.ChatDisplayComponent)
      },
];
