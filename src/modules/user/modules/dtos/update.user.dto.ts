import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Allow, IsArray, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { FileEnt } from 'src/modules/file/modules/entities/file.entity';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';

export class UpdateUserDto {
  @ApiHideProperty()
  unq_file: string;

  @ApiHideProperty()
  file: FileEnt;

  @ApiHideProperty()
  departmentEnt: DepartmentEnt;

  @ApiHideProperty()
  id_department: string;

  @ApiHideProperty()
  role_default_status: boolean;

  @ApiHideProperty()
  roleEnt: RoleEnt[];

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsArray({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_ARRAY') })
  @IsUUID("all", { each: true, message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
  @ApiProperty()
  @Allow()
  id_role: string[];

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiProperty()
  @Allow()
  first_name: string;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiProperty()
  @Allow()
  last_name: string;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiProperty()
  @Allow()
  username: string;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiProperty()
  @Allow()
  password: string;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsEmail({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_EMAIL') })
  @ApiProperty()
  @Allow()
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsPhoneNumber("IR", { message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_PHONE_NUMBER') })
  @ApiProperty()
  @Allow()
  phonenumber: string;
}
