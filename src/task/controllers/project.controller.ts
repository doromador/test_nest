import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body, HttpStatus, HttpCode, UseGuards
} from "@nestjs/common";
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { AuthGuard } from "../../auth/auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('project')
@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectsService: ProjectService) {}

  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created.' })
  @ApiBody({ type: CreateProjectDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'List of projects returned.' })
  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project returned.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Project ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiResponse({ status: 200, description: 'Project successfully updated.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiParam({ name: 'id', type: String, description: 'Project ID' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: 204, description: 'Project successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Project ID' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }
}
