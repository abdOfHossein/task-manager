import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TaskEnt } from 'src/modules/task/modules/entities/task.entity';

export class UpdateTaskBlockOperationDto {
  @ApiHideProperty()
  id_task: string;

  @ApiHideProperty()
  taskEnt: TaskEnt;

  @Allow()
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
  name_task_block_operation: string;

  @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
  @Allow()
  @ApiProperty()
  desription_task_block_operation: string;
}
