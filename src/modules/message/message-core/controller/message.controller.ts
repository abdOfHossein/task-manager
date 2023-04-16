import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { CreateMessageDto } from '../../modules/dtos/create.message.dto';
import { MessageEnt } from '../../modules/entities/message.entity';
import { MessageService } from '../../modules/services/message.service';

@ApiTags('Message')
@ApiBearerAuth('access-token')
@Controller('Message')
export class MessageController {
  constructor(private message: MessageService) { }

  @ApiOperation({ summary: 'create Message' })
  @Post()
  createMessage(@Body() createMessageDto: CreateMessageDto): Promise<MessageEnt> {
    return this.message.create(createMessageDto, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'delelte Message' })
  @Delete()
  delelteMessage(@Query('id_message') id_message: string) {
    return this.message.delete(id_message, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'findAll Message' })
  @Get()
  getUsers(): Promise<MessageEnt[]> {
    return this.message.getUsers();
  }
}
