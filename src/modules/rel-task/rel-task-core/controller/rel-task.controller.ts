import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { CreateRelTaskDto } from '../../modules/dtos/create.rel-task.dto';
import { UpdateRelTaskDto } from '../../modules/dtos/update.rel-task.dto';
import { RelTaskEnt } from '../../modules/entities/rel-task.entity';
import { RelTaskPageDto } from '../../modules/paginations/rel-task.page.dto';
import { RelTaskService } from '../../modules/services/rel-task.service';

@ApiTags('RelTask')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@ApiBearerAuth('access-token')
@Controller('RelTask')
export class RelTaskController {
  constructor(private relTask: RelTaskService) { }

  @Post()
  createRelTask(
    @Query('id_src') id_src: string,
    @Query('id_ref') id_ref: string,
    @Body() createRelTaskDto: CreateRelTaskDto,
  ): Promise<RelTaskEnt> {
    createRelTaskDto.id_ref = id_ref;
    createRelTaskDto.id_src = id_src;
    return this.relTask.create(createRelTaskDto, ParamResultEnum.DTO);
  }

  @Get()
  findOneRelTask(
    @Query('id_rel_task') id_rel_task: string,
  ): Promise<RelTaskEnt> {
    return this.relTask.getOne(id_rel_task, ParamResultEnum.DTO);
  }

  @Put()
  updateRelTask(
    @Query('id_rel_task') id_rel_task: string,
    @Query('id_src') id_src: string,
    @Query('id_ref') id_ref: string,
    @Body() updateRelTaskDto: UpdateRelTaskDto,
  ): Promise<RelTaskEnt> {
    updateRelTaskDto.id_ref = id_ref;
    updateRelTaskDto.id_src = id_src;
    return this.relTask.update(id_rel_task, updateRelTaskDto, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'pagination for RelTask' })
  @Post('page')
  paginationRelTask(
    @Body() pageDto: RelTaskPageDto,
  ): Promise<PageDto<RelTaskEnt>> {
    return this.relTask.pagination(pageDto);
  }
}
