import { Inject, Logger, forwardRef } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { UserSocket } from '@/core/types/socket';

import { GameService } from './game.service';

@WebSocketGateway({
  namespace: '/game',
  transport: ['websocket', 'polling'],
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  // ************ //
  // CONSTRUCTORS //
  // ************ //

  constructor(
    @Inject(forwardRef(() => GameService))
    private gameService: GameService,
  ) {}

  // ****** //
  // LOGGER //
  // ****** //

  private logger = new Logger(GameService.name);

  // ***************** //
  // GATEWAY FUNCTIONS //
  // ***************** //

  // **************** //
  // handleConnection //
  // **************** //

  async handleConnection(client: Socket) {
    const gameId = client.handshake.query.gameId as string;
    client.emit('connection', 'Successfully connected to game server');
    const game = await this.gameService.findOne(gameId);

    if (!game) {
      client.emit('error', `Game ${gameId} not found`);
      return;
    }

    client.join(gameId);

    this.logger.verbose(`Client ${client.id} connected to game ${gameId}`);
  }

  // **************** //
  // handleDisconnect //
  // **************** //

  handleDisconnect(client: UserSocket) {
    const gameId = client.handshake.query.gameId as string;
    this.gameService.leave(gameId, client.request.user.id).catch((err) => {});
    this.logger.verbose(`Client ${client.id} disconnected`);
    client.emit('disconnection', 'Successfully disconnected from game server');
  }

  // ********** //
  // handleJoin //
  // ********** //

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    const game = await this.gameService.findOneWithRelations(room);

    if (!game) {
      client.emit('error', `Game ${room} not found`);
      return;
    }

    this.gameService.join(room, client.request.user.id).catch((err) => {});

    client.join(room);

    this.server.to(room).emit('game:update', game);
  }

  // *********** //
  // handleLeave //
  // *********** //

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const game = await this.gameService.findOneWithRelations(room);

    if (!game) {
      client.emit('error', `Game ${room} not found`);
      return;
    }

    client.leave(room);
  }

  // ********** //
  // handleMove //
  // ********** //

  @SubscribeMessage('move')
  handleMove(
    @MessageBody() move: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('move', client.id, move);
  }
}
