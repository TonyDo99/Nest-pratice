import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { CreateTaskDto } from '../dto/create-task.dto';
import { SearchTaskDto } from '../dto/search-task.dto';
import { TaskStatus } from '../task-staus.enum';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';

describe('CRUD TESTING API', () => {
  // jest.setTimeout(50000);
  let app: INestApplication;
  let tasksController: TasksController;

  const mockCreateTaskDto: CreateTaskDto = {
    title: 'Testing',
    status: TaskStatus.IN_PROGRESS,
    description: 'Testing task',
  };

  const mockSearchingDto: SearchTaskDto = {
    status: TaskStatus.DONE,
    search: 'asd',
  };

  const mockTaskService = {
    createTask: jest.fn((dto: CreateTaskDto) => {
      return {
        id: 'df2ce0f5-4a1b-4fb3-83aa-b492cf398ae3',
        ...dto,
      };
    }),
    getAllTasks: jest.fn((dto: CreateTaskDto) => {
      return [{ id: 'df2ce0f5-4a1b-4fb3-83aa-b492cf398ae3', ...dto }];
    }),

    searchingTask: jest.fn((mockSearchingDto: SearchTaskDto) => {
      return {
        id: 'df2ce0f5-4a1b-4fb3-83aa-b492cf398ae3',
        ...mockCreateTaskDto,
      };
    }),

    deleteTask: jest.fn(() => {
      return {
        status: 200,
        message: 'Delete task 0359d7b5-cc72-45b9-b1b7-3dbe009a5f8c success !',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    })
      .overrideProvider(TasksService)
      .useValue(mockTaskService)
      .compile();

    tasksController = module.get<TasksController>(TasksController);
    app = module.createNestApplication();
    app.init();
  });

  describe('Defined CRUD controller function', () => {
    it('Create task should be defined', () => {
      expect(tasksController.createTask).toBeDefined();
    });

    it('Searching task by ID should be defined', () => {
      expect(tasksController.getByID).toBeDefined();
    });

    it('Get all task should be defined', () => {
      expect(tasksController.getAllTask).toBeDefined();
    });

    it('Delete task should be defined', () => {
      expect(tasksController.deleteTask).toBeDefined();
    });

    it('Seaching task by title or status should be defined', () => {
      expect(tasksController.searchingTask).toBeDefined();
    });

    it('Update task by title or status should be defined', () => {
      expect(tasksController.updateTask).toBeDefined();
    });
  });

  describe('Testing API', () => {
    it('/GET All tasks', async () => {
      const response = await request(app.getHttpServer()).get('/tasks');
      expect(response.status).toEqual(200);
      expect(
        expect.arrayContaining(mockTaskService.getAllTasks(mockCreateTaskDto)),
      );
    });

    it('/POST Create task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks/create')
        .send(mockCreateTaskDto);
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        mockTaskService.createTask(mockCreateTaskDto),
      );
    });
  });
  it('/DELETE tasks', async () => {
    const response = await request(app.getHttpServer).delete(
      `/tasks/${'0359d7b5-cc72-45b9-b1b7-3dbe009a5f8c'}`,
    );
    console.log(
      '🚀 ~ file: tasks.controller.spec.ts ~ line 116 ~ it ~ response',
      response.body,
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockTaskService.deleteTask());
  });
});
