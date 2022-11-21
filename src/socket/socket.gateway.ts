import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { SocketService } from './socket.service';
import { Socket } from 'dgram';

@WebSocketGateway(3001, { transports: ['websocket'] })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(SocketGateway.name);
  constructor(private readonly socketService: SocketService) {}
  handleDisconnect(client: any) {
    this.logger.log(`Socket gateway disconnected !`);
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Socket gateway connected ! ${client.id}`);
  }

  @SubscribeMessage('findAllTask')
  async create(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.emit('findAllTask', await this.socketService.findAllTask());
  }
}
