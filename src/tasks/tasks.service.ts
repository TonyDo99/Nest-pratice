import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from '../messages';
import { Like, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class TasksService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task[]> {
    const found = await this.taskRepository.manager.find(Task, {
      where: { id, user },
    });
    if (!found) throw new NotFoundException(`Task with id ${id} not found`);

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, status } = createTaskDto;

    const task = this.taskRepository.manager.create(Task, {
      title,
      description,
      status,
      user,
    });
    await this.taskRepository.manager.save(task);
    return task;
  }

  async getAllTasks(user: User): Promise<Task[]> {
    const cache: Task[] = await this.cacheManager.get('tasks');
    if (cache) return cache;
    else {
      const tasks = await this.taskRepository.manager.find(Task, {
        where: { user },
      });
      await this.cacheManager.set('tasks', tasks);
      return tasks;
    }
  }

  async deleteTask(id: string, user: User) {
    try {
      const { affected } = await this.taskRepository
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where('id = :id', { id })
        .andWhere('user = :user', { user: user.id })
        .execute();
      if (!affected)
        throw new NotFoundException(`Task ${id} delete unsuccessful !`);
      return { status: 200, message: `Delete task ${id} success !` };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async searchingTask(searchTaskDto: SearchTaskDto, user: User) {
    const { status, search } = searchTaskDto;
    try {
      if (status || search)
        return await this.taskRepository.manager.find(Task, {
          where: [{ user, description: Like(`%${search}%`), status }],
        });
      return this.getAllTasks(user);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<{ status: boolean; message: string }> {
    try {
      const { status } = updateTaskDto;

      const updated = await this.taskRepository
        .createQueryBuilder()
        .update(Task)
        .set({ status })
        .where('id = :id', { id })
        .andWhere('user = :user', { user: user.id })
        .execute();
      if (!updated.affected)
        throw new NotFoundException(`Task update unsuccessful !`);
      return SuccessResponse(true, `Task updated successfully !`);
    } catch (error) {
      return error;
    }
  }
}
