import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TasksModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
