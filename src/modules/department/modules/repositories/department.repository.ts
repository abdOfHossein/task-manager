import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DepartmentEnum } from 'src/common/translate/enums/department.enum';
import { DepartmentRlEnt } from 'src/modules/department-rl/modules/entities/department-rl.entity';
import { ReqEnt } from 'src/modules/req/modules/entities/req.entity';
import { StatusTaskEnum } from 'src/modules/task/modules/enums/status-task.enum';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateDepartmentDto } from '../dtos/create.department.dto';
import { UpdateDepartmentDto } from '../dtos/update.department.dto';
import { DepartmentEnt } from '../entities/department.entity';
import { DepartmentMapperPagination } from '../mapper/department.mapper.pagination';
import { DepartmentPageDto } from '../paginations/department.page.dto';

export class DepartmentRepo extends AbstractRepositoryClass<
  DepartmentEnt,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentPageDto
> {
  constructor(
    @InjectRepository(DepartmentEnt)
    @InjectRepository(DepartmentRlEnt)
    @InjectRepository(ReqEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
  }


  async _createEntity(
    createDto: CreateDepartmentDto,
    query: QueryRunner | undefined,
  ): Promise<DepartmentEnt> {
    const departmentEnt = new DepartmentEnt();
    departmentEnt.header_id = createDto.header_id;
    departmentEnt.name_department = createDto.name_department;
    let result: DepartmentEnt;
    if (query) {

      result = await query.manager.save(departmentEnt);
    } else {
      result = await this.dataSource.manager.save(departmentEnt);
    }

    const reqs = await this.dataSource.manager.find(ReqEnt, {});
    for (const req of reqs) {
      const departmentRl = this.dataSource.manager.create(DepartmentRlEnt, {
        req,
        department: result,
      });
      if (query) await query.manager.save(departmentEnt);
      else await this.dataSource.manager.save(departmentRl);
    }
    await query.commitTransaction();
    return result;
  }

  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<DepartmentEnt> {
    const department = await this.dataSource.manager.findOne(DepartmentEnt, {
      where: { id: searchDto },
    });
    if (!department) {
      throw new Error(
        `${JSON.stringify({
          section: 'department',
          value: DepartmentEnum.DEPARTMENT_NOT_EXISTS,
        })}`,
      );
    }
    return department;
  }

  async _updateEntity(
    entity: DepartmentEnt,
    updateDto: UpdateDepartmentDto,
    query?: QueryRunner,
  ): Promise<DepartmentEnt> {
    entity.header_id = updateDto.header_id;
    entity.name_department = updateDto.name_department;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async _deleteEntity(entity: DepartmentEnt, query?: QueryRunner) {
    if (query) return await query.manager.softRemove(entity);
    return await this.dataSource.manager.softRemove(entity);
  }

  async _paginationEntity(
    pageDto: DepartmentPageDto,
  ): Promise<PageDto<DepartmentEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .loadRelationCountAndMap('department.usersCount', 'department.users')
      .select(['department.id', 'department.header_id', 'department.name_department'])

    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    if (pageDto.filter) {
      if (pageDto.filter.header_id) {
        queryBuilder.andWhere('department.header_id LIKE :header_id', {
          header_id: `%${pageDto.filter.header_id}%`,
        });
      }
    }
    if (pageDto.field) {
      const mapper = DepartmentMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${DepartmentMapperPagination[pageDto.field]}`,
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

  async getDepartmentUsers(id_department: string) {
    return await this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .innerJoinAndSelect('department.users', 'users')
      .where('department.id = :id_department', {
        id_department,
      })
      .select(['department.id', 'department.header_id', 'department.name_department', 'users.id'
        , 'users.first_name', 'users.last_name', 'users.username', 'users.email'
        , 'users.phonenumber', 'users.status'])
      .getMany();
  }




  async getAllDepartment() {
    return await this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .select(['department.id', 'department.header_id', 'department.name_department'])
      .getMany();
  }

  async allReqOfDepartment(id_user: string): Promise<DepartmentEnt[]> {
    const result = await this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .leftJoin('department.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.req', 'req')
      .where('department.header_id = :id_user', {
        id_user,
      })
      .select(['department.id', 'department.header_id', 'department.name_department', 'department_rls.id', 'req.id', 'req.status', 'req.name', 'req.description', 'req.isDefault'])
      .getMany();
    return result;
  }

  async allTaskOfDepartment(id_user: string): Promise<DepartmentEnt[]> {
    const result = await this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .where('department.header_id = :id_user', {
        id_user,
      })
      .leftJoinAndSelect('department.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.tasks', 'tasks')
      .select([
        'department.id',
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
      ])
      .getMany();
    return result;
  }

  async allUsersOfDepartment(id_user: string): Promise<UserEnt[]> {
    const result = await this.dataSource.manager
      .createQueryBuilder(UserEnt, 'user')
      .leftJoinAndSelect('user.department', 'department')
      .where('department.header_id = :id_user', {
        id_user,
      })
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.username',
        'user.phonenumber',
        'user.email',
        'user.status',
      ])
      .getMany();
    return result;
  }

  async allTaskOfUser(
    id_header: string,
    id_user: string,
  ): Promise<DepartmentEnt[]> {
    const result = await this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .where('department.header_id = :id_header', {
        id_header,
      })
      .leftJoinAndSelect('department.users', 'users')
      .where('users.id = :id_user', { id_user })
      .leftJoinAndSelect('users.task', 'task')
      .select([
        'department.id',
        'users.id',
        'task.id',
        'task.priority',
        'task.title',
        'task.head_id',
        'task.do_date',
        'task.remain_date',
        'task.type',
        'task.duration',
        'task.status',
      ])
      .getMany();
    return result;
  }

  async allReqWithoutTaskOfDepartment(
    id_user: string,
  ): Promise<DepartmentEnt[]> {
    const result = await this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .innerJoinAndSelect('department.department_rls', 'department_rls')
      .where('department.header_id = :id_user', {
        id_user,
      })
      .leftJoinAndSelect('department_rls.req', 'req')
      .leftJoinAndSelect('department_rls.tasks', 'tasks')

      .where(
        'tasks = :task OR (tasks.status = :statusC OR tasks.status = :statusP OR tasks.status = :statusD) ',
        {
          task: null,
          statusC: StatusTaskEnum.CANCEL,
          statusD: StatusTaskEnum.DONE,
          statusP: StatusTaskEnum.PUBLISH,
        },
      )
      .select([
        'department.id',
        'department_rls.id',
        'req.id',
        'req.status',
        'req.name',
        'req.description',
        'req.isDefault',
      ])
      .getMany();
    return result;
  }

  async allDepartmentOfUser(id_user: string) {
    return await this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .where('department.header_id = :id_user', { id_user })
      .select([
        'department.id',
        'department.header_id',
        'department.name_department',
      ])
      .getMany();
  }

  async deleteDepartmen(id_department: string) {
    const department = await this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .leftJoinAndSelect('department.users', 'users')
      .where('department.id = :id_department', { id_department })
      .getOne();
    if (department.users) {
      throw new Error(
        `${JSON.stringify({
          section: 'department',
          value: DepartmentEnum.DEPARTMENT_HAS_USER,
        })}`,
      );
    }
    department.delete_at = new Date();
    department.name_department = 'deleted' + '_' + department.name_department;
    return await this.dataSource.manager.save(department);
  }
}
