import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task', example: 'Cool Task' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The description of the task', example: 'Make it' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The status of the task', example: 'New' })
  @IsOptional()
  @IsEnum(['New', 'In progress', 'Done'])
  status?: string;

  @ApiProperty({ description: 'The projectId of the task', example: '111' })
  @IsString()
  projectId: string;

  // constructor(title: string, description?: string, projectId?: string, status?: string) {
  //   this.title = title;
  //   this.projectId = projectId;
  //   this.description = description;
  //   this.status = status;
  // }
}

export class UpdateTaskDto {
  @ApiProperty({ description: 'The title of the task', example: 'Cool Task' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The description of the task', example: 'Do it' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The status of the task', example: 'In progress' })
  @IsOptional()
  @IsEnum(['New', 'In progress', 'Done'])
  status?: string;
}
