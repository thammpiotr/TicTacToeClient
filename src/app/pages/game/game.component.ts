// src/app/game/game.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [NgIf, NgFor, FormsModule],
})
export class GameComponent implements OnInit {
  playerName: string = '';
  rooms: string[] = [];
  selectedRoomId: string | null = null;
  wrongMove = signal<boolean>(false);
  board: string[][] = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' '],
  ];
  currentTurn: string = 'X';
  isGameOver: boolean = false;
  message: string = '';
  winner: string = '';
  constructor(
    private signalRService: SignalRService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.route.queryParams.subscribe(async (params) => {
        this.selectedRoomId = params['roomId'] || null;

        if (!this.selectedRoomId) {
          console.error(
            'Nie podano ID pokoju. Przekierowanie do strony głównej.'
          );
          this.router.navigate(['/home']);
          return;
        }

        this.playerName = sessionStorage.getItem('playerName') || 'Anonimowy';

        await this.signalRService.startConnection();

        // Wywołaj JoinRoom, aby zsynchronizować stan gry
        const joined = await this.signalRService.joinRoom(
          this.selectedRoomId,
          this.playerName
        );
        if (!joined) {
          console.error('Nie udało się dołączyć do pokoju.');
          this.router.navigate(['/home']);
          return;
        }

        console.log('SignalR connection started.');

        // Rejestruj eventy SignalR
        this.signalRService.onBoardUpdated((board, currentTurn) => {
          this.board = board;
          this.currentTurn = currentTurn;
        });

        this.signalRService.onPlayerJoined((playerName) => {
          this.message = `Do pokoju dołączył: ${playerName}`;
        });

        this.signalRService.onGameRestarted((board, currentTurn) => {
          this.board = board;
          this.currentTurn = currentTurn;
          this.isGameOver = false;
          this.message = 'Gra została zrestartowana!';
        });

        // Synchronizuj stan gry
        const gameState = await this.signalRService.getGameState(
          this.selectedRoomId
        );
        if (gameState) {
          this.board = gameState.board;
          this.currentTurn = gameState.currentTurn;
          this.isGameOver = gameState.isGameOver;
          this.message = this.isGameOver
            ? gameState.winner
              ? `Gra zakończona! Zwycięzca: ${gameState.winner}`
              : 'Gra zakończona remisem!'
            : '';
        }

        this.signalRService.onGameOver((winner: string) => {
          this.isGameOver = true;
          this.winner = winner;
        });
      });
    } catch (err) {
      console.error('Błąd połączenia z hubem: ', err);
      this.message = 'Wystąpił błąd podczas łączenia.';
    }
  }

  async restartGame() {
    try {
      if (this.selectedRoomId) {
        await this.signalRService.restartGame(this.selectedRoomId);
        console.log('Gra została zrestartowana.');
      }
    } catch (err) {
      console.error('Błąd podczas restartowania gry:', err);
    }
  }

  // Kliknięcie na polu
  async makeMove(row: number, col: number) {
    if (!this.selectedRoomId || this.isGameOver) {
      return;
    }
    try {
      const result = await this.signalRService.makeMove(
        this.selectedRoomId,
        row,
        col
      );

      if (!result) {
        this.wrongMove.set(true);
      } else {
        this.wrongMove.set(false);
      }
    } catch (err) {
      console.error(err);
    }
  }
  async leaveRoom() {
    const result = await this.signalRService.leaveRoom();
    this.router.navigate(['/home']);
    if (result) {
      this.selectedRoomId = null;
      this.isGameOver = false;
      this.board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' '],
      ];
    } else {
    }
  }
}
