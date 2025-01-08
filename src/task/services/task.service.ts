import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from "mongoose";
import { Task } from '../entities/task.entity';
import { Project } from '../entities/project.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const projectExists = await this.projectModel.exists({
      _id: createTaskDto.projectId,
    });
    if (!projectExists) {
      throw new BadRequestException('Project does not exist');
    }
    const task = new this.taskModel(createTaskDto);
    return task.save();
  }

  async findAll(filters: {
    status?: string;
    projectId?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) {
    const query = this.taskModel.find();

    if (filters.status) {
      query.where('status').equals(filters.status);
    }

    if (filters.projectId) {
      query.where('projectId').equals(filters.projectId);
    }

    if (filters.sortBy) {
      const sortOrder = filters.order === 'asc' ? 1 : -1;
      query.sort({ [filters.sortBy]: sortOrder });
    }

    return query.exec();
  }

  async findOne(id: string) {
    return this.taskModel.findById(id).exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async delete(id: string) {
    return this.taskModel.findByIdAndDelete(id).exec();
  }
}
