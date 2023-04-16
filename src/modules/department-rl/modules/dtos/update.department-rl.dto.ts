import { ApiHideProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { ReqEnt } from 'src/modules/req/modules/entities/req.entity';

export class UpdateDepartmentRlDto {
  @ApiHideProperty()
  reqEnt: ReqEnt;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiHideProperty()
  req_id: string;

  @ApiHideProperty()
  departmentEnt: DepartmentEnt;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @ApiHideProperty()
  department_id: string;
}
