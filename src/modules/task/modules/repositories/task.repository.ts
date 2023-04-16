import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DepartmentRlEnum } from 'src/common/translate/enums/department-rl.enum';
import { DepartmentEnum } from 'src/common/translate/enums/department.enum';
import { ProjectEnum } from 'src/common/translate/enums/project.enum';
import { PublicEnum } from 'src/common/translate/enums/public.enum';
import { ReqEnum } from 'src/common/translate/enums/req.enum';
import { TaskEnum } from 'src/common/translate/enums/task.enum';
import { UserEnum } from 'src/common/translate/enums/user.enum';
import { DepartmentRlEnt } from 'src/modules/department-rl/modules/entities/department-rl.entity';
import { DepartmentRlService } from 'src/modules/department-rl/modules/services/department-rl.service';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { ProjectEnt } from 'src/modules/project/modules/entities/project.entity';
import { ProjectService } from 'src/modules/project/modules/services/project.service';
import { CreateRelTaskDto } from 'src/modules/rel-task/modules/dtos/create.rel-task.dto';
import { RelTaskEnt } from 'src/modules/rel-task/modules/entities/rel-task.entity';
import { ReqEnt } from 'src/modules/req/modules/entities/req.entity';
import { StatusReqEnum } from 'src/modules/req/modules/enums/req.enum';
import { ReqService } from 'src/modules/req/modules/services/req.service';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateTaskDto } from '../dtos/create.task.dto';
import { CreateTaskSomeUserDto } from '../dtos/create.task.some-user.dto';
import { CreateTaskWithIdUserIdReqDto } from '../dtos/create.task.withIdUserIdReq.dto';
import { UpdateStatusCheckStatusTaskDto } from '../dtos/update.check-status.task.dto';
import { UpdateStatusTaskDto } from '../dtos/update.status.task.dto';
import { UpdateTaskDto } from '../dtos/update.task.dto';
import { TaskEnt } from '../entities/task.entity';
import { CheckStatusTaskEnum } from '../enums/check-status.enum';
import { StatusTaskEnum } from '../enums/status-task.enum';
import { TypeTaskEnum } from '../enums/type-task.enum';
import { TaskMapperPagination } from '../mapper/task.mapper.pagination';
import { ReportTaskPageDto } from '../paginations/report.page.dto';
import { TaskPageDto } from '../paginations/task.page.dto';
import { TaskTypeStatusPageDto } from '../paginations/task.status-type.page.dto';
import { TaskTypePageDto } from '../paginations/task.type.page.dto';

export class TaskRepo extends AbstractRepositoryClass<
  TaskEnt,
  CreateTaskDto,
  UpdateTaskDto,
  TaskPageDto
