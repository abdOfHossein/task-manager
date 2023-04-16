import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TaskEnt } from 'src/modules/task/modules/entities/task.entity';
import { StatusTaskEnum } from 'src/modules/task/modules/enums/status-task.enum';
import { TypeTaskEnum } from 'src/modules/task/modules/enums/type-task.enum';

export class UpdateRelTaskDto {
  @IsOptional()
  @ApiProperty()
  @Allow()
  priority: string;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @ApiProperty()
  @Allow()
  title: string;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @ApiProperty()
  @Allow()
  duration: number;

  @IsOptional()
  @ApiProperty()
  @Allow()
  head_id: string;

  @ApiProperty({ default: TypeTaskEnum.FORWARD })
  @Allow()
  type: TypeTaskEnum;

  @ApiProperty({ default: StatusTaskEnum.REL })
  @Allow()
  status: StatusTaskEnum;

  @ApiHideProperty()
  id_src: string;

  @ApiHideProperty()
  id_ref: string;

  @ApiHideProperty()
  refEnt: TaskEnt;

  @ApiHideProperty()
  srcEnt: TaskEnt;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  @ApiProperty()
  @Allow()
  comment: string;
}
