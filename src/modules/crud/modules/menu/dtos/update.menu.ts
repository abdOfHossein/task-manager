import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import { FrontendEnt } from '../../frontend/entities/frontend.entity';
import { MenuEnt } from '../entities/menu.entity';

export class UpdateMenuDto {
  @ApiProperty()
  @Allow()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  slug_name: string;

  @ApiProperty()
  @Allow()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsNumber({ allowNaN: true }, { message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_INTEGER') })
  base_order: number;

  @ApiProperty()
  @Allow()
  id_parent?: string;

  @ApiProperty()
  @Allow()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  id_front?: string;

  @ApiProperty()
  @Allow()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  id_role: string;

  @ApiHideProperty()
  frontend: FrontendEnt;

  @ApiHideProperty()
  parent?: MenuEnt;

  @ApiHideProperty()
  role: RoleEnt;
}
