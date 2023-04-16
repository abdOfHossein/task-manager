import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { RecieveTypeEnum } from '../enums/file-manager.enum';

export class CreateFileManagerDto {
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiProperty()
  @Allow()
  title: string;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsUUID("all", { message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
  @ApiProperty()
  @Allow()
  destination_id: string;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiProperty()
  @Allow()
  description: string;

  @IsArray({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_ARRAY') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @ApiProperty()
  @Allow()
  files: string[];

  @ApiProperty({ default: RecieveTypeEnum.PUBLIC })
  @Allow()
  reciverType: RecieveTypeEnum;
}
