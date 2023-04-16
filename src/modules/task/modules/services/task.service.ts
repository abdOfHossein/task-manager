import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { UserResponseJWTDto } from 'src/common/dtos/user.dto';
import { SuccessDto } from 'src/common/result/success.dto';
import { TaskEnum } from 'src/common/translate/enums/task.enum';
import { CreateRelTaskDto } from 'src/modules/rel-task/modules/dtos/create.rel-task.dto';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateTaskDto } from '../dtos/create.task.dto';
import { CreateTaskSomeUserDto } from '../dtos/create.task.some-user.dto';
import { CreateTaskWithIdUserIdReqDto } from '../dtos/create.task.withIdUserIdReq.dto';
import { UpdateStatusCheckStatusTaskDto } from '../dtos/update.check-status.task.dto';
import { UpdateStatusTaskDto } from '../dtos/update.status.task.dto';
import { UpdateTaskDto } from '../dtos/update.task.dto';
import { TaskEnt } from '../entities/task.entity';
import { StatusTaskEnum } from '../enums/status-task.enum';
import { TypeTaskEnum } from '../enums/type-task.enum';
import { ReportTaskPageDto } from '../paginations/report.page.dto';
import { TaskPageDto } from '../paginations/task.page.dto';
import { TaskTypeStatusPageDto } from '../paginations/task.status-type.page.dto';
import { TaskTypePageDto } from '../paginations/task.type.page.dto';
import { TaskRepo } from '../repositories/task.repository';
import { TaskCUDto } from '../result/task.c.u.dto';
import { TaskGDto } from '../result/task.g.dto';

@Injectable()
export class TaskService extends AbstractServiceClass<
  TaskEnt,
  CreateTaskDto,
  UpdateTaskDto,
  TaskPageDto
