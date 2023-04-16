import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateDepartmentDto {

  @IsUUID("all", { message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
  @ApiProperty()
  @Allow()
  header_id: string;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiProperty()
  @Allow()
  name_department: string;
}