> {
  constructor(
    @InjectRepository(TaskEnt)
    @InjectRepository(ProjectEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
    private departmentRlService: DepartmentRlService,
    private projectService: ProjectService,
    private reqService: ReqService,
  ) {
    super(dataSource, handlerService);
  }

  async taskTypePagination(
    id_user: string,
    reportPage: TaskTypePageDto,
    query: QueryRunner | undefined,
  ): Promise<PageDto<TaskEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .where('task.head_id = :head_id', { head_id: id_user })
      .leftJoinAndSelect('task.department_rl', 'department_rl')
      .leftJoinAndSelect('department_rl.req', 'req')
      .leftJoinAndSelect('department_rl.department', 'department')
      .leftJoinAndSelect('req.project', 'project')
      .select([
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.type',
        'task.duration',
        'task.status',
        'task.do_date',
        'department_rl.id', 'req.id', 'req.name', 'department.id', 'department.name_department', 'project.id', 'project.project_name'
      ])

    if (reportPage.base) {
      const row = reportPage.base.row;
      const skip = PublicFunc.skipRow(
        reportPage.base.page,
        reportPage.base.row,
      );
      queryBuilder.skip(skip).take(row);
    }
    if (reportPage.filter) {
      if (reportPage.filter.type)
        queryBuilder.andWhere('Task.type = :type', {
          type: reportPage.filter.type,
        });
    }
    if (reportPage.field) {
      const mapper = TaskMapperPagination[reportPage.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[reportPage.field]}`,
        reportPage.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: reportPage.base,
      itemCount: result[1],
    });

    return new PageDto(result[0], pageMetaDto);
  }

  async getReportTask(
    id_user: string,
    reportPage: ReportTaskPageDto,
    query: QueryRunner | undefined,
  ): Promise<PageDto<TaskEnt>> {

    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.department_rl', 'department_rl')
      .leftJoinAndSelect('department_rl.req', 'req')
      .leftJoinAndSelect('department_rl.department', 'department')
      .leftJoinAndSelect('req.project', 'project')
      .where('(user.id = :id_user)', {
        id_user,
      })
      .select([
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.type',
        'task.duration',
        'task.status',
        'task.do_date',
        'department_rl.id', 'req.id', 'req.name', 'department.id', 'department.name_department', 'project.id', 'project.project_name'
      ]);


    if (reportPage.base) {
      const row = reportPage.base.row;
      const skip = PublicFunc.skipRow(
        reportPage.base.page,
        reportPage.base.row,
      );
      queryBuilder.skip(skip).take(row);
    }
    if (reportPage.filter) {
      if (reportPage.filter.status)
        queryBuilder.andWhere('task.status = :status', {
          status: reportPage.filter.status,
        });
    }
    if (reportPage.field) {
      const mapper = TaskMapperPagination[reportPage.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[reportPage.field]}`,
        reportPage.base.order,
      );
    }

    const result = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: reportPage.base,
      itemCount: result[1],
    });
    return new PageDto(result[0], pageMetaDto);
  }

  async createTaskByProject(
    createDto: CreateTaskDto,
    query: QueryRunner | undefined,
  ) {
    if (!createDto.priority) {
      const result = await this.dataSource.manager.createQueryBuilder(TaskEnt, 'task')
        .select("MAX(task.priority)", 'priority')
        .getRawOne();
      createDto.priority = result.priority
    }
    const projectEnt = await this.dataSource.manager.findOne(ProjectEnt, {
      where: { id: createDto.id_project },
    });
    if (!projectEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'project',
          value: ProjectEnum.PROJECT_NOT_EXISTS,
        })}`,
      );
    createDto.projectEnt = projectEnt;
    let reqEnt: ReqEnt;
    if (!createDto.id_req) reqEnt = await this.reqService.findDefaultReq();
    else reqEnt = await this.dataSource.manager.findOne(ReqEnt, { where: { id: createDto.id_req } })

    if (!reqEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'req',
          value: ReqEnum.REQ_NOT_EXISTS,
        })}`,
      );
    createDto.reqEnt = reqEnt;
    const departmentRlEnt = await this.dataSource.manager
      .createQueryBuilder(DepartmentRlEnt, 'departmentRl')
      .innerJoinAndSelect('departmentRl.req', 'req')
      .innerJoinAndSelect('departmentRl.department', 'department')
      .innerJoinAndSelect('department.users', 'users')
      .where('users.id = :id_user AND (req.id = :id_req)', {
        id_req: createDto.reqEnt.id,
        id_user: createDto.id_user,
      })
      .getOne();

    if (!departmentRlEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'department_rl',
          value: DepartmentRlEnum.DEPARTMENT_RL_NOT_EXISTS,
        })}`,
      );
    createDto.departmentRlEnt = departmentRlEnt;
    const queryBuilder = await this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .innerJoinAndSelect('task.department_rl', 'department_rl')
      .innerJoinAndSelect('department_rl.req', 'req')
      .where('department_rl.id = :id_department', {
        id_department: createDto.id_department_rl,
      })
      .getOne();

    if (
      queryBuilder &&
      queryBuilder.department_rl.req.status !== StatusReqEnum.OPEN
    ) {
      queryBuilder.department_rl.req.status = StatusReqEnum.OPEN;
      await this.dataSource.manager.save(queryBuilder.department_rl.req);
    }

    const taskEnt = new TaskEnt();
    taskEnt.head_id = createDto.head_id;
    taskEnt.user = createDto.userEnt;
    taskEnt.department_rl = createDto.departmentRlEnt;
    taskEnt.priority = createDto.priority;
    taskEnt.title = createDto.title;
    taskEnt.duration = createDto.duration;
    taskEnt.status = createDto.status;
    taskEnt.type = createDto.type;
    let result: TaskEnt;
    if (query) {
      result = await query.manager.save(taskEnt);
    } else {
      result = await this.dataSource.manager.save(taskEnt);
    }
    await query.commitTransaction();
    return result;
  }

  async _createEntity(
    createDto: CreateTaskDto,
    query: QueryRunner | undefined,
  ): Promise<TaskEnt> {

    const queryBuilder = await this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .innerJoinAndSelect('task.department_rl', 'department_rl')
      .innerJoinAndSelect('department_rl.req', 'req')
      .where('department_rl.id = :id_department_rl', {
        id_department_rl: createDto.id_department_rl,
      })
      .getOne();

    if (
      queryBuilder &&
      queryBuilder.department_rl.req.status !== StatusReqEnum.OPEN
    ) {
      queryBuilder.department_rl.req.status = StatusReqEnum.OPEN;
      await this.dataSource.manager.save(queryBuilder.department_rl.req);
    }

    const department_rl = await this.dataSource.manager.findOne(
      DepartmentRlEnt,
      { where: { id: createDto.id_department_rl } },
    );

    const user = await this.dataSource.manager.findOne(UserEnt, {
      where: { id: createDto.id_user },
    });
    const taskEnt = new TaskEnt();
    taskEnt.head_id = createDto.head_id;
    taskEnt.priority = createDto.priority;
    taskEnt.title = createDto.title;
    taskEnt.duration = createDto.duration;
    taskEnt.status = createDto.status;
    taskEnt.type = createDto.type;
    taskEnt.department_rl = department_rl;
    taskEnt.user = user;
    let result: TaskEnt;
    if (query) {
      result = await query.manager.save(taskEnt);
    } else {
      result = await this.dataSource.manager.save(taskEnt);
    }
    await query.commitTransaction();
    return result;
  }
  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<TaskEnt> {
    const task = await this.dataSource.manager.findOne(TaskEnt, {
      where: { id: searchDto },
    });
    if (!task)
      throw new Error(
        `${JSON.stringify({
          section: 'task',
          value: TaskEnum.TASK_NOT_EXISTS,
        })}`,
      );
    return task;
  }

  async _updateEntity(
    entity: TaskEnt,
    updateDto: UpdateTaskDto,
    query?: QueryRunner,
  ): Promise<TaskEnt> {
    entity.head_id = updateDto.head_id;
    entity.priority = updateDto.priority;
    entity.title = updateDto.title;
    entity.duration = updateDto.duration;
    entity.status = updateDto.status;
    entity.type = updateDto.type;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async _deleteEntity(entity: TaskEnt, query?: QueryRunner) {
    if (query) return await query.manager.softRemove(entity);
    return await this.dataSource.manager.softRemove(entity);
  }

  async _paginationEntity(pageDto: TaskPageDto): Promise<PageDto<TaskEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .select([
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.type',
        'task.duration',
        'task.status',
      ]);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.priority) {
        queryBuilder.andWhere('task.priority = :priority', {
          priority: `%${pageDto.filter.priority}%`,
        });
      }
      if (pageDto.filter.title) {
        queryBuilder.andWhere('task.title LIKE :title', {
          title: `%${pageDto.filter.title}%`,
        });
      }
      if (pageDto.filter.type) {
        queryBuilder.andWhere('task.type = :type', {
          type: pageDto.filter.type,
        });
      }
      if (pageDto.filter.status) {
        queryBuilder.andWhere('task.status = :status', {
          status: pageDto.filter.status,
        });
      }
    }
    if (pageDto.field) {
      const mapper = TaskMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });
    return new PageDto(result[0], pageMetaDto);
  }

  async getAllForAdmin(): Promise<TaskEnt[]> {
    const x = await this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('task.department_rl', 'department_rl')
      .leftJoinAndSelect('department_rl.req', 'req')
      .leftJoinAndSelect('req.project', 'project')
      // .select([
      //   'task.id', 'task.priority', 'task.title', 'task.head_id', 'task.do_date', 'task.remain_date', 'task.type', 'task.duration', 'task.status', 'task.check_status',
      //   'department_rl.id',
      //   'req.id', 'req.status', 'req.name', 'req.description', 'req.isDefault',
      //   'project.id', 'project.project_name', 'user.id', 'user.user_name'
      // ])
      .getMany();

    return x
  }

  async getAllOfUser(id_user: string): Promise<TaskEnt[] | any> {
    try {
      const result: any = await this.dataSource.manager
        .createQueryBuilder(TaskEnt, 'task')
        .innerJoinAndSelect('task.user', 'user')
        .where('user.id = :id_user', { id_user })
        .leftJoinAndSelect('task.department_rl', 'department_rl')
        .leftJoinAndSelect('department_rl.req', 'req')
        .leftJoinAndSelect('department_rl.department', 'department')
        .leftJoinAndSelect('req.project', 'project')
        .select([
          'task.id',
          'task.priority',
          'task.title',
          'task.head_id',
          'task.type',
          'task.duration',
          'task.status',
          'task.do_date',
          'department_rl.id', 'req.id', 'req.name', 'department.id', 'department.name_department', 'project.id', 'project.project_name'
        ])
        .getMany();
      let do_date, duration;
      for (let i = 0; i < result.length; i++) {
        if (result[i].do_date && result[i].duration) {
          do_date = result[i].do_date;
          duration = result[i].duration;

          result[i].delivery_date = new Date(
            do_date.setDate(do_date.getDate() + duration),
          );
        }
      }

      return result;
    } catch (error) {

    }
  }

  async paginationAdmin(
    id_user: string,
    pageDto: TaskPageDto,
  ): Promise<PageDto<TaskEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .leftJoinAndSelect('task.department_rl', 'department_rl')
      .leftJoinAndSelect('department_rl.req', 'req')
      .leftJoinAndSelect('department_rl.department', 'department')
      .leftJoinAndSelect('req.project', 'project')
      .where('task.head_id = :head_id', { head_id: id_user })
      .select([
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.type',
        'task.duration',
        'task.status',
        'task.do_date',
        'department_rl.id', 'req.id', 'req.name', 'department.id', 'department.name_department', 'project.id', 'project.project_name'
      ]);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.priority) {
        queryBuilder.andWhere('task.priority = :priority', {
          priority: `%${pageDto.filter.priority}%`,
        });
      }
      if (pageDto.filter.title) {
        queryBuilder.andWhere('task.title LIKE :title', {
          title: `%${pageDto.filter.title}%`,
        });
      }
      if (pageDto.filter.type) {
        queryBuilder.andWhere('task.type = :type', {
          type: pageDto.filter.type,
        });
      }
      if (pageDto.filter.status) {
        queryBuilder.andWhere('task.status = :status', {
          status: pageDto.filter.status,
        });
      }
    }
    if (pageDto.field) {
      const mapper = TaskMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });
    return new PageDto(result[0], pageMetaDto);
  }

  async pagination(pageDto: TaskPageDto): Promise<PageDto<TaskEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .leftJoinAndSelect('task.department_rl', 'department_rl')
      .leftJoinAndSelect('department_rl.req', 'req')
      .leftJoinAndSelect('department_rl.department', 'department')
      .leftJoinAndSelect('req.project', 'project')
      .select([
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.type',
        'task.duration',
        'task.status',
        'task.do_date',
        'department_rl.id', 'req.id', 'req.name', 'department.id', 'department.name_department', 'project.id', 'project.project_name'
      ]);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.priority) {
        queryBuilder.andWhere('task.priority = :priority', {
          priority: `%${pageDto.filter.priority}%`,
        });
      }
      if (pageDto.filter.title) {
        queryBuilder.andWhere('task.title LIKE :title', {
          title: `%${pageDto.filter.title}%`,
        });
      }
      if (pageDto.filter.type) {
        queryBuilder.andWhere('task.type = :type', {
          type: pageDto.filter.type,
        });
      }
      if (pageDto.filter.status) {
        queryBuilder.andWhere('task.status = :status', {
          status: pageDto.filter.status,
        });
      }
    }
    if (pageDto.field) {
      const mapper = TaskMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });
    return new PageDto(result[0], pageMetaDto);
  }


  async createTaskWithIdDepartment(
    id_department: string,
    createDto: CreateTaskDto,
    query: QueryRunner | undefined,
  ): Promise<TaskEnt> {
    if (!createDto.priority) {
      const result = await this.dataSource.manager.createQueryBuilder(TaskEnt, 'task')
        .select("MAX(task.priority)", 'priority')
        .getRawOne();
      createDto.priority = result.priority
    }
    const queryBuilder = await this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .innerJoinAndSelect('task.department_rl', 'department_rl')
      .innerJoinAndSelect('department_rl.req', 'req')
      .where('department_rl.id = :id_department', {
        id_department: createDto.id_department_rl,
      })
      .getOne();

    if (
      queryBuilder &&
      queryBuilder.department_rl.req.status !== StatusReqEnum.OPEN
    ) {
      queryBuilder.department_rl.req.status = StatusReqEnum.OPEN;
      await this.dataSource.manager.save(queryBuilder.department_rl.req);
    }
    const req = await this.dataSource.manager.findOne(ReqEnt, {
      where: { isDefault: true },
    });

    const department = await this.dataSource.manager.findOne(DepartmentEnt, {
      where: { id: id_department },
    });
    if (!department)
      throw new Error(
        `${JSON.stringify({
          section: 'department',
          value: DepartmentEnum.DEPARTMENT_NOT_EXISTS,
        })}`,
      );

    const department_rl = await this.dataSource.manager
      .createQueryBuilder(DepartmentRlEnt, 'department_rl_ent')
      .where(
        'department_rl_ent.department = :department AND department_rl_ent.req = :req',
        { department: department.id, req: req.id },
      )
      .getOne();


    const taskEnt = new TaskEnt();
    taskEnt.head_id = createDto.head_id;
    taskEnt.priority = createDto.priority;
    taskEnt.title = createDto.title;
    taskEnt.duration = createDto.duration;
    taskEnt.status = createDto.status;
    taskEnt.type = createDto.type;
    if (query) return await query.manager.save(taskEnt);
    return await this.dataSource.manager.save(taskEnt);
  }

  async createTaskWithIdDepartmentAndIdReq(
    id_user: string,
    id_req: string,
    id_department: string,
    createDto: CreateTaskDto,
    query: QueryRunner | undefined,
  ): Promise<TaskEnt> {
    if (!createDto.priority) {
      const result = await this.dataSource.manager.createQueryBuilder(TaskEnt, 'task')
        .select("MAX(task.priority)", 'priority')
        .getRawOne();
      createDto.priority = result.priority
    }
    const queryBuilder = await this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .innerJoinAndSelect('task.department_rl', 'department_rl')
      .innerJoinAndSelect('department_rl.req', 'req')
      .where('department_rl.id = :id_department', {
        id_department: createDto.id_department_rl,
      })
      .getOne();

    if (
      queryBuilder &&
      queryBuilder.department_rl.req.status !== StatusReqEnum.OPEN
    ) {
      queryBuilder.department_rl.req.status = StatusReqEnum.OPEN;
      await this.dataSource.manager.save(queryBuilder.department_rl.req);
    }

    let req: ReqEnt;
    if (!id_req) {
      req = await this.dataSource.manager.findOne(ReqEnt, {
        where: { isDefault: true },
      });
    } else {
      req = await this.dataSource.manager.findOne(ReqEnt, {
        where: { id: id_req },
      });
    }
    if (!req)
      throw new Error(
        `${JSON.stringify({
          section: 'req',
          value: ReqEnum.REQ_NOT_EXISTS,
        })}`,
      );
    const department = await this.dataSource.manager.findOne(DepartmentEnt, {
      where: { id: id_department },
    });
    if (!department)
      throw new Error(
        `${JSON.stringify({
          section: 'department',
          value: DepartmentEnum.DEPARTMENT_NOT_EXISTS,
        })}`,
      );
    const department_rl = await this.dataSource.manager
      .createQueryBuilder(DepartmentRlEnt, 'department_rl_ent')
      .where(
        'department_rl_ent.department = :department AND department_rl_ent.req = :req',
        { department: department.id, req: req.id },
      )
      .getOne();

    const user = await this.dataSource.manager.findOne(UserEnt, {
      where: {
        id: id_user,
      },
    });
    if (!user)
      throw new Error(
        `${JSON.stringify({
          section: 'user',
          value: UserEnum.USER_NOT_EXISTS,
        })}`,
      );
    const taskEnt = new TaskEnt();
    taskEnt.head_id = createDto.head_id;
    taskEnt.priority = createDto.priority;
    taskEnt.title = createDto.title;
    taskEnt.duration = createDto.duration;
    taskEnt.status = createDto.status;
    taskEnt.type = createDto.type;
    taskEnt.user = user;
    if (query) return await query.manager.save(taskEnt);
    return await this.dataSource.manager.save(taskEnt);
  }

  async forwardTask(
    id_prevoise_task: string,
    createDto: CreateRelTaskDto,
    query: QueryRunner | undefined,
  ) {
    await this.dataSource.manager.update(
      TaskEnt,
      { id: id_prevoise_task },
      { type: TypeTaskEnum.FORWARD },
    );

    const srcTask = await this.dataSource.manager.findOne(TaskEnt, {
      where: { id: id_prevoise_task },
    });

    const refTask = new TaskEnt();
    refTask.head_id = createDto.head_id;
    refTask.priority = createDto.priority;
    refTask.title = createDto.title;
    refTask.duration = createDto.duration;
    refTask.status = createDto.status;
    refTask.type = createDto.type;
    if (query) {
      await query.manager.save(refTask);
    } else {
      await this.dataSource.manager.save(refTask);
    }

    const taskRlEnt = new RelTaskEnt();
    taskRlEnt.src = srcTask;
    taskRlEnt.ref = refTask;
    taskRlEnt.comment = createDto.comment;
    let result: RelTaskEnt;
    if (query) {
      let result = await query.manager.save(taskRlEnt);
    } else {
      let result = await this.dataSource.manager.save(taskRlEnt);
    }
    await query.commitTransaction();
    return result;
  }

  async dailyTask(): Promise<TaskEnt[]> {
    return await this.dataSource.manager.query(
      `select id,priority,title,head_id,type,duration,status,(select u.username  from auth."user" u  where u.id = t."userId") from task.task as t where DATE(t.do_date) >= CURRENT_DATE AND DATE(t.do_date) < CURRENT_DATE + INTERVAL '1 DAY' `,
    );
  }

  async createTaskWithIdReqAnddUser(
    id_user: string,
    id_req: string,
    createDto: CreateTaskDto,
    query: QueryRunner | undefined,
  ): Promise<TaskEnt> {
    if (!createDto.priority) {
      const result = await this.dataSource.manager.createQueryBuilder(TaskEnt, 'task')
        .select("MAX(task.priority)", 'priority')
        .getRawOne();
      createDto.priority = result.priority
    }
    const queryBuilder = await this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .innerJoinAndSelect('task.department_rl', 'department_rl')
      .innerJoinAndSelect('department_rl.req', 'req')
      .where('department_rl.id = :id_department', {
        id_department: createDto.id_department_rl,
      })
      .getOne();

    if (
      queryBuilder &&
      queryBuilder.department_rl.req.status !== StatusReqEnum.OPEN
    ) {
      queryBuilder.department_rl.req.status = StatusReqEnum.OPEN;
      await this.dataSource.manager.save(queryBuilder.department_rl.req);
    }

    const user = await this.dataSource.manager.findOne(UserEnt, {
      where: { id: id_user },
    });

    const userWithDepartment = await this.dataSource.manager
      .createQueryBuilder(UserEnt, 'user')
      .where('user.id = :id', { id: id_user })
      .leftJoinAndSelect('user.department', 'department')
      .getOne();
    if (!userWithDepartment)
      throw new Error(
        `${JSON.stringify({
          section: 'user',
          value: UserEnum.USER_NOT_EXISTS,
        })}`,
      );
    const department_rl = await this.dataSource.manager
      .createQueryBuilder(DepartmentRlEnt, 'department_rl')
      .where(
        'department_rl.req = :id_req AND department_rl.department = :department',
        { id_req, department: userWithDepartment.department.id },
      )
      .getOne();

    if (!department_rl)
      throw new Error(
        `${JSON.stringify({
          section: 'department_rl',
          value: DepartmentRlEnum.DEPARTMENT_RL_NOT_EXISTS,
        })}`,
      );
    const taskEnt = new TaskEnt();
    taskEnt.head_id = createDto.head_id;
    taskEnt.priority = createDto.priority;
    taskEnt.title = createDto.title;
    taskEnt.duration = createDto.duration;
    taskEnt.status = createDto.status;
    taskEnt.type = createDto.type;
    taskEnt.user = user;
    taskEnt.department_rl = department_rl;
    if (query) return await query.manager.save(taskEnt);
    return await this.dataSource.manager.save(taskEnt);
  }

  async findAllPendingTask(): Promise<TaskEnt[]> {
    return await this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .where('task.status = :status', { status: StatusTaskEnum.PENDING })
      .select([
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.type',
        'task.duration',
        'task.status',
      ]).getMany()
  }

  async updateStatusTask(
    id_task: string,
    status: StatusTaskEnum,
    query?: QueryRunner,
  ): Promise<TaskEnt> {
    if (status === StatusTaskEnum.CANCEL || status === StatusTaskEnum.DONE) {
      const req = await this.dataSource.manager
        .createQueryBuilder(ReqEnt, 'req')
        .leftJoinAndSelect('req.department_rls', 'department_rls')
        .leftJoinAndSelect('department_rls.tasks', 'tasks')
        .where(
          'tasks.id = :id_task AND (tasks.status != :statusCancel OR tasks.status != :statusDone)',
          {
            id_task,
            statusCancel: StatusTaskEnum.CANCEL,
            statusDone: StatusTaskEnum.DONE,
          },
        )
        .getMany();
      if (!req) {
        const result = await this.dataSource.manager
          .createQueryBuilder(ReqEnt, 'req')
          .leftJoinAndSelect('req.department_rls', 'department_rls')
          .leftJoinAndSelect('department_rls.tasks', 'tasks')
          .where(
            'tasks.id = :id_task AND (tasks.status != :statusCancel OR tasks.status != :statusDone)',
            {
              id_task,
              statusCancel: StatusTaskEnum.CANCEL,
              statusDone: StatusTaskEnum.DONE,
            },
          )
          .update(ReqEnt)
          .set({
            status: StatusReqEnum.DONE,
          })
          .execute();
      }
    }
    const entity = await this.dataSource.manager.findOne(TaskEnt, {
      where: { id: id_task },
    });
    entity.status = status;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async paginationStatusTypeTask(
    id_user: string,
    pageDto: TaskTypeStatusPageDto,
    query: QueryRunner | undefined,
  ): Promise<PageDto<TaskEnt>> {

    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .leftJoinAndSelect('task.user', 'user')
      .andWhere('user.id = :id_user', { id_user })
      .select([
        'task.id',
        'task.title',
        'task.priority',
        'task.head_id',
        'task.type',
        'task.status',
      ]);

    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.type) {
        queryBuilder.andWhere('task.type = :type', {
          type: pageDto.filter.type,
        });
      }
      if (pageDto.filter.type) {
        queryBuilder.andWhere('task.status = :status', {
          status: pageDto.filter.status,
        });
      }
    }
    if (pageDto.field) {
      const mapper = TaskMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });

    return new PageDto(result[0], pageMetaDto);
  }

  async changeStatusToSuccess(
    id_user: string,
    id_task: string,
    query?: QueryRunner,
  ): Promise<TaskEnt> {
    const req = await this.dataSource.manager
      .createQueryBuilder(ReqEnt, 'req')
      .leftJoinAndSelect('req.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.tasks', 'tasks')
      .where(
        'tasks.id = :id_task AND (tasks.status != :statusCancel OR tasks.status != :statusDone)',
        {
          id_task,
          statusCancel: StatusTaskEnum.CANCEL,
          statusDone: StatusTaskEnum.DONE,
        },
      )
      .getMany();
    if (!req) {
      const result = await this.dataSource.manager
        .createQueryBuilder(ReqEnt, 'req')
        .leftJoinAndSelect('req.department_rls', 'department_rls')
        .leftJoinAndSelect('department_rls.tasks', 'tasks')
        .where(
          'tasks.id = :id_task AND (tasks.status != :statusCancel OR tasks.status != :statusDone)',
          {
            id_task,
            statusCancel: StatusTaskEnum.CANCEL,
            statusDone: StatusTaskEnum.DONE,
          },
        )
        .update(ReqEnt)
        .set({
          status: StatusReqEnum.DONE,
        })
        .execute();
    }

    const checkTask = this.dataSource.manager
      .createQueryBuilder(UserEnt, 'user')
      .leftJoinAndSelect('user.task', 'task')
      .where('(task.id = :id_task) AND (user.id = :id_user)', {
        id_task,
        id_user,
      })
      .getOne();
    if (!checkTask)
      throw new Error(
        `${JSON.stringify({
          section: 'public',
          value: PublicEnum.ACCESS_IS_DENIDE,
        })}`,
      );
    const entity = await this.dataSource.manager.findOne(TaskEnt, {
      where: { id: id_task },
    });
    entity.status = StatusTaskEnum.DONE;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async changeStatusToPending(
    id_user: string,
    id_task: string,
    query?: QueryRunner,
  ): Promise<TaskEnt> {
    const checkTask = await this.dataSource.manager
      .createQueryBuilder(UserEnt, 'user')
      .leftJoinAndSelect('user.task', 'task')
      .where('task.id = :id_task AND user.id = :id_user', { id_task, id_user })
      .getOne();
    if (!checkTask)
      throw new Error(
        `${JSON.stringify({
          section: 'public',
          value: PublicEnum.ACCESS_IS_DENIDE,
        })}`,
      );
    const entity = await this.dataSource.manager.findOne(TaskEnt, {
      where: { id: id_task },
    });
    entity.status = StatusTaskEnum.PENDING;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async allExpirationTask(
    pageDto: TaskPageDto,
    query: QueryRunner | undefined,
  ): Promise<PageDto<TaskEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .where(`(NOW() - task.do_date) > (task.duration * '1 sec'::interval)`)
      .select([
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.type',
        'task.duration',
        'task.status',
      ]);

    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.type) {
        queryBuilder.andWhere('task.type = :type', {
          type: `%${pageDto.filter.type}%`,
        });
      }
      if (pageDto.filter.priority) {
        queryBuilder.andWhere('task.priority LIKE :priority', {
          priority: `%${pageDto.filter.priority}%`,
        });
      }
      if (pageDto.filter.title) {
        queryBuilder.andWhere('task.title LIKE :title', {
          title: `%${pageDto.filter.title}%`,
        });
      }
      if (pageDto.filter.type) {
        queryBuilder.andWhere('task.status = :status', {
          status: `%${pageDto.filter.status}%`,
        });
      }
    }
    if (pageDto.field) {
      const mapper = TaskMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });

    return new PageDto(result[0], pageMetaDto);
  }

  async oneExpirationTask(
    id_user: string,
    pageDto: TaskPageDto,
    query: QueryRunner | undefined,
  ): Promise<PageDto<TaskEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .leftJoinAndSelect('task.user', 'user')
      .andWhere('user.id = :id_user', { id_user })
      .select([
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.type',
        'task.duration',
        'task.status',
      ]);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.type) {
        queryBuilder.andWhere('task.type = :type', {
          type: pageDto.filter.type,
        });
      }
      if (pageDto.filter.status) {
        queryBuilder.andWhere('task.status = :status', {
          status: pageDto.filter.status,
        });
      }
    }
    if (pageDto.field) {
      const mapper = TaskMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });

    return new PageDto(result[0], pageMetaDto);
  }

  async changeStatusToCheck(
    id_task: string,
    id_user: string,
    updateStatusTaskDto: UpdateStatusTaskDto,
    query?: QueryRunner,
  ) {
    const entity = await this.dataSource.manager.findOne(TaskEnt, {
      where: { id: id_task },
    });
    if (!entity)
      throw new Error(
        `${JSON.stringify({
          section: 'task',
          value: TaskEnum.TASK_NOT_EXISTS,
        })}`,
      );
    entity.status = StatusTaskEnum.CHECK;
    entity.check_status = CheckStatusTaskEnum[`${updateStatusTaskDto.status}`];
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async changeStatusToCheckAdmin(
    id_task: string,
    updateDto: UpdateStatusCheckStatusTaskDto,
    query?: QueryRunner,
  ) {
    const entity = await this.dataSource.manager.findOne(TaskEnt, {
      where: { id: id_task },
    });
    if (!entity)
      throw new Error(
        `${JSON.stringify({
          section: 'task',
          value: TaskEnum.TASK_NOT_EXISTS,
        })}`,
      );
      if (updateDto.status == 'ACCEPT') {
        if (entity.check_status == CheckStatusTaskEnum.DONE) {
          entity.status = StatusTaskEnum.DONE;
        } else {
          entity.status = StatusTaskEnum.PENDING;
        }
      } else {
        entity.status = StatusTaskEnum.DOING;
      }
    if (query) return await query.manager.save(entity);

    return await this.dataSource.manager.save(entity);
  }

  async ceateTaskWithIdUserIdReqDto(
    id_req: string,
    id_user: string,
    id_head: string,
    createDto: CreateTaskWithIdUserIdReqDto,
    query?: QueryRunner,
  ): Promise<TaskEnt> {
    const user = await this.dataSource.manager.findOne(UserEnt, {
      where: { id: id_user },
    });
    if (!user)
      throw new Error(
        `${JSON.stringify({
          section: 'user',
          value: UserEnum.USER_NOT_EXISTS,
        })}`,
      );

    const department_rl = await this.dataSource.manager
      .createQueryBuilder(DepartmentRlEnt, 'department_rl')
      .leftJoinAndSelect('department_rl.req', 'req')
      .where('req.id = :id_req', { id_req })
      .getOne();

    if (!department_rl) {
      throw new Error(
        `${JSON.stringify({
          section: 'department_rl',
          value: DepartmentRlEnum.DEPARTMENT_RL_NOT_EXISTS,
        })}`,
      );
    }

    const taskEnt = new TaskEnt();
    taskEnt.head_id = createDto.head_id;
    if (!createDto.priority) taskEnt.priority = '10';
    taskEnt.title = createDto.title;
    taskEnt.head_id = id_head;
    taskEnt.duration = createDto.duration;
    taskEnt.status = StatusTaskEnum.WAITING;
    taskEnt.type = TypeTaskEnum.NEWTASK;
    taskEnt.user = user;
    taskEnt.department_rl = department_rl;

    if (query) return await query.manager.save(taskEnt);
    return await this.dataSource.manager.save(taskEnt);
  }

  async paginationTaskWithCheckStatus(
    id_user: string,
    pageDto: TaskTypeStatusPageDto,
    query: QueryRunner | undefined,
  ): Promise<PageDto<TaskEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .where('task.head_id = :id_user AND task.status = :checkstatus', {
        id_user,
        checkstatus: StatusTaskEnum.CHECK,
      })
      .select([
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.type',
        'task.duration',
        'task.status',
      ]);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.field) {
      const mapper = TaskMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });
    return new PageDto(result[0], pageMetaDto);
  }

  
  async createTaskSomeUser(
    createTaskSomeUserDto: CreateTaskSomeUserDto,
    query?: QueryRunner,
  ) {
    if (!createTaskSomeUserDto.priority) {
      const result = await this.dataSource.manager.createQueryBuilder(TaskEnt, 'task')
        .select("MAX(task.priority)", 'priority')
        .getRawOne();
      createTaskSomeUserDto.priority = result.priority
    }
    let tasks = [];
    for (const id_user of createTaskSomeUserDto.id_users) {
      console.log("id_department_rl-***********************857656147365765");
      console.log(createTaskSomeUserDto.id_department_rl);
      
      const department_rl = await this.dataSource.manager.findOne(
        DepartmentRlEnt,
        { where: { id: createTaskSomeUserDto.id_department_rl } },
      );
      console.log("department_rl-***********************");
      console.log(department_rl);
      
      const user = await this.dataSource.manager.findOne(UserEnt, {
        where: { id: id_user },
      });
      const taskEnt = new TaskEnt();
      taskEnt.head_id = user.id;
      taskEnt.do_date = createTaskSomeUserDto.do_date;
      taskEnt.priority = createTaskSomeUserDto.priority;
      taskEnt.title = createTaskSomeUserDto.title;
      taskEnt.duration = Number(createTaskSomeUserDto.duration);
      taskEnt.status = StatusTaskEnum.WAITING;
      taskEnt.type = TypeTaskEnum.NEWTASK;
      taskEnt.department_rl = department_rl;
      taskEnt.user = user;
      tasks.push(taskEnt);
    }
    if (query) {
      await query.manager.save(tasks);
    } else {
      await this.dataSource.manager.save(tasks);
    }
    await query.commitTransaction();
    return tasks;
  }

  async headDepartmentTask(
    id_user: string,
    pageDto: TaskTypeStatusPageDto,
    query?: QueryRunner | undefined,
  ): Promise<PageDto<TaskEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(TaskEnt, 'task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.department_rl', 'department_rl')
      .leftJoinAndSelect('department_rl.req', 'req')
      .leftJoinAndSelect('req.project', 'project')
      .leftJoinAndSelect('department_rl.department', 'department')
      .where('department.header_id = :id_user', {
        id_user,
      })
      // .select([
      //   'task.id',
      //   'task.priority',
      //   'task.title',
      //   'task.head_id',
      //   'task.type',
      //   'task.duration',
      //   'task.status',
      // ]);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.type) {
        queryBuilder.andWhere('task.type = :type', {
          type: pageDto.filter.type,
        });
      }
      if (pageDto.filter.status) {
        queryBuilder.andWhere('task.status = :status', {
          status: pageDto.filter.status,
        });
      }
    }
    if (pageDto.field) {
      const mapper = TaskMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${TaskMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });
    return new PageDto(result[0], pageMetaDto);
  }

}
