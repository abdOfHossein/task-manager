import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { ProjectEnum } from 'src/common/translate/enums/project.enum';
import { ReqEnum } from 'src/common/translate/enums/req.enum';
import { DepartmentRlEnt } from 'src/modules/department-rl/modules/entities/department-rl.entity';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { ProjectEnt } from 'src/modules/project/modules/entities/project.entity';
import { ProjectMapperPagination } from 'src/modules/project/modules/mapper/project.mapper.pagination';
import { StatusTaskEnum } from 'src/modules/task/modules/enums/status-task.enum';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateReqDto } from '../dtos/create.req.dto';
import { DoneReqDto } from '../dtos/done.req.dto';
import { UpdateReqDto } from '../dtos/update.req.dto';
import { ReqEnt } from '../entities/req.entity';
import { StatusReqEnum } from '../enums/req.enum';
import { ReqMapperPagination } from '../mapper/req.mapper.pagination';
import { ReqPageDto } from '../paginations/req.page.dto';

export class ReqRepo extends AbstractRepositoryClass<
  ReqEnt,
  CreateReqDto,
  UpdateReqDto,
  ReqPageDto
> {
  constructor(
    @InjectRepository(ReqEnt)
    @InjectRepository(DepartmentRlEnt)
    @InjectRepository(ProjectEnt)
    @InjectRepository(DepartmentRlEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
  }

  async _createEntity(
    createDto: CreateReqDto,
    query: QueryRunner | undefined,
  ): Promise<ReqEnt> {
    createDto.projectEnt = await this.dataSource.manager.findOneOrFail(ProjectEnt, {
      where: {
        id: createDto.id_project,
      },
    });
    if (!createDto.projectEnt) {
      throw new Error(
        `${JSON.stringify({
          section: 'project',
          value: ProjectEnum.PROJECT_NOT_EXISTS,
        })}`,
      );
    }
    const reqEnt = new ReqEnt();
    reqEnt.status = createDto.status;
    reqEnt.name = createDto.name;
    reqEnt.description = createDto.description;
    reqEnt.project = createDto.projectEnt;
    let result: ReqEnt;
    if (query) {
      result = await query.manager.save(reqEnt);
    } else {
      result = await this.dataSource.manager.save(reqEnt);
    }

    if (createDto.id_departments.length == 0) {
      let departments = await this.dataSource.manager.find(DepartmentEnt, {});
      for (const department of departments) {
        const departmentRl = this.dataSource.manager.create(DepartmentRlEnt, {
          department,
          req: result,
        });
        if (query) {
          await query.manager.save(departmentRl);
        } else {
          await this.dataSource.manager.save(departmentRl);
        }
      }
    }
    for (const id_department of createDto.id_departments) {
      const department = await this.dataSource.manager.findOne(DepartmentEnt, {
        where: {
          id: id_department,
        },
      });

      const departmentRl = this.dataSource.manager.create(DepartmentRlEnt, {
        department,
        req: result,
      });
      if (query) {
        await query.manager.save(departmentRl);
      } else {
        await this.dataSource.manager.save(departmentRl);
      }
    }
    await query.commitTransaction();

    return result;
  }

  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<ReqEnt> {
    const req = await this.dataSource.manager.findOne(ReqEnt, {
      where: {
        id: searchDto,
      },
      relations: {
        project: true,
      },
    });
    if (!req)
      throw new Error(
        `${JSON.stringify({
          section: 'req',
          value: ReqEnum.REQ_NOT_EXISTS,
        })}`,
      );
    return req;
  }

  async _deleteEntity(entity: ReqEnt, query?: QueryRunner) {
    if (query) return await query.manager.softRemove(entity);
    return await this.dataSource.manager.softRemove(entity);
  }

  async _updateEntity(
    entity: ReqEnt,
    updateDto: UpdateReqDto,
    query?: QueryRunner,
  ): Promise<ReqEnt> {
    entity.status = updateDto.status;
    entity.name = updateDto.name;
    entity.description = updateDto.description;
    let result: ReqEnt;
    if (query) {
      result = await query.manager.save(entity);
    } else {
      result = await this.dataSource.manager.save(entity);
    }

    const notDeleted = [];
    const req = await this.dataSource.manager
      .createQueryBuilder(ReqEnt, 'req')
      .where('req.id = :req_id', {
        req_id: entity.id,
      })
      .leftJoinAndSelect('req.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.department', 'department')
      .select(['req.id', 'department_rls', 'department_rls.id', 'department'])
      .getMany();
    for (const department_rl of req[0].department_rls) {
      if (!updateDto.id_departments.includes(department_rl.department.id)) {
        const departmentRlEnt = await this.dataSource.manager
          .createQueryBuilder(DepartmentRlEnt, 'department_rl')
          .where('department_rl.id = :id_department_rl', {
            id_department_rl: department_rl.id,
          })
          .leftJoinAndSelect('department_rl.tasks', 'tasks')
          .getMany();
        if (departmentRlEnt[0].tasks) {
          notDeleted.push(departmentRlEnt);
        } else {
          const deleteDepartmentEl = await this.dataSource.manager.findOne(
            DepartmentRlEnt,
            {
              where: {
                id: department_rl.id,
              },
            },
          );
          deleteDepartmentEl.delete_at = new Date();
        }
      }
    }


    for (const id_department of updateDto.id_departments) {
      const department: any = await this.dataSource.manager.findOne(
        DepartmentEnt,
        {
          where: {
            id: id_department,
          },
        },
      );

      if (!req[0].department_rls.includes(department)) {
        const departmentRl = new DepartmentRlEnt();
        departmentRl.req = result;
        departmentRl.department = department;
      }
    }
    result['failed'] = notDeleted;
    return result;
  }

  async _paginationEntity(pageDto: ReqPageDto): Promise<PageDto<ReqEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(ReqEnt, 'req')
      .leftJoinAndSelect('req.project', 'project')
      .leftJoinAndSelect('req.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.department', 'department')
      .select([
        'req.id',
        'req.status',
        'req.name',
        'req.description',
        'req.isDefault',
        'project.id',
        'project.project_name',
        'department_rls.id',
        'department.id',
        'department.header_id',
        'department.name_department',
      ]);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.status) {
        queryBuilder.andWhere('req.status = :status', {
          status: pageDto.filter.status,
        });
      }
    }

    if (pageDto.field) {
      const mapper = ReqMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );

      queryBuilder.addOrderBy(
        `${ReqMapperPagination[pageDto.field]}`,
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

  async findAllReq(): Promise<ReqEnt[]> {
    return await this.dataSource.manager
      .createQueryBuilder(ReqEnt, 'req')
      .select(['req.id', 'req.status', 'req.name', 'req.description', 'req.isDefault',])
      .getMany();
  }

  async findAllReqWithIdProject(id_project: string): Promise<ReqEnt[]> {
    return await this.dataSource.manager
      .createQueryBuilder(ReqEnt, 'req')
      .where('req.project.id = :id_project', {
        id_project,
      })
      .select(['req.id', 'req.status', 'req.name', 'req.description', 'req.isDefault',])
      .getMany();
  }

  async findDefaultReq(): Promise<ReqEnt> {
    const req = await this.dataSource.manager.findOne(ReqEnt, {
      where: {
        isDefault: true,
      },
      relations: {
        project: true,
      },
    });
    if (!req)
      throw new Error(
        `${JSON.stringify({
          section: 'req',
          value: ReqEnum.REQ_NOT_EXISTS,
        })}`,
      );

    return req;
  }

  async getAllReqAndTask(
    id_req: string,
    pageDto: ReqPageDto,
  ): Promise<PageDto<ProjectEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(ProjectEnt, 'project')
      .where('project.id = :id', {
        id: id_req,
      })
      .leftJoinAndSelect('project.reqs', 'reqs')
      .leftJoinAndSelect('reqs.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.tasks', 'tasks')
      .select([
        'project.id',
        'reqs.id',
        'reqs.status',
        'reqs.name',
        'reqs.description',
        'reqs.isDefault',
        'department_rls.id',
        'tasks.id',
        'tasks.priority',
        'tasks.title',
        'tasks.head_id',
        'tasks.do_date',
        'tasks.remain_date',
        'tasks.type',
        'tasks.duration',
        'tasks.status',
        'tasks.check_status',
      ]);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    if (pageDto.filter) {
    }

    if (pageDto.field) {
      const mapper = ProjectMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );

      queryBuilder.addOrderBy(
        `${ProjectMapperPagination[pageDto.field]}`,
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

  async getAllDoneReq(doneReqDto: DoneReqDto): Promise<ReqEnt[]> {
    return await this.dataSource.manager
      .createQueryBuilder(ReqEnt, 'req')
      .where('req.status = :status', {
        status: StatusReqEnum.DONE,
      })
      .limit(doneReqDto.limit)
      .orderBy('req.create_at')
      .select(['req.id', 'req.status', 'req.name', 'req.description', 'req.isDefault',])
      .execute();
  }

  async allReqWithoutTask(id_user: string): Promise<UserEnt[]> {
    const result = await this.dataSource.manager
      .createQueryBuilder(UserEnt, 'user')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('department.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.tasks', 'tasks')
      .leftJoinAndSelect('department_rls.req', 'req')
      .where(
        'user.id = :id_user AND (tasks.status = :statusCancel OR tasks.status = :statusDone OR tasks.status = :statusPublish)',
        // and tasks.status = :statusPublish',
        {
          id_user,
          statusDone: StatusTaskEnum.DONE,
          statusCancel: StatusTaskEnum.CANCEL,
          statusPublish: StatusTaskEnum.PUBLISH,
        },
      )
      .select(['user.id', 'department.id', 'department_rls.id', 'req.id', 'req.status', 'req.name', 'req.description', 'req.isDefault'])
      .getMany();
    return result;
  }

  async allReqWithoutTaskAdmin(): Promise<UserEnt[]> {
    const result = await this.dataSource.manager
      .createQueryBuilder(UserEnt, 'user')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('department.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.tasks', 'tasks')
      .leftJoinAndSelect('department_rls.req', 'req')
      .where(
        '(tasks.status = :statusCancel OR tasks.status = :statusDone OR tasks.status = :statusPublish)',
        {
          statusDone: StatusTaskEnum.DONE,
          statusCancel: StatusTaskEnum.CANCEL,
          statusPublish: StatusTaskEnum.PUBLISH,
        },
      )
      .select(['user.id', 'department.id', 'department_rls.id', 'req.id', 'req.status', 'req.name', 'req.description', 'req.isDefault'])
      .getMany();
    return result;
  }

  async allReqBasedOnUserId(id_user: string): Promise<ReqEnt[]> {
    const result = await this.dataSource.manager
      .createQueryBuilder(ReqEnt, 'req')
      .leftJoinAndSelect('req.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.department', 'department')
      .where('department.header_id = :id_user', {
        id_user,
      })
      .select(['req.id', 'req.status', 'req.name', 'req.description', 'req.isDefault'])
      .getMany();
    return result;
  }

  async reqPaginationUser(pageDto: ReqPageDto, id_user: string): Promise<PageDto<DepartmentRlEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(DepartmentRlEnt, 'department_rl')
      .leftJoinAndSelect('department_rl.req', 'req')
      .leftJoinAndSelect('req.project', 'project')
      .leftJoinAndSelect('department_rl.department', 'department')
      .where('department.header_id = :id_user', {
        id_user,
      })
      .select([
        'department_rl.id',
        'req.id',
        'req.status',
        'req.name',
        'req.description',
        'req.isDefault',
        'project.id',
        'project.project_name',
        'department.id',
        'department.header_id',
        'department.name_department',
      ]);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.status) {
        queryBuilder.andWhere('req.status = :status', {
          status: pageDto.filter.status,
        });
      }
    }

    if (pageDto.field) {
      const mapper = ReqMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );

      queryBuilder.addOrderBy(
        `${ReqMapperPagination[pageDto.field]}`,
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
