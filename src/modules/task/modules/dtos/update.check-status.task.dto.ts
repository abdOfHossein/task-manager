import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class UpdateStatusCheckStatusTaskDto {
  @Allow()
  @ApiProperty()
  status: string;
}
