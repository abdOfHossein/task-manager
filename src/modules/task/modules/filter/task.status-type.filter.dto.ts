import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { StatusTaskEnum } from '../enums/status-task.enum';
import { TypeTaskEnum } from '../enums/type-task.enum';

export class TaskTypeStatusFilterDto {
  @ApiProperty({ default: TypeTaskEnum.NEWTASK })
  @Allow()
  type: TypeTaskEnum;

  @ApiProperty({ default: StatusTaskEnum.DOING })
  @Allow()
  status: StatusTaskEnum;
}
