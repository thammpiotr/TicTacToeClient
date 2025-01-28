import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Sprawdź, czy nick istnieje w sessionStorage
    const playerName = sessionStorage.getItem('playerName');
    if (playerName && playerName.trim()) {
      return true; // Nick istnieje, dostęp do trasy dozwolony
    } else {
      // Brak nicku, przekierowanie na stronę logowania
      this.router.navigate(['/login']);
      return false;
    }
  }
}
