import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { CreateBackendDto } from '../../modules/backend/dtos/create.backend.dto';
import { UpdateBackendDto } from '../../modules/backend/dtos/update.backend.dto';
import { BackendPageDto } from '../../modules/backend/pagination/backend.page.dto';
import { BackendService } from '../../modules/backend/services/backend.service';

@ApiBearerAuth('access-token')
@ApiTags('backend')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@Controller('backend')
export class BackendController {
  constructor(private backendService: BackendService) { }

  @ApiOperation({ summary: 'pagination of backend' })
  @Post('page')
  pagination(@Body() pageDto: BackendPageDto) {
    return this.backendService.pagination(pageDto);
  }

  @ApiOperation({ summary: 'create backend' })
  @Post()
  create(@Body() createBackendDto: CreateBackendDto) {   
    return createBackendDto
    // return this.backendService.create(createBackendDto, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'findOne backend' })
  @Get()
  getOne(@Query('id_backend') id_backend: string) {
    return this.backendService.getOne(id_backend, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'update backend' })
  @Put()
  update(
    @Query('id_backend') id_backend: string,
    @Body() updateBackendDto: UpdateBackendDto,
  ) {
    return this.backendService.update(id_backend, updateBackendDto, ParamResultEnum.DTO);
  }
}
