import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from '../services/project.service';
import { JwtService } from "@nestjs/jwt";

describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectService: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: '1', name: 'Test Project' }),
            findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Project' }]),
            findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Test Project' }),
            update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated Project' }),
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

    projectController = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(projectController).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const dto = { name: 'Test Project' };
      const result = await projectController.create(dto);
      expect(result).toEqual({ id: '1', name: 'Test Project' });
      expect(projectService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const result = await projectController.findAll();
      expect(result).toEqual([{ id: '1', name: 'Test Project' }]);
      expect(projectService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a project by ID', async () => {
      const result = await projectController.findOne('1');
      expect(result).toEqual({ id: '1', name: 'Test Project' });
      expect(projectService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const dto = { name: 'Updated Project' };
      const result = await projectController.update('1', dto);
      expect(result).toEqual({ id: '1', name: 'Updated Project' });
      expect(projectService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('delete', () => {
    it('should delete a project by ID', async () => {
      const result = await projectController.delete('1');
      expect(result).toBeUndefined();
      expect(projectService.delete).toHaveBeenCalledWith('1');
    });
  });
});
