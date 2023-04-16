import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { CreateEventDto } from '../../modules/dtos/create.event.dto';
import { UpdateEventDto } from '../../modules/dtos/update.event.dto';
import { EventEnt } from '../../modules/entities/event.entity';
import { EventPageDto } from '../../modules/paginations/event.page.dto';
import { EventService } from '../../modules/services/event.service';

@ApiTags('Event')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@ApiBearerAuth('access-token')
@Controller('Event')
export class EventController {
  constructor(private event: EventService) { }

  @ApiOperation({ summary: 'create for Event' })
  @Post()
  createEvent(@Body() createEventDto: CreateEventDto): Promise<EventEnt> {
    return this.event.create(createEventDto,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'findOne for Event' })
  @Get()
  findOneEvent(@Query('id_Event') id_Event: string): Promise<EventEnt> {
    return this.event.getOne(id_Event,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: ' update for Event' })
  @Put()
  updateEvent(
    @Query('id_Event') id_Event: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventEnt> {
    return this.event.update(id_Event, updateEventDto,ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'pagination for Event' })
  @Post('page')
  paginationEvent(@Body() pageDto: EventPageDto): Promise<PageDto<EventEnt>> {
    return this.event.pagination(pageDto);
  }
}
