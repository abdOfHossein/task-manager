import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Delete, Put } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';
import { ConfigRoleDto } from '../../modules/dtos/config.roele.dto';
import { CreateRoleDto } from '../../modules/dtos/create.role.dto';
import { UpdateRoleDto } from '../../modules/dtos/update.role.dto';
import { RoleEnt } from '../../modules/entities/role.entity';
import { RolePageDto } from '../../modules/paginations/role.page.dto';
import { RoleService } from '../../modules/services/role.service';

//  create getOne update pagination delete

@ApiTags('Role')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@ApiBearerAuth('access-token')
@Controller('Role')
export class RoleController {
  constructor(private role: RoleService) {}

  @ApiOperation({ summary: 'create Role' })
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEnt> {
    return this.role.create(createRoleDto,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'create Role' })
  @Put()
  updateRole(
    @Query('id_role') id_role: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEnt> {
    return this.role.update(id_role,updateRoleDto,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'findOne Role' })
  @Get()
  findOneRole(@Query('role_id') role_id: string): Promise<RoleEnt> {
    return this.role.getOne(role_id,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'delete Role' })
  @Delete('deleteRole')
  deleteRole(@Query('id_role') id_role: string): Promise<RoleEnt> {
    return this.role.delete(id_role,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'pagination Role' })
  @Post('page')
  paginationRole(@Body() pageDto: RolePageDto): Promise<PageDto<RoleEnt>> {
    return this.role.pagination(pageDto);
  }

  @ApiOperation({ summary: 'lst all Role' })
  @Get('all')
  findAllRole(): Promise<RoleEnt[]> {
    return this.role.findAllRole();
  }

  @ApiOperation({ summary: 'change Role' })
  @Put('configRole')
  configRole(
    @Query('id_user') id_user: string,
    @Body() configRoleDto: ConfigRoleDto,
  ): Promise<UserEnt> {
    return this.role.configRole(id_user, configRoleDto);
  }

  @ApiOperation({ summary: 'pagination Role of a User' })
  @Post('/page/ofUser')
  paginationRoleUser(
    @Query('id_user') id_user: string,
    @Body() rolePageDto: RolePageDto,
  ): Promise<PageDto<RoleEnt>> {
    return this.role.paginationRoleUser(id_user, rolePageDto);
  }

  @ApiOperation({ summary: 'delete specific Role of a User' })
  @Delete('/specificRoel')
  deleteSpecificRole(
    @Query('id_user') id_user: string,
    @Query('id_role') id_role: string,
  ): Promise<RoleEnt> {
    return this.role.deleteSpecificRole(id_user, id_role);
  }

  @ApiOperation({ summary: 'add specific Role to a User' })
  @Post('/addRole')
  addRole(
    @Query('id_user') id_user: string,
    @Query('id_role') id_role: string,
  ): Promise<UserEnt> {
    return this.role.addRole(id_user, id_role);
  }
}
