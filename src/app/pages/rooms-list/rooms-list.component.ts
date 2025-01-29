import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { Router } from '@angular/router';
import { RoomBarComponent } from '../../components/room-bar/room-bar.component';

@Component({
  selector: 'app-rooms-list',
  imports: [RoomBarComponent],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss',
})
export class RoomsListComponent implements OnInit {
  roomsWithCounts: { roomId: string; playerCount: number }[] = [];
  roomsListLength = 0;
  playerName: string = '';

  constructor(private signalRService: SignalRService, private router: Router) {}

  async ngOnInit() {
    try {
      this.playerName = localStorage.getItem('playerName') || 'Anonimowy';
      await this.signalRService.startConnection();
      this.roomsWithCounts =
        await this.signalRService.getRoomsWithPlayerCounts();
      this.roomsListLength = this.roomsWithCounts.length;
      this.signalRService.onRoomsUpdated((updatedRooms) => {
        this.roomsWithCounts = updatedRooms;
        this.roomsListLength = this.roomsWithCounts.length;
      });
    } catch (err) {
      console.error('Błąd podczas pobierania listy pokoi:', err);
    }
  }

  async joinRoom(roomId: string) {
    try {
      const result = await this.signalRService.joinRoom(
        roomId,
        this.playerName
      );
      if (result) {
        this.router.navigate(['/game'], { queryParams: { roomId } });
      } else {
        alert('Nie udało się dołączyć do pokoju. Może jest już pełny?');
      }
    } catch (err) {
      console.error('Błąd podczas dołączania do pokoju:', err);
    }
  }
  goBack() {
    this.router.navigate(['/home']);
  }
}
