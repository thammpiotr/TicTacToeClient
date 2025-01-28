import { Component, input } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-bar',
  imports: [],
  templateUrl: './room-bar.component.html',
  styleUrl: './room-bar.component.scss',
})
export class RoomBarComponent {
  roomId = input('');
  playerCount = input(0);
  playerName = '';
  constructor(private signalRService: SignalRService, private router: Router) {}
  async ngOnInit() {
    this.playerName = sessionStorage.getItem('playerName') || 'Anonimowy';
    await this.signalRService.startConnection();
  }

  async joinRoom(roomId: string) {
    try {
      const result = await this.signalRService.joinRoom(
        roomId,
        this.playerName
      );
      if (result) {
        console.log(`Dołączono do pokoju ${roomId}`);
        this.router.navigate(['/game'], { queryParams: { roomId } });
      } else {
        alert('Nie udało się dołączyć do pokoju. Może jest już pełny?');
      }
    } catch (err) {
      console.error('Błąd podczas dołączania do pokoju:', err);
    }
  }
}
