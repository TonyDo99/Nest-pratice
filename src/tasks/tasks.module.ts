import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Task } from '../entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule,
    CacheModule.register(),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TypeOrmModule.forFeature([Task])],
})
export class TasksModule {}
