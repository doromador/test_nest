import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskService } from './services/task.service';
import { ProjectService } from './services/project.service';
import { TaskController } from './controllers/task.controller';
import { ProjectController } from './controllers/project.controller';
import { Task, TaskSchema } from './entities/task.entity';
import { Project, ProjectSchema } from './entities/project.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [TaskController, ProjectController],
  providers: [TaskService, ProjectService],
})
export class TaskModule {}
