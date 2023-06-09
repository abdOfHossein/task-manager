import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { StatusTaskEnum } from '../enums/status-task.enum';

export class UpdateStatusTaskDto {
  @ApiProperty({ default: StatusTaskEnum.DOING })
  @Allow()
  status: StatusTaskEnum;
}
