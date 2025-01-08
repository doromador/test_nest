import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../services/task.service';
import { JwtService } from "@nestjs/jwt";
import { CreateTaskDto } from "../dto/task.dto";

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: '1', title: 'Test Task' }),
            findAll: jest.fn().mockResolvedValue([{ id: '1', title: 'Test Task' }]),
            findOne: jest.fn().mockResolvedValue({ id: '1', title: 'Test Task' }),
            update: jest.fn().mockResolvedValue({ id: '1', title: 'Updated Task' }),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({ userId: 'test-user-id' }),
          },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto = { title: 'Test Task', description: 'Test Description', projectId: '1', status: 'New' } as CreateTaskDto
      const result = await taskController.create(dto);
      expect(result).toEqual({ id: '1', title: 'Test Task' });
      expect(taskService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const query = { status: 'open', projectId: '123', sortBy: 'title', order: 'asc' };
      const result = await taskController.findAll(query.status, query.projectId, query.sortBy, query.order as 'asc' | 'desc');
      expect(result).toEqual([{ id: '1', title: 'Test Task' }]);
      expect(taskService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      const result = await taskController.findOne('1');
      expect(result).toEqual({ id: '1', title: 'Test Task' });
      expect(taskService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const dto = { title: 'Updated Task' };
      const result = await taskController.update('1', dto);
      expect(result).toEqual({ id: '1', title: 'Updated Task' });
      expect(taskService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('delete', () => {
    it('should delete a task by ID', async () => {
      const result = await taskController.delete('1');
      expect(result).toBeUndefined();
      expect(taskService.delete).toHaveBeenCalledWith('1');
    });
  });
});
