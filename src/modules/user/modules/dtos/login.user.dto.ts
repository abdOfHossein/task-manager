import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Allow()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Allow()
  username: string;
}
