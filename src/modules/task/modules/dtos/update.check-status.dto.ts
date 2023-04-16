import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { CheckStatusTaskEnum } from '../enums/check-status.enum';

export class UpdateCheckStatusTaskDto {
  @ApiProperty({ default: CheckStatusTaskEnum.DONE })
  @Allow()
  check_status: CheckStatusTaskEnum;
}
