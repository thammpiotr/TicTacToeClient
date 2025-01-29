import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  playerName: string = '';
  constructor(private router: Router) {}
  startGame() {
    if (this.playerName.trim()) {
      localStorage.setItem('playerName', this.playerName);
      let playerId = localStorage.getItem('playerId');
      if (!playerId) {
        playerId = crypto.randomUUID();
        localStorage.setItem('playerId', playerId);
      }
      this.router.navigate(['/home']);
    } else {
      alert('Podaj swoją nazwę!');
    }
  }
}
