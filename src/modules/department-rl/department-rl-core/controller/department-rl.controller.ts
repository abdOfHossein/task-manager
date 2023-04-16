import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { CreateDepartmentRlDto } from '../../modules/dtos/create.department-rl.dto';
import { UpdateDepartmentRlDto } from '../../modules/dtos/update.department-rl.dto';
import { DepartmentRlEnt } from '../../modules/entities/department-rl.entity';
import { DepartmentRlPageDto } from '../../modules/paginations/department-rl.page.dto';
import { DepartmentRlService } from '../../modules/services/department-rl.service';

@ApiTags('DepartmentRl')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@ApiBearerAuth('access-token')
@Controller('DepartmentRl')
export class DepartmentRlController {
  constructor(private departmentRl: DepartmentRlService) { }

  @ApiOperation({ summary: 'create for departmentRl' })
  @Post()
  createDepartmentRl(
    @Query('req_id') req_id: string,
    @Query('department_id') department_id: string,
    @Body() createDepartmentRlDto: CreateDepartmentRlDto,
  ): Promise<DepartmentRlEnt> {
    createDepartmentRlDto.req_id = req_id;
    createDepartmentRlDto.department_id = department_id;
    return this.departmentRl.create(createDepartmentRlDto, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'findOne departmentRl' })
  @Get('/')
  findOneDepartmentRl(
    @Query('id_departmentRl') id_departmentRl: string,
  ): Promise<DepartmentRlEnt> {
    return this.departmentRl.getOne(id_departmentRl, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'update for departmentRl' })
  @Put()
  updateDepartmentRl(
    @Query('id_departmen_rl') id_departmen_rl: string,
    @Query('req_id') req_id: string,
    @Query('department_id') department_id: string,
    @Body() updateDepartmentRlDto: UpdateDepartmentRlDto,
  ): Promise<DepartmentRlEnt> {
    updateDepartmentRlDto.req_id = req_id;
    updateDepartmentRlDto.department_id = department_id;
    return this.departmentRl.update(
      id_departmen_rl,
      updateDepartmentRlDto, ParamResultEnum.DTO
    );
  }

  @ApiOperation({ summary: 'pagination for DepartmentRl' })
  @Post('page')
  paginationDepartmentRl(
    @Body() pageDto: DepartmentRlPageDto,
  ): Promise<PageDto<DepartmentRlEnt>> {
    return this.departmentRl.pagination(pageDto);
  }

  @ApiOperation({ summary: 'List of User for Department' })
  @Get('list/user')
  listUserDepartment(
    @Query('department_rl_id') department_rl_id: string,
  ) {
    return this.departmentRl.listUserDepartment(department_rl_id);
  }
}
