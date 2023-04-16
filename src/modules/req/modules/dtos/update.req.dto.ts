import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ProjectEnt } from 'src/modules/project/modules/entities/project.entity';
import { StatusReqEnum } from '../enums/req.enum';

export class UpdateReqDto {

  @Allow()
  @ApiProperty()
  id_departments: Array<any | string>;

  @ApiProperty({ default: StatusReqEnum.OPEN })
  @Allow()
  status: StatusReqEnum;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @Allow()
  @ApiProperty()
  name: string;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @Allow()
  @ApiProperty()
  description: string;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsUUID("all", { message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
  @Allow()
  @ApiProperty()
  id_project: string;

  @ApiHideProperty()
  projectEnt: ProjectEnt;
}
