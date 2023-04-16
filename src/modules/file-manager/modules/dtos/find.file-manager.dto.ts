import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { RecieveTypeEnum } from '../enums/file-manager.enum';

export class FindFileManagerDto {
  @ApiProperty()
  @Allow()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsUUID("all", { message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
  destination_id: string;

  @ApiProperty({ default: RecieveTypeEnum.PUBLIC })
  @Allow()
  reciverType: RecieveTypeEnum;
}
