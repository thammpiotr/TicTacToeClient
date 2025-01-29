import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  playerName: string = '';
  roomId: string = '';

  constructor(private signalRService: SignalRService, private router: Router) {}
  ngOnInit() {
    this.playerName = localStorage.getItem('playerName') || 'Anonimowy';
  }

  async createRoom() {
    if (!this.playerName) {
      alert('Wpisz najpierw swój nick.');
      return;
    }

    await this.signalRService.startConnection();

    try {
      const roomId = await this.signalRService.createRoom(this.playerName);
      this.roomId = roomId;
      localStorage.setItem('roomId', roomId);
      this.router.navigate(['/game'], { queryParams: { roomId } });
    } catch (err) {
      console.error('Błąd podczas tworzenia pokoju:', err);
    }
  }
  logout() {
    localStorage.removeItem('playerName');
    localStorage.removeItem('playerId');
    this.router.navigate(['/login']);
  }
}
