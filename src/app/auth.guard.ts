import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const playerName = localStorage.getItem('playerName');
    const roomId = localStorage.getItem('roomId');

    if (playerName && playerName.trim()) {
      if (roomId) {
        if (state.url.startsWith('/game')) {
          return true;
        }

        this.router.navigate(['/game'], { queryParams: { roomId } });
        return false;
      }

      if (state.url.startsWith('/home')) {
        return true;
      }

      this.router.navigate(['/home']);
      return false;
    }

    if (state.url.startsWith('/login')) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
