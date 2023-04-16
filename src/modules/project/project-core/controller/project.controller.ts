import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { CreateProjectDto } from '../../modules/dtos/create.project.dto';
import { UpdateProjectDto } from '../../modules/dtos/update.project.dto';
import { ProjectEnt } from '../../modules/entities/project.entity';
import { ProjectPageDto } from '../../modules/paginations/project.page.dto';
import { ProjectService } from '../../modules/services/project.service';

@ApiTags('Project')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@ApiBearerAuth('access-token')
@Controller('Project')
export class ProjectController {
  constructor(private project: ProjectService) { }

  @ApiOperation({ summary: 'create Project' })
  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectEnt> {
    return this.project.create(createProjectDto,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'findOne Project' })
  @Get()
  findOneProject(@Query('id_project') id_project: string): Promise<ProjectEnt> {
    return this.project.getOne(id_project,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'update Project' })
  @Put()
  updateProject(
    @Query('id_project') id_project: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectEnt> {
    return this.project.update(id_project, updateProjectDto,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'delete Project' })
  @Delete()
  deleteProject(@Query('id_project') id_project: string): Promise<ProjectEnt> {
    return this.project.delete(id_project,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'pagination for Project' })
  @Post('page')
  paginationProject(
    @Body() pageDto: ProjectPageDto,
  ): Promise<PageDto<ProjectEnt>> {
    return this.project.pagination(pageDto);
  }

  @ApiOperation({ summary: 'Get All Projects' })
  @Get('all')
  async getAllProject(): Promise<ProjectEnt[]> {
    return this.project.getAllProject();
  }

  @ApiOperation({ summary: 'findAll Project of a User based on id_user' })
  @Post('/all/id_user')
  allProjectWithIdUSer(
    @Query('id_user') id_user: string,
  ): Promise<ProjectEnt[]> {
    return this.project.allProjectWithIdUSer(id_user);
  }
  
  @ApiOperation({
    summary: 'findAll Project with its Total Reqs and Done Reqs',
  })
  @Get('all/withReqs')
  allProjectWithReq(): Promise<ProjectEnt[]> {
    return this.project.allProjectWithReq();
  }

}
