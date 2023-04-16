import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { JwtGuard } from 'src/modules/user/modules/auth/guards/jwt.guard';
import { CreateRoleRlBackendDto } from '../../modules/role-backend-rl/dtos/create-role-rl-backend.dto';
import { UpdateRoleRlBackendDto } from '../../modules/role-backend-rl/dtos/update-role-rl-backend.dto';
import { RoleRlBackendEnt } from '../../modules/role-backend-rl/entities/role-rl-backend.entity';
import { RoleRlBackendPageDto } from '../../modules/role-backend-rl/pagination/country.page.dto';
import { RoleRlBackendService } from '../../modules/role-backend-rl/services/role-rl-backend.service';


@ApiTags('role-backend')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@ApiBearerAuth('access-token')
@Controller('role-backend')
export class RoleRlBackendController {
  constructor(private roleRlBackendService: RoleRlBackendService) { }


  @ApiOperation({ summary: 'Create role_backend' })
  @Post()
  create(@Body() createRoleRlBackendDto: CreateRoleRlBackendDto) {
    return this.roleRlBackendService.create(createRoleRlBackendDto, ParamResultEnum.DTO);
  }


  @ApiOperation({ summary: 'Getone role_backend' })
  @Get()
  getOne(@Query('id_role_backend') id_role_backend: string) {
    return this.roleRlBackendService.getOne(id_role_backend, ParamResultEnum.DTO);
  }


  @ApiOperation({ summary: 'update role_backend' })
  @Put()
  update(
    @Query('id_role_backend') id_role_backend: string,
    @Body() updateRoleRlBackendDto: UpdateRoleRlBackendDto,
  ) {
    return this.roleRlBackendService.update(
      id_role_backend,
      updateRoleRlBackendDto,
      ParamResultEnum.DTO
    );
  }


  @ApiOperation({ summary: 'delete role_backend' })
  @Delete()
  delete(@Query('id_role_backend') id_role_backend: string) {
    return this.roleRlBackendService.delete(id_role_backend, ParamResultEnum.DTO);
  }


  @ApiOperation({ summary: 'pagination for Arch' })
  @Post('page')
  getPaginationArch(
    @Body() pageDto: RoleRlBackendPageDto,
  ): Promise<PageDto<RoleRlBackendEnt>> {
    return this.roleRlBackendService.pagination(pageDto);
  }
}
