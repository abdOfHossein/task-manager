import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Put,
	Query
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiHeader,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { CreateFrontendDto } from '../../modules/frontend/dtos/create.frontend.dto';
import { UpdateFrontendDto } from '../../modules/frontend/dtos/update.frontend.dto';
import { FrontendPageDto } from '../../modules/frontend/pagination/frontend.page.dto';
import { FrontendService } from '../../modules/frontend/services/frontend.service';

@ApiTags('frontend')
@ApiHeader({
	name: 'accept-language',
	description: 'language code',
	schema: {
		default: 'fa',
	},
})
@ApiBearerAuth('access-token')
@Controller('frontend')
export class FrontendController {
	constructor(private frontendService: FrontendService) { }

	@ApiOperation({ summary: 'page of frontend' })
	@Post('page')
	pagination(@Body() pageDto: FrontendPageDto) {
		return this.frontendService.pagination(pageDto);
	}

	@ApiOperation({ summary: 'create of frontend' })
	@Post()
	create(@Body() createFrontendDto: CreateFrontendDto) {
		return this.frontendService.create(createFrontendDto, ParamResultEnum.DTO);
	}

	@ApiOperation({ summary: 'findOne frontend' })
	@Get()
	getOne(@Query('id_frontend') id_frontend: string) {
		return this.frontendService.getOne(id_frontend, ParamResultEnum.DTO);
	}

	@ApiOperation({ summary: 'update frontend' })
	@Put()
	update(
		@Query('id_frontend') id_frontend: string,
		@Body() updateFrontendDto: UpdateFrontendDto,
	) {
		return this.frontendService.update(id_frontend, updateFrontendDto, ParamResultEnum.DTO);
	}

	@ApiOperation({ summary: 'delete frontend' })
	@Delete()
	delete(@Query('id_frontend') id_frontend: string) {
		return this.frontendService.delete(id_frontend, ParamResultEnum.DTO);
	}

	@ApiOperation({ summary: 'getAll frontend' })
	@Get('/all')
	getAll() {
		return this.frontendService.getAll();
	}
}
