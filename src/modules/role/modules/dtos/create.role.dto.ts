import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Allow()
  @ApiProperty()
  role_type: string;
}
