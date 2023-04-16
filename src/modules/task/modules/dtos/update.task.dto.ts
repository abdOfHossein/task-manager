import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { StatusTaskEnum } from '../enums/status-task.enum';
import { TypeTaskEnum } from '../enums/type-task.enum';

export class UpdateTaskDto {
  @Allow()
  @ApiProperty()
  @IsOptional()
  priority: string;

  @Allow()
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
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

  @Allow()
  @ApiProperty()
  @IsOptional()
  remain_date: Date;

  @ApiProperty({ default: TypeTaskEnum.NEWTASK })
  @Allow()
  type: TypeTaskEnum;

  @ApiProperty({ default: StatusTaskEnum.DOING })
  @Allow()
  status: StatusTaskEnum;
}
