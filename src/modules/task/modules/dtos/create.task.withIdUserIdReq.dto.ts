import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { DepartmentRlEnt } from '../../../department-rl/modules/entities/department-rl.entity';
import { UserEnt } from '../../../user/modules/entities/user.entity';

export class CreateTaskWithIdUserIdReqDto {
  @ApiHideProperty()
  departmentRl: DepartmentRlEnt;

  @ApiHideProperty()
  userEnt?: UserEnt;

  @Allow()
  @ApiProperty()
  @IsOptional()
  priority: string;

  @Allow()
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  title: string;

  @Allow()
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  duration: number;

  @Allow()
  @ApiProperty()
  @IsOptional()
  head_id: string;

  @Allow()
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsDate({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_DATE') })
  do_date: Date;
}