> {
  public constructor(
    private taskRepo: TaskRepo,
    @InjectRepository(TaskEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }


  async taskTypePagination(
    id_user: string,
    reportPage: TaskTypePageDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.taskTypePagination(id_user, reportPage, query);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  // createEntity findOneEntity updateEntity paginationEntity deleteEntity

  async getReportTask(
    id_user: string,
    reportPage: ReportTaskPageDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.getReportTask(id_user, reportPage, query);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async _create(createDt: CreateTaskDto, query?: QueryRunner) {
    const queryRunner = this.dataSource.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.connect();
      return await this.taskRepo.createEntity(createDt, queryRunner);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    } finally {
      await queryRunner.release();
    }
  }
  _resultCreateDto(ent: TaskEnt) {
    return new TaskCUDto(ent)
  }

  async createTaskByProject(createDt: CreateTaskDto, query?: QueryRunner) {
    const queryRunner = this.dataSource.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.connect();
      return await this.taskRepo.createTaskByProject(createDt, queryRunner);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    } finally {
      await queryRunner.release();
    }
  }
  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.taskRepo.findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: TaskEnt) {
    return new TaskGDto(ent)
  }

  async _update(
    Task_Id: string,
    updateDt: UpdateTaskDto,
    query?: QueryRunner,
  ) {
    const taskEnt = await this.dataSource.manager.findOne(TaskEnt, { where: { id: Task_Id } })
    if (!taskEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'task',
          value: TaskEnum.TASK_NOT_EXISTS,
        })}`,
      );
    return await this.taskRepo.updateEntity(taskEnt, updateDt, query);
  }

  _resultUpdateDto(ent: TaskEnt) {
    return new TaskCUDto(ent)
  }

  async _delete(id_task: string) {
    const task = await this.dataSource.manager.findOne(TaskEnt, {
      where: { id: id_task },
    });
    if (!task)
      throw new Error(
        `${JSON.stringify({
          section: 'task',
          value: TaskEnum.TASK_NOT_EXISTS,
        })}`,
      );
      task.title = 'deleted' + '_' + task.title + '_' + task.id;
      await this.dataSource.manager.save(task)
    return await this.taskRepo.deleteEntity(task);
  }
  _resultDeleteDto(ent: TaskEnt) {
    return new SuccessDto(true)
  }

  async _pagination(pageDto: TaskPageDto) {
    return await this.taskRepo.paginationEntity(pageDto);
  }

  async getAllOfUser(id_user: string) {
    try {
      return await this.taskRepo.getAllOfUser(id_user);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async getAllForAdmin() {
    try {
      return await this.taskRepo.getAllForAdmin();
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async paginationAdmin(id_user: string, pageDto: TaskPageDto) {
    try {
      return await this.taskRepo.paginationAdmin(id_user, pageDto);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }



  async createTaskWithIdDepartment(
    id_department: string,
    createDto: CreateTaskDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.createTaskWithIdDepartment(
        id_department,
        createDto,
        query,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async dailyTask(): Promise<TaskEnt[]> {
    try {
      return await this.taskRepo.dailyTask();
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async createTaskWithIdDepartmentAndIdReq(
    id_user: string,
    id_req: string,
    id_department: string,
    createDto: CreateTaskDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.createTaskWithIdDepartmentAndIdReq(
        id_user,
        id_req,
        id_department,
        createDto,
        query,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async forwardTask(
    id_prevoise_task: string,
    createDto: CreateRelTaskDto,
    query?: QueryRunner,
  ) {
    const queryRunner = this.dataSource.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.connect();
      if (createDto.type !== TypeTaskEnum.FORWARD) {
        throw new BadRequestException({ message: 'type must be FORWARD' });
      }
      return await this.taskRepo.forwardTask(
        id_prevoise_task,
        createDto,
        queryRunner,
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    } finally {
      await queryRunner.release();
    }
  }

  async createTaskWithIdReqAnddUser(
    id_user: string,
    id_req: string,
    createDto: CreateTaskDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.createTaskWithIdReqAnddUser(
        id_user,
        id_req,
        createDto,
        query,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async findAllPendingTask() {
    try {
      return await this.taskRepo.findAllPendingTask();
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async updateStatusTask(
    id_task: string,
    status: StatusTaskEnum,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.updateStatusTask(id_task, status, query);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async paginationStatusTypeTask(
    id_user: string,
    pageDto: TaskTypeStatusPageDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.paginationStatusTypeTask(
        id_user,
        pageDto,
        query,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async changeStatusToPending(
    id_user: string,
    id_task: string,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.changeStatusToPending(id_user, id_task, query);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }
  async changeStatusToSuccess(
    id_user: string,
    id_task: string,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.changeStatusToSuccess(id_user, id_task, query);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async allExpirationTask(pageDto: TaskPageDto, query?: QueryRunner) {
    try {
      return await this.taskRepo.allExpirationTask(pageDto, query);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async oneExpirationTask(
    id_user: string,
    pageDto: TaskPageDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.oneExpirationTask(id_user, pageDto, query);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async changeStatusToCheck(
    id_task: string,
    id_user: string,
    updateStatusTaskDto: UpdateStatusTaskDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.changeStatusToCheck(
        id_task,
        id_user,
        updateStatusTaskDto,
        query,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async changeStatusToCheckAdmin(
    id_task: string,
    updateDto: UpdateStatusCheckStatusTaskDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.changeStatusToCheckAdmin(
        id_task,
        updateDto,
        query,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async ceateTaskWithIdUserIdReqDto(
    id_req: string,
    id_user: string,
    id_head: string,
    ceateTaskWithIdUserIdReqDto: CreateTaskWithIdUserIdReqDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.ceateTaskWithIdUserIdReqDto(
        id_req,
        id_user,
        id_head,
        ceateTaskWithIdUserIdReqDto,
        query,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async paginationTaskWithCheckStatus(
    id_user: string,
    pageDto: TaskTypeStatusPageDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.taskRepo.paginationTaskWithCheckStatus(
        id_user,
        pageDto,
        query,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async createTaskSomeUser(createTaskSomeUserDto: CreateTaskSomeUserDto) {
    const queryRunner = this.dataSource.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.connect();
      return await this.taskRepo.createTaskSomeUser(
        createTaskSomeUserDto,
        queryRunner,
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    } finally {
      await queryRunner.release();
    }
  }

  async headDepartmentTask(user: UserResponseJWTDto, pageDto: TaskTypeStatusPageDto) {
    return await this.taskRepo.headDepartmentTask(user.uid, pageDto);
  }
}
