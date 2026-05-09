import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  notifyAll(event: string, payload: unknown) {
    this.server.emit(event, payload);
  }
}
