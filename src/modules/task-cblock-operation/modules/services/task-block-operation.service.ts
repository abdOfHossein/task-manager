import { Injectable } from '@nestjs/common';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { TaskBlockOperationEnum } from 'src/common/translate/enums/task-block-operation.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateTaskBlockOperationDto } from '../dtos/create.task-block-operation.dto';
import { UpdateTaskBlockOperationDto } from '../dtos/update.task-block-operation.dto';
import { TaskBlockOperationEnt } from '../entities/task-block-operation.entity';
import { TaskBlockOperationPageDto } from '../paginations/task-block-operation.page.dto';
import { TaskBlockOperationRepo } from '../repositories/task-block-operation.repository';
import { TaskBlockOperationCUDto } from '../result/task-block-operation.c.u.dto';
import { TaskBlockOperationGDto } from '../result/task-block-operation.g.dto';

@Injectable()
export class TaskBlockOperationService extends AbstractServiceClass<
  TaskBlockOperationEnt,
  CreateTaskBlockOperationDto,
  UpdateTaskBlockOperationDto,
  TaskBlockOperationPageDto
> {
  public constructor(
    private taskBlockOperationRepo: TaskBlockOperationRepo,
    handlerService: HandlerService,
    public dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }



  protected _delete(searchDto: string, query?: QueryRunner) {
    throw new Error('Method not implemented.');
  }
  _resultDeleteDto(ent: TaskBlockOperationEnt) {
    throw new Error('Method not implemented.');
  }

  // createEntity findOneEntity updateEntity paginationEntity deleteEntity

  async _create(
    createDt: CreateTaskBlockOperationDto,
    query?: QueryRunner,
  ) {
    return await this.taskBlockOperationRepo.createEntity(
      createDt,
      query,
    );
  }
  _resultCreateDto(ent: TaskBlockOperationEnt) {
    return new TaskBlockOperationCUDto(ent)
  }

  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.taskBlockOperationRepo.findOneEntity(
      searchDto,
      options,
    );
  }
  _resultGetOneDto(ent: TaskBlockOperationEnt) {
    return new TaskBlockOperationGDto(ent)
  }

  async _update(
    taskBlockOperation_id: string,
    updateDt: UpdateTaskBlockOperationDto,
    query?: QueryRunner,
  ) {
    const taskBlockeEnt = await this.dataSource.manager.findOne(
      TaskBlockOperationEnt,
      { where: { id: taskBlockOperation_id } },
    );
    if (!taskBlockeEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'task_block_operation',
          value: TaskBlockOperationEnum.TASK_BLOCK_OPERATION_NOT_EXISTS,
        })}`,
      );
    return await this.taskBlockOperationRepo.updateEntity(
      taskBlockeEnt,
      updateDt,
      query,
    );
  }
  _resultUpdateDto(ent: TaskBlockOperationEnt) {
    return new TaskBlockOperationCUDto(ent)
  }

  async _pagination(pageDto: TaskBlockOperationPageDto) {
    return await this.taskBlockOperationRepo.paginationEntity(
      pageDto,
    )
  }
}
