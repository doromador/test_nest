import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
  @ApiProperty({ description: 'The title of the project', example: 'Project Alpha' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the project', example: 'A detailed project description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateProjectDto {
  @ApiProperty({ description: 'The title of the project', example: 'Project Alpha' })
  @IsString()
  name?: string;

  @ApiProperty({ description: 'The description of the project', example: 'A detailed project description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
