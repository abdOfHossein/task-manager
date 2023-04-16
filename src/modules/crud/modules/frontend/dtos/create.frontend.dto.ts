import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TypePlatformEnum } from '../enum/type.platform.enum';

export class CreateFrontendDto {
  @ApiProperty()
  @Allow()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  slug_name: string;

  @ApiProperty()
  @Allow()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  description: string;

  @ApiProperty()
  @Allow()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  host: string;

  @ApiProperty()
  @Allow()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  route: string;

  @Allow()
  @ApiProperty({ default: TypePlatformEnum.WEB })
  type_platform: TypePlatformEnum;
}
