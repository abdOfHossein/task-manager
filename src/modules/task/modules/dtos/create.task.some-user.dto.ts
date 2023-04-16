import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsArray, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserResponseJWTDto } from 'src/common/dtos/user.dto';
import { DepartmentRlEnt } from 'src/modules/department-rl/modules/entities/department-rl.entity';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { ProjectEnt } from 'src/modules/project/modules/entities/project.entity';
import { ReqEnt } from 'src/modules/req/modules/entities/req.entity';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';
import { StatusTaskEnum } from '../enums/status-task.enum';
import { TypeTaskEnum } from '../enums/type-task.enum';

export class CreateTaskSomeUserDto {
  @ApiProperty()
  @Allow()
  id_department_rl: string;

  @ApiHideProperty()
  departmentRl: DepartmentRlEnt;

  @Allow()
  @ApiProperty()
  @IsOptional()
  priority: string;

  @Allow()
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  title: string;

  @Allow()
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  duration: string;

  @Allow()
  @ApiProperty()
  @IsOptional()
  head_id: string;

  @ApiHideProperty()
  id_project?: string;

  @ApiHideProperty()
  id_req?: string;

  @ApiHideProperty()
  id_department?: string;

  @ApiHideProperty()
  departmentEnt: DepartmentEnt;

  @ApiHideProperty()
  departmentRlEnt: DepartmentRlEnt;

  @ApiHideProperty()
  id_user?: UserResponseJWTDto | any;

  @ApiHideProperty()
  userEnt?: UserEnt;

  @ApiHideProperty()
  projectEnt?: ProjectEnt;

  @ApiHideProperty()
  reqEnt?: ReqEnt;

  @ApiProperty({ default: TypeTaskEnum.NEWTASK })
  type: TypeTaskEnum;

  @Allow()
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsDate({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_DATE') })
  do_date: Date;

  @Allow()
  @ApiProperty()
  remain_date: Date;

  @ApiProperty({ default: StatusTaskEnum.DOING })
  @Allow()
  status: StatusTaskEnum;

  @Allow()
  @ApiProperty()
  @IsArray()
  @IsUUID("all", { each: true, message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  id_users: string[];
}
