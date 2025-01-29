import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth.guard';
import { RoomsListComponent } from './pages/rooms-list/rooms-list.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: '',
    children: [
      {
        canActivate: [AuthGuard],
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: 'rooms',
        loadComponent: () =>
          import('./pages/rooms-list/rooms-list.component').then(
            (c) => c.RoomsListComponent
          ),
      },

      {
        path: 'game',

        loadComponent: () =>
          import('./pages/game/game.component').then((c) => c.GameComponent),
      },
    ],
  },
];
