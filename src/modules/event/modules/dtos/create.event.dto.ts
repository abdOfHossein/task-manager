import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PriorityEventEnum } from '../enums/priority-event.enum';

export class CreateEventDto {
  @ApiProperty({ default: PriorityEventEnum.PRIMARY })
  @Allow()
  priority: PriorityEventEnum;

  @Transform(({ value }) => new Date(value))
  @IsDate({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_DATE') })
  @ApiProperty()
  @Allow()
  start_date: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_DATE') })
  @ApiProperty()
  @Allow()
  end_date: Date;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiProperty()
  @Allow()
  title: string;
}
