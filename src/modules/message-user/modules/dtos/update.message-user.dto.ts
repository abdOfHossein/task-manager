import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { MessageEnt } from 'src/modules/message/modules/entities/message.entity';

export class UpdateMessageUserDto {
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_DATE') })
  @ApiProperty()
  @Allow()
  publish_date: Date;

  @ApiHideProperty()
  user_id: string;

  @ApiProperty()
  @Allow()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  content: string;

  @ApiProperty()
  @Allow()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  seen: number;

  @ApiHideProperty()
  message: MessageEnt;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiHideProperty()
  message_id: string;
}
