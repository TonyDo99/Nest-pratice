import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Delete,
  Query,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '../entities/task.entity';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { TasksService } from './tasks.service';
import { CacheInterceptorRes } from './interceptor/cache.interceptor';
@Controller('tasks')
@UseGuards(AuthGuard())
@UseInterceptors(CacheInterceptorRes)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('')
  getAllTask(@GetUser() user: User) {
    return this.tasksService.getAllTasks(user);
  }

  @Get('/search')
  searchingTask(
    @Query() searchTaskDto: SearchTaskDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    if (Object.keys(searchTaskDto).length)
      return this.tasksService.searchingTask(searchTaskDto, user);
    return this.tasksService.getAllTasks(user);
  }

  @Get('/:id')
  getByID(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTaskById(id, user);
  }

  @UseInterceptors(new TransformInterceptor())
  @Post('/create')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }
}
