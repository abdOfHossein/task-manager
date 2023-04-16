import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { FileEnum } from 'src/common/translate/enums/file.enum';
import { ProjectEnum } from 'src/common/translate/enums/project.enum';
import { FileEnt } from 'src/modules/file/modules/entities/file.entity';
import { TypeFileEnum } from 'src/modules/file/modules/enums/type.file.enum';
import { ReqEnt } from 'src/modules/req/modules/entities/req.entity';
import { StatusReqEnum } from 'src/modules/req/modules/enums/req.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateProjectDto } from '../dtos/create.project.dto';
import { UpdateProjectDto } from '../dtos/update.project.dto';
import { ProjectEnt } from '../entities/project.entity';
import { ProjectMapperPagination } from '../mapper/project.mapper.pagination';
import { ProjectPageDto } from '../paginations/project.page.dto';

export class ProjectRepo extends AbstractRepositoryClass<
  ProjectEnt,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectPageDto
> {

  constructor(
    @InjectRepository(ProjectEnt)
    @InjectRepository(ReqEnt)
    @InjectRepository(FileEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
  }

  async _createEntity(
    createDto: CreateProjectDto,
    query: QueryRunner | undefined,
  ): Promise<ProjectEnt> {
    const req = this.dataSource.manager.create(ReqEnt, {
      status: StatusReqEnum.OPEN,
      isDefault: true,
      name: 'default',
      description: 'default'
    });
    await this.dataSource.manager.save(req);
    const projectEnt = new ProjectEnt();
    projectEnt.project_name = createDto.project_name;
    projectEnt.reqs = [req];
    projectEnt.file = createDto.file;
    if (query) return await query.manager.save(projectEnt);
    return await this.dataSource.manager.save(projectEnt);
  }

  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<ProjectEnt> {
    const project = await this.dataSource.manager.findOne(ProjectEnt, {
      where: { id: searchDto },
    });
    if (!project)
      throw new Error(
        `${JSON.stringify({
          section: 'project',
          value: ProjectEnum.PROJECT_NOT_EXISTS
        })}`,
      );
    return project;
  }

  async _updateEntity(
    entity: ProjectEnt,
    updateDto: UpdateProjectDto,
    query?: QueryRunner,
  ): Promise<ProjectEnt> {
    if (updateDto.unq_file) {
      const file = await this.dataSource.manager.findOne(FileEnt, {
        where: { unq_file: updateDto.unq_file }
      });
      
      if (!file || file.type_file != TypeFileEnum.PROJECT)
        throw new Error(`${JSON.stringify({
          section: 'file',
          value: FileEnum.FILE_NOT_EXISTS
        })}`)
      entity.file = file;;
    }
    entity.project_name = updateDto.project_name;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async _paginationEntity(
    pageDto: ProjectPageDto,
  ): Promise<PageDto<ProjectEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(ProjectEnt, 'project')
      .leftJoin('project.reqs', 'req')
      .leftJoin('req.department_rls', 'department_rls')
      .leftJoin('department_rls.tasks', 'tasks')
      .select(['project.id as id', 'project_name'])
      .addSelect('COUNT(DISTINCT(req.id))', 'req')
      .addSelect('COUNT(DISTINCT(tasks.id))', 'tasks')
      .groupBy('project.id');
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    if (pageDto.filter) {
      if (pageDto.filter.project_name)
        queryBuilder.andWhere('project.project_name LIKE :project_name', {
          project_name: `%${pageDto.filter.project_name}%`,
        });
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
    // queryBuilder..map(() => {
    //   return item
    // })

    const result = await queryBuilder.getRawMany();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result.length,
    });
    return new PageDto(result, pageMetaDto);
  }

  async allProjectWithIdUSer(
    id_user: string,
    options?: FindOneOptions,
  ): Promise<ProjectEnt[]> {
    return await this.dataSource.manager
      .createQueryBuilder(ProjectEnt, 'project')
      .leftJoinAndSelect('project.reqs', 'reqs')
      .leftJoinAndSelect('reqs.department_rls', 'department_rls')
      .leftJoinAndSelect('department_rls.department', 'department')
      .leftJoinAndSelect('department.users', 'users')
      .where('users.id = :id_user', { id_user })
      .select(['project.id', 'project.project_name'])
      .getMany();
  }

  async allProjectWithReq(): Promise<ProjectEnt[]> {
    const project = await this.dataSource.manager.query(
      `select id,project_name, (select count(r) from task."Req" r where r."projectId"= p.id and r.status = 'DONE') as done, (select count(r) from task."Req" r where r."projectId"= p.id) as total from task."Project" p where p.delete_at IS NULL`,
    )
    return project;
  }

  async getAllProject() {
    return await this.dataSource.manager
      .createQueryBuilder(ProjectEnt, 'project')
      .select(['project.id', 'project.project_name'])
      .getMany();
  }

  async _deleteEntity(entity: ProjectEnt, query?: QueryRunner) {
    if (query) return await query.manager.softRemove(entity);
    return await this.dataSource.manager.softRemove(entity);
  }
}
