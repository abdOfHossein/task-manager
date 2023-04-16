import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FileEnt } from 'src/modules/file/modules/entities/file.entity';

export class UpdateProjectDto {
  @ApiProperty()
  @Allow()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  project_name: string;

  @ApiProperty()
  @Allow()
  @IsOptional()
  unq_file: string

  @ApiHideProperty()
  file: FileEnt
}
