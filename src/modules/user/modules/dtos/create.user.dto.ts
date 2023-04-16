import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Allow, IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { FileEnt } from 'src/modules/file/modules/entities/file.entity';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';

export class CreateUserDto {
  @Allow()
  @ApiProperty()
  @IsOptional()
  unq_file?: string;

  @ApiHideProperty()
  file: FileEnt;

  @ApiHideProperty()
  departmentEnt: DepartmentEnt;

  @ApiHideProperty()
  id_department: string;

  @ApiHideProperty()
  roleEnt: RoleEnt[];

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsArray({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_ARRAY') })
  @IsUUID("all", { each: true, message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
  @Allow()
  @ApiProperty()
  id_role: string[];

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @Allow()
  @ApiProperty()
  first_name: string;

  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @Allow()
  @ApiProperty()
  last_name: string;


  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @Allow()
  @ApiProperty()
  username: string;


  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @Allow()
  @ApiProperty()
  password: string;


  @IsEmail({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_EMAIL') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @Allow()
  @ApiProperty()
  email: string;


  @IsPhoneNumber("IR", { message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_PHONE_NUMBER') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @Allow()
  @ApiProperty()
  phonenumber: string;
}
