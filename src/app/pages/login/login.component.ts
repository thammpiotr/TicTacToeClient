import {Component, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
    imports: [
        FormsModule,
      ReactiveFormsModule
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  playerName: string = '';
  constructor(private router: Router) {}
  startGame() {
    if (this.playerName.trim()) {
      // Zapisz nick w sessionStorage
      sessionStorage.setItem('playerName', this.playerName);

      // Sprawdź, czy PlayerID już istnieje
      let playerId = sessionStorage.getItem('playerId');
      if (!playerId) {
        // Generuj nowy PlayerID
        playerId = crypto.randomUUID();
        sessionStorage.setItem('playerId', playerId);
      }

      // Przejście na stronę główną
      this.router.navigate(['/home']);
    } else {
      alert('Podaj swoją nazwę!');
    }
  }

}
