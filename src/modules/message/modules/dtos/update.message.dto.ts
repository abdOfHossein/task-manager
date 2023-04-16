import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';
import { MessageTypeEnum } from '../enum/message.type.enum';
import { RecieveTypeMessageEnum } from '../enum/recieve.type.message.enum';

export class UpdateMessageDto {
  @ApiProperty()
  @Allow()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsArray({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_ARRAY') })
  @IsUUID('all', { each: true, message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') },)
  to: string[];

  @ApiProperty()
  @Allow()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  title: string;

  @ApiProperty()
  @Allow()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  content: string;

  @ApiProperty({ default: RecieveTypeMessageEnum.ALL })
  recieve_type: RecieveTypeMessageEnum;

  @ApiProperty({ default: MessageTypeEnum.SUCCESS })
  message_type: MessageTypeEnum;

  @ApiProperty()
  @Allow()
  @Transform(({ value }) => new Date(value))
  publish_date: Date;

  @ApiHideProperty()
  id_user: string;

  @ApiHideProperty()
  users: UserEnt;
}
