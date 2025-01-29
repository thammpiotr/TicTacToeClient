import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;

  private gameStateSource = new BehaviorSubject<{
    board: string[][];
    currentTurn: string;
    isGameOver: boolean;
  } | null>(null);
  public gameState$ = this.gameStateSource.asObservable();

  constructor() {}

  public async startConnection(): Promise<void> {
    if (
      this.hubConnection &&
      this.hubConnection.state === signalR.HubConnectionState.Connected
    ) {
      return;
    }
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5225/ticTacToeHub')
      .build();

    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl('https://tictactoe-server-0sgo.onrender.com/ticTacToeHub')
    //   .build();
    this.registerOnServerEvents();
    await this.hubConnection.start();
  }

  public getRooms(): Promise<string[]> {
    return this.hubConnection!.invoke('GetRooms');
  }

  public createRoom(playerName: string): Promise<string> {
    const playerId = localStorage.getItem('playerId');
    return this.hubConnection!.invoke('CreateRoom', playerName, playerId);
  }

  public joinRoom(roomId: string, playerName: string): Promise<boolean> {
    const playerId = localStorage.getItem('playerId');
    return this.hubConnection!.invoke('JoinRoom', roomId, playerName, playerId);
  }

  public makeMove(roomId: string, row: number, col: number): Promise<boolean> {
    const playerId = localStorage.getItem('playerId');
    return this.hubConnection!.invoke('MakeMove', roomId, row, col, playerId);
  }

  public leaveRoom(): Promise<boolean> {
    return this.hubConnection!.invoke('LeaveRoom');
  }
  public restartGame(roomId: string): Promise<void> {
    return this.hubConnection!.invoke('RestartGame', roomId);
  }
  public onGameRestarted(
    callback: (board: string[][], currentTurn: string) => void
  ): void {
    this.hubConnection!.on('GameRestarted', callback);
  }

  public enterRoomGroup(roomId: string): Promise<boolean> {
    return this.hubConnection!.invoke('EnterRoomGroup', roomId);
  }

  public onBoardUpdated(
    callback: (board: string[][], currentTurn: string) => void
  ): void {
    this.hubConnection!.on('BoardUpdated', callback);
  }

  public onPlayerJoined(callback: (playerName: string) => void): void {
    this.hubConnection!.on('PlayerJoined', callback);
  }

  private registerOnServerEvents(): void {
    this.hubConnection!.on(
      'SyncGameState',
      (
        board: string[][],
        currentTurn: string,
        isGameOver: boolean,
        winner: string
      ) => {
        this.gameStateSource.next({
          board,
          currentTurn,
          isGameOver,
        });
      }
    );
  }
  public getGameState(roomId: string): Promise<{
    board: string[][];
    currentTurn: string;
    isGameOver: boolean;
    winner: string;
    playerXName: string;
    playerOName: string;
  }> {
    return this.hubConnection!.invoke('GetGameState', roomId);
  }

  public onGameOver(callback: (winner: string) => void): void {
    this.hubConnection!.on('GameOver', (winner: string) => {
      callback(winner);
    });
  }

  public getRoomsWithPlayerCounts(): Promise<
    { roomId: string; playerCount: number }[]
  > {
    return this.hubConnection!.invoke<
      { roomId: string; playerCount: number }[]
    >('GetRoomsWithPlayerCounts');
  }
  public onRoomsUpdated(
    callback: (rooms: { roomId: string; playerCount: number }[]) => void
  ): void {
    this.hubConnection!.on('RoomsUpdated', (rooms) => {
      callback(rooms);
    });
  }
}
