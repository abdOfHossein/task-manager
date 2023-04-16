import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserResponseJWTDto } from '../../../../common/dtos/user.dto';
import { DepartmentRlEnt } from '../../../department-rl/modules/entities/department-rl.entity';
import { DepartmentEnt } from '../../../department/modules/entities/department.entity';
import { ProjectEnt } from '../../../project/modules/entities/project.entity';
import { ReqEnt } from '../../../req/modules/entities/req.entity';
import { UserEnt } from '../../../user/modules/entities/user.entity';
import { StatusTaskEnum } from '../enums/status-task.enum';
import { TypeTaskEnum } from '../enums/type-task.enum';


export class CreateTaskDto {

  @ApiHideProperty()
  id_department_rl: string;

  @ApiHideProperty()
  departmentRl: DepartmentRlEnt;

  @IsOptional()
  @Allow()
  @ApiProperty()
  priority: string;

  @Allow()
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  title: string;

  @Allow()
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  duration: number;

  @IsOptional()
  @Allow()
  @ApiProperty()
  head_id: string;

  @Allow()
  @ApiProperty()
  id_project?: string;

  @Allow()
  @ApiProperty()
  id_req?: string;

  @Allow()
  @ApiProperty()
  id_department?: string;

  @ApiHideProperty()
  departmentEnt: DepartmentEnt;

  @ApiHideProperty()
  departmentRlEnt: DepartmentRlEnt;

  @Allow()
  @ApiProperty()
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
  @IsDate({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_DATE') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  do_date: Date

  @Allow()
  @ApiProperty()
  remain_date: Date

  @ApiProperty({ default: StatusTaskEnum.DOING })
  status: StatusTaskEnum;
}
